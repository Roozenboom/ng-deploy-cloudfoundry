# ng-deploy-cloudfoundry

[![NPM version](https://img.shields.io/npm/v/ng-deploy-cloudfoundry?style=flat-square)](https://www.npmjs.com/package/ng-deploy-cloudfoundry)
[![The MIT License](https://img.shields.io/badge/license-MIT-orange.svg?color=blue&style=flat-square)](http://opensource.org/licenses/MIT)

**Deploy Angular apps to CloudFoundry using the Angular CLI**

## Quick start

1. Install the latest version of Angular cli

   ```sh
   yarn global add @angular/cli
   ```

1. Create a new Angular project

   ```sh
   ng new hello-world --defaults
   cd hello-world
   ```

1. Add `ng-deploy` to your project

   ```sh
   ng add ng-deploy-cloudfoundry
   ```

1. Deploy your project to CloudFoundry.

   ```sh
   ng run hello-world:deploy
   ```

## Requirements

To use the Cloud Foundry deploy command you need the Cloud Foundry CLI, Angular CLI and an Angular project (v8.3.0 or greater)

### Cloud Foundry CLI

- If you don't have the cf CLI installed, [follow these instructions](https://docs.cloudfoundry.org/cf-cli/install-go-cli.html)

### Angular CLI

- Run `ng --version` to check the version, you need version 8 or greater of the Angular CLI
- If necessary upgrade your project with `ng update @angular/cli @angular/core`

## Usage

You can adjust your deployment with options.

The available options are:

- `--configuration` (`-c`) - A named build target, as specified in the "configurations" section of angular.json
- `--no-build` - Skip build process during deployment
- `--random-route` - Generate a random unique route for the deployed application

Example:

```sh
ng deploy --no-build --random-route
```
