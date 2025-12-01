const { Octokit } = require("octokit");
/**
 * Helper for working with GitHub milestones via Octokit.
 *
 * Usage:
 *   const milestones = new Milestones(process.env.GITHUB_TOKEN);
 */
class Milestones {
    /**
     * @param token the GH token needed to query milestones
     */
    constructor(token) {
        this.octokit = new Octokit({ auth: token });
        this.repo = process.env.GITHUB_REPOSITORY;
        this.milestoneType = this.repo.endsWith("-commercial") ? "enterprise" : "oss";
    }

    /**
     * Internal helper to find a milestone by title (name).
     * Searches across all states (open + closed).
     *
     * @param {string} title
     * @returns {Promise<null | { number: number, name: string, dueDate: string | null }>}
     */
    async findMilestoneByName(title) {
        const { data: milestones } = await this.octokit.rest.issues.listMilestones({
            repo: this.repo,
            state: "all",
            per_page: 100,
        });

        const m = milestones.find(m => m.title === title);
        if (!m) {
            return null;
        }

        return {
            number: m.number,
            name: m.title,
            dueDate: m.due_on || null,
            type: this.milestoneType
        };
    }

    async closeMilestone(title) {
        const milestone = await this.findMilestoneByName(title);
        if (milestone) {
            await this.octokit.rest.issues.updateMilestone({
                owner: this.repo.split('/')[0],
                repo: this.repo.split('/')[1],
                milestone_number: milestone.number,
                state: 'closed'
            });
        }
    }

    async scheduleMilestone(title, date, description) {
        const milestone = await this.findMilestoneByName(title);
        if (milestone) {
            await this.octokit.rest.issues.updateMilestone({
                owner: this.repo.split('/')[0],
                repo: this.repo.split('/')[1],
                milestone_number: milestone.number,
                due_on: date,
                description: description
            });
        } else {
            await this.octokit.rest.issues.createMilestone({
                owner: this.repo.split('/')[0],
                repo: this.repo.split('/')[1],
                title: title,
                due_on: date,
                description: description
            });
        }
    }
}

module.exports = {
    Milestones
}
