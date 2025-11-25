const { getWeekOfMonthAndDayOfWeek, _getReleaseDate, mod } = require('../src/lib');

describe('getWeekOfMonthAndDayOfWeek', () => {
    it('should return the correct week of month and day of week', () => {
        // November 24, 2025 is a Monday
        const date = new Date('2025-11-24');
        const { dayOfWeek, weekOfMonth } = getWeekOfMonthAndDayOfWeek(date);
        expect(dayOfWeek).toBe(1);
        expect(weekOfMonth).toBe(3);
    });

    it('should handle the first week of the month', () => {
        // November 3, 2025 is a Monday
        const date = new Date('2025-11-03');
        const { dayOfWeek, weekOfMonth } = getWeekOfMonthAndDayOfWeek(date);
        expect(dayOfWeek).toBe(1);
        expect(weekOfMonth).toBe(0);
    });

    it('should handle a day later in the week', () => {
        // November 7, 2025 is a Friday
        const date = new Date('2025-11-07');
        const { dayOfWeek, weekOfMonth } = getWeekOfMonthAndDayOfWeek(date);
        expect(dayOfWeek).toBe(5);
        expect(weekOfMonth).toBe(0);
    });
});

describe('_getReleaseDate', () => {
    it('should return the correct release date', () => {
        // third Monday in November 2025
        const date = _getReleaseDate(10, 2025, 1, 3);
        expect(date.getFullYear()).toBe(2025);
        expect(date.getMonth()).toBe(10);
        expect(date.getDate()).toBe(24);
    });
});

describe('mod', () => {
    it('should return the correct modulus', () => {
        expect(mod(10, 5)).toBe(0);
        expect(mod(10, 3)).toBe(1);
        expect(mod(-1, 3)).toBe(2);
    });
});
