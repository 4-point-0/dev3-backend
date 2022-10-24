import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from 'nestjs-config';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';
import { Address, AddressSchema } from './entities/address.entity';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Address.name, schema: AddressSchema }]),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.DATABASE_URL,
      }),
    }),
  ],

  controllers: [AddressController],
  providers: [AddressService],
  exports: [AddressService],
})
export class AddressModule {}
