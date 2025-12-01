const core = require('@actions/core');
const { Milestones } = require('../src/milestones');

async function run() {
  try {
    const milestoneTitle = core.getInput('milestone-title');
    const token = process.env.GITHUB_TOKEN;
    const milestones = new Milestones(token);
    await milestones.closeMilestone(milestoneTitle);
  } catch (error) {
    core.setFailed(error.message);
  }
}

if (require.main === module) {
  run();
}

module.exports = run;
