# CINENTO Website — Phase 1 checkpoint

Version: 1.1 | Updated: 2026-11-14

## Verified on production at commit 1364ee9

- Desktop language selection, persisted preference and EN/TR/FA/AR routing.
- RTL and Vazirmatn font on Persian and Arabic.
- Hero next, previous and pause controls.
- Complete service text opens without stretching neighboring cards.
- No horizontal overflow or failed loaded images in the observed desktop viewport.

## Prepared correction

The homepage server entry now loads the existing public content, media and
published-program readers in parallel. The existing interactive homepage receives
that data before rendering; seeded data avoids duplicate browser requests.
Fallback readers remain available if a source is unavailable. No CMS records,
credentials, authorization rules or legal approvals are changed.

## Dashboard actions still required

1. Arabic Hero slide 2 (ID 56ad223a-5bdc-42cc-8e04-f290f724839f):
   primary destination remains /platforms; set its Arabic label to
   "استكشف منصاتنا". Secondary destination remains #contact; set its label to
   "ابدأ مشروعك". These destinations are shared with other languages; change
   only the Arabic labels.
2. Shared footer is currently disabled. Review the saved legal owner, registration
   country, official address, contact values and visibility before enabling it.
   Verify the public footer after saving and reloading. Do not approve legal links
   without the required reviewed documents and approval metadata.

## Outstanding validation

- Preview and production visual checks for the server-loaded homepage.
- Mobile and reduced-motion tests.
- Authenticated saving and persistence of the two dashboard corrections.
- Qualified review of legal documents remains separate work.
