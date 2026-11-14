# CINENTO Website — Phase 1 checkpoint

Version: 1.2 | Updated: 2026-11-14

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

## Dashboard corrections — saved and verified on production

1. Arabic Hero slide 2 labels now match their unchanged destinations:
   "استكشف منصاتنا" opens /platforms; "ابدأ مشروعك" opens #contact.
2. Shared footer is enabled; the saved legal owner and corrected Instagram
   destination are present in the public footer. Legal document review remains separate.

## Mobile screenshot findings and prepared correction

User-supplied Arabic mobile screenshots show readable single-column cards and
the legal footer. They also show a tall two-row header with content visible
underneath, and reversed service counters. The prepared correction compacts
the mobile header, gives it an opaque theme background, bounds the mobile menu
to the viewport, preserves all three controls and isolates counters as LTR.
No dashboard content is replaced.

## Outstanding validation

- Server-loaded content was verified in the production HTML across all four locales.
- Mobile and reduced-motion tests.
- Preview and phone visual checks for the mobile header correction.
- Project and catalog Arabic translations are incomplete; complete them in the content phase.
- Qualified review of legal documents remains separate work.
