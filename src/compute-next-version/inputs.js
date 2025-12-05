const core = require("@actions/core");

class Inputs {
  constructor() {
    const repository = process.env.GITHUB_REPOSITORY.split("/")[1];
    const commercial = repository.endsWith("-commercial");
    this._milestoneTitle = core.getInput("milestone-title", { required: true });
    this._milestoneToken = core.getInput("milestone-token", {
      required: true,
    });
    this._websiteToken = core.getInput("website-token", { required: true });
    this._milestoneRepository =
      core.getInput("milestone-repository") || process.env.GITHUB_REPOSITORY;
    let websiteRepository = core.getInput("website-repository");
    if (!websiteRepository) {
      websiteRepository = commercial
        ? "spring-io/spring-website-commercial-content"
        : "spring-io/spring-website-content";
    }
    let projectSlug = core.getInput("project-slug");
    if (!projectSlug) {
      projectSlug = repository.replace("-commercial", "");
    }
    this._projectSlug = projectSlug;
    this._websiteRepository = websiteRepository;
  }

  get milestoneTitle() {
    return this._milestoneTitle;
  }

  get milestoneToken() {
    return this._milestoneToken;
  }

  get websiteToken() {
    return this._websiteToken;
  }

  get milestoneRepository() {
    return this._milestoneRepository;
  }

  get projectSlug() {
    return this._projectSlug;
  }

  get websiteRepository() {
    return this._websiteRepository;
  }
}

module.exports = {
  Inputs,
};
