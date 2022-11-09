import * as AdminJSMongoose from '@adminjs/mongoose';
import { AdminModule } from '@adminjs/nestjs';
import { Module, Scope } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import AdminJS from 'adminjs';
import { Model } from 'mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../auth/auth.module';
import { PassportJwtDuplicationFixInterceptor } from './passport-fix.interceptor';
import { Project } from '../project/entities/project.entity';
import { ProjectModule } from '../project/project.module';
import { MongooseSchemasModule } from './schemas.module';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { AddressModule } from '../address/address.module';
import * as dotenv from 'dotenv';
import { Address } from '../address/entities/address.entity';
import { dev3CompanyName, dev3LogoUrl } from '../../common/constants';
import { PaymentModule } from '../payment/payment.module';
import { Payment } from '../payment/entities/payment.entity';
import { ContractModule } from '../contract/contract.module';
dotenv.config();

const {
  COOKIE_NAME,
  COOKIE_PASS,
  ADMIN_JS_EMAIL,
  ADMIN_JS_PASS,
  DATABASE_URL,
} = process.env;

const DEFAULT_ADMIN = {
  email: ADMIN_JS_EMAIL,
  password: ADMIN_JS_PASS,
};

AdminJS.registerAdapter(AdminJSMongoose);
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: DATABASE_URL,
      }),
    }),
    ProjectModule,
    AuthModule,
    UserModule,
    AddressModule,
    PaymentModule,
    ContractModule,
    AdminModule.createAdminAsync({
      imports: [ConfigModule.forRoot(), MongooseSchemasModule],
      inject: [
        getModelToken('Project'),
        getModelToken('User'),
        getModelToken('Address'),
        getModelToken('Payment'),
      ],
      useFactory: (
        projectModel: Model<Project>,
        userModel: Model<User>,
        addressModel: Model<Address>,
        paymentModel: Model<Payment>,
      ) => ({
        adminJsOptions: {
          rootPath: '/admin',
          resources: [
            {
              resource: projectModel,
              options: {
                properties: {
                  createdAt: {
                    isVisible: {
                      edit: false,
                      new: false,
                    },
                  },
                  updatedAt: {
                    isVisible: {
                      edit: false,
                      new: false,
                    },
                  },
                  slug: {
                    isVisible: {
                      edit: false,
                      new: false,
                    },
                  },
                  owner: {
                    isRequired: true,
                    reference: 'User',
                  },
                },
                parent: { name: 'Content', icon: 'Home' },
              },
            },
            {
              resource: userModel,
              options: {
                properties: {
                  username: {
                    isTitle: true,
                  },
                  createdAt: {
                    isVisible: {
                      edit: false,
                      new: false,
                    },
                  },
                  updatedAt: {
                    isVisible: {
                      edit: false,
                      new: false,
                    },
                  },
                },
                parent: { name: 'Content', icon: 'Home' },
              },
            },
            {
              resource: addressModel,
              options: {
                properties: {
                  createdAt: {
                    isVisible: {
                      edit: false,
                      new: false,
                    },
                  },
                  updatedAt: {
                    isVisible: {
                      edit: false,
                      new: false,
                    },
                  },
                  owner: {
                    isRequired: true,
                    reference: 'User',
                  },
                },
                parent: { name: 'Content', icon: 'Home' },
              },
            },
            {
              resource: paymentModel,
              options: {
                properties: {
                  createdAt: {
                    isVisible: {
                      edit: false,
                      new: false,
                    },
                  },
                  updatedAt: {
                    isVisible: {
                      edit: false,
                      new: false,
                    },
                  },
                  owner: {
                    isRequired: true,
                    reference: 'User',
                  },
                },
                parent: { name: 'Content', icon: 'Home' },
              },
            },
          ],
          branding: {
            logo: dev3LogoUrl,
            companyName: dev3CompanyName,
            withMadeWithLove: false,
          },
        },
        auth: {
          authenticate: async (email: string, password: string) => {
            if (email === ADMIN_JS_EMAIL && password === ADMIN_JS_PASS) {
              return Promise.resolve(DEFAULT_ADMIN);
            }
            return null;
          },
          cookieName: COOKIE_NAME,
          cookiePassword: COOKIE_PASS,
        },
        sessionOptions: {
          resave: false,
          saveUninitialized: true,
          secret: COOKIE_PASS,
        },
      }),
    }),
    MongooseSchemasModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      scope: Scope.REQUEST,
      useClass: PassportJwtDuplicationFixInterceptor,
    },
  ],
})
export class AppModule {}
