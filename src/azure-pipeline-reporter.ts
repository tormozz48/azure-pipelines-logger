import { ConsolaLogObject, ConsolaReporter } from 'consola';
import * as dateFormat from 'dateformat';

type TemplateParams = {message?: string, result?: string, type?: string};

type ReporterOptions = {showDate?: boolean, dateFormat?: string};

// eslint-disable-next-line no-shadow
export enum MESSAGE_TYPES {
    GROUP_BEGIN = 'begin_group',
    GROUP_END = 'end_group',
    DEBUG = 'debug',
    WARNING = 'warning',
    ERROR = 'error',
    SECTION = 'section',
    RUN_COMMAND = 'run_command',
    COMPLETE = 'complete',
    LOG_ISSUE = 'log_issue'
}

export class AzurePipelineReporter implements ConsolaReporter {
    private options: ReporterOptions;

    constructor(options: ReporterOptions) {
        this.options = options;
    }

    public log(logObject: ConsolaLogObject): void {
        const message = this.options.showDate ?
            `${ dateFormat(logObject.date, this.options.dateFormat) } ${ logObject.args[0] as string }` :
            logObject.args[0];

        // eslint-disable-next-line prefer-destructuring
        const { templateId, ...messageArgs } = logObject.args[1];

        const template: (params?: TemplateParams) => string = this.selectTemplate(templateId);
        const logText = `${ template({ message, ...messageArgs }) }\n`;

        // eslint-disable-next-line no-unused-expressions
        logObject.level < 2 ?
            process.stderr.write(logText) :
            process.stdout.write(logText);
    }

    private selectTemplate(templateId: string): (params?: TemplateParams) => string {
        switch (templateId) {
        case MESSAGE_TYPES.GROUP_BEGIN:
            return (params: TemplateParams) => `##[group]${ params.message }`;

        case MESSAGE_TYPES.GROUP_END:
            return () => '##[endgroup]';

        case MESSAGE_TYPES.RUN_COMMAND:
            return (params: TemplateParams) => `##[command]${ params.message }`;

        case MESSAGE_TYPES.DEBUG:
            return (params: TemplateParams) => `##[debug]${ params.message }`;

        case MESSAGE_TYPES.WARNING:
            return (params: TemplateParams) => `##[warning]${ params.message }`;

        case MESSAGE_TYPES.ERROR:
            return (params: TemplateParams) => `##[error]${ params.message }`;

        case MESSAGE_TYPES.SECTION:
            return (params: TemplateParams) => `##[section]${ params.message }`;

        case MESSAGE_TYPES.COMPLETE:
            return (params: TemplateParams) => `##vso[task.complete result=${ params.result };]${ params.message }`;

        case MESSAGE_TYPES.LOG_ISSUE:
            return (params: TemplateParams) => `##vso[task.logissue type=${ params.type };]${ params.message }`;

        default:
            throw new Error('Unknown template identifier');
        }
    }
}
