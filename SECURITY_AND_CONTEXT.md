# GovAssist context and risk architecture

GovAssist keeps navigation assistance, page analysis, and risk scoring separate:

- `Frontend/lib/page-analysis.js` sanitises URLs and visible text, classifies pages and fields, and creates route/content fingerprints.
- `Frontend/lib/suggestions.js` creates target-backed local suggestions, validates AI suggestions, removes duplicates, blocks sensitive/destructive intents, and caches results.
- `Frontend/lib/trust.js` converts locally observed evidence into individual trust signals and deterministic risk/confidence scores.
- `Frontend/lib/action-risk.js` evaluates one detected action separately from the website assessment.
- `Frontend/content.js` performs bounded DOM extraction, observes meaningful route/DOM changes, and never reads form values.
- `Frontend/sidepanel.js` renders the trust card, suggestions, and advisory warnings. It aborts stale AI requests and ignores stale page results.
- `Backend/main.py` retains the existing navigation endpoint and adds optional multilingual suggestion refinement. Pydantic validates both AI response types.

## Risk model

Risk and confidence are independent integer scores from 0 to 100.

- Risk `0–29`: Low
- Risk `30–64`: Medium
- Risk `65–100`: High
- A low score with confidence below 40 is shown as Unknown rather than confidently low risk.

Warning and critical signals contribute `weight × reliability × status factor`. Signals with the same underlying cause are grouped: the strongest contribution is counted fully and overlapping contributions count at 25%. Explicit combination bonuses cover related evidence such as a young lookalike domain plus a credential request. Bonuses are capped. A confirmed reputation match, if a reliable source is configured in the future, remains the only single signal intended to carry decisive weight.

Form assessment first infers the page purpose (for example login, checkout, application, government-voucher redemption, prize entry, or prize claim). It then classifies every enabled field by the kind of information requested and checks whether that information is expected, questionable, unexpected, or unknown for that purpose. Combination rules increase risk when mismatched fields occur with reinforcing evidence such as government branding on an unrecognised domain, identity-related spelling errors, urgency, or a prize claim.

Confidence increases with a parsed URL, classified page, useful headings/targets, locally observable behaviour, a confident page-purpose result, completed field-appropriateness checks, and reliable signals. Missing domain age and reputation are explicit Unknown signals and reduce confidence; they never lower risk.

## Security Mode

Security Mode is a persistent user setting and defaults to on. When off, the content script stops automatic initial, route, and DOM-change analyses, and the side panel suppresses sensitive-action warnings. The restored HDB and CPF shortcuts are local, so page loads do not make background suggestion POST requests in either mode. User-initiated AI navigation and voice requests remain available and contact the backend only after an explicit action.

## Privacy

- The scanner records field type, label, disabled state, sensitivity class, and semantic data kind—not values.
- Selected options, password values, OTPs, card data, account numbers, identity numbers, uploaded file contents, and submission bodies are never collected.
- Query strings and unsafe fragments are removed before URLs leave the page.
- Visible summaries redact email addresses, long account/card-like numbers, identity patterns, UUIDs, tokens, and explicitly labelled credential values.
- Only bounded titles, descriptions, headings, controls, links, form metadata, breadcrumbs, ARIA labels, and short visible-text excerpts are used.
- Numeric risk scores are local and deterministic. AI cannot override them.
- No new browser permissions or runtime dependencies were added.

## Current limitations

Chrome content scripts cannot directly inspect certificate chains, domain registration age, or authoritative reputation without an external data source. These signals remain Unknown. Permission prompts and popups that occur before the document-idle content script starts may not be observable. Brand matching and recognised government-domain patterns are conservative local checks, not proof that a site is official. Spelling checks cover a small set of high-signal English identity and claim terms; a spelling error is supporting evidence and is not decisive by itself.

## Verification

From this directory:

```text
npm.cmd test
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run build
python -m unittest discover -s Backend -p "test*.py"
```
