import Mongoose from 'mongoose';
import { CreateAddressDto } from './dto/create-address.dto';

export const mockUser = {
  _id: new Mongoose.Types.ObjectId('634ff3d708393072d5daa875'),
  updatedAt: new Date(),
  createdAt: new Date(),
  isCensored: true,
  isActive: true,
  uid: 'dev3.testnet',
  accountType: 'near',
  roles: ['customer'],
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
      roles: ['customer'],
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
  owner: new Mongoose.Types.ObjectId(mockAddresses[0]._id),
};

export const mockCreateAddressDto2: CreateAddressDto = {
  wallet: mockAddresses[1].wallet,
  alias: mockAddresses[1].alias,
  email: mockAddresses[1].email,
  phone: mockAddresses[1].phone,
  owner: new Mongoose.Types.ObjectId(mockAddresses[1]._id),
};

export const mockCreateAddressDtos = [
  mockCreateAddressDto1,
  mockCreateAddressDto2,
];
