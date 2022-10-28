import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import {
  mockCreateProjectDtos,
  mockProjects,
  mockUser,
} from '../../test/mock-tests-data';
import { ProjectService } from './project.service';
import { Project, ProjectSchema } from './entities/project.entity';
import { User, UserSchema } from '../user/entities/user.entity';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Connection, Model } from 'mongoose';
import { BadRequest, NotFound, Unauthorized } from '../helpers/response/errors';
import Mongoose from 'mongoose';

describe('ProjectService', () => {
  let projectService: ProjectService;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let projectModel: Model<Project>;
  let userModel: Model<User>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    projectModel = mongoConnection.model(Project.name, ProjectSchema);
    userModel = mongoConnection.model(User.name, UserSchema);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectService,
        { provide: getModelToken(Project.name), useValue: projectModel },
        { provide: getModelToken(User.name), useValue: userModel },
      ],
    }).compile();

    projectService = module.get<ProjectService>(ProjectService);
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
    const createdAddress = await projectService.create(
      mockCreateProjectDtos[0],
    );
    expect(createdAddress.data.name).toBe(mockCreateProjectDtos[0].name);
  });

  it(`Create - should return Name can't be empty (Bad Request - 400) exception`, async () => {
    const dto = { ...mockCreateProjectDtos[0] };
    delete dto.name;
    const response = await projectService.create(dto);
    expect(response).toStrictEqual(
      new BadRequest<Project>(`Name can't be empty`),
    );
  });

  it(`Create - should return Name isn't unique (Bad Request - 400) exception`, async () => {
    await new projectModel(mockCreateProjectDtos[0]).save();
    const response = await projectService.create(mockCreateProjectDtos[0]);
    expect(response).toStrictEqual(
      new BadRequest<Project>(
        `Name ${mockCreateProjectDtos[0].name} isn't unique`,
      ),
    );
  });

  it(`FindAll - should findAll`, async () => {
    await new userModel(mockUser).save();
    await new projectModel(mockCreateProjectDtos[0]).save();
    await new projectModel(mockCreateProjectDtos[1]).save();
    const result = await projectService.findAll(mockUser._id);
    expect(result.data.results).toHaveLength(2);
  });

  it(`FindAll - should findAll with total count`, async () => {
    await new projectModel(mockCreateProjectDtos[0]).save();
    await new projectModel(mockCreateProjectDtos[1]).save();
    const result = await projectService.findAll(mockUser._id);
    expect(result.data.total).toEqual(2);
  });

  it(`FindAll - should findAll with total count, limit, offset`, async () => {
    await new projectModel(mockCreateProjectDtos[0]).save();
    await new projectModel(mockCreateProjectDtos[1]).save();
    await new projectModel(mockCreateProjectDtos[2]).save();
    await new projectModel(mockCreateProjectDtos[3]).save();
    const limit = 2;
    const offset = 2;
    const result = await projectService.findAll(mockUser._id, offset, limit);
    expect(result.data.total).toEqual(4);
    expect(result.data.offset).toEqual(offset);
    expect(result.data.limit).toEqual(limit);
    expect(result.data.results).toHaveLength(limit);
  });

  it(`FindAll - should findAll with total count, limit, offset, filter by name, slug`, async () => {
    await new projectModel(mockCreateProjectDtos[0]).save();
    await new projectModel(mockCreateProjectDtos[1]).save();
    await new projectModel(mockCreateProjectDtos[2]).save();
    await new projectModel(mockCreateProjectDtos[3]).save();
    const limit = 2;
    const offset = 0;
    const name = 'project';
    const slug = 'slug';
    const result = await projectService.findAll(
      mockUser._id,
      offset,
      limit,
      name,
      slug,
    );
    expect(result.data.total).toEqual(4);
    expect(result.data.offset).toEqual(offset);
    expect(result.data.limit).toEqual(limit);
    expect(result.data.results.length).toEqual(limit);
    expect(result.data.results[0].name).toMatch(mockCreateProjectDtos[1].name);
    expect(result.data.results[0].slug.includes(slug)).toBeTruthy();
    expect(result.data.results[1].name).toMatch(mockCreateProjectDtos[2].name);
    expect(result.data.results[1].slug.includes(slug)).toBeTruthy();
  });

  it(`FindOne - should findOne`, async () => {
    await new userModel(mockUser).save();

    const createResult = await new projectModel(
      mockCreateProjectDtos[0],
    ).save();

    const result = await projectService.findOne(
      createResult._id.toString(),
      mockUser._id.toString(),
    );

    expect(result.data.name).toBe(mockCreateProjectDtos[0].name);
  });

  it(`FindOne - should return Project not found (Not Found - 404) exception`, async () => {
    const user = await new userModel(mockUser).save();
    await new projectModel(mockProjects[0]).save();
    const response = await projectService.findOne('12', user._id.toString());
    expect(response).toStrictEqual(new NotFound<Project>('Project not found'));
  });

  it(`FindOne - should return Project not found (Not Found - 404) exception`, async () => {
    const user = await new userModel(mockUser).save();
    await new projectModel(mockProjects[0]).save();
    const response = await projectService.findOne(
      '634ff1e4bb81ed5475a1ff6d',
      user._id.toString(),
    );
    expect(response).toStrictEqual(new NotFound<Project>('Project not found'));
  });

  it(`FindBySlug - should findBySlug`, async () => {
    const user = await new userModel(mockUser).save();
    const createResult = await new projectModel(mockProjects[0]).save();
    const result = await projectService.findBySlug(
      createResult.slug,
      user._id.toString(),
    );
    expect(result.data.slug).toBe(createResult.slug);
  });

  it(`FindBySlug - should return Project not found (Not Found - 404) exception`, async () => {
    const user = await new userModel(mockUser).save();
    await new projectModel(mockProjects[0]).save();
    const response = await projectService.findBySlug('12', user._id.toString());
    expect(response).toStrictEqual(new NotFound<Project>('Project not found'));
  });

  it(`Update - should update`, async () => {
    const userResult = await new userModel(mockUser).save();
    const createResult = await new projectModel(mockProjects[0]).save();
    const name = 'changed-name';
    const slug = 'koui';
    const result = await projectService.update(
      createResult._id.toString(),
      userResult._id.toString(),
      { name: name, slug: slug },
    );
    expect(result.data.name).toBe(name);
    expect(result.data.slug).toMatch(slug);
  });

  it(`Update - should return Project not found (Not Found - 404) exception`, async () => {
    const userResult = await new userModel(mockUser).save();
    await new projectModel(mockProjects[0]).save();
    const name = 'changed-name';
    const slug = 'koui';
    const response = await projectService.update(
      '12',
      userResult._id.toString(),
      {
        name: name,
        slug: slug,
      },
    );
    expect(response).toStrictEqual(new NotFound<Project>('Project not found'));
  });

  it(`Update - should return Project not found (Not Found - 404) exception`, async () => {
    const userResult = await new userModel(mockUser).save();
    await new projectModel(mockProjects[0]).save();
    const name = 'changed-name';
    const slug = 'koui';
    const response = await projectService.update(
      new Mongoose.Types.ObjectId().toString(),
      userResult._id.toString(),
      {
        name: name,
        slug: slug,
      },
    );
    expect(response).toStrictEqual(new NotFound<Project>('Project not found'));
  });

  it(`Update - should return Unauthorized access to user project (Not Found - 404) exception`, async () => {
    await new userModel(mockUser).save();
    const createResult = await new projectModel(mockProjects[0]).save();
    const name = 'changed-name';
    const slug = 'koui';
    const response = await projectService.update(
      createResult._id.toString(),
      new Mongoose.Types.ObjectId().toString(),
      {
        name: name,
        slug: slug,
      },
    );
    expect(response).toStrictEqual(
      new Unauthorized('Unauthorized access to user project'),
    );
  });
});
