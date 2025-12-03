const core = require("@actions/core");

class Inputs {
  constructor() {
    const repository = process.env.GITHUB_REPOSITORY.split("/")[1];
    const commercial = repository.endsWith("-commercial");
    let websiteRepository = core.getInput("website-repository");
    if (!websiteRepository) {
      websiteRepository = commercial
        ? "spring-io/spring-website-commercial-content"
        : "spring-io/spring-website-content";
    }
    this._websiteRepository = websiteRepository;
    let projectSlug = core.getInput("project-slug");
    if (!projectSlug) {
      projectSlug = repository.replace("-commercial", "");
    }
    this._projectSlug = projectSlug;
    this._milestonesToken = core.getInput("milestones-token", {
      required: true,
    });
    this._websiteToken = core.getInput("website-token", { required: true });
    this._currentVersion = core.getInput("current-version", { required: true });
  }

  get websiteRepository() {
    return this._websiteRepository;
  }

  get projectSlug() {
    return this._projectSlug;
  }

  get milestonesToken() {
    return this._milestonesToken;
  }

  get websiteToken() {
    return this._websiteToken;
  }

  get currentVersion() {
    return this._currentVersion;
  }
}

module.exports = {
  Inputs,
};
