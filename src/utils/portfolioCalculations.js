export const calculateTotalInvestment = (stockList) => {
    return stockList.reduce((sum, s) => sum + Number(s.pricePerShare) * Number(s.quantity), 0)
}

export const getSectorAggregations = (stocks) => {
    const sectorMap = {}
    stocks.forEach(s => {
        if (!sectorMap[s.sector]) sectorMap[s.sector] = { sector: s.sector, total: 0, count: 0 }
        sectorMap[s.sector].total += Number(s.pricePerShare) * Number(s.quantity)
        sectorMap[s.sector].count += 1
    })
    const chartData = Object.values(sectorMap).sort((a, b) => b.total - a.total)
    const grandTotal = chartData.reduce((sum, d) => sum + d.total, 0)
    const pieData = chartData.map(d => ({ ...d, pct: ((d.total / grandTotal) * 100).toFixed(1) }))
    return { chartData, pieData }
}
