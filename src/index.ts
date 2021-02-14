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

type LoggerOptions = {
    level?: number,
    showDate?: boolean,
    dateFormat?: string,
    mock?: boolean
}

export class Logger {
    private readonly logger: Consola;
    private readonly options: LoggerOptions = {
        level: 4,
        showDate: false,
        dateFormat: 'isoTime',
        mock: false
    }

    constructor(options: LoggerOptions = {}) {
        this.options = Object.assign({}, this.options, options);

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
            this.logger.mockTypes(() => (() => {}));
        }
    }

    public beginGroup(message: string): void {
        this.logger.info(message, {templateId: MESSAGE_TYPES.GROUP_BEGIN});
    }

    public endGroup(): void {
        this.logger.info(null, {templateId: MESSAGE_TYPES.GROUP_END});
    }

    public startSection(message: string): void {
        this.logger.info(message, {templateId: MESSAGE_TYPES.SECTION});
    }

    public runCommand(message: string): void {
        this.logger.info(message, {templateId: MESSAGE_TYPES.RUN_COMMAND});
    }

    public debug(message: string): void {
        this.logger.debug(message, {templateId: MESSAGE_TYPES.DEBUG});
    }

    public info(message: string): void {
        this.logger.info(message, {templateId: MESSAGE_TYPES.DEBUG});
    }

    public warn(message: string): void {
        this.logger.debug(message, {templateId: MESSAGE_TYPES.WARNING});
    }

    public error(message: string): void {
        this.logger.debug(message, {templateId: MESSAGE_TYPES.ERROR});
    }

    public completeSuccess(message: string): void {
        return this.complete(message, COMPLETE_RESULT.SUCCESS);
    }

    public completeWarning(message: string): void {
        return this.complete(message, COMPLETE_RESULT.WARNING);
    }

    public completeError(message: string): void {
        return this.complete(message, COMPLETE_RESULT.ERROR);
    }

    public logIssueWarning(message: string): void {
        return this.logIssue(message, LOG_ISSUE_TYPES.WARNING);
    }

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