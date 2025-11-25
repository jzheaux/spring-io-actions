const versions = require('../versions');
const core = require('@actions/core');

function main() {
    const version = core.getInput("version");
    core.setOutput("version", versions.nextRelease(version));
}