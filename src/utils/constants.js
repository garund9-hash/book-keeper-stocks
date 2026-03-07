export const SECTORS = [
    '기술', '금융', '헬스케어', '에너지', '소재',
    '산업재', '임의소비재', '필수소비재', '유틸리티', '부동산', '통신서비스'
]

export const SECTOR_COLORS = {
    '기술': '#6366f1',
    '금융': '#22d3ee',
    '헬스케어': '#34d399',
    '에너지': '#f59e0b',
    '소재': '#f97316',
    '산업재': '#ec4899',
    '임의소비재': '#a78bfa',
    '필수소비재': '#84cc16',
    '유틸리티': '#06b6d4',
    '부동산': '#fb923c',
    '통신서비스': '#e879f9',
}

export const EMPTY_FORM = {
    sector: SECTORS[0],
    name: '',
    buyDate: '',
    pricePerShare: '',
    quantity: '',
    memo: '',
}

export const TABS = [
    { key: 'portfolio', label: '📋 포트폴리오' },
    { key: 'add', label: '➕ 종목 추가' },
    { key: 'chart', label: '📊 차트' },
    { key: 'ai', label: '🤖 AI 상담' },
]

export const tdStyle = {
    padding: '11px 12px',
    color: '#c0c8d8',
    verticalAlign: 'middle',
}

export const btnStyle = (bg, border) => ({
    padding: '8px 18px',
    background: 'transparent',
    color: bg,
    border: `1px solid ${bg}`,
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
})

export const smallBtn = (color) => ({
    padding: '4px 12px',
    background: color + '22',
    color: color,
    border: `1px solid ${color}55`,
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
})

export const labelStyle = { display: 'flex', flexDirection: 'column', gap: 6 }
export const labelText = { color: '#a0aec0', fontSize: 13, fontWeight: 600 }
export const inputStyle = {
    background: '#1a1a2e',
    border: '1px solid #4a4a6a',
    borderRadius: 8,
    padding: '10px 14px',
    color: '#e2e8f0',
    fontSize: 14,
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
}

export const cardStyle = {
    background: '#1a1a2e',
    borderRadius: 12,
    padding: '20px',
    border: '1px solid #2a2a3e',
}

export const cardTitle = {
    fontSize: 15,
    fontWeight: 700,
    color: '#e2e8f0',
    marginBottom: 16,
}
