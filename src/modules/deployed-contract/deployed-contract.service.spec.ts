import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Connection, Model } from 'mongoose';
import { BadRequest, NotFound } from '../../helpers/response/errors';
import {
  mockContractTemplates,
  mockCreateDeployedContractDtos,
  mockProjects,
  mockUser,
} from '../../../test/mock-tests-data';
import { Contract, ContractSchema } from '../contract/entities/contract.entity';
import { Project, ProjectSchema } from '../project/entities/project.entity';
import { User, UserSchema } from '../user/entities/user.entity';
import { DeployedContractService } from './deployed-contract.service';
import {
  DeployedContract,
  DeployedContractSchema,
} from './entities/deployed-contract.entity';
import { DeployedContractStatus } from '../../common/enums/deployed-contract-status.enum';

describe('DeployedContractService', () => {
  let deployedContractService: DeployedContractService;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let projectModel: Model<Project>;
  let userModel: Model<User>;
  let contractTemplateModel: Model<Contract>;
  let deployedContractModel: Model<DeployedContract>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    projectModel = mongoConnection.model(Project.name, ProjectSchema);
    userModel = mongoConnection.model(User.name, UserSchema);
    contractTemplateModel = mongoConnection.model(
      Contract.name,
      ContractSchema,
    );
    deployedContractModel = mongoConnection.model(
      DeployedContract.name,
      DeployedContractSchema,
    );
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeployedContractService,
        { provide: getModelToken(Project.name), useValue: projectModel },
        { provide: getModelToken(User.name), useValue: userModel },
        {
          provide: getModelToken(Contract.name),
          useValue: contractTemplateModel,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'NODE_ENV') {
                return 'dev';
              }
              return null;
            }),
          },
        },
        {
          provide: getModelToken(DeployedContract.name),
          useValue: deployedContractModel,
        },
      ],
    }).compile();

    deployedContractService = module.get<DeployedContractService>(
      DeployedContractService,
    );
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongod.stop();
  });

  afterEach(async () => {
    const collections = mongoConnection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  it('Create - should return the saved object', async () => {
    await new userModel(mockUser).save();
    await new projectModel(mockProjects[0]).save();
    await new contractTemplateModel(mockContractTemplates[0]).save();

    const createdDeployedContract = await deployedContractService.create(
      mockCreateDeployedContractDtos[0],
    );

    expect(createdDeployedContract.data.alias).toBe(
      mockCreateDeployedContractDtos[0].alias,
    );
  });

  it(`Create - should return Alias can't be empty (Bad Request - 400) exception`, async () => {
    await new userModel(mockUser).save();
    await new projectModel(mockProjects[0]).save();
    await new contractTemplateModel(mockContractTemplates[0]).save();
    const dto: any = { ...mockCreateDeployedContractDtos[0] };
    delete dto.alias;
    const response = await deployedContractService.create(dto);
    expect(response).toStrictEqual(
      new BadRequest<DeployedContract>(`Alias can't be empty`),
    );
  });

  it(`Create - should return Contract uuid can't be empty (Bad Request - 400) exception`, async () => {
    await new userModel(mockUser).save();
    await new projectModel(mockProjects[0]).save();
    await new contractTemplateModel(mockContractTemplates[0]).save();
    const dto: any = { ...mockCreateDeployedContractDtos[0] };
    delete dto.contract_template_id;
    const response = await deployedContractService.create(dto);
    expect(response).toStrictEqual(
      new BadRequest<DeployedContract>(`Contract uuid can't be empty`),
    );
  });

  it(`Create - should return Contract template not found (Bad Request - 400) exception`, async () => {
    await new userModel(mockUser).save();
    await new projectModel(mockProjects[0]).save();
    await new contractTemplateModel(mockContractTemplates[0]).save();
    const dto: any = { ...mockCreateDeployedContractDtos[0] };
    dto.contract_template_id = '123';
    const response = await deployedContractService.create(dto);
    expect(response).toStrictEqual(
      new NotFound<DeployedContract>(`Contract template not found`),
    );
  });

  it(`Create - should return Args can't be empty (Bad Request - 400) exception`, async () => {
    await new userModel(mockUser).save();
    await new projectModel(mockProjects[0]).save();
    await new contractTemplateModel(mockContractTemplates[0]).save();
    const dto: any = { ...mockCreateDeployedContractDtos[0] };
    delete dto.args;
    const response = await deployedContractService.create(dto);
    expect(response).toStrictEqual(
      new BadRequest<DeployedContract>(`Args can't be empty`),
    );
  });

  it(`Create - should return Project id can't be empty (Bad Request - 400) exception`, async () => {
    await new userModel(mockUser).save();
    await new projectModel(mockProjects[0]).save();
    await new contractTemplateModel(mockContractTemplates[0]).save();
    const dto: any = { ...mockCreateDeployedContractDtos[0] };
    delete dto.project_id;
    const response = await deployedContractService.create(dto);
    expect(response).toStrictEqual(
      new BadRequest<DeployedContract>(`Project id can't be empty`),
    );
  });

  it(`Create - should return Project not found (Not found - 404) exception`, async () => {
    await new userModel(mockUser).save();
    await new projectModel(mockProjects[0]).save();
    await new contractTemplateModel(mockContractTemplates[0]).save();
    const dto: any = { ...mockCreateDeployedContractDtos[0] };
    dto.project_id = '123';
    const response = await deployedContractService.create(dto);
    expect(response).toStrictEqual(
      new NotFound<DeployedContract>(`Project not found`),
    );
  });

  it(`Create - should return Project not found (Not found - 404) exception`, async () => {
    await new userModel(mockUser).save();
    await new projectModel(mockProjects[0]).save();
    await new contractTemplateModel(mockContractTemplates[0]).save();
    const dto: any = { ...mockCreateDeployedContractDtos[0] };
    dto.project_id = '783fa1f4bb85ec3265b2ef5d';
    const response = await deployedContractService.create(dto);
    expect(response).toStrictEqual(
      new NotFound<DeployedContract>(`Project not found`),
    );
  });

  it(`Create - should return Contract template not found (Not found - 404) exception`, async () => {
    await new userModel(mockUser).save();
    await new projectModel(mockProjects[0]).save();
    await new contractTemplateModel(mockContractTemplates[0]).save();
    const dto: any = { ...mockCreateDeployedContractDtos[0] };
    dto.contract_template_id = '783fa1f4bb85ec3265b2ef5d';
    const response = await deployedContractService.create(dto);
    expect(response).toStrictEqual(
      new NotFound<DeployedContract>(`Contract template not found`),
    );
  });

  it(`Create - should return Contract template not found (Not found - 404) exception`, async () => {
    await new userModel(mockUser).save();
    await new projectModel(mockProjects[0]).save();
    await new contractTemplateModel(mockContractTemplates[0]).save();
    await deployedContractService.create(mockCreateDeployedContractDtos[0]);
    const response = await deployedContractService.create(
      mockCreateDeployedContractDtos[0],
    );
    expect(response).toStrictEqual(
      new BadRequest<DeployedContract>(
        `Alias ${mockCreateDeployedContractDtos[0].alias} isn't unique`,
      ),
    );
  });

  it(`FindAll - should findAll`, async () => {
    await new userModel(mockUser).save();
    await new projectModel(mockProjects[0]).save();
    await new contractTemplateModel(mockContractTemplates[0]).save();
    await deployedContractService.create(mockCreateDeployedContractDtos[0]);
    await deployedContractService.create(mockCreateDeployedContractDtos[1]);
    const result = await deployedContractService.findAll(mockUser._id);
    expect(result.data.results).toHaveLength(2);
    expect(result.data.count).toBe(2);
  });

  it(`FindAll - should findAll by project id`, async () => {
    await new userModel(mockUser).save();
    await new projectModel(mockProjects[0]).save();
    await new contractTemplateModel(mockContractTemplates[0]).save();
    await new contractTemplateModel(mockContractTemplates[1]).save();
    await deployedContractService.create(mockCreateDeployedContractDtos[0]);
    await deployedContractService.create(mockCreateDeployedContractDtos[1]);

    const result = await deployedContractService.findAll(
      mockUser._id,
      null, //   offset:
      null, //   limit: null,
      mockCreateDeployedContractDtos[0].project_id, //   project_id: null,
      null, //   alias: null,
      null, //   contract_template_id: null,
      null, //   status: null,
      null, //   tags: null,
    );

    expect(result.data.results).toHaveLength(2);
    expect(result.data.count).toBe(2);
  });

  it(`FindAll - should findAll by alias`, async () => {
    await new userModel(mockUser).save();
    await new projectModel(mockProjects[0]).save();
    await new contractTemplateModel(mockContractTemplates[0]).save();
    await new contractTemplateModel(mockContractTemplates[1]).save();
    await deployedContractService.create(mockCreateDeployedContractDtos[0]);
    await deployedContractService.create(mockCreateDeployedContractDtos[1]);

    const result = await deployedContractService.findAll(
      mockUser._id,
      null, //   offset:
      null, //   limit: null,
      null, //   project_id: null,
      'erc20', //   alias: null,
      null, //   contract_template_id: null,
      null, //   status: null,
      null, //   tags: null,
    );

    expect(result.data.results).toHaveLength(2);
    expect(result.data.count).toBe(2);
  });

  it(`FindAll - should findAll by contract_template_id`, async () => {
    await new userModel(mockUser).save();
    await new projectModel(mockProjects[0]).save();
    await new contractTemplateModel(mockContractTemplates[0]).save();
    await new contractTemplateModel(mockContractTemplates[1]).save();
    await deployedContractService.create(mockCreateDeployedContractDtos[0]);
    await deployedContractService.create(mockCreateDeployedContractDtos[1]);

    const result = await deployedContractService.findAll(
      mockUser._id,
      null, //   offset:
      null, //   limit: null,
      null, //   project_id: null,
      null, //   alias: null,
      mockCreateDeployedContractDtos[0].contract_template_id, //   contract_template_id: null,
      null, //   status: null,
      null, //   tags: null,
    );

    expect(result.data.results).toHaveLength(2);
    expect(result.data.count).toBe(2);
  });

  it(`FindAll - should findAll by status`, async () => {
    await new userModel(mockUser).save();
    await new projectModel(mockProjects[0]).save();
    await new contractTemplateModel(mockContractTemplates[0]).save();
    await new contractTemplateModel(mockContractTemplates[1]).save();
    await deployedContractService.create(mockCreateDeployedContractDtos[0]);
    await deployedContractService.create(mockCreateDeployedContractDtos[1]);

    const result = await deployedContractService.findAll(
      mockUser._id,
      null, //   offset:
      null, //   limit: null,
      null, //   project_id: null,
      null, //   alias: null,
      null, //   contract_template_id: null,
      DeployedContractStatus.Pending, //   status: null,
      null, //   tags: null,
    );

    expect(result.data.results).toHaveLength(2);
    expect(result.data.count).toBe(2);
  });

  it(`FindAll - should findAll tags`, async () => {
    await new userModel(mockUser).save();
    await new projectModel(mockProjects[0]).save();
    await new contractTemplateModel(mockContractTemplates[0]).save();
    await new contractTemplateModel(mockContractTemplates[1]).save();
    await deployedContractService.create(mockCreateDeployedContractDtos[0]);
    await deployedContractService.create(mockCreateDeployedContractDtos[1]);
    await deployedContractService.create(mockCreateDeployedContractDtos[2]);

    const result = await deployedContractService.findAll(
      mockUser._id,
      null, //   offset:
      null, //   limit: null,
      null, //   project_id: null,
      null, //   alias: null,
      null, //   contract_template_id: null,
      null, //   status: null,
      ['tokens', 'nft'], //   tags: null,
    );

    expect(result.data.results).toHaveLength(3);
    expect(result.data.count).toBe(3);
  });
});
