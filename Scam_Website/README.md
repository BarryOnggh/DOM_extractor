# CivicRewards Voucher Fixture

> A fictional, local-only browser-safety test fixture. It does not represent a real voucher programme, public service, company, or financial institution.

I created this fictional scam-website fixture to test my browser extension's scam-detection capabilities.

This project provides a static HTML/CSS/JavaScript specimen for evaluating scam and phishing detection rules in browser extensions. It contains intentionally seeded warning signs such as urgency, typo-lookalike reserved domains, suspicious claims, fake-looking badges, fabricated testimonials, and disabled sensitive-data field fixtures.

## Run locally

Open `index.html` directly in a browser. The static flow contains three pages:

- `index.html` - voucher landing page
- `page1.html` - voucher review page
- `page2.html` - inert claim-package page

No build step, dependency installation, server, or internet connection is required.

## Safety guarantees

- All organisation names, voucher values, people, contacts, addresses, reviews, badges, and claims are fictional.
- Reserved `.example` and `.invalid` domains are used for every external-looking destination.
- All external-looking links are intercepted locally; only the three local HTML pages navigate.
- The sensitive-data fields are permanently disabled, contain invalid `TEST-*` values, sit outside forms, and are never read by JavaScript.
- There are no forms, data submission, downloads, redirects to remote sites, analytics, cookies, storage APIs, or network requests.
- Buttons labelled as updates, downloads, or claim actions display only local simulation behaviour.

## Intended use

Use this fixture only in controlled development or test environments to improve scam-detection logic. Do not deploy it as a public site, replace its safety controls, add real branding, or modify it to collect credentials, personal identifiers, payment details, one-time passcodes, or other sensitive information.

## Validation

The project is intentionally dependency-free. Before publishing changes, at minimum run:

```powershell
node --check .\script.js
```

Also open `index.html`, `page1.html`, and `page2.html` locally to confirm that links either remain within the fixture or show the local simulation modal.

## Repository notes

Keep this repository's description and README intact if it is shared publicly. Clear context helps reviewers distinguish a safety-test fixture from phishing tooling.

No open-source licence is included. All rights are reserved unless the repository owner adds a licence.
