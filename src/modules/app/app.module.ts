import * as AdminJSMongoose from '@adminjs/mongoose';
import { AdminModule } from '@adminjs/nestjs';
import { Module, Scope } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { Address } from '../address/entities/address.entity';
import { dev3CompanyName, dev3LogoUrl } from '../../common/constants';
import { ContractModule } from '../contract/contract.module';
import { Contract } from '../contract/entities/contract.entity';
import { ApiKeyModule } from '../api-key/api-key.module';
import { ApiKey } from '../api-key/entities/api-key.entity';
import { configuration } from 'src/config/configuration';
import { existsSync } from 'fs';
import * as dotenv from 'dotenv';
import { envValidationSchema } from '../../config/validation';
import { TransactionRequestModule } from '../transaction-request/tranasction-request.module';
import { TransactionRequest } from '../transaction-request/entities/transaction-request.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from '../task/task.module';

dotenv.config({
  path: existsSync(`.env.${process.env.NODE_ENV}`)
    ? `.env.${process.env.NODE_ENV}`
    : '.env',
});

AdminJS.registerAdapter(AdminJSMongoose);
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
      load: [configuration],
      validationSchema: envValidationSchema,
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('database_uri'),
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    ProjectModule,
    AuthModule,
    UserModule,
    AddressModule,
    // PaymentModule,
    ContractModule,
    ApiKeyModule,
    TransactionRequestModule,
    TasksModule,
    AdminModule.createAdminAsync({
      imports: [MongooseSchemasModule],
      inject: [
        getModelToken('Project'),
        getModelToken('User'),
        getModelToken('Address'),
        // getModelToken('Payment'),
        getModelToken('Contract'),
        getModelToken('ApiKey'),
        getModelToken('TransactionRequest'),
        ConfigService,
      ],
      useFactory: (
        projectModel: Model<Project>,
        userModel: Model<User>,
        addressModel: Model<Address>,
        // paymentModel: Model<Payment>,
        contractModel: Model<Contract>,
        apiKeyModel: Model<ApiKey>,
        transactionRequestModel: Model<TransactionRequest>,
        configService: ConfigService,
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
            // {
            //   resource: paymentModel,
            //   options: {
            //     properties: {
            //       createdAt: {
            //         isVisible: {
            //           edit: false,
            //           new: false,
            //         },
            //       },
            //       updatedAt: {
            //         isVisible: {
            //           edit: false,
            //           new: false,
            //         },
            //       },
            //       owner: {
            //         isRequired: true,
            //         reference: 'User',
            //       },
            //     },
            //     parent: { name: 'Content', icon: 'Home' },
            //   },
            // },
            {
              resource: contractModel,
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
                },
                parent: { name: 'Content', icon: 'Home' },
              },
            },
            {
              resource: apiKeyModel,
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
                },
                parent: { name: 'Content', icon: 'Home' },
              },
            },
            {
              resource: transactionRequestModel,
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
            if (
              email === configService.get<string>('admin_js.admin_email') &&
              password === configService.get<string>('admin_js.admin_pass')
            ) {
              return Promise.resolve({
                email: configService.get<string>('admin_js.admin_email'),
                password: configService.get<string>('admin_js.admin_pass'),
              });
            }
            return null;
          },
          cookieName: configService.get<string>('admin_js.cookie_name'),
          cookiePassword: configService.get<string>('admin_js.cookie_pass'),
        },
        // sessionOptions: {
        //   resave: false,
        //   saveUninitialized: true,
        //   secret: COOKIE_PASS,
        // },
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
