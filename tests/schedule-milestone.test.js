const core = require('@actions/core');
const { Milestones } = require('../src/milestones');
const run = require('../src/schedule-milestone');

jest.mock('@actions/core');
jest.mock('../src/milestones');

describe('schedule-milestone', () => {
	it('schedules a milestone', async () => {
		core.getInput.mockImplementation((name) => {
			if (name === 'milestone-title') {
				return 'title';
			}
			if (name === 'milestone-date') {
				return '2025-12-25';
			}
			if (name === 'milestone-description') {
				return 'description';
			}
		});
		await run();
		expect(Milestones.prototype.scheduleMilestone).toHaveBeenCalledWith('title', '2025-12-25', 'description');
	});

	it('handles errors', async () => {
		core.getInput.mockImplementation(() => {
			throw new Error('error');
		});
		await run();
		expect(core.setFailed).toHaveBeenCalledWith('error');
	});
});
