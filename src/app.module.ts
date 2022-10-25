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
import { AuthModule } from './auth/auth.module';
import { PassportJwtDuplicationFixInterceptor } from './passport-fix.interceptor';
import { Project } from './project/entities/project.entity';
import { ProjectModule } from './project/project.module';
import { MongooseSchemasModule } from './schemas.module';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
import { AddressModule } from './address/address.module';
import * as dotenv from 'dotenv';
import { Address } from './address/entities/address.entity';
dotenv.config();

AdminJS.registerAdapter(AdminJSMongoose);
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.DATABASE_URL,
      }),
    }),
    ProjectModule,
    AuthModule,
    UserModule,
    AdminModule.createAdminAsync({
      imports: [ConfigModule.forRoot(), MongooseSchemasModule],
      inject: [
        getModelToken('Project'),
        getModelToken('User'),
        getModelToken('Address'),
      ],
      useFactory: (
        projectModel: Model<Project>,
        userModel: Model<User>,
        addressModel: Model<Address>,
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
                  },
                },
                parent: { name: 'Content', icon: 'Home' },
              },
            },
          ],
          branding: {
            logo: 'http://dev3.sh/wp-content/uploads/2022/08/logo.png',
            companyName: 'Dev3',
            withMadeWithLove: false,
          },
        },
        auth: {
          authenticate: async (email, password) =>
            Promise.resolve({ email: 'admin' }),
          cookieName: 'dev3admin',
          cookiePassword: 'admin',
        },
      }),
    }),
    MongooseSchemasModule,
    AddressModule,
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
