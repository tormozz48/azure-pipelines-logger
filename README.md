# azure-pipelines-logger

Useful logger for scripts which runs in azure pipelines. Allows to use internal pipeline formatters for log messages.

[![Node.js CI](https://github.com/tormozz48/azure-pipelines-logger/actions/workflows/build-and-test.yml/badge.svg)](https://github.com/tormozz48/azure-pipelines-logger/actions/workflows/build-and-test.yml)
[![CircleCI](https://circleci.com/gh/tormozz48/azure-pipelines-logger.svg?style=shield)](https://circleci.com/gh/tormozz48/azure-pipelines-logger)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)
[![Coverage Status](https://coveralls.io/repos/github/tormozz48/azure-pipelines-logger/badge.svg?branch=main)](https://coveralls.io/github/tormozz48/azure-pipelines-logger?branch=main)

## Install and Usage

Install package from npm:
```
npm i @tormozz48/azure-pipelines-logger
```

Include logger into code:
```ts
import {Logger} from '@tormozz48/azure-pipelines-logger';

const logger = new Logger({});

logger.beginGroup('Log messages group');

logger.debug('Some debug message');
logger.info('Some info message');
logger.warn('Some warning message');
logger.error('Some error message');

logger.startSection('Start my awesome section');
logger.runCommand('Run my awesome command');

logger.endGroup();

logger.completeSuccess('Success completion');
```

Code above will generate something similar to [this](https://docs.microsoft.com/en-us/azure/devops/pipelines/scripts/logging-commands?view=azure-devops&tabs=bash#formatting-commands)

[API](https://tormozz48.github.io/azure-pipelines-logger/)

## Advanced usage

### Complete: Finish Timeline

Related [documentation](https://docs.microsoft.com/en-us/azure/devops/pipelines/scripts/logging-commands?view=azure-devops&tabs=bash#complete-finish-timeline)

```ts
import {Logger} from '@tormozz48/azure-pipelines-logger';

const logger = new Logger({});

// successfull build
logger.completeSuccess('Success completion');

// build with warnings
logger.completeWarning('Compeleted with warnings');

// build with errors
logger.completeError('Compeleted with error');
```

### LogIssue: Log an error or warning

Related [documentation](https://docs.microsoft.com/en-us/azure/devops/pipelines/scripts/logging-commands?view=azure-devops&tabs=bash#logissue-log-an-error-or-warning)

```ts
const logger = new Logger({});

// warning issue
logger.logIssueWarning('Some warning issue');

// error issue
logger.logIssueError('Some error issue');
```

### Include time into log message
```ts
const logger = new Logger({showDate: true});

logger.debug('Hello World') // ##[debug] 15:04:28 Hello World
```

Another datetime format can be set via `dateFormat` option:
```ts
const logger = new Logger({
    showDate: true,
    dateFormat: 'fullDate'
});

logger.debug('Hello World') // ##[debug] Saturday, June 9, 2007 Hello World
```

## Develop

Useful dev scripts:

* `npm run build` - compile typescript code
* `npm run lint` - check code syntax via [eslint](https://eslint.org/)
* `npm test` - run tests with [jest](https://jestjs.io/)
* `npm run docs` - creates API documentation with [typedoc](https://typedoc.org/)

Maintainer: [Andrey Kuznetsov](mailto:tormozz48@gmail.com)