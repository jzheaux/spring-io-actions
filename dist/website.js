import { Octokit } from "octokit";
import { Base64 } from 'js-base64';

export class WebsiteContentManager {
    constructor(token, repo, slug) {
        this.gh = new Octokit({ auth: token });
        this.repo = repo;
        this.slug = slug;
    }

    async function getGenerationByVersion(version) {
        const file = _load(this.gh, this.repo, `/project/${slug}/generations.json`);
        const asStrings = JSON.parse(file);
        const generations = Array();
        for (const generation in asStrings) {
            const majorMinor = _generation(generation.generation);
            if (majorMinor.major === version.major &&
                majorMinor.minor === version.minor) {
                const result = {
                    generation: majorMinor,
                    oss: {
                        frequency: 1,
                        offset: 0,
                        end: _date(generation.ossSupportEnd)
                    },
                    enterprise: {
                        frequency: 3,
                        offset: 1,
                        end: _date(generation.enterpriseSupportEnd)
                    },
                    nextRelease: (version) => version.nextRelease(result)
                };
                return result;
            }
        });
        return null;
    }

}

function computeSlug(repo) {
    return repo.replace("-commercial", "");
}

function computeWebsiteRepository(repo) {
    if (repo.endsWith("-commercial")) {
        return "spring-io/spring-website-commercial-content";
    } else {
        return "spring-io/spring-website-content";
    }
}

async function _load(gh, repo, path) {
    try {
        const response = await gh.rest.repos.getContents({
            repo,
            path,
        });

        // The content is returned in base64 encoding
        const encodedContent = response.data.content;
        return generations.generaionsBase64.decode(encodedContent);
    } catch (error) {
        console.error('Error retrieving file content:', error);
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
    computeSlug,
    computeWebsiteRepository
}