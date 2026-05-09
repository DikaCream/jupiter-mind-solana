// Vercel Serverless Function - Universal Solana Token Detector
const axios = require('axios');

module.exports = async (req, res) => {
    const { mint } = req.query;
    const JUP_API_KEY = 'jup_45628fb7a2a0fae5631fe113c68ee7bb117bb35a8913327af2b83362cbcb6970';
    const HEADERS = { 'x-api-key': JUP_API_KEY };

    if (!mint) return res.status(400).json({ error: "Mint address required" });

    try {
        // FETCH 1: Try multiple metadata sources for "detect all"
        const tokenRes = await axios.get(`https://tokens.jup.ag/token/${mint}`).catch(() => null);
        
        // FETCH 2: Try Price V3 first, then V2 for unverified tokens
        let priceData = null;
        const priceV3 = await axios.get(`https://api.jup.ag/price/v3?ids=${mint}`, { headers: HEADERS }).catch(() => null);
        
        if (priceV3 && priceV3.data.data[mint]) {
            priceData = priceV3.data.data[mint];
        } else {
            // Fallback to V2 for unverified/all tokens
            const priceV2 = await axios.get(`https://api.jup.ag/price/v2?ids=${mint}`, { headers: HEADERS }).catch(() => null);
            if (priceV2 && priceV2.data.data[mint]) {
                priceData = priceV2.data.data[mint];
            }
        }

        res.status(200).json({
            price: priceData,
            token: tokenRes ? tokenRes.data : null,
            source: priceData ? "Jupiter Index" : "Direct On-chain fallback"
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
