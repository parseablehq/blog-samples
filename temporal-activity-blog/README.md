# Integrating Parseable With Temporal Workflows 

This is a sample implementation of a Temporal [scheduler example](https://github.com/temporalio/samples-typescript/tree/main/schedules) to demonstrate how Parseable can be integrated to capture activity logs. Ensure you have completed the [Temporal CLI](https://learn.temporal.io/getting_started/typescript/dev_environment/) setup in your local. This demo utilizes Winston and Parseable-Winston to override the [default logger](https://docs.temporal.io/develop/typescript/observability#how-to-customize-the-runtimes-logger).

### Installation
    temporal server start-dev
    npm i && npm start
    npm run schedule.start
   