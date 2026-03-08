# Getting Started

Welcome to the **Book Keeper Stocks** application! This guide will help you set up the project locally.

## Prerequisites
Ensure your local environment meets the following requirements:
- **Node.js**: (v18 or higher recommended)
- **npm**: (v9 or higher)
- **API Key**: A valid Gemini API Key (obtain from [Google AI Studio](https://aistudio.google.com/app/apikey))

## Step-by-Step Setup

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <repository-url>
   cd book-keeper-stocks
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the Development Server**:
   ```bash
   npm run dev
   ```

4. **Access the application**:
   Open [http://localhost:5173](http://localhost:5173) (or the port Vite provides) in your browser.

5. **Configure API Key**:
   - In the app header, click the **🔑 API Key** button.
   - Enter your Gemini API Key and click **Save**. (Security note: the key is only saved in your browser's current `sessionStorage`).
   - You can now use the **AI Chat Tab** to get personalized portfolio advice!

## Troubleshooting

- **AI Chat stops responding / Error loading data**: Ensure your Gemini API Key is valid and hasn't expired or hit rate limits. Check the browser console for specific errors.
- **Port 5173 is already in use**: Vite will automatically try the next available port. Check the terminal output after running `npm run dev` to find the exact URL.
- **Lost Data**: Stock profile data is saved to `localStorage`, while API keys are in `sessionStorage`. Clearing your browser data will wipe out this information.
