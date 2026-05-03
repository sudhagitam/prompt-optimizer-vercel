# Prompt Optimization Engine

Transform raw user intent into production-ready, low-token LLM prompts — powered by Claude claude-sonnet-4-20250514 with real-time streaming.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + inline CSS variables (dark theme)
- **AI**: Anthropic SDK (`@anthropic-ai/sdk`) with Edge streaming
- **Fonts**: Syne + DM Mono (Google Fonts)
- **Deployment**: Vercel (Edge Runtime)

## Project Structure

```
prompt-optimizer/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── optimize/
│   │   │       └── route.ts        # Edge API route (SSE streaming)
│   │   ├── globals.css             # Base styles, CSS vars, fonts
│   │   ├── layout.tsx              # Root layout + metadata
│   │   └── page.tsx                # Home page
│   ├── components/
│   │   ├── OptimizerForm.tsx       # Main form (client component)
│   │   ├── OutputPanel.tsx         # Streaming output display
│   │   ├── TaskPill.tsx            # Task type pill selector
│   │   └── Field.tsx               # FieldLabel + SectionSep
│   ├── lib/
│   │   └── promptBuilder.ts        # System/user prompt construction
│   └── types/
│       └── index.ts                # Shared TypeScript types + constants
├── .env.local.example
├── .gitignore
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── vercel.json
```

## Local Development

### 1. Clone & install

```bash
git clone https://github.com/YOUR_USERNAME/prompt-optimizer.git
cd prompt-optimizer
npm install
```

### 2. Set up environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Anthropic API key:

```
ANTHROPIC_API_KEY=sk-ant-...
```

Get your key at [console.anthropic.com](https://console.anthropic.com).

### 3. Run dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

### Option A: Vercel CLI

```bash
npm i -g vercel
vercel
```

When prompted, add environment variable:
- `ANTHROPIC_API_KEY` → your key

### Option B: Vercel Dashboard

1. Push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/prompt-optimizer.git
   git push -u origin main
   ```

2. Go to [vercel.com/new](https://vercel.com/new) → Import your repo

3. Under **Environment Variables**, add:
   - Name: `ANTHROPIC_API_KEY`
   - Value: `sk-ant-...`

4. Click **Deploy**

## Features

- **4 output styles**: Ask, Agent, Chain-of-thought, Structured
- **4 optimization goals**: Token efficiency, Accuracy, Determinism, Creative quality  
- **8 task types**: Code, UI, API, Architecture, Debugging, Analysis, Writing, Data
- **Real-time streaming** via Server-Sent Events on Edge Runtime
- **Token estimation** on completed output
- **One-click copy** to clipboard
- **Dark theme** with monospace output rendering

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | ✅ | Anthropic API key from console.anthropic.com |
