const core = require('@actions/core');
const { getInputs } = require('./inputs');
const fs = require('fs');
const os = require('os');
const path = require('path');

function run() {
	const inputs = getInputs();
	validate(inputs);
	const settings = generate(inputs);
	write(settings);
}

function validate(inputs) {
	if (inputs.username && !inputs.url) {
		throw new Error('`artifact-repository-username` requires `artifact-repository-url` to be set');
	}
	if (inputs.password && !inputs.username) {
		throw new Error('`artifact-repository-password` requires `artifact-repository-username` to be set');
	}
}

function generate(inputs) {
	if (!inputs.url) {
		return;
	}
	const repositoryId = 'remote-repository';
	const servers = inputs.username ? `
    <servers>
        <server>
            <id>${repositoryId}</id>
            <username>${inputs.username}</username>
            <password>${inputs.password}</password>
        </server>
    </servers>
` : '';
	return `
<settings>${servers}
    <profiles>
        <profile>
            <id>remote-profile</id>
            <repositories>
                <repository>
                    <id>${repositoryId}</id>
                    <url>${inputs.url}</url>
                </repository>
            </repositories>
			<pluginRepositories>
				<pluginRepository>
					<id>${repositoryId}</id>
					<url>${inputs.url}</url>
				</pluginRepository>
			</pluginRepositories>
        </profile>
    </profiles>
    <activeProfiles>
        <activeProfile>remote-profile</activeProfile>
    </activeProfiles>
</settings>
`;
}

function write(settings) {
	if (!settings) {
		return;
	}
	const m2 = path.join(os.homedir(), '.m2');
	if (!fs.existsSync(m2)) {
		fs.mkdirSync(m2, { recursive: true });
	}
	fs.writeFileSync(path.join(m2, 'settings.xml'), settings);
}


if (require.main === module) {
	try {
		run();
	} catch(e) {
		core.setFailed(e.message);
	}
}

module.exports = {
	run
}
