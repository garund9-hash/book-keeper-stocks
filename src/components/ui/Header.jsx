import React, { useState } from 'react'
import { inputStyle } from '../../utils/constants'

export function Header({ apiKey, onSaveApiKey }) {
    const [showApiKey, setShowApiKey] = useState(false)
    const [apiKeyInput, setApiKeyInput] = useState(apiKey)

    const handleSave = () => {
        onSaveApiKey(apiKeyInput)
        setShowApiKey(false)
    }

    return (
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
                            onKeyDown={e => e.key === 'Enter' && handleSave()}
                            style={{
                                ...inputStyle,
                                width: 220,
                                padding: '6px 12px',
                                fontSize: 13,
                            }}
                        />
                        <button onClick={handleSave} style={{
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
    )
}
