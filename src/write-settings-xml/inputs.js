const core = require('@actions/core');

function getInputs() {
	const artifactRepositoryUrl = core.getInput('artifact-repository-url');
	const artifactRepositoryUsername = core.getInput('artifact-repository-username');
	const artifactRepositoryPassword = core.getInput('artifact-repository-password');
	return {
		url: artifactRepositoryUrl,
		username: artifactRepositoryUsername,
		password: artifactRepositoryPassword
	};
}

module.exports = {
	getInputs
};
