import React from 'react'
import { SECTORS, labelStyle, labelText, inputStyle, btnStyle } from '../../utils/constants'
import { formatKRW } from '../../utils/formatters'

export function AddStockTab({ formData, setFormData, editingId, onSave, onCancel }) {
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
