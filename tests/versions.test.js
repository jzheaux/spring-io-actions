const { version } = require('../src/versions');

describe('version', () => {
    it('should parse a GA version', () => {
        const v = version('1.2.3');
        expect(v.major).toBe(1);
        expect(v.minor).toBe(2);
        expect(v.patch).toBe(3);
        expect(v.classifier).toBe('');
        expect(v.isGA).toBe(true);
        expect(v.isPrerelease).toBe(false);
        expect(v.isSnapshot).toBe(false);
    });

    it('should parse a milestone version', () => {
        const v = version('1.2.3-M1');
        expect(v.major).toBe(1);
        expect(v.minor).toBe(2);
        expect(v.patch).toBe(3);
        expect(v.classifier).toBe('M1');
        expect(v.isGA).toBe(false);
        expect(v.isPrerelease).toBe(true);
        expect(v.isSnapshot).toBe(false);
    });

    it('should parse a snapshot version', () => {
        const v = version('1.2.3-SNAPSHOT');
        expect(v.major).toBe(1);
        expect(v.minor).toBe(2);
        expect(v.patch).toBe(3);
        expect(v.classifier).toBe('SNAPSHOT');
        expect(v.isGA).toBe(false);
        expect(v.isPrerelease).toBe(false);
        expect(v.isSnapshot).toBe(true);
    });

    it('should calculate the next GA release', () => {
        const generation = {
            dayOfWeek: 1,
            weekOfMonth: 3,
            oss: {
                frequency: 1,
                offset: 0,
                end: {
                    year: 2026,
                    month: 11
                }
            },
            enterprise: {
                frequency: 3,
                offset: 1,
                end: {
                    year: 2027,
                    month: 2
                }
            }
        };
        const v = version('1.2.3', new Date('2025-11-24'));
        const next = v.nextRelease(generation);
        expect(next.toString()).toBe('1.2.4');
        expect(next.type).toBe('oss');
        expect(next.dueDate.getFullYear()).toBe(2025);
        expect(next.dueDate.getMonth()).toBe(11);
        expect(next.dueDate.getDate()).toBe(22);
    });

    it('should calculate the next milestone release', () => {
        const generation = {
            dayOfWeek: 1,
            weekOfMonth: 3
        };
        const v = version('1.2.3-M1', new Date('2025-11-24'));
        const next = v.nextRelease(generation);
        expect(next.toString()).toBe('1.2.3-M2');
        expect(next.type).toBe('oss');
    });
});
