const core = require("@actions/core");

class Inputs {
	constructor() {
		this._gchatWebhookUrl = core.getInput("gchat-webhook-url");
		this._milestoneTitle = core.getInput("milestone-title");
		this._projectName = core.getInput("project-name", { required: false });
	}

	get gchatWebhookUrl() {
		return this._gchatWebhookUrl;
	}

	get milestoneTitle() {
		return this._milestoneTitle;
	}

	get projectName() {
		return this._projectName || process.env.GITHUB_REPOSITORY.split("/")[1];
	}
}

module.exports = {
	Inputs,
};
