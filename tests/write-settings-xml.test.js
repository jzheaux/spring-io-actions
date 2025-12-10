const core = require('@actions/core');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { run } = require('../src/write-settings-xml');

jest.mock('@actions/core');

describe('write-settings-xml', () => {
    let tmpdir;
    let writeFileSyncSpy, mkdirSyncSpy, existsSyncSpy;

    beforeEach(() => {
        tmpdir = os.tmpdir();
        jest.spyOn(os, 'homedir').mockReturnValue(tmpdir);
        writeFileSyncSpy = jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
        mkdirSyncSpy = jest.spyOn(fs, 'mkdirSync').mockImplementation(() => {});
        existsSyncSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(false); // Default to not existing
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    it('should do nothing if no url is provided', () => {
        core.getInput.mockReturnValue('');
        run();
        expect(writeFileSyncSpy).not.toHaveBeenCalled();
    });

    it('should create .m2 directory if it does not exist', () => {
        core.getInput.mockImplementation((name) => {
            if (name === 'artifact-repository-url') {
                return 'https://repo.example.com';
            }
            return '';
        });
        existsSyncSpy.mockReturnValue(false);
        run();
        const m2 = path.join(tmpdir, '.m2');
        expect(mkdirSyncSpy).toHaveBeenCalledWith(m2, { recursive: true });
    });

    it('should not create .m2 directory if it exists', () => {
        core.getInput.mockImplementation((name) => {
            if (name === 'artifact-repository-url') {
                return 'https://repo.example.com';
            }
            return '';
        });
        existsSyncSpy.mockReturnValue(true);
        run();
        expect(mkdirSyncSpy).not.toHaveBeenCalled();
    });


    it('should write settings.xml without servers if only a url is provided', () => {
        core.getInput.mockImplementation((name) => {
            if (name === 'artifact-repository-url') {
                return 'https://repo.example.com';
            }
            return '';
        });
        run();
        const m2 = path.join(tmpdir, '.m2');
        const settings = path.join(m2, 'settings.xml');
        expect(writeFileSyncSpy).toHaveBeenCalledWith(settings, expect.stringContaining('<url>https://repo.example.com</url>'));
        expect(writeFileSyncSpy).not.toHaveBeenCalledWith(settings, expect.stringContaining('<servers>'));
    });

    it('should write settings.xml with credentials', () => {
        core.getInput.mockImplementation((name) => {
            if (name === 'artifact-repository-url') {
                return 'https://repo.example.com';
            }
            if (name === 'artifact-repository-username') {
                return 'user';
            }
            if (name === 'artifact-repository-password') {
                return 'password';
            }
            return '';
        });
        run();
        const m2 = path.join(tmpdir, '.m2');
        const settings = path.join(m2, 'settings.xml');
        expect(writeFileSyncSpy).toHaveBeenCalledWith(settings, expect.stringContaining('<username>user</username>'));
        expect(writeFileSyncSpy).toHaveBeenCalledWith(settings, expect.stringContaining('<password>password</password>'));
    });

    it('should throw an error if username is provided without url', () => {
        core.getInput.mockImplementation((name) => {
            if (name === 'artifact-repository-username') {
                return 'user';
            }
            return '';
        });
        expect(() => run()).toThrow('`artifact-repository-username` requires `artifact-repository-url` to be set');
    });

    it('should throw an error if password is provided without username', () => {
        core.getInput.mockImplementation((name) => {
            if (name === 'artifact-repository-url') {
                return 'https://repo.example.com';
            }
            if (name === 'artifact-repository-password') {
                return 'password';
            }
            return '';
        });
        expect(() => run()).toThrow('`artifact-repository-password` requires `artifact-repository-username` to be set');
    });
});
