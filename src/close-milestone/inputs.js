const core = require("@actions/core");

class Inputs {
	constructor() {
		this._milestoneTitle = core.getInput("milestone-title", { required: true });
		this._milestoneToken =
			core.getInput("milestone-token") || process.env.GITHUB_TOKEN;
		this._milestoneRepository =
			core.getInput("milestone-repository") || process.env.GITHUB_REPOSITORY;
	}

	get milestoneTitle() {
		return this._milestoneTitle;
	}

	get milestoneToken() {
		return this._milestoneToken;
	}

	get milestoneRepository() {
		return this._milestoneRepository;
	}
}

module.exports = {
	Inputs,
};
