const core = require('@actions/core');
const gchat = require('../src/gchat');
const run = require('../announce-on-gchat/index');

jest.mock('@actions/core');
jest.mock('../src/gchat');

describe('announce-on-gchat', () => {
	beforeEach(() => {
		process.env.GITHUB_REPOSITORY = 'owner/repo';
	});

	it('announces a release', async () => {
		core.getInput.mockImplementation((name) => {
			if (name === 'gchat-webhook-url') {
				return 'https://example.com';
			}
			if (name === 'project-version') {
				return '1.2.3';
			}
		});
		await run();
		expect(gchat.postMessage).toHaveBeenCalledWith('https://example.com', 'repo-announcing `1.2.3` is available now');
	});

	it('uses project-name', async () => {
		core.getInput.mockImplementation((name) => {
			if (name === 'gchat-webhook-url') {
				return 'https://example.com';
			}
			if (name === 'project-version') {
				return '1.2.3';
			}
			if (name === 'project-name') {
				return 'project';
			}
		});
		await run();
		expect(gchat.postMessage).toHaveBeenCalledWith('https://example.com', 'project-announcing `1.2.3` is available now');
	});

	it('handles errors', async () => {
		core.getInput.mockImplementation(() => {
			throw new Error('error');
		});
		await run();
		expect(core.setFailed).toHaveBeenCalledWith('error');
	});
});
