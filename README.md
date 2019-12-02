
# Saffron

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.0.2.

## Local installation

Run `NODE_ENV=dev npm install` to prepare local environment.

## Development server

Run `npm run-script debug` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

You should have API server running on `http://localhost:8000/`. You can get it on https://github.com/batissamadian/saffron-dab-backend

## Running unit tests

Run `npm test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `npm run-script e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Deployment

To deploy `test` server run `git push heroku develop:master`.

To deploy `stage` server run `git push heroku-stage master`.
