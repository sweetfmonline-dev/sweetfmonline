# OverSight PI — Feature Article Template

All OverSight PI articles (across the 5 subsections: The Dossier, Fact Check, The Long Read, The Forum, Bolshevik Perspective) render in a rich **magazine-style feature layout**.

The layout has several optional "furniture" pieces. They render **only when data is provided** — fill in what you need, leave the rest blank.

## Required fields (already standard)

| Field | Purpose |
|---|---|
| `title` | Article headline. If it contains ` — ` or `: `, the part after the separator renders in italic red below the main title. E.g. `"Bigger Than You Think: The Man in the Shadows"` → "Bigger Than You Think" + italic "The Man in the Shadows". |
| `slug` | URL path segment. |
| `excerpt` | Renders as the deck/subhead under the headline. Keep to 1–3 sentences. |
| `content` | Rich text body. First paragraph gets an automatic red drop-cap. H2/H3 headings become section breaks. Blockquotes become inline aged-paper pull quotes. |
| `featuredImage` | Cover image — displayed as a 3:4 portrait in the hero. Choose a strong, contrasty image. |
| `category` | Must be one of the OverSight PI subsections. |
| `author`, `publishedAt`, `readTime`, `tags` | Standard fields. |

## Optional feature-article fields

Add these to your Contentful **Article** content model if not already present. All are **optional** — the layout gracefully adapts when any/all are empty.

### 1. `kicker` — short text
Eyebrow text above the headline. Example:
```
In-Depth Profile · Power & Influence
```
Defaults to the subsection's kicker (e.g. "Long-Form Investigations" for The Dossier) if not provided.

### 2. `issueLabel` — short text
Optional extra issue tag displayed in the masthead meta. Example:
```
Special Profile Edition
```
The masthead automatically computes Volume (Roman numeral) + Issue (month number) + Month Year from `publishedAt`. `issueLabel` is appended to that.

### 3. `pullQuote` — long text
The large **red pull-quote bar** between the hero and the body. Use for a single punchy sentence. Example:
```
It was intended as a derogatory title to mock me. Being the teacher that I am, I adopted it just to shame them.
```

### 4. `pullQuoteAttribution` — short text
Attribution shown alongside the pull quote. Example:
```
Asiedu Nketiah
on "General Mosquito"
```
(Line breaks in the attribution display as-is.)

### 5. `sidebarStats` — JSON array
Big-number stat cards in the sidebar. Up to 3 work well. Shape:
```json
[
  { "number": "30+", "label": "Years in Ghanaian Politics" },
  { "number": "2×",  "label": "NDC returned to power under him" }
]
```

### 6. `keyRoles` — JSON array
"Key Roles" sidebar box (positions/roles held). Shape:
```json
[
  { "period": "Current",         "role": "NDC National Chairman" },
  { "period": "Since June 2025", "role": "Board Chairman, Ghana Ports & Harbours Authority" },
  { "period": "2005–2022",       "role": "Longest-serving NDC General Secretary" }
]
```

### 7. `fastFacts` — JSON array
"Fast Facts" sidebar box (biographical or reference data). Shape:
```json
[
  { "label": "Born",      "value": "24 Dec 1956, Seikwa, Bono Region" },
  { "label": "Education", "value": "BSc Business Admin, UG; MA Defence & Int'l Politics, GAFCC" },
  { "label": "Nickname",  "value": "General Mosquito" }
]
```

### 8. `timeline` — JSON array
Dedicated timeline section below the article body. Set `highlight: true` on pivotal moments to get a gold dot. Shape:
```json
[
  { "year": "1956", "title": "Born to royalty", "description": "Born Christmas Eve in Seikwa to the Oyoko and Akwamu royal families." },
  { "year": "2005", "title": "Elected NDC General Secretary", "description": "Wins with nearly 80% of delegate votes.", "highlight": true },
  { "year": "2008", "title": "Engineers NDC's return to power", "description": "Atta Mills wins the presidency.", "highlight": true }
]
```

## How each piece renders

| Data provided | What you get |
|---|---|
| Just `title`, `excerpt`, `content`, `featuredImage` | Hero + body with drop-cap. Clean minimal feature. |
| + `pullQuote` | Red pull-quote bar appears between hero and body. |
| + any of `sidebarStats` / `keyRoles` / `fastFacts` | Right-hand sidebar appears alongside the body. |
| + `timeline` | Dedicated timeline section appears after the body. |
| All fields | Full magazine feature like the Asiedu Nketiah profile. |

## Setting up the Contentful fields

For each optional field above, in **Contentful → Content Model → Article**, click **Add field**:

| Contentful field ID | Type | Notes |
|---|---|---|
| `kicker` | Short text | Single line, max ~80 chars |
| `issueLabel` | Short text | Max ~60 chars |
| `pullQuote` | Long text | Multi-line |
| `pullQuoteAttribution` | Short text | Max ~100 chars |
| `sidebarStats` | JSON object | Validate with schema if desired |
| `keyRoles` | JSON object | |
| `fastFacts` | JSON object | |
| `timeline` | JSON object | |

After adding, republish any existing article to trigger the webhook sync — or leave all fields empty and articles continue working normally.

## Tips for strong feature articles

- **Cover image:** Portrait orientation (3:4) works best. Contrasty, dramatic imagery. Avoid busy backgrounds.
- **Headline:** 8–12 words. Use `:` or ` — ` to create a two-line italic accent if it fits the story.
- **Excerpt/deck:** 30–60 words. This is the "pitch" — tell the reader why this story matters.
- **Body:** Use H2 for major section breaks, H3 for sub-headings. Blockquotes become inline pull quotes. Bold for emphasis on key data points.
- **Pull quote:** One sentence. The sharpest, most punchy line in the whole piece. Attribution goes on a new line.
- **Sidebar:** 2 stats + "Key Roles" + "Fast Facts" is the standard shape. Don't overload — 3 stats max.
- **Timeline:** 5–10 entries ideal. Mark 2–3 as `highlight: true` for visual rhythm.
