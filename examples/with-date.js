const {Logger} = require('../build/index');

const logger = new Logger({showDate: true});

logger.debug('Some debug message');
logger.info('Some info message');
logger.warn('Some warning message');
logger.error('Some error message');

logger.completeSuccess('Success completion');