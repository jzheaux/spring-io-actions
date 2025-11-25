const versions = require('../versions');
const core = require('@actions/core');
const website = require('../website')

import { Milestones } from '../milestones'
import { WebsiteContentManager } from '../website'

const repository = process.env.GITHUB_REPOSITORY;
const websiteRepository = computeInput("website-repository", () => website.computeWebsiteRepository(repository));
const slug = computeInput("project-slug", () => website.computeSlug(repository));
const milestonesToken = core.getInput("milestones-token", { required: true })
const websiteToken = core.getInput("website-token", { required : true });

const milestones = new Milestones(milestonesToken, repository);
const projects = new WebsiteContentManager(websiteToken, websiteRepository, slug);

async function main() {
    const currentVersion = core.getInput("current-version", { required : true });
    const currentMilestone = milestones.findMilestoneByTitle(currentVersion);
    const versionType = repository.endsWith("-commercial") ? "enterprise" : "oss";
    version = versions.version(version, new Date(), versionType);
    const generation = await generation(token, websiteRepository, slug, version);
    generation.dayOfWeek = dayOfWeek;
    generation.weekOfMonth = weekOfMonth;
    const release = generation.nextRelease(version);
    core.setOutput("next-version", release.toString());
    core.setOutput("next-version-type", release.type);
    core.setOutput("next-version-date", release.dueDate);
}

async function generation(version) {
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