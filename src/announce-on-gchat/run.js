const core = require('@actions/core');
const { Inputs } = require('./inputs');
const { Announce } = require('../gchat');

async function run() {
    const inputs = new Inputs();
    const webhookUrl = inputs.webhookUrl;
    const projectVersion = inputs.projectVersion;
    const projectName = inputs.projectName;
    const announce = new Announce(webhookUrl, projectName);
    try {
        await announce.announceRelease(projectVersion);
    } catch (error) {
        core.setFailed(error.message);
    }
}

module.exports = { run };
