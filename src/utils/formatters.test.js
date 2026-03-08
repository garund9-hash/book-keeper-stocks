import { describe, it, expect } from 'vitest'
import { formatKRW } from './formatters'

describe('formatKRW', () => {
    it('should format positive numbers with Korean Won symbol and commas', () => {
        expect(formatKRW(1500000)).toBe('₩1,500,000')
    })

    it('should format string numbers properly', () => {
        expect(formatKRW('4500')).toBe('₩4,500')
    })

    it('should handle zero gracefully', () => {
        expect(formatKRW(0)).toBe('₩0')
    })

    it('should handle negative numbers', () => {
        expect(formatKRW(-500)).toBe('₩-500')
    })

    it('should fallback gracefully for non-numeric inputs (NaN)', () => {
        expect(formatKRW('invalid')).toBe('₩NaN') // Currently Number('invalid') becomes NaN
    })

    it('should fallback gracefully for null/empty', () => {
        expect(formatKRW(null)).toBe('₩0')
        expect(formatKRW('')).toBe('₩0')
    })
})
