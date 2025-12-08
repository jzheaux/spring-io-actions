const core = require("@actions/core");

const { Inputs } = require("./inputs");
const { Milestones } = require("../milestones");
const { Version } = require("../versions");

const inputs = new Inputs();
const milestones = new Milestones(
	inputs.milestoneToken,
	inputs.milestoneRepository,
);

async function run() {
	if (!inputs.version.endsWith("-SNAPSHOT")) {
		core.setFailed(
			"Please specify a SNAPSHOT release version; it's best-matching scheduled release will be returned",
		);
		return;
	}
	const version = new Version(inputs.version);
	const milestone = milestones.findEarliestOpenMilestoneInGeneration({
		major: version.major,
		minor: version.minor,
	});
	if (!milestone) {
		core.setOutput("release-version", "");
		return;
	}
	console.log(`Today's release version is ${milestone.name}`);
	core.setOutput("release-version", milestone.name);
}

if (require.main === module) {
	run();
}

module.exports = {
	run,
};
