import React, { useMemo } from 'react'
import { SECTORS, SECTOR_COLORS, tdStyle, smallBtn } from '../../utils/constants'
import { formatKRW } from '../../utils/formatters'
import { SectorBadge } from '../ui/SectorBadge'

export function PortfolioTab({ stocks, filterSector, setFilterSector, onEdit, onDelete, calculateTotalInvestment }) {
    const filtered = useMemo(() => {
        return filterSector === '전체'
            ? stocks
            : stocks.filter(s => s.sector === filterSector)
    }, [stocks, filterSector])

    const totalInvestment = useMemo(() => calculateTotalInvestment(filtered), [filtered, calculateTotalInvestment])

    return (
        <div>
            {/* 필터 버튼 */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
                {['전체', ...SECTORS].map(s => (
                    <button
                        key={s}
                        onClick={() => setFilterSector(s)}
                        style={{
                            padding: '5px 14px',
                            borderRadius: 20,
                            border: filterSector === s
                                ? `1px solid ${SECTOR_COLORS[s] || '#6366f1'}`
                                : '1px solid #4a4a6a',
                            background: filterSector === s
                                ? (SECTOR_COLORS[s] || '#6366f1') + '22'
                                : 'transparent',
                            color: filterSector === s
                                ? (SECTOR_COLORS[s] || '#6366f1')
                                : '#a0aec0',
                            cursor: 'pointer',
                            fontSize: 13,
                            fontWeight: filterSector === s ? 700 : 400,
                            transition: 'all 0.15s',
                        }}
                    >
                        {s}
                    </button>
                ))}
            </div>

            {/* 요약 */}
            <div style={{ color: '#a0aec0', fontSize: 13, marginBottom: 12 }}>
                {filtered.length}개 종목 &nbsp;|&nbsp; 총 투자금: <span style={{ color: '#6366f1', fontWeight: 700 }}>{formatKRW(totalInvestment)}</span>
            </div>

            {/* 테이블 */}
            {filtered.length === 0 ? (
                <div style={{ color: '#4a4a6a', textAlign: 'center', padding: '60px 0', fontSize: 15 }}>
                    종목이 없습니다. 종목을 추가해 보세요.
                </div>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #4a4a6a' }}>
                                {['분야', '종목명', '매수일', '단가', '수량', '총투자금', '메모', ''].map(h => (
                                    <th key={h} style={{
                                        padding: '10px 12px',
                                        textAlign: 'left',
                                        color: '#6366f1',
                                        fontWeight: 600,
                                        whiteSpace: 'nowrap',
                                    }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((s, i) => (
                                <tr
                                    key={s.id}
                                    style={{
                                        borderBottom: '1px solid #2a2a3e',
                                        background: i % 2 === 0 ? 'transparent' : '#1a1a2e44',
                                        transition: 'background 0.1s',
                                    }}
                                >
                                    <td style={tdStyle}><SectorBadge sector={s.sector} /></td>
                                    <td style={{ ...tdStyle, fontWeight: 600, color: '#e2e8f0' }}>{s.name}</td>
                                    <td style={tdStyle}>{s.buyDate}</td>
                                    <td style={tdStyle}>{formatKRW(s.pricePerShare)}</td>
                                    <td style={tdStyle}>{Number(s.quantity).toLocaleString('ko-KR')}</td>
                                    <td style={{ ...tdStyle, fontWeight: 700, color: '#34d399' }}>
                                        {formatKRW(s.pricePerShare * s.quantity)}
                                    </td>
                                    <td style={{ ...tdStyle, color: '#a0aec0', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {s.memo || '-'}
                                    </td>
                                    <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                                        <button onClick={() => onEdit(s)} style={smallBtn('#6366f1')}>수정</button>
                                        <button onClick={() => onDelete(s)} style={{ ...smallBtn('#ef4444'), marginLeft: 6 }}>삭제</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
