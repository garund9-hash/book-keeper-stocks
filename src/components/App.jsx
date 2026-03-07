import React, { useState } from 'react'
import { TABS, EMPTY_FORM, inputStyle } from '../utils/constants'
import { usePortfolio } from '../hooks/usePortfolio'
import { PortfolioTab } from './tabs/PortfolioTab'
import { AddStockTab } from './tabs/AddStockTab'
import { ChartTab } from './tabs/ChartTab'
import { AIChatTab } from './tabs/AIChatTab'
import { DeleteModal } from './ui/DeleteModal'

export default function App() {
    const { stocks, addOrUpdateStock, removeStock } = usePortfolio()
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
        removeStock(deleteTarget.id)
        setDeleteTarget(null)
    }

    const handleSave = () => {
        if (!formData.name || !formData.buyDate || !formData.pricePerShare || !formData.quantity) return

        addOrUpdateStock({
            id: editingId,
            sector: formData.sector,
            name: formData.name,
            buyDate: formData.buyDate,
            pricePerShare: Number(formData.pricePerShare),
            quantity: Number(formData.quantity),
            memo: formData.memo,
        })

        setFormData({ ...EMPTY_FORM })
        setEditingId(null)
        setActiveTab('portfolio')
    }

    const handleCancelEdit = () => {
        setFormData({ ...EMPTY_FORM })
        setEditingId(null)
        setActiveTab('portfolio')
    }

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
