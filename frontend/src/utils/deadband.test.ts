import { describe, it, expect } from 'vitest';
import { isInvalidQuaternion, isEqualQuaternion } from './deadband';
import { Quaternion } from 'three';

function createAllPosArr(brokenValue: undefined | null | 0) {
    const correctArray: (number | undefined | null)[] = [1, 2, 3, 4];
    return correctArray.map((_, index) => {
        const cpy = [...correctArray];
        cpy[index] = brokenValue;
        return cpy
    })
}
const exampleQuaternion = new Quaternion(1, 2, 3, 4);

const brokenValues = [undefined, null] as const;

describe.each(brokenValues)('when a quaternion value is %p', (brokenValue) => {
    const testCases = createAllPosArr(brokenValue);

    it.each(testCases)('returns true for args (%p, %p, %p, %p)', (a, b, c, d) => {
        expect(isInvalidQuaternion(a, b, c, d)).toBe(true);
    });
    it('returns true when value is 0', () => {
        expect(isInvalidQuaternion(0, 0, 0, 0)).toBe(true);
    });
});
describe('when quaternion is valid', () => {
    it('returns false', () => {
        expect(isInvalidQuaternion(1, 2, 3, 4)).toBe(false);
    });
});


describe('when quaternion is equal to', () => {
    it('returns false if its a broken quaternion', () => {
        expect(isEqualQuaternion(exampleQuaternion, null, undefined, 0, 0)).toBe(false);
    })
    it('returns true if its its antipodal match', () => {
        expect(isEqualQuaternion(exampleQuaternion, -1, -2, -3, -4)).toBe(true);
    })
})