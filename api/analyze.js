// Vercel Serverless Function - Universal Solana Token Detector
const axios = require('axios');

module.exports = async (req, res) => {
    const { mint } = req.query;
    const JUP_API_KEY = 'jup_45628fb7a2a0fae5631fe113c68ee7bb117bb35a8913327af2b83362cbcb6970';
    const HEADERS = { 'x-api-key': JUP_API_KEY };

    if (!mint) return res.status(400).json({ error: "Mint address required" });

    try {
        // 1. Fetch Metadata from Jupiter's most comprehensive list
        const tokenRes = await axios.get(`https://tokens.jup.ag/token/${mint}`).catch(() => null);
        
        // 2. Fetch Price with Double Fallback (V3 -> V2)
        let priceData = null;
        let priceSource = "None";

        try {
            const pV3 = await axios.get(`https://api.jup.ag/price/v3?ids=${mint}`, { headers: HEADERS, timeout: 2000 });
            if (pV3.data.data[mint]) {
                priceData = pV3.data.data[mint];
                priceSource = "Jupiter V3 (Verified)";
            }
        } catch(e) {}

        if (!priceData) {
            try {
                const pV2 = await axios.get(`https://api.jup.ag/price/v2?ids=${mint}`, { headers: HEADERS, timeout: 2000 });
                if (pV2.data.data[mint]) {
                    priceData = pV2.data.data[mint];
                    priceSource = "Jupiter V2 (All Tokens)";
                }
            } catch(e) {}
        }

        // Final JSON response (Never return HTML)
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({
            price: priceData,
            token: tokenRes ? tokenRes.data : { name: "Unknown Solana Token", symbol: "SOL-MINT" },
            meta: {
                detected: !!(tokenRes || priceData),
                source: priceSource,
                mint: mint
            }
        });
    } catch (err) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ 
            error: true, 
            message: err.message,
            token: { name: "Detecting...", symbol: "MINT" }
        });
    }
};
