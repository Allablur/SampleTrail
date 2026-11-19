# Sample Trail

Music genealogy prototype built with HTML, CSS and JavaScript. Open `index.html` or serve the directory via `python -m http.server 8000`. Explore a starter collection of 13 recordings and seven cited sample relationships, including a three-generation trail from Edwin Birdsong to Daft Punk to Kanye West.

## Data and attribution

`data.js` contains curated factual recording relationships; each edge links to its supporting community-edited MusicBrainz release credits. Coverage is deliberately limited, and genre tags are editorial. Spotify links open Spotify search; no audio is downloaded, stored or analyzed. The graphic vinyl artwork is generated in CSS rather than copyrighted album art.

## Next implementation stages

1. Implement an appropriately rate-limited server-side MusicBrainz recording search and relationship retrieval, with a meaningful application User-Agent. See https://musicbrainz.org/doc/MusicBrainz_API and https://musicbrainz.org/doc/MusicBrainz_API/Rate_Limiting.
2. Match recording IDs to Spotify track IDs with ISRC and artist/title verification, using authorized Spotify API access. Keep any client secret server-side; use PKCE for user sign-in. See https://developer.spotify.com/documentation/web-api.
3. Expand the graph to support branching recording relationships and distinguish samples, interpolations, covers and remixes.
4. Persist verified edges, sources and moderation status in Supabase; reject anonymous writes or unverified public submissions.
5. Add actual curated artist pages, reports and cross-genre discovery.

Only the starter collection is available in this release. This is a working prototype, not a live Spotify or MusicBrainz client.
