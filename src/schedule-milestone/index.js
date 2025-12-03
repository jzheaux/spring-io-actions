const core = require("@actions/core");
const { Milestones } = require("../milestones");

async function run() {
  try {
    const milestoneTitle = core.getInput("milestone-title");
    const milestoneDate = core.getInput("milestone-date");
    const milestoneDescription = core.getInput("milestone-description");
    const repositoryName =
      core.getInput("repository-name") || process.env.GITHUB_REPOSITORY;
    const token = core.getInput("repository-token") || process.env.GITHUB_TOKEN;
    const milestones = new Milestones(token, repositoryName);
    await milestones.scheduleMilestone(
      milestoneTitle,
      milestoneDate,
      milestoneDescription,
    );
  } catch (error) {
    core.setFailed(error.message);
  }
}

if (require.main === module) {
  run();
}

module.exports = run;
