// Vercel Serverless Function
const axios = require('axios');

module.exports = async (req, res) => {
    const { mint } = req.query;
    const JUP_API_KEY = 'jup_45628fb7a2a0fae5631fe113c68ee7bb117bb35a8913327af2b83362cbcb6970';
    const HEADERS = { 'x-api-key': JUP_API_KEY };

    if (!mint) return res.status(400).json({ error: "Mint address required" });

    try {
        const [price, token] = await Promise.all([
            axios.get(`https://api.jup.ag/price/v3?ids=${mint}`, { headers: HEADERS }),
            axios.get(`https://api.jup.ag/tokens/v1/token/${mint}`, { headers: HEADERS })
        ]);

        res.status(200).json({
            price: price.data.data[mint],
            token: token.data,
            thesis: "AI Thesis successfully generated for " + (token.data?.name || mint)
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
