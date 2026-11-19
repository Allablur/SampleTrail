# Sample Trail

Music genealogy prototype built with HTML, CSS and JavaScript. Open `index.html` or serve the directory via `python -m http.server 8000`. Explore a starter collection of 13 recordings and seven cited sample relationships, including a three-generation trail from Edwin Birdsong to Daft Punk to Kanye West.

## Data and attribution

`data.js` contains curated factual recording relationships; each edge links to its supporting community-edited MusicBrainz release credits. Coverage is deliberately limited, and genre tags are editorial. Spotify links open Spotify search; no audio is downloaded, stored or analyzed. The graphic vinyl artwork is generated in CSS rather than copyrighted album art.

## Live MusicBrainz integration (deployed)

`live.js` adds catalogue search, exact recording selection, forward/reverse sample credits, clickable relationship nodes and locally saved live recordings. The curated collection remains independently accessible. The backend is a Supabase Edge Function at `supabase/functions/sampletrail-musicbrainz/index.ts`; its database setup is `supabase/schema.sql`. The deployed backend runs in the intended SoundLab project. The public catalogue endpoint uses a fixed MusicBrainz base URL and whitelisted operations, a dedicated server-only cache and atomic global gate (1.2 seconds, 400 new requests per day), a meaningful identifying User-Agent and explicit origins. It never reads the personal SoundLab workspace table. No secret credentials appear in this repository.

Deployment steps: execute the schema in Supabase SQL Editor; deploy the `sampletrail-musicbrainz` function with legacy JWT verification disabled for the intentionally public metadata endpoint; validate that search and recording lookup succeed; then publish the front end. The configured public client key is not a service-role key. Use `node --test tests/edge.test.mjs` for mocked route checks. The deployed backend has been verified with a live search and the Through the Wire / Through the Fire relationship in both directions.

## Next implementation stages

1. Implement an appropriately rate-limited server-side MusicBrainz recording search and relationship retrieval, with a meaningful application User-Agent. See https://musicbrainz.org/doc/MusicBrainz_API and https://musicbrainz.org/doc/MusicBrainz_API/Rate_Limiting.
2. Match recording IDs to Spotify track IDs with ISRC and artist/title verification, using authorized Spotify API access. Keep any client secret server-side; use PKCE for user sign-in. See https://developer.spotify.com/documentation/web-api.
3. Expand the graph to support branching recording relationships and distinguish samples, interpolations, covers and remixes.
4. Persist verified edges, sources and moderation status in Supabase; reject anonymous writes or unverified public submissions.
5. Add actual curated artist pages, reports and cross-genre discovery.

Spotify API access is a later stage. MusicBrainz results depend on community coverage; a missing relationship is not evidence that a sample does not exist.
