const core = require("@actions/core");
const { Inputs } = require("./inputs");
const { Announce } = require("../announce");

async function run() {
  const inputs = new Inputs();
  const webhookUrl = inputs.webhookUrl;
  const milestoneTitle = inputs.milestoneTitle;
  const milestoneDate = inputs.milestoneDate;
  const projectName = inputs.projectName;
  const announce = new Announce(webhookUrl, projectName);
  try {
    await announce.planRelease(milestoneTitle, milestoneDate);
  } catch (error) {
    core.setFailed(error.message);
  }
}

if (require.main === module) {
  run();
}

module.exports = { run };
