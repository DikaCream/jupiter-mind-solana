# 🪐 JupiterMind: The Next-Gen DeFi Oracle

> Build for the Jupiter "Not Your Regular Bounty".

JupiterMind isn't a trading bot. It's a **Cognitive DeFi Layer**. It bridges the gap between complex on-chain data and human intuition by using Jupiter's full API stack to generate actionable investment theses.

## 🚀 The "Oh!" Factor: Multi-Modal Sentiment
JupiterMind doesn't just look at spot prices. It cross-references:
1. **Spot Liquidity** (Price/Quote API)
2. **Market Sentiment** (Prediction Markets API)
3. **Leverage Overhang** (Perps API)

When these three misalign (e.g., Prediction Markets are bearish but Spot is consolidating), JupiterMind flags an "Optimistic Divergence" — a thesis that simple bots cannot generate.

## 🛠 Tech Stack
- **Jupiter Price V3**: For high-accuracy baseline data.
- **Jupiter Prediction Markets**: For identifying crowd sentiment.
- **Jupiter Perps**: For assessing market risk/leverage.
- **Jupiter CLI**: For agent-native execution.

## 📖 Evaluation Checklist
- [x] **Project**: Functional AI engine (engine.js)
- [x] **DX Report**: Deep-dive into API V2/V3 transition issues and metadata friction.
- [x] **In-Editor Guide**: Full use of `llms-full.txt` and `skills`.
