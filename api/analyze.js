// Universal Solana Token Detector - Zero Dependency (Native Fetch)
module.exports = async (req, res) => {
    const { mint } = req.query;
    const JUP_API_KEY = 'jup_45628fb7a2a0fae5631fe113c68ee7bb117bb35a8913327af2b83362cbcb6970';
    const HEADERS = { 'x-api-key': JUP_API_KEY };

    if (!mint) return res.status(400).json({ error: "Mint address required" });

    try {
        // 1. Metadata from Jupiter (Comprehensive list)
        const tokenRes = await fetch(`https://tokens.jup.ag/token/${mint}`).then(r => r.ok ? r.json() : null).catch(() => null);
        
        let priceData = null;
        let priceSource = "None";

        // 2. Price V3 Lookup
        const pV3 = await fetch(`https://api.jup.ag/price/v3?ids=${mint}`, { headers: HEADERS }).then(r => r.json()).catch(() => null);
        
        if (pV3 && pV3.data && pV3.data[mint]) {
            priceData = pV3.data[mint];
            priceSource = "Jupiter V3";
        } else {
            // 3. FALLBACK: USE QUOTE API (Most powerful for real-time unindexed tokens)
            // We simulate a 1 USDC swap to see if the token exists and has a price
            const quoteRes = await fetch(`https://api.jup.ag/swap/v6/quote?inputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&outputMint=${mint}&amount=1000000&slippageBps=50`).then(r => r.json()).catch(() => null);
            
            if (quoteRes && quoteRes.outAmount) {
                const decimals = tokenRes?.decimals || 9;
                const outAmountHuman = quoteRes.outAmount / Math.pow(10, decimals);
                // Inverse price: 1 USDC / outAmount 
                const derivedPrice = 1 / outAmountHuman;
                
                priceData = {
                    usdPrice: derivedPrice,
                    priceChange24h: 0 // New tokens won't have 24h data
                };
                priceSource = "Jupiter Real-time Quote";
            }
        }

        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({
            price: priceData,
            token: tokenRes || { name: "New Solana Token", symbol: "NEW", decimals: 9 },
            meta: {
                mint: mint,
                source: priceSource,
                timestamp: new Date().toISOString()
            }
        });
    } catch (err) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({ error: true, message: err.message });
    }
};
