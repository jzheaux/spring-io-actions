const core = require('@actions/core');
const { Milestones } = require('../src/milestones');
const run = require('../close-milestone/index');

jest.mock('@actions/core');
jest.mock('../src/milestones');

describe('close-milestone', () => {
	it('closes a milestone', async () => {
		core.getInput.mockReturnValue('title');
		await run();
		expect(core.getInput).toHaveBeenCalledWith('milestone-title');
		expect(Milestones.prototype.closeMilestone).toHaveBeenCalledWith('title');
	});

	it('handles errors', async () => {
		core.getInput.mockImplementation(() => {
			throw new Error('error');
		});
		await run();
		expect(core.setFailed).toHaveBeenCalledWith('error');
	});
});
