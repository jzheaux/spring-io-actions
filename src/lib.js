function getWeekOfMonthAndDayOfWeek(date) {
    const dayOfMonth = date.getDate();
    const dayOfWeek = date.getDay();
    const firstOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const firstDayOfMonth = firstOfMonth.getDay();
    const firstDayMonBased = (firstDayOfMonth + 6) % 7;
    const offsetToFirstMonday = (7 - firstDayMonBased) % 7;
    const firstFullWeekMonday = 1 + offsetToFirstMonday;
    const weekOfMonth = Math.floor((dayOfMonth - firstFullWeekMonday) / 7);
    return { dayOfWeek, weekOfMonth };
}

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
    getWeekOfMonthAndDayOfWeek,
    _getReleaseDate,
    mod
}
