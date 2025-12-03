const core = require("@actions/core");
const { Milestones } = require("../milestones");

async function run() {
  try {
    const milestoneTitle = core.getInput("milestone-title");
    const token = core.getInput("repository-token");
    const repository =
      core.getInput("repository-name") || process.env.GITHUB_REPOSITORY;
    const milestones = new Milestones(token, repository);
    await milestones.closeMilestone(milestoneTitle);
  } catch (error) {
    core.setFailed(error.message);
  }
}

if (require.main === module) {
  run();
}

module.exports = run;
