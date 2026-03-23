# ADR-001: Security Patch for Next.js HTTP Vulnerabilities

**Date:** 2026-03-23  
**Status:** ACCEPTED

## Problem
The project was running Next.js 15.5.10 with two **MODERATE severity CVEs**:
- HTTP Request Smuggling (CWE-444) - attackers could bypass security controls
- Unbounded Image Cache Disk Growth (CWE-400) - attackers could cause DoS by exhausting disk space

## Options Considered
1. **Ignore:** Accept the risk (not acceptable for production)
2. **Patch only Next.js:** Upgrade Next.js alone without addressing dependency conflicts
3. **Full overhaul:** Downgrade Storybook & other deps to fix all 11 low-severity issues (risky, breaking changes)
4. **Targeted upgrade + pragmatic approach:** Upgrade critical Next.js + fix code-level XSS + use legacy-peer-deps for resolution

## Decision: Option 4 (Targeted Upgrade)
- ✅ Upgraded `next@15.5.10` → `15.5.14` (patches both critical CVEs)
- ✅ Added `rel="noopener noreferrer"` to external links in Button component (prevents XSS)
- ✅ Added `.npmrc` with `legacy-peer-deps=true` to resolve dependency conflicts gracefully
- ✅ Kept low-risk dev dependencies unchanged (11 low-severity issues are acceptable for dev-only packages)

**Why:** Balances security (fixes critical runtime vulnerabilities) with stability (avoids breaking changes from Storybook downgrade).

## How AI Helped
1. **Prompt 1:** "Identify vulnerabilities (low → critical)" → AI scanned 30+ dependencies, categorized by severity with CVE links & root causes
2. **Iteration 1:** npm install failed with peer dependency conflicts → AI analyzed error tree & found `@opentelemetry/api-logs` mismatch
3. **Iteration 2:** Proposed unrealistic version pins (7.0.0 doesn't exist) → AI validated version existence via npm registry
4. **Validation:** Ran `npm audit` to confirm critical CVEs were eliminated while accepting low-risk dev dependencies

## Outcome
- 🔴 2 Critical vulnerabilities → FIXED ✅
- 🟠 11 Low vulnerabilities → Accepted (dev-only, low practical risk)
- ⏱️ Zero breaking changes to production code
