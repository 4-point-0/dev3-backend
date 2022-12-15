import Mongoose from 'mongoose';
import { CreateProjectDto } from '../src/modules/project/dto/create-project.dto';
import { CreateAddressDto } from '../src/modules/address/dto/create-address.dto';
import { Role } from '../src/common/enums/role.enum';
import { PaymentStatus } from '../src/common/enums/payment-status.enum';
import { CreatePaymentDto } from '../src/modules/payment/dto/create-payment.dto';
import { addDays } from '../src/helpers/date/date-helper';
import { CreateApiKeyDto } from '../src/modules/api-key/dto/create-api-key.dto';
import { ApiKeyDto } from '../src/modules/api-key/dto/api-key.dto';
import { TransactionRequestStatus } from '../src/common/enums/transaction-request.enum';
import { CreateTransactionRequestDto } from '../src/modules/transaction-request/dto/create-transaction-request.dto';
import { v4 as uuidv4 } from 'uuid';
import { TransactionRequestDto } from '../src/modules/transaction-request/dto/transaction-request.dto';
import { TransactionRequestType } from '../src/common/enums/transaction-request-type.enum';

export const mockAuthUser = {
  uid: 'rimatikdev.testnet',
  username: 'rimatikdev.testnet',
  accountType: 'near',
  nearWalletAccountId: 'rimatikdev.testnet',
  _id: new Mongoose.Types.ObjectId('634ff3d708393072d5daa871'),
};

export const mockUser = {
  _id: new Mongoose.Types.ObjectId('634ff3d708393072d5daa871'),
  updatedAt: new Date(),
  createdAt: new Date(),
  isCensored: true,
  isActive: true,
  uid: 'dev3.testnet',
  accountType: 'near',
  roles: [Role.Customer],
  username: 'dev3.testnet',
  nearWalletAccountId: 'dev3.testnet',
};

export const mockAddress = {
  wallet: 'john.near',
  alias: 'johhy1',
  email: 'john@email.com',
  phone: '+38599345687',
  owner: mockUser,
  _id: new Mongoose.Types.ObjectId('634ff1e4bb85ed5475a1ff5d'),
  updatedAt: new Date(),
  createdAt: new Date(),
};

export const mockAddresses = [
  mockAddress,
  {
    wallet: 'marc.near',
    alias: 'marc1',
    email: 'marc@email.com',
    phone: '+38599345688',
    owner: {
      _id: new Mongoose.Types.ObjectId('634ff3d708393072d5daa845'),
      updatedAt: new Date(),
      createdAt: new Date(),
      isCensored: true,
      isActive: true,
      uid: 'dev4.testnet',
      accountType: 'near',
      roles: [Role.Customer],
      username: 'dev4.testnet',
      nearWalletAccountId: 'dev4.testnet',
    },
    _id: new Mongoose.Types.ObjectId('634ff1e4bb85ed5475a1ff6d'),
    updatedAt: new Date(),
    createdAt: new Date(),
  },
];

export const mockCreateAddressDto1: CreateAddressDto = {
  wallet: mockAddresses[0].wallet,
  alias: mockAddresses[0].alias,
  email: mockAddresses[0].email,
  phone: mockAddresses[0].phone,
  owner: mockUser._id,
};

export const mockCreateAddressDto2: CreateAddressDto = {
  wallet: mockAddresses[1].wallet,
  alias: mockAddresses[1].alias,
  email: mockAddresses[1].email,
  phone: mockAddresses[1].phone,
  owner: mockUser._id,
};

export const mockCreateAddressDtos = [
  mockCreateAddressDto1,
  mockCreateAddressDto2,
];
export const mockFile1 = {
  _id: new Mongoose.Types.ObjectId('6398491ef34acc5f99d54a24'),
  name: 'logo-social.png',
  mime_type: 'image/png',
  url: 'http://localhost/5aa3713e-65d3-43df-a9e2-d28314695f6b-logo.png',
  key: '5aa3713e-65d3-43df-a9e2-d28314695f6b-logo.png',
  owner: mockUser,
  updatedAt: new Date(),
  createdAt: new Date(),
};

export const mockFile1Dto = {
  _id: mockFile1._id,
  name: 'logo-social.png',
  mime_type: 'image/png',
  url: 'http://localhost/5aa3713e-65d3-43df-a9e2-d28314695f6b-logo.png',
  key: '5aa3713e-65d3-43df-a9e2-d28314695f6b-logo.png',
  owner: mockUser._id,
};

export const mockProject1 = {
  name: 'dev3-test',
  slug: 'slug-1234',
  logo: mockFile1,
  owner: mockUser,
  _id: new Mongoose.Types.ObjectId('634ff1e4bb85ed5475a1ff5d'),
  updatedAt: new Date(),
  createdAt: new Date(),
};

export const mockProject2 = {
  name: 'project',
  slug: 'slug-1232',
  logo: mockFile1,
  owner: mockUser,
  _id: new Mongoose.Types.ObjectId('634ff1e4bb85ed5475a1ff5f'),
  updatedAt: new Date(),
  createdAt: new Date(),
};

export const mockProject3 = {
  name: 'project12',
  slug: 'slug-1235',
  logo: mockFile1,
  owner: mockUser,
  _id: new Mongoose.Types.ObjectId('634ff1e4bb85ed5475a1ff5c'),
  updatedAt: new Date(),
  createdAt: new Date(),
};

export const mockProject4 = {
  name: 'super-must',
  slug: 'super-must-my24',
  logo: mockFile1,
  owner: mockUser,
  _id: new Mongoose.Types.ObjectId('634ff1e4bb85ed5475a1ff5a'),
  updatedAt: new Date(),
  createdAt: new Date(),
};

export const mockProjects = [
  mockProject1,
  mockProject2,
  mockProject3,
  mockProject4,
];

export const mockCreateProjectDto1: CreateProjectDto = {
  name: mockProject1.name,
  slug: mockProject1.slug,
  logo_id: mockFile1._id.toString(),
  owner: mockUser._id,
};

export const mockCreateProjectDto2: CreateProjectDto = {
  name: mockProject2.name,
  slug: mockProject2.slug,
  logo_id: mockFile1._id.toString(),
  owner: mockUser._id,
};

export const mockCreateProjectDto3: CreateProjectDto = {
  name: mockProject3.name,
  slug: mockProject3.slug,
  logo_id: mockFile1._id.toString(),
  owner: mockUser._id,
};

export const mockCreateProjectDto4: CreateProjectDto = {
  name: mockProject4.name,
  slug: mockProject4.slug,
  logo_id: mockFile1._id.toString(),
  owner: mockUser._id,
};

export const mockCreateProjectDtos = [
  mockCreateProjectDto1,
  mockCreateProjectDto2,
  mockCreateProjectDto3,
  mockCreateProjectDto4,
];

export const mockProjectDto = {
  id: mockProjects[0]._id.toString(),
  name: mockProjects[0].name,
  slug: mockProjects[0].slug,
  logo_url: mockProjects[0].logo.url,
};

export const mockPayment1 = {
  _id: new Mongoose.Types.ObjectId('784ff1e4bb85ed5475a1ff5d'),
  uuid: uuidv4(),
  memo: 'Pay 10 tokens',
  amount: '10',
  receiver: 'mary.dev3.testnet',
  status: PaymentStatus.Pending,
  owner: mockUser,
  updatedAt: new Date(),
  createdAt: new Date(),
  project: mockProject1,
};

export const mockPayment2 = {
  _id: new Mongoose.Types.ObjectId('784fe1e4cb85ed5475a1ff5d'),
  uuid: uuidv4(),
  memo: 'Pay 12 tokens',
  amount: '12',
  receiver: 'alice.dev3.testnet',
  status: PaymentStatus.Pending,
  owner: mockUser,
  updatedAt: new Date(),
  createdAt: new Date(),
  project: mockProject1,
};

export const mockPayment3 = {
  _id: new Mongoose.Types.ObjectId('784ff1e2bb85fd5475a1ff5d'),
  uuid: uuidv4(),
  memo: 'Pay 9 tokens',
  amount: '9',
  receiver: 'bob.dev3.testnet',
  status: PaymentStatus.Pending,
  owner: mockUser,
  updatedAt: new Date(),
  createdAt: new Date(),
  project: mockProject1,
};

export const mockPayment4 = {
  _id: new Mongoose.Types.ObjectId('784ff1e4bb85ed5475a1ff5d'),
  uuid: uuidv4(),
  memo: 'Pay 15 tokens',
  amount: '15',
  receiver: 'mary.dev3.testnet',
  status: PaymentStatus.Pending,
  owner: mockUser,
  updatedAt: new Date(),
  createdAt: new Date(),
  project: mockProject1,
};

export const mockPayments = [
  mockPayment1,
  mockPayment2,
  mockPayment3,
  mockPayment4,
];

export const mockCreatePaymentDto1: CreatePaymentDto = {
  memo: mockPayment1.memo,
  amount: mockPayment1.amount,
  receiver: mockPayment1.receiver,
  project_id: mockPayment1.project._id.toString(),
  owner: mockPayment1.owner._id,
};

export const mockCreatePaymentDto2: CreatePaymentDto = {
  memo: mockPayment2.memo,
  amount: mockPayment2.amount,
  receiver: mockPayment2.receiver,
  project_id: mockPayment1.project._id.toString(),
  owner: mockPayment1.owner._id,
};

export const mockCreatePaymentDto3: CreatePaymentDto = {
  memo: mockPayment3.memo,
  amount: mockPayment3.amount,
  receiver: mockPayment3.receiver,
  project_id: mockPayment1.project._id.toString(),
  owner: mockPayment1.owner._id,
};

export const mockCreatePaymentDto4: CreatePaymentDto = {
  memo: mockPayment4.memo,
  amount: mockPayment4.amount,
  receiver: mockPayment4.receiver,
  project_id: mockPayment1.project._id.toString(),
  owner: mockPayment1.owner._id,
};

export const mockCreatePaymentDtos = [
  mockCreatePaymentDto1,
  mockCreatePaymentDto2,
  mockCreatePaymentDto3,
  mockCreatePaymentDto4,
];

export const mockPaymentDto = {
  _id: mockPayment1._id.toString(),
  uuid: mockPayment1.uuid,
  amount: mockPayment1.amount,
  memo: mockPayment1.memo,
  receiver: mockPayment1.receiver,
  status: mockPayment1.status,
  project_id: mockPayment1.project._id.toString(),
};

export const mockApiKey1 = {
  _id: new Mongoose.Types.ObjectId('784ff1e4bc85ed5475a1ff5d'),
  expires: addDays(new Date(), 30),
  is_revoked: false,
  project: mockProject1._id,
  owner: mockUser,
  updatedAt: new Date(),
  createdAt: new Date(),
};

export const mockApiKey2 = {
  _id: new Mongoose.Types.ObjectId('784fe1e4cd85ed5475a1ff5d'),
  expires: addDays(new Date(), 30),
  is_revoked: false,
  project: mockProject2._id,
  owner: mockUser,
  updatedAt: new Date(),
  createdAt: new Date(),
};

export const mockApiKey3 = {
  _id: new Mongoose.Types.ObjectId('784ff1e3bb85fd5475a1ff5d'),
  expires: addDays(new Date(), 30),
  is_revoked: false,
  project: mockProject3._id,
  owner: mockUser,
  updatedAt: new Date(),
  createdAt: new Date(),
};

export const mockApiKey4 = {
  _id: new Mongoose.Types.ObjectId('784ff2e4bb85fd4475a1ff5d'),
  expires: addDays(new Date(), 30),
  is_revoked: false,
  project: mockProject4._id,
  owner: mockUser,
  updatedAt: new Date(),
  createdAt: new Date(),
};

export const mockApiKeys = [mockApiKey1, mockApiKey2, mockApiKey3, mockApiKey4];

export const mockCreateApiKeyDto1: CreateApiKeyDto = {
  project_id: mockApiKey1.project.toString(),
  expires: mockApiKey1.expires,
  owner: mockUser._id,
};

export const mockCreateApiKeyDto2: CreateApiKeyDto = {
  project_id: mockApiKey2.project.toString(),
  expires: mockApiKey2.expires,
  owner: mockUser._id,
};

export const mockCreateApiKeyDto3: CreateApiKeyDto = {
  project_id: mockApiKey3.project.toString(),
  expires: mockApiKey3.expires,
  owner: mockUser._id,
};

export const mockCreateApiKeyDto4: CreateApiKeyDto = {
  project_id: mockApiKey4.project.toString(),
  expires: mockApiKey4.expires,
  owner: mockUser._id,
};

export const mockCreateApiKeyDtos = [
  mockCreateApiKeyDto1,
  mockCreateApiKeyDto2,
  mockCreateApiKeyDto3,
  mockCreateApiKeyDto4,
];

export const mockApiKeyDtos: ApiKeyDto[] = [
  {
    id: mockApiKey1._id.toString(),
    created_at: mockApiKey1.createdAt,
    expires: mockApiKey1.expires,
    is_revoked: mockApiKey1.is_revoked,
    api_key: '123',
    project_id: mockApiKey1.project.toString(),
  },
  {
    id: mockApiKey2._id.toString(),
    created_at: mockApiKey2.createdAt,
    expires: mockApiKey2.expires,
    is_revoked: mockApiKey2.is_revoked,
    api_key: '123',
    project_id: mockApiKey2.project.toString(),
  },
  {
    id: mockApiKey3._id.toString(),
    created_at: mockApiKey3.createdAt,
    expires: mockApiKey3.expires,
    is_revoked: mockApiKey3.is_revoked,
    api_key: '123',
    project_id: mockApiKey3.project.toString(),
  },
  {
    id: mockApiKey4._id.toString(),
    created_at: mockApiKey4.createdAt,
    expires: mockApiKey4.expires,
    is_revoked: mockApiKey4.is_revoked,
    api_key: '123',
    project_id: mockApiKey4.project.toString(),
  },
];

export const mockTransactionRequest1 = {
  _id: new Mongoose.Types.ObjectId('784ff1e4bc85ec5475a1ff5d'),
  uuid: uuidv4(),
  type: TransactionRequestType.Transaction,
  status: TransactionRequestStatus.Pending,
  contractId: '123',
  method: 'withdraw',
  args: JSON.stringify({ arg1: 1, arg2: '2', arg3: ['12', '1'] }),
  is_near_token: false,
  gas: '1000000000000000000000000',
  project: mockProject1,
  owner: mockUser,
  updatedAt: new Date(),
  createdAt: new Date(),
};

export const mockTransactionRequest2 = {
  _id: new Mongoose.Types.ObjectId('784fe1e4cd85ed4355a1ff5d'),
  uuid: uuidv4(),
  type: TransactionRequestType.Payment,
  status: TransactionRequestStatus.Pending,
  contractId: '123',
  method: 'ft_transfer',
  args: JSON.stringify({ receiver_id: 'bob.dev3.testnet', amount: '19' }),
  is_near_token: false,
  project: mockProject2,
  owner: mockUser,
  updatedAt: new Date(),
  createdAt: new Date(),
};

export const mockTransactionRequest3 = {
  _id: new Mongoose.Types.ObjectId('784ff1e3bb85fd2135a1ff5d'),
  uuid: uuidv4(),
  type: TransactionRequestType.Transaction,
  status: TransactionRequestStatus.Pending,
  contractId: '125',
  method: 'withdraw',
  gas: '1000000000000000000000000',
  is_near_token: false,
  project: mockProject3,
  owner: mockUser,
  updatedAt: new Date(),
  createdAt: new Date(),
};

export const mockTransactionRequest4 = {
  _id: new Mongoose.Types.ObjectId('784ff2e4bb85fd1125a1ff5d'),
  uuid: uuidv4(),
  type: TransactionRequestType.Payment,
  status: TransactionRequestStatus.Pending,
  contractId: '123',
  method: 'deposit',
  is_near_token: false,
  project: mockProject4,
  owner: mockUser,
  updatedAt: new Date(),
  createdAt: new Date(),
};

export const mockTransactionRequests = [
  mockTransactionRequest1,
  mockTransactionRequest2,
  mockTransactionRequest3,
  mockTransactionRequest4,
];

export const mockCreateTransactionRequestDto1: CreateTransactionRequestDto = {
  type: mockTransactionRequest1.type,
  contractId: mockTransactionRequest1.contractId,
  uuid: mockTransactionRequest1.uuid,
  method: mockTransactionRequest1.method,
  args: mockTransactionRequest1.args,
  gas: mockTransactionRequest1.gas,
  is_near_token: mockTransactionRequest1.is_near_token,
  project_id: mockTransactionRequest1.project._id.toString(),
  project: mockTransactionRequest1.project._id,
  owner: mockUser._id,
};

export const mockCreateTransactionRequestDto2: CreateTransactionRequestDto = {
  type: mockTransactionRequest2.type,
  contractId: mockTransactionRequest2.contractId,
  uuid: mockTransactionRequest2.uuid,
  method: mockTransactionRequest2.method,
  args: mockTransactionRequest2.args,
  is_near_token: mockTransactionRequest2.is_near_token,
  project_id: mockTransactionRequest2.project._id.toString(),
  project: mockTransactionRequest2.project._id,
  owner: mockUser._id,
};

export const mockCreateTransactionRequestDto3: CreateTransactionRequestDto = {
  type: mockTransactionRequest3.type,
  contractId: mockTransactionRequest3.contractId,
  uuid: mockTransactionRequest3.uuid,
  method: mockTransactionRequest3.method,
  is_near_token: mockTransactionRequest3.is_near_token,
  gas: mockTransactionRequest3.gas,
  project_id: mockTransactionRequest3.project._id.toString(),
  project: mockTransactionRequest3.project._id,
  owner: mockUser._id,
};

export const mockCreateTransactionRequestDto4: CreateTransactionRequestDto = {
  type: mockTransactionRequest4.type,
  contractId: mockTransactionRequest4.contractId,
  uuid: mockTransactionRequest4.uuid,
  method: mockTransactionRequest4.method,
  is_near_token: mockTransactionRequest4.is_near_token,
  project_id: mockTransactionRequest4.project._id.toString(),
  project: mockTransactionRequest4.project._id,
  owner: mockUser._id,
};
export const mockCreateTransactionRequestDto5: CreateTransactionRequestDto = {
  type: mockTransactionRequest1.type,
  contractId: mockTransactionRequest1.contractId,
  uuid: mockTransactionRequest1.uuid,
  method: mockTransactionRequest1.method,
  args: mockTransactionRequest1.args,
  gas: mockTransactionRequest1.gas,
  is_near_token: mockTransactionRequest1.is_near_token,
  project_id: mockTransactionRequest1.project._id.toString(),
  project: mockTransactionRequest1.project._id,
  owner: mockUser._id,
};

export const mockCreateTransactionRequestDtos = [
  mockCreateTransactionRequestDto1,
  mockCreateTransactionRequestDto2,
  mockCreateTransactionRequestDto3,
  mockCreateTransactionRequestDto4,
  mockCreateTransactionRequestDto5,
];

export const mockTransactionRequestDto: TransactionRequestDto = {
  contractId: mockTransactionRequest1.contractId,
  type: mockTransactionRequest1.type,
  uuid: mockTransactionRequest1.uuid,
  method: mockTransactionRequest1.method,
  args: mockTransactionRequest1.args,
  gas: mockTransactionRequest1.gas,
  txHash: '123',
  txDetails: JSON.stringify({ name: '123', lastname: '222' }),
  project_id: mockTransactionRequest1.project._id.toString(),
  created_at: mockTransactionRequest1.createdAt,
  status: mockTransactionRequest1.status,
  caller_address: 'bob.testnet',
  is_near_token: false,
};
