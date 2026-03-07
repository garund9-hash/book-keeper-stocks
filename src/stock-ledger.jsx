import React, { useState, useEffect, useRef } from 'react'
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from 'recharts'

// ─── 상수 & 헬퍼 ────────────────────────────────────────────────
const SECTORS = [
  '기술', '금융', '헬스케어', '에너지', '소재',
  '산업재', '임의소비재', '필수소비재', '유틸리티', '부동산', '통신서비스'
]

const SECTOR_COLORS = {
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

const formatKRW = (n) => '₩' + Number(n).toLocaleString('ko-KR')

const genId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7)

const EMPTY_FORM = {
  sector: SECTORS[0],
  name: '',
  buyDate: '',
  pricePerShare: '',
  quantity: '',
  memo: '',
}

// ─── SectorBadge ────────────────────────────────────────────────
function SectorBadge({ sector }) {
  const color = SECTOR_COLORS[sector] || '#4a4a6a'
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 10px',
      borderRadius: 20,
      background: color + '22',
      color: color,
      border: `1px solid ${color}55`,
      fontSize: 12,
      fontWeight: 600,
      whiteSpace: 'nowrap',
    }}>
      {sector}
    </span>
  )
}

// ─── DeleteModal ─────────────────────────────────────────────────
function DeleteModal({ target, onConfirm, onCancel }) {
  if (!target) return null
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: '#1a1a2e',
        borderRadius: 12,
        padding: '32px 40px',
        minWidth: 320,
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        border: '1px solid #4a4a6a',
      }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#e2e8f0', marginBottom: 8 }}>
          종목 삭제
        </div>
        <div style={{ color: '#a0aec0', marginBottom: 24 }}>
          <span style={{ color: '#6366f1', fontWeight: 600 }}>{target.name}</span> 종목을 삭제하시겠습니까?
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={btnStyle('#4a4a6a', '#1a1a2e')}>취소</button>
          <button onClick={onConfirm} style={btnStyle('#ef4444', '#7f1d1d')}>삭제</button>
        </div>
      </div>
    </div>
  )
}

// ─── PortfolioTab ─────────────────────────────────────────────────
function PortfolioTab({ stocks, filterSector, setFilterSector, onEdit, onDelete }) {
  const filtered = filterSector === '전체'
    ? stocks
    : stocks.filter(s => s.sector === filterSector)

  const totalInvestment = filtered.reduce((sum, s) => sum + s.pricePerShare * s.quantity, 0)

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

// ─── AddStockTab ──────────────────────────────────────────────────
function AddStockTab({ formData, setFormData, editingId, onSave, onCancel }) {
  const estimated = (Number(formData.pricePerShare) || 0) * (Number(formData.quantity) || 0)

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
  }

  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: '#e2e8f0', marginBottom: 24 }}>
        {editingId ? '종목 수정' : '종목 추가'}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* 분야 */}
        <label style={labelStyle}>
          <span style={labelText}>분야</span>
          <select value={formData.sector} onChange={handleChange('sector')} style={inputStyle}>
            {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>

        {/* 종목명 */}
        <label style={labelStyle}>
          <span style={labelText}>종목명</span>
          <input
            type="text"
            placeholder="예: 삼성전자"
            value={formData.name}
            onChange={handleChange('name')}
            style={inputStyle}
          />
        </label>

        {/* 매수일 */}
        <label style={labelStyle}>
          <span style={labelText}>매수일</span>
          <input
            type="date"
            value={formData.buyDate}
            onChange={handleChange('buyDate')}
            style={inputStyle}
          />
        </label>

        {/* 단가 / 수량 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <label style={labelStyle}>
            <span style={labelText}>단가 (원)</span>
            <input
              type="number"
              placeholder="0"
              min="0"
              value={formData.pricePerShare}
              onChange={handleChange('pricePerShare')}
              style={inputStyle}
            />
          </label>
          <label style={labelStyle}>
            <span style={labelText}>수량 (주)</span>
            <input
              type="number"
              placeholder="0"
              min="0"
              value={formData.quantity}
              onChange={handleChange('quantity')}
              style={inputStyle}
            />
          </label>
        </div>

        {/* 예상 투자금 */}
        <div style={{
          background: '#6366f111',
          border: '1px solid #6366f133',
          borderRadius: 8,
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{ color: '#a0aec0', fontSize: 14 }}>예상 투자금</span>
          <span style={{ color: '#6366f1', fontWeight: 700, fontSize: 18 }}>{formatKRW(estimated)}</span>
        </div>

        {/* 메모 */}
        <label style={labelStyle}>
          <span style={labelText}>메모 (선택)</span>
          <input
            type="text"
            placeholder="투자 근거, 목표 등"
            value={formData.memo}
            onChange={handleChange('memo')}
            style={inputStyle}
          />
        </label>

        {/* 버튼 */}
        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <button
            onClick={onSave}
            disabled={!formData.name || !formData.buyDate || !formData.pricePerShare || !formData.quantity}
            style={{
              flex: 1,
              padding: '12px',
              background: '#6366f1',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
              opacity: (!formData.name || !formData.buyDate || !formData.pricePerShare || !formData.quantity) ? 0.5 : 1,
            }}
          >
            {editingId ? '수정 저장' : '종목 추가'}
          </button>
          {editingId && (
            <button onClick={onCancel} style={btnStyle('#4a4a6a', '#1a1a2e')}>취소</button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── ChartTab ─────────────────────────────────────────────────────
function ChartTab({ stocks }) {
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

// ─── AIChatTab ────────────────────────────────────────────────────
function AIChatTab({ stocks, apiKey, chatMessages, setChatMessages, chatInput, setChatInput, isChatLoading, setIsChatLoading }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages, isChatLoading])

  const sendMessage = async () => {
    const userMsg = chatInput.trim()
    if (!userMsg || isChatLoading) return
    if (!apiKey) {
      alert('우측 상단의 🔑 API Key 버튼을 클릭하여 Gemini API Key를 입력해 주세요.')
      return
    }

    const newMessages = [...chatMessages, { role: 'user', content: userMsg }]
    setChatMessages(newMessages)
    setChatInput('')
    setIsChatLoading(true)

    try {
      const systemPrompt = `당신은 주식 투자 전문가입니다. 사용자의 포트폴리오를 기반으로 전문적이고 친절한 조언을 제공하세요.\n현재 포트폴리오:\n${JSON.stringify(stocks, null, 2)}\n\n사용자 질문: `
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: systemPrompt + userMsg }] }]
          }),
        }
      )
      const data = await res.json()
      if (data.error) {
        setChatMessages(prev => [...prev, { role: 'ai', content: `오류: ${data.error.message}` }])
      } else {
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '응답을 받지 못했습니다.'
        setChatMessages(prev => [...prev, { role: 'ai', content: text }])
      }
    } catch (e) {
      setChatMessages(prev => [...prev, { role: 'ai', content: `네트워크 오류: ${e.message}` }])
    } finally {
      setIsChatLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '65vh' }}>
      {/* 메시지 영역 */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '12px 0',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}>
        {chatMessages.length === 0 && (
          <div style={{ color: '#4a4a6a', textAlign: 'center', marginTop: 60, fontSize: 14 }}>
            포트폴리오에 대해 궁금한 점을 물어보세요.<br />
            <span style={{ fontSize: 12 }}>예: 포트폴리오 분산이 잘 되어 있나요?</span>
          </div>
        )}
        {chatMessages.map((m, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <div style={{
              maxWidth: '75%',
              padding: '12px 16px',
              borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              background: m.role === 'user' ? '#6366f1' : '#1e1e2e',
              color: '#e2e8f0',
              fontSize: 14,
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              border: m.role === 'ai' ? '1px solid #4a4a6a' : 'none',
            }}>
              {m.content}
            </div>
          </div>
        ))}
        {isChatLoading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{
              padding: '12px 18px',
              borderRadius: '18px 18px 18px 4px',
              background: '#1e1e2e',
              border: '1px solid #4a4a6a',
              color: '#6366f1',
              fontSize: 20,
              letterSpacing: 4,
            }}>
              ···
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* 입력 영역 */}
      <div style={{
        display: 'flex',
        gap: 10,
        paddingTop: 12,
        borderTop: '1px solid #2a2a3e',
      }}>
        <textarea
          value={chatInput}
          onChange={e => setChatInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="질문을 입력하세요... (Enter: 전송, Shift+Enter: 줄바꿈)"
          rows={2}
          style={{
            flex: 1,
            resize: 'none',
            background: '#1a1a2e',
            border: '1px solid #4a4a6a',
            borderRadius: 8,
            padding: '10px 14px',
            color: '#e2e8f0',
            fontSize: 14,
            outline: 'none',
            fontFamily: 'inherit',
          }}
        />
        <button
          onClick={sendMessage}
          disabled={!chatInput.trim() || isChatLoading}
          style={{
            padding: '0 20px',
            background: '#6366f1',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
            opacity: (!chatInput.trim() || isChatLoading) ? 0.5 : 1,
            minWidth: 72,
          }}
        >
          전송
        </button>
      </div>
    </div>
  )
}

// ─── 공통 스타일 ──────────────────────────────────────────────────
const tdStyle = {
  padding: '11px 12px',
  color: '#c0c8d8',
  verticalAlign: 'middle',
}

const btnStyle = (bg, border) => ({
  padding: '8px 18px',
  background: 'transparent',
  color: bg,
  border: `1px solid ${bg}`,
  borderRadius: 8,
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
})

const smallBtn = (color) => ({
  padding: '4px 12px',
  background: color + '22',
  color: color,
  border: `1px solid ${color}55`,
  borderRadius: 6,
  fontSize: 12,
  fontWeight: 600,
  cursor: 'pointer',
})

const labelStyle = { display: 'flex', flexDirection: 'column', gap: 6 }
const labelText = { color: '#a0aec0', fontSize: 13, fontWeight: 600 }
const inputStyle = {
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

const cardStyle = {
  background: '#1a1a2e',
  borderRadius: 12,
  padding: '20px',
  border: '1px solid #2a2a3e',
}

const cardTitle = {
  fontSize: 15,
  fontWeight: 700,
  color: '#e2e8f0',
  marginBottom: 16,
}

// ─── App ──────────────────────────────────────────────────────────
export default function App() {
  const [stocks, setStocks] = useState(() => {
    try { return JSON.parse(localStorage.getItem('stocks') || '[]') } catch { return [] }
  })
  const [activeTab, setActiveTab] = useState('portfolio')
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('geminiApiKey') || '')
  const [showApiKey, setShowApiKey] = useState(false)
  const [apiKeyInput, setApiKeyInput] = useState(apiKey)
  const [filterSector, setFilterSector] = useState('전체')
  const [chatMessages, setChatMessages] = useState([])
  const [chatInput, setChatInput] = useState('')
  const [formData, setFormData] = useState({ ...EMPTY_FORM })
  const [editingId, setEditingId] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [isChatLoading, setIsChatLoading] = useState(false)

  // localStorage 동기화
  useEffect(() => {
    localStorage.setItem('stocks', JSON.stringify(stocks))
  }, [stocks])

  const handleSaveApiKey = () => {
    setApiKey(apiKeyInput)
    localStorage.setItem('geminiApiKey', apiKeyInput)
    setShowApiKey(false)
  }

  const handleEdit = (stock) => {
    setFormData({
      sector: stock.sector,
      name: stock.name,
      buyDate: stock.buyDate,
      pricePerShare: stock.pricePerShare,
      quantity: stock.quantity,
      memo: stock.memo || '',
    })
    setEditingId(stock.id)
    setActiveTab('add')
  }

  const handleDelete = (stock) => {
    setDeleteTarget(stock)
  }

  const confirmDelete = () => {
    setStocks(prev => prev.filter(s => s.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  const handleSave = () => {
    if (!formData.name || !formData.buyDate || !formData.pricePerShare || !formData.quantity) return
    const entry = {
      id: editingId || genId(),
      sector: formData.sector,
      name: formData.name,
      buyDate: formData.buyDate,
      pricePerShare: Number(formData.pricePerShare),
      quantity: Number(formData.quantity),
      memo: formData.memo,
    }
    if (editingId) {
      setStocks(prev => prev.map(s => s.id === editingId ? entry : s))
    } else {
      setStocks(prev => [...prev, entry])
    }
    setFormData({ ...EMPTY_FORM })
    setEditingId(null)
    setActiveTab('portfolio')
  }

  const handleCancelEdit = () => {
    setFormData({ ...EMPTY_FORM })
    setEditingId(null)
  }

  const TABS = [
    { key: 'portfolio', label: '📋 포트폴리오' },
    { key: 'add', label: editingId ? '✏️ 수정' : '➕ 종목 추가' },
    { key: 'chart', label: '📊 차트' },
    { key: 'ai', label: '🤖 AI 상담' },
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f0f17',
      color: '#e2e8f0',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>
      {/* 헤더 */}
      <div style={{
        background: '#1a1a2e',
        borderBottom: '1px solid #2a2a3e',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 60,
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: '#6366f1' }}>
          📈 주식 가계부
        </div>

        {/* API Key */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {showApiKey && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="password"
                placeholder="Gemini API Key"
                value={apiKeyInput}
                onChange={e => setApiKeyInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSaveApiKey()}
                style={{
                  ...inputStyle,
                  width: 220,
                  padding: '6px 12px',
                  fontSize: 13,
                }}
              />
              <button onClick={handleSaveApiKey} style={{
                padding: '6px 14px',
                background: '#6366f1',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                fontSize: 13,
                cursor: 'pointer',
              }}>저장</button>
            </div>
          )}
          <button
            onClick={() => setShowApiKey(v => !v)}
            style={{
              background: 'transparent',
              border: '1px solid #4a4a6a',
              borderRadius: 8,
              color: apiKey ? '#34d399' : '#a0aec0',
              padding: '6px 14px',
              cursor: 'pointer',
              fontSize: 13,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            🔑 API Key {apiKey ? <span style={{ fontSize: 11, letterSpacing: 2 }}>••••</span> : ''}
          </button>
        </div>
      </div>

      {/* 탭 바 */}
      <div style={{
        display: 'flex',
        gap: 0,
        borderBottom: '1px solid #2a2a3e',
        background: '#13131f',
        paddingLeft: 24,
      }}>
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={{
              padding: '14px 20px',
              background: 'transparent',
              color: activeTab === t.key ? '#6366f1' : '#a0aec0',
              border: 'none',
              borderBottom: activeTab === t.key ? '2px solid #6366f1' : '2px solid transparent',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: activeTab === t.key ? 700 : 400,
              transition: 'all 0.15s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 메인 콘텐츠 */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 24px' }}>
        {activeTab === 'portfolio' && (
          <PortfolioTab
            stocks={stocks}
            filterSector={filterSector}
            setFilterSector={setFilterSector}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
        {activeTab === 'add' && (
          <AddStockTab
            formData={formData}
            setFormData={setFormData}
            editingId={editingId}
            onSave={handleSave}
            onCancel={handleCancelEdit}
          />
        )}
        {activeTab === 'chart' && (
          <ChartTab stocks={stocks} />
        )}
        {activeTab === 'ai' && (
          <AIChatTab
            stocks={stocks}
            apiKey={apiKey}
            chatMessages={chatMessages}
            setChatMessages={setChatMessages}
            chatInput={chatInput}
            setChatInput={setChatInput}
            isChatLoading={isChatLoading}
            setIsChatLoading={setIsChatLoading}
          />
        )}
      </div>

      {/* 삭제 모달 */}
      <DeleteModal
        target={deleteTarget}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
