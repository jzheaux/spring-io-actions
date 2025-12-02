const core = require('@actions/core');

class Inputs {
    constructor() {
        this._webhookUrl = core.getInput('gchat-webhook-url');
        this._projectVersion = core.getInput('project-version');
        this._projectName = core.getInput('project-name', { required: false });
    }

    get webhookUrl() {
        return this._webhookUrl;
    }

    get projectVersion() {
        return this._projectVersion;
    }

    get projectName() {
        return this._projectName || process.env.GITHUB_REPOSITORY.split('/')[1];
    }
}

module.exports = {
    Inputs
};
