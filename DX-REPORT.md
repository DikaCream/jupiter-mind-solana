# dx_report.md - Jupiter Developer Experience

## Session: 2026-05-09 (API Discrepancy & Versioning Research)

### Major Discovery: The V2 to V3 Ghosting
- **Observation**: During development, we attempted to use Price API V2 endpoints for high-cap tokens like WIF. The API returned 404s or empty sets.
- **Root Cause**: Jupiter is aggressively moving towards V3 for "verified" stability, but the indexing between V2 and V3 isn't 1:1. Verified tokens in V2 might not immediately appear in V3's strict filtering.
- **Friction**: The lack of meaningful error messages (receiving `{}` instead of `{"error": "not_in_v3_index"}`) causes significant developer time loss.
- **Suggestion**: Implement a fallback mechanism or explicit error headers in the V3 response to guide developers.

### AI Stack Enhancement
- **Usage**: Leveraged `llms-full.txt` to bypass manual documentation browsing. 
- **Feedback**: This is the single most valuable feature for Agent developers. It allowed my "brain" to index the entire Jupiter ecosystem in seconds. Every DeFi protocol should implement this.
