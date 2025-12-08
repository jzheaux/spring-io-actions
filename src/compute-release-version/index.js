const core = require("@actions/core");

const { Inputs } = require("./inputs");
const { Milestones } = require("../milestones");
const { Website } = require("../website");
const { Version } = require("../versions");

const inputs = new Inputs();
const milestones = new Milestones(
	inputs.milestoneToken,
	inputs.milestoneRepository,
);
const projects = new Website(inputs);

async function run() {
	if (!inputs.milestoneTitle.endsWith("-SNAPSHOT")) {
		core.setFailed(
			"Please specify a SNAPSHOT release version; it's best-matching scheduled release will be returned",
		);
		return;
	}
	const version = new Version(inputs.milestoneTitle);
	const major = version.major;
	const minor = version.minor;
	const milestone = milestones.findEarliestOpenMilestoneInGeneration({
		major,
		minor,
	});
	if (!milestone) {
		core.setFailed(
			`Could not find open milestone in the same generation as ${inputs.milestoneTitle}.`,
		);
		return;
	}
	const release = Version.fromMilestone(milestone);
	const releaseVersion = release.version;
	console.log(`Next version is ${releaseVersion}`);
	core.setOutput("release-version", releaseVersion);
}

if (require.main === module) {
	run();
}

module.exports = {
	run,
};
