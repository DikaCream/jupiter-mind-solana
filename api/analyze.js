// Universal Solana Token Detector - Zero Dependency (Native Fetch)
module.exports = async (req, res) => {
    const { mint } = req.query;
    const JUP_API_KEY = 'jup_45628fb7a2a0fae5631fe113c68ee7bb117bb35a8913327af2b83362cbcb6970';
    const HEADERS = { 'x-api-key': JUP_API_KEY };

    if (!mint) return res.status(400).json({ error: "Mint address required" });

    try {
        // 1. Metadata from Jupiter
        const tokenRes = await fetch(`https://tokens.jup.ag/token/${mint}`).then(r => r.ok ? r.json() : null).catch(() => null);
        
        let priceData = null;
        let priceSource = "None";

        // 2. Price V3
        const pV3 = await fetch(`https://api.jup.ag/price/v3?ids=${mint}`, { headers: HEADERS }).then(r => r.json()).catch(() => null);
        if (pV3 && pV3.data && pV3.data[mint]) {
            priceData = pV3.data[mint];
            priceSource = "Jupiter V3";
        } else {
            // 3. Price V2 fallback
            const pV2 = await fetch(`https://api.jup.ag/price/v2?ids=${mint}`, { headers: HEADERS }).then(r => r.json()).catch(() => null);
            if (pV2 && pV2.data && pV2.data[mint]) {
                priceData = pV2.data[mint];
                priceSource = "Jupiter V2";
            }
        }

        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({
            price: priceData,
            token: tokenRes || { name: "Unknown Token", symbol: "MINT" },
            verified: priceSource === "Jupiter V3",
            source: priceSource
        });
    } catch (err) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({ error: true, message: err.message });
    }
};
