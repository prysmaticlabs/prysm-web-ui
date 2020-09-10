# PrysmWebUi

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.0.5.

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

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `npm test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running a test watcher

Run `npm run test:watch` to execute the unit tests in watch mode via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Development

### Generating typescript protos

Run `npm install`

Then, do

```
./scripts/update-ts-pbs.sh \
    /path/to/github.com/prysmaticlabs/prysm/proto \
    /path/to/github.com/prysmaticlabs/prysm/proto/validator/accounts/v2/web_api.proto
```

You should see protos being regenerated under `./src/app/proto`, which will be used as the types in our frontend application.

