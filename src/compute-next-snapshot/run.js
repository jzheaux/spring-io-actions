const core = require('@actions/core');

const { Inputs } = require("inputs")
const { Version } = require('../versions');

const inputs = new Inputs();

async function run() {
    const version = new Version(inputs.currentVersion);
    const next = version.nextSnapshot();

    core.setOutput("next-snapshot", next.version());
}

module.exports = {
    run
}