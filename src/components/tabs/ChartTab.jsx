import React from 'react'
import {
    PieChart, Pie, Cell, Tooltip, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from 'recharts'
import { SECTOR_COLORS, cardStyle, cardTitle } from '../../utils/constants'
import { formatKRW } from '../../utils/formatters'

export function ChartTab({ stocks }) {
    if (stocks.length === 0) {
        return (
            <div style={{ color: '#4a4a6a', textAlign: 'center', padding: '80px 0', fontSize: 15 }}>
                종목을 추가하면 차트가 표시됩니다.
            </div>
        )
    }

    const sectorMap = {}
    stocks.forEach(s => {
        if (!sectorMap[s.sector]) sectorMap[s.sector] = { sector: s.sector, total: 0, count: 0 }
        sectorMap[s.sector].total += s.pricePerShare * s.quantity
        sectorMap[s.sector].count += 1
    })
    const chartData = Object.values(sectorMap).sort((a, b) => b.total - a.total)
    const grandTotal = chartData.reduce((sum, d) => sum + d.total, 0)
    const pieData = chartData.map(d => ({ ...d, percent: ((d.total / grandTotal) * 100).toFixed(1) }))

    const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        const RADIAN = Math.PI / 180
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5
        const x = cx + radius * Math.cos(-midAngle * RADIAN)
        const y = cy + radius * Math.sin(-midAngle * RADIAN)
        if (parseFloat(percent) < 3) return null
        return (
            <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={700}>
                {`${parseFloat(percent * 100).toFixed(0)}%`}
            </text>
        )
    }

    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
                {/* Pie Chart */}
                <div style={cardStyle}>
                    <div style={cardTitle}>분야별 비중</div>
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                dataKey="total"
                                nameKey="sector"
                                cx="50%"
                                cy="50%"
                                outerRadius={110}
                                labelLine={false}
                                label={renderCustomLabel}
                            >
                                {pieData.map((d) => (
                                    <Cell key={d.sector} fill={SECTOR_COLORS[d.sector] || '#4a4a6a'} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(v) => formatKRW(v)}
                                contentStyle={{ background: '#1a1a2e', border: '1px solid #4a4a6a', borderRadius: 8 }}
                                labelStyle={{ color: '#e2e8f0' }}
                            />
                            <Legend
                                formatter={(value) => <span style={{ color: '#a0aec0', fontSize: 12 }}>{value}</span>}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Bar Chart */}
                <div style={cardStyle}>
                    <div style={cardTitle}>분야별 총투자금</div>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 30 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
                            <XAxis
                                dataKey="sector"
                                tick={{ fill: '#a0aec0', fontSize: 11 }}
                                angle={-35}
                                textAnchor="end"
                                interval={0}
                            />
                            <YAxis
                                tick={{ fill: '#a0aec0', fontSize: 11 }}
                                tickFormatter={(v) => v >= 1e8 ? (v / 1e8).toFixed(0) + '억' : v >= 1e4 ? (v / 1e4).toFixed(0) + '만' : v}
                            />
                            <Tooltip
                                formatter={(v) => [formatKRW(v), '총투자금']}
                                contentStyle={{ background: '#1a1a2e', border: '1px solid #4a4a6a', borderRadius: 8 }}
                                labelStyle={{ color: '#e2e8f0' }}
                            />
                            <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                                {chartData.map((d) => (
                                    <Cell key={d.sector} fill={SECTOR_COLORS[d.sector] || '#6366f1'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 요약 카드 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                {pieData.map(d => (
                    <div key={d.sector} style={{
                        ...cardStyle,
                        padding: '14px 18px',
                        borderLeft: `3px solid ${SECTOR_COLORS[d.sector] || '#4a4a6a'}`,
                    }}>
                        <div style={{ fontSize: 13, color: SECTOR_COLORS[d.sector] || '#a0aec0', fontWeight: 600, marginBottom: 6 }}>
                            {d.sector}
                        </div>
                        <div style={{ fontSize: 12, color: '#a0aec0' }}>{d.count}개 종목</div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: '#e2e8f0', margin: '4px 0' }}>
                            {formatKRW(d.total)}
                        </div>
                        <div style={{ fontSize: 13, color: '#6366f1' }}>{d.percent}%</div>
                    </div>
                ))}
            </div>
        </div>
    )
}
