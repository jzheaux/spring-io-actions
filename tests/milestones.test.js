const { Milestones } = require('../src/milestones');

jest.mock('@octokit/rest');

const { Octokit } = require('@octokit/rest');

describe('Milestones', () => {
	let milestones;
	let mockUpdateMilestone;
	let mockCreateMilestone;

	beforeEach(() => {
		process.env.GITHUB_REPOSITORY = 'owner/repo';
		mockUpdateMilestone = jest.fn();
		mockCreateMilestone = jest.fn();
		Octokit.mockImplementation(() => {
			return {
				rest: {
					issues: {
						updateMilestone: mockUpdateMilestone,
						createMilestone: mockCreateMilestone
					}
				}
			};
		});
		milestones = new Milestones('token', process.env.GITHUB_REPOSITORY);
		jest.clearAllMocks();
	});

	describe('closeMilestone', () => {
		it('closes a milestone', async () => {
			milestones.findMilestoneByName = jest.fn().mockResolvedValue({ number: 1 });
			await milestones.closeMilestone('title');
			expect(mockUpdateMilestone).toHaveBeenCalledWith({
				owner: 'owner',
				repo: 'repo',
				milestone_number: 1,
				state: 'closed'
			});
		});

		it('does nothing if milestone not found', async () => {
			milestones.findMilestoneByName = jest.fn().mockResolvedValue(null);
			await milestones.closeMilestone('title');
			expect(mockUpdateMilestone).not.toHaveBeenCalled();
		});
	});

	describe('scheduleMilestone', () => {
		it('updates an existing milestone', async () => {
			milestones.findMilestoneByName = jest.fn().mockResolvedValue({ number: 1 });
			await milestones.scheduleMilestone('title', '2025-12-25', 'description');
			expect(mockUpdateMilestone).toHaveBeenCalledWith({
				owner: 'owner',
				repo: 'repo',
				milestone_number: 1,
				due_on: '2025-12-25',
				description: 'description'
			});
		});

		it('creates a new milestone', async () => {
			milestones.findMilestoneByName = jest.fn().mockResolvedValue(null);
			await milestones.scheduleMilestone('title', '2025-12-25', 'description');
			expect(mockCreateMilestone).toHaveBeenCalledWith({
				owner: 'owner',
				repo: 'repo',
				title: 'title',
				due_on: '2025-12-25',
				description: 'description'
			});
		});
	});
});
