import { useState, useEffect } from 'react'
import { StockRepository } from '../repository/stockRepository'
import { genId } from '../utils/formatters'

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

    const calculateTotalInvestment = (stockList) => {
        return stockList.reduce((sum, s) => sum + s.pricePerShare * s.quantity, 0)
    }

    const getSectorAggregations = () => {
        const sectorMap = {}
        stocks.forEach(s => {
            if (!sectorMap[s.sector]) sectorMap[s.sector] = { sector: s.sector, total: 0, count: 0 }
            sectorMap[s.sector].total += s.pricePerShare * s.quantity
            sectorMap[s.sector].count += 1
        })
        const chartData = Object.values(sectorMap).sort((a, b) => b.total - a.total)
        const grandTotal = chartData.reduce((sum, d) => sum + d.total, 0)
        const pieData = chartData.map(d => ({ ...d, percent: ((d.total / grandTotal) * 100).toFixed(1) }))
        return { chartData, pieData }
    }

    return { stocks, setStocks, addStock, updateStock, removeStock, calculateTotalInvestment, getSectorAggregations }
}
