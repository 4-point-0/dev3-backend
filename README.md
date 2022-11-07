# DEV3 NEAR REST API

<p align="middle">
  <a href="http://nestjs.com/" target="blank"><img src="./public/tech-stack/nestjs.png" width="200" alt="Nest Logo" /></a>
    <a href="https://nodejs.org/" target="blank"><img src="./public/tech-stack/nodejs.png" width="200" alt="Node Logo" /></a>
  <a href="https://www.mongodb.com/" target="blank"><img src="./public/tech-stack/mongo.png" width="200" alt="Mongo Logo" /></a>
    <a href="https://swagger.io/" target="blank"><img src="./public/tech-stack/swagger.png" width="200" alt="Swagger Logo" /></a>
</p>

## Setup

Install the latest version of NodeJS and Yarn.

Install the latest version of MongoDB.

## Environment Variables

Copy `env.example` to the `.env` and populate it with proper values.

## Folder Structure

### /

The root folder contains `env.example` file for configuring environment variables

The`.eslintrc.json` file contains ESLint configuration.

The `.gitignore` file specifying which files GIT should ignore.

The `.prettierrc` config file is used for prettier code formatter.

The `nest-cli.json` contains config for `@nestjs/cli` command-line interface tool.

The `Procfile` file is config for heroku.

The `tsconfig.json` and `tsconfig.build.json` files are used for configuring project to use typescript.

The `README.md` file is the current file you are reading and `yarn.lock` file is the lock file for Yarn.

### /.adminjs

This folder contains files to customize the AdminJs interface.

### /public

This folder contains files that are served by the built-in web server and any images used in the `README.md`.

### /src

This folder contains all backend code files.

### /tests

This folder contains all e2e tests.

## Dependencies

Install the dependencies by running:

```bash
$ yarn install
```

## Launch

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Specification

This backend uses specification under the OpenAPI 3.0 standard.

## Modules

Add new module to `modules` folder and refer to nestjs documentation or on other modules how to configure it.

## Linting

To lint your changes, run the following in the project root folder:

```bash
$ yarn lint
```

### API

The REST API can be accessed at `http://{host}:{port}/api/v1/{endpoint}`.

Where `{host}` is the hostname of your server and `{port}` is the port on which the API is running. The `{endpoint}` is the specific endpoint you are attempting to access.

### Admin

The backend has an administrative panel that can be used for back-office operations. It can be accessed at `http://{host}:{port}/admin/`. Where `{host}` is the hostname of your server and `{port}` is the port on which the API is running.

To authenticate, you will need an admin account on the backend.

## Nest docs

[https://nestjs.com](https://nestjs.com/)
