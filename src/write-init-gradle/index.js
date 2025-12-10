const core = require('@actions/core');
const io = require('@actions/io');
const os = require('os');
const fs = require('fs');
const path = require('path');

async function run() {
	try {
		const url = core.getInput('artifact-repository-url', { required: true });
		const username = core.getInput('artifact-repository-username');
		const password = core.getInput('artifact-repository-password');

		const gradleHome = path.join(os.homedir(), '.gradle');
		const initScript = path.join(gradleHome, 'init.gradle');

		let script = `
allprojects {
    repositories {
        maven {
            url '${url}'
`;

		if (username && password) {
			script += `
            credentials {
                username = '${username}'
                password = '${password}'
            }
`;
		}

		script += `
        }
    }
}
`;

		await io.mkdirP(gradleHome);
		fs.writeFileSync(initScript, script);

	} catch (error) {
		core.setFailed(error.message);
	}
}

if (require.main === module) {
	run();
}

module.exports = run;
