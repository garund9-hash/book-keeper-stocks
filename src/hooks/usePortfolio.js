import { useState, useEffect } from 'react'
import { StockRepository } from '../repository/stockRepository'
import { genId } from '../utils/formatters'

export function usePortfolio() {
    const [stocks, setStocks] = useState(() => StockRepository.getAll())

    // localStorage 동기화
    useEffect(() => {
        StockRepository.saveAll(stocks)
    }, [stocks])

    const addOrUpdateStock = (entry) => {
        setStocks(prev => {
            const exists = prev.find(s => s.id === entry.id)
            if (exists) {
                return prev.map(s => s.id === entry.id ? entry : s)
            }
            return [...prev, { ...entry, id: entry.id || genId() }]
        })
    }

    const removeStock = (id) => {
        setStocks(prev => prev.filter(s => s.id !== id))
    }

    return { stocks, setStocks, addOrUpdateStock, removeStock }
}
