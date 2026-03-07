import React from 'react'
import { btnStyle } from '../../utils/constants'

export function DeleteModal({ target, onConfirm, onCancel }) {
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
