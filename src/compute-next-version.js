const versions = require('./versions');
const core = require('@actions/core');
const website = require('./website')

const { Milestones } = require('./milestones');
const { WebsiteContentManager } = require('./website');
const { getWeekOfMonthAndDayOfWeek } = require('./lib');

const repository = process.env.GITHUB_REPOSITORY;
const websiteRepository = computeInput("website-repository", () => website.computeWebsiteRepository(repository));
const slug = computeInput("project-slug", () => website.computeSlug(repository));
const milestonesToken = core.getInput("milestones-token", { required: true })
const websiteToken = core.getInput("website-token", { required : true });

const milestones = new Milestones(milestonesToken, repository);
const projects = new WebsiteContentManager(websiteToken, websiteRepository, slug);

async function run() {
    const currentVersion = core.getInput("current-version", { required : true });
    const currentMilestone = await milestones.findMilestoneByName(currentVersion);
    if (!currentMilestone || !currentMilestone.dueDate) {
        core.setFailed(`Could not find milestone ${currentVersion} or it has no due date.`);
        return;
    }
    const dueDate = new Date(currentMilestone.dueDate);
    const { dayOfWeek, weekOfMonth } = getWeekOfMonthAndDayOfWeek(dueDate);
    const versionType = repository.endsWith("-commercial") ? "enterprise" : "oss";
    const version = versions.version(currentVersion, dueDate, versionType);
    const generation = await _getGeneration(version);
    if (!generation) {
        core.setFailed(`Could not find generation for version ${currentVersion}.`);
        return;
    }
    generation.dayOfWeek = dayOfWeek;
    generation.weekOfMonth = weekOfMonth;
    const release = generation.nextRelease(version);
    if (!release) {
        core.setFailed(`Could not calculate next release for version ${currentVersion}.`);
        return;
    }
    core.setOutput("next-version", release.toString());
    core.setOutput("next-version-type", release.type);
    core.setOutput("next-version-date", release.dueDate.toISOString().substring(0, 10));
}

async function _getGeneration(version) {
    try {
        return await projects.getGenerationByVersion(version);
    } catch (error) {
        core.setFailed(error);
    }
}

function computeInput(name, compute) {
    const input = core.getInput(name);
    if (input) {
        return input;
    }
    return compute();
}

module.exports = {
    run
}