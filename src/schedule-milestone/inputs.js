const core = require("@actions/core");

class Inputs {
	constructor() {
		this._milestoneDate = core.getInput("milestone-date");
		this._milestoneTitle = core.getInput("milestone-title");
		this._milestoneDescription = core.getInput("milestone-description");
		this._milestoneRepsitory =
			core.getInput("milestone-repository") || process.env.GITHUB_REPOSITORY;
		this._milestoneToken =
			core.getInput("milestone-token") || process.env.GITHUB_TOKEN;
	}

	get milestoneDate() {
		return this._milestoneDate;
	}

	get milestoneTitle() {
		return this._milestoneTitle;
	}

	get milestoneDescription() {
		return this._milestoneDescription;
	}

	get milestoneRepository() {
		return this._milestoneRepsitory;
	}

	get milestoneToken() {
		return this._milestoneToken;
	}
}

module.exports = {
	Inputs,
};
