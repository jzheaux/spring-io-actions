const core = require("@actions/core");
const {Inputs} = require("./inputs");
const {Milestones} = require("../milestones");

async function run() {
    const inputs = new Inputs();
    const milestones = new Milestones(inputs.milestoneToken, inputs.milestoneRepository);
    try {
        await milestones.closeMilestone(inputs.milestoneTitle);
    } catch (error) {
        core.setFailed(error.message);
    }
}

if (require.main === module) {
    run();
}

module.exports = run;
