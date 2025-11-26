const core = require('@actions/core');

const { Inputs } = require("inputs")
const { Milestones } = require('../milestones');
const { Website } = require('../website');
const { Version } = require('../versions');

const inputs = new Inputs();
const milestones = new Milestones(inputs.milestonesToken);
const projects = new Website(inputs);

async function run() {
    const version = await _getVersion();
    if (!version) {
        core.setFailed(`Could not find milestone ${inputs.currentVersion} or it has no due date.`);
        return;
    }
    const generation = await _getGeneration(version);
    if (!generation) {
        core.setFailed(`Could not find generation for version ${inputs.currentVersion}.`);
        return;
    }
    const release = generation.nextRelease(version);
    if (!release) {
        core.setFailed(`Could not calculate next release for version ${inputs.currentVersion}.`);
        return;
    }
    core.setOutput("next-version", release.toString());
    core.setOutput("next-version-type", release.type);
    core.setOutput("next-version-date", release.dueDate.toISOString().substring(0, 10));
}

async function _getVersion() {
    const milestone = await milestones.findMilestoneByName(inputs.currentVersion);
    if (!milestone || !milestone.dueDate) {
        return null;
    }
    return Version.fromMilestone(milestone);
}

async function _getGeneration(version) {
    try {
        return await projects.getGenerationByVersion(version);
    } catch (error) {
        core.setFailed(error);
    }
}

module.exports = {
    run
}