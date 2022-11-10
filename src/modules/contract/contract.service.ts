import { Injectable, Logger } from '@nestjs/common';
import { PaginatedDto } from '../../common/pagination/paginated-dto';
import { ServiceResult } from '../../helpers/response/result';
import { ServerError } from '../../helpers/response/errors';
import { ContractDto } from './dto/contract.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Contract, ContractDocument } from './entities/contract.entity';
import { Model } from 'mongoose';
import { mapDtoToContract } from './mappers/map-dto-to-contract';
import { toPage } from '../../helpers/pagination/pagination-helper';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class ContractService {
  private readonly logger = new Logger(ContractService.name);

  constructor(
    @InjectModel(Contract.name) private repo: Model<ContractDocument>,
  ) {}

  async findAll(
    offset?: number,
    limit?: number,
    name?: string,
    isAudited?: boolean,
  ): Promise<ServiceResult<PaginatedDto<ContractDto>>> {
    try {
      const query = this.repo.find();
      const queryCount = this.repo.find().countDocuments();

      if (name) {
        query.find({ name: { $regex: name, $options: 'i' } });
      }

      if (isAudited) {
        query.find({ is_audited: isAudited });
      }

      const paginatedDto = await toPage<ContractDto>(
        query,
        queryCount,
        offset,
        limit,
      );

      return new ServiceResult<PaginatedDto<ContractDto>>(paginatedDto);
    } catch (error) {
      this.logger.error('ContractService - findAll', error);
      return new ServerError<PaginatedDto<ContractDto>>(`Can't get contracts`);
    }
  }

  async saveContracts(): Promise<void> {
    try {
      const jsonDate = new Date().toJSON();
      const owner = '4-point-0';
      const repoName = 'dev3-contracts';
      const manifestFileName = 'manifest.json';
      const infoFileName = 'info.md';
      const githubGraphQlApi = 'https://api.github.com/graphql';
      const githubApi = `https://api.github.com/repos/${owner}/${repoName}/contents`;
      const githubRepoUrl = `https://github.com/${owner}/${repoName}/tree/main/`;
      const query = `
      query{
        repository(owner: "${owner}", name: "${repoName}") {
          defaultBranchRef {
            target {
              ... on Commit {
                history(first: 1 until: "${jsonDate}") {
                  nodes {
                    tree {
                      entries {
                        name
                        object {
                          ... on Tree {
                            entries {
                              name
                              object{
                                ...on Tree{
                                  entries{
                                    name
                                    object{
                                      ...on Tree{
                                        entries{
                                          name
                                        }                                  
                                      }
                                    }
                                  }   
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      `;

      const response = await fetch(githubGraphQlApi, {
        method: 'POST',
        body: JSON.stringify({ query }),
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        },
      });

      const { data } = await response.json();
      const contracts: ContractDto[] = [];
      for (const node of data.repository.defaultBranchRef.target.history
        .nodes) {
        for (const treeEntry of node.tree.entries) {
          if (treeEntry.object && treeEntry.object.entries) {
            for (const entry of treeEntry.object.entries) {
              if (entry.object && entry.object.entries) {
                for (const subEntry of entry.object.entries) {
                  if (subEntry.object && subEntry.object.entries) {
                    for (const subSubEntry of subEntry.object.entries) {
                      if (treeEntry.name && entry.name && subSubEntry.name) {
                        const tokenInfoResp = await fetch(
                          `${githubApi}/${treeEntry.name}/${entry.name}/${subEntry.name}/${manifestFileName}`,
                          {
                            method: 'GET',
                            headers: {
                              Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                            },
                          },
                        );

                        const tokenInfoResult = await tokenInfoResp.json();

                        const { download_url } = tokenInfoResult;

                        const manifestJsonResp = await fetch(download_url, {
                          method: 'GET',
                          headers: {
                            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                          },
                        });

                        const manifestJsonResult =
                          await manifestJsonResp.json();

                        const markdownInfoResp = await fetch(
                          `${githubApi}/${treeEntry.name}/${entry.name}/${subEntry.name}/${infoFileName}`,
                          {
                            method: 'GET',
                            headers: {
                              Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                            },
                          },
                        );

                        const markdownInfoResult =
                          await markdownInfoResp.json();
                        contracts.push({
                          name: manifestJsonResult.name,
                          description: manifestJsonResult.description,
                          tags: manifestJsonResult.tags,
                          creator_name: entry.name,
                          github_url: `${githubRepoUrl}/tree/main/${tokenInfoResult.path}`,
                          info_markdown_url: markdownInfoResult.download_url,
                          is_audited: false,
                        });
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }

      for (let index = 0; index < contracts.length; index++) {
        const dto = contracts[index];
        const contractDb = await this.repo.findOne({ name: dto.name }).exec();

        if (contractDb) {
          const entity = mapDtoToContract(contractDb, dto);
          await this.repo.updateOne({ _id: contractDb._id }, entity);
        } else {
          await new this.repo(dto).save();
        }
      }
    } catch (error) {
      this.logger.error('ContractService - saveContracts', error);
    }
  }
}
