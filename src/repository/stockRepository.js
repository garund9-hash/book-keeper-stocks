const STORAGE_KEY = 'stocks'

export const StockRepository = {
    getAll: () => {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
        } catch {
            return []
        }
    },
    saveAll: (stocks) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stocks))
    }
}
