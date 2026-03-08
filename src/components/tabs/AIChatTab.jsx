import React, { useRef, useEffect } from 'react'
import { GeminiService } from '../../api/geminiService'

export function AIChatTab({ stocks, apiKey, chatMessages, setChatMessages, chatInput, setChatInput, isChatLoading, setIsChatLoading }) {
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

        setChatMessages(prev => [...prev, { role: 'user', content: userMsg }])
        setChatInput('')
        setIsChatLoading(true)

        try {
            const text = await GeminiService.getInvestmentAdvice(apiKey, stocks, userMsg)
            setChatMessages(prev => [...prev, { role: 'ai', content: text }])
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
