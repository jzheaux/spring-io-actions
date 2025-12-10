const run = require('../src/write-init-gradle');
const core = require('@actions/core');
const os = require('os');
const fs = require('fs');
const path = require('path');

jest.mock('@actions/core');

describe('Write Init Gradle', () => {
    let tempDir;
    let homedirSpy;

    beforeEach(() => {
        tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'write-init-gradle-test-'));
        homedirSpy = jest.spyOn(os, 'homedir').mockReturnValue(tempDir);
    });

    afterEach(() => {
        homedirSpy.mockRestore();
        fs.rmSync(tempDir, { recursive: true, force: true });
    });

    it('should create init.gradle with credentials', async () => {
        core.getInput.mockImplementation((name) => {
            switch (name) {
                case 'artifact-repository-url':
                    return 'https://repo.example.com';
                case 'artifact-repository-username':
                    return 'user';
                case 'artifact-repository-password':
                    return 'password';
                default:
                    return '';
            }
        });

        await run();

        const initGradlePath = path.join(tempDir, '.gradle', 'init.gradle');
        expect(fs.existsSync(initGradlePath)).toBe(true);
        const content = fs.readFileSync(initGradlePath, 'utf8');
        expect(content).toContain("url 'https://repo.example.com'");
        expect(content).toContain("username = 'user'");
        expect(content).toContain("password = 'password'");
    });

    it('should create init.gradle without credentials', async () => {
        core.getInput.mockImplementation((name) => {
            switch (name) {
                case 'artifact-repository-url':
                    return 'https://repo.example.com';
                default:
                    return '';
            }
        });

        await run();

        const initGradlePath = path.join(tempDir, '.gradle', 'init.gradle');
        expect(fs.existsSync(initGradlePath)).toBe(true);
        const content = fs.readFileSync(initGradlePath, 'utf8');
        expect(content).toContain("url 'https://repo.example.com'");
        expect(content).not.toContain('credentials');
    });

    it('should fail if artifact-repository-url is not set', async () => {
        core.getInput.mockImplementation((name) => {
            if (name === 'artifact-repository-url') {
                throw new Error('Input required and not supplied: artifact-repository-url');
            }
            return '';
        });

        await run();

        expect(core.setFailed).toHaveBeenCalledWith('Input required and not supplied: artifact-repository-url');
    });
});
