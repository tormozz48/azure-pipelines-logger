import {Consola} from 'consola';

import {AzurePipelineReporter, MESSAGE_TYPES} from './azure-pipeline-reporter';

enum LOG_ISSUE_TYPES {
    WARNING = 'warning',
    ERROR = 'error'
}

enum COMPLETE_RESULT {
    SUCCESS = 'Succeeded',
    WARNING = 'SucceededWithIssues',
    ERROR = 'Failed'
}

export type LoggerOptions = {
    /**
     * Log level
     * @default 4 (debug)
     * @type number
     */
    level?: number,

    /**
     * Show date inside log message
     * @type boolean
     */
    showDate?: boolean,

    /**
     * Date format
     * @default 'isoTime'
     * @type string
     */
    dateFormat?: string,

    /**
     * Mocks all loggers calls. Can be used in tests
     * @type boolean
     */
    mock?: boolean
}

/**
 * Logger class
 * @export
 * @class Logger
 */
export class Logger {
    private readonly logger: Consola;

    private readonly options: LoggerOptions = {
        level: 4,
        showDate: false,
        dateFormat: 'isoTime',
        mock: false
    }

    constructor(options: LoggerOptions = {}) {
        this.options = { ...this.options, ...options};

        this.logger = new Consola({
            level: this.options.level,
            reporters: [
                new AzurePipelineReporter({
                    showDate: this.options.showDate,
                    dateFormat: this.options.dateFormat
                })
            ]
        });

        if (this.options.mock) {
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            const noop = (): void => {};
            this.logger.mockTypes(() => noop);
        }
    }

    /**
     * Begins group of messages
     * @param  {string} message
     * @return {void}
     * @memberof Logger
     * @see https://docs.microsoft.com/en-us/azure/devops/pipelines/scripts/logging-commands?view=azure-devops&tabs=bash#formatting-commands
     */
    public beginGroup(message: string): void {
        this.logger.info(message, {templateId: MESSAGE_TYPES.GROUP_BEGIN});
    }

    /**
     * Ends group of messages
     * @return {void}
     * @memberof Logger
     * @see https://docs.microsoft.com/en-us/azure/devops/pipelines/scripts/logging-commands?view=azure-devops&tabs=bash#formatting-commands
     */
    public endGroup(): void {
        this.logger.info(null, {templateId: MESSAGE_TYPES.GROUP_END});
    }

    /**
     * Creates message formatted as start of section
     * @param  {string} message
     * @return {void}
     * @memberof Logger
     * @see https://docs.microsoft.com/en-us/azure/devops/pipelines/scripts/logging-commands?view=azure-devops&tabs=bash#formatting-commands
     */
    public startSection(message: string): void {
        this.logger.info(message, {templateId: MESSAGE_TYPES.SECTION});
    }

    /**
     * Creates message formatted as running command
     * @param  {string} message
     * @return {void}
     * @memberof Logger
     * @see https://docs.microsoft.com/en-us/azure/devops/pipelines/scripts/logging-commands?view=azure-devops&tabs=bash#formatting-commands
     */
    public runCommand(message: string): void {
        this.logger.info(message, {templateId: MESSAGE_TYPES.RUN_COMMAND});
    }

    /**
     * Creates debug message
     * @param  {string} message
     * @return {void}
     * @memberof Logger
     * @see https://docs.microsoft.com/en-us/azure/devops/pipelines/scripts/logging-commands?view=azure-devops&tabs=bash#formatting-commands
     */
    public debug(message: string): void {
        this.logger.debug(message, {templateId: MESSAGE_TYPES.DEBUG});
    }

    /**
     * Creates info message (Alias for debug)
     * @param  {string} message
     * @return {void}
     * @memberof Logger
     * @see https://docs.microsoft.com/en-us/azure/devops/pipelines/scripts/logging-commands?view=azure-devops&tabs=bash#formatting-commands
     */
    public info(message: string): void {
        this.logger.info(message, {templateId: MESSAGE_TYPES.DEBUG});
    }

    /**
     * Creates warning message
     * @param  {string} message
     * @return {void}
     * @memberof Logger
     * @see https://docs.microsoft.com/en-us/azure/devops/pipelines/scripts/logging-commands?view=azure-devops&tabs=bash#formatting-commands
     */
    public warn(message: string): void {
        this.logger.warn(message, {templateId: MESSAGE_TYPES.WARNING});
    }

    /**
     * Creates error message
     * @param  {string} message
     * @return {void}
     * @memberof Logger
     * @see https://docs.microsoft.com/en-us/azure/devops/pipelines/scripts/logging-commands?view=azure-devops&tabs=bash#formatting-commands
     */
    public error(message: string): void {
        this.logger.error(message, {templateId: MESSAGE_TYPES.ERROR});
    }

    /**
     * Creates special log message which indicates that job has been completed successfully
     * @param  {string} message
     * @return void
     * @memberof Logger
     * @see https://docs.microsoft.com/en-us/azure/devops/pipelines/scripts/logging-commands?view=azure-devops&tabs=bash#complete-finish-timeline
     */
    public completeSuccess(message: string): void {
        return this.complete(message, COMPLETE_RESULT.SUCCESS);
    }

    /**
     * Creates special log message which indicates that job has been completed with warnings
     * @param  {string} message
     * @return void
     * @memberof Logger
     * @see https://docs.microsoft.com/en-us/azure/devops/pipelines/scripts/logging-commands?view=azure-devops&tabs=bash#complete-finish-timeline
     */
    public completeWarning(message: string): void {
        return this.complete(message, COMPLETE_RESULT.WARNING);
    }

    /**
     * Creates special log message which indicates that job has been completed with errors
     * @param  {string} message
     * @return void
     * @memberof Logger
     * @see https://docs.microsoft.com/en-us/azure/devops/pipelines/scripts/logging-commands?view=azure-devops&tabs=bash#complete-finish-timeline
     */
    public completeError(message: string): void {
        return this.complete(message, COMPLETE_RESULT.ERROR);
    }

    /**
     * Creates issue warning message
     * @param  {string} message
     * @return void
     * @memberof Logger
     * @see https://docs.microsoft.com/en-us/azure/devops/pipelines/scripts/logging-commands?view=azure-devops&tabs=bash#example-log-a-warning-about-a-specific-place-in-a-file
     */
    public logIssueWarning(message: string): void {
        return this.logIssue(message, LOG_ISSUE_TYPES.WARNING);
    }

    /**
     * Creates issue error message
     * @param  {string} message
     * @return void
     * @memberof Logger
     * @see https://docs.microsoft.com/en-us/azure/devops/pipelines/scripts/logging-commands?view=azure-devops&tabs=bash#example-log-an-error
     */
    public logIssueError(message: string): void {
        return this.logIssue(message, LOG_ISSUE_TYPES.ERROR);
    }

    private complete(message: string, result: string): void {
        return this.logger.info(message, {templateId: MESSAGE_TYPES.COMPLETE, result});
    }

    private logIssue(message: string, type: string): void {
        return this.logger.info(message, {templateId: MESSAGE_TYPES.LOG_ISSUE, type});
    }
}