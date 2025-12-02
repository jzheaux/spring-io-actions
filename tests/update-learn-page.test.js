const core = require('@actions/core');
const { Octokit } = require('octokit');
const { Inputs } = require('../update-learn-page/inputs');
const { run } = require('../src/update-learn-page/run');

jest.mock('@actions/core');
jest.mock('octokit');
jest.mock('../update-learn-page/inputs');

describe('Update Learn Page Action', () => {
    let inputs;
    let octokit;

    beforeEach(() => {
        inputs = {
            githubToken: 'token',
            version: '1.2.3',
            projectName: 'spring-projects/spring-boot',
            websiteRepository: 'spring-io/spring-website-content',
            projectSlug: 'spring-boot',
            refDocUrl: 'https://docs.spring.io/spring-boot/reference/{version}/index.html',
            apiDocUrl: 'https://docs.spring.io/spring-boot/site/docs/{version}/api/',
            isAntora: true
        };
        Inputs.mockImplementation(() => inputs);
        octokit = {
            repos: {
                getContent: jest.fn(),
                createOrUpdateFileContents: jest.fn()
            }
        };
        Octokit.mockImplementation(() => octokit);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should fail if the version is a SNAPSHOT', async () => {
        inputs.version = '1.2.3-SNAPSHOT';
        await run();
        expect(core.setFailed).toHaveBeenCalledWith("Please specify a non-SNAPSHOT release version to publish; it's accompanying SNAPSHOT version will also be published");
    });

    it('should create a new documentation file', async () => {
        octokit.repos.getContent.mockRejectedValue({ status: 404 });
        await run();
        expect(octokit.repos.createOrUpdateFileContents).toHaveBeenCalled();
        const call = octokit.repos.createOrUpdateFileContents.mock.calls[0][0];
        expect(call.owner).toBe('spring-io');
        expect(call.repo).toBe('spring-website-content');
        expect(call.path).toBe('project/spring-boot/documentation.json');
        const content = JSON.parse(Buffer.from(call.content, 'base64').toString());
        expect(content.length).toBe(2);
        expect(content[0].version).toBe('1.2.4-SNAPSHOT');
        expect(content[1].version).toBe('1.2.3');
        expect(content[1].referenceDocUrl).toBe('https://docs.spring.io/spring-boot/reference/{version}/index.html');
    });

    it('should update an existing documentation file', async () => {
        const existing = [
            {
                version: '1.1.0',
                status: 'GENERAL_AVAILABILITY',
                current: true
            }
        ];
        const existingContent = Buffer.from(JSON.stringify(existing)).toString('base64');
        octokit.repos.getContent.mockResolvedValue({ data: { content: existingContent, sha: 'sha' } });
        await run();
        expect(octokit.repos.createOrUpdateFileContents).toHaveBeenCalled();
        const call = octokit.repos.createOrUpdateFileContents.mock.calls[0][0];
        const content = JSON.parse(Buffer.from(call.content, 'base64').toString());
        expect(content.length).toBe(3);
        expect(content[0].version).toBe('1.2.4-SNAPSHOT');
        expect(content[1].version).toBe('1.2.3');
        expect(content[2].version).toBe('1.1.0');
    });
});
