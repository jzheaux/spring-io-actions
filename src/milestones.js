const { Octokit } = require("@octokit/rest");
/**
 * Helper for working with GitHub milestones via Octokit.
 *
 * Usage:
 *   const milestones = new Milestones(process.env.GITHUB_TOKEN);
 */
class Milestones {
  /**
   * @param token the GH token needed to query milestones
   * @param repo the GH repository to operate on
   */
  constructor(token, repo) {
    this.octokit = new Octokit({ auth: token });
    this.repo = repo;
    this.milestoneType = this.repo.endsWith("-commercial")
      ? "enterprise"
      : "oss";
  }

  /**
   * Internal helper to find a milestone by title (name).
   * Searches across all states (open + closed).
   *
   * @param {string} title
   * @returns {Promise<null | { number: number, name: string, dueDate: Date | null }>}
   */
  async findMilestoneByName(title) {
    const { data: milestones } = await this.octokit.rest.issues.listMilestones({
      owner: this.repo.split("/")[0],
      repo: this.repo.split("/")[1],
      state: "all",
      per_page: 100,
    });

    const m = milestones.find((m) => m.title === title);
    if (!m) {
      return null;
    }

    return {
      number: m.number,
      name: m.title,
      dueDate: m.due_on ? new Date(m.due_on) : null,
      type: this.milestoneType,
    };
  }

  async closeMilestone(title) {
    const milestone = await this.findMilestoneByName(title);
    if (milestone) {
      await this.octokit.rest.issues.updateMilestone({
        owner: this.repo.split("/")[0],
        repo: this.repo.split("/")[1],
        milestone_number: milestone.number,
        state: "closed",
      });
    }
  }

  async scheduleMilestone(title, date, description) {
    const milestone = await this.findMilestoneByName(title);
    const dueDate = new Date(date).toISOString();
    if (milestone) {
      await this.octokit.rest.issues.updateMilestone({
        owner: this.repo.split("/")[0],
        repo: this.repo.split("/")[1],
        milestone_number: milestone.number,
        due_on: dueDate,
        description: description,
      });
    } else {
      await this.octokit.rest.issues.createMilestone({
        owner: this.repo.split("/")[0],
        repo: this.repo.split("/")[1],
        title: title,
        due_on: dueDate,
        description: description,
      });
    }
  }
}

module.exports = {
  Milestones,
};
