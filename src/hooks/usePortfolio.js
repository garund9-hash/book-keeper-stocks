import { useState, useEffect } from 'react'
import { StockRepository } from '../repository/stockRepository'
import { genId } from '../utils/formatters'
import { calculateTotalInvestment, getSectorAggregations } from '../utils/portfolioCalculations'

export function usePortfolio() {
    const [stocks, setStocks] = useState(() => StockRepository.getAll())

    // localStorage 동기화
    useEffect(() => {
        StockRepository.saveAll(stocks)
    }, [stocks])

    const addStock = (entry) => {
        setStocks(prev => [...prev, { ...entry, id: genId() }])
    }

    const updateStock = (entry) => {
        setStocks(prev => prev.map(s => s.id === entry.id ? entry : s))
    }

    const removeStock = (id) => {
        setStocks(prev => prev.filter(s => s.id !== id))
    }

    // ... calculate functions moved to portfolioCalculations.js ...

    return { stocks, setStocks, addStock, updateStock, removeStock, calculateTotalInvestment: (list) => calculateTotalInvestment(list), getSectorAggregations: () => getSectorAggregations(stocks) }
}
