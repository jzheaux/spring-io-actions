const core = require('@actions/core');
const gchat = require('../src/gchat');
const run = require('../plan-on-gchat/index');

jest.mock('@actions/core');
jest.mock('../src/gchat');

describe('plan-on-gchat', () => {
	beforeEach(() => {
		process.env.GITHUB_REPOSITORY = 'owner/repo';
	});

	it('plans a release', async () => {
		core.getInput.mockImplementation((name) => {
			if (name === 'gchat-webhook-url') {
				return 'https://example.com';
			}
			if (name === 'milestone-title') {
				return 'title';
			}
			if (name === 'milestone-date') {
				return '2025-12-25';
			}
		});
		await run();
		expect(gchat.postMessage).toHaveBeenCalledWith('https://example.com', 'repo-planning `title` on 2025-12-25');
	});

	it('uses project-name', async () => {
		core.getInput.mockImplementation((name) => {
			if (name === 'gchat-webhook-url') {
				return 'https://example.com';
			}
			if (name === 'milestone-title') {
				return 'title';
			}
			if (name === 'milestone-date') {
				return '2025-12-25';
			}
			if (name === 'project-name') {
				return 'project';
			}
		});
		await run();
		expect(gchat.postMessage).toHaveBeenCalledWith('https://example.com', 'project-planning `title` on 2025-12-25');
	});

	it('handles errors', async () => {
		core.getInput.mockImplementation(() => {
			throw new Error('error');
		});
		await run();
		expect(core.setFailed).toHaveBeenCalledWith('error');
	});
});
