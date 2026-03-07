export const formatKRW = (n) => '₩' + Number(n).toLocaleString('ko-KR')

export const genId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
