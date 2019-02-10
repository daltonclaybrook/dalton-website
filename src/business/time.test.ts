import { makeTimeString } from './time';

const now = new Date(0);

describe('few minutes', () => {
    it('is recent for zero', () => {
        const subject = makeTimeString(0, now);
        expect(subject).toEqual('A few minutes ago');
    });

    it('is recent for almost five minutes', () => {
        const subject = makeTimeString(-299, now);
        expect(subject).toEqual('A few minutes ago');
    });

    it('is not recent after five minutes', () => {
        const subject = makeTimeString(-301, now);
        expect(subject).not.toEqual('A few minutes ago');
    });
});

describe('minutes', () => {
    it('returns correct minutes under 60', () => {
        const subject = makeTimeString(-2700, now);
        expect(subject).toEqual('45 minutes ago');
    });

    it('does not return minutes over 60', () => {
        const subject = makeTimeString(-3900, now);
        expect(subject).not.toEqual('65 minutes ago');
    });
});

describe('an hour', () => {
    it('returns about an hour under two hours', () => {
        const subject = makeTimeString(-7199, now);
        expect(subject).toEqual('About an hour ago');
    });

    it('does not return about an hour over two hours', () => {
        const subject = makeTimeString(-7201, now);
        expect(subject).not.toEqual('About an hour ago');
    });
});

describe('hours', () => {
    it('returns hours under five', () => {
        const subject = makeTimeString(-14420, now);
        expect(subject).toEqual('4 hours ago');
    });

    it('does not return hours over five', () => {
        const subject = makeTimeString(-18001, now);
        expect(subject).not.toEqual('5 hours ago');
    });
});

describe('full date', () => {
    it('returns correct date string', () => {
        const subject = makeTimeString(-100000, now);
        expect(subject).toEqual('Tue Dec 30 at 3:13 pm');
    });
});
