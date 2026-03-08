import { useState, useEffect, useCallback, useRef } from 'react'
import { StockRepository } from '../repository/stockRepository'
import { genId } from '../utils/formatters'
import { calculateTotalInvestment, getSectorAggregations } from '../utils/portfolioCalculations'

export function usePortfolio() {
    const [stocks, setStocks] = useState(() => StockRepository.getAll())

    const debounceTimer = useRef(null)

    // localStorage 동기화 (Debounced)
    useEffect(() => {
        if (debounceTimer.current) clearTimeout(debounceTimer.current)
        debounceTimer.current = setTimeout(() => {
            StockRepository.saveAll(stocks)
        }, 500)

        return () => clearTimeout(debounceTimer.current)
    }, [stocks])

    const addStock = useCallback((entry) => {
        setStocks(prev => [...prev, { ...entry, id: genId() }])
    }, [])

    const updateStock = useCallback((entry) => {
        setStocks(prev => prev.map(s => s.id === entry.id ? entry : s))
    }, [])

    const removeStock = useCallback((id) => {
        setStocks(prev => prev.filter(s => s.id !== id))
    }, [])

    // ... calculate functions moved to portfolioCalculations.js ...

    const calcTotal = useCallback((list) => calculateTotalInvestment(list), [])
    const getAggregations = useCallback(() => getSectorAggregations(stocks), [stocks])

    return { stocks, setStocks, addStock, updateStock, removeStock, calculateTotalInvestment: calcTotal, getSectorAggregations }
}
