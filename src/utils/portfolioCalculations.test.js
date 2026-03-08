import { describe, it, expect } from 'vitest'
import { calculateTotalInvestment, getSectorAggregations } from './portfolioCalculations'

describe('Portfolio Calculations', () => {
    describe('calculateTotalInvestment', () => {
        it('calculates the correct total investment', () => {
            const mockStocks = [
                { pricePerShare: 50000, quantity: 10 },
                { pricePerShare: 100000, quantity: 2 },
            ]
            expect(calculateTotalInvestment(mockStocks)).toBe(700000)
        })

        it('returns 0 for an empty portfolio', () => {
            expect(calculateTotalInvestment([])).toBe(0)
        })

        it('handles string numbers correctly (type coercion edge case)', () => {
            const mockStocks = [
                { pricePerShare: '1000', quantity: '5' },
            ]
            expect(calculateTotalInvestment(mockStocks)).toBe(5000)
        })
    })

    describe('getSectorAggregations', () => {
        it('aggregates correctly by sector and calculates percent', () => {
            const mockStocks = [
                { sector: '기술', pricePerShare: 1000, quantity: 10 },
                { sector: '기술', pricePerShare: 2000, quantity: 5 },
                { sector: '금융', pricePerShare: 5000, quantity: 2 }
            ]

            // 기술: 10000 + 10000 = 20000
            // 금융: 10000
            // Total = 30000
            const result = getSectorAggregations(mockStocks)

            expect(result.chartData.length).toBe(2)

            const tech = result.chartData.find(d => d.sector === '기술')
            expect(tech.total).toBe(20000)
            expect(tech.count).toBe(2)

            const finance = result.chartData.find(d => d.sector === '금융')
            expect(finance.total).toBe(10000)

            const techPie = result.pieData.find(d => d.sector === '기술')
            expect(techPie.pct).toBe('66.7')

            const financePie = result.pieData.find(d => d.sector === '금융')
            expect(financePie.pct).toBe('33.3')
        })

        it('handles an empty portfolio safely', () => {
            const result = getSectorAggregations([])
            expect(result.chartData).toEqual([])
            expect(result.pieData).toEqual([])
        })
    })
})
