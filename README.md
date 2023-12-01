# PrysmWebUi
######################################################
# DEPRECATION WARNING!

The Prysm Web UI will no longer be supported at a future hard fork. Learn more about the deprecation at [Prysm Web UI Documentation](https://docs.prylabs.network/docs/prysm-usage/web-interface). For more questions or concerns please contact the team on our discord.

#######################################################

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.0.5.

## dependencies and development environment ( current tech stack )
 1. node (latest)
 2. visual studio code 
 3. visual studio code plugins - angular snippits, typescript import, TODO highlight

## Running the project

Install nodejs then do

```
npm install
```
Then run the project locally on port 4200 by doing
```
npm start
```
navigate to http://localhost:4200

## Environment 

### Environment Variables

Environment variables are injected via the environmenter service under core/services. this is key to determining some logic in the system such as with interceptors to prevent header leakage.

### Develop Environment

Web UI in development mode uses mock data by default

The recommended way to run prysm web is from the validator client itself via the `--web` flag. If you are building the web UI from source and doing `npm start`, you **will be using fake, mock data!** Keep that in mind if you are trying to use real accounts with the web UI.

Develop URL login

for authentication in develop you may use any token in the url query parameter i.e. `localhost:4200/initialize?token=anytoken`

### Staging Environment

run `npm run start:staging` will run a 'like' production build where the backend expects to be connected to `localhost:7500`. You will need to start the validator client with `--web` but interact with your angular application on `localhost:4200`.

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `npm test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running a test watcher

Run `npm run test:watch` to execute the unit tests in watch mode via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Development Tips

### Generating typescript protos

Run `npm install`

Then, do

```
./scripts/update-ts-pbs.sh \
    /path/to/github.com/prysmaticlabs/prysm/proto \
    /path/to/github.com/prysmaticlabs/prysm/proto/validator/accounts/v2/web_api.proto
```

You should see protos being regenerated under `./src/app/proto`, which will be used as the types in our frontend application.

## Steps to create release

1. Once all commits are added to master, update the `CHANGELOG.md` file for all the associated changes.
2. Create a version tag against master and push the new version tag. This will trigger the git action workflow.
3. Follow README.md instructions on the [prysm repo](https://github.com/prysmaticlabs/prysm/tree/develop/validator/web) to update the validator client with the new UI.

