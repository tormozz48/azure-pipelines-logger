import 'jest-sinon';

import * as sinon from 'sinon';

import { Logger } from '.';

describe('azure-pipelines-logger', () => {
    const sandbox: sinon.SinonSandbox = sinon.createSandbox({});

    let outSpy: sinon.SinonSpy;
    let errSpy: sinon.SinonSpy;

    beforeEach(() => {
        outSpy = sandbox.spy(process.stdout, 'write');
        errSpy = sandbox.spy(process.stderr, 'write');
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('beginGroup', () => {
        test('should log message which opens group', () => {
            (new Logger()).beginGroup('Some Group');

            expect(outSpy.firstCall.args[0]).toEqual('##[group]Some Group\n');
        });
    });


    describe('endGroup', () => {
        test('should log message which closes group', () => {
            (new Logger()).endGroup();

            expect(outSpy.firstCall.args[0]).toEqual('##[endgroup]\n');
        });
    });

    describe('startSection', () => {
        test('should log message for start new secion', () => {
            (new Logger()).startSection('foo');

            expect(outSpy.firstCall.args[0]).toEqual('##[section]foo\n');
        });
    });

    describe('runCommand', () => {
        test('should log message for explain running command', () => {
            (new Logger()).runCommand('foo');

            expect(outSpy.firstCall.args[0]).toEqual('##[command]foo\n');
        });
    });

    describe('debug', () => {
        test('should log debug message', () => {
            (new Logger()).debug('Hello World');

            expect(outSpy.firstCall.args[0]).toEqual('##[debug]Hello World\n');
        });

        test('should log message with included date', () => {
            (new Logger({showDate: true})).debug('Hello World');

            expect(outSpy.firstCall.args[0]).toMatch(/##\[debug]\d{2}:\d{2}:\d{2}\sHello\sWorld/);
        });

        test('should not log message if "mock mode" enabled', () => {
            (new Logger({mock: true})).debug('Hello World');

            expect(outSpy).not.toHaveBeenCalled();
        });
    });

    describe('info', () => {
        test('should log info message', () => {
            (new Logger()).info('Hello World');

            expect(outSpy.firstCall.args[0]).toEqual('##[debug]Hello World\n');
        });

        test('should log message with included date', () => {
            (new Logger({showDate: true})).info('Hello World');

            expect(outSpy.firstCall.args[0]).toMatch(/##\[debug]\d{2}:\d{2}:\d{2}\sHello\sWorld/);
        });

        test('should not log message if "mock mode" enabled', () => {
            (new Logger({mock: true})).info('Hello World');

            expect(outSpy).not.toHaveBeenCalled();
        });
    });

    describe('warn', () => {
        test('should log warning message', () => {
            (new Logger()).warn('Some Warning');

            expect(errSpy.firstCall.args[0]).toEqual('##[warning]Some Warning\n');
        });

        test('should log message with included date', () => {
            (new Logger({showDate: true})).warn('Some Warning');

            expect(errSpy.firstCall.args[0]).toMatch(/##\[warning]\d{2}:\d{2}:\d{2}\sSome\sWarning/);
        });

        test('should not log message if "mock mode" enabled', () => {
            (new Logger({mock: true})).warn('Some Warning');

            expect(errSpy).not.toHaveBeenCalled();
        });
    });

    describe('error', () => {
        test('should log warning message', () => {
            (new Logger()).error('Some Error');

            expect(errSpy.firstCall.args[0]).toEqual('##[error]Some Error\n');
        });

        test('should log message with included date', () => {
            (new Logger({showDate: true})).error('Some Error');

            expect(errSpy.firstCall.args[0]).toMatch(/##\[error]\d{2}:\d{2}:\d{2}\sSome\sError/);
        });

        test('should not log message if "mock mode" enabled', () => {
            (new Logger({mock: true})).error('Some Error');

            expect(errSpy).not.toHaveBeenCalled();
        });
    });

    describe('completeSuccess', () => {
        test('should log message for indicate operation success status', () => {
            (new Logger()).completeSuccess('Some Message');

            expect(outSpy.firstCall.args[0]).toEqual('##vso[task.complete result=Succeeded;]Some Message\n');
        });
    });

    describe('completeWarning', () => {
        test('should log message for indicate operation warning status', () => {
            (new Logger()).completeWarning('Some Warning');

            expect(outSpy.firstCall.args[0]).toEqual('##vso[task.complete result=SucceededWithIssues;]Some Warning\n');
        });
    });

    describe('completeError', () => {
        test('should log message for indicate operation error status', () => {
            (new Logger()).completeError('Some Error');

            expect(outSpy.firstCall.args[0]).toEqual('##vso[task.complete result=Failed;]Some Error\n');
        });
    });

    describe('logIssueWarning', () => {
        test('should log message for issue warning', () => {
            (new Logger()).logIssueWarning('Some Warning');

            expect(outSpy.firstCall.args[0]).toEqual('##vso[task.logissue type=warning;]Some Warning\n');
        });
    });

    describe('logIssueError', () => {
        test('should log message for issue error', () => {
            (new Logger()).logIssueError('Some Error');

            expect(outSpy.firstCall.args[0]).toEqual('##vso[task.logissue type=error;]Some Error\n');
        });
    });
});