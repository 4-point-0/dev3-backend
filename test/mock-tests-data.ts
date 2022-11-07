import Mongoose from 'mongoose';
import { CreateProjectDto } from '../src/modules/project/dto/create-project.dto';
import { CreateAddressDto } from '../src/modules/address/dto/create-address.dto';
import { Role } from '../src/common/enums/role.enum';
import { PaymentStatus } from '../src/common/enums/payment-status.enum';
import { CreatePaymentDto } from '../src/modules/payment/dto/create-payment.dto';

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

export const mockProject1 = {
  name: 'dev3-test',
  slug: 'slug-1234',
  logoUrl: 'http://localhost/logo-SI.png',
  owner: mockUser,
  _id: new Mongoose.Types.ObjectId('634ff1e4bb85ed5475a1ff5d'),
  updatedAt: new Date(),
  createdAt: new Date(),
};

export const mockProject2 = {
  name: 'project',
  slug: 'slug-1232',
  logoUrl: 'http://localhost/logo-SI.png',
  owner: mockUser,
  _id: new Mongoose.Types.ObjectId('634ff1e4bb85ed5475a1ff5f'),
  updatedAt: new Date(),
  createdAt: new Date(),
};

export const mockProject3 = {
  name: 'project12',
  slug: 'slug-1235',
  logoUrl: 'http://localhost/logo-SI.png',
  owner: mockUser,
  _id: new Mongoose.Types.ObjectId('634ff1e4bb85ed5475a1ff5c'),
  updatedAt: new Date(),
  createdAt: new Date(),
};

export const mockProject4 = {
  name: 'super-must',
  slug: 'super-must-my24',
  logoUrl: 'http://localhost/logo-SI.png',
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
  logoUrl: mockProject1.logoUrl,
  owner: mockUser._id,
};

export const mockCreateProjectDto2: CreateProjectDto = {
  name: mockProject2.name,
  slug: mockProject2.slug,
  logoUrl: mockProject2.logoUrl,
  owner: mockUser._id,
};

export const mockCreateProjectDto3: CreateProjectDto = {
  name: mockProject3.name,
  slug: mockProject3.slug,
  logoUrl: mockProject3.logoUrl,
  owner: mockUser._id,
};

export const mockCreateProjectDto4: CreateProjectDto = {
  name: mockProject4.name,
  slug: mockProject4.slug,
  logoUrl: mockProject4.logoUrl,
  owner: mockUser._id,
};

export const mockCreateProjectDtos = [
  mockCreateProjectDto1,
  mockCreateProjectDto2,
  mockCreateProjectDto3,
  mockCreateProjectDto4,
];

export const mockPayment1 = {
  _id: new Mongoose.Types.ObjectId('784ff1e4bb85ed5475a1ff5d'),
  uid: 'bob.dev3.testnet',
  memo: 'Pay 10 tokens',
  amount: '10',
  receiver: 'mary.dev3.testnet',
  status: PaymentStatus.Pending,
  owner: mockUser,
  updatedAt: new Date(),
  createdAt: new Date(),
};

export const mockPayment2 = {
  _id: new Mongoose.Types.ObjectId('784fe1e4cb85ed5475a1ff5d'),
  uid: 'john.dev3.testnet',
  memo: 'Pay 12 tokens',
  amount: '12',
  receiver: 'alice.dev3.testnet',
  status: PaymentStatus.Pending,
  owner: mockUser,
  updatedAt: new Date(),
  createdAt: new Date(),
};

export const mockPayment3 = {
  _id: new Mongoose.Types.ObjectId('784ff1e2bb85fd5475a1ff5d'),
  uid: 'alice.dev3.testnet',
  memo: 'Pay 9 tokens',
  amount: '9',
  receiver: 'bob.dev3.testnet',
  status: PaymentStatus.Pending,
  owner: mockUser,
  updatedAt: new Date(),
  createdAt: new Date(),
};

export const mockPayment4 = {
  _id: new Mongoose.Types.ObjectId('784ff1e4bb85ed5475a1ff5d'),
  uid: 'bob.dev3.testnet',
  memo: 'Pay 15 tokens',
  amount: '15',
  receiver: 'mary.dev3.testnet',
  status: PaymentStatus.Pending,
  owner: mockUser,
  updatedAt: new Date(),
  createdAt: new Date(),
};

export const mockPayments = [
  mockPayment1,
  mockPayment2,
  mockPayment3,
  mockPayment4,
];

export const mockCreatePaymentDto1: CreatePaymentDto = {
  uid: mockPayment1.uid,
  memo: mockPayment1.memo,
  amount: mockPayment1.amount,
  receiver: mockPayment1.receiver,
  owner: mockUser._id,
};

export const mockCreatePaymentDto2: CreatePaymentDto = {
  uid: mockPayment2.uid,
  memo: mockPayment2.memo,
  amount: mockPayment2.amount,
  receiver: mockPayment2.receiver,
  owner: mockUser._id,
};

export const mockCreatePaymentDto3: CreatePaymentDto = {
  uid: mockPayment3.uid,
  memo: mockPayment3.memo,
  amount: mockPayment3.amount,
  receiver: mockPayment3.receiver,
  owner: mockUser._id,
};

export const mockCreatePaymentDto4: CreatePaymentDto = {
  uid: mockPayment4.uid,
  memo: mockPayment4.memo,
  amount: mockPayment4.amount,
  receiver: mockPayment4.receiver,
  owner: mockUser._id,
};

export const mockCreatePaymentDtos = [
  mockCreatePaymentDto1,
  mockCreatePaymentDto2,
  mockCreatePaymentDto3,
  mockCreatePaymentDto4,
];

export const mockPaymentDto = {
  _id: mockPayment1._id.toString(),
  uid: mockPayment1.uid,
  amount: mockPayment1.amount,
  memo: mockPayment1.memo,
  receiver: mockPayment1.receiver,
  status: mockPayment1.status,
};
