const { Octokit } = require("@octokit/rest");
const { Base64 } = require("js-base64");
const { getWeekOfMonthAndDayOfWeek } = require("./lib");

class Website {
  constructor(inputs) {
    this.gh = new Octokit({ auth: inputs.websiteToken });
    this.repo = inputs.websiteRepository;
    this.slug = inputs.projectSlug;
  }

  async getGenerationByVersion(version) {
    const file = await _load(
      this.gh,
      this.repo.split("/")[0],
      this.repo.split("/")[1],
      `/project/${this.slug}/generations.json`,
    );
    const asStrings = JSON.parse(file);
    const { dayOfWeek, weekOfMonth } = getWeekOfMonthAndDayOfWeek(
      version.dueDate,
    );
    for (const generation of asStrings.generations) {
      console.log(
        `Checking generation ${generation.generation} against ${version.major}.${version.minor}`,
      );
      const majorMinor = _generation(generation.generation);
      if (
        majorMinor.major === version.major &&
        majorMinor.minor === version.minor
      ) {
        const result = {
          generation: majorMinor,
          dayOfWeek,
          weekOfMonth,
          oss: {
            frequency: 1,
            offset: 0,
            end: _date(generation.ossSupportEnd),
          },
          enterprise: {
            frequency: 3,
            offset: 1,
            end: _date(generation.enterpriseSupportEnd),
          },
          nextRelease: (version) => version.nextRelease(result),
        };
        return result;
      }
    }
    return null;
  }
}

async function _load(gh, owner, repo, path, ref = "main") {
  try {
    console.log(`Retrieving ${path} from ${owner}/${repo}@${ref}`);
    const response = await gh.repos.getContent({
      owner,
      repo,
      path,
      ref,
    });

    // The content is returned in base64 encoding
    const encodedContent = response.data.content;
    return Base64.decode(encodedContent);
  } catch (error) {
    console.error("Error retrieving file content:", error);
    throw error;
  }
}

function _generation(generation) {
  const parts = generation.split(/[.-]/);
  return { major: parseInt(parts[0]), minor: parseInt(parts[1]) };
}

function _date(date) {
  const parts = date.split(/[.-]/);
  return { year: parseInt(parts[0]), month: parseInt(parts[1]) };
}

module.exports = {
  Website,
};
