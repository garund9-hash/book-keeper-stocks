export const GeminiService = {
    async getInvestmentAdvice(apiKey, portfolio, userQuestion) {
        const systemPrompt = `당신은 주식 투자 전문가입니다. 사용자의 포트폴리오를 기반으로 전문적이고 친절한 조언을 제공하세요.\n현재 포트폴리오:\n${JSON.stringify(portfolio, null, 2)}`

        const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    systemInstruction: {
                        parts: [{ text: systemPrompt }]
                    },
                    contents: [{ role: 'user', parts: [{ text: userQuestion }] }]
                }),
            }
        )

        const data = await res.json()
        if (data.error) throw new Error(data.error.message)

        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '응답을 받지 못했습니다.'
        return text
    }
}
