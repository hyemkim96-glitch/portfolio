import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn', () => {
    it('returns a single class name unchanged', () => {
        expect(cn('foo')).toBe('foo');
    });

    it('merges multiple class names', () => {
        expect(cn('foo', 'bar')).toBe('foo bar');
    });

    it('ignores falsy values', () => {
        expect(cn('foo', false, undefined, null, 'bar')).toBe('foo bar');
    });

    it('handles conditional classes via objects', () => {
        expect(cn({ active: true, disabled: false })).toBe('active');
    });

    it('deduplicates conflicting Tailwind classes — last one wins', () => {
        // twMerge resolves conflicts: p-4 should override p-2
        expect(cn('p-2', 'p-4')).toBe('p-4');
    });

    it('merges text-color conflicts correctly', () => {
        expect(cn('text-red-500', 'text-blue-600')).toBe('text-blue-600');
    });

    it('returns empty string when no valid classes are provided', () => {
        expect(cn(undefined, false, null)).toBe('');
    });

    it('handles arrays of class names', () => {
        expect(cn(['foo', 'bar'], 'baz')).toBe('foo bar baz');
    });
});
