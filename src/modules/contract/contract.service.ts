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
import {
  fetchApi,
  fetchRepo,
  githubApi,
  infoFileName,
  manifestFileName,
} from './constants';
import { GithubRepoDto } from './dto/github-repo.dto';
import { mapRepoToContractDto } from './mappers/map-repo-to-contract-dto';
import { ManifestInfoDto } from './dto/manifest-info.dto';
dotenv.config();

const { GITHUB_TOKEN } = process.env;

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
      const data = await fetchRepo(GITHUB_TOKEN);
      const contracts = await this.getContracts(data);
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

  async getContracts(data: GithubRepoDto): Promise<ContractDto[]> {
    try {
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
                        const manifestInfo = await this.getManifestInfo(
                          treeEntry.name,
                          entry.name,
                          subEntry.name,
                        );

                        const info_markdown_url = await this.getDownloadUrl(
                          treeEntry.name,
                          entry.name,
                          subEntry.name,
                          infoFileName,
                        );
                        const contract = mapRepoToContractDto(
                          manifestInfo,
                          entry.name,
                          info_markdown_url,
                        );
                        contracts.push(contract);
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      return contracts;
    } catch (error) {
      this.logger.error('ContractService - getContracts', error);
    }
  }

  async getManifestInfo(
    root: string,
    contractOwner: string,
    contractType: string,
  ): Promise<ManifestInfoDto> {
    const url = await this.getDownloadUrl(
      root,
      contractOwner,
      contractType,
      manifestFileName,
    );
    const manifestJsonResp = await fetchApi(GITHUB_TOKEN, url);
    const json = await manifestJsonResp.json();
    return json as ManifestInfoDto;
  }

  async getDownloadUrl(
    root: string,
    contractOwner: string,
    contractType: string,
    fileName: string,
  ): Promise<string> {
    const tokenInfoResp = await fetchApi(
      GITHUB_TOKEN,
      `${githubApi}/${root} /${contractOwner}/$${contractType}/${fileName}`,
    );
    const tokenInfoResult = await tokenInfoResp.json();
    const { download_url } = tokenInfoResult;
    return download_url;
  }
}
