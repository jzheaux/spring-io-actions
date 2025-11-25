const { Octokit } = require("octokit");

/**
 * Helper for working with GitHub milestones via Octokit.
 *
 * Usage:
 *   const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
 *   const milestones = new Milestones(octokit, { owner: 'spring-io', repo: 'spring-security' });
 */
class Milestones {
    /**
     * @param {import("@octokit/rest").Octokit} octokit
     * @param {{ owner: string, repo: string }} repoInfo
     */
    constructor(token, repo) {
        this.octokit = new Octokit({ auth: token });
        this.repo = repo;
    }

    /**
     * Internal helper to find a milestone by title (name).
     * Searches across all states (open + closed).
     *
     * @param {string} title
     * @returns {Promise<null | { number: number, name: string, dueDate: string | null }>}
     */
    async findMilestoneByName(title) {
        // You can extend this to paginate if you have lots of milestones.
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
        };
    }

    /**
     * Create or update (patch) a milestone given a name and due date.
     * If a milestone with that name exists, it is patched.
     * If it does not exist, it is created.
     *
     * @param {string} name - Milestone title
     * @param {string | null} dueDate - ISO 8601 date string (e.g. "2025-12-31T00:00:00Z") or null to clear
     * @returns {Promise<{ name: string, dueDate: string | null }>}
     */
    async upsertMilestone(name, dueDate) {
        const existing = await this.findMilestoneByName(name);

        const due_on = dueDate || null;

        if (existing) {
            const { data: updated } = await this.octokit.rest.issues.updateMilestone({
                repo: this.repo,
                milestone_number: existing.number,
                title: name,
                due_on,
            });

            return {
                name: updated.title,
                dueDate: updated.due_on || null,
            };
        } else {
            const { data: created } = await this.octokit.rest.issues.createMilestone({
                repo: this.repo,
                title: name,
                due_on,
            });

            return {
                name: created.title,
                dueDate: created.due_on || null,
            };
        }
    }

    /**
     * Close a milestone by name, if it exists.
     *
     * @param {string} name
     * @returns {Promise<null | { name: string, dueDate: string | null }>}
     */
    async closeMilestoneByName(name) {
        const existing = await this.findMilestoneByName(name);
        if (!existing) {
            return null; // or throw new Error(`Milestone "${name}" not found`);
        }

        const { data: updated } = await this.octokit.rest.issues.updateMilestone({
            repo: this.repo,
            milestone_number: existing.number,
            state: "closed",
        });

        return {
            name: updated.title,
            dueDate: updated.due_on || null,
        };
    }
}

module.exports = {
    Milestones
}
