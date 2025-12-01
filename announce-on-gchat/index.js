const core = require('@actions/core');
const { postMessage } = require('../src/gchat');

async function run() {
  try {
    const webhookUrl = core.getInput('gchat-webhook-url');
    const projectVersion = core.getInput('project-version');
    let projectName = core.getInput('project-name');
    if (!projectName) {
      projectName = process.env.GITHUB_REPOSITORY.split('/')[1];
    }
    const message = `${projectName}-announcing \`${projectVersion}\` is available now`;
    await postMessage(webhookUrl, message);
  } catch (error) {
    core.setFailed(error.message);
  }
}

if (require.main === module) {
  run();
}

module.exports = run;
