const core = require('@actions/core');
const { Inputs } = require('../src/announce-on-gchat/inputs');
const { Announce } = require('../src/announce');
const { run } = require('../src/announce-on-gchat/run');

jest.mock('@actions/core');
jest.mock('../src/announce');
jest.mock('../src/announce-on-gchat/inputs');

describe('announce-on-gchat', () => {
	beforeEach(() => {
		process.env.GITHUB_REPOSITORY = 'owner/repo';
	});

	it('announces a release', async () => {
		Inputs.mockImplementation(() => ({
			webhookUrl: 'https://example.com',
			projectVersion: '1.2.3',
			get projectName() {
				return process.env.GITHUB_REPOSITORY.split('/')[1];
			}
		}));
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
