const {Logger} = require('../build/index');

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

