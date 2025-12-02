const core = require('@actions/core');
const { Inputs } = require('../src/announce-on-gchat/inputs');
const { Announce } = require('../src/gchat');
const { run } = require('../src/announce-on-gchat/run');

jest.mock('@actions/core');
jest.mock('../src/gchat');
jest.mock('../src/announce-on-gchat/inputs');

describe('announce-on-gchat', () => {
	beforeEach(() => {
		process.env.GITHUB_REPOSITORY = 'owner/repo';
	});

	it('announces a release', async () => {
		inputs = {
			webhookUrl: 'https://example.com',
			projectVersion: '1.2.3'
        };
        Inputs.mockImplementation(() => inputs);
		await run();
		expect(Announce.prototype.constructor).toHaveBeenCalledWith('https://example.com', 'repo');
		expect(Announce.prototype.announceRelease).toHaveBeenCalledWith('1.2.3');
	});

	it('uses project-name', async () => {
		inputs = {
			webhookUrl: 'https://example.com',
			projectVersion: '1.2.3',
			projectName: 'project'
        };
        Inputs.mockImplementation(() => inputs);
		await run();
		expect(Announce.prototype.constructor).toHaveBeenCalledWith('https://example.com', 'project');
		expect(Announce.prototype.announceRelease).toHaveBeenCalledWith('1.2.3');
	});

	it('handles errors', async () => {
		Announce.prototype.announceRelease.mockImplementation(() => {
			throw new Error('error');
		});
		await run();
		expect(core.setFailed).toHaveBeenCalledWith('error');
	});
});
