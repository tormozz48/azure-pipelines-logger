const {Logger} = require('../build/index');

const logger = new Logger({});

logger.error('Something went wrong');
logger.logIssueError('Some error issue #1');

logger.error('Something went wrong');
logger.logIssueError('Some error issue #2');

logger.completeError('Compeleted with error');