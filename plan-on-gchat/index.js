const core = require('@actions/core');
const { postMessage } = require('../src/gchat');

async function run() {
  try {
    const webhookUrl = core.getInput('gchat-webhook-url');
    const milestoneTitle = core.getInput('milestone-title');
    const milestoneDate = core.getInput('milestone-date');
    let projectName = core.getInput('project-name');
    if (!projectName) {
      projectName = process.env.GITHUB_REPOSITORY.split('/')[1];
    }
    const message = `${projectName}-planning \`${milestoneTitle}\` on ${milestoneDate}`;
    await postMessage(webhookUrl, message);
  } catch (error) {
    core.setFailed(error.message);
  }
}

if (require.main === module) {
  run();
}

module.exports = run;
