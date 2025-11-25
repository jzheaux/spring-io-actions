const t = {
    "M1": [0,6],
    "M2": [1,7],
    "M3": [2,8],
    "RC1": [3,9],
    "": [4,10]
}

function version(version, dueDate, type = "oss") {
    const parts = version.split(/[.-]/);
    const major = parseInt(parts[0], 10);
    const minor = parseInt(parts[1], 10);
    const patch = parseInt(parts[2], 10);
    const classifier = parts.length === 3 ? '' : parts[3];
    const today = new Date();
    if (!dueDate)
        dueDate = new Date();
    }
    const test = { major, minor, patch, classifier,
        dueDate,
        type,
        isSnapshot: classifier === "SNAPSHOT",
        isPrerelease: classifier && classifier !== "SNAPSHOT",
        isGA: !classifier,
        nextRelease: (generation) => {
            if (test.isSnapshot) {
                return null;
            }
            if (test.isGA) {
                return _nextGa(test, generation);
            }
            return _nextMilestone(test);
        },
        nextSnapshot: () => _nextSnapshot(test),
        toString: () => classifier ?
            `${major}.${minor}.${patch}-${classifier}` :
            `${major}.${minor}.${patch}`
    };
    return test;
}

function _nextGa(version, generation) {
    return version(_nextGaVersion(version), _nextGaDate(version, generation));
}

function _nextGaVersion(version) {
    return `${version.major}.${version.minor}.${version.patch + 1}`;
}

function _nextGaDate(version, generation) {
    const currentMonth = version.dueDate.getMonth();
    const currentYear = version.dueDate.getFullYear();
    const oss = generation.oss;
    const enterprise = generation.enterprise;

    let releaseMonth = (currentMonth + oss.frequency) - ((currentMonth - oss.offset) % oss.frequency);
    let releaseYear = currentYear + releaseMonth / 12;
    releaseMonth = mod(releaseMonth, 12);

    if (releaseMonth <= oss.end.month && releaseYear <= oss.end.year) {
        const dueDate = _getReleaseDate(releaseMonth, releaseYear, generation.dayOfWeek, generation.weekOfMonth);
        return version(version.toString(), dueDate, "oss");
    }

    releaseMonth = (currentMonth + enterprise.frequency) - ((currentMonth - enterprise.offset) % enterprise.frequency)
    releaseYear = currentYear + releaseMonth / 12
    releaseMonth = mod(releaseMonth, 12);

    if (releaseMonth <= enterprise.end.month && releaseYear <= enterprise.end.year) {
        const releaseDate = _getReleaseDate(releaseMonth, releaseYear, generation.dayOfWeek, generation.weekOfMonth);
        return version(version.toString(), dueDate, "enterprise");
    }

    return null;
}

function _nextMilestone(version, generation) {
    return version(_nextMilestoneVersion(version), _nextMilestoneDate(version, generation));
}

function _nextMilestoneVersion(version) {
    if (version.classifier === "M1") {
        return `${version.major}.${version.minor}.${version.patch}-M2`;
    }
    if (version.classifier === "M2") {
        return `${version.major}.${version.minor}.${version.patch}-M3`;
    }
    if (version.classifier.startsWith("M")) {
        return `${version.major}.${version.minor}.${version.patch}-RC1`;
    }
    return null;
}

function _nextMilestoneDate(version, generation) {
    const candidateMonths = t[version.classifier];
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const month = candidateMonths[currentMonth > candidateMonths[0]];
    const year = currentDate.getFullYear();
    const releaseDate = _getReleaseDate(month, year, generation.dayOfWeek, generation.weekOfMonth);
    return dueDate;
}

function _nextSnapshot(version) {
    if (version.classifier === "SNAPSHOT") {
        return version(`${version.major}.${version.minor}.${version.patch + 1}-SNAPSHOT`);
    }
    return version(`${version.major}.${version.minor}.${version.patch}-SNAPSHOT`);
}

/**
 * Given:
 *   monthZeroBased: 0 = January
 *   year: four-digit year
 *   dayOfWeek: 0=Sun..6=Sat (JavaScript convention)
 *   weekOfMonth: 0 = first full Monday-starting week
 *
 * Returns a Date corresponding to that week/day combination.
 */
function _getReleaseDate(month, year, dayOfWeek, weekOfMonth) {
    const firstOfMonth = new Date(year, month, 1);
    const firstDayOfMonth = firstOfMonth.getDay();
    const firstDayMonBased = (firstDayOfMonth + 6) % 7;
    const offsetToFirstMonday = (7 - firstDayMonBased) % 7;
    const firstFullWeekMonday = 1 + offsetToFirstMonday;
    const inputDayMonBased = (dayOfWeek + 6) % 7;
    const dayOfMonth = firstFullWeekMonday + weekOfMonth * 7 + inputDayMonBased;
    return new Date(year, month, dayOfMonth);
}

const mod = (a, n) => ((a % n) + n) % n;

module.exports = {
    version
};