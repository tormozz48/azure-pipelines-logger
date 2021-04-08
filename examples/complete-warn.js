const {Logger} = require('../build/index');

const logger = new Logger({});

logger.warn('Something went wrong');
logger.logIssueWarning('Some warning issue #1');

logger.warn('Something went wrong');
logger.logIssueWarning('Some warning issue #2');

logger.completeWarning('Compeleted with warnings');