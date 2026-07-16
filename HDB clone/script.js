/*
  HDB information site
  Vanilla JavaScript only. Internal pages use hash routes so the site works via file://.
*/

"use strict";

/* Exact public information routes exposed by the HDB navigation on 10 July 2026. */
var coreRoutePairs = [
  ["/about-us","About Us"],["/hdb-pulse","HDB Pulse"],["/buying-a-flat","Buying a Flat"],
  ["/managing-my-home","Managing My Home"],["/renting-a-flat","Renting a Flat"],
  ["/shops-and-offices","Shops and Offices"],["/business-partners","Business Partners"],
  ["/parking","Parking"],["/eservices","e-Services"],
  ["/buying-a-flat/flat-grant-and-loan-eligibility","Flat, Grant, and Loan Eligibility"],
  ["/buying-a-flat/flat-grant-and-loan-eligibility/application-for-an-hdb-flat-eligibility-hfe-letter","Application for an HDB Flat Eligibility (HFE) Letter"],
  ["/buying-a-flat/flat-grant-and-loan-eligibility/couples-and-families","Couples and Families"],
  ["/buying-a-flat/flat-grant-and-loan-eligibility/seniors","Seniors"],
  ["/buying-a-flat/flat-grant-and-loan-eligibility/singles","Singles"],
  ["/buying-a-flat/flat-grant-and-loan-eligibility/housing-loan","Housing Loan"],
  ["/buying-a-flat/financial-planning-for-a-flat-purchase","Financial Planning for a Flat Purchase"],
  ["/buying-a-flat/financial-planning-for-a-flat-purchase/ability-to-pay","Ability to Pay"],
  ["/buying-a-flat/financial-planning-for-a-flat-purchase/budget-for-a-flat","Budget for a Flat"],
  ["/buying-a-flat/financial-planning-for-a-flat-purchase/credit-to-finance-a-flat-purchase","Credit to Finance a Flat Purchase"],
  ["/buying-a-flat/bto-sbf-and-open-booking-of-flats","BTO, SBF, and Open Booking of Flats"],
  ["/buying-a-flat/bto-sbf-and-open-booking-of-flats/process-for-buying-a-new-flat","Process for Buying a New Flat"],
  ["/buying-a-flat/bto-sbf-and-open-booking-of-flats/finding-a-new-flat","Finding a New Flat"],
  ["/buying-a-flat/bto-sbf-and-open-booking-of-flats/conditions-after-buying-a-new-flat","Conditions After Buying a New Flat"],
  ["/buying-a-flat/resale-flats","Resale Flats"],
  ["/buying-a-flat/resale-flats/process-for-buying-a-resale-flat","Process for Buying a Resale Flat"],
  ["/buying-a-flat/resale-flats/finding-a-resale-flat","Finding a Resale Flat"],
  ["/buying-a-flat/resale-flats/conditions-after-buying-a-resale-flat","Conditions After Buying a Resale Flat"],
  ["/buying-a-flat/executive-condominiums","Executive Condominiums"],
  ["/buying-a-flat/executive-condominiums/eligibility","Eligibility"],
  ["/buying-a-flat/executive-condominiums/cpf-housing-grant","CPF Housing Grant"],
  ["/buying-a-flat/executive-condominiums/process-for-buying-an-ec","Process for Buying an EC"],
  ["/buying-a-flat/executive-condominiums/finding-an-ec","Finding an EC"],
  ["/buying-a-flat/executive-condominiums/conditions-after-buying-an-ec","Conditions After Buying an EC"],
  ["/managing-my-home/home-ownership","Home Ownership"],
  ["/managing-my-home/home-ownership/checklist-for-moving-into-flat","Checklist for Moving Into Flat"],
  ["/managing-my-home/home-ownership/fire-insurance","Fire Insurance"],
  ["/managing-my-home/home-ownership/renting-out-a-flat-or-bedrooms","Renting Out a Flat or Bedrooms"],
  ["/managing-my-home/home-ownership/change-of-flat-owners-or-occupiers","Change of Flat Owners or Occupiers"],
  ["/managing-my-home/home-ownership/home-business","Home Business"],
  ["/managing-my-home/home-ownership/keeping-pets","Keeping Pets"],
  ["/managing-my-home/home-ownership/installing-smart-door-devices-and-cctv-cameras","Installing Smart Door Devices and CCTV Cameras"],
  ["/managing-my-home/home-ownership/purchasing-recess-area","Purchasing Recess Area"],
  ["/managing-my-home/home-ownership/acquiring-private-property","Acquiring Private Property"],
  ["/managing-my-home/finances","Finances"],
  ["/managing-my-home/finances/loan-matters","Loan Matters"],
  ["/managing-my-home/finances/cpf-rules-and-early-repayment","CPF Rules and Early Repayment"],
  ["/managing-my-home/finances/citizen-topup","Citizen Top-Up"],
  ["/managing-my-home/selling-a-flat","Selling a Flat"],
  ["/managing-my-home/selling-a-flat/eligibility","Eligibility"],
  ["/managing-my-home/selling-a-flat/process-for-selling-a-flat","Process for Selling a Flat"],
  ["/managing-my-home/retirement-planning","Retirement Planning"],
  ["/managing-my-home/retirement-planning/monetising-flat-for-retirement","Monetising Flat for Retirement"],
  ["/managing-my-home/retirement-planning/use-of-cpf-for-loan-repayment","Use of CPF for Loan Repayment"],
  ["/managing-my-home/renovation-and-maintenance","Renovation and Maintenance"],
  ["/managing-my-home/renovation-and-maintenance/renovation","Renovation"],
  ["/managing-my-home/renovation-and-maintenance/rectification-of-defects-in-new-flats","Rectification of Defects in New Flats"],
  ["/managing-my-home/renovation-and-maintenance/home-maintenance","Home Maintenance"],
  ["/managing-my-home/upgrading-and-redevelopment","Upgrading and Redevelopment"],
  ["/managing-my-home/upgrading-and-redevelopment/enhancement-for-active-seniors-ease","Enhancement for Active Seniors (EASE)"],
  ["/managing-my-home/upgrading-and-redevelopment/home-improvement-programme-hip","Home Improvement Programme (HIP)"],
  ["/managing-my-home/upgrading-and-redevelopment/lift-upgrading-programme-lup","Lift Upgrading Programme (LUP)"],
  ["/managing-my-home/upgrading-and-redevelopment/neighbourhood-renewal-programme-nrp","Neighbourhood Renewal Programme (NRP)"],
  ["/managing-my-home/upgrading-and-redevelopment/selective-en-bloc-redevelopment-scheme-sers","Selective En bloc Redevelopment Scheme (SERS)"],
  ["/managing-my-home/upgrading-and-redevelopment/pay-upgrading-cost","Pay Upgrading Cost"],
  ["/managing-my-home/living-in-my-community","Living in My Community"],
  ["/managing-my-home/living-in-my-community/being-a-good-neighbour","Being a Good Neighbour"],
  ["/managing-my-home/living-in-my-community/enlivening-my-neighbourhood","Enlivening My Neighbourhood"],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood","Exploring My Neighbourhood"],
  ["/managing-my-home/living-in-my-community/practising-ecoliving","Practising Eco-Living"],
  ["/managing-my-home/living-in-my-community/hdb-community-day","HDB Community Day"],
  ["/renting-a-flat/public-rental-scheme","Public Rental Scheme"],
  ["/renting-a-flat/public-rental-scheme/eligibility","Eligibility"],
  ["/renting-a-flat/public-rental-scheme/application-process","Application Process"],
  ["/renting-a-flat/public-rental-scheme/tenancy-matters","Tenancy Matters"],
  ["/renting-a-flat/public-rental-scheme/tenancy-renewal","Tenancy Renewal"],
  ["/renting-a-flat/public-rental-scheme/tenancy-termination","Tenancy Termination"],
  ["/renting-a-flat/parenthood-provisional-housing-scheme","Parenthood Provisional Housing Scheme"],
  ["/renting-a-flat/parenthood-provisional-housing-scheme/eligibility","Eligibility"],
  ["/renting-a-flat/parenthood-provisional-housing-scheme/application-process","Application Process"],
  ["/renting-a-flat/parenthood-provisional-housing-scheme/application-changes-and-cancellation","Application Changes and Cancellation"],
  ["/renting-a-flat/parenthood-provisional-housing-scheme/rents-and-deposits","Rents and Deposits"],
  ["/renting-a-flat/parenthood-provisional-housing-scheme/tenancy-matters","Tenancy Matters"],
  ["/renting-a-flat/renting-from-open-market","Renting from Open Market"],
  ["/renting-a-flat/renting-from-open-market/eligibility","Eligibility"],
  ["/renting-a-flat/renting-from-open-market/tenancy-matters","Tenancy Matters"],
  ["/renting-a-flat/renting-from-open-market/regulations","Regulations"],
  ["/renting-a-flat/renting-from-open-market/rental-statistics","Rental Statistics"],
  ["/shops-and-offices/renting-from-hdb","Renting from HDB"],
  ["/shops-and-offices/renting-from-hdb/shops-and-offices-for-rent","Shops and Offices for Rent"],
  ["/shops-and-offices/renting-from-hdb/hdb-hub-convention-centre-for-rent","HDB Hub Convention Centre for Rent"],
  ["/shops-and-offices/renting-from-hdb/hdb-hub-mall-area-for-rent","HDB Hub Mall Area for Rent"],
  ["/shops-and-offices/renting-from-hdb/crossagency-tenders","Cross-Agency Tenders"],
  ["/shops-and-offices/renting-from-open-market","Renting from Open Market"],
  ["/shops-and-offices/renting-from-open-market/application-guidelines","Application Guidelines"],
  ["/shops-and-offices/buying-from-open-market","Buying from Open Market"],
  ["/shops-and-offices/buying-from-open-market/application-guidelines","Application Guidelines"],
  ["/shops-and-offices/managing-an-hdb-shop-or-office","Managing an HDB Shop or Office"],
  ["/shops-and-offices/managing-an-hdb-shop-or-office/change-of-companys-name","Change of Company’s Name"],
  ["/shops-and-offices/managing-an-hdb-shop-or-office/guidelines-for-hdb-eating-houses","Guidelines for HDB Eating Houses"],
  ["/shops-and-offices/managing-an-hdb-shop-or-office/change-of-partners-shareholders-mode-of-business","Change of Partners, Shareholders, Mode of Business"],
  ["/shops-and-offices/managing-an-hdb-shop-or-office/change-of-trade","Change of Trade"],
  ["/shops-and-offices/managing-an-hdb-shop-or-office/change-of-use","Change of Use"],
  ["/shops-and-offices/managing-an-hdb-shop-or-office/renovation","Renovation"],
  ["/shops-and-offices/managing-an-hdb-shop-or-office/rental-payment","Rental Payment"],
  ["/shops-and-offices/managing-an-hdb-shop-or-office/renting-out","Renting Out"],
  ["/shops-and-offices/managing-an-hdb-shop-or-office/renew-tenancy","Renew Tenancy"],
  ["/shops-and-offices/managing-an-hdb-shop-or-office/terminate-tenancy","Terminate Tenancy"],
  ["/shops-and-offices/managing-an-hdb-shop-or-office/treatment-of-30year-leases","Treatment of 30-Year Leases"],
  ["/shops-and-offices/selling-on-open-market","Selling on Open Market"],
  ["/shops-and-offices/selling-on-open-market/consent-to-mortgage","Consent to Mortgage"],
  ["/shops-and-offices/selling-on-open-market/transfer-ownership-or-sell","Transfer Ownership or Sell"],
  ["/shops-and-offices/selling-on-open-market/documents-and-checklists","Documents and Checklists"],
  ["/shops-and-offices/selling-on-open-market/inspection-report","Inspection Report"],
  ["/shops-and-offices/selling-on-open-market/lodgement-scheme","Lodgement Scheme"],
  ["/shops-and-offices/business-resources","Business Resources"],
  ["/shops-and-offices/business-resources/probusiness-schemes","Pro-Business Schemes"],
  ["/shops-and-offices/business-resources/Newsletter","Newsletter"],
  ["/business-partners/building-professionals-bgbiz","Building Professionals (BGBiz)"],
  ["/business-partners/building-professionals-bgbiz/application-forms","Application Forms"],
  ["/business-partners/building-professionals-bgbiz/renovation-and-aa-works","Renovation and A&A Works"],
  ["/business-partners/building-professionals-bgbiz/submitting-building-plans","Submitting Building Plans"],
  ["/business-partners/building-professionals-bgbiz/updates-for-works-involving-hdb-property","Updates for Works Involving HDB Property"],
  ["/business-partners/land-developers-and-land-users","Land Developers and Land Users"],
  ["/business-partners/land-developers-and-land-users/buying-land-land-sales","Buying Land (Land Sales)"],
  ["/business-partners/land-developers-and-land-users/renting-land-on-temporary-occupation-licence-tol","Renting Land on Temporary Occupation Licence (TOL)"],
  ["/business-partners/tenderers","Tenderers"],
  ["/business-partners/tenderers/hdb-tender-opportunities","HDB Tender Opportunities"],
  ["/business-partners/estate-agents-and-salespersons","Estate Agents and Salespersons"],
  ["/business-partners/estate-agents-and-salespersons/guide-for-estate-agents-buying-a-flat","Guide for Estate Agents: Buying a Flat"],
  ["/business-partners/estate-agents-and-salespersons/guide-for-estate-agents-renting-a-flat","Guide for Estate Agents: Renting a Flat"],
  ["/business-partners/estate-agents-and-salespersons/guide-for-estate-agents-renting-out-a-flat-or-bedrooms","Guide for Estate Agents: Renting Out a Flat or Bedrooms"],
  ["/business-partners/estate-agents-and-salespersons/guide-for-estate-agents-selling-a-flat","Guide for Estate Agents: Selling a Flat"],
  ["/business-partners/estate-agents-and-salespersons/letters-to-keos","Letters to KEOs"],
  ["/business-partners/estate-agents-and-salespersons/resources-for-estate-agents-and-salespersons","Resources for Estate Agents and Salespersons"],
  ["/business-partners/renovation-contractors","Renovation Contractors"],
  ["/business-partners/renovation-contractors/directory-of-renovation-contractors-drc","Directory of Renovation Contractors (DRC)"],
  ["/business-partners/renovation-contractors/important-information-on-renovation","Important Information on Renovation"],
  ["/business-partners/renovation-contractors/windows-installation-and-replacement","Windows Installation and Replacement"],
  ["/business-partners/renovation-contractors/training-courses","Training Courses"],
  ["/parking/applying-for-season-parking","Applying for Season Parking"],
  ["/parking/applying-for-season-parking/apply-for-season-parking","Apply for Season Parking"],
  ["/parking/applying-for-season-parking/apply-for-concessionary-season-parking-for-motorcycles","Apply for Concessionary Season Parking for Motorcycles"],
  ["/parking/applying-for-season-parking/apply-for-family-season-parking","Apply for Family Season Parking"],
  ["/parking/applying-for-season-parking/apply-for-season-parking-for-commercial-vehicles","Apply for Season Parking for Commercial Vehicles"],
  ["/parking/renewing-season-parking","Renewing Season Parking"],
  ["/parking/renewing-season-parking/renew-season-parking","Renew Season Parking"],
  ["/parking/renewing-season-parking/renew-concessionary-season-parking-for-motorcycles","Renew Concessionary Season Parking for Motorcycles"],
  ["/parking/renewing-season-parking/renew-family-season-parking","Renew Family Season Parking"],
  ["/parking/transferring-season-parking","Transferring Season Parking"],
  ["/parking/transferring-season-parking/transfer-season-parking","Transfer Season Parking"],
  ["/parking/transferring-season-parking/transfer-concessionary-season-parking-for-motorcycles","Transfer Concessionary Season Parking for Motorcycles"],
  ["/parking/terminating-season-parking","Terminating Season Parking"],
  ["/parking/terminating-season-parking/terminate-season-parking","Terminate Season Parking"],
  ["/parking/terminating-season-parking/terminate-concessionary-season-parking-for-motorcycles","Terminate Concessionary Season Parking for Motorcycles"],
  ["/parking/terminating-season-parking/terminate-family-season-parking","Terminate Family Season Parking"],
  ["/parking/parking-offences","Parking Offences"],
  ["/parking/parking-offences/parking-rules-and-penalties","Parking Rules and Penalties"],
  ["/parking/parking-offences/pay-parking-fines","Pay Parking Fines"],
  ["/parking/parking-offences/report-a-parking-offence","Report a Parking Offence"],
  ["/parking/other-parking-matters","Other Parking Matters"],
  ["/parking/other-parking-matters/shortterm-parking","Short-Term Parking"],
  ["/parking/other-parking-matters/car-parks-for-business-activities","Car Parks for Business Activities"],
  ["/parking/other-parking-matters/temporary-parking-for-bereavement-matters","Temporary Parking for Bereavement Matters"],
  ["/homepage","Home"]
];

var extraRoutePairs = [
  ["/buying-a-flat/bto-sbf-and-open-booking-of-flats/process-for-buying-a-new-flat/application/priority-schemes","Priority Schemes"],
  ["/about-us/our-story","Our Story"],["/about-us/our-role","Our Role"],
  ["/about-us/our-towns-and-estates","Our Towns and Estates"],["/about-us/work-with-us","Work With Us"],
  ["/about-us/contact-us","Contact Us"],["/write-to-us","Write to Us"],
  ["/hdb-pulse/news","News"],["/hdb-pulse/reports","Reports"],["/hdb-pulse/publications","Publications"],
  ["/hdb-pulse/news/2026/flash-estimate-of-2nd-quarter-2026-resale-price-index-and-upcoming-flat-supply","Flash Estimate of 2nd Quarter 2026 Resale Price Index and Upcoming Flat Supply"],
  ["/hdb-pulse/news/2026/preparatory-works-for-long-island-project-to-commence-from-end-2026","Preparatory Works for ‘Long Island’ Project to Commence From End-2026"],
  ["/hdb-pulse/news/2026/hdb-launches-tender-for-sale-site-at-admiralty-walk","HDB Launches Tender for Sale Site at Admiralty Walk"],
  ["/hdb-pulse/news/2026/hdb-launches-6952-flats-across-7-projects-in-june-2026-bto-sales-exercise","HDB Launches 6,952 Flats Across 7 Projects in June 2026 BTO Sales Exercise"],
  ["/hdb-map","HDB Map"],["/hdb-ealerts","HDB e-Alerts"],
  ["/privacy-statement","Privacy Statement"],["/terms-of-use","Terms of Use"],
  ["/sitemap","Sitemap"],["/site-requirements","Site Requirements"],["/useful-links","Useful Links"]
];

var sitemapRoutePaths = [
  "/about-us",
  "/about-us/contact-us",
  "/about-us/our-role",
  "/about-us/our-role/build-quality-flats",
  "/about-us/our-role/create-smart-and-sustainable-homes",
  "/about-us/our-role/create-smart-and-sustainable-homes/biophilic-towns",
  "/about-us/our-role/create-smart-and-sustainable-homes/cool-ideas-enterprise",
  "/about-us/our-role/create-smart-and-sustainable-homes/green-innovations",
  "/about-us/our-role/create-smart-and-sustainable-homes/green-towns-programme",
  "/about-us/our-role/enable-home-ownership",
  "/about-us/our-role/foster-thriving-communities",
  "/about-us/our-role/plan-and-design-towns",
  "/about-us/our-role/plan-and-design-towns/planning-with-the-environment-in-mind",
  "/about-us/our-role/plan-and-design-towns/town-design-guides",
  "/about-us/our-role/plan-and-design-towns/universal-design",
  "/about-us/our-story",
  "/about-us/our-story/achievements",
  "/about-us/our-story/organisation-structure",
  "/about-us/our-story/our-history",
  "/about-us/our-story/our-livingspace-gallery",
  "/about-us/our-towns-and-estates",
  "/about-us/our-towns-and-estates/ang-mo-kio",
  "/about-us/our-towns-and-estates/bedok",
  "/about-us/our-towns-and-estates/bishan",
  "/about-us/our-towns-and-estates/bukit-batok",
  "/about-us/our-towns-and-estates/bukit-merah",
  "/about-us/our-towns-and-estates/bukit-panjang",
  "/about-us/our-towns-and-estates/bukit-timah",
  "/about-us/our-towns-and-estates/central-area",
  "/about-us/our-towns-and-estates/choa-chu-kang",
  "/about-us/our-towns-and-estates/clementi",
  "/about-us/our-towns-and-estates/geylang",
  "/about-us/our-towns-and-estates/hougang",
  "/about-us/our-towns-and-estates/jurong-east",
  "/about-us/our-towns-and-estates/jurong-west",
  "/about-us/our-towns-and-estates/kallang-whampoa",
  "/about-us/our-towns-and-estates/marine-parade",
  "/about-us/our-towns-and-estates/pasir-ris",
  "/about-us/our-towns-and-estates/punggol",
  "/about-us/our-towns-and-estates/queenstown",
  "/about-us/our-towns-and-estates/sembawang",
  "/about-us/our-towns-and-estates/sengkang",
  "/about-us/our-towns-and-estates/serangoon",
  "/about-us/our-towns-and-estates/tampines",
  "/about-us/our-towns-and-estates/tengah",
  "/about-us/our-towns-and-estates/toa-payoh",
  "/about-us/our-towns-and-estates/woodlands",
  "/about-us/our-towns-and-estates/yishun",
  "/about-us/work-with-us",
  "/about-us/work-with-us/careers",
  "/about-us/work-with-us/scholarships-and-internships",
  "/about-us/work-with-us/scholarships-and-internships/internships",
  "/about-us/work-with-us/scholarships-and-internships/scholarships",
  "/about-us/work-with-us/scholarships-and-internships/scholarships/frequently-asked-questions",
  "/about-us/work-with-us/scholarships-and-internships/scholarships/hdb-specialist-scholarships",
  "/about-us/work-with-us/scholarships-and-internships/scholarships/hdb-undergraduate-scholarships",
  "/business-partners",
  "/business-partners/building-professionals-bgbiz",
  "/business-partners/building-professionals-bgbiz/application-forms",
  "/business-partners/building-professionals-bgbiz/renovation-and-aa-works",
  "/business-partners/building-professionals-bgbiz/renovation-and-aa-works/documents-and-checklists",
  "/business-partners/building-professionals-bgbiz/renovation-and-aa-works/frequently-asked-questions",
  "/business-partners/building-professionals-bgbiz/renovation-and-aa-works/guidelines-for-commercial-property",
  "/business-partners/building-professionals-bgbiz/renovation-and-aa-works/guidelines-for-residential-property",
  "/business-partners/building-professionals-bgbiz/submitting-building-plans",
  "/business-partners/building-professionals-bgbiz/submitting-building-plans/documents-and-checklists",
  "/business-partners/building-professionals-bgbiz/submitting-building-plans/guidelines",
  "/business-partners/building-professionals-bgbiz/submitting-building-plans/submission-process",
  "/business-partners/building-professionals-bgbiz/submitting-building-plans/terms-and-conditions-for-structural-works",
  "/business-partners/building-professionals-bgbiz/updates-for-works-involving-hdb-property",
  "/business-partners/estate-agents-and-salespersons",
  "/business-partners/estate-agents-and-salespersons/guide-for-estate-agents-buying-a-flat",
  "/business-partners/estate-agents-and-salespersons/guide-for-estate-agents-buying-a-flat/eligibility",
  "/business-partners/estate-agents-and-salespersons/guide-for-estate-agents-buying-a-flat/financial-guide",
  "/business-partners/estate-agents-and-salespersons/guide-for-estate-agents-buying-a-flat/getting-started",
  "/business-partners/estate-agents-and-salespersons/guide-for-estate-agents-buying-a-flat/process",
  "/business-partners/estate-agents-and-salespersons/guide-for-estate-agents-renting-a-flat",
  "/business-partners/estate-agents-and-salespersons/guide-for-estate-agents-renting-a-flat/eligibility",
  "/business-partners/estate-agents-and-salespersons/guide-for-estate-agents-renting-a-flat/regulations",
  "/business-partners/estate-agents-and-salespersons/guide-for-estate-agents-renting-a-flat/related-matters",
  "/business-partners/estate-agents-and-salespersons/guide-for-estate-agents-renting-a-flat/rental-statistics",
  "/business-partners/estate-agents-and-salespersons/guide-for-estate-agents-renting-out-a-flat-or-bedrooms",
  "/business-partners/estate-agents-and-salespersons/guide-for-estate-agents-renting-out-a-flat-or-bedrooms/application-process",
  "/business-partners/estate-agents-and-salespersons/guide-for-estate-agents-renting-out-a-flat-or-bedrooms/eligibility",
  "/business-partners/estate-agents-and-salespersons/guide-for-estate-agents-renting-out-a-flat-or-bedrooms/regulations",
  "/business-partners/estate-agents-and-salespersons/guide-for-estate-agents-renting-out-a-flat-or-bedrooms/rental-statistics",
  "/business-partners/estate-agents-and-salespersons/guide-for-estate-agents-selling-a-flat",
  "/business-partners/estate-agents-and-salespersons/guide-for-estate-agents-selling-a-flat/eligibility",
  "/business-partners/estate-agents-and-salespersons/guide-for-estate-agents-selling-a-flat/financial-guide",
  "/business-partners/estate-agents-and-salespersons/guide-for-estate-agents-selling-a-flat/getting-started",
  "/business-partners/estate-agents-and-salespersons/guide-for-estate-agents-selling-a-flat/process",
  "/business-partners/estate-agents-and-salespersons/letters-to-keos",
  "/business-partners/estate-agents-and-salespersons/letters-to-keos/extension-of-temporary-relaxation-of-occupancy-cap-for-rental-of-hdb-flats",
  "/business-partners/estate-agents-and-salespersons/letters-to-keos/fulfilling-the-minimum-occupation-period-to-acquire-private-residential-property",
  "/business-partners/estate-agents-and-salespersons/letters-to-keos/implementation-of-hdb-flat-eligibility-hfe-letter",
  "/business-partners/estate-agents-and-salespersons/letters-to-keos/increased-cpf-housing-grant-for-resale-flat-buyers",
  "/business-partners/estate-agents-and-salespersons/letters-to-keos/launch-of-hdb-flat-portal",
  "/business-partners/estate-agents-and-salespersons/letters-to-keos/measures-to-cool-the-hdb-resale-market-and-provide-greater-support-for-first-time-home-buyers",
  "/business-partners/estate-agents-and-salespersons/letters-to-keos/measures-to-cool-the-property-market",
  "/business-partners/estate-agents-and-salespersons/letters-to-keos/measures-to-promote-sustainable-conditions-in-the-property-market",
  "/business-partners/estate-agents-and-salespersons/letters-to-keos/new-hdb-flat-eligibility-hfe-letter",
  "/business-partners/estate-agents-and-salespersons/letters-to-keos/official-launch-of-hdb-resale-flat-listing-service-on-30-may-2024",
  "/business-partners/estate-agents-and-salespersons/letters-to-keos/requests-to-amend-details-in-hdb-flat-eligibility-letters",
  "/business-partners/estate-agents-and-salespersons/letters-to-keos/resources-for-salespersons",
  "/business-partners/estate-agents-and-salespersons/letters-to-keos/salespersons-applications-for-hdb-flat-eligibility-letter",
  "/business-partners/estate-agents-and-salespersons/letters-to-keos/soft-launch-of-hdb-resale-flat-listing-service-on-13-may-2024",
  "/business-partners/estate-agents-and-salespersons/letters-to-keos/suspension-of-hfe-letter-application-e-service-during-the-application-period",
  "/business-partners/estate-agents-and-salespersons/letters-to-keos/temporary-relaxation-of-occupancy-cap-for-rental-of-hdb-flats-and-private-residential-properties",
  "/business-partners/estate-agents-and-salespersons/letters-to-keos/transition-to-non-toll-free-numbers-for-hdb-managed-hotlines",
  "/business-partners/estate-agents-and-salespersons/resources-for-estate-agents-and-salespersons",
  "/business-partners/land-developers-and-land-users",
  "/business-partners/land-developers-and-land-users/buying-land-land-sales",
  "/business-partners/land-developers-and-land-users/buying-land-land-sales/government-land-sales",
  "/business-partners/land-developers-and-land-users/buying-land-land-sales/government-land-sales/reserve-list",
  "/business-partners/land-developers-and-land-users/buying-land-land-sales/land-for-tender",
  "/business-partners/land-developers-and-land-users/buying-land-land-sales/land-for-tender/ancillary-development-sites",
  "/business-partners/land-developers-and-land-users/buying-land-land-sales/land-for-tender/commercial-development-sites",
  "/business-partners/land-developers-and-land-users/buying-land-land-sales/land-for-tender/mixed-commercial-and-residential-development-sites",
  "/business-partners/land-developers-and-land-users/buying-land-land-sales/land-for-tender/residential-development-sites",
  "/business-partners/land-developers-and-land-users/buying-land-land-sales/land-tender-results",
  "/business-partners/land-developers-and-land-users/buying-land-land-sales/process-for-reserve-list-system",
  "/business-partners/land-developers-and-land-users/buying-land-land-sales/process-for-reserve-list-system/frequently-asked-questions",
  "/business-partners/land-developers-and-land-users/buying-land-land-sales/sites-sold-by-hdb",
  "/business-partners/land-developers-and-land-users/renting-land-on-temporary-occupation-licence-tol",
  "/business-partners/renovation-contractors",
  "/business-partners/renovation-contractors/directory-of-renovation-contractors-drc",
  "/business-partners/renovation-contractors/directory-of-renovation-contractors-drc/application-process",
  "/business-partners/renovation-contractors/directory-of-renovation-contractors-drc/renewal-process",
  "/business-partners/renovation-contractors/important-information-on-renovation",
  "/business-partners/renovation-contractors/training-courses",
  "/business-partners/renovation-contractors/windows-installation-and-replacement",
  "/business-partners/tenderers",
  "/business-partners/tenderers/hdb-tender-opportunities",
  "/business-partners/tenderers/hdb-tender-opportunities/eligibility-to-participate-in-open-tenders",
  "/business-partners/tenderers/hdb-tender-opportunities/tender-clarifications",
  "/buying-a-flat",
  "/buying-a-flat/bto-sbf-and-open-booking-of-flats",
  "/buying-a-flat/bto-sbf-and-open-booking-of-flats/conditions-after-buying-a-new-flat",
  "/buying-a-flat/bto-sbf-and-open-booking-of-flats/finding-a-new-flat",
  "/buying-a-flat/bto-sbf-and-open-booking-of-flats/finding-a-new-flat/design-features",
  "/buying-a-flat/bto-sbf-and-open-booking-of-flats/finding-a-new-flat/standard-plus-and-prime-housing-framework",
  "/buying-a-flat/bto-sbf-and-open-booking-of-flats/finding-a-new-flat/types-of-flats",
  "/buying-a-flat/bto-sbf-and-open-booking-of-flats/finding-a-new-flat/types-of-flats/community-care-apartments",
  "/buying-a-flat/bto-sbf-and-open-booking-of-flats/finding-a-new-flat/types-of-flats/shortlease-2room-flexi-flat",
  "/buying-a-flat/bto-sbf-and-open-booking-of-flats/process-for-buying-a-new-flat",
  "/buying-a-flat/bto-sbf-and-open-booking-of-flats/process-for-buying-a-new-flat/application",
  "/buying-a-flat/bto-sbf-and-open-booking-of-flats/process-for-buying-a-new-flat/application/frequently-asked-questions-on-sales-exercises",
  "/buying-a-flat/bto-sbf-and-open-booking-of-flats/process-for-buying-a-new-flat/application/fresh-start-housing-scheme",
  "/buying-a-flat/bto-sbf-and-open-booking-of-flats/process-for-buying-a-new-flat/application/priority-schemes",
  "/buying-a-flat/bto-sbf-and-open-booking-of-flats/process-for-buying-a-new-flat/booking-of-flat",
  "/buying-a-flat/bto-sbf-and-open-booking-of-flats/process-for-buying-a-new-flat/key-collection",
  "/buying-a-flat/bto-sbf-and-open-booking-of-flats/process-for-buying-a-new-flat/modes-of-sales",
  "/buying-a-flat/bto-sbf-and-open-booking-of-flats/process-for-buying-a-new-flat/overview",
  "/buying-a-flat/bto-sbf-and-open-booking-of-flats/process-for-buying-a-new-flat/overview/plan-finances",
  "/buying-a-flat/bto-sbf-and-open-booking-of-flats/process-for-buying-a-new-flat/sign-agreement-for-lease",
  "/buying-a-flat/executive-condominiums",
  "/buying-a-flat/executive-condominiums/conditions-after-buying-an-ec",
  "/buying-a-flat/executive-condominiums/cpf-housing-grant",
  "/buying-a-flat/executive-condominiums/eligibility",
  "/buying-a-flat/executive-condominiums/finding-an-ec",
  "/buying-a-flat/executive-condominiums/process-for-buying-an-ec",
  "/buying-a-flat/financial-planning-for-a-flat-purchase",
  "/buying-a-flat/financial-planning-for-a-flat-purchase/ability-to-pay",
  "/buying-a-flat/financial-planning-for-a-flat-purchase/budget-for-a-flat",
  "/buying-a-flat/financial-planning-for-a-flat-purchase/credit-to-finance-a-flat-purchase",
  "/buying-a-flat/flat-grant-and-loan-eligibility",
  "/buying-a-flat/flat-grant-and-loan-eligibility/application-for-an-hdb-flat-eligibility-hfe-letter",
  "/buying-a-flat/flat-grant-and-loan-eligibility/application-for-an-hdb-flat-eligibility-hfe-letter/income-guidelines-and-documents",
  "/buying-a-flat/flat-grant-and-loan-eligibility/couples-and-families",
  "/buying-a-flat/flat-grant-and-loan-eligibility/couples-and-families/cpf-housing-grants",
  "/buying-a-flat/flat-grant-and-loan-eligibility/couples-and-families/enhanced-cpf-housing-grant",
  "/buying-a-flat/flat-grant-and-loan-eligibility/couples-and-families/proximity-housing-grant",
  "/buying-a-flat/flat-grant-and-loan-eligibility/couples-and-families/stepup-cpf-housing-grant",
  "/buying-a-flat/flat-grant-and-loan-eligibility/housing-loan",
  "/buying-a-flat/flat-grant-and-loan-eligibility/housing-loan/housing-loan-from-financial-institutions",
  "/buying-a-flat/flat-grant-and-loan-eligibility/housing-loan/housing-loan-from-hdb",
  "/buying-a-flat/flat-grant-and-loan-eligibility/seniors",
  "/buying-a-flat/flat-grant-and-loan-eligibility/singles",
  "/buying-a-flat/flat-grant-and-loan-eligibility/singles/cpf-housing-grant",
  "/buying-a-flat/flat-grant-and-loan-eligibility/singles/enhanced-cpf-housing-grant",
  "/buying-a-flat/flat-grant-and-loan-eligibility/singles/proximity-housing-grant",
  "/buying-a-flat/resale-flats",
  "/buying-a-flat/resale-flats/conditions-after-buying-a-resale-flat",
  "/buying-a-flat/resale-flats/finding-a-resale-flat",
  "/buying-a-flat/resale-flats/process-for-buying-a-resale-flat",
  "/buying-a-flat/resale-flats/process-for-buying-a-resale-flat/option-to-purchase",
  "/buying-a-flat/resale-flats/process-for-buying-a-resale-flat/option-to-purchase/request-for-value",
  "/buying-a-flat/resale-flats/process-for-buying-a-resale-flat/overview",
  "/buying-a-flat/resale-flats/process-for-buying-a-resale-flat/resale-flat-application",
  "/buying-a-flat/resale-flats/process-for-buying-a-resale-flat/resale-flat-application/application-process",
  "/buying-a-flat/resale-flats/process-for-buying-a-resale-flat/resale-flat-application/approval-of-application",
  "/buying-a-flat/resale-flats/process-for-buying-a-resale-flat/resale-flat-application/request-for-enhanced-contra-facility",
  "/buying-a-flat/resale-flats/process-for-buying-a-resale-flat/resale-flat-completion",
  "/buying-a-flat/resale-flats/process-for-buying-a-resale-flat/resale-flat-planning",
  "/buying-a-flat/resale-flats/process-for-buying-a-resale-flat/resale-flat-planning/eip-and-spr-quota",
  "/buying-a-flat/resale-flats/process-for-buying-a-resale-flat/resale-flat-planning/managing-the-flat-purchase",
  "/buying-a-flat/resale-flats/process-for-buying-a-resale-flat/resale-flat-planning/mode-of-financing",
  "/buying-a-flat/resale-flats/process-for-buying-a-resale-flat/resale-flat-planning/overview",
  "/buying-a-flat/resale-flats/process-for-buying-a-resale-flat/resale-flat-planning/resale-seminars",
  "/hdb-pulse",
  "/hdb-pulse/mynicehome",
  "/hdb-pulse/news",
  "/hdb-pulse/news/2021/2nd-urban-farming",
  "/hdb-pulse/news/2021/award-of-tender-for-the-rental-of-7-hdb-mscp-rooftop-sites-for-urban-farming",
  "/hdb-pulse/news/2021/cpf-interest-rates-from-1-january-2022-to-31-march-2022",
  "/hdb-pulse/news/2021/development-plans-for-ulu-pandan-balance-nature-conservation-and-housing-needs",
  "/hdb-pulse/news/2021/digital-kiosks-to-help-heartland-enterprises-reach-customers-24-7",
  "/hdb-pulse/news/2021/eks-upgrade",
  "/hdb-pulse/news/2021/ensuring-public-housing-remains-affordable-inclusive-and-liveable",
  "/hdb-pulse/news/2021/final-tender-results-for-land-parcel-at-tampines-street-62-parcel-a",
  "/hdb-pulse/news/2021/final-tender-results-for-land-parcel-at-tengah-garden-walk",
  "/hdb-pulse/news/2021/flash-estimate-of-1st-quarter-2021-resale-price-index",
  "/hdb-pulse/news/2021/flash-estimate-of-2nd-quarter-2021-resale-price-index",
  "/hdb-pulse/news/2021/flash-estimate-of-3rd-quarter-2021-resale-price-index",
  "/hdb-pulse/news/2021/flash-estimate-of-4th-quarter-2020-resale-price-index",
  "/hdb-pulse/news/2021/government-to-redevelop-site-in-alexandra-for-future-public-housing",
  "/hdb-pulse/news/2021/greatearth-corporation-pte-ltd-and-greatearth-construction-pte-ltd-unable-to-continue-with-projects",
  "/hdb-pulse/news/2021/greater-supply-of-pphs-flats-available-for-families-in-need",
  "/hdb-pulse/news/2021/hdb-and-astar-ink-collaborations",
  "/hdb-pulse/news/2021/hdb-awards-2021-16-projects-recognised-for-excellence-in-design-construction-and-engineering",
  "/hdb-pulse/news/2021/hdb-issues-rated-fixed-rate-notes",
  "/hdb-pulse/news/2021/hdb-issues-rated-fixed-rate-notes-apr19",
  "/hdb-pulse/news/2021/hdb-issues-rated-fixed-rate-notes-mar16",
  "/hdb-pulse/news/2021/hdb-issues-rated-fixed-rate-notes-nov-21",
  "/hdb-pulse/news/2021/hdb-issues-rated-fixed-rate-notes-oct12",
  "/hdb-pulse/news/2021/hdb-jtc-and-mpa-which-issue-over-two-thirds-of-government-invoices",
  "/hdb-pulse/news/2021/hdb-launches-3740-flats-in-february-2021-bto-exercise",
  "/hdb-pulse/news/2021/hdb-launches-4989-flats-in-august-2021-bto-exercise",
  "/hdb-pulse/news/2021/hdb-launches-6299-flats-in-november-2021-bto-and-sbf-exercises",
  "/hdb-pulse/news/2021/hdb-launches-6373-flats-in-may-2021-bto-and-sbf-exercises",
  "/hdb-pulse/news/2021/hdb-launches-residential-site-at-bukit-batok-west-avenue-8",
  "/hdb-pulse/news/2021/hdb-launches-sixth-solarnova-tender-with-smart-electrical-sub-meters-to-optimise-energy-use",
  "/hdb-pulse/news/2021/hdb-to-inject-1-point-5-million-to-support-more-ground-up-projects",
  "/hdb-pulse/news/2021/hdb-to-ramp-up-flat-supply-by-35-percent-over-next-two-years",
  "/hdb-pulse/news/2021/hdb-unveils-plans-for-a-new-public-housing-estate-at-site-of-former-police-academy",
  "/hdb-pulse/news/2021/joint-cpfb-hdb-extension-of-minimum-4-interest-rate",
  "/hdb-pulse/news/2021/joint-hdb-tc-cool-paint-pilot-project",
  "/hdb-pulse/news/2021/joint-htx-ground-robot-on-trial-at-tpy",
  "/hdb-pulse/news/2021/joint-press-release-by-cpf-and-hdb---cpf-interest-rates-from-1-april-2021-to-30-june-2021",
  "/hdb-pulse/news/2021/joint-press-release-by-cpf-and-hdb-cpf-interest-rates-from-1-july-2021-to-30-september-2021",
  "/hdb-pulse/news/2021/joint-release-by-bca-hdb-homeowners-can-help-create-a-safer-living-environment",
  "/hdb-pulse/news/2021/jtender-closing-for-7-hdb-mscp-rooftop-sites-for-urban-farming",
  "/hdb-pulse/news/2021/kampung-admiralty-and-punggol-town-win-global-awards-for-excellence-in-land-use",
  "/hdb-pulse/news/2021/new-appointment-to-the-hdb-board",
  "/hdb-pulse/news/2021/new-contractors-appointed-for-five-bto-projects",
  "/hdb-pulse/news/2021/over-16000-flats-delivered-since-jan-2020",
  "/hdb-pulse/news/2021/part-of-tampines-avenue-12-to-be-realigned-to-enhance-connectivity-for-tampines-north-residents",
  "/hdb-pulse/news/2021/pilot-health-district-in-queenstown-to-focus-on-residents-holistic-well-being",
  "/hdb-pulse/news/2021/provisional-tender-results-for-ec-site-at-tengah-garden-walk-tengah-e1",
  "/hdb-pulse/news/2021/provisional-tender-results-for-land-parcel-at-tampines-street-62",
  "/hdb-pulse/news/2021/release-of-1st-quarter-2021-public-housing-data",
  "/hdb-pulse/news/2021/release-of-2nd-quarter-2021-public-housing-data",
  "/hdb-pulse/news/2021/release-of-3rd-quarter-2021-public-housing-data",
  "/hdb-pulse/news/2021/release-of-4th-quarter-2020-public-housingdata",
  "/hdb-pulse/news/2021/temporary-road-closure-along-pasir-ris-drive-8",
  "/hdb-pulse/news/2021/temporary-road-closure-along-tampines-avenue-9-for-construction-of-new-pedestrian",
  "/hdb-pulse/news/2021/temporary-road-closure-along-tampines-street-61-for-construction-of-new-pedestrian-overhead-bridge",
  "/hdb-pulse/news/2021/the-prime-location-public-housing-model",
  "/hdb-pulse/news/2021/ura-and-hdb-release-sale-sites-at-jalan-tembusu-and-tampines-street-62-parcel-b",
  "/hdb-pulse/news/2021/ura-and-hdb-release-sale-sites-at-lentor-central-and-tampines-street-62-parcel-a",
  "/hdb-pulse/news/2022/15-minute-grace-period-for-short-term-parking-in-car-parks-with-electronic-parking-system",
  "/hdb-pulse/news/2022/almost-10000-bto-flats-across-10-projects-offered-in-november-2022-bto-exercise",
  "/hdb-pulse/news/2022/community-week-2022",
  "/hdb-pulse/news/2022/farrer-park-site-redeveloped",
  "/hdb-pulse/news/2022/final-tender-results-bukit-batok-west-ave-5",
  "/hdb-pulse/news/2022/final-tender-results-for-land-parcel-at-bukit-batok-west-avenue-8",
  "/hdb-pulse/news/2022/first-of-three-ulu-pandan-housing-projects-to-launch-next-month",
  "/hdb-pulse/news/2022/flash-estimate-of-1st-quarter-2022-resale-price-index",
  "/hdb-pulse/news/2022/flash-estimate-of-2nd-quarter-2022-resale-price-index",
  "/hdb-pulse/news/2022/flash-estimate-of-3rd-quarter-2022-resale-price-index",
  "/hdb-pulse/news/2022/four-public-housing-estates-zoned-as-car-lite-areas",
  "/hdb-pulse/news/2022/greener-more-sustainable-homes",
  "/hdb-pulse/news/2022/hdb-annual-report-fy2021",
  "/hdb-pulse/news/2022/hdb-awards-2022-oct22",
  "/hdb-pulse/news/2022/hdb-issues-rated-fixed-rate-green-notes-jul22",
  "/hdb-pulse/news/2022/hdb-issues-rated-fixed-rate-green-notes-oct22",
  "/hdb-pulse/news/2022/hdb-Issues-rated-fixed-rate-notes-dec22",
  "/hdb-pulse/news/2022/hdb-issues-rated-fixed-rate-notes-jan22",
  "/hdb-pulse/news/2022/hdb-issues-rated-fixed-rate-notes-jun22",
  "/hdb-pulse/news/2022/hdb-issues-rated-fixed-rate-notes-sep22",
  "/hdb-pulse/news/2022/hdb-launches-3953-flats-feb-2022-bto-exercise",
  "/hdb-pulse/news/2022/hdb-launches-4993-flats-in-august-2022-bto-exercise",
  "/hdb-pulse/news/2022/hdb-launches-6535-flats-in-may-2022-bto-and-sbf-exercises",
  "/hdb-pulse/news/2022/hdb-launches-residential-site-at-bukit-batok-west-avenue-5",
  "/hdb-pulse/news/2022/hdb-launches-tender-for-sale-sites-at-tampines-avenue-11-and-plantation-close",
  "/hdb-pulse/news/2022/hdb-offers-two-additional-rehousing-options-for-flat-owners-under-ser",
  "/hdb-pulse/news/2022/hdb-pilots-advanced-construction-technologies-to-design",
  "/hdb-pulse/news/2022/hdb-punggol-queenstown-branches-relocation",
  "/hdb-pulse/news/2022/hdb-raises-s1-billion-through-inaugural-green-bond-issuance",
  "/hdb-pulse/news/2022/hdb-to-bring-solar-energy",
  "/hdb-pulse/news/2022/joint-news-release-cpf-interest-rates-from-1-july-2022-to-30-september-2022",
  "/hdb-pulse/news/2022/joint-press-release-by-cpf-board-and-hdb-cpf-interest-rates-feb11",
  "/hdb-pulse/news/2022/joint-press-release-by-cpf-board-and-hdb-cpf-interest-rates-nov29",
  "/hdb-pulse/news/2022/joint-press-release-by-cpf-board-and-hdb-cpf-interest-rates-sept22",
  "/hdb-pulse/news/2022/joint-ura-and-hdb-release-sale-sites",
  "/hdb-pulse/news/2022/more-bto-flats-set-aside-for-first-timers",
  "/hdb-pulse/news/2022/more-support-for-flat-owners-constrained-by-the-ethnic-inegration-policy",
  "/hdb-pulse/news/2022/new-appointments-to-the-hdb-board",
  "/hdb-pulse/news/2022/new-sang-nila-utama-road-in-bidadari-estate-partially-opens-to-traffic",
  "/hdb-pulse/news/2022/over-600-households-in-ang-mo-kio-to-move-to-new-flats-under-selective-en-bloc",
  "/hdb-pulse/news/2022/press-release",
  "/hdb-pulse/news/2022/property-measures2022",
  "/hdb-pulse/news/2022/provisional-tender-results-for-land-parcel-at-bukit-batok-west-ave-5",
  "/hdb-pulse/news/2022/provisional-tender-results-for-land-parcel-at-bukit-batok-west-ave-8-for-executive",
  "/hdb-pulse/news/2022/redevelopment-and-extension-of-wcp",
  "/hdb-pulse/news/2022/release-of-1st-quarter-2022-public-housing-data",
  "/hdb-pulse/news/2022/release-of-2ndquarter-2022-public-housing-data",
  "/hdb-pulse/news/2022/release-of-4th-quarter-2021-public-housing-data",
  "/hdb-pulse/news/2022/reopening-of-camping-sites-and-barbecue-pits",
  "/hdb-pulse/news/2022/supporting-heartland-shops-to-enhance-their-vibrancy-and-competitiveness",
  "/hdb-pulse/news/2022/supporting-the-housing-needs-of-low-income-families-enhancements-to-fresh-start-housing",
  "/hdb-pulse/news/2022/supporting-the-housing-needs-of-seniors-second-community-care-apartments",
  "/hdb-pulse/news/2022/temporary-road-closure-along-bidadari-park-drive-for-construction-of-land-bridge",
  "/hdb-pulse/news/2022/temporary-road-closure-along-bidadari-park-drive-for-construction-of-new-land-bridge",
  "/hdb-pulse/news/2022/temporary-road-closure-along-bukit-batok-west-ave-6-for-construction-of-new-overhead-bridge",
  "/hdb-pulse/news/2022/temporary-road-closure-along-bukit-batok-west-avenue-6-and-tampines-avenue-12",
  "/hdb-pulse/news/2022/temporary-road-closure-along-bukit-batok-west-avenue-6-nov22",
  "/hdb-pulse/news/2022/temporary-road-closure-along-punggol-central",
  "/hdb-pulse/news/2022/temporary-road-closure-along-tampines-avenue-6-for-construction-of-new-pedestrian-overhead-bridge",
  "/hdb-pulse/news/2022/temporary-road-closures-along-bidadari-park-drive-for-construction-of-new-land-bridge",
  "/hdb-pulse/news/2022/temporary-road-closure-tampines-ave-1",
  "/hdb-pulse/news/2022/upcoming-flat-supply-and-3rd-quarter-2022-public-housing-data",
  "/hdb-pulse/news/2023/26-projects-recognised-for-excellence-in-design-construction-and-engineering-at-hdb-awards-2023",
  "/hdb-pulse/news/2023/appointment-of-new-chairperson-for-the-housing-and-development-board",
  "/hdb-pulse/news/2023/choa-chu-kang-to-be-rejuvenated-with-new-mixed-use-developments",
  "/hdb-pulse/news/2023/city-living-close-to-nature",
  "/hdb-pulse/news/2023/cpf-interest-rates-from-1-jan-2024",
  "/hdb-pulse/news/2023/cpf-interest-rates-from-1-july-2023-to-30-september-2023",
  "/hdb-pulse/news/2023/cpf-interest-rates-from-1-october-2023-to-31-december-2023",
  "/hdb-pulse/news/2023/enhancing-the-vibrancy-of-hdb-heartlands",
  "/hdb-pulse/news/2023/final-tender-results-for-land-parcel-at-plantation-close",
  "/hdb-pulse/news/2023/final-tender-results-for-land-parcel-at-tampines-avenue-11-for-mixed-use-development",
  "/hdb-pulse/news/2023/ftr-tampines-st62",
  "/hdb-pulse/news/2023/further-support-for-first-time-homebuyers",
  "/hdb-pulse/news/2023/hdb-community-day-2023-234-nominations-received-for-inaugural-singapore-friendly",
  "/hdb-pulse/news/2023/hdb-extends-validity-period-of-hdb-flat-eligibility-hfe-letter-from-6-to-9-months",
  "/hdb-pulse/news/2023/hdb-flat-eligibility-letter",
  "/hdb-pulse/news/2023/hdb-issues-rated-fixed-rate-green-notes-nov23",
  "/hdb-pulse/news/2023/hdb-launches-4428-flats-in-february-2023-bto-exercise",
  "/hdb-pulse/news/2023/hdb-launches-6800-flats-in-october-2023-bto-exercise",
  "/hdb-pulse/news/2023/hdb-launches-largest-solar-leasing-tender-under-solarnova-programme",
  "/hdb-pulse/news/2023/hdb-launches-more-than-6000-flats-in-december-2023-bto-exercise",
  "/hdb-pulse/news/2023/hdb-launches-nearly-7000-flats-in-may-2023-bto-and-sbf-exercises",
  "/hdb-pulse/news/2023/hdb-launches-sale-sites-at-plantation-close-and-tampines-street-95",
  "/hdb-pulse/news/2023/hdb-launches-sample-household-survey-2023-24",
  "/hdb-pulse/news/2023/hdb-spent-more-on-public-housing-in-fy-2022",
  "/hdb-pulse/news/2023/hdb-unveils-masterplan-for-bayshore-estate",
  "/hdb-pulse/news/2023/joint-press-release-by-cpf-board-and-hdb-cpf-interest-rates-feb23",
  "/hdb-pulse/news/2023/keeping-public-housing-accessible-for-singaporeans",
  "/hdb-pulse/news/2023/new-hdb-flat-eligibility-letter",
  "/hdb-pulse/news/2023/new-plus-housing-model-with-more-subsidies",
  "/hdb-pulse/news/2023/new-portal-to-help-residents-find-budget-meals-in-the-heartlands",
  "/hdb-pulse/news/2023/particulars-of-tenders-submitted-for-ec-hdb-site-at-tamp-st-62-parcel-b",
  "/hdb-pulse/news/2023/provisional-tender-results-for-mixed-use-development-site-at-tampines-avenue-11-and",
  "/hdb-pulse/news/2023/queenstown-roh",
  "/hdb-pulse/news/2023/redeveloped-tanglin-halt-estate-to-have-new-hawker-centre-and-market-and-polyclinic",
  "/hdb-pulse/news/2023/residual-current-circuit-breakers-required",
  "/hdb-pulse/news/2023/sla-to-take-over-and-consolidate-state-land-management-within-hdb-estates-from-1-march-2023",
  "/hdb-pulse/news/2023/temporarily-relaxed-rental-occupany-cap",
  "/hdb-pulse/news/2023/temporary-road-closure-along-bukit-batok-road-for-construction-of-new-pedestrian-overhead-bridge",
  "/hdb-pulse/news/2023/temporary-road-closure-along-tampines-avenue-10",
  "/hdb-pulse/news/2023/temporary-road-closure-along-woodleigh-link-for-construction-of-new-overhead-bridge",
  "/hdb-pulse/news/2023/upcoming-flat-supply-and-1st-quarter-2023-public-housing-data",
  "/hdb-pulse/news/2023/upcoming-flat-supply-and-2nd-quarter-2023-public-housing-data",
  "/hdb-pulse/news/2023/upcoming-flat-supply-and-3q2023-public-housing-data",
  "/hdb-pulse/news/2023/upcoming-flat-supply-and-4th-quarter-2022-public-housing-data",
  "/hdb-pulse/news/2023/upcoming-flat-supply-and-flash-estimate-of-1st-quarter-2023-resale-price-index-apr23",
  "/hdb-pulse/news/2023/upcoming-flat-supply-and-flash-estimate-of-2nd-quarter-2023-resale-price-index",
  "/hdb-pulse/news/2023/upcoming-flat-supply-and-flash-estimate-of-3rd-quarter-2023-resale-price-index",
  "/hdb-pulse/news/2023/upcoming-flat-supply-and-flash-estimate-of-4th-quarter-2022-resale-price-index",
  "/hdb-pulse/news/2023/upgraded-town-centre-and-new-garden-loop-linking-green-spaces-in-rejuvenated-ang-mo-kio",
  "/hdb-pulse/news/2023/ura-and-hdb-release-sale-sites-at-jalan-tembusu-and-tampines-street-62",
  "/hdb-pulse/news/2024/19600-bto-flats-to-be-launched-in-2024-across-three-sales-exercises",
  "/hdb-pulse/news/2024/bidadari-estate-wins-world-gold-at-the-2024-fiabci-world-prix-dexcellence-awards",
  "/hdb-pulse/news/2024/changes-to-the-board-members-of-the-hdb",
  "/hdb-pulse/news/2024/cpf-interest-rates-from-1-jan-to-31-mar-2025",
  "/hdb-pulse/news/2024/final-tender-result-for-land-parcel-at-jalan-loyang-besar-for-ec-housing-development",
  "/hdb-pulse/news/2024/final-tender-result-for-land-parcel-at-tampines-street-94",
  "/hdb-pulse/news/2024/final-tender-result-for-land-parcel-at-tampines-street-95",
  "/hdb-pulse/news/2024/final-tender-results-for-land-parcel-at-plantation-close-for-ec-housing-development",
  "/hdb-pulse/news/2024/four-tengah-bto-projects-awarded-top-tier-active-beautiful-clean-waters-certification",
  "/hdb-pulse/news/2024/govt-extends-4-per-cent-interest-rate-floor",
  "/hdb-pulse/news/2024/greater-support-for-young-couples",
  "/hdb-pulse/news/2024/hdb-awards-2024",
  "/hdb-pulse/news/2024/HDB-awards-20-year-Centralised-Cooling-Systems-contract-to-Keppel",
  "/hdb-pulse/news/2024/hdb-awards-largest-solar-leasing-tender",
  "/hdb-pulse/news/2024/hdb-incurred-higher-expenditure-in-fy-2023-to-keep-public-housing-affordable",
  "/hdb-pulse/news/2024/hdb-issues-rated-fixed-rate-green-notes-apr24",
  "/hdb-pulse/news/2024/hdb-issues-rated-fixed-rate-green-notes-jan24",
  "/hdb-pulse/news/2024/hdb-issues-rated-fixed-rate-green-notes-jul24",
  "/hdb-pulse/news/2024/hdb-issues-rated-fixed-rate-green-notes-oct24",
  "/hdb-pulse/news/2024/hdb-issues-rated-fixed-rate-notes-mar24",
  "/hdb-pulse/news/2024/hdb-issues-rated-fixed-rate-notes-may24",
  "/hdb-pulse/news/2024/hdb-issues-rated-fixed-rate-notes-nov24",
  "/hdb-pulse/news/2024/hdb-issues-rated-fixed-rate-notes-oct24",
  "/hdb-pulse/news/2024/hdb-launches-5714-flats-in-feb-2024-bto-and-sbf-exercises",
  "/hdb-pulse/news/2024/hdb-launches-6938-flats-in-june-2024-bto-exercise",
  "/hdb-pulse/news/2024/hdb-launches-placemaking-challenge-to-revitalise-bukit-merah-town-centre",
  "/hdb-pulse/news/2024/hdb-launches-sale-site-at-chencharu-close",
  "/hdb-pulse/news/2024/hdb-launches-sale-site-at-tampines-street-94",
  "/hdb-pulse/news/2024/hdb-launches-sales-site-at-tampines-street-95",
  "/hdb-pulse/news/2024/hdb-launches-tender-for-ec-site-at-jalan-loyang-besar",
  "/hdb-pulse/news/2024/hdb-to-refund-goods-and-services-tax-on-administrative-fees",
  "/hdb-pulse/news/2024/hdb-to-scale-up-the-use-of-robotics-and-automation-at-construction-sites",
  "/hdb-pulse/news/2024/hdb-unveils-development-plans-for-sembawang-north-and-woodlands-north-coast",
  "/hdb-pulse/news/2024/hdb-unveils-masterplan-for-chencharu",
  "/hdb-pulse/news/2024/hdb-unveils-winning-design-of-inaugural-town-centre-placemaking-challenge-in-bukit-merah",
  "/hdb-pulse/news/2024/making-our-homes-and-neighbourhoods-safer-for-seniors",
  "/hdb-pulse/news/2024/measures-to-cool-the-hdb-resale-market-and-provide-more-support-for-first-time-home-buyers",
  "/hdb-pulse/news/2024/more-coffee-shops-to-offer-budget-meals-to-boost-affordable-food-options",
  "/hdb-pulse/news/2024/new-family-care-scheme-to-support-parents-and-children-to-live-closer-together",
  "/hdb-pulse/news/2024/new-flat-classification-framework",
  "/hdb-pulse/news/2024/new-resale-flat-listing-service",
  "/hdb-pulse/news/2024/oct-bto-launch",
  "/hdb-pulse/news/2024/official-launch-of-resale-flat-listing-service-on-hdb-flat-portal",
  "/hdb-pulse/news/2024/opening-of-bidadari-park-and-alkaff-lake",
  "/hdb-pulse/news/2024/over-53k-more-homes-to-be-upgraded-under-hdbs-hip",
  "/hdb-pulse/news/2024/pet-cat-licensing-scheme-to-start-on-1-sept-24",
  "/hdb-pulse/news/2024/pphs-doubled-by-2025",
  "/hdb-pulse/news/2024/pphs-open-market-voucher-scheme",
  "/hdb-pulse/news/2024/provisional-tender-results-for-land-parcel",
  "/hdb-pulse/news/2024/provisional-tender-results-for-land-parcel-at-plantation-close-for-ec-housing-development",
  "/hdb-pulse/news/2024/provisional-tender-results-for-land-parcel-at-tampines-street-95",
  "/hdb-pulse/news/2024/provisional-tender-results-for-tampines-street-94",
  "/hdb-pulse/news/2024/public-invited-to-submit-recommendations-of-budget-meals-at-hdb-coffee-shops-islandwide",
  "/hdb-pulse/news/2024/silver-upgrading-programme-to-be-rolled-out-in-26-precincts-to-support-ageing-in-place",
  "/hdb-pulse/news/2024/temporary-road-closure-along-hougang-ave-3-btw-defu-ave-1",
  "/hdb-pulse/news/2024/temporary-road-closure-along-new-punggol-road",
  "/hdb-pulse/news/2024/temporary-road-closure-along-tampines-avenue-10-for-construction-of-new-pedestrian-overhead-bridge",
  "/hdb-pulse/news/2024/temporary-road-closures-at-changi-road-and-geylang-serai-road",
  "/hdb-pulse/news/2024/upcoming-flat-supply-1st-quarter-2024-public-housing-data",
  "/hdb-pulse/news/2024/upcoming-flat-supply-and-2nd-quarter-2024-public-housing-data",
  "/hdb-pulse/news/2024/upcoming-flat-supply-and-4th-quarter-2023-public-housing-data",
  "/hdb-pulse/news/2024/upcoming-flat-supply-and-flash-estimate-of-1st-quarter-2024-resale-price-index",
  "/hdb-pulse/news/2024/upcoming-flat-supply-and-flash-estimate-of-2nd-quarter-2024-resale-price-index",
  "/hdb-pulse/news/2024/upcoming-flat-supply-and-flash-estimate-of-3rd-quarter-2024-rpi",
  "/hdb-pulse/news/2024/upcoming-flat-supply-and-flash-estimate-of-4th-quarter-2023-resale-price-index",
  "/hdb-pulse/news/2024/upcoming-sbf-exercise-in-february-2025-and-3rd-quarter-2024-public-housing-data",
  "/hdb-pulse/news/2024/upgrading-projects-in-hdb-ncs-benefiting-more-than-15600-households",
  "/hdb-pulse/news/2024/ura-hdb-release-four-sale-sites",
  "/hdb-pulse/news/2025/25000-new-flats-will-be-launched-in-2025",
  "/hdb-pulse/news/2025/2nd-quarter-2025-public-housing-data-and-upcoming-flat-supply",
  "/hdb-pulse/news/2025/3rd-quarter-2025-public-housing-data-and-upcoming-flat-supply",
  "/hdb-pulse/news/2025/about-3300-flats-with-swt-to-be-offered-in-the-oct-2025-bto-exercise",
  "/hdb-pulse/news/2025/all-buyers-of-last-two-pandemic-delayed-bto-projects-have-been-scheduled-to-collect-their-keys",
  "/hdb-pulse/news/2025/cpf-interest-rates-from-1-april-to-30-june-2025",
  "/hdb-pulse/news/2025/cpf-interest-rates-from-1-january-to-31-march-2026-and-basic-healthcare-sum-for-2026",
  "/hdb-pulse/news/2025/cpf-interest-rates-from-1-jul-to-30-sep-2025",
  "/hdb-pulse/news/2025/enhancements-to-silver-housing-bonus-to-boost-retirement-income-for-seniors-right-sizing-their-homes",
  "/hdb-pulse/news/2025/final-tender-results-chencharu-close-sembawang-road",
  "/hdb-pulse/news/2025/final-tender-results-for-the-two-ec-housing-development-sites-at-senja-close-and-woodlands-drive-17",
  "/hdb-pulse/news/2025/final-two-pandemic-delayed-housing-projects-completed-in-january-2025",
  "/hdb-pulse/news/2025/first-gp-clinic-tender-awarded-under-price-quality-method",
  "/hdb-pulse/news/2025/flash-estimate-of-2nd-quarter-2025-resale-price-index-and-upcoming-flat-supply",
  "/hdb-pulse/news/2025/flash-estimate-of-3rd-quarter-2025-resale-price-index-and-upcoming-flat-supply",
  "/hdb-pulse/news/2025/government-extends-4percent-interest-rate",
  "/hdb-pulse/news/2025/hdb-community-day-2025-tengah-volunteers-lead-the-way-in-building-stronger-communities",
  "/hdb-pulse/news/2025/hdb-issues-rated-fixed-rate-green-notes-jan25",
  "/hdb-pulse/news/2025/hdb-issues-rated-fixed-rate-green-notes-jul25",
  "/hdb-pulse/news/2025/hdb-issues-rated-fixed-rate-green-notes-oct25",
  "/hdb-pulse/news/2025/hdb-issues-rated-fixed-rate-notes-feb25",
  "/hdb-pulse/news/2025/hdb-issues-rated-fixed-rate-notes-jul25",
  "/hdb-pulse/news/2025/hdb-issues-rated-fixed-rate-notes-nov25",
  "/hdb-pulse/news/2025/hdb-issues-rated-fixed-rate-notes-sep25",
  "/hdb-pulse/news/2025/hdb-launches-10209-flats-in-the-july-2025-bto-and-sbf-sales-exercises",
  "/hdb-pulse/news/2025/hdb-launches-10622-flats-in-february-2025-bto-and-sbf-exercises",
  "/hdb-pulse/news/2025/hdb-launches-sale-site-at-senja-close",
  "/hdb-pulse/news/2025/HDB-launches-tender-for-sale-site-at-miltonia-close",
  "/hdb-pulse/news/2025/hdb-launches-tender-for-sale-site-at-woodlands-drive-17",
  "/hdb-pulse/news/2025/hdb-launches-tender-for-sale-sites-at-sembawang-road-and-hougang-avenue-10-hougang-central",
  "/hdb-pulse/news/2025/hdb-spent-over-$6-billion-in-fy-2024-to-keep-public-housing-affordable-and-liveable",
  "/hdb-pulse/news/2025/hdb-to-extend-cool-coatings-initiative-to-all-existing-hdb-estates",
  "/hdb-pulse/news/2025/hdb-to-extend-parenthood-provisional-housing-scheme-pphs-voucher-till-31-december-2025",
  "/hdb-pulse/news/2025/hdb-to-launch-first-bto-project-in-sembawang-north-in-the-july-sales-exercise",
  "/hdb-pulse/news/2025/hdb-unveils-masterplan-for-berlayar-estate",
  "/hdb-pulse/news/2025/hdb-unveils-masterplan-for-mount-pleasant",
  "/hdb-pulse/news/2025/new-fcs-proximity-better-supports-parents-and-children-to-live-closer-together",
  "/hdb-pulse/news/2025/new-hdb-playgrounds-to-enhance-childrens-play-experiences-and-support-holistic-development",
  "/hdb-pulse/news/2025/new-river-crab-playground-designed-and-built-by-2000-residents-makes-a-splash-in-toa-payoh",
  "/hdb-pulse/news/2025/new-sport-in-precinct-facility-in-kolam-ayer",
  "/hdb-pulse/news/2025/october-2025-bto-sales-exercise",
  "/hdb-pulse/news/2025/over-29000-more-homes-to-be-upgraded-under-hdbs-home-improvement-programme-hip",
  "/hdb-pulse/news/2025/over-36000-hdb-households-to-benefit-from-upgrading-projects",
  "/hdb-pulse/news/2025/price-quality-method-tender-pilot-for-private-general-practitioner-clinic-at-bartley-beacon",
  "/hdb-pulse/news/2025/providing-more-support-for-home-buyers-and-public-rental-families",
  "/hdb-pulse/news/2025/provisional-tender-results-chencharu-close-and-sembawang-road",
  "/hdb-pulse/news/2025/provisional-tender-results-for-ec-at-senja-close-and-woodlands-drive-17",
  "/hdb-pulse/news/2025/provisional-tender-results-for-land-parcel-at-hougang-avenue-10-hougang-central",
  "/hdb-pulse/news/2025/sample-household-survey-2023-24",
  "/hdb-pulse/news/2025/singapores-first-polder-at-pulau-tekong-adds-800-hectares-of-land",
  "/hdb-pulse/news/2025/supermarket-food-court-and-wellness-trail-to-open-at-tengahs-newest-neighbourhood-centre-in-1q-2026",
  "/hdb-pulse/news/2025/temporary-road-closure-along-dunman-road-for-demolition-of-pedestrian-overhead-bridge",
  "/hdb-pulse/news/2025/temporary-road-closure-along-west-coast-highway-for-construction-of-new-pedestrian-overhead-bridge",
  "/hdb-pulse/news/2025/upcoming-flat-supply-and-1st-quarter-2025-public-housing-data",
  "/hdb-pulse/news/2025/upcoming-flat-supply-and-4th-quarter-2024-public-housing-data",
  "/hdb-pulse/news/2025/upcoming-flat-supply-and-flash-estimate-of-1st-quarter-2025-resale-price-index",
  "/hdb-pulse/news/2025/upcoming-flat-supply-and-flash-estimate-of-4th-quarter-2024-resale-price-index",
  "/hdb-pulse/news/2025/ura-hdb-release-3-residential-sites-lakeside-drive-dunearn-road-woodlands-dr-17",
  "/hdb-pulse/news/2025/whampoa-park-bags-hdbs-inaugural-landscape-award",
  "/hdb-pulse/news/2026/18000-more-homes-to-be-upgraded-under-hdb-home-improvement-programme",
  "/hdb-pulse/news/2026/1q2026-flash-rpi",
  "/hdb-pulse/news/2026/1q2026-rpi",
  "/hdb-pulse/news/2026/4th-quarter-2025-public-housing-data-and-upcoming-flat-supply",
  "/hdb-pulse/news/2026/about-1300-swt-flats-to-be-offered-in-feb-2026",
  "/hdb-pulse/news/2026/close-to-29000-hdb-households-to-benefit-from-upgrading-projects-to-enhance-their-neighbourhoods",
  "/hdb-pulse/news/2026/cpf-interest-rates-from-1-april-to-30-june-2026",
  "/hdb-pulse/news/2026/cpf-interest-rates-from-1-july-to-30-september-2026",
  "/hdb-pulse/news/2026/enhanced-support-for-hdb-coffee-shops",
  "/hdb-pulse/news/2026/extension-of-temporary-relaxation-of-occupancy-cap-for-rental-of-hdb-flats-and-private-residential",
  "/hdb-pulse/news/2026/final-four-projects-in-bidadari-completed",
  "/hdb-pulse/news/2026/final-tender-result-for-ec-woodlands-dr-17",
  "/hdb-pulse/news/2026/final-tender-result-for-land-parcel-at-miltonia-close",
  "/hdb-pulse/news/2026/final-tender-result-for-mixed-development-at-hougang-avenue-10-hougang-central",
  "/hdb-pulse/news/2026/flash-estimate-of-2nd-quarter-2026-resale-price-index-and-upcoming-flat-supply",
  "/hdb-pulse/news/2026/hdb-awards-new-centralised-cooling-system-contract-to-keppel-for-9-bto-projects-in-tengah",
  "/hdb-pulse/news/2026/HDB-issues-rated-fixed-rate-green-notes-may26",
  "/hdb-pulse/news/2026/hdb-issues-rated-fixed-rate-notes-jan26",
  "/hdb-pulse/news/2026/hdb-issues-rated-fixed-rate-notes-mar26",
  "/hdb-pulse/news/2026/hdb-issues-rated-fixed-rate-notes-may-26",
  "/hdb-pulse/news/2026/hdb-launches-6952-flats-across-7-projects-in-june-2026-bto-sales-exercise",
  "/hdb-pulse/news/2026/hdb-launches-9012-flats-in-february-2026-bto-and-sbf-exercises",
  "/hdb-pulse/news/2026/hdb-launches-tender-for-sale-site-at-admiralty-walk",
  "/hdb-pulse/news/2026/hdb-launches-tender-for-sale-site-at-canberra-drive",
  "/hdb-pulse/news/2026/hdb-to-launch-19600-bto-flats-in-2026",
  "/hdb-pulse/news/2026/hdb-to-launch-three-bto-projects-at-lakeview-and-shunfu-from-june-2026",
  "/hdb-pulse/news/2026/more-than-2500-flats-with-wait-times-of-around-three-years-or-less",
  "/hdb-pulse/news/2026/preparatory-works-for-long-island-project-to-commence-from-end-2026",
  "/hdb-pulse/news/2026/provisional-tender-results-for-executive-condominium-development-site-at-miltonia-close",
  "/hdb-pulse/news/2026/provisional-tender-results-for-executive-condominium-development-site-at-woodlands-drive-17",
  "/hdb-pulse/news/2026/public-housing-projects-will-be-developed-in-pearls-hill-and-toa-payoh-west",
  "/hdb-pulse/news/2026/residents-in-new-large-scale-bto-estates-to-enjoy-earlier-access-to-amenities",
  "/hdb-pulse/news/2026/temporary-road-closure-along-bartley-road",
  "/hdb-pulse/news/2026/temporary-road-closure-at-t-junction-between-tampines-ave-1-and-tampines-st-96",
  "/hdb-pulse/news/2026/upcoming-flat-supply-4Q2025-rpi",
  "/hdb-pulse/news/bto-table-template",
  "/hdb-pulse/publications",
  "/hdb-pulse/publications/hdb-publications",
  "/hdb-pulse/publications/life-storeys",
  "/hdb-pulse/reports",
  "/hdb-pulse/reports/annual-reports-and-financial-statements",
  "/hdb-pulse/reports/green-finance-framework-and-reports",
  "/managing-my-home",
  "/managing-my-home/finances",
  "/managing-my-home/finances/citizen-topup",
  "/managing-my-home/finances/cpf-rules-and-early-repayment",
  "/managing-my-home/finances/loan-matters",
  "/managing-my-home/finances/loan-matters/financial-assistance-measures",
  "/managing-my-home/finances/loan-matters/interest-rate",
  "/managing-my-home/finances/loan-matters/payments",
  "/managing-my-home/finances/loan-matters/refinance",
  "/managing-my-home/finances/loan-matters/repayment-period",
  "/managing-my-home/finances/loan-matters/statement-of-account",
  "/managing-my-home/home-ownership",
  "/managing-my-home/home-ownership/acquiring-private-property",
  "/managing-my-home/home-ownership/change-of-flat-owners-or-occupiers",
  "/managing-my-home/home-ownership/change-of-flat-owners-or-occupiers/change-in-flat-ownership-not-through-a-sale",
  "/managing-my-home/home-ownership/change-of-flat-owners-or-occupiers/change-in-flat-ownership-not-through-a-sale/additional-information",
  "/managing-my-home/home-ownership/change-of-flat-owners-or-occupiers/change-in-flat-ownership-not-through-a-sale/application-process",
  "/managing-my-home/home-ownership/change-of-flat-owners-or-occupiers/change-in-flat-ownership-not-through-a-sale/conditions-after-change-in-flat-ownership",
  "/managing-my-home/home-ownership/change-of-flat-owners-or-occupiers/change-in-flat-ownership-not-through-a-sale/eligibility",
  "/managing-my-home/home-ownership/change-of-flat-owners-or-occupiers/change-in-flat-ownership-not-through-a-sale/guide-for-change-in-flat-ownership",
  "/managing-my-home/home-ownership/change-of-flat-owners-or-occupiers/change-in-flat-ownership-not-through-a-sale/manner-of-holding",
  "/managing-my-home/home-ownership/change-of-flat-owners-or-occupiers/change-in-manner-of-holding-or-ownership-proportion",
  "/managing-my-home/home-ownership/change-of-flat-owners-or-occupiers/change-of-flat-occupiers",
  "/managing-my-home/home-ownership/change-of-flat-owners-or-occupiers/change-of-flat-occupiers/application-process",
  "/managing-my-home/home-ownership/change-of-flat-owners-or-occupiers/change-of-flat-occupiers/eligibility",
  "/managing-my-home/home-ownership/change-of-flat-owners-or-occupiers/resale-of-partshare",
  "/managing-my-home/home-ownership/change-of-flat-owners-or-occupiers/retain-flat-following-life-events",
  "/managing-my-home/home-ownership/checklist-for-moving-into-flat",
  "/managing-my-home/home-ownership/fire-insurance",
  "/managing-my-home/home-ownership/home-business",
  "/managing-my-home/home-ownership/home-business/homebased-business-scheme",
  "/managing-my-home/home-ownership/home-business/home-office-scheme",
  "/managing-my-home/home-ownership/home-business/home-office-scheme/apply-and-manage-registration",
  "/managing-my-home/home-ownership/home-business/home-office-scheme/conditions-of-use",
  "/managing-my-home/home-ownership/installing-smart-door-devices-and-cctv-cameras",
  "/managing-my-home/home-ownership/keeping-pets",
  "/managing-my-home/home-ownership/purchasing-recess-area",
  "/managing-my-home/home-ownership/renting-out-a-flat-or-bedrooms",
  "/managing-my-home/home-ownership/renting-out-a-flat-or-bedrooms/renting-out-a-flat",
  "/managing-my-home/home-ownership/renting-out-a-flat-or-bedrooms/renting-out-a-flat/application-process",
  "/managing-my-home/home-ownership/renting-out-a-flat-or-bedrooms/renting-out-a-flat/eligibility",
  "/managing-my-home/home-ownership/renting-out-a-flat-or-bedrooms/renting-out-a-flat/regulations",
  "/managing-my-home/home-ownership/renting-out-a-flat-or-bedrooms/renting-out-a-flat/rental-statistics",
  "/managing-my-home/home-ownership/renting-out-a-flat-or-bedrooms/renting-out-bedrooms",
  "/managing-my-home/home-ownership/renting-out-a-flat-or-bedrooms/renting-out-bedrooms/application-process",
  "/managing-my-home/home-ownership/renting-out-a-flat-or-bedrooms/renting-out-bedrooms/eligibility",
  "/managing-my-home/home-ownership/renting-out-a-flat-or-bedrooms/renting-out-bedrooms/regulations",
  "/managing-my-home/living-in-my-community",
  "/managing-my-home/living-in-my-community/being-a-good-neighbour",
  "/managing-my-home/living-in-my-community/being-a-good-neighbour/good-neighbours-movement",
  "/managing-my-home/living-in-my-community/being-a-good-neighbour/keeping-killer-litter-away",
  "/managing-my-home/living-in-my-community/being-a-good-neighbour/managing-neighbour-disputes",
  "/managing-my-home/living-in-my-community/being-a-good-neighbour/tips-on-neighbourliness",
  "/managing-my-home/living-in-my-community/enlivening-my-neighbourhood",
  "/managing-my-home/living-in-my-community/enlivening-my-neighbourhood/community-participatory-projects",
  "/managing-my-home/living-in-my-community/enlivening-my-neighbourhood/friends-of-our-heartlands-network",
  "/managing-my-home/living-in-my-community/enlivening-my-neighbourhood/lively-places-programme",
  "/managing-my-home/living-in-my-community/enlivening-my-neighbourhood/lively-places-programme/lively-places-fund-and-challenge",
  "/managing-my-home/living-in-my-community/enlivening-my-neighbourhood/programmes-and-resources-for-schools",
  "/managing-my-home/living-in-my-community/enlivening-my-neighbourhood/programmes-and-resources-for-schools/educational-resources-for-schools",
  "/managing-my-home/living-in-my-community/enlivening-my-neighbourhood/programmes-and-resources-for-schools/ohyay-programme",
  "/managing-my-home/living-in-my-community/enlivening-my-neighbourhood/programmes-and-resources-for-schools/sphere",
  "/managing-my-home/living-in-my-community/enlivening-my-neighbourhood/white-spaces",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/ang-mo-kio",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/ang-mo-kio/ang-mo-kio-town-centre",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/ang-mo-kio/cheng-san-centre",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/ang-mo-kio/chong-boon-centre",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/ang-mo-kio/kebun-baru-mall",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/ang-mo-kio/mayflower-shopping-and-food-centre",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/ang-mo-kio/teck-ghee-court",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/ang-mo-kio/teck-ghee-square",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/ang-mo-kio/yio-chu-kang-view",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bedok",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bedok/bedok-town-centre",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bedok/blocks-16-18-bedok-south-road",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bedok/blocks-25a-32a-chai-chee-road",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bedok/blocks-509-511a-bedok-north-street-3",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bedok/blocks-537-539a-bedok-north-street-3",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bedok/blocks-630-632-bedok-reservoir-road",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bedok/blocks-84-89-bedok-north-street-4",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bedok/reservoir-village",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bedok/the-marketplace58",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bishan",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bishan/bishan-north-shopping-mall",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bishan/bishan-town-centre",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bishan/blocks-150-152a-bishan-street-11",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bukit-batok",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bukit-batok/bukit-batok-east-point",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bukit-batok/bukit-batok-town-centre",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bukit-batok/bukit-batok-west-shopping-centre",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bukit-batok/bukit-gombak-neighbourhood-centre",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bukit-merah",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bukit-merah/alexandra-village",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bukit-merah/blocks-111-112-jalan-bukit-merah",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bukit-merah/blocks-115-116-bukit-merah-view",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bukit-merah/blocks-34-40-beo-crescent",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bukit-merah/blocks-35-38-telok-blangah-rise",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bukit-merah/blocks-55-59-lengkok-bahru",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bukit-merah/blocks-78-86-redhill-lane",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bukit-merah/blocks-8-12-telok-blangah-crescent",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bukit-merah/brickworks-estate",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bukit-merah/bukit-merah-town-centre",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bukit-merah/connection-one",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bukit-merah/depot-heights-shopping-centre",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bukit-merah/telok-blangah-mall",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bukit-panjang",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bukit-panjang/bukit-panjang-neighbourhood-centre",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bukit-panjang/fajar-shopping-centre",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bukit-panjang/greenridge-shopping-centre",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bukit-timah",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bukit-timah/empress-mall",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/central-area",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/central-area/bras-basah-complex",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/central-area/cheng-yan-court",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/central-area/chinatown-complex",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/central-area/hong-lim-complex",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/central-area/new-bridge-centre",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/central-area/peoples-park",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/central-area/tanjong-pagar-plaza",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/central-area/waterloo-centre",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/choa-chu-kang",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/choa-chu-kang/choa-chu-kang-centre",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/choa-chu-kang/choa-chu-kang-town-centre",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/choa-chu-kang/keat-hong-shopping-centre",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/choa-chu-kang/limbang-shopping-centre",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/choa-chu-kang/sunshine-place",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/choa-chu-kang/teck-whye-shopping-centre",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/choa-chu-kang/yew-tee-square",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/clementi",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/clementi/blocks-501-505-west-coast-drive",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/clementi/blocks-720-727-clementi-west-street-2",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/clementi/clementi-avenue-2-shopping-centre",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/clementi/clementi-town-centre",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/clementi/sunset-way",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/geylang",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/geylang/blocks-10-14-haig-road",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/geylang/blocks-113-119-aljunied-avenue-2",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/geylang/blocks-1a-8-eunos-crescent",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/geylang/blocks-37-64-80-circuit-road",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/geylang/blocks-81-83-macpherson-lane",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/geylang/blocks-86-89-circuit-road",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/geylang/joo-chiat-complex",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/geylang/kallang-airport",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/geylang/kampong-ubi-greenville",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/geylang/sims-vista",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/hougang",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/hougang/hougang-n1-centre",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/hougang/hougang-rivercourt",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/hougang/hougang-town-centre",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/hougang/hougang-village",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/hougang/kovan-city",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/jurong-east",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/jurong-east/blocks-37-39-teban-gardens-road",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/jurong-east/j-connect",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/jurong-east/teban-place",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/jurong-east/yuhua-place",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/jurong-east/yuhua-village",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/jurong-west",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/jurong-west/blocks-959-966-jurong-west-street-92",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/jurong-west/boon-lay-shopping-centre",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/jurong-west/gek-poh-shopping-centre",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/jurong-west/hong-kah-point",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/jurong-west/hong-kah-ville",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/jurong-west/pioneer-mall",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/jurong-west/taman-jurong-shopping-centre",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/kallang-whampoa",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/kallang-whampoa/balestier-hill-shopping-centre",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/kallang-whampoa/bendemeer-shopping-mall",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/kallang-whampoa/blocks-41-46-cambridge-road",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/kallang-whampoa/blocks-66-71-kallang-bahru",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/kallang-whampoa/blocks-81-92-whampoa-drive",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/kallang-whampoa/boon-keng-ville",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/kallang-whampoa/di-tanjong-rhu",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/kallang-whampoa/kitchener-complex",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/marine-parade",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/marine-parade/marine-parade-promenade",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/marine-parade/marine-terrace-haven",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/pasir-ris",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/pasir-ris/blocks-440-446-pasir-ris-drive-4",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/pasir-ris/changi-village",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/pasir-ris/elias-mall",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/pasir-ris/loyang-point",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/pasir-ris/pasir-ris-west-plaza",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/punggol",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/punggol/northshore-plaza",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/punggol/oasis-terraces",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/punggol/punggol-plaza",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/queenstown",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/queenstown/blocks-116-118-commonwealth-crescent",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/queenstown/blocks-1a-3a-46-49-commonwealth-drive",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/queenstown/blocks-40-47-holland-drive",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/queenstown/dawson-place",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/queenstown/ghim-moh-centre",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/queenstown/mei-ling-heights",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/sembawang",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/sembawang/canberra-plaza",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/sembawang/sembawang-mart",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/sengkang",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/sengkang/anchorvale-village",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/sengkang/buangkok-square",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/sengkang/rivervale-plaza",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/serangoon",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/serangoon/serangoon-north-village",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/serangoon/serangoon-town-centre",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/tampines",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/tampines/block-248-simei-street-3",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/tampines/blocks-136-139-tampines-street-11",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/tampines/blocks-201-201g-tampines-street-21",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/tampines/blocks-472-484-tampines-street-44",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/tampines/blocks-821-829-tampines-street-81",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/tampines/tampines-central-community-complex",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/tampines/tampines-town-centre",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/tengah",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/tengah/plantation-plaza",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/toa-payoh",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/toa-payoh/blocks-146-148-potong-pasir-avenue-1",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/toa-payoh/blocks-211-212-lorong-8-toa-payoh",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/toa-payoh/hdb-hub",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/toa-payoh/joo-seng-green",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/toa-payoh/kim-keat-palm",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/toa-payoh/toa-payoh-palm-spring",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/toa-payoh/toa-payoh-town-centre",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/toa-payoh/toa-payoh-view",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/toa-payoh/toa-payoh-vista",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/woodlands",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/woodlands/888-plaza",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/woodlands/admiralty-place",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/woodlands/fuchun-neighbourhood-centre",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/woodlands/kampung-admiralty",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/woodlands/marsiling-court",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/woodlands/vista-point",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/woodlands/woodlands-civic-centre",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/woodlands/woodlands-mart",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/woodlands/woodlands-north-plaza",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/yishun",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/yishun/chong-pang-city",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/yishun/khatib-central",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/yishun/nee-soon-east-courtyard",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/yishun/yishun-mall",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/yishun/yishun-town-centre",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/facilities",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/neighbourhood-centres",
  "/managing-my-home/living-in-my-community/exploring-my-neighbourhood/town-and-community-plazas",
  "/managing-my-home/living-in-my-community/hdb-community-day",
  "/managing-my-home/living-in-my-community/hdb-community-day/hdb-community-day-2023",
  "/managing-my-home/living-in-my-community/hdb-community-day/hdb-community-day-2023/friends-of-our-heartlands-exhibition-2023",
  "/managing-my-home/living-in-my-community/hdb-community-day/hdb-community-day-2023/lively-places-challenge-2023",
  "/managing-my-home/living-in-my-community/hdb-community-day/hdb-community-day-2023/singapores-friendly-neighbourhood-award-2023",
  "/managing-my-home/living-in-my-community/hdb-community-day/partnerships",
  "/managing-my-home/living-in-my-community/hdb-community-day/people",
  "/managing-my-home/living-in-my-community/hdb-community-day/places",
  "/managing-my-home/living-in-my-community/practising-ecoliving",
  "/managing-my-home/living-in-my-community/practising-ecoliving/ecoliving-tips",
  "/managing-my-home/living-in-my-community/practising-ecoliving/sustainability-trails",
  "/managing-my-home/living-in-my-community/practising-ecoliving/sustainability-trails/explorer-trail",
  "/managing-my-home/living-in-my-community/practising-ecoliving/sustainability-trails/voyager-trail",
  "/managing-my-home/renovation-and-maintenance",
  "/managing-my-home/renovation-and-maintenance/home-maintenance",
  "/managing-my-home/renovation-and-maintenance/home-maintenance/function-of-hdb-branches-and-town-councils",
  "/managing-my-home/renovation-and-maintenance/home-maintenance/guard-against-contractors-on-doortodoor-sales",
  "/managing-my-home/renovation-and-maintenance/home-maintenance/home-care-guide",
  "/managing-my-home/renovation-and-maintenance/home-maintenance/home-care-guide/air-conditioners",
  "/managing-my-home/renovation-and-maintenance/home-maintenance/home-care-guide/ceiling-leaks",
  "/managing-my-home/renovation-and-maintenance/home-maintenance/home-care-guide/electrical-accessories-and-wiring",
  "/managing-my-home/renovation-and-maintenance/home-maintenance/home-care-guide/floor-finishes",
  "/managing-my-home/renovation-and-maintenance/home-maintenance/home-care-guide/floor-traps",
  "/managing-my-home/renovation-and-maintenance/home-maintenance/home-care-guide/gate-and-door",
  "/managing-my-home/renovation-and-maintenance/home-maintenance/home-care-guide/household-shelter",
  "/managing-my-home/renovation-and-maintenance/home-maintenance/home-care-guide/pipes",
  "/managing-my-home/renovation-and-maintenance/home-maintenance/home-care-guide/sinks-and-wash-basins",
  "/managing-my-home/renovation-and-maintenance/home-maintenance/home-care-guide/spalling-concrete",
  "/managing-my-home/renovation-and-maintenance/home-maintenance/home-care-guide/toilet-fittings",
  "/managing-my-home/renovation-and-maintenance/home-maintenance/home-care-guide/toilets",
  "/managing-my-home/renovation-and-maintenance/home-maintenance/home-care-guide/walls",
  "/managing-my-home/renovation-and-maintenance/home-maintenance/home-care-guide/windows",
  "/managing-my-home/renovation-and-maintenance/home-maintenance/professional-help-and-contractors",
  "/managing-my-home/renovation-and-maintenance/home-maintenance/professional-help-and-contractors/air-conditioners",
  "/managing-my-home/renovation-and-maintenance/home-maintenance/professional-help-and-contractors/minor-repairs",
  "/managing-my-home/renovation-and-maintenance/home-maintenance/professional-help-and-contractors/windows",
  "/managing-my-home/renovation-and-maintenance/rectification-of-defects-in-new-flats",
  "/managing-my-home/renovation-and-maintenance/renovation",
  "/managing-my-home/renovation-and-maintenance/renovation/application-for-a-renovation-permit",
  "/managing-my-home/renovation-and-maintenance/renovation/important-information-on-renovations",
  "/managing-my-home/renovation-and-maintenance/renovation/looking-for-renovation-contractors",
  "/managing-my-home/renovation-and-maintenance/renovation/renovation-guidelines",
  "/managing-my-home/renovation-and-maintenance/renovation/renovation-guidelines/air-conditioner-installation-works",
  "/managing-my-home/renovation-and-maintenance/renovation/renovation-guidelines/building-works",
  "/managing-my-home/renovation-and-maintenance/renovation/renovation-guidelines/electrical-works",
  "/managing-my-home/renovation-and-maintenance/renovation/renovation-guidelines/water-and-sanitary-plumbing-works-and-gas-works",
  "/managing-my-home/renovation-and-maintenance/renovation/renovation-guidelines/window-works",
  "/managing-my-home/retirement-planning",
  "/managing-my-home/retirement-planning/monetising-flat-for-retirement",
  "/managing-my-home/retirement-planning/monetising-flat-for-retirement/lease-buyback-scheme-lbs",
  "/managing-my-home/retirement-planning/monetising-flat-for-retirement/lease-buyback-scheme-lbs/application-process",
  "/managing-my-home/retirement-planning/monetising-flat-for-retirement/lease-buyback-scheme-lbs/understanding-the-lbs",
  "/managing-my-home/retirement-planning/monetising-flat-for-retirement/silver-housing-bonus",
  "/managing-my-home/retirement-planning/use-of-cpf-for-loan-repayment",
  "/managing-my-home/selling-a-flat",
  "/managing-my-home/selling-a-flat/eligibility",
  "/managing-my-home/selling-a-flat/process-for-selling-a-flat",
  "/managing-my-home/selling-a-flat/process-for-selling-a-flat/intent-to-sell",
  "/managing-my-home/selling-a-flat/process-for-selling-a-flat/option-to-purchase",
  "/managing-my-home/selling-a-flat/process-for-selling-a-flat/overview",
  "/managing-my-home/selling-a-flat/process-for-selling-a-flat/resale-flat-application",
  "/managing-my-home/selling-a-flat/process-for-selling-a-flat/resale-flat-application/application-process",
  "/managing-my-home/selling-a-flat/process-for-selling-a-flat/resale-flat-application/approval-of-application",
  "/managing-my-home/selling-a-flat/process-for-selling-a-flat/resale-flat-application/request-for-temporary-extension-of-stay",
  "/managing-my-home/selling-a-flat/process-for-selling-a-flat/resale-flat-completion",
  "/managing-my-home/selling-a-flat/process-for-selling-a-flat/resale-flat-planning",
  "/managing-my-home/selling-a-flat/process-for-selling-a-flat/resale-flat-planning/managing-the-sale-of-flat",
  "/managing-my-home/selling-a-flat/process-for-selling-a-flat/resale-flat-planning/resale-statistics",
  "/managing-my-home/upgrading-and-redevelopment",
  "/managing-my-home/upgrading-and-redevelopment/enhancement-for-active-seniors-ease",
  "/managing-my-home/upgrading-and-redevelopment/enhancement-for-active-seniors-ease/videos-on-ease-direct-application",
  "/managing-my-home/upgrading-and-redevelopment/home-improvement-programme-hip",
  "/managing-my-home/upgrading-and-redevelopment/lift-upgrading-programme-lup",
  "/managing-my-home/upgrading-and-redevelopment/neighbourhood-renewal-programme-nrp",
  "/managing-my-home/upgrading-and-redevelopment/pay-upgrading-cost",
  "/managing-my-home/upgrading-and-redevelopment/pay-upgrading-cost/change-of-flat-ownership-and-liability-to-pay",
  "/managing-my-home/upgrading-and-redevelopment/pay-upgrading-cost/change-repayment-period-or-convert-interest-rate",
  "/managing-my-home/upgrading-and-redevelopment/pay-upgrading-cost/process",
  "/managing-my-home/upgrading-and-redevelopment/pay-upgrading-cost/scheduled-billing-date-and-statement-of-account",
  "/managing-my-home/upgrading-and-redevelopment/pay-upgrading-cost/subsidies-and-financial-assistance-measures",
  "/managing-my-home/upgrading-and-redevelopment/selective-en-bloc-redevelopment-scheme-sers",
  "/parking",
  "/parking/applying-for-season-parking",
  "/parking/applying-for-season-parking/apply-for-concessionary-season-parking-for-motorcycles",
  "/parking/applying-for-season-parking/apply-for-family-season-parking",
  "/parking/applying-for-season-parking/apply-for-family-season-parking/application-process",
  "/parking/applying-for-season-parking/apply-for-family-season-parking/eligibility",
  "/parking/applying-for-season-parking/apply-for-family-season-parking/family-season-parking-charges",
  "/parking/applying-for-season-parking/apply-for-season-parking",
  "/parking/applying-for-season-parking/apply-for-season-parking-for-commercial-vehicles",
  "/parking/other-parking-matters",
  "/parking/other-parking-matters/car-parks-for-business-activities",
  "/parking/other-parking-matters/car-parks-for-business-activities/car-cleaning-services",
  "/parking/other-parking-matters/car-parks-for-business-activities/courier-hub-scheme-chs",
  "/parking/other-parking-matters/car-parks-for-business-activities/other-business-activities",
  "/parking/other-parking-matters/shortterm-parking",
  "/parking/other-parking-matters/shortterm-parking/coupon-parking",
  "/parking/other-parking-matters/shortterm-parking/coupon-parking/how-to-display-parking-coupons",
  "/parking/other-parking-matters/shortterm-parking/coupon-parking/how-to-seek-a-refund-for-unused-parking-coupons",
  "/parking/other-parking-matters/shortterm-parking/coupon-parking/where-to-buy-parking-coupons",
  "/parking/other-parking-matters/shortterm-parking/electronic-parking",
  "/parking/other-parking-matters/shortterm-parking/free-parking-scheme-on-sundays-and-public-holidays",
  "/parking/other-parking-matters/shortterm-parking/parkinghdb",
  "/parking/other-parking-matters/shortterm-parking/parkinghdb/frequently-asked-questions",
  "/parking/other-parking-matters/shortterm-parking/parkinghdb/privacy-statement",
  "/parking/other-parking-matters/shortterm-parking/parkinghdb/terms-of-use",
  "/parking/other-parking-matters/shortterm-parking/shortterm-parking-charges",
  "/parking/other-parking-matters/temporary-parking-for-bereavement-matters",
  "/parking/parking-offences",
  "/parking/parking-offences/parking-rules-and-penalties",
  "/parking/parking-offences/pay-parking-fines",
  "/parking/parking-offences/report-a-parking-offence",
  "/parking/renewing-season-parking",
  "/parking/renewing-season-parking/renew-concessionary-season-parking-for-motorcycles",
  "/parking/renewing-season-parking/renew-family-season-parking",
  "/parking/renewing-season-parking/renew-season-parking",
  "/parking/terminating-season-parking",
  "/parking/terminating-season-parking/terminate-concessionary-season-parking-for-motorcycles",
  "/parking/terminating-season-parking/terminate-family-season-parking",
  "/parking/terminating-season-parking/terminate-season-parking",
  "/parking/transferring-season-parking",
  "/parking/transferring-season-parking/transfer-concessionary-season-parking-for-motorcycles",
  "/parking/transferring-season-parking/transfer-season-parking",
  "/renting-a-flat",
  "/renting-a-flat/parenthood-provisional-housing-scheme",
  "/renting-a-flat/parenthood-provisional-housing-scheme/application-changes-and-cancellation",
  "/renting-a-flat/parenthood-provisional-housing-scheme/application-process",
  "/renting-a-flat/parenthood-provisional-housing-scheme/application-process/applications-received",
  "/renting-a-flat/parenthood-provisional-housing-scheme/application-process/pphs-flats-available-for-application",
  "/renting-a-flat/parenthood-provisional-housing-scheme/eligibility",
  "/renting-a-flat/parenthood-provisional-housing-scheme/rents-and-deposits",
  "/renting-a-flat/parenthood-provisional-housing-scheme/tenancy-matters",
  "/renting-a-flat/public-rental-scheme",
  "/renting-a-flat/public-rental-scheme/application-process",
  "/renting-a-flat/public-rental-scheme/application-process/application-and-selection-of-rental-flat",
  "/renting-a-flat/public-rental-scheme/application-process/application-changes-and-cancellation",
  "/renting-a-flat/public-rental-scheme/application-process/rental-flat-types-and-locations",
  "/renting-a-flat/public-rental-scheme/application-process/rental-flat-types-and-locations/partitioned-flat",
  "/renting-a-flat/public-rental-scheme/application-process/rents-and-deposits",
  "/renting-a-flat/public-rental-scheme/eligibility",
  "/renting-a-flat/public-rental-scheme/eligibility/comlink-rental-scheme",
  "/renting-a-flat/public-rental-scheme/eligibility/joint-singles-scheme-operatorrun-jssor-pilot",
  "/renting-a-flat/public-rental-scheme/eligibility/single-room-shared-facilities-srsf-pilot",
  "/renting-a-flat/public-rental-scheme/tenancy-matters",
  "/renting-a-flat/public-rental-scheme/tenancy-matters/assistance-for-tenants",
  "/renting-a-flat/public-rental-scheme/tenancy-matters/change-of-occupiers",
  "/renting-a-flat/public-rental-scheme/tenancy-matters/change-of-tenancy",
  "/renting-a-flat/public-rental-scheme/tenancy-matters/rent-payment-and-late-charges",
  "/renting-a-flat/public-rental-scheme/tenancy-matters/transfer-to-another-public-rental-flat",
  "/renting-a-flat/public-rental-scheme/tenancy-renewal",
  "/renting-a-flat/public-rental-scheme/tenancy-termination",
  "/renting-a-flat/renting-from-open-market",
  "/renting-a-flat/renting-from-open-market/eligibility",
  "/renting-a-flat/renting-from-open-market/regulations",
  "/renting-a-flat/renting-from-open-market/rental-statistics",
  "/renting-a-flat/renting-from-open-market/tenancy-matters",
  "/shops-and-offices",
  "/shops-and-offices/business-resources",
  "/shops-and-offices/business-resources/Newsletter",
  "/shops-and-offices/business-resources/probusiness-schemes",
  "/shops-and-offices/buying-from-open-market",
  "/shops-and-offices/buying-from-open-market/application-guidelines",
  "/shops-and-offices/managing-an-hdb-shop-or-office",
  "/shops-and-offices/managing-an-hdb-shop-or-office/change-of-companys-name",
  "/shops-and-offices/managing-an-hdb-shop-or-office/change-of-partners-shareholders-mode-of-business",
  "/shops-and-offices/managing-an-hdb-shop-or-office/change-of-trade",
  "/shops-and-offices/managing-an-hdb-shop-or-office/change-of-use",
  "/shops-and-offices/managing-an-hdb-shop-or-office/change-of-use/application-process",
  "/shops-and-offices/managing-an-hdb-shop-or-office/change-of-use/permissible-trades",
  "/shops-and-offices/managing-an-hdb-shop-or-office/change-of-use/renew-change-of-use",
  "/shops-and-offices/managing-an-hdb-shop-or-office/change-of-use/using-a-shops-living-quarters",
  "/shops-and-offices/managing-an-hdb-shop-or-office/guidelines-for-hdb-eating-houses",
  "/shops-and-offices/managing-an-hdb-shop-or-office/renew-tenancy",
  "/shops-and-offices/managing-an-hdb-shop-or-office/renovation",
  "/shops-and-offices/managing-an-hdb-shop-or-office/renovation/addition-alteration-aa-works",
  "/shops-and-offices/managing-an-hdb-shop-or-office/renovation/application-process",
  "/shops-and-offices/managing-an-hdb-shop-or-office/renovation/electrical-works",
  "/shops-and-offices/managing-an-hdb-shop-or-office/rental-payment",
  "/shops-and-offices/managing-an-hdb-shop-or-office/rental-payment/mode-of-payment-for-rent",
  "/shops-and-offices/managing-an-hdb-shop-or-office/rental-payment/retrieve-tax-invoice-and-statement-of-account",
  "/shops-and-offices/managing-an-hdb-shop-or-office/renting-out",
  "/shops-and-offices/managing-an-hdb-shop-or-office/renting-out/application-process",
  "/shops-and-offices/managing-an-hdb-shop-or-office/renting-out/manage-subtenant",
  "/shops-and-offices/managing-an-hdb-shop-or-office/renting-out/proposed-subtenants-trade",
  "/shops-and-offices/managing-an-hdb-shop-or-office/renting-out/renting-out-living-quarters",
  "/shops-and-offices/managing-an-hdb-shop-or-office/renting-out/terms-and-conditions",
  "/shops-and-offices/managing-an-hdb-shop-or-office/terminate-tenancy",
  "/shops-and-offices/managing-an-hdb-shop-or-office/treatment-of-30year-leases",
  "/shops-and-offices/renting-from-hdb",
  "/shops-and-offices/renting-from-hdb/crossagency-tenders",
  "/shops-and-offices/renting-from-hdb/hdb-hub-convention-centre-for-rent",
  "/shops-and-offices/renting-from-hdb/hdb-hub-mall-area-for-rent",
  "/shops-and-offices/renting-from-hdb/shops-and-offices-for-rent",
  "/shops-and-offices/renting-from-hdb/shops-and-offices-for-rent/documents-and-checklists",
  "/shops-and-offices/renting-from-hdb/shops-and-offices-for-rent/tender-process",
  "/shops-and-offices/renting-from-open-market",
  "/shops-and-offices/renting-from-open-market/application-guidelines",
  "/shops-and-offices/selling-on-open-market",
  "/shops-and-offices/selling-on-open-market/consent-to-mortgage",
  "/shops-and-offices/selling-on-open-market/documents-and-checklists",
  "/shops-and-offices/selling-on-open-market/inspection-report",
  "/shops-and-offices/selling-on-open-market/lodgement-scheme",
  "/shops-and-offices/selling-on-open-market/transfer-ownership-or-sell"
];

var publicPageMetadata = [
  ["/homepage","Housing & Development Board (HDB)","As Singapore's public housing authority, HDB build homes and transforms towns to create a quality living environment for all."],
  ["/about-us","About Us","Established in 1960, HDB has provided quality and affordable public housing for generations of Singaporeans. Learn about our history, role, vision and mission."],
  ["/about-us/contact-us","Contact Us","To serve you better, we invite you to send your enquiry or feedback on HDB-related matters."],
  ["/about-us/our-role","Our Role","We take pride in creating homes and towns to form a quality living environment where communities thrive."],
  ["/about-us/our-role/build-quality-flats","Build Quality Flats","Innovative technology and processes enable us to build quality homes safely."],
  ["/about-us/our-role/create-smart-and-sustainable-homes","Create Smart and Sustainable Homes","We build homes that minimise environmental impact and use smart technology to enhance daily living."],
  ["/about-us/our-role/create-smart-and-sustainable-homes/biophilic-towns","Biophilic Towns","Explore how HDB designs estates to integrate our homes with the neighbourhood landscape."],
  ["/about-us/our-role/create-smart-and-sustainable-homes/cool-ideas-enterprise","Cool Ideas Enterprise","Join Cool Ideas Enterprise to co-develop innovative projects with HDB."],
  ["/about-us/our-role/create-smart-and-sustainable-homes/green-innovations","Green Innovations","HDB aims to reduce energy consumption by 2030. These innovations will help make a difference."],
  ["/about-us/our-role/create-smart-and-sustainable-homes/green-towns-programme","Green Towns Programme","Discover HDB's Green Towns Programme, a 10-year plan to make HDB towns more sustainable."],
  ["/about-us/our-role/enable-home-ownership","Enable Home Ownership","Find out how our public housing programme provides support for home ownership."],
  ["/about-us/our-role/foster-thriving-communities","Foster Thriving Communities","We bring people together by forging community ties unique to the HDB heartlands."],
  ["/about-us/our-role/plan-and-design-towns","Plan and Design Towns","We plan and rejuvenate HDB towns comprehensively, so you can live comfortably for years to come."],
  ["/about-us/our-role/plan-and-design-towns/planning-with-the-environment-in-mind","Planning With the Environment in Mind","We conduct environmental and heritage studies to guide the planning and development of new housing areas, to minimise impact on natural and built environments."],
  ["/about-us/our-role/plan-and-design-towns/town-design-guides","Town Design Guides","HDB’s Town Design Guides set out the vision, planning, and design principles for each town."],
  ["/about-us/our-role/plan-and-design-towns/universal-design","Universal Design","Universal Design makes the living environment more inclusive and user-friendly for all ages."],
  ["/about-us/our-story","Our Story","Learn about our organisation, our purpose and the milestones of our public housing journey."],
  ["/about-us/our-story/achievements","Achievements","Explore HDB's achievements that show our commitment to excellence as a public housing organisation."],
  ["/about-us/our-story/organisation-structure","Organisation Structure","Find out how HDB is structured and the people who are leading the organisation."],
  ["/about-us/our-story/our-history","Our History","Review the key milestones of Singapore's public housing programme through the decades."],
  ["/about-us/our-story/our-livingspace-gallery","Our LIVINGSPACE Gallery","Discover Singapore’s public housing story and how it has evolved, at the HDB LIVINGSPACE gallery."],
  ["/about-us/our-towns-and-estates","Our Towns and Estates","We design each HDB town to celebrate its distinct character. Find out what makes yours unique."],
  ["/about-us/our-towns-and-estates/ang-mo-kio","Ang Mo Kio","Learn about the history of Ang Mo Kio, and how it has evolved over the years."],
  ["/about-us/our-towns-and-estates/bedok","Bedok","Learn about the history of Bedok, and how it has evolved over the years."],
  ["/about-us/our-towns-and-estates/bishan","Bishan","Learn about the history of Bishan, and how it has evolved over the years."],
  ["/about-us/our-towns-and-estates/bukit-batok","Bukit Batok","Learn about the history of Bukit Batok, and how it has evolved over the years."],
  ["/about-us/our-towns-and-estates/bukit-merah","Bukit Merah","Learn about the history of Bukit Merah, and how it has evolved over the years."],
  ["/about-us/our-towns-and-estates/bukit-panjang","Bukit Panjang","Learn about the history of Bukit Panjang, and how it has evolved over the years."],
  ["/about-us/our-towns-and-estates/bukit-timah","Bukit Timah","Learn about the history of Bukit Timah, and how it has evolved over the years."],
  ["/about-us/our-towns-and-estates/central-area","Central Area","Learn about the history of the Central Area, and how it has evolved over the years."],
  ["/about-us/our-towns-and-estates/choa-chu-kang","Choa Chu Kang","Learn about the history of Choa Chu Kang, and how it has evolved over the years."],
  ["/about-us/our-towns-and-estates/clementi","Clementi","Learn about the history of Clementi, and how it has evolved over the years."],
  ["/about-us/our-towns-and-estates/geylang","Geylang","Learn about the history of Geylang, and how it has evolved over the years."],
  ["/about-us/our-towns-and-estates/hougang","Hougang","Learn about the history of Hougang, and how it has evolved over the years."],
  ["/about-us/our-towns-and-estates/jurong-east","Jurong East","Learn about the history of Jurong East, and how it has evolved over the years."],
  ["/about-us/our-towns-and-estates/jurong-west","Jurong West","Learn about the history of Jurong West, and how it has evolved over the years."],
  ["/about-us/our-towns-and-estates/kallang-whampoa","Kallang/ Whampoa","Learn about the history of Kallang/ Whampoa, and how it has evolved over the years."],
  ["/about-us/our-towns-and-estates/marine-parade","Marine Parade","Learn about the history of Marine Parade, and how it has evolved over the years."],
  ["/about-us/our-towns-and-estates/pasir-ris","Pasir Ris","Learn about the history of Pasir Ris, and how it has evolved over the years."],
  ["/about-us/our-towns-and-estates/punggol","Punggol","Learn about the history of Punggol, and how it has evolved over the years."],
  ["/about-us/our-towns-and-estates/queenstown","Queenstown","Learn about the history of Queenstown, and how it has evolved over the years."],
  ["/about-us/our-towns-and-estates/sembawang","Sembawang","Learn about the history of Sembawang, and how it has evolved over the years."],
  ["/about-us/our-towns-and-estates/sengkang","Sengkang","Learn about the history of Sengkang, and how it has evolved over the years."],
  ["/about-us/our-towns-and-estates/serangoon","Serangoon","Learn about the history of Serangoon, and how it has evolved over the years."],
  ["/about-us/our-towns-and-estates/tampines","Tampines","Learn about the history of Tampines, and how it has evolved over the years."],
  ["/about-us/our-towns-and-estates/tengah","Tengah","Learn about Tengah, HDB's newest town with biophilic features and smart technologies town-wide."],
  ["/about-us/our-towns-and-estates/toa-payoh","Toa Payoh","Learn about the history of Toa Payoh, and how it has evolved over the years."],
  ["/about-us/our-towns-and-estates/woodlands","Woodlands","Learn about the history of Woodlands, and how it has evolved over the years."],
  ["/about-us/our-towns-and-estates/yishun","Yishun","Learn about the history of Yishun, and how it has evolved over the years."],
  ["/about-us/work-with-us","Work With Us","Explore career, scholarship or internship opportunities at HDB, and embark on a fulfilling career with us."],
  ["/about-us/work-with-us/careers","Careers","We are always seeking talents who share our purpose. Explore the exciting career possibilities with HDB and join us in shaping the future of Singapore together."],
  ["/about-us/work-with-us/scholarships-and-internships","Scholarships and Internships","Discover the opportunities and benefits that our scholarships and internships offer, and how to apply."],
  ["/about-us/work-with-us/scholarships-and-internships/internships","Internships","Explore our internship opportunities and experience our work and culture at HDB."],
  ["/about-us/work-with-us/scholarships-and-internships/scholarships","Scholarships","HDB offers two types of undergraduate scholarships across various disciplines. Learn how they can offer you a rewarding career to shape our public housing."],
  ["/about-us/work-with-us/scholarships-and-internships/scholarships/frequently-asked-questions","Frequently Asked Questions on Scholarships","Get insights to our scholarship selection process, eligible courses, and career opportunities."],
  ["/about-us/work-with-us/scholarships-and-internships/scholarships/hdb-specialist-scholarships","HDB Specialist Scholarships","Learn more about the HDB Specialist Scholarship."],
  ["/about-us/work-with-us/scholarships-and-internships/scholarships/hdb-undergraduate-scholarships","HDB Undergraduate Scholarships","Learn more about the HDB Undergraduate Scholarship."],
  ["/application-for-renovation-permit/get-help","Get Help",""],
  ["/apply-for-4-months-free-parking/get-help","Get Help",""],
  ["/apply-for-4-months-free-parking/terms-and-conditions","Terms and Conditions",""],
  ["/apply-for-auto-renewal-of-season-parking-by-credit-card/get-help","Get Help",""],
  ["/apply-for-auto-renewal-of-season-parking-by-credit-card/terms-and-conditions","Terms and Conditions",""],
  ["/apply-for-auto-renewal-of-season-parking-by-giro/get-help","Get Help",""],
  ["/apply-for-auto-renewal-of-season-parking-by-giro/terms-and-conditions","Terms and Conditions",""],
  ["/apply-for-enhancement-for-active-seniors-ease/get-help","Get Help",""],
  ["/apply-for-enhancement-for-active-seniors-ease/get-help-chinese","Get Help - Chinese",""],
  ["/apply-for-enhancement-for-active-seniors-ease/get-help-tamil","Get Help - Tamil",""],
  ["/apply-for-enhancement-for-active-seniors-ease/terms-and-conditions","Terms and Conditions",""],
  ["/apply-for-enhancement-for-active-seniors-ease/terms-and-conditions---chinese","Terms and Conditions - Chinese",""],
  ["/apply-for-family-season-parking/get-help","Get Help",""],
  ["/apply-for-family-season-parking/terms-and-conditions","Terms and Conditions",""],
  ["/apply-for-giro-payment-of-housing-loan-upgrading-cost-or-rent-hardcopy/get-help","Get Help",""],
  ["/apply-for-hdb-loan-eligibility-hle-letter/get-help","Get Help",""],
  ["/apply-for-lease-topup/get-help","Get Help",""],
  ["/apply-for-lease-topup/terms-and-conditions","Terms and Conditions",""],
  ["/apply-for-listing-in-directory-of-renovation-contractors-drc/get-help","Get Help",""],
  ["/apply-for-listing-in-directory-of-renovation-contractors-drc/terms-and-conditions","Terms and Conditions",""],
  ["/apply-for-new-flat-under-sers-acquisition-exercise/get-help","Get Help",""],
  ["/apply-for-new-flat-under-sers-acquisition-exercise/terms-and-conditions","Terms and Conditions",""],
  ["/apply-for-new-season-parking/get-help","Get Help",""],
  ["/apply-for-new-season-parking/terms-and-conditions","Terms and Conditions",""],
  ["/apply-for-renovation-permit/get-help","Get Help",""],
  ["/apply-for-renovation-permit/terms-and-conditions","Terms and Conditions",""],
  ["/apply-for-rental-flat-under-public-rental-scheme/get-help","Get Help",""],
  ["/apply-for-telecommunication-works/get-help","Get Help",""],
  ["/apply-for-topup-grant-or-citizen-topup/terms-and-conditions","Terms and Conditions for Application for Citizen Top-Up or Top-Up Grant",""],
  ["/apply-manage-and-renew-rental-of-bedroom/get-help","Get Help",""],
  ["/apply-manage-and-renew-rental-of-bedroom/terms-and-conditions","Terms and Conditions",""],
  ["/apply-manage-and-renew-rental-of-flat/get-help","Get Help",""],
  ["/apply-manage-and-renew-rental-of-flat/terms-and-conditions","Terms and Conditions",""],
  ["/apply-or-change-cpf-payment-for-housing-loan-or-upgrading-cost/terms-and-conditions","Terms and Conditions",""],
  ["/apply-to-pay-for-new-flat-and-home-protection-scheme-with-cpf/terms-and-conditions","Terms and Conditions",""],
  ["/apply-to-pay-for-resale-flat-and-home-protection-scheme-with-cpf/terms-and-conditions","Terms and Conditions",""],
  ["/apply-to-transfer-ownership-or-sell-hdb-commercial-properties/terms-and-conditions","Terms and Conditions for Mortgagee Sale","Learn about the terms and conditions for a mortgagee sale of HDB commercial properties."],
  ["/book-appointment-at-hdb-branch/get-help","Get Help",""],
  ["/book-appointment-at-hdb-branch/terms-and-conditions","Terms and Conditions",""],
  ["/book-appointment-for-keys-collection/get-help","Get Help",""],
  ["/business-partners","Business Partners","Our business partners can find guides and resources involving HDB flats, properties, or land."],
  ["/business-partners/building-professionals-bgbiz","Building Professionals (BGBiz)","BGBiz offers resources for contractors and consultants working on HDB's building projects."],
  ["/business-partners/building-professionals-bgbiz/application-forms","Application Forms for Building Professionals","Apply for access to HDB business portals, as an HDB contractor or consultant."],
  ["/business-partners/building-professionals-bgbiz/renovation-and-aa-works","Renovation and Addition & Alteration (A&A) Works","Find out the guidelines for HDB renovation and addition and alteration works."],
  ["/business-partners/building-professionals-bgbiz/renovation-and-aa-works/documents-and-checklists","Documents and Checklists for Renovation and A&A Works","Download submission forms for renovation and addition and alteration work requests."],
  ["/business-partners/building-professionals-bgbiz/renovation-and-aa-works/frequently-asked-questions","Frequently Asked Questions on Renovation and A&A Works","Read frequently asked questions on design considerations when undertaking structural works on HDB properties. Contact us for further enquiries."],
  ["/business-partners/building-professionals-bgbiz/renovation-and-aa-works/guidelines-for-commercial-property","Guidelines for Renovation and A&A Works on Commercial Property","Find out the renovation guidelines for HDB commercial properties and how you can submit an application."],
  ["/business-partners/building-professionals-bgbiz/renovation-and-aa-works/guidelines-for-residential-property","Guidelines for Renovation and A&A Works on Residential Property","Find out the renovation guidelines for HDB residential properties and how you can submit an application."],
  ["/business-partners/building-professionals-bgbiz/submitting-building-plans","Submitting Building Plans","Get information on submitting building plans to HDB, including the requirements and process, for building professionals."],
  ["/business-partners/building-professionals-bgbiz/submitting-building-plans/documents-and-checklists","Documents and Checklists for Building Plan Submissions","Building professionals can download the forms and submission guidelines for building plans and make submissions through the CORENET e-Submission System."],
  ["/business-partners/building-professionals-bgbiz/submitting-building-plans/guidelines","Guidelines for Building Plan Submissions","Reference these guidelines when preparing your building plan submission."],
  ["/business-partners/building-professionals-bgbiz/submitting-building-plans/submission-process","Submission Process for Building Plans","Learn about the various stages and channels for the submission of building plans to HDB, for building professionals."],
  ["/business-partners/building-professionals-bgbiz/submitting-building-plans/terms-and-conditions-for-structural-works","Terms and Conditions for Structural Works","Learn the requirements that you will need to fulfil when conducting HDB structural works."],
  ["/business-partners/building-professionals-bgbiz/updates-for-works-involving-hdb-property","Updates for Works Involving HDB Property","Read our latest requirements for works involving HDB property."],
  ["/business-partners/estate-agents-and-salespersons","Estate Agents and Salespersons","Get the latest information on HDB policies and processes for estate agents and salespersons."],
  ["/business-partners/estate-agents-and-salespersons/guide-for-estate-agents-buying-a-flat","Guide for Estate Agents: Buying a Flat","Find out how you can support buyers who wish to buy a resale flat, as an estate agent or salesperson."],
  ["/business-partners/estate-agents-and-salespersons/guide-for-estate-agents-buying-a-flat/eligibility","Eligibility for Buying a Resale Flat","Find out how to support buyers in checking their eligibility to buy a resale flat, as an estate agent or a salesperson."],
  ["/business-partners/estate-agents-and-salespersons/guide-for-estate-agents-buying-a-flat/financial-guide","Financial Guide to Buying a Resale Flat","Find out how to support buyers in planning their finances for buying a flat, as an estate agent or salesperson."],
  ["/business-partners/estate-agents-and-salespersons/guide-for-estate-agents-buying-a-flat/getting-started","Getting Started in Buying a Resale Flat","Learn the process to buy a resale flat, so you can support buyers as an estate agent or salesperson."],
  ["/business-partners/estate-agents-and-salespersons/guide-for-estate-agents-buying-a-flat/process","Process for Buying a Resale Flat","Understand the process for buying a resale flat, so you can support buyers as an estate agent or salesperson."],
  ["/business-partners/estate-agents-and-salespersons/guide-for-estate-agents-renting-a-flat","Guide for Estate Agents: Renting a Flat","Learn important information on renting an HDB flat, so you can better advise tenants as an estate agent or salesperson."],
  ["/business-partners/estate-agents-and-salespersons/guide-for-estate-agents-renting-a-flat/eligibility","Eligibility for Renting a Flat","Know the eligibility conditions and guidelines for renting an HDB flat, so you can better advise tenants as an estate agent or salesperson."],
  ["/business-partners/estate-agents-and-salespersons/guide-for-estate-agents-renting-a-flat/regulations","Regulations for Renting a Flat","Know HDB's regulations for flat rentals, as a responsible estate agent or salesperson."],
  ["/business-partners/estate-agents-and-salespersons/guide-for-estate-agents-renting-a-flat/related-matters","Matters Relating to Renting a Flat","Advise your clients about matters on renting an HDB flat, such as the tenancy agreement, rental payments, and managing disputes between tenants and flat owners."],
  ["/business-partners/estate-agents-and-salespersons/guide-for-estate-agents-renting-a-flat/rental-statistics","Rental Statistics","Salespersons can use these rental statistics to advise tenants on rental rates in various locations."],
  ["/business-partners/estate-agents-and-salespersons/guide-for-estate-agents-renting-out-a-flat-or-bedrooms","Guide for Estate Agents: Renting Out a Flat or Bedrooms","Learn important information on renting out an HDB flat or spare bedroom, so you can advise your clients as an estate agent or salesperson."],
  ["/business-partners/estate-agents-and-salespersons/guide-for-estate-agents-renting-out-a-flat-or-bedrooms/application-process","Application Process for Renting Out a Flat or Bedrooms","Flat owners must seek approval to rent out their HDB flat or bedroom. Know the process and fees, to advise your clients as an estate agent or salesperson."],
  ["/business-partners/estate-agents-and-salespersons/guide-for-estate-agents-renting-out-a-flat-or-bedrooms/eligibility","Eligibility for Renting Out a Flat or Bedrooms","Know the eligibility conditions and guidelines for renting out an HDB flat or spare bedroom, so you can advise your clients as an estate agent or salesperson."],
  ["/business-partners/estate-agents-and-salespersons/guide-for-estate-agents-renting-out-a-flat-or-bedrooms/regulations","Regulations for Renting Out a Flat or Bedrooms","Know the regulations for renting out an HDB flat or bedroom, so you can advise your clients as an estate agent or salesperson."],
  ["/business-partners/estate-agents-and-salespersons/guide-for-estate-agents-renting-out-a-flat-or-bedrooms/rental-statistics","Rental Statistics","Salespersons can use these rental statistics to advise flat owners on rental rates in various locations."],
  ["/business-partners/estate-agents-and-salespersons/guide-for-estate-agents-selling-a-flat","Guide for Estate Agents: Selling a Flat","Learn to manage a resale transaction for flat sellers, and get relevant information and documents."],
  ["/business-partners/estate-agents-and-salespersons/guide-for-estate-agents-selling-a-flat/eligibility","Eligibility for Selling a Flat","Before the sellers can sell their flat, they have to make sure they are eligibile to do so."],
  ["/business-partners/estate-agents-and-salespersons/guide-for-estate-agents-selling-a-flat/financial-guide","Financial Guide to Selling a Flat","The seller should work out their finances using the estimated sale proceeds, and consider the outstanding payments involved."],
  ["/business-partners/estate-agents-and-salespersons/guide-for-estate-agents-selling-a-flat/getting-started","Getting Started in Selling a Flat","Find out how you can assist the sellers with their flat selling journey."],
  ["/business-partners/estate-agents-and-salespersons/guide-for-estate-agents-selling-a-flat/process","Process for Selling a Flat","Learn about the selling process for an HDB flat, as an estate agent or salesperson."],
  ["/business-partners/estate-agents-and-salespersons/letters-to-keos","Letters to KEOs","Read letters sent to Key Executive Officers (KEOs) on HDB policies, regulations, and processes."],
  ["/business-partners/estate-agents-and-salespersons/letters-to-keos/extension-of-temporary-relaxation-of-occupancy-cap-for-rental-of-hdb-flats","Extension of Temporary Relaxation of Occupancy Cap for Rental of HDB Flats and Private Residential Properties","The Housing & Development Board (HDB) and the Urban Redevelopment Authority (URA) announced on 16 January 2026 that the temporary relaxation in the occupancy cap for the rental of larger HDB flats and private residential properties will be extended for another"],
  ["/business-partners/estate-agents-and-salespersons/letters-to-keos/fulfilling-the-minimum-occupation-period-to-acquire-private-residential-property","Fulfilling the Minimum Occupation Period to Acquire Private Residential Property","HDB flats are meant for owner-occupation. Flat owners, spouses and essential occupiers have to fulfil a 5-year minimum occupation period (MOP) before they can acquire a private residential property. However, some flat owners have attempted to circumvent the po"],
  ["/business-partners/estate-agents-and-salespersons/letters-to-keos/implementation-of-hdb-flat-eligibility-hfe-letter","Implementation of HDB Flat Eligibility (HFE) Letter","Today, HDB implemented the new HDB Flat Eligibility (HFE) letter, to provide flat buyers with a holistic understanding and assessment of their housing and financing options before they commence their home buying journey. The HFE letter, which will replace the "],
  ["/business-partners/estate-agents-and-salespersons/letters-to-keos/increased-cpf-housing-grant-for-resale-flat-buyers","Increased CPF Housing Grant for resale flat buyers","Increased CPF Housing Grant for resale flat buyers."],
  ["/business-partners/estate-agents-and-salespersons/letters-to-keos/launch-of-hdb-flat-portal","Launch of HDB Flat Portal","Today, Minister for National Development, Mr Desmond Lee, announced the launch of the HDB Flat Portal. This was the culmination of a series of engagement sessions where we sought feedback from many industry players and stakeholders on how we could make it more"],
  ["/business-partners/estate-agents-and-salespersons/letters-to-keos/measures-to-cool-the-hdb-resale-market-and-provide-greater-support-for-first-time-home-buyers","Measures to Cool the HDB Resale Market and Provide Greater Support for First-time Home Buyers","As you may have heard, Prime Minister Mr Lawrence Wong announced at the National Day Rally 2024 on 18 Aug 2024 that the Government will increase the Enhanced CPF Housing Grant (EHG) for the purchase of new and resale HDB flats. This will provide greater suppor"],
  ["/business-partners/estate-agents-and-salespersons/letters-to-keos/measures-to-cool-the-property-market","Measures to Cool the Property Market","On 15 Dec 2021, the Government announced a package of measures to cool the private residential and HDB resale markets, to promote continued housing affordability and encourage greater financial prudence. For measure specific to public housing, the Government w"],
  ["/business-partners/estate-agents-and-salespersons/letters-to-keos/measures-to-promote-sustainable-conditions-in-the-property-market","Measures to Promote Sustainable Conditions in the Property Market","As you may be aware, HDB, MND and MAS announced on 29 Sep 2022 a package of measures to promote sustainable conditions in the property market by ensuring prudent borrowing and moderating demand."],
  ["/business-partners/estate-agents-and-salespersons/letters-to-keos/new-hdb-flat-eligibility-hfe-letter","New HDB Flat Eligibility (HFE) Letter","Today, HDB announced the introduction of a new HDB Flat Eligibility (HFE) letter from 9 May 2023, to provide flat buyers with a holistic understanding and assessment of their housing and financing options before they commence their home buying journey. The HFE"],
  ["/business-partners/estate-agents-and-salespersons/letters-to-keos/official-launch-of-hdb-resale-flat-listing-service-on-30-may-2024","Official Launch of HDB Resale Flat Listing Service on 30 May 2024","We are pleased to announce that the Resale Flat Listing (RFL) service has been officially launched on the HDB Flat Portal. On 12 May 2024, HDB announced the RFL service, which seeks to create a transparent, reliable and trusted marketplace for the listing and "],
  ["/business-partners/estate-agents-and-salespersons/letters-to-keos/requests-to-amend-details-in-hdb-flat-eligibility-letters","Requests to amend details in HDB Flat Eligibility (HFE) letters","As you may be aware, following the introduction of the HDB Flat Eligibility (HFE) letter on 9 May 2023, all flat buyers must have a valid HFE letter when they: a) Apply for a flat from HDB during a sales launch or open booking of flats; or b) Obtain an Option "],
  ["/business-partners/estate-agents-and-salespersons/letters-to-keos/resources-for-salespersons","Resources for Salespersons","To facilitate salespersons in assisting their clients on housing plans, HDB has been providing KEOs with regular updates on HDB’s regulations, policies and procedures. In addition, the Estate Agents & Salespersons page found under “Business” on the HDB InfoWEB"],
  ["/business-partners/estate-agents-and-salespersons/letters-to-keos/salespersons-applications-for-hdb-flat-eligibility-letter","Salespersons’ Applications for HDB Flat Eligibility Letter","Thank you for your strong support for the Resale Flat Listing (RFL) service at both the soft and official launches. We wish to share that since the soft launch of the RFL service on 13 May 2024, we have noticed an increase in the number of salespersons applyin"],
  ["/business-partners/estate-agents-and-salespersons/letters-to-keos/soft-launch-of-hdb-resale-flat-listing-service-on-13-may-2024","Soft Launch of HDB Resale Flat Listing Service on 13 May 2024","We would like to share with you the latest initiative on the HDB Flat Portal. On 12 May 2024, HDB announced a new Resale Flat Listing (RFL) service which seeks to create a transparent, reliable and trusted marketplace for the listing and transactions of HDB re"],
  ["/business-partners/estate-agents-and-salespersons/letters-to-keos/suspension-of-hfe-letter-application-e-service-during-the-application-period","Suspension of HFE Letter Application e-Service During the Application Period of Build-To-Order and Sale of Balance Flats Exercises","As you may already be aware, HDB will offer about 5,400 Build-To-Order (BTO) flats in Bukit Merah, Bukit Panjang, Clementi, Sembawang, Tampines, Toa Payoh, and Woodlands in July 2025. About 3,000 flats across various towns/estates will also be offered through "],
  ["/business-partners/estate-agents-and-salespersons/letters-to-keos/temporary-relaxation-of-occupancy-cap-for-rental-of-hdb-flats-and-private-residential-properties","Temporary Relaxation of Occupancy Cap for Rental of HDB Flats and Private Residential Properties","With effect from 22 January 2024, the occupancy cap for the following types of residential properties will be temporarily relaxed from six unrelated persons to eight unrelated persons. a) 4-Room and larger HDB flats b) Living quarters of HDB commercial propert"],
  ["/business-partners/estate-agents-and-salespersons/letters-to-keos/transition-to-non-toll-free-numbers-for-hdb-managed-hotlines","Transition to Non-Toll-Free Numbers for HDB-managed Hotlines and Revised HDB Counter and Hotline Operating Hours on Eve of Major Public Holidays","As part of our telephony system upgrade, HDB is transiting from toll-free numbers (TFN) to non-toll-free numbers for the following hotlines managed by HDB, on 17 November 2025."],
  ["/business-partners/estate-agents-and-salespersons/resources-for-estate-agents-and-salespersons","Resources for Estate Agents and Salespersons","Access various services and resources that you may need for your HDB transactions, as an estate agent or salesperson."],
  ["/business-partners/land-developers-and-land-users","Land Developers and Land Users","Find all the information you need on buying and renting land. Access tender details, important information and services."],
  ["/business-partners/land-developers-and-land-users/buying-land-land-sales","Buying Land (Land Sales)","As the land sales agent, HDB puts up land parcels for tender for residential, commercial, mixed commercial and residential, and ancillary development."],
  ["/business-partners/land-developers-and-land-users/buying-land-land-sales/government-land-sales","Government Land Sales","Developers can find out about upcoming sale sites and the projected tender dates for sites where HDB is the land sales agent."],
  ["/business-partners/land-developers-and-land-users/buying-land-land-sales/government-land-sales/reserve-list","Reserve List","Find out the land sites that are reserved under the Government Land Sales (GLS) programme."],
  ["/business-partners/land-developers-and-land-users/buying-land-land-sales/land-for-tender","Land for Tender","Find out the land sites that are currently open for tender."],
  ["/business-partners/land-developers-and-land-users/buying-land-land-sales/land-for-tender/ancillary-development-sites","Ancillary Development Sites Open for Tender","View the ancillary development sites currently open for tender. Get more details about the land parcels and tender documents."],
  ["/business-partners/land-developers-and-land-users/buying-land-land-sales/land-for-tender/commercial-development-sites","Commercial Development Sites Open for Tender","View the commercial development sites currently open for tender. Get more details about the land parcels and tender documents."],
  ["/business-partners/land-developers-and-land-users/buying-land-land-sales/land-for-tender/mixed-commercial-and-residential-development-sites","Mixed Commercial and Residential Development Sites Open for Tender","View the mixed commercial and residential development sites currently open for tender. Get details about the land parcels and tender documents."],
  ["/business-partners/land-developers-and-land-users/buying-land-land-sales/land-for-tender/residential-development-sites","Residential Development Sites Open for Tender","View the residential development sites currently open for tender. Get more details about the land parcels and tender documents."],
  ["/business-partners/land-developers-and-land-users/buying-land-land-sales/land-tender-results","Land Tender Results","Check the tender results for HDB's recent land sale tenders."],
  ["/business-partners/land-developers-and-land-users/buying-land-land-sales/process-for-reserve-list-system","Process for Reserve List System","Find out how to submit an application for a site on the Reserve List, as a developer."],
  ["/business-partners/land-developers-and-land-users/buying-land-land-sales/process-for-reserve-list-system/frequently-asked-questions","Frequently Asked Questions on Applications for Reserve List Sites","Read frequently asked questions about applications for Reserve List sites."],
  ["/business-partners/land-developers-and-land-users/buying-land-land-sales/sites-sold-by-hdb","Sites Sold by HDB","Land developers can find tender and development information on sites sold by HDB."],
  ["/business-partners/land-developers-and-land-users/renting-land-on-temporary-occupation-licence-tol","Renting Land on Temporary Occupation Licence (TOL)","Vacant land in HDB estates that is not required for immediate development can be let out for short-term use on a Temporary Occupation Licence (TOL)."],
  ["/business-partners/renovation-contractors","Renovation Contractors","Check relevant information and guidelines for works performed in HDB flats, as a renovation contractor."],
  ["/business-partners/renovation-contractors/directory-of-renovation-contractors-drc","Directory of Renovation Contractors (DRC)","Contractors must be listed in the DRC before they can carry out renovations in HDB flats. A demerit point system allows RCs to self-regulate."],
  ["/business-partners/renovation-contractors/directory-of-renovation-contractors-drc/application-process","Application Process for Directory of Renovation Contractors (DRC)","Learn the criteria and documents needed to be listed in the Directory of Renovation Contractors (DRC)."],
  ["/business-partners/renovation-contractors/directory-of-renovation-contractors-drc/renewal-process","Renewal Process for Directory of Renovation Contractors (DRC)","View the steps for contractors to renew their Directory of Renovation Contractors (DRC) application with HDB. Renew your application 3 months prior to expiry."],
  ["/business-partners/renovation-contractors/important-information-on-renovation","Important Information on Renovation","Note the important information for contractors when working on HDB flats. You will need to observe these guidelines during the renovation works."],
  ["/business-partners/renovation-contractors/training-courses","Training Courses for HDB Renovation Contractors","Contractors listed in the DRC are encouraged to attend our training courses to be more professional and knowledgeable."],
  ["/business-partners/renovation-contractors/windows-installation-and-replacement","Windows Installation and Replacement","For HDB window works, the contractor must be a BCA approved window contractor listed with HDB. Learn how to apply."],
  ["/business-partners/tenderers","Tenderers","Access guidelines, notices and other useful information about our tenders."],
  ["/business-partners/tenderers/hdb-tender-opportunities","HDB Tender Opportunities","Find more information about the tender process and HDB's tender opportunities."],
  ["/business-partners/tenderers/hdb-tender-opportunities/eligibility-to-participate-in-open-tenders","Eligibility to Participate in Open Tenders","Find out if you are eligible to participate in HDB's open tenders."],
  ["/business-partners/tenderers/hdb-tender-opportunities/tender-clarifications","Tender Clarifications","Find out who to contact if tender clarifications are needed."],
  ["/buy-floor-plan-of-hdb-flat/get-help","Get Help",""],
  ["/buy-floor-plan-of-hdb-flat/terms-and-conditions","Terms and Conditions",""],
  ["/buying-a-flat","Buying a Flat","Learn about the eligibility conditions for buying a flat and your financing options, and be guided on your flat buying journey."],
  ["/buying-a-flat/bto-sbf-and-open-booking-of-flats","BTO, SBF, and Open Booking of Flats","Learn about buying an HDB flat through Build-To-Order (BTO) and Sale of Balance Flats (SBF) exercises or open booking of flats."],
  ["/buying-a-flat/bto-sbf-and-open-booking-of-flats/conditions-after-buying-a-new-flat","Conditions After Buying a New Flat","Learn about the conditions that flat owners and occupiers have to follow after buying their new flat."],
  ["/buying-a-flat/bto-sbf-and-open-booking-of-flats/finding-a-new-flat","Finding a New Flat","Find out about the types of HDB flats available for sale and the design features of new flats."],
  ["/buying-a-flat/bto-sbf-and-open-booking-of-flats/finding-a-new-flat/design-features","Design Features for New Flats","Discover the design features of new flats, including Universal Design elements for precinct, block, and home."],
  ["/buying-a-flat/bto-sbf-and-open-booking-of-flats/finding-a-new-flat/standard-plus-and-prime-housing-framework","Standard, Plus, and Prime Housing Framework","Learn about the key features of Standard, Plus, and Prime flats under the location-based classification framework."],
  ["/buying-a-flat/bto-sbf-and-open-booking-of-flats/finding-a-new-flat/types-of-flats","Types of Flats","Explore a wide variety of flat types that cater to different household sizes and needs."],
  ["/buying-a-flat/bto-sbf-and-open-booking-of-flats/finding-a-new-flat/types-of-flats/community-care-apartments","Community Care Apartments","Learn about Community Care Apartments, an assisted living concept providing care services for seniors, including the eligibility conditions and buying process."],
  ["/buying-a-flat/bto-sbf-and-open-booking-of-flats/finding-a-new-flat/types-of-flats/shortlease-2room-flexi-flat","Short-Lease 2-Room Flexi Flat","Explore short-lease 2-room Flexi flats for seniors, including the eligibility conditions and buying process."],
  ["/buying-a-flat/bto-sbf-and-open-booking-of-flats/process-for-buying-a-new-flat","Process for Buying a New Flat","Find out the process for buying a flat from HDB and begin your home buying journey."],
  ["/buying-a-flat/bto-sbf-and-open-booking-of-flats/process-for-buying-a-new-flat/application","Application for a New Flat","Learn about applying for a new flat, the priority schemes available and Fresh Start Housing Scheme."],
  ["/buying-a-flat/bto-sbf-and-open-booking-of-flats/process-for-buying-a-new-flat/application/frequently-asked-questions-on-sales-exercises","Frequently Asked Questions on Sales Exercises","Read the frequently asked questions on sales exercises."],
  ["/buying-a-flat/bto-sbf-and-open-booking-of-flats/process-for-buying-a-new-flat/application/fresh-start-housing-scheme","Fresh Start Housing Scheme","Learn about the Fresh Start Housing Scheme that helps families with young children living in public rental flats, to own their next home."],
  ["/buying-a-flat/bto-sbf-and-open-booking-of-flats/process-for-buying-a-new-flat/application/priority-schemes","Priority Schemes","Learn about the priority schemes that enhance your chances in securing a flat."],
  ["/buying-a-flat/bto-sbf-and-open-booking-of-flats/process-for-buying-a-new-flat/booking-of-flat","Booking of Flat","Learn about the flat booking process, including required documents, deferred income assessment, and Optional Component Scheme, for your new home."],
  ["/buying-a-flat/bto-sbf-and-open-booking-of-flats/process-for-buying-a-new-flat/key-collection","Key Collection","Find out the required payments at your key collection appointment and the financing schemes available to ease your flat payment."],
  ["/buying-a-flat/bto-sbf-and-open-booking-of-flats/process-for-buying-a-new-flat/modes-of-sales","Modes of Sale","Find out more details about Build-To-Order (BTO) and Sale of Balance Flats (SBF) exercises, and open booking of flats."],
  ["/buying-a-flat/bto-sbf-and-open-booking-of-flats/process-for-buying-a-new-flat/overview","Overview of New Flat Buying Process","Learn about the timeline and milestones of buying a new flat, from application to key collection."],
  ["/buying-a-flat/bto-sbf-and-open-booking-of-flats/process-for-buying-a-new-flat/overview/plan-finances","Plan Finances for a New Flat","Learn how to plan your finances and budget for your flat purchase using cash and CPF savings, housing loans, and CPF grants."],
  ["/buying-a-flat/bto-sbf-and-open-booking-of-flats/process-for-buying-a-new-flat/sign-agreement-for-lease","Sign Agreement for Lease","Find out what you need to prepare ahead of your appointment to sign the Agreement for Lease for your new flat."],
  ["/buying-a-flat/executive-condominiums","Executive Condominiums","Find out more about buying an Executive Condominium (EC) from a property developer."],
  ["/buying-a-flat/executive-condominiums/conditions-after-buying-an-ec","Conditions After Buying an Executive Condominium","Learn about the conditions that apply after buying an Executive Condominium (EC) from a property developer."],
  ["/buying-a-flat/executive-condominiums/cpf-housing-grant","CPF Housing Grant for an Executive Condominium","Learn about the eligiblity conditions for the CPF Housing Grant for buying an Executive Condominium (EC) from property developers."],
  ["/buying-a-flat/executive-condominiums/eligibility","Eligibility for Buying an Executive Condominium","Learn about the eligibility conditions to buy an Executive Condominium (EC) from property developers."],
  ["/buying-a-flat/executive-condominiums/finding-an-ec","Finding an Executive Condominium","Check out the list of Executive Condominium (EC) projects and information on buying an Executive Condominium on the open market."],
  ["/buying-a-flat/executive-condominiums/process-for-buying-an-ec","Process for Buying an Executive Condominium","Read about the process and steps of buying an Executive Condominium (EC) from a property developer."],
  ["/buying-a-flat/financial-planning-for-a-flat-purchase","Financial Planning for a Flat Purchase","Plan your finances and budget for a flat purchase with our ABCs of financial planning. and financial tools."],
  ["/buying-a-flat/financial-planning-for-a-flat-purchase/ability-to-pay","Ability to Pay","Check your ability to finance a flat to minimise your housing loan amount and the repayment period."],
  ["/buying-a-flat/financial-planning-for-a-flat-purchase/budget-for-a-flat","Budget for a Flat","Understand the payments required and use our financial tools to work out your budget for your flat purchase."],
  ["/buying-a-flat/financial-planning-for-a-flat-purchase/credit-to-finance-a-flat-purchase","Credit to Finance a Flat Purchase","Secure a housing loan before committing to a flat purchase, if you require financing."],
  ["/buying-a-flat/flat-grant-and-loan-eligibility","Flat, Grant, and Loan Eligibility","Learn about the eligibility conditions to buy an HDB flat, for CPF housing grants, and for housing loans."],
  ["/buying-a-flat/flat-grant-and-loan-eligibility/application-for-an-hdb-flat-eligibility-hfe-letter","Application for an HDB Flat Eligibility (HFE) Letter","Learn about the HDB Flat Eligibility (HFE) letter, the application process, and applying for a housing loan from financial institutions."],
  ["/buying-a-flat/flat-grant-and-loan-eligibility/application-for-an-hdb-flat-eligibility-hfe-letter/income-guidelines-and-documents","Income Guidelines and Documents for HFE Letter Application","Get a headstart on your HFE letter application by understanding the guidelines for income assessment and documents."],
  ["/buying-a-flat/flat-grant-and-loan-eligibility/couples-and-families","Couples and Families","Learn about buying a flat with your fiancée/ spouse or family members, as a Singapore Citizen or Singapore Permanent Resident."],
  ["/buying-a-flat/flat-grant-and-loan-eligibility/couples-and-families/cpf-housing-grants","CPF Housing Grants for Families Buying Resale Flats","Find out the eligibility conditions to apply for CPF Housing Grants, for couples and families buying a resale flat."],
  ["/buying-a-flat/flat-grant-and-loan-eligibility/couples-and-families/enhanced-cpf-housing-grant","Enhanced CPF Housing Grant for Families","Find out the eligibility conditions to apply for the Enhanced CPF Housing Grant, for couples and families buying a new or resale flat."],
  ["/buying-a-flat/flat-grant-and-loan-eligibility/couples-and-families/proximity-housing-grant","Proximity Housing Grant for Families Buying Resale Flats","Find out the eligibility conditions to apply for the Proximity Housing Grant, for couples and families buying a resale flat."],
  ["/buying-a-flat/flat-grant-and-loan-eligibility/couples-and-families/stepup-cpf-housing-grant","Step-Up CPF Housing Grant for Families","Find out the eligibility conditions to apply for the Step-Up CPF Housing Grant, for couples and families buying a new or resale flat."],
  ["/buying-a-flat/flat-grant-and-loan-eligibility/housing-loan","Housing Loan","Understand the differences between taking a housing loan from HDB and financial institutions."],
  ["/buying-a-flat/flat-grant-and-loan-eligibility/housing-loan/housing-loan-from-financial-institutions","Housing Loan from Financial Institutions","Find out key information on taking a housing loan from financial institutions, along with the different conditions and benefits."],
  ["/buying-a-flat/flat-grant-and-loan-eligibility/housing-loan/housing-loan-from-hdb","Housing Loan from HDB","Learn about the eligibility conditions and important information on the HDB housing loan."],
  ["/buying-a-flat/flat-grant-and-loan-eligibility/seniors","Seniors","Learn about buying a flat as a Singapore Citizen aged 55 and above."],
  ["/buying-a-flat/flat-grant-and-loan-eligibility/singles","Singles","Learn about buying a flat alone or with another single, as Singapore Citizens aged 35 and above."],
  ["/buying-a-flat/flat-grant-and-loan-eligibility/singles/cpf-housing-grant","CPF Housing Grant for Singles Buying Resale Flats","Learn about the eligibility conditions for the CPF Housing Grant, for singles buying a resale flat."],
  ["/buying-a-flat/flat-grant-and-loan-eligibility/singles/enhanced-cpf-housing-grant","Enhanced CPF Housing Grant for Singles","Learn about the eligibility conditions to apply for the Enhanced CPF Housing Grant, for singles buying a new or resale flat."],
  ["/buying-a-flat/flat-grant-and-loan-eligibility/singles/proximity-housing-grant","Proximity Housing Grant for Singles Buying Resale Flats","Find out the eligibility conditions for the Proximity Housing Grant, for singles buying a resale flat."],
  ["/buying-a-flat/resale-flats","Resale Flats","Learn about buying an HDB resale flat, including the process and conditions after buying."],
  ["/buying-a-flat/resale-flats/conditions-after-buying-a-resale-flat","Conditions After Buying a Resale Flat","Learn about the conditions that flat owners and occupiers have to follow after buying their resale flat."],
  ["/buying-a-flat/resale-flats/finding-a-resale-flat","Finding a Resale Flat","Find available resale flats for sale on the HDB Flat Portal."],
  ["/buying-a-flat/resale-flats/process-for-buying-a-resale-flat","Process for Buying a Resale Flat","Learn more about the process for buying a resale flat, to ensure a smooth buying journey."],
  ["/buying-a-flat/resale-flats/process-for-buying-a-resale-flat/option-to-purchase","Option to Purchase When Buying a Resale Flat","Learn about the timeline and process to enter into an Option to Purchase (OTP) with flat sellers."],
  ["/buying-a-flat/resale-flats/process-for-buying-a-resale-flat/option-to-purchase/request-for-value","Request for Value for a Resale Flat","Learn about submitting a Request for Value when buying a resale flat."],
  ["/buying-a-flat/resale-flats/process-for-buying-a-resale-flat/overview","Overview of Resale Flat Buying Process","Get an overview of the resale flat buying process."],
  ["/buying-a-flat/resale-flats/process-for-buying-a-resale-flat/resale-flat-application","Resale Flat Application for Buyers","Learn about submitting a resale application, the Enhanced Contra Facility, and what to expect after the submission."],
  ["/buying-a-flat/resale-flats/process-for-buying-a-resale-flat/resale-flat-application/application-process","Application Process for a Resale Flat Purchase","Learn about the details and documents required when buyers submit a resale application."],
  ["/buying-a-flat/resale-flats/process-for-buying-a-resale-flat/resale-flat-application/approval-of-application","Approval of Resale Flat Application for Buyers","Find out the steps that buyers need to take before the resale application is approved."],
  ["/buying-a-flat/resale-flats/process-for-buying-a-resale-flat/resale-flat-application/request-for-enhanced-contra-facility","Request for Enhanced Contra Facility","Read about the Enhanced Contra Facility, including application details and the terms and conditions."],
  ["/buying-a-flat/resale-flats/process-for-buying-a-resale-flat/resale-flat-completion","Resale Flat Completion for Buyers","Learn about what you need to do before and during the resale completion appointment."],
  ["/buying-a-flat/resale-flats/process-for-buying-a-resale-flat/resale-flat-planning","Resale Flat Planning for Buyers","Learn the steps involved in buying a resale flat, including the HDB Flat Eligibility (HFE) letter, mode of financing, Option to Purchase, and Request for Value."],
  ["/buying-a-flat/resale-flats/process-for-buying-a-resale-flat/resale-flat-planning/eip-and-spr-quota","Ethnic Integration Policy (EIP) and Singapore Permanent Resident Quota","Learn about the Ethnic Integration Policy (EIP) and Singapore Permanent Resident (SPR) Quota when buying a resale flat."],
  ["/buying-a-flat/resale-flats/process-for-buying-a-resale-flat/resale-flat-planning/managing-the-flat-purchase","Managing the Resale Flat Purchase","Find out how you can buy a resale flat on your own or with a salesperson."],
  ["/buying-a-flat/resale-flats/process-for-buying-a-resale-flat/resale-flat-planning/mode-of-financing","Mode of Financing for a Resale Flat","Learn the financial considerations for buying a resale flat, and use our planning tools and resources."],
  ["/buying-a-flat/resale-flats/process-for-buying-a-resale-flat/resale-flat-planning/overview","Overview of Resale Flat Planning for Buyers","Find out what you need to do when planning to buy a resale flat, such as applying for an HFE letter, planning your finances, and checking the EIP and SPR quota."],
  ["/buying-a-flat/resale-flats/process-for-buying-a-resale-flat/resale-flat-planning/resale-seminars","Resale Seminars","See upcoming seminars on the process of buying and selling a resale flat."],
  ["/cancel-auto-renewal-of-season-parking-by-credit-card/get-help","Get Help",""],
  ["/cancel-auto-renewal-of-season-parking-by-credit-card/terms-and-conditions","Terms and Conditions",""],
  ["/cancel-auto-renewal-of-season-parking-by-giro/get-help","Get Help",""],
  ["/cancel-auto-renewal-of-season-parking-by-giro/terms-and-conditions","Terms And Conditions",""],
  ["/cancel-transfer-of-temporary-season-parking/get-help","Get Help",""],
  ["/cancel-transfer-of-temporary-season-parking/terms-and-conditions","Terms and Conditions",""],
  ["/change-giro-deduction-amount-for-housing-loan-or-upgrading-cost/get-help","",""],
  ["/change-mailing-address/get-help","Get Help",""],
  ["/change-mailing-address/terms-and-conditions","Terms and Conditions",""],
  ["/change-motorcycle-season-parking-scheme/get-help","Get Help",""],
  ["/change-motorcycle-season-parking-scheme/terms-and-conditions","Terms and Conditions",""],
  ["/change-of-company-name/get-help","Get Help",""],
  ["/change-of-company-name/terms-and-conditions","Terms and Conditions",""],
  ["/change-rental-flat-under-public-rental-scheme/get-help","Get Help",""],
  ["/change-rental-flat-under-public-rental-scheme/terms-and-conditions","Terms and Conditions",""],
  ["/change-tenant-under-public-rental-scheme/get-help","Get Help",""],
  ["/change-tenant-under-public-rental-scheme/terms-and-conditions","Terms and Conditions",""],
  ["/change-vehicle-iu-obu-number-for-season-parking/get-help","Get Help",""],
  ["/change-vehicle-iu-obu-number-for-season-parking/terms-and-conditions","Terms and Conditions",""],
  ["/check-authorised-tenants-of-flat/get-help","Get Help",""],
  ["/check-distance-for-proximity-housing-grant/get-help","Get Help",""],
  ["/check-distance-for-proximity-housing-grant/terms-and-conditions","Terms and Conditions",""],
  ["/check-eligibility-for-hdb-housing-loan-under-sers-acquisition-exercise/get-help","Get Help",""],
  ["/check-ethnic-integration-policy-or-singapore-permanent-resident-quota/get-help","Get Help",""],
  ["/check-ethnic-integration-policy-or-singapore-permanent-resident-quota/terms-and-conditions","Terms and Conditions",""],
  ["/check-housing-monetisation-options/get-help","Get Help",""],
  ["/check-market-rental-rates/get-help","Get Help",""],
  ["/check-noncitizen-quota-for-flat-rental/get-help","Get Help",""],
  ["/check-rental-records/get-help","Get Help",""],
  ["/check-resale-flat-prices/get-help","Get Help",""],
  ["/check-resale-flat-prices/terms-and-conditions","Terms and Conditions",""],
  ["/convert-inprinciple-approval-to-letter-of-offer-for-resale-flat-purchase/get-help","Get Help",""],
  ["/e-appointment-for-hdb-commercial-property-enquiries/get-help","Get Help",""],
  ["/e-calculator-for-standard-charge/get-help","Get Help",""],
  ["/e-calculator-for-standard-charge/terms-and-conditions","Terms and Conditions",""],
  ["/e-resale/browser-setting","Help - Browser Setting",""],
  ["/e-resale/buyers-declaration","Terms and Conditions - Buyers Declaration",""],
  ["/e-resale/date-obtained-spr","Help - Date Obtained SPR",""],
  ["/e-resale/electronic-payment","Terms and Conditions - Electronic Payment",""],
  ["/e-resale/enhanced-contra-facility","Terms and Conditions - Enhanced Contra Facility",""],
  ["/e-resale/enhanced-contra-facility-declaration","Terms and Conditions - Enhanced Contra Facility Declaration",""],
  ["/e-resale/estate-agent-toolkit","Terms and Conditions - Estate Agent Toolkit",""],
  ["/e-resale/family-grant","Terms and Conditions - Family Grant",""],
  ["/e-resale/family-grant-declaration","Terms and Conditions - Family Grant Declaration",""],
  ["/e-resale/family-grant-near-parent-or-child","Terms and Conditions - Family Grant Near Parent or Child",""],
  ["/e-resale/family-grant-near-parent-or-child-declaration","Terms and Conditions - Family Grant Near Parent Or Child Declaration",""],
  ["/e-resale/faq","FAQ",""],
  ["/e-resale/faq---toolkit","FAQ - Toolkit",""],
  ["/e-resale/get-help","Get Help",""],
  ["/e-resale/how-to-submit-contra-case","Help - How to Submit Contra Case",""],
  ["/e-resale/important-notes","Help - Important Notes",""],
  ["/e-resale/instruction-manual","Help - Instruction Manual",""],
  ["/e-resale/manner-of-holding-hdb-flat","Help - Manner Of Holding HDB Flat",""],
  ["/e-resale/resale-procedures","Help - Resale Procedures",""],
  ["/e-resale/resale-purchase-of-an-hdb-resale-flat","Terms and Conditions - Sale and Purchase of An HDB Resale Flat",""],
  ["/e-resale/sellers-declaration","Terms and Conditions - Sellers Declaration",""],
  ["/e-resale/sellers-status","Help - Sellers Status",""],
  ["/e-resale/singles-grant","Terms and Conditions - Singles Grant",""],
  ["/e-resale/singles-grant-declaration","Terms and Conditions - Singles Grant Declaration",""],
  ["/e-resale/singles-grant-parent","Terms and Conditions - Singles Grant Parent",""],
  ["/e-resale/singles-grant-parent-declaration","Terms and Conditions - Singles Grant Parent Declaration",""],
  ["/e-resale/temporary-extension-of-stay-by-flat","Terms and Conditions - Temporary Extension of Stay by Flat",""],
  ["/e-resale/terms-and-conditions","Terms and Conditions",""],
  ["/e-resale/terms-and-conditions-for-ipa-to-lo","Terms and Conditions for IPA to LO",""],
  ["/e-resale/toolkit-browser-setting","Help - Toolkit Browser Setting",""],
  ["/e-resale/top-up-grant","Terms and Conditions - Top-Up Grant",""],
  ["/e-resale/top-up-grant-family-declaration","Terms and Conditions - Top-Up Grant Family Declaration",""],
  ["/e-resale/top-up-grant-parent-child-declaration","Terms and Conditions - Top-Up Grant Parent Child Declaration",""],
  ["/e-resale/valuation-request","Terms and Conditions - Request for Value",""],
  ["/eapplication-for-notice-of-alteration-noa/get-help","Get Help",""],
  ["/eapplication-for-notice-of-alteration-noa/terms-and-conditions","Terms and Conditions",""],
  ["/ease-permohonan-langsung/membantu","Get Help - Malay",""],
  ["/enquiry-on-rehousing-benefits-for-resale-of-sers-flat/terms-and-conditions","Terms and Conditions",""],
  ["/enquiry-on-renovation-restrictions/terms-and-conditions","Terms and Conditions",""],
  ["/eservice-unavailable/help","Help",""],
  ["/eservices","HDB e-Services","Access housing-related services, fast and easy."],
  ["/furnish-drivers-particulars-for-parking-offence/get-help","Get Help",""],
  ["/gst-refund-2024","GST Refund 2024","Affected households can submit a refund request for the GST charged on administrative fees for renting out flats/ bedrooms and compulsory acquisition of flats."],
  ["/hdb-flat-portal/buying-a-new-flat/get-help","Get Help",""],
  ["/hdb-flat-portal/buying-a-new-flat/get-help/apply-for-sales-launch","Apply for Sales Launch",""],
  ["/hdb-flat-portal/buying-a-new-flat/get-help/attend-flat-booking-appointment","Attend Flat Booking Appointment",""],
  ["/hdb-flat-portal/buying-a-new-flat/get-help/prepare-for-flat-booking","Prepare for Flat Booking",""],
  ["/hdb-flat-portal/buying-a-new-flat/get-help/prepare-to-sign-agreement-for-lease","Prepare to Sign Agreement for Lease",""],
  ["/hdb-flat-portal/buying-a-new-flat/get-help/receive-ballot-results","Receive Ballot Results",""],
  ["/hdb-flat-portal/buying-and-selling-an-hdb-resale-flat/get-help","Get Help",""],
  ["/hdb-flat-portal/buying-and-selling-an-hdb-resale-flat/get-help/buying-a-flat","Buying an HDB Resale Flat",""],
  ["/hdb-flat-portal/buying-and-selling-an-hdb-resale-flat/get-help/buying-a-flat/accept-resale-application","Accept Resale Application",""],
  ["/hdb-flat-portal/buying-and-selling-an-hdb-resale-flat/get-help/buying-a-flat/attend-resale-completion","Attend Resale Completion",""],
  ["/hdb-flat-portal/buying-and-selling-an-hdb-resale-flat/get-help/buying-a-flat/choose-mode-of-financing","Choose Mode of Financing",""],
  ["/hdb-flat-portal/buying-and-selling-an-hdb-resale-flat/get-help/buying-a-flat/convert-in-principle-approval-to-letter-of-offer","Convert In-Principle Approval to Letter of Offer",""],
  ["/hdb-flat-portal/buying-and-selling-an-hdb-resale-flat/get-help/buying-a-flat/endorse-resale-documents","Endorse Resale Documents",""],
  ["/hdb-flat-portal/buying-and-selling-an-hdb-resale-flat/get-help/buying-a-flat/general","General",""],
  ["/hdb-flat-portal/buying-and-selling-an-hdb-resale-flat/get-help/buying-a-flat/get-resale-approval","Get Resale Approval",""],
  ["/hdb-flat-portal/buying-and-selling-an-hdb-resale-flat/get-help/buying-a-flat/make-payment","Make Payment",""],
  ["/hdb-flat-portal/buying-and-selling-an-hdb-resale-flat/get-help/buying-a-flat/request-for-value-of-flat","Request for Value of Flat",""],
  ["/hdb-flat-portal/buying-and-selling-an-hdb-resale-flat/get-help/buying-a-flat/submit-resale-application","Submit Resale Application",""],
  ["/hdb-flat-portal/buying-and-selling-an-hdb-resale-flat/get-help/selling-a-flat","Selling an HDB Resale Flat",""],
  ["/hdb-flat-portal/buying-and-selling-an-hdb-resale-flat/get-help/selling-a-flat/accept-resale-application","Accept Resale Application",""],
  ["/hdb-flat-portal/buying-and-selling-an-hdb-resale-flat/get-help/selling-a-flat/attend-resale-completion","Attend Resale Completion",""],
  ["/hdb-flat-portal/buying-and-selling-an-hdb-resale-flat/get-help/selling-a-flat/endorse-resale-documents","Endorse Resale Documents",""],
  ["/hdb-flat-portal/buying-and-selling-an-hdb-resale-flat/get-help/selling-a-flat/get-resale-approval","Get Resale Approval",""],
  ["/hdb-flat-portal/buying-and-selling-an-hdb-resale-flat/get-help/selling-a-flat/inspect-flat","Inspect Flat",""],
  ["/hdb-flat-portal/buying-and-selling-an-hdb-resale-flat/get-help/selling-a-flat/make-payment","Make Payment",""],
  ["/hdb-flat-portal/buying-and-selling-an-hdb-resale-flat/get-help/selling-a-flat/register-intent-to-sell","Register Intent to Sell",""],
  ["/hdb-flat-portal/buying-and-selling-an-hdb-resale-flat/get-help/selling-a-flat/submit-resale-application","Submit Resale Application",""],
  ["/hdb-flat-portal/get-help","Get Help",""],
  ["/hdb-flat-portal/hfe/get-help","Get Help",""],
  ["/hdb-flat-portal/hfe/get-help/general","General",""],
  ["/hdb-flat-portal/hfe/get-help/hfe-letter-application-process","HFE Letter Application Process",""],
  ["/hdb-flat-portal/hfe/get-help/integrated-housing-loan-application-service","Integrated Loan Application Service",""],
  ["/hdb-flat-portal/hfe/get-help/outcome-of-HFE-letter-application","Outcome of HFE Application",""],
  ["/hdb-flat-portal/hfe/get-help/submission-of-an-hfe-letter-application","Before Submitting an HFE Letter Application",""],
  ["/hdb-map","HDB | HDB Map","Access housing-related services, fast and easy."],
  ["/hdb-map/get-help","Get Help",""],
  ["/hdb-project-management-portal/get-help","Get Help",""],
  ["/hdb-pulse","HDB Pulse","Be informed of our latest happenings with HDB's media releases, publications, and more."],
  ["/hdb-pulse/mynicehome","MyNiceHome","Discover everything you need to know about HDB living."],
  ["/hdb-pulse/news","News","Stay updated on HDB news through our media releases."],
  ["/hdb-pulse/news/2021/2nd-urban-farming","Joint Press Release By SFA And HDB - SFA Launches Tender For The Rental Of 7 HDB MSCP Rooftop Sites For Urban Farming","The Singapore Food Agency (SFA) has launched another seven sites at the rooftops of Housing & Development (HDB) multi-storey carparks (MSCP) for rental by public tender today."],
  ["/hdb-pulse/news/2021/award-of-tender-for-the-rental-of-7-hdb-mscp-rooftop-sites-for-urban-farming","Joint Press Release by SFA and HDB - Award of Tender for the Rental of 7 HDB MSCP Rooftop Sites for Urban Farming","The Singapore Food Agency (SFA) has awarded the tender for seven sites at the rooftops of Housing & Development Board (HDB) multi-storey carparks (MSCP) for urban farming on 23 Sep 2021."],
  ["/hdb-pulse/news/2021/cpf-interest-rates-from-1-january-2022-to-31-march-2022","Joint Press Release by CPFB, HDB and MOH - CPF Interest Rates from 1 January 2022 to 31 March 2022 and Basic Healthcare Sum for 2022","For the first quarter of 2022, CPF members below 55 years old will continue to earn interest rates of up to 3.5% per annum on their Ordinary Account (OA) monies, and up to 5% per annum on their Special and MediSave Account (SMA) monies."],
  ["/hdb-pulse/news/2021/development-plans-for-ulu-pandan-balance-nature-conservation-and-housing-needs","Development Plans for Ulu Pandan Balance Nature Conservation and Housing Needs","Following the public consultation earlier this year, the conceptual development plans for Ulu Pandan have been revised."],
  ["/hdb-pulse/news/2021/digital-kiosks-to-help-heartland-enterprises-reach-customers-24-7","Joint Press Release by ESG, HDB and FMAS - Digital Kiosks to Help Heartland Enterprises Reach Customers 24/7","Senior Minister of State (SMS) for National Development Ms Sim Ann, and Minister of State (MOS) for Trade and Industry Ms Low Yen Ling, launched a pilot for digital kiosks at a visit to Guan Meat Enterprise minimart in Bukit Gombak today."],
  ["/hdb-pulse/news/2021/eks-upgrade","EKS Upgrade","This is about the EKS Upgrade."],
  ["/hdb-pulse/news/2021/ensuring-public-housing-remains-affordable-inclusive-and-liveable","Ensuring Public Housing Remains Affordable, Inclusive, and Liveable","At MND’s Committee of Supply debate today, Minister for National Development, Mr Desmond Lee, announced various measures to ensure that public housing remains affordable, inclusive and liveable for Singaporeans."],
  ["/hdb-pulse/news/2021/final-tender-results-for-land-parcel-at-tampines-street-62-parcel-a","Final Tender Results for Land Parcel at Tampines Street 62 (Parcel A) for Executive Condominium Housing Development","The Housing & Development Board (HDB), as the Government’s land sales agent, launched the land parcel at Tampines Street 62 (Parcel A) for tender on 15 April 2021."],
  ["/hdb-pulse/news/2021/final-tender-results-for-land-parcel-at-tengah-garden-walk","Final Tender Results for Land Parcel at Tengah Garden Walk for Executive Condominium Housing Development","The Housing & Development Board (HDB), as the Government’s land sales agent, launched the land parcel at Tengah Garden Walk for tender on 26 November 2020."],
  ["/hdb-pulse/news/2021/flash-estimate-of-1st-quarter-2021-resale-price-index","Flash Estimate of 1st Quarter 2021 Resale Price Index","HDB’s flash estimate of the 1st Quarter 2021 Resale Price Index (RPI) is 142.0, an increase of 2.8% over that in 4th Quarter 2020 (see Annexes A1 and A2)."],
  ["/hdb-pulse/news/2021/flash-estimate-of-2nd-quarter-2021-resale-price-index","Flash Estimate of 2nd Quarter 2021 Resale Price Index","HDB’s flash estimate of the 2nd Quarter 2021 Resale Price Index (RPI) is 146.2, an increase of 2.8% over that in 1st Quarter 2021 (see Annexes A1 and A2)."],
  ["/hdb-pulse/news/2021/flash-estimate-of-3rd-quarter-2021-resale-price-index","Flash Estimate of 3rd Quarter 2021 Resale Price Index","HDB’s flash estimate of the 3rd Quarter 2021 Resale Price Index (RPI) is 150.4, an increase of 2.7% over that in 2nd Quarter 2021."],
  ["/hdb-pulse/news/2021/flash-estimate-of-4th-quarter-2020-resale-price-index","Flash Estimate of 4th Quarter 2020 Resale Price Index","HDB’s flash estimate of the 4th Quarter 2020 Resale Price Index (RPI) is 137.8, an increase of 2.9% over that in 3rd Quarter 2020 (see Annexes A1 and A2)."],
  ["/hdb-pulse/news/2021/government-to-redevelop-site-in-alexandra-for-future-public-housing","Joint Press Release by HDB and SLA - Government to redevelop site in Alexandra for future public housing","The Government announced today that it will be redeveloping approximately 3.7 hectares(ha) of land on a brownfield site bounded by Alexandra Road, Prince Charles Crescent and Alexandra Canal for future public housing. When fully developed, the residential site"],
  ["/hdb-pulse/news/2021/greatearth-corporation-pte-ltd-and-greatearth-construction-pte-ltd-unable-to-continue-with-projects","Greatearth Corporation Pte Ltd and Greatearth Construction Pte Ltd Unable to Continue With Projects – HDB Working to Bring On Board New Contractors for Five BTO Projects","Greatearth Corporation Pte Ltd and Greatearth Construction Pte Ltd (hereafter referred to as Greatearth), the main contractors for five Build-to-Order (BTO) residential projects have informed HDB last week that they are unable to continue with the projects. Th"],
  ["/hdb-pulse/news/2021/greater-supply-of-pphs-flats-available-for-families-in-need","Greater Supply of PPHS Flats Available for Families in Need of Interim Housing while Awaiting Completion of Build-to-Order Flats","HDB will set aside 800 more flats for rental under the Parenthood Provisional Housing Scheme (PPHS) over the next two years, almost doubling the existing 840 flats under the scheme."],
  ["/hdb-pulse/news/2021/hdb-and-astar-ink-collaborations","HDB and A*STAR Ink Collaborations to Advance Smart Construction Technologies and Facilitate Partnerships in Technology Transfer","The Housing & Development Board (HDB) and Agency for Science, Technology and Research (A*STAR) have inked two collaborations to develop and adopt 5G-enabled smart construction technologies, as well as to facilitate partnerships and commercialisation of the res"],
  ["/hdb-pulse/news/2021/hdb-awards-2021-16-projects-recognised-for-excellence-in-design-construction-and-engineering","HDB Awards 2021 – 16 Projects Recognised for Excellence in Design, Construction and Engineering","A total of 16 HDB Design, Construction and Engineering Awards will be presented this year to architectural and engineering consultants as well as building contractors for projects that have demonstrated excellent design, engineering and construction."],
  ["/hdb-pulse/news/2021/hdb-issues-rated-fixed-rate-notes","HDB Issues Rated Fixed Rate Notes","The Housing & Development Board (\"HDB\") has issued S$750 million, 12-year Fixed Rate Notes (the “Notes”) under its S$32 billion Multicurrency Medium Term Note (\"MTN\") Programme."],
  ["/hdb-pulse/news/2021/hdb-issues-rated-fixed-rate-notes-apr19","HDB Issues Rated Fixed Rate Notes","The Housing & Development Board (\"HDB\") has issued S$900 million, 10-year Fixed Rate Notes (the “Notes”) under its S$32 billion Multicurrency Medium Term Note (\"MTN\") Programme."],
  ["/hdb-pulse/news/2021/hdb-issues-rated-fixed-rate-notes-mar16","HDB Issues Rated Fixed Rate Notes","The Housing & Development Board (\"HDB\") has issued S$900 million, 7-year Fixed Rate Notes (the “Notes”) under its S$32 billion Multicurrency Medium Term Note (\"MTN\") Programme."],
  ["/hdb-pulse/news/2021/hdb-issues-rated-fixed-rate-notes-nov-21","HDB Issues Rated Fixed Rate Notes","The Housing & Development Board (\"HDB\") has issued S$1 billion, 5-year Fixed Rate Notes (the “Notes”) under its S$32 billion Multicurrency Medium Term Note (\"MTN\") Programme."],
  ["/hdb-pulse/news/2021/hdb-issues-rated-fixed-rate-notes-oct12","HDB Issues Rated Fixed Rate Notes","The Housing & Development Board (\"HDB\") has issued S$900 million, 7-year Fixed Rate Notes (the “Notes”) under its S$32 billion Multicurrency Medium Term Note (\"MTN\") Programme."],
  ["/hdb-pulse/news/2021/hdb-jtc-and-mpa-which-issue-over-two-thirds-of-government-invoices","HDB, JTC and MPA, Which Issue Over Two-Thirds of Government Invoices, Offer E-Invoicing Through IMDA’s InvoiceNow","All government agencies can already receive e-invoices using InvoiceNow. Enabling government invoices to be sent through InvoiceNow will enhance processing speed and lower processing costs for transacting businesses"],
  ["/hdb-pulse/news/2021/hdb-launches-3740-flats-in-february-2021-bto-exercise","HDB Launches 3,740 Flats in February 2021 BTO Exercise","HDB launched 3,740 flats for sale today, under the February 2021 Build-To-Order (BTO) exercise."],
  ["/hdb-pulse/news/2021/hdb-launches-4989-flats-in-august-2021-bto-exercise","HDB Launches 4,989 Flats in August 2021 BTO Exercise","HDB launched 4,989 flats for sale today, under the August 2021 Build-to-Order (BTO) exercise."],
  ["/hdb-pulse/news/2021/hdb-launches-6299-flats-in-november-2021-bto-and-sbf-exercises","HDB Launches 6,299 Flats in November 2021 BTO and SBF Exercises","HDB launched 6,299 flats for sale today, under the November 2021 Build-To-Order (BTO) and Sale of Balance Flats (SBF) exercises."],
  ["/hdb-pulse/news/2021/hdb-launches-6373-flats-in-may-2021-bto-and-sbf-exercises","HDB Launches 6,373 Flats in May 2021 BTO and SBF Exercises","HDB launched 6,373 flats for sale today, under the May 2021 Build-To-Order (BTO) and Sale of Balance Flats (SBF) exercises. This comprises 3,879 BTO units and 2,494 SBF units across various towns/estates."],
  ["/hdb-pulse/news/2021/hdb-launches-residential-site-at-bukit-batok-west-avenue-8","HDB Launches Residential Site at Bukit Batok West Avenue 8","The Housing & Development Board (HDB), as the Government’s land sales agent, has launched a residential site at Bukit Batok West Avenue 8 for sale by public tender today, under the Confirmed List of 2nd Half 2021 (2H2021) Government Land Sales (GLS) Programme."],
  ["/hdb-pulse/news/2021/hdb-launches-sixth-solarnova-tender-with-smart-electrical-sub-meters-to-optimise-energy-use","HDB Launches Sixth SolarNova Tender with Smart Electrical Sub-meters to Optimise Energy Use","The Housing & Development Board (HDB) has called the sixth solar leasing tender under the SolarNova programme, led jointly with the Singapore Economic Development Board (EDB)."],
  ["/hdb-pulse/news/2021/hdb-to-inject-1-point-5-million-to-support-more-ground-up-projects","HDB to Inject $1.5M to Support More Ground-Up Projects and Strengthen Community Ties","A park catering to pets of HDB residents in Bukit Panjang, and a community art gallery in Toa Payoh where residents with green fingers can also grow their vegetables – these are some of the community-led projects that have been implemented under the Lively Pla"],
  ["/hdb-pulse/news/2021/hdb-to-ramp-up-flat-supply-by-35-percent-over-next-two-years","HDB to Ramp Up Flat Supply by 35% Over Next Two Years","HDB will ramp up the supply of new Build-To-Order (BTO) flats over the next two years to meet the strong housing demand from Singaporean households."],
  ["/hdb-pulse/news/2021/hdb-unveils-plans-for-a-new-public-housing-estate-at-site-of-former-police-academy","Joint Press Release by HDB, URA & SLA - HDB Unveils Plans for a New Public Housing Estate at Site of Former Police Academy in the Mount Pleasant Area","HDB today announced the conceptual development plans for a new housing estate, on a brownfield site largely comprised by the former Police Academy site (“Old PA (OPA)”) in the Mount Pleasant area, to meet the strong demand for public housing."],
  ["/hdb-pulse/news/2021/joint-cpfb-hdb-extension-of-minimum-4-interest-rate","Joint Press Release by CPFB and HDB - Extension of Minimum 4% Interest Rate Floor on Special, MediSave and Retirement Account Monies until 31 December 2022","To help CPF members grow their savings, the Government has extended the 4% interest rate floor for interest earned on all Special, MediSave and Retirement Account (SMRA) monies for another year until 31 December 2022."],
  ["/hdb-pulse/news/2021/joint-hdb-tc-cool-paint-pilot-project","Joint Press Release by HDB and Tampines TC - Tampines Residents May Enjoy a Cooler Living Environment with Cool Paint Pilot Project","Residents in Tampines can potentially enjoy a cooler living environment under a pilot project by the Housing & Development Board (HDB) and Tampines Town Council (TC), which will see approximately 130 HDB blocks painted with cool paint."],
  ["/hdb-pulse/news/2021/joint-htx-ground-robot-on-trial-at-tpy","Joint Press Release by HDB, HTX, LTA, NEA and SFA - HTX Ground Robot on Trial at Toa Payoh Central to Support Public Officers in Enhancing Public Health and Safety","For the first time, ground robots will be put on trial to patrol and survey a public area with high foot traffic to augment the work of public officers in enhancing public health and safety."],
  ["/hdb-pulse/news/2021/joint-press-release-by-cpf-and-hdb---cpf-interest-rates-from-1-april-2021-to-30-june-2021","Joint Press Release by CPF and HDB - CPF Interest Rates from 1 April 2021 to 30 June 2021","For the second quarter of 2021, CPF members below 55 years old will continue to earn interest rates of up to 3.5% per annum on their Ordinary Account (OA) monies, and up to 5% per annum on their Special and MediSave accounts (SMA) monies."],
  ["/hdb-pulse/news/2021/joint-press-release-by-cpf-and-hdb-cpf-interest-rates-from-1-july-2021-to-30-september-2021","Joint Press Release by CPF and HDB - CPF Interest Rates from 1 July 2021 to 30 September 2021","CPF members below 55 years old will continue to earn interest rates of up to 3.5% per annum on their Ordinary Account (OA) monies, and up to 5% per annum on their Special and MediSave accounts (SMA) monies for the third quarter of 2021."],
  ["/hdb-pulse/news/2021/joint-release-by-bca-hdb-homeowners-can-help-create-a-safer-living-environment","Joint Release by BCA-HDB: Homeowners Can Help Create a Safer Living Environment with Regular Window Maintenance","The Building and Construction Authority (BCA) recorded 43 cases of fallen windows in the first 11 months of this year."],
  ["/hdb-pulse/news/2021/jtender-closing-for-7-hdb-mscp-rooftop-sites-for-urban-farming","Joint Press Release by SFA and HDB - Tender Closing For 7 HDB MSCP Rooftop Sites For Urban Farming","The Singapore Food Agency (SFA) has closed the tender for seven sites at the rooftops of Housing & Development Board (HDB) multi-storey carparks (MSCP) for urban farming on 23 March 2021."],
  ["/hdb-pulse/news/2021/kampung-admiralty-and-punggol-town-win-global-awards-for-excellence-in-land-use","Kampung Admiralty and Punggol Town Win Global Awards for Excellence in Land Use","Competing among some of the world’s best urban developments, the Housing & Development Board’s (HDB) Kampung Admiralty and Punggol town have clinched two out of the nine 2021 Urban Land Institute (ULI) Global Awards for Excellence."],
  ["/hdb-pulse/news/2021/new-appointment-to-the-hdb-board","New Appointment to the HDB Board","The Ministry of National Development (MND) has announced a new board appointment at the Housing & Development Board (HDB)."],
  ["/hdb-pulse/news/2021/new-contractors-appointed-for-five-bto-projects","New Contractors Appointed for Five BTO Projects Previously Under Greatearth Corporation Pte Ltd and Greatearth Construction Pte Ltd","HDB has appointed new contractors to take over the construction of five Build-to-Order (BTO) projects affected by the liquidation of their previous main contractors Greatearth Corporation Pte Ltd and Greatearth Construction Pte Ltd (hereafter collectively refe"],
  ["/hdb-pulse/news/2021/over-16000-flats-delivered-since-jan-2020","Over 16,000 Flats Delivered Since Jan 2020; Number of Projects Completed in 2021 Expected to Exceed Pre-Pandemic Numbers","To keep our housing projects on track amid the pandemic, HDB has been leaning forward to support our contractors, including rolling out an extensive suite of assistance measures to help ease their financial pressures."],
  ["/hdb-pulse/news/2021/part-of-tampines-avenue-12-to-be-realigned-to-enhance-connectivity-for-tampines-north-residents","Part of Tampines Avenue 12 to be Realigned to Enhance Connectivity for Tampines North Residents","From 22 Dec 2021, a section of Tampines Avenue 12 will be realigned, as part of development plans for Tampines North."],
  ["/hdb-pulse/news/2021/pilot-health-district-in-queenstown-to-focus-on-residents-holistic-well-being","Joint Press Release by HDB, NUHS & NUS - Pilot Health District in Queenstown to Focus on Residents’ Holistic Well-being","Residents of Queenstown can look forward to quality homes and a living environment that will support their physical, social, and mental well-being, to enable them to lead more active and fulfilling lives."],
  ["/hdb-pulse/news/2021/provisional-tender-results-for-ec-site-at-tengah-garden-walk-tengah-e1","Provisional Tender Results for Land Parcel at Tengah Garden Walk for Executive Condominium Housing Development","The Housing & Development Board (HDB), as the Government’s land sales agent, launched the land parcel at Tengah Garden Walk for tender on 26 November 2020."],
  ["/hdb-pulse/news/2021/provisional-tender-results-for-land-parcel-at-tampines-street-62","Provisional Tender Results for Land Parcel at Tampines Street 62 (Parcel A) for Executive Condominium Housing Development","The Housing & Development Board (HDB), as the Government’s land sales agent, launched the land parcel at Tampines Street 62 (Parcel A) for tender on 15 April 2021."],
  ["/hdb-pulse/news/2021/release-of-1st-quarter-2021-public-housing-data","Release Of 1st Quarter 2021 Public Housing Data","This press release provides the data for the HDB resale and rental market in 1st Quarter 2021."],
  ["/hdb-pulse/news/2021/release-of-2nd-quarter-2021-public-housing-data","Release of 2nd Quarter 2021 Public Housing Data","This press release provides the data for the HDB resale and rental market in 2nd Quarter 2021."],
  ["/hdb-pulse/news/2021/release-of-3rd-quarter-2021-public-housing-data","Release of 3rd Quarter 2021 Public Housing Data","This press release provides the data for the HDB resale and rental market in 3rd Quarter 2021."],
  ["/hdb-pulse/news/2021/release-of-4th-quarter-2020-public-housingdata","Release of 4th Quarter 2020 Public Housing Data","This press release provides the data for the HDB resale and rental market in 4th Quarter 2020."],
  ["/hdb-pulse/news/2021/temporary-road-closure-along-pasir-ris-drive-8","Temporary Road Closure Along Pasir Ris Drive 8 for Construction of New Pedestrian Overhead Bridge","On 7 April 2021, a section of Pasir Ris Drive 8 will be temporarily closed to traffic from 1:00am to 5:00am."],
  ["/hdb-pulse/news/2021/temporary-road-closure-along-tampines-avenue-9-for-construction-of-new-pedestrian","Temporary Road Closure Along Tampines Avenue 9 for Construction of New Pedestrian Overhead Bridge","A section of Tampines Avenue 9 will be temporarily closed to traffic on 4 June, from 1:30am to 5:00am."],
  ["/hdb-pulse/news/2021/temporary-road-closure-along-tampines-street-61-for-construction-of-new-pedestrian-overhead-bridge","Temporary Road Closure Along Tampines Street 61 for Construction of New Pedestrian Overhead Bridge","A section of Tampines Street 61 will be temporarily closed to traffic from 23 April, 11:00pm to 24 April, 5:00am."],
  ["/hdb-pulse/news/2021/the-prime-location-public-housing-model","The Prime Location Public Housing (PLH) Model","The Ministry of National Development (MND) and the Housing & Development Board (HDB) have announced details of the Prime Location Public Housing (PLH) model today."],
  ["/hdb-pulse/news/2021/ura-and-hdb-release-sale-sites-at-jalan-tembusu-and-tampines-street-62-parcel-b","URA and HDB Release Sale Sites at Jalan Tembusu and Tampines Street 62 (Parcel B)","The Urban Redevelopment Authority (URA) and the Housing & Development Board (HDB) released two residential sites at Jalan Tembusu and Tampines Street 62 (Parcel B) for sale today under the 1st half 2021 (1H2021) Government Land Sales (GLS) Programme."],
  ["/hdb-pulse/news/2021/ura-and-hdb-release-sale-sites-at-lentor-central-and-tampines-street-62-parcel-a","URA and HDB Release Sale Sites at Lentor Central and Tampines Street 62 (Parcel A)","The Urban Redevelopment Authority (URA) and the Housing & Development Board (HDB) released two sites at Lentor Central and Tampines Street 62 (Parcel A) for sale today under the first half 2021 (1H2021) Government Land Sales (GLS) Programme."],
  ["/hdb-pulse/news/2022/15-minute-grace-period-for-short-term-parking-in-car-parks-with-electronic-parking-system","15-minute Grace Period for Short-term Parking in Car Parks with Electronic Parking System from 1 September 2022","HDB and URA will implement grace period of 15 minutes for short-term parking in car parks with Electronic Parking System from 1 September 2022"],
  ["/hdb-pulse/news/2022/almost-10000-bto-flats-across-10-projects-offered-in-november-2022-bto-exercise","Almost 10,000 BTO flats across 10 projects offered in November 2022 BTO exercise","HDB launched 9,655 flats for sale today under the November 2022 Build-To-Order (BTO) exercise. This is the largest BTO offering ever in a single launch. The bumper crop of flats is spread across 10 projects in both mature and non-mature estates in Kallang Wham"],
  ["/hdb-pulse/news/2022/community-week-2022","10th Year of HDB Community Week: Close to 500,000 Residents Have Played Active Roles in Enlivening Community Spaces and Building Neighbourly Ties","Ten years since the launch of the inaugural HDB Community Week in 2012, some half a million residents in HDB estates have played an active role in enlivening community spaces and strengthening neighbourly ties in their estates."],
  ["/hdb-pulse/news/2022/farrer-park-site-redeveloped","Joint Press Release by HDB, SportSG and URA - Farrer Park Site to be Redeveloped into a Public Housing Estate that is Integrated with Comprehensive Sports and Recreational Facilities","The Government today unveiled the conceptual plans for the redevelopment of an approximately 10-hectare site in Farrer Park."],
  ["/hdb-pulse/news/2022/final-tender-results-bukit-batok-west-ave-5","Final Tender Results for Land Parcel at Bukit Batok West Avenue 5 for Executive Condominium Housing Development","The Housing & Development Board (HDB), as the Government’s land sales agent, launched the land parcel at Bukit Batok West Avenue 5 for sale by public tender on 28 June 2022."],
  ["/hdb-pulse/news/2022/final-tender-results-for-land-parcel-at-bukit-batok-west-avenue-8","Final Tender Results for Land Parcel at Bukit Batok West Avenue 8 for Executive Condominium Housing Development","The Housing & Development Board (HDB), as the Government’s land sales agent, launched the land parcel at Bukit Batok West Avenue 8 for tender on 23 December 2021."],
  ["/hdb-pulse/news/2022/first-of-three-ulu-pandan-housing-projects-to-launch-next-month","HDB to Offer Some 3,000 flats in Eastern Half of Ulu Pandan – First of Three Housing Projects to Launch Next Month","HDB will launch about 3,000 Build-to-Order (BTO) flats across three housing projects in the eastern half of Ulu Pandan. Comprising 1,330 units of 3-room and 4-room flats, the first project will be launched at the upcoming November 2022 BTO sales exercise."],
  ["/hdb-pulse/news/2022/flash-estimate-of-1st-quarter-2022-resale-price-index","Flash Estimate of 1st Quarter 2022 Resale Price Index","HDB’s flash estimate of the 1st Quarter 2022 Resale Price Index (RPI) is 159.3, an increase of 2.3% over that in 4th Quarter 2021 (see Annexes A1 and A2)."],
  ["/hdb-pulse/news/2022/flash-estimate-of-2nd-quarter-2022-resale-price-index","Flash Estimate of 2nd Quarter 2022 Resale Price Index","HDB’s flash estimate of the 2nd Quarter 2022 Resale Price Index is 163.7, an increase of 2.6% over that in 1st Quarter 2022."],
  ["/hdb-pulse/news/2022/flash-estimate-of-3rd-quarter-2022-resale-price-index","Flash Estimate Of 3rd Quarter 2022 Resale Price Index","HDB’s flash estimate of the 3rd Quarter 2022 Resale Price Index (RPI) is 167.8, an increase of 2.4% over that in 2nd Quarter 2022."],
  ["/hdb-pulse/news/2022/four-public-housing-estates-zoned-as-car-lite-areas","Four public housing estates zoned as car-lite areas","In support of Singapore’s move towards a more sustainable and car-lite city, the Government has been taking active steps to encourage this shift."],
  ["/hdb-pulse/news/2022/greener-more-sustainable-homes","Greener, More Sustainable Homes as HDB Pilots UrbanWater Harvesting System in Existing Estates","As part of efforts to improve the sustainability of HDB towns, HDB will be extending the UrbanWater Harvesting System (UWHS) to existing estates for the first time through a pilot project covering 89 blocks in two HDB towns."],
  ["/hdb-pulse/news/2022/hdb-annual-report-fy2021","Record Deficit of $4.367 billion Incurred by HDB in FY 2021","In the Financial Year (FY) 2021, HDB incurred a record net deficit of $4.367 billion before government grant. This deficit is 86% higher than the $2.346 billion deficit incurred in FY2020, and is the highest ever deficit recorded since the inception of public "],
  ["/hdb-pulse/news/2022/hdb-awards-2022-oct22","HDB Awards 2022: 22 Projects Recognised for Excellence in Design, Construction and Engineering","A total of 22 HDB Design, Construction and Engineering Awards will be presented this year to architectural and engineering consultants, as well as building contractors for projects that have demonstrated excellent design, engineering and construction."],
  ["/hdb-pulse/news/2022/hdb-issues-rated-fixed-rate-green-notes-jul22","HDB Issues Rated Fixed Rate Green Notes","The Housing & Development Board (\"HDB\") has issued S$1.1 billion, 5-year Fixed Rate Green Notes (the “Notes”) under its S$32 billion Multicurrency Medium Term Note (\"MTN\") Programme."],
  ["/hdb-pulse/news/2022/hdb-issues-rated-fixed-rate-green-notes-oct22","HDB Issues Rated Fixed Rate Green Notes","The Housing & Development Board (\"HDB\") has issued S$1.2 billion, 5-year Fixed Rate Green Notes (the “Notes”) under its S$32 billion Multicurrency Medium Term Note (\"MTN\") Programme."],
  ["/hdb-pulse/news/2022/hdb-Issues-rated-fixed-rate-notes-dec22","HDB Issues Rated Fixed Rate Notes","The Housing & Development Board has issued S$900 million, 7-year Fixed Rate Notes under its S$32 billion Multicurrency Medium Term Note Programme."],
  ["/hdb-pulse/news/2022/hdb-issues-rated-fixed-rate-notes-jan22","HDB Issues Rated Fixed Rate Notes","The Housing & Development Board (\"HDB\") has issued S$950 million, 7-year Fixed Rate Notes (the “Notes”) under its S$32 billion Multicurrency Medium Term Note (\"MTN\") Programme."],
  ["/hdb-pulse/news/2022/hdb-issues-rated-fixed-rate-notes-jun22","HDB Issues Rated Fixed Rate Notes","HDB Issues Rated Fixed Rate Notes"],
  ["/hdb-pulse/news/2022/hdb-issues-rated-fixed-rate-notes-sep22","HDB Issues Rated Fixed Rate Notes","The Housing & Development Board (\"HDB\") has issued S$1.0 billion, 7-year Fixed Rate Notes (the “Notes”) under its S$32 billion Multicurrency Medium Term Note (\"MTN\") Programme."],
  ["/hdb-pulse/news/2022/hdb-launches-3953-flats-feb-2022-bto-exercise","HDB Launches 3,953 Flats in February 2022 BTO Exercise","HDB launched 3,953 flats for sale today, under the February 2022 Build-To-Order (BTO) exercise."],
  ["/hdb-pulse/news/2022/hdb-launches-4993-flats-in-august-2022-bto-exercise","HDB Launches 4,993 Flats in August 2022 BTO Exercise","HDB launched 4,993 flats for sale today, under the August 2022 Build-To-Order (BTO) exercise."],
  ["/hdb-pulse/news/2022/hdb-launches-6535-flats-in-may-2022-bto-and-sbf-exercises","HDB Launches 6,535 Flats in May 2022 BTO and SBF Exercises","HDB launched 6,535 flats for sale today, under the May 2022 Build-To-Order (BTO) and Sale of Balance Flats (SBF) exercises."],
  ["/hdb-pulse/news/2022/hdb-launches-residential-site-at-bukit-batok-west-avenue-5","HDB Launches Residential Site at Bukit Batok West Avenue 5","The Housing & Development Board (HDB), as the Government’s land sales agent, has launched a residential site at Bukit Batok West Avenue 5 for sale by public tender today, under the Confirmed List of 1st half 2022 (1H2022) Government Land Sales (GLS) Programme."],
  ["/hdb-pulse/news/2022/hdb-launches-tender-for-sale-sites-at-tampines-avenue-11-and-plantation-close","HDB Launches Tender for Sale Sites at Tampines Avenue 11 and Plantation Close","The Housing & Development Board (HDB), as the Government’s land sales agent, has launched a mixed commercial / residential site at Tampines Avenue 11 and an Executive Condominium site at Plantation Close for sale by public tender today, under the Confirmed Lis"],
  ["/hdb-pulse/news/2022/hdb-offers-two-additional-rehousing-options-for-flat-owners-under-ser","HDB Offers Two Additional Rehousing Options for Flat Owners Under Selective En Bloc Redevelopment Scheme","To meet the different rehousing needs and offer more choices for SERS flat owners, HDB will provide two additional rehousing options."],
  ["/hdb-pulse/news/2022/hdb-pilots-advanced-construction-technologies-to-design","HDB Pilots Advanced Construction Technologies to Design and Build Flats in Further Push to Raise Construction Productivity","The Housing & Development Board (HDB) will be accelerating its push towards higher construction productivity in public housing projects, with a new target of 40% site improvement by 2030, even as it delivers quality homes to Singaporeans."],
  ["/hdb-pulse/news/2022/hdb-punggol-queenstown-branches-relocation","HDB’s Punggol and Queensway Branches to Move to New Locations in September 2022","HDB’s Punggol and Queensway Branches will be relocating to their new locations and commence operations in September 2022."],
  ["/hdb-pulse/news/2022/hdb-raises-s1-billion-through-inaugural-green-bond-issuance","HDB Raises S$1 Billion Through Inaugural Green Bond Issuance","HDB raises S$1 billion through our inaugural green bond issuance, guided by our new Green Finance Framework."],
  ["/hdb-pulse/news/2022/hdb-to-bring-solar-energy","HDB to Bring Solar Energy to Over 8,000 Blocks through SolarNova Programme","With the launch of seventh SolarNova tender, HDB is on track to meet the target of 540MWp of solar PV capacity by 2030"],
  ["/hdb-pulse/news/2022/joint-news-release-cpf-interest-rates-from-1-july-2022-to-30-september-2022","CPF Interest Rates from 1 July 2022 to 30 September 2022","CPF members below 55 years old will continue to earn interest rates of up to 3.5% per annum on their Ordinary Account (OA) monies, and up to 5% per annum on their Special and MediSave Account (SMA) monies for the third quarter of 2022."],
  ["/hdb-pulse/news/2022/joint-press-release-by-cpf-board-and-hdb-cpf-interest-rates-feb11","Joint Press Release by CPF Board and HDB - CPF Interest Rates from 1 April 2022 to 30 June 2022","For the second quarter of 2022, CPF members below 55 years old will continue to earn interest rates of up to 3.5% per annum on their Ordinary Account (OA) monies, and up to 5% per annum on their Special and MediSave Account (SMA) monies."],
  ["/hdb-pulse/news/2022/joint-press-release-by-cpf-board-and-hdb-cpf-interest-rates-nov29","Joint Press Release by CPF Board and HDB - CPF Interest Rates from 1 January 2023 to 31 March 2023 and Basic Healthcare Sum for 2023","Despite the recent rise in interest rates, the pegged Ordinary Account (OA) and Special and MediSave Account (SMA) interest rates remain below the OA and SMA floor rates of 2.5% and 4% respectively."],
  ["/hdb-pulse/news/2022/joint-press-release-by-cpf-board-and-hdb-cpf-interest-rates-sept22","Joint Press Release by CPF Board and HDB - Government Extends 4% Interest Rate Floor on Special, Medisave and Retirement Account Monies Until 31 December 2023","Government has extended the 4% interest rate floor for interest earned on all Special, MediSave and Retirement Account monies until 31 December 2023"],
  ["/hdb-pulse/news/2022/joint-ura-and-hdb-release-sale-sites","Joint Press Release by URA & HDB: URA and HDB release sale sites at Clementi Avenue 1, Jalan Tembusu and Senja Close","The Urban Redevelopment Authority (URA) and the Housing & Development Board (HDB) released three residential sites at Clementi Avenue 1, Jalan Tembusu and Senja Close for sale today under the 2nd half 2022 (2H2022) Government Land Sales (GLS) Programme."],
  ["/hdb-pulse/news/2022/more-bto-flats-set-aside-for-first-timers","More BTO Flats Set Aside for First-Timers","The Government is committed to helping Singaporeans own their first homes."],
  ["/hdb-pulse/news/2022/more-support-for-flat-owners-constrained-by-the-ethnic-inegration-policy","More Support for Flat Owners Constrained by the Ethnic Integration Policy","HDB will offer to buy back flats from eligible EIP-constrained flat owners who face difficulties selling their flats at a reasonable price under EIP quotas"],
  ["/hdb-pulse/news/2022/new-appointments-to-the-hdb-board","New Appointments to the HDB Board","The Ministry of National Development (MND) has announced board appointment changes at the Housing & Development Board (HDB)."],
  ["/hdb-pulse/news/2022/new-sang-nila-utama-road-in-bidadari-estate-partially-opens-to-traffic","New Sang Nila Utama Road in Bidadari Estate Partially Opens to Traffic","A new 250-metre Sang Nila Utama Road will be partially opened to traffic from Sunday, 25 Sep 2022 at 8:00am, with one lane in each direction."],
  ["/hdb-pulse/news/2022/over-600-households-in-ang-mo-kio-to-move-to-new-flats-under-selective-en-bloc","Over 600 Households in Ang Mo Kio to Move to New Flats Under Selective En Bloc Redevelopment Scheme","Residents living in Blocks 562 to 565 at Ang Mo Kio Ave 3 can look forward to new homes and an improved living environment within their town under the Selective En bloc Redevelopment Scheme."],
  ["/hdb-pulse/news/2022/press-release","Flash Estimate Of 4th Quarter 2021 Resale Price Index","HDB’s flash estimate of the 4th Quarter 2021 Resale Price Index (RPI) is 155.4, an increase of 3.2% over that in 3rd Quarter 2021 (see Annexes A1 and A2). Based on the flash estimate, resale flat prices have risen 12.5% for the whole year of 2021. The flash es"],
  ["/hdb-pulse/news/2022/property-measures2022","Joint Press Release by MAS, MND & HDB - Measures to Promote Sustainable Conditions in the Property Market by Ensuring Prudent Borrowing and Moderating Demand","Market interest rates have risen significantly. They are likely to increase further in future, which will affect borrowing costs for home purchases."],
  ["/hdb-pulse/news/2022/provisional-tender-results-for-land-parcel-at-bukit-batok-west-ave-5","Provisional Tender Results for Land Parcel at Bukit Batok West Avenue 5 for Executive Condominium Housing Development","The Housing & Development Board (HDB), as the Government’s land sales agent, launched the land parcel at Bukit Batok West Avenue 5 for sale by public tender on 28 June 2022."],
  ["/hdb-pulse/news/2022/provisional-tender-results-for-land-parcel-at-bukit-batok-west-ave-8-for-executive","Provisional Tender Results for Land Parcel at Bukit Batok West Avenue 8 for Executive Condominium Housing Development","Tender Results for EC Land Parcel at Bukit Batok West Avenue 8, 9 bids received with the highest bid from CNQC-OS (2) Pte. Ltd. and SNC Realty Pte. Ltd."],
  ["/hdb-pulse/news/2022/redevelopment-and-extension-of-wcp","Redevelopment and Extension of Woodlands Checkpoint","The Immigration & Checkpoints Authority (ICA) will be redeveloping and extending Woodlands Checkpoint (WCP) to alleviate traffic congestion, improve travel time, and enhance security, for land border crossings between Singapore and Malaysia."],
  ["/hdb-pulse/news/2022/release-of-1st-quarter-2022-public-housing-data","Release of 1st Quarter 2022 Public Housing Data","This press release provides the data for the HDB resale and rental market in 1st Quarter 2022."],
  ["/hdb-pulse/news/2022/release-of-2ndquarter-2022-public-housing-data","Release of 2nd Quarter 2022 Public Housing Data","This press release provides the data for the HDB resale and rental market in 2nd Quarter 2022."],
  ["/hdb-pulse/news/2022/release-of-4th-quarter-2021-public-housing-data","Release of 4th Quarter 2021 Public Housing Data","This press release provides the data for the HDB resale and rental market in 4th Quarter 2021."],
  ["/hdb-pulse/news/2022/reopening-of-camping-sites-and-barbecue-pits","Reopening of camping sites and barbecue pits","Camping sites and barbecue pits in parks, housing estates and private condominiums will be reopened from 18 March 2022."],
  ["/hdb-pulse/news/2022/supporting-heartland-shops-to-enhance-their-vibrancy-and-competitiveness","Joint HDB-EnterpriseSG Press Release - Supporting Heartland Shops to Enhance Their Vibrancy and Competitiveness","The Housing & Development Board and Enterprise Singapore have unveiled the key findings of the Heartland Shops Study today."],
  ["/hdb-pulse/news/2022/supporting-the-housing-needs-of-low-income-families-enhancements-to-fresh-start-housing","Supporting the Housing Needs of Low-Income Families – Enhancements to Fresh Start Housing Scheme","HDB will further enhance the Fresh Start Housing Scheme to provide stronger support to help rental families stay on track in their home ownership journey"],
  ["/hdb-pulse/news/2022/supporting-the-housing-needs-of-seniors-second-community-care-apartments","Supporting the Housing Needs of Seniors – Second Community Care Apartments Pilot in Queenstown","HDB will be launching the second CCA pilot later this year in Queenstown to support more seniors to age independently in their silver years"],
  ["/hdb-pulse/news/2022/temporary-road-closure-along-bidadari-park-drive-for-construction-of-land-bridge","Temporary Road Closure Along Bidadari Park Drive for Construction of Land Bridge","Temporary Road Closure Along Bidadari Park Drive for Construction of Land Bridge from 9pm (6 July) to 6am (7 July) and 9pm (7 July) to 6am (8 July)."],
  ["/hdb-pulse/news/2022/temporary-road-closure-along-bidadari-park-drive-for-construction-of-new-land-bridge","Temporary Road Closure Along Bidadari Park Drive for Construction of New Land Bridge","On 3 August 2022, a section of Bidadari Park Drive will be temporarily closed to traffic from 09:00pm (3 August) to 6.00am (4 August)."],
  ["/hdb-pulse/news/2022/temporary-road-closure-along-bukit-batok-west-ave-6-for-construction-of-new-overhead-bridge","Temporary Road Closure along Bukit Batok West Avenue 6 for Construction of New Overhead Bridge","Temporary Road Closure along Bukit Batok West Avenue 6 for Construction of New Overhead Bridge traffic from to 1am to 5am on 14 July 2022."],
  ["/hdb-pulse/news/2022/temporary-road-closure-along-bukit-batok-west-avenue-6-and-tampines-avenue-12","Temporary Road Closure Along Bukit Batok West Avenue 6 and Tampines Avenue 12 for Construction of New Pedestrian Overhead Bridges","To facilitate the upcoming construction of new pedestrian overhead bridges, a section of Bukit Batok West Ave 6, and a section of Tampines Avenue 12 will be closed temporarily to traffic on 17 and 18 November respectively."],
  ["/hdb-pulse/news/2022/temporary-road-closure-along-bukit-batok-west-avenue-6-nov22","Temporary Road Closure along Bukit Batok West Avenue 6 for Construction of New Overhead Bridge","1. A section of Bukit Batok West Ave 6 will be temporarily closed to traffic from 1.00am to 5.00am on 24 November 2022. The closed section of the road will be between the junction of Bukit Batok West Avenue 9 and Bukit Batok West Avenue 8."],
  ["/hdb-pulse/news/2022/temporary-road-closure-along-punggol-central","Temporary Road Closure Along Punggol Central for Construction of New Pedestrian Overhead Bridge","A section of Punggol Central will be temporarily closed to traffic from 11.00pm on 20 June 2022 to 5.00am on 21 June 2022. The closed section of the road will be between the junction of Punggol Central/Punggol Way and Punggol Central/Sumang Walk."],
  ["/hdb-pulse/news/2022/temporary-road-closure-along-tampines-avenue-6-for-construction-of-new-pedestrian-overhead-bridge","Temporary Road Closure Along Tampines Avenue 6 for Construction of New Pedestrian Overhead Bridge","On 31 May 2022, a section of Tampines Avenue 6 will be temporarily closed to traffic from 1.00am to 5.00am."],
  ["/hdb-pulse/news/2022/temporary-road-closure-tampines-ave-1","Temporary Road Closure Along Tampines Avenue 1 for Construction of New Overhead Bridge","Part of Tampines Avenue 1 will be temporarily closed to traffic starting from 21 April 2022. The closure is for the construction of a new pedestrian overhead bridge which is estimated to be completed by 4Q2022. The new bridge will provide better connectivity f"],
  ["/hdb-pulse/news/2022/temporary-road-closures-along-bidadari-park-drive-for-construction-of-new-land-bridge","Temporary Road Closures Along Bidadari Park Drive for Construction of New Land Bridge","A section of Bidadari Park Drive will be temporarily closed to traffic from 9.00pm to 6.00am on 12 to 13 August, 24 to 25 August and 7 to 8 September. The closed section of Bidadari Park Drive will be from the junction of Bidadari Park Drive/Woodleigh Link to "],
  ["/hdb-pulse/news/2022/upcoming-flat-supply-and-3rd-quarter-2022-public-housing-data","Upcoming Flat Supply and 3rd Quarter 2022 Public Housing Data","This press release provides information on the upcoming flat supply and the HDB resale and rental market in 3rd Quarter 2022."],
  ["/hdb-pulse/news/2023/26-projects-recognised-for-excellence-in-design-construction-and-engineering-at-hdb-awards-2023","26 Projects Recognised for Excellence in Design, Construction and Engineering at HDB Awards 2023","A total of 26 HDB Design, Construction and Engineering Awards will be presented this year to architectural and engineering consultants, as well as building contractors for public housing projects that have demonstrated excellent design, engineering and constru"],
  ["/hdb-pulse/news/2023/appointment-of-new-chairperson-for-the-housing-and-development-board","Appointment of New Chairperson for the Housing & Development Board","Mr Benny Lim Siang Hoe has been appointed as Chairperson of the Housing & Development Board (HDB) with effect from 1 April 2023. Mr Lim will succeed Mr Bobby Chin Yoke Choong, who has served as Chairperson of HDB since 1 Oct 2016."],
  ["/hdb-pulse/news/2023/choa-chu-kang-to-be-rejuvenated-with-new-mixed-use-developments","Choa Chu Kang to be Rejuvenated with New Mixed-Use Developments, Recreational Spaces and Better Connectivity to Support Green Commuting","Choa Chu Kang residents can look forward to new mixed-use developments and more recreational spaces as part of the town’s upgrade under the Remaking Our Heartland (ROH) programme."],
  ["/hdb-pulse/news/2023/city-living-close-to-nature","City Living Close to Nature: Bukit Merah to Get Makeover with Refreshed Town Centre, More Green Spaces and New Pedestrian and Cycling Paths","Bukit Merah residents can look forward to a transformation of their town centre and community spaces, alongside enhanced connectivity to green nodes such as the Rail Corridor and Southern Ridges."],
  ["/hdb-pulse/news/2023/cpf-interest-rates-from-1-jan-2024","Joint Press Release by CPF Board, HDB and MOH - CPF Interest Rates From 1 January 2024 To 31 March 2024","With the Special and MediSave Account (SMA) pegged rate exceeding the floor rate of 4%, savings in the SMA will earn 4.08% in the first quarter of 2024."],
  ["/hdb-pulse/news/2023/cpf-interest-rates-from-1-july-2023-to-30-september-2023","CPF Interest Rates from 1 July 2023 to 30 September 2023","With the Special and MediSave Account (SMA) pegged rate exceeding the floor rate of 4%, savings in the SMA will earn 4.01% in the third quarter of 2023."],
  ["/hdb-pulse/news/2023/cpf-interest-rates-from-1-october-2023-to-31-december-2023","CPF Interest Rates from 1 October 2023 to 31 December 2023","One-year extension of minimum 4% interest rate on Special, MediSave and Retirement Account monies from 1 January 2024 to 31 December 2024"],
  ["/hdb-pulse/news/2023/enhancing-the-vibrancy-of-hdb-heartlands","Enhancing the Vibrancy of HDB Heartlands","Encouraging entrepreneurship, supporting shop owners with upgrading works, extending more help for social enterprises, and providing more affordable food options for residents"],
  ["/hdb-pulse/news/2023/final-tender-results-for-land-parcel-at-plantation-close","Final Tender Results for Land Parcel at Plantation Close for Executive Condominium Housing Development","The Housing & Development Board (HDB), as the Government’s land sales agent, launched the land parcel at Plantation Close for tender on 23 December 2022."],
  ["/hdb-pulse/news/2023/final-tender-results-for-land-parcel-at-tampines-avenue-11-for-mixed-use-development","Final Tender Results For Land Parcel at Tampines Avenue 11 for Mixed Use Development","The Housing & Development Board (HDB), as the Government’s land sales agent, launched the land parcel at Tampines Avenue 11 for tender on 23 December 2022."],
  ["/hdb-pulse/news/2023/ftr-tampines-st62","Final Tender Results for Land Parcel at Tampines Street 62 (PARCEL B) for Executive Condominium Housing Development","The Housing & Development Board (HDB), as the Government’s land sales agent, launched the land parcel at Tampines Street 62 (Parcel B) for tender on 14 March 2023."],
  ["/hdb-pulse/news/2023/further-support-for-first-time-homebuyers","Joint Press Release by MND & HDB - Further support for First-time Homebuyers","Increased CPF Housing Grant for resale flat buyers; Greater priority during BTO applications for First Timer families with children and young married couples aged 40 years and below buying their first home"],
  ["/hdb-pulse/news/2023/hdb-community-day-2023-234-nominations-received-for-inaugural-singapore-friendly","HDB Community Day 2023: 234 Nominations Received for Inaugural Singapore’s Friendly Neighbourhood Award","HDB Community Day on 30 Jun 2023, Minister for National Development Mr Desmond Lee presented 76 awards to community volunteers"],
  ["/hdb-pulse/news/2023/hdb-extends-validity-period-of-hdb-flat-eligibility-hfe-letter-from-6-to-9-months","HDB Extends Validity Period of HDB Flat Eligibility (HFE) Letter from 6 to 9 Months","HDB will extend the validity of all existing and new HFE letters to 9 months, from the current 6 months. The extended validity period will offer both new and resale flat buyers more time to secure their ideal home, and reduce the number of subsequent applicati"],
  ["/hdb-pulse/news/2023/hdb-flat-eligibility-letter","HDB Flat Eligibility (HFE) Letter to Replace HDB Loan Eligibility (HLE) Letter from 9 May 2023","From 9 May 2023, HDB will introduce a new HDB Flat Eligibility (HFE) letter to provide flat buyers with a holistic understanding and assessment of their housing and financing options before they commence their home buying journey."],
  ["/hdb-pulse/news/2023/hdb-issues-rated-fixed-rate-green-notes-nov23","HDB Issues Rated Fixed Rate Green Notes","The Housing & Development Board (\"HDB\") has issued S$740 million, 5-year Fixed Rate Green Notes (the “Notes”) under its S$32 billion Multicurrency Medium Term Note (\"MTN\") Programme."],
  ["/hdb-pulse/news/2023/hdb-launches-4428-flats-in-february-2023-bto-exercise","HDB Launches 4,428 Flats in February 2023 BTO exercise","HDB launched 4,428 flats for sale today, under the February 2023 Build-To-Order (BTO) exercise. The flats are spread across five projects in both mature and non-mature estates – Kallang Whampoa, Queenstown, Jurong West and Tengah."],
  ["/hdb-pulse/news/2023/hdb-launches-6800-flats-in-october-2023-bto-exercise","HDB Launches 6,800 Flats in October 2023 BTO Exercise","HDB launched 6,800 flats for sale today, under the October 2023 Build-To-Order (BTO) exercise. These flats are launched across 8 projects in both mature and non-mature estates. 6 of the projects, or about 75% of all flats offered, have a waiting time of 4 year"],
  ["/hdb-pulse/news/2023/hdb-launches-largest-solar-leasing-tender-under-solarnova-programme","HDB Launches Largest Solar Leasing Tender Under SolarNova Programme","The Housing & Development Board (HDB) has launched the eighth solar leasing tender under the SolarNova programme."],
  ["/hdb-pulse/news/2023/hdb-launches-more-than-6000-flats-in-december-2023-bto-exercise","HDB Launches More Than 6,000 Flats in December 2023 BTO Exercise","HDB launched 6,057 flats for sale today, under the December 2023 Build-To-Order (BTO) exercise. These flats are spread across eight new projects in both mature and non-mature estates. Four of the projects, or about half of all flats offered, have a waiting tim"],
  ["/hdb-pulse/news/2023/hdb-launches-nearly-7000-flats-in-may-2023-bto-and-sbf-exercises","HDB Launches Nearly 7,000 Flats in May 2023 BTO and SBF Exercises","HDB launched 6,995 flats for sale, under the May 2023 Build-To-Order (BTO) and Sale of Balance Flats (SBF) exercises."],
  ["/hdb-pulse/news/2023/hdb-launches-sale-sites-at-plantation-close-and-tampines-street-95","HDB Launches Sale Sites at Plantation Close and Tampines Street 95","HDB has launched an Executive Condominium site at Plantation Close for sale by public tender today, under the Confirmed List of 2nd Half 2023 (2H2023) Government Land Sales (GLS) Programme. HDB has made available an Executive Condominium site at Tampines Stree"],
  ["/hdb-pulse/news/2023/hdb-launches-sample-household-survey-2023-24","HDB Launches Sample Household Survey 2023/24 to Understand Evolving Needs and Aspirations of HDB Residents","HDB launched its Sample Household Survey (SHS) 2023/24 to gather residents’ feedback on their public housing experience and understand their changing needs and expectations."],
  ["/hdb-pulse/news/2023/hdb-spent-more-on-public-housing-in-fy-2022","HDB Spent More on Public Housing in FY 2022","In the Financial Year (FY) 2022, HDB sustained the ramp-up in new flat supply with over 75,000 flats under construction, and delivered the largest number of flats in the last five years."],
  ["/hdb-pulse/news/2023/hdb-unveils-masterplan-for-bayshore-estate","HDB Unveils Masterplan for Bayshore Estate","Minister for National Development Mr Desmond Lee unveiled the masterplan for the new Bayshore housing estate at the HDB Awards Ceremony on 16 October 2023"],
  ["/hdb-pulse/news/2023/joint-press-release-by-cpf-board-and-hdb-cpf-interest-rates-feb23","Joint Press Release by CPF Board and HDB - CPF Interest Rates from 1 April 2023 to 30 June 2023","The interest rates for CPF savings will remain unchanged for the second quarter of 2023 as the pegged Ordinary Account and Special and MediSave Account (SMA) rates remain below the OA and SMA floor rates of 2.5% and 4%."],
  ["/hdb-pulse/news/2023/keeping-public-housing-accessible-for-singaporeans","Keeping Public Housing Accessible for Singaporeans","Greater priority for specific groups of first-time new flat buyers, further support for seniors, and more options for low-income singles"],
  ["/hdb-pulse/news/2023/new-hdb-flat-eligibility-letter","New HDB Flat Eligibility (HFE) Letter to Provide Flat Buyers with Holistic Assessment of Housing and Financing Options","From 9 May 2023, HDB will introduce a new HDB Flat Eligibility (HFE) letter to provide flat buyers with a holistic understanding and assessment of their housing and financing options before they commence their home buying journey. The HFE letter, which will re"],
  ["/hdb-pulse/news/2023/new-plus-housing-model-with-more-subsidies","New Plus Housing Model with More Subsidies for More Affordable BTO Flats in Attractive Locations","Plus flats will come with tighter conditions to support genuine homebuyers"],
  ["/hdb-pulse/news/2023/new-portal-to-help-residents-find-budget-meals-in-the-heartlands","New Portal to Help Residents Find Budget Meals in the Heartlands","The Housing & Development Board (HDB), in collaboration with the Government Technology Agency (GovTech), launched a new portal today to help residents locate HDB coffee shops offering budget meals more easily and conveniently, with the information readily avai"],
  ["/hdb-pulse/news/2023/particulars-of-tenders-submitted-for-ec-hdb-site-at-tamp-st-62-parcel-b","Particulars Of Tenders Submitted For Executive Condominium Housing Development Site At Tampines Street 62 (Parcel B)","The Housing & Development Board (HDB) closed the tender for the Executive Condominium housing development site at Tampines street 62 (Parcel B) today."],
  ["/hdb-pulse/news/2023/provisional-tender-results-for-mixed-use-development-site-at-tampines-avenue-11-and","Provisional Tender Results for Mixed Use Development Site at Tampines Avenue 11 and Particulars of Tenders Submitted for Executive Condominium Housing Development Site at Plantation Close","HDB closed the tenders for the Mixed commercial / residential site at Tampines Avenue 11 and the Executive Condominium housing development site at Plantation Close on 27 Jun 2023"],
  ["/hdb-pulse/news/2023/queenstown-roh","Queenstown, Singapore’s First Satellite Town, to be Rejuvenated to Support Healthy Living and Active Ageing","About 79,000 residents of Queenstown and the neighbouring Farrer Road Estate can look forward to an array of enhancements and upgrades are aimed at fostering their physical, social, and mental well-being, enabling them to lead healthy and active lives."],
  ["/hdb-pulse/news/2023/redeveloped-tanglin-halt-estate-to-have-new-hawker-centre-and-market-and-polyclinic","Redeveloped Tanglin Halt Estate to Have New Hawker Centre and Market, and Polyclinic","Tanglin Halt is expected to offer up to 5,500 new flats, providing more housing options for Singaporeans."],
  ["/hdb-pulse/news/2023/residual-current-circuit-breakers-required","Joint Press Release by EMA and HDB – Residual Current Circuit Breakers Required in All Residential Premises Built Before 1985 for Greater Electrical Safety","From 1 July 2023, all residential premises will be required to have a Residual Current Circuit Breaker (RCCB) installed, to enhance the electrical safety in all households. Homeowners will be given a grace period of two years from the effective date of the req"],
  ["/hdb-pulse/news/2023/sla-to-take-over-and-consolidate-state-land-management-within-hdb-estates-from-1-march-2023","SLA to take over and consolidate State land management within HDB estates from 1 March 2023","With effect from 1 March 2023, HDB will hand over the management of all State land within HDB estates to the Singapore Land Authority (SLA)."],
  ["/hdb-pulse/news/2023/temporarily-relaxed-rental-occupany-cap","Joint Press Release by HDB & URA - Temporary Relaxation of Occupancy Cap for Rental of HDB flats and Private Residential Properties to Better Meet Demand","From 22 January 2024 to 31 December 2026, HDB and URA will relax the occupancy cap for larger HDB flats and private residential properties."],
  ["/hdb-pulse/news/2023/temporary-road-closure-along-bukit-batok-road-for-construction-of-new-pedestrian-overhead-bridge","Temporary Road Closure along Bukit Batok Road for Construction of New Pedestrian Overhead Bridge","On 22 Dec 2023 (Fri) and 30 Dec 2023 (Sat), a section of Bukit Batok Road will be closed off temporarily to traffic from 1.00am to 5.00am."],
  ["/hdb-pulse/news/2023/temporary-road-closure-along-tampines-avenue-10","Temporary Road Closure Along Tampines Avenue 10 for Construction of New Pedestrian Overhead Bridge","On 17 Jan 2023, a section of Tampines Avenue 10 will be temporarily closed to traffic from 1.00am to 5.00am."],
  ["/hdb-pulse/news/2023/temporary-road-closure-along-woodleigh-link-for-construction-of-new-overhead-bridge","Temporary Road Closure along Woodleigh Link for Construction of New Overhead Bridge","On 4 December 2023 (Monday) and 5 December 2023 (Tuesday), a section of Woodleigh Link will be temporarily closed to traffic from 9.00pm to 6.00am (2 days). The closed section of the road will be between the T-junction of Upper Serangoon Road and part of Woodl"],
  ["/hdb-pulse/news/2023/upcoming-flat-supply-and-1st-quarter-2023-public-housing-data","Upcoming Flat Supply And 1st Quarter 2023 Public Housing Data","This press release provides information on the upcoming flat supply and the HDB resale and rental markets in 1st Quarter 2023."],
  ["/hdb-pulse/news/2023/upcoming-flat-supply-and-2nd-quarter-2023-public-housing-data","Upcoming Flat Supply and 2nd Quarter 2023 Public Housing Data","Upcoming Flat Supply and 2nd Quarter 2023 Public Housing Data"],
  ["/hdb-pulse/news/2023/upcoming-flat-supply-and-3q2023-public-housing-data","Upcoming Flat Supply and 3rd Quarter 2023 Public Housing Data","This press release provides information on the upcoming flat supply and the HDB resale and rental markets in 3rd Quarter 2023."],
  ["/hdb-pulse/news/2023/upcoming-flat-supply-and-4th-quarter-2022-public-housing-data","Upcoming Flat Supply And 4th Quarter 2022 Public Housing Data","This press release provides information on the upcoming flat supply and the HDB resale and rental markets in 4th Quarter 2022."],
  ["/hdb-pulse/news/2023/upcoming-flat-supply-and-flash-estimate-of-1st-quarter-2023-resale-price-index-apr23","Upcoming Flat Supply and Flash Estimate of 1st Quarter 2023 Resale Price Index","In May 2023, HDB will offer about 5,400 Build-To-Order (BTO) flats in towns/estates such as Bedok, Kallang Whampoa, Serangoon, and Tengah. In August 2023, HDB will offer between 5,200 and 6,200 flats in towns/estates such as Bukit Merah, Choa Chu Kang, Kallang"],
  ["/hdb-pulse/news/2023/upcoming-flat-supply-and-flash-estimate-of-2nd-quarter-2023-resale-price-index","Upcoming Flat Supply and Flash Estimate of 2nd Quarter 2023 Resale Price Index","In August 2023, HDB will offer about 6,700 Build-To-Order (BTO) flats in towns/estates such as Choa Chu Kang, Kallang Whampoa, Queenstown and Tengah."],
  ["/hdb-pulse/news/2023/upcoming-flat-supply-and-flash-estimate-of-3rd-quarter-2023-resale-price-index","Upcoming Flat Supply and Flash Estimate Of 3rd Quarter 2023 Resale Price Index","HDB will offer about 6,800 Build-To-Order flats in Choa Chu Kang, Kallang Whampoa, Queenstown, and Tengah in the upcoming sales launch in early October. In the final sales exercise of 2023, which will be held in December 2023, HDB will offer about 6,000 flats "],
  ["/hdb-pulse/news/2023/upcoming-flat-supply-and-flash-estimate-of-4th-quarter-2022-resale-price-index","Upcoming Flat Supply And Flash Estimate Of 4th Quarter 2022 Resale Price Index","HDB has launched a total of 23,184 Build-To-Order (BTO) flats for sale in 2022. In 2023, HDB plans to offer up to 23,000 BTO flats and is prepared to launch up to 100,000 flats in total from 2021 to 2025 if needed."],
  ["/hdb-pulse/news/2023/upgraded-town-centre-and-new-garden-loop-linking-green-spaces-in-rejuvenated-ang-mo-kio","Upgraded Town Centre and New ‘Garden Loop’ Linking Green Spaces in rejuvenated Ang Mo Kio","The ROH proposals for Ang Mo Kio will be exhibited at AMK Hub B1 Atrium from 23 Sep to 8 Oct 2023, before roving to five Neighbourhood Centres in Ang Mo Kio."],
  ["/hdb-pulse/news/2023/ura-and-hdb-release-sale-sites-at-jalan-tembusu-and-tampines-street-62","Joint Press Release: URA and HDB Release Sale Sites at Jalan Tembusu and Tampines Street 62 (Parcel B)","The Urban Redevelopment Authority (URA) and the Housing & Development Board (HDB) released two sites at Jalan Tembusu and Tampines Street 62 (Parcel B) for sale today under the first half 2023 (1H2023) Government Land Sales (GLS) Programme."],
  ["/hdb-pulse/news/2024/19600-bto-flats-to-be-launched-in-2024-across-three-sales-exercises","19,600 BTO Flats to be Launched in 2024 Across Three Sales Exercises","In 2024, HDB will launch about 19,600 Build-To-Order (BTO) flats across three sales exercises in February, June and October. To meet the increased housing demand in recent years, HDB has ramped up the supply of BTO flats to offer more than 63,000 flats in the "],
  ["/hdb-pulse/news/2024/bidadari-estate-wins-world-gold-at-the-2024-fiabci-world-prix-dexcellence-awards","Bidadari Estate wins World Gold at the 2024 FIABCI World Prix d’Excellence Awards","The Housing & Development Board (HDB) has clinched the prestigious World Gold award for Bidadari estate in the Master Plan category, at the 2024 FIABCI World Prix d’Excellence Awards held on 30 May 2024 at Gardens by the Bay."],
  ["/hdb-pulse/news/2024/changes-to-the-board-members-of-the-hdb","Joint Press Release by MND and HDB - Changes to the Board Members of the Housing & Development Board","The Ministry of National Development (MND) has announced changes to the board appointments at the Housing & Development Board (HDB)."],
  ["/hdb-pulse/news/2024/cpf-interest-rates-from-1-jan-to-31-mar-2025","CPF Interest Rates from 1 January to 31 March 2025 and Basic Healthcare Sum for 2025","Savings in the Special, MediSave and Retirement Accounts (SMRA) will earn the floor rate of 4% per annum from 1 January to 31 March 2025, as the SMRA pegged rate has fallen below the floor rate of 4%."],
  ["/hdb-pulse/news/2024/final-tender-result-for-land-parcel-at-jalan-loyang-besar-for-ec-housing-development","Final Tender Result for Land Parcel at Jalan Loyang Besar for Executive Condominium Housing Development","The Housing & Development Board (HDB), as the Government’s land sales agent, launched the land parcel at Jalan Loyang Besar for tender on 16 May 2024."],
  ["/hdb-pulse/news/2024/final-tender-result-for-land-parcel-at-tampines-street-94","Final Tender Result for Land Parcel at Tampines Street 94 for Mixed Commercial and Residential Development","The Housing & Development Board (HDB), as the Government’s land sales agent, launched the land parcel at Tampines Street 94 for tender on 27 June 2024."],
  ["/hdb-pulse/news/2024/final-tender-result-for-land-parcel-at-tampines-street-95","Final Tender Result for Land Parcel at Tampines Street 95 for Executive Condominium Housing Development","The Housing & Development Board (HDB), as the Government’s land sales agent, launched the land parcel at Tampines Street 95 for tender on 22 August 2024."],
  ["/hdb-pulse/news/2024/final-tender-results-for-land-parcel-at-plantation-close-for-ec-housing-development","Final Tender Results for Land Parcel at Plantation Close for Executive Condominium Housing Development","The Housing & Development Board (HDB), as the Government’s land sales agent, launched the land parcel at Plantation Close for tender on 30 November 2023."],
  ["/hdb-pulse/news/2024/four-tengah-bto-projects-awarded-top-tier-active-beautiful-clean-waters-certification","Four Tengah BTO Projects Awarded Top-tier Active, Beautiful, Clean (ABC) Waters Certification","Four Tengah Build-To-Order (BTO) projects – Parc Clover @Tengah, Parc Residences @ Tengah, Garden Terrace @ Tengah, and Garden Court @ Tengah – have been awarded the Active, Beautiful, Clean (ABC) Waters Gold certification this year. This follows the Rivervale"],
  ["/hdb-pulse/news/2024/govt-extends-4-per-cent-interest-rate-floor","Joint Press Release by CPF Board and HDB - Government Extends 4% Interest Rate Floor on Special, Medisave and Retirement Account Monies Until 31 December 2025","The Government has extended the 4% interest rate floor for interest earned on all Special, MediSave and Retirement Account (SMRA) monies for another year from 1 January to 31 December 2025. This extension of the floor rate will continue to provide CPF members "],
  ["/hdb-pulse/news/2024/greater-support-for-young-couples","Greater Support for Young Couples in their Home Ownership Journey","At MND’s Committee of Supply debate today, Minister for National Development Mr Desmond Lee announced various initiatives to keep public housing accessible for young couples and families."],
  ["/hdb-pulse/news/2024/HDB-awards-20-year-Centralised-Cooling-Systems-contract-to-Keppel","Joint Press Release by HDB & Keppel - HDB Awards 20-Year Centralised Cooling Systems Contract for Three Tengah BTO Projects to Keppel","The Housing & Development Board (HDB) has awarded Keppel Ltd.’s Infrastructure Division (Keppel) the chilled water supply contract to design, build, own and operate Centralised Cooling Systems (CCS) at three upcoming Build-to-Order (BTO) projects Brickland Wea"],
  ["/hdb-pulse/news/2024/hdb-awards-2024","Rivervale Shores and Kim Keat Beacon Projects Recognised for Design and Construction Excellence at HDB Awards 2024","At the HDB Awards ceremony on 22 October 2024, Minister for National Development Mr Desmond Lee will present a total of 26 HDB Design, Construction, and Engineering Awards to recognise the excellent work of architectural and engineering consultants, as well as"],
  ["/hdb-pulse/news/2024/hdb-awards-largest-solar-leasing-tender","HDB Awards Largest Solar Leasing Tender of 130 MWp to Sunseap Leasing Pte Ltd","The Housing & Development Board (HDB) has awarded its eighth and largest solar leasing tender to date to Sunseap Leasing Pte Ltd, an entity of EDP Renewables APAC."],
  ["/hdb-pulse/news/2024/hdb-incurred-higher-expenditure-in-fy-2023-to-keep-public-housing-affordable","HDB Incurred Higher Expenditure in FY 2023 to Keep Public Housing Affordable","In the Financial Year (FY) 2023, HDB incurred a net deficit of $6.775 billion before government grants. Of the $6.775 billion deficit, $6.225 billion was incurred for the Home Ownership segment. HDB incurs significant deficit every year as the amount collected"],
  ["/hdb-pulse/news/2024/hdb-issues-rated-fixed-rate-green-notes-apr24","HDB Issues Rated Fixed Rate Green Notes","The Housing & Development Board (\"HDB\") has issued S$800 million, 3-year Fixed Rate Green Notes (the “Notes”) under its S$32 billion Multicurrency Medium Term Note (\"MTN\") Programme."],
  ["/hdb-pulse/news/2024/hdb-issues-rated-fixed-rate-green-notes-jan24","HDB Issues Rated Fixed Rate Green Notes","The Housing & Development Board (\"HDB\") has issued S$800 million, 5-year Fixed Rate Green Notes (the “Notes”) under its S$32 billion Multicurrency Medium Term Note (\"MTN\") Programme"],
  ["/hdb-pulse/news/2024/hdb-issues-rated-fixed-rate-green-notes-jul24","HDB Issues Rated Fixed Rate Green Notes","The Housing & Development Board (\"HDB\") has issued S$965 million, 2-year Fixed Rate Green Notes (the “Notes”) under its S$32 billion Multicurrency Medium Term Note (\"MTN\") Programme."],
  ["/hdb-pulse/news/2024/hdb-issues-rated-fixed-rate-green-notes-oct24","HDB Issues Rated Fixed Rate Green Notes","The Housing & Development Board (\"HDB\") has issued S$900 million, 4-year Fixed Rate Green Notes (the “Notes”) under its S$32 billion Multicurrency Medium Term Note (\"MTN\") Programme."],
  ["/hdb-pulse/news/2024/hdb-issues-rated-fixed-rate-notes-mar24","HDB Issues Rated Fixed Rate Notes","The Housing & Development Board (\"HDB\") has issued S$700 million, 7-year Fixed Rate Notes (the “Notes”) under its S$32 billion Multicurrency Medium Term Note (\"MTN\") Programme."],
  ["/hdb-pulse/news/2024/hdb-issues-rated-fixed-rate-notes-may24","HDB Issues Rated Fixed Rate Notes","The Housing & Development Board (\"HDB\") has issued S$900 million, 7-year Fixed Rate Notes (the “Notes”) under its S$32 billion Multicurrency Medium Term Note (\"MTN\") Programme."],
  ["/hdb-pulse/news/2024/hdb-issues-rated-fixed-rate-notes-nov24","HDB Issues Rated Fixed Rate Notes","The Housing & Development Board (\"HDB\") has issued S$900 million, 7-year Fixed Rate Notes (the “Notes”) under its S$32 billion Multicurrency Medium Term Note (\"MTN\") Programme."],
  ["/hdb-pulse/news/2024/hdb-issues-rated-fixed-rate-notes-oct24","HDB Issues Rated Fixed Rate Notes","The Housing & Development Board (\"HDB\") has issued S$500 million, 10-year Fixed Rate Notes (the “Notes”) under its S$32 billion Multicurrency Medium Term Note (\"MTN\") Programme."],
  ["/hdb-pulse/news/2024/hdb-launches-5714-flats-in-feb-2024-bto-and-sbf-exercises","HDB Launches 5,714 Flats in Feb 2024 BTO and SBF Exercises","HDB launched 5,714 flats for sale today, under the Feb 2024 Build-To-Order (BTO) and Sale of Balance Flats (SBF) exercises. Of these, 4,126 BTO flats are offered across seven new BTO projects in different estates. Five out of the seven BTO projects, or over 80"],
  ["/hdb-pulse/news/2024/hdb-launches-6938-flats-in-june-2024-bto-exercise","HDB Launches 6,938 Flats in June 2024 BTO Exercise","HDB launched 5,714 flats for sale today, under the Feb 2024 Build-To-Order (BTO) and Sale of Balance Flats (SBF) exercises. Of these, 4,126 BTO flats are offered across seven new BTO projects in different estates. Five out of the seven BTO projects, or over 80"],
  ["/hdb-pulse/news/2024/hdb-launches-placemaking-challenge-to-revitalise-bukit-merah-town-centre","HDB Launches Placemaking Challenge to Revitalise Bukit Merah Town Centre","HDB has launched a call for design proposals to revitalise and rejuvenate the Bukit Merah Town Centre at the Singapore Archifest"],
  ["/hdb-pulse/news/2024/hdb-launches-sale-site-at-chencharu-close","HDB Launches Sale Site at Chencharu Close","The Housing & Development Board (HDB), as the Government’s land sales agent, has launched a mixed-use site comprising a commercial and residential development integrated with a bus interchange and a hawker centre at Chencharu Close for sale by public tender to"],
  ["/hdb-pulse/news/2024/hdb-launches-sale-site-at-tampines-street-94","HDB Launches Sale Site at Tampines Street 94","The Housing & Development Board (HDB), as the Government’s land sales agent, has launched a mixed commercial and residential site at Tampines Street 94 for sale by public tender today, under the Confirmed List of 1st Half 2024 (1H2024) Government Land Sales (G"],
  ["/hdb-pulse/news/2024/hdb-launches-sales-site-at-tampines-street-95","HDB Launches Sales Site at Tampines Street 95","The Housing & Development Board (HDB), as the Government’s land sales agent, has launched an Executive Condominium site at Tampines Street 95 for sale by public tender today, under the Confirmed List of 2nd half 2024 (2H2024) Government Land Sales (GLS) Progra"],
  ["/hdb-pulse/news/2024/hdb-launches-tender-for-ec-site-at-jalan-loyang-besar","HDB Launches Tender for Executive Condominium Site at Jalan Loyang Besar","HDB Launches Tender for Executive Condominium Site at Jalan Loyang Besar"],
  ["/hdb-pulse/news/2024/hdb-to-refund-goods-and-services-tax-on-administrative-fees","HDB to Refund Goods and Services Tax (GST) on Administrative Fees for Renting Out of Flat/Bedroom and Compulsory Acquisition","The Housing & Development Board (HDB) will be refunding the Goods and Services Tax (GST) that was wrongly charged on administrative fees for owners who rent out their HDB flats and bedrooms, as well as for the compulsory acquisition of flats due to infringemen"],
  ["/hdb-pulse/news/2024/hdb-to-scale-up-the-use-of-robotics-and-automation-at-construction-sites","HDB to Scale Up the Use of Robotics and Automation at Construction Sites to Increase Construction Productivity","Starting from next year, HDB will progressively expand the use of robots to carry out painting and skimming works across approximately half of new Build-To-Order (BTO) construction sites, to enhance site productivity and deliver better homes for Singaporeans."],
  ["/hdb-pulse/news/2024/hdb-unveils-development-plans-for-sembawang-north-and-woodlands-north-coast","HDB Unveils Development Plans for Sembawang North and Woodlands North Coast","At the HDB Awards Ceremony on 22 October 2024, Minister for National Development Mr Desmond Lee announced plans to develop two new housing areas at Sembawang North and Woodlands North Coast. When fully developed, these two housing areas will offer around 14,00"],
  ["/hdb-pulse/news/2024/hdb-unveils-masterplan-for-chencharu","HDB Unveils Masterplan for Chencharu: A Vibrant Village, Connecting Communities and Heritage","At this year’s Committee of Supply debate on 5 March 2024, Minister for National Development Mr Desmond Lee shared plans to develop a new housing area within Yishun town, as part of efforts to meet housing demand."],
  ["/hdb-pulse/news/2024/hdb-unveils-winning-design-of-inaugural-town-centre-placemaking-challenge-in-bukit-merah","HDB Unveils Winning Design of Inaugural Town Centre Placemaking Challenge in Bukit Merah","OWAA Architects LLP, in collaboration with local artist Tobyato, has won the Bukit Merah Town Centre Placemaking Challenge with their design \"The Tale of the Swordfish & The Seven Hills\"."],
  ["/hdb-pulse/news/2024/making-our-homes-and-neighbourhoods-safer-for-seniors","Making our Homes and Neighbourhoods Safer for Seniors","At MND’s Committee of Supply debate today, Minister of State for National Development, Dr Muhammad Faishal Ibrahim provided updates on various initiatives under the national Age Well SG programme, to help seniors age safely and independently within their homes"],
  ["/hdb-pulse/news/2024/measures-to-cool-the-hdb-resale-market-and-provide-more-support-for-first-time-home-buyers","Measures to Cool the HDB Resale Market and Provide More Support for First-Time Home Buyers","MND and HDB announced today a set of measures to cool the HDB resale market, and to provide more support to lower-to-middle income first-time home buyers."],
  ["/hdb-pulse/news/2024/more-coffee-shops-to-offer-budget-meals-to-boost-affordable-food-options","More Coffee Shops to Offer Budget Meals to Boost Affordable Food Options","More coffee shops in the heartlands will soon offer budget meals to provide affordable food options for residents. Another 180 coffee shops under nine private chain operators will provide budget meals, marking an expansion of the budget meal initiative beyond "],
  ["/hdb-pulse/news/2024/new-family-care-scheme-to-support-parents-and-children-to-live-closer-together","Bringing Families Closer: New Family Care Scheme to Support Parents and Children to Live Closer Together","From mid-2025, both married and single children will enjoy priority access when they apply for a new flat to live with or near their parents, under the new Family Care Scheme (FCS)."],
  ["/hdb-pulse/news/2024/new-flat-classification-framework","New Flat Classification Framework to Ensure Affordable Homeownership, a Good Social Mix, and a Fair System","HDB will offer 8,573 Standard, Plus, and Prime flats across 15 projects under the New Flat Classification Framework in the October 2024 Build-To-Order (BTO) exercise – the largest number of projects launched in a BTO exercise to date."],
  ["/hdb-pulse/news/2024/new-resale-flat-listing-service","New Resale Flat Listing Service Enables HDB Flat Owners to List & Market their Flat on the HDB Flat Portal","The Resale Flat Listing (RFL) service seeks to create a transparent, reliable and trusted marketplace for the listing and transactions of HDB resale flats."],
  ["/hdb-pulse/news/2024/oct-bto-launch","HDB Launches Record Number of Projects in October 2024 BTO Exercise under New Flat Classification Framework","HDB launched 8,573 Standard, Plus, and Prime flats in 15 projects under a new flat classification framework in the October 2024 Build-To-Order (BTO) exercise today."],
  ["/hdb-pulse/news/2024/official-launch-of-resale-flat-listing-service-on-hdb-flat-portal","Official Launch of Resale Flat Listing Service on HDB Flat Portal","Since the soft launch of the Resale Flat Listing (RFL) service on 13 May 2024, over 600 resale flats have been listed for sale on the HDB Flat Portal. The RFL service on the HDB Flat Portal has been officially launched today, on 30 May 2024."],
  ["/hdb-pulse/news/2024/opening-of-bidadari-park-and-alkaff-lake","Joint Press Release by HDB, NParks, PUB and NHB - Opening of Bidadari Park and Alkaff Lake Marks Another Milestone in Realising the Vision for Bidadari Estate","The newly opened Bidadari Park and Alkaff Lake marks yet another milestone in realising Bidadari estate’s vision as “A Community in a Garden”, where homes and facilities are situated in a garden-like setting, offering residents a unique “living in a park” expe"],
  ["/hdb-pulse/news/2024/over-53k-more-homes-to-be-upgraded-under-hdbs-hip","Over 53,000 More Homes to be Upgraded Under HDB’s Home Improvement Programme (HIP)","The Ministry of National Development (MND) and Housing & Development Board (HDB) have selected over 53,000 HDB flats for upgrading, in the latest selection of the Home Improvement Programme (HIP)."],
  ["/hdb-pulse/news/2024/pet-cat-licensing-scheme-to-start-on-1-sept-24","Joint Press Release by AVS and HDB - Pet Cat Licensing Scheme to Start on 1 September 2024","All cat owners can license their microchipped pet cats from 1 September 2024, with the roll out of the Cat Management Framework announced by the Animal & Veterinary Service (AVS) in May 2024 to improve the management and welfare of cats in Singapore. AVS, a cl"],
  ["/hdb-pulse/news/2024/pphs-doubled-by-2025","Supply of HDB Flats under Parenthood Provisional Housing Scheme to Double to 4,000 Units by 2025","The Housing & Development Board (HDB) will double the supply of flats available under the Parenthood Provisional Housing Scheme (PPHS), from 2,000 flats currently to 4,000 flats by 2025."],
  ["/hdb-pulse/news/2024/pphs-open-market-voucher-scheme","HDB to Launch the Parenthood Provisional Housing Scheme (Open Market) Voucher Scheme on 1 July 2024","From 1 July 2024, HDB will be launching the Parenthood Provisional Housing Scheme (PPHS) (Open Market) Voucher scheme to provide temporary support for young couples and families who are renting from the open market while awaiting the completion of their new fl"],
  ["/hdb-pulse/news/2024/provisional-tender-results-for-land-parcel","Provisional Tender Results for Land Parcel at Jalan Loyang Besar for Executive Condominium Housing Development","Provisional Tender Results for Land Parcel at Jalan Loyang Besar for Executive Condominium Housing Development"],
  ["/hdb-pulse/news/2024/provisional-tender-results-for-land-parcel-at-plantation-close-for-ec-housing-development","Provisional Tender Results for Land Parcel at Plantation Close for Executive Condominium Housing Development","The Housing & Development Board (HDB), as the Government’s land sales agent, launched the land parcel at Plantation Close for sale by public tender on 30 November 2023."],
  ["/hdb-pulse/news/2024/provisional-tender-results-for-land-parcel-at-tampines-street-95","Provisional Tender Results for Land Parcel at Tampines Street 95 for Executive Condominium Housing Development","The Housing & Development Board (HDB), as the Government's land sales agent, launched the land parcel at Tampines Street 95 for sale by public tender on 22 August 2024."],
  ["/hdb-pulse/news/2024/provisional-tender-results-for-tampines-street-94","Provisional Tender Results for Land Parcel at Tampines Street 94 for Mixed Commercial and Residential Development","The Housing & Development Board (HDB), as the Government’s land sales agent, launched the land parcel at Tampines Street 94 for sale by public tender on 27 June 2024."],
  ["/hdb-pulse/news/2024/public-invited-to-submit-recommendations-of-budget-meals-at-hdb-coffee-shops-islandwide","Public Invited to Submit Recommendations of Budget Meals at HDB Coffee Shops Islandwide","To help residents find budget meals in housing estates more easily, the Government has piloted a new initiative called the Great Budget Meal Hunt to crowdsource recommendations of budget meals in Housing & Development Board (HDB) coffee shops. This initiative "],
  ["/hdb-pulse/news/2024/silver-upgrading-programme-to-be-rolled-out-in-26-precincts-to-support-ageing-in-place","Silver Upgrading Programme to be Rolled Out in 26 Precincts in Ang Mo Kio, Bukit Merah, Queenstown, and Toa Payoh to Support Ageing-in-Place","In line with Age Well SG, HDB will launch the Silver Upgrading Programme (SUP), to help seniors age-in-place more comfortably by upgrading existing HDB precincts with higher densities of seniors to include senior-centric features."],
  ["/hdb-pulse/news/2024/temporary-road-closure-along-hougang-ave-3-btw-defu-ave-1","Temporary Road Closure along Hougang Avenue 3 between Defu Avenue 1 and Lorong Ah Soo for Construction of New Pedestrian Overhead Bridge","On 11 October 2024, a section of Hougang Avenue 3 will be closed off temporarily to traffic from 1:45am to 5:00am. The closed section of the road will be between the road junctions of Defu Avenue 1/ Hougang Avenue 3 and Lorong Ah Soo/ Hougang Avenue 3."],
  ["/hdb-pulse/news/2024/temporary-road-closure-along-new-punggol-road","Temporary Road Closure Along New Punggol Road for Construction of New Pedestrian Overhead Bridge","On 17 October 2024 (Thursday), a section of New Punggol Road will be temporarily closed to traffic from 1.00am to 5.00am. The closed section of the road will be between the junctions of New Punggol Road/Northshore Drive and New Punggol Road/Punggol Way."],
  ["/hdb-pulse/news/2024/temporary-road-closure-along-tampines-avenue-10-for-construction-of-new-pedestrian-overhead-bridge","Temporary Road Closure Along Tampines Avenue 10 for Construction of New Pedestrian Overhead Bridge","Temporary Road Closure"],
  ["/hdb-pulse/news/2024/temporary-road-closures-at-changi-road-and-geylang-serai-road","Temporary Road Closures at Changi Road and Geylang Serai Road for Hoisting of New Gateway Arch and Road Painting Works","Temporary Closure of Changi Road and Geylang Serai Road for Hoisting of New Gateway Arch"],
  ["/hdb-pulse/news/2024/upcoming-flat-supply-1st-quarter-2024-public-housing-data","Upcoming Flat Supply and 1st Quarter 2024 Public Housing Data","HDB remains committed to providing affordable and accessible housing options to Singaporeans, especially for first-time home buyers."],
  ["/hdb-pulse/news/2024/upcoming-flat-supply-and-2nd-quarter-2024-public-housing-data","Upcoming Flat Supply and 2nd Quarter 2024 Public Housing Data","HDB will offer about 8,500 flats across 15 Build-To-Order (BTO) projects in the October 2024 BTO exercise."],
  ["/hdb-pulse/news/2024/upcoming-flat-supply-and-4th-quarter-2023-public-housing-data","Upcoming Flat Supply and 4th Quarter 2023 Public Housing Data","Upcoming flat supply"],
  ["/hdb-pulse/news/2024/upcoming-flat-supply-and-flash-estimate-of-1st-quarter-2024-resale-price-index","Upcoming Flat Supply and Flash Estimate of 1st Quarter 2024 Resale Price Index","HDB is committed to providing affordable and accessible housing options to Singaporeans for every budget and need, especially for first-time home buyers. In June 2024, HDB will offer about 6,800 BTO flats. The RPI provides information on the general price move"],
  ["/hdb-pulse/news/2024/upcoming-flat-supply-and-flash-estimate-of-2nd-quarter-2024-resale-price-index","Upcoming Flat Supply and Flash Estimate of 2nd Quarter 2024 Resale Price Index","HDB will offer about 8,500 flats in 15 Build-To-Order (BTO) projects in the October 2024 BTO exercise. The new BTO projects will be offered as Standard, Plus or Prime flats based on their specific locational attributes. More details on the projects will be sha"],
  ["/hdb-pulse/news/2024/upcoming-flat-supply-and-flash-estimate-of-3rd-quarter-2024-rpi","Upcoming Flat Supply and Flash Estimate of 3rd Quarter 2024 Resale Price Index","In the October 2024 Build-To-Order (BTO) exercise, the Housing and Development Board (HDB) will offer approximately 8,500 flats across 15 projects, marking the largest supply among the three launches this year. This offering constitutes over 40% of the total n"],
  ["/hdb-pulse/news/2024/upcoming-flat-supply-and-flash-estimate-of-4th-quarter-2023-resale-price-index","Upcoming Flat Supply and Flash Estimate of 4th Quarter 2023 Resale Price Index","To address the robust demand for housing, HDB launched a total of 22,780 Build-To-Order (BTO) flats for sale in 2023."],
  ["/hdb-pulse/news/2024/upcoming-sbf-exercise-in-february-2025-and-3rd-quarter-2024-public-housing-data","Upcoming SBF Exercise in February 2025 and 3rd Quarter 2024 Public Housing Data","In 2024, HDB launched 21,225 new flats, comprising 19,637 Build-To-Order (BTO) flats and 1,588 flats offered under the Sale of Balance Flats (SBF) exercise in February 2024."],
  ["/hdb-pulse/news/2024/upgrading-projects-in-hdb-ncs-benefiting-more-than-15600-households","Over $95 Million Set Aside to Fund 23 Upgrading Projects in HDB Neighbourhoods, Benefiting More than 15,600 Households","The Ministry of National Development (MND) and Housing & Development Board (HDB) have selected 23 projects for upgrading in the latest 15th batch of the Neighbourhood Renewal Programme (NRP). These projects are located island-wide including Hougang, Choa Chu K"],
  ["/hdb-pulse/news/2024/ura-hdb-release-four-sale-sites","Joint Press Release: URA and HDB Release Four Sale Sites at Lentor Gardens, River Valley Green (Parcel B), Marina Gardens Lane and Woodlands Drive 17","The Urban Redevelopment Authority (URA) and the Housing & Development Board (HDB) have released four residential sites at Lentor Gardens, River Valley Green (Parcel B), Marina Gardens Lane, and Woodlands Drive 17 (Executive Condominium) for sale today under th"],
  ["/hdb-pulse/news/2025/25000-new-flats-will-be-launched-in-2025","Joint Press Release by MND & HDB - 25,000 New Flats will be Launched in 2025","In an interview given to media earlier this week, Minister Desmond Lee announced that HDB will launch over 25,000 new flats in 2025."],
  ["/hdb-pulse/news/2025/2nd-quarter-2025-public-housing-data-and-upcoming-flat-supply","2nd Quarter 2025 Public Housing Data and Upcoming Flat Supply","HDB’s Resale Price Index for 2nd Quarter 2025 is 202.9, representing an increase of 0.9% over the 1st Quarter of 2025. Price growth has moderated for the third consecutive quarter, and this is the lowest quarter-on-quarter growth since 2Q2020."],
  ["/hdb-pulse/news/2025/3rd-quarter-2025-public-housing-data-and-upcoming-flat-supply","3rd Quarter 2025 Public Housing Data and Upcoming Flat Supply","HDB’s Resale Price Index for 3rd Quarter 2025 is 203.7, an increase of 0.4% over that in 2nd Quarter 2025. Price growth has moderated for the fourth consecutive quarter, and this is the lowest quarter-on-quarter growth since 2Q2020."],
  ["/hdb-pulse/news/2025/about-3300-flats-with-swt-to-be-offered-in-the-oct-2025-bto-exercise","About 3,300 Flats with Shorter Waiting Times of Less Than Three Years to be Offered in the October 2025 BTO Exercise","3,294 Build-To-Order (BTO) flats with wait times of less than three years will be offered in the upcoming sales exercise in October 2025, making up more than a third of the 9,100 BTO flats to be launched."],
  ["/hdb-pulse/news/2025/all-buyers-of-last-two-pandemic-delayed-bto-projects-have-been-scheduled-to-collect-their-keys","All Buyers of Last Two Pandemic-Delayed BTO Projects Have Been Scheduled to Collect Their Keys","All 1,651 flat buyers of the final two pandemic-delayed HDB housing projects – Punggol Point Cove (Phase 2) and Kempas Residences – have been invited to collect the keys to their new homes, closing the chapter on HDB’s five-year journey to deliver all the pand"],
  ["/hdb-pulse/news/2025/cpf-interest-rates-from-1-april-to-30-june-2025","CPF Interest Rates from 1 April to 30 June 2025","The Special, MediSave and Retirement Account (SMRA) interest rate will remain unchanged at the floor rate of 4% per annum from 1 April to 30 June 2025, as the SMRA pegged rate remains below the floor rate of 4%. The Ordinary Account (OA) interest rate will rem"],
  ["/hdb-pulse/news/2025/cpf-interest-rates-from-1-january-to-31-march-2026-and-basic-healthcare-sum-for-2026","CPF Interest Rates from 1 January to 31 March 2026 and Basic Healthcare Sum for 2026","The Special, MediSave and Retirement Account (SMRA) interest rate will remain unchanged at the floor rate of 4% per annum from 1 January to 31 March 2026, as the SMRA pegged rate remains below the floor rate of 4%."],
  ["/hdb-pulse/news/2025/cpf-interest-rates-from-1-jul-to-30-sep-2025","CPF Interest Rates from 1 July to 30 September 2025","The Special, MediSave and Retirement Account (SMRA) interest rate will remain unchanged at the floor rate of 4% per annum from 1 July to 30 September 2025, as the SMRA pegged rate remains below the floor rate of 4%."],
  ["/hdb-pulse/news/2025/enhancements-to-silver-housing-bonus-to-boost-retirement-income-for-seniors-right-sizing-their-homes","Enhancements to Silver Housing Bonus to boost retirement income for seniors right-sizing their homes","At MND’s Committee of Supply debate today, Minister for National Development Mr Desmond Lee announced several enhancements to the Silver Housing Bonus (SHB) to provide greater support to seniors who right-size to a 3-room or smaller HDB flat to supplement thei"],
  ["/hdb-pulse/news/2025/final-tender-results-chencharu-close-sembawang-road","Final Tender Results for: (i) Mixed Commercial and Residential Development at Chencharu Close; and (ii) Executive Condominium Housing Development at Sembawang Road","The Housing & Development Board (HDB), as the Government’s land sales agent, launched land parcels at Chencharu Close and Sembawang Road for tender on 26 September 2024 and 29 May 2025 respectively."],
  ["/hdb-pulse/news/2025/final-tender-results-for-the-two-ec-housing-development-sites-at-senja-close-and-woodlands-drive-17","Final Tender Results for the Two Executive Condominium Housing Development Sites at Senja Close and Woodlands Drive 17","The Housing & Development Board (HDB), as the Government’s land sales agent, launched tenders for the land parcels at Senja Close on 21 March 2025 and Woodlands Drive 17 on 8 April 2025."],
  ["/hdb-pulse/news/2025/final-two-pandemic-delayed-housing-projects-completed-in-january-2025","Final Two Pandemic-Delayed Housing Projects Completed in January 2025","Minister for National Development Desmond Lee announced the completion of the final two pandemic-delayed projects from the Housing & Development Board (HDB) – Punggol Point Cove (Phase 2)[1] and Kempas Residences. Minister highlighted that HDB had been working"],
  ["/hdb-pulse/news/2025/first-gp-clinic-tender-awarded-under-price-quality-method","First General Practitioner Clinic Tender Awarded under Price-Quality Method","The Ministry of Health (MOH) and Housing & Development Board (HDB) have awarded the tender for a General Practitioner (GP) clinic at Bartley Beacon, a Build-To-Order (BTO) project in Bidadari estate, under the new Price-Quality Method (PQM)."],
  ["/hdb-pulse/news/2025/flash-estimate-of-2nd-quarter-2025-resale-price-index-and-upcoming-flat-supply","Flash Estimate of 2nd Quarter 2025 Resale Price Index and Upcoming Flat Supply","HDB’s flash estimate of the 2nd Quarter 2025 Resale Price Index (RPI) is 202.8, an increase of 0.9% over that in the 1st Quarter 2025. This marks the third consecutive quarter of slowdown in price growth, and is the lowest quarter-on-quarter growth since 2Q202"],
  ["/hdb-pulse/news/2025/flash-estimate-of-3rd-quarter-2025-resale-price-index-and-upcoming-flat-supply","Flash Estimate Of 3rd Quarter 2025 Resale Price Index and Upcoming Flat Supply","HDB’s flash estimate of the 3rd Quarter 2025 Resale Price Index (RPI) is 203.7, an increase of 0.4% over that in the 2nd Quarter 2025 (see Annexes A1 and A2). This marks the fourth consecutive quarter of slowing resale price growth and the lowest quarter-on-qu"],
  ["/hdb-pulse/news/2025/government-extends-4percent-interest-rate","Government Extends 4% Interest Rate Floor on Special, MediSave and Retirement Account Monies Until 31 December 2026","The Government has extended the 4% interest rate floor for interest earned on all Special, MediSave and Retirement Account (SMRA) monies for another year from 1 January to 31 December 2026."],
  ["/hdb-pulse/news/2025/hdb-community-day-2025-tengah-volunteers-lead-the-way-in-building-stronger-communities","HDB Community Day 2025: Tengah Volunteers Lead the Way in Building Stronger Communities","More than 2,100 residents, volunteers, schools and community groups were honoured today at HDB Community Day 2025 for their dedication to building caring, inclusive and vibrant neighbourhoods across Singapore. Among them were 41 trailblazing volunteers from Te"],
  ["/hdb-pulse/news/2025/hdb-issues-rated-fixed-rate-green-notes-jan25","HDB Issues Rated Fixed Rate Green Notes","The Housing & Development Board (\"HDB\") has issued S$950 million, 5-year Fixed Rate Green Notes (the “Notes”) under its S$32 billion Multicurrency Medium Term Note (\"MTN\") Programme."],
  ["/hdb-pulse/news/2025/hdb-issues-rated-fixed-rate-green-notes-jul25","HDB Issues Rated Fixed Rate Green Notes","The Housing & Development Board (\"HDB\") has issued S$875 million, 5-year Fixed Rate Green Notes (the “Notes”) under its S$42 billion Multicurrency Medium Term Note (\"MTN\") Programme."],
  ["/hdb-pulse/news/2025/hdb-issues-rated-fixed-rate-green-notes-oct25","HDB Issues Rated Fixed Rate Green Notes","The Housing & Development Board (\"HDB\") has issued S$1.2 billion, 5-year Fixed Rate Green Notes (the “Notes”) under its S$42 billion Multicurrency Medium Term Note (\"MTN\") Programme."],
  ["/hdb-pulse/news/2025/hdb-issues-rated-fixed-rate-notes-feb25","HDB Issues Rated Fixed Rate Notes","The Housing & Development Board (\"HDB\") has issued S$700 million, 7-year Fixed Rate Notes (the “Notes”) under its S$32 billion Multicurrency Medium Term Note (\"MTN\") Programme."],
  ["/hdb-pulse/news/2025/hdb-issues-rated-fixed-rate-notes-jul25","HDB Issues Rated Fixed Rate Notes","The Housing & Development Board (\"HDB\") has issued S$700 million, 7-year Fixed Rate Notes (the “Notes”) under its S$42 billion Multicurrency Medium Term Note (\"MTN\") Programme."],
  ["/hdb-pulse/news/2025/hdb-issues-rated-fixed-rate-notes-nov25","HDB Issues Rated Fixed Rate Notes","The Housing & Development Board (\"HDB\") has issued S$1 billion, 7-year Fixed Rate Notes (the “Notes”) under its S$42 billion Multicurrency Medium Term Note (\"MTN\") Programme."],
  ["/hdb-pulse/news/2025/hdb-issues-rated-fixed-rate-notes-sep25","HDB Issues Rated Fixed Rate Notes","The Housing & Development Board (\"HDB\") has issued S$1 billion, 10-year Fixed Rate Notes (the “Notes”) under its S$42 billion Multicurrency Medium Term Note (\"MTN\") Programme."],
  ["/hdb-pulse/news/2025/hdb-launches-10209-flats-in-the-july-2025-bto-and-sbf-sales-exercises","HDB Launches 10,209 Flats in the July 2025 BTO and SBF Sales Exercises","HDB launched 10,209 flats for sale today, under the July 2025 Build-To-Order (BTO) and Sale of Balance Flats (SBF) exercises."],
  ["/hdb-pulse/news/2025/hdb-launches-10622-flats-in-february-2025-bto-and-sbf-exercises","HDB Launches 10,622 Flats in February 2025 BTO and SBF Exercises","HDB has launched 10,622 flats for sale today, under the February 2025 Build-To-Order (BTO) and Sale of Balance Flats (SBF) exercises."],
  ["/hdb-pulse/news/2025/hdb-launches-sale-site-at-senja-close","HDB Launches Sale Site at Senja Close","The Housing & Development Board (HDB), as the Government’s land sales agent, has launched an Executive Condominium site at Senja Close for sale by public tender today, under the Confirmed List of first half 2025 (1H2025) Government Land Sales (GLS) Programme."],
  ["/hdb-pulse/news/2025/HDB-launches-tender-for-sale-site-at-miltonia-close","HDB Launches Tender for Sale Site at Miltonia Close","The Housing & Development Board (HDB), as the Government’s land sales agent, has launched an Executive Condominium (EC) site at Miltonia Close for sale by public tender today."],
  ["/hdb-pulse/news/2025/hdb-launches-tender-for-sale-site-at-woodlands-drive-17","HDB Launches Tender for Sale Site at Woodlands Drive 17","The Housing & Development Board (HDB), as the Government’s land sales agent, has launched an Executive Condominium (EC) site at Woodlands Drive 17 for sale by public tender today."],
  ["/hdb-pulse/news/2025/hdb-launches-tender-for-sale-sites-at-sembawang-road-and-hougang-avenue-10-hougang-central","HDB Launches Tender for Sale Sites at Sembawang Road and Hougang Avenue 10/ Hougang Central","The Housing & Development Board (HDB), as the Government’s land sales agent, has launched an Executive Condominium site at Sembawang Road and a mixed commercial/ residential site at Hougang Avenue 10/ Hougang Central for sale by public tender today."],
  ["/hdb-pulse/news/2025/hdb-spent-over-$6-billion-in-fy-2024-to-keep-public-housing-affordable-and-liveable","HDB Spent Over $6 Billion in FY 2024 to Keep Public Housing Affordable and Liveable","In the Financial Year (FY) 2024, HDB incurred a net deficit of $6.34 billion before government grants. Of this, $5.51 billion was incurred for the Home Ownership segment, covering the development and sale of flats and disbursement of housing grants to eligible"],
  ["/hdb-pulse/news/2025/hdb-to-extend-cool-coatings-initiative-to-all-existing-hdb-estates","HDB to Extend Cool Coatings Initiative to All Existing HDB Estates","HDB will intensify its sustainability efforts to create more energy-efficient and climate-resilient public housing estates, with the 10-year Green Towns Programme (GTP) reaching its mid-point in 2025."],
  ["/hdb-pulse/news/2025/hdb-to-extend-parenthood-provisional-housing-scheme-pphs-voucher-till-31-december-2025","HDB to Extend Parenthood Provisional Housing Scheme (PPHS) Voucher till 31 December 2025","To support young couples and families who are renting from the open market while awaiting the completion of their new flats, HDB will extend the Parenthood Provisional Housing Scheme (PPHS) Voucher by six months till 31 December 2025."],
  ["/hdb-pulse/news/2025/hdb-to-launch-first-bto-project-in-sembawang-north-in-the-july-sales-exercise","HDB to Launch First BTO Project in Sembawang North in the July Sales Exercise","HDB will launch its first Build-To-Order (BTO) project in the new Sembawang North neighbourhood during the July 2025 BTO sales exercise."],
  ["/hdb-pulse/news/2025/hdb-unveils-masterplan-for-berlayar-estate","HDB Unveils Masterplan for Berlayar Estate: Harbourfront Living Close to Nature","Minister for National Development, Mr Chee Hong Tat unveiled the masterplan for Berlayar estate at the HDB Awards Ceremony on 23 September 2025. Located at the site of the former Keppel Club, the new estate marks the start of the transformation of the Greater "],
  ["/hdb-pulse/news/2025/hdb-unveils-masterplan-for-mount-pleasant","HDB Unveils Masterplan for Mount Pleasant: A Rich Tapestry of Homes, Heritage and Nature","HDB had earlier announced the conceptual development plans to transform Mount Pleasant into a distinctive new housing estate that interweaves modern new homes, conserved heritage buildings, and lush green spaces. Following further detailed planning studies, th"],
  ["/hdb-pulse/news/2025/new-fcs-proximity-better-supports-parents-and-children-to-live-closer-together","New Family Care Scheme (Proximity) Better Supports Parents and Children to Live Closer Together","From the July 2025 sales exercises, married and single children will enjoy priority access when they apply for a new flat to live with or near their parents, under the new Family Care Scheme (FCS) (Proximity)."],
  ["/hdb-pulse/news/2025/new-hdb-playgrounds-to-enhance-childrens-play-experiences-and-support-holistic-development","New HDB Playgrounds to Enhance Children’s Play Experiences and Support Holistic Development","From January 2026, playgrounds in newly tendered Build-To-Order (BTO) developments, as well as new HDB parks, will introduce more engaging and diverse play experiences for children. Guided by the new Play Values Framework, the new HDB playgrounds will be speci"],
  ["/hdb-pulse/news/2025/new-river-crab-playground-designed-and-built-by-2000-residents-makes-a-splash-in-toa-payoh","New River Crab Playground, Designed and Built by 2,000 Residents, Makes a Splash in Toa Payoh","About 2,000 Toa Payoh residents, students, and community stakeholders have created a distinctive River Crab playground, which will be a new landmark in Toa Payoh. Located at 9 Lorong 7 Toa Payoh, the new playground replaces an existing one at Toa Payoh N1 Neig"],
  ["/hdb-pulse/news/2025/new-sport-in-precinct-facility-in-kolam-ayer","Joint Press Release by SportsSG, URA and HDB: New Sport-in-Precinct facility in Kolam Ayer to keep community active as Kallang Basin Swimming Complex and St Wilfred Sport Centre close for redevelopment","The community can look forward to a new Sport-in-Precinct facility in Kolam Ayer, even as Kallang Basin ActiveSG Swimming Complex and St Wilfred ActiveSG Sport Centre cease operations permanently in the second half of 2025 upon their lease expiry."],
  ["/hdb-pulse/news/2025/october-2025-bto-sales-exercise","HDB Launches 9,144 Flats across 10 Projects in October 2025 BTO Sales Exercise","HDB launched 9,144 flats across 10 projects in Ang Mo Kio, Bedok, Bishan, Bukit Merah, Jurong East, Sengkang, Toa Payoh, and Yishun for sale today under the October 2025 Build-To-Order (BTO) exercise."],
  ["/hdb-pulse/news/2025/over-29000-more-homes-to-be-upgraded-under-hdbs-home-improvement-programme-hip","Over 29,000 More Homes to be Upgraded Under HDB’s Home Improvement Programme (HIP)","The Ministry of National Development (MND) and Housing & Development Board (HDB) have selected over 29,000 HDB flats (refer to Annex A) for upgrading, in the latest selection of the HIP."],
  ["/hdb-pulse/news/2025/over-36000-hdb-households-to-benefit-from-upgrading-projects","Over 36,000 HDB Households to Benefit from Upgrading Projects","At the Community Build Day event at Toa Payoh N1 Neighbourhood Park on 6 April, Minister for National Development Desmond Lee announced that over 36,000 HDB households will benefit from the upgrading works to be implemented under the latest batch of the Neighb"],
  ["/hdb-pulse/news/2025/price-quality-method-tender-pilot-for-private-general-practitioner-clinic-at-bartley-beacon","Price-Quality Method Tender Pilot for Private General Practitioner Clinic at Bartley Beacon","The Ministry of Health (MOH) and Housing & Development Board (HDB) will jointly pilot the new Price-Quality Method (PQM) tender approach to holistically evaluate both price and quality factors when renting out HDB shops to General Practitioner (GP) clinics."],
  ["/hdb-pulse/news/2025/providing-more-support-for-home-buyers-and-public-rental-families","Providing More Support for Home Buyers and Public Rental Families","At MND’s Committee of Supply debate today, Minister for National Development, Mr Desmond Lee, and Minister of State for National Development Associate Professor Muhammad Faishal Ibrahim, announced several measures to enhance public housing accessibility and st"],
  ["/hdb-pulse/news/2025/provisional-tender-results-chencharu-close-and-sembawang-road","Provisional Tender Results for: (i) Mixed Commercial and Residential Development at Chencharu Close; and (ii) Executive Condominium Housing Development at Sembawang Road","HDB, as the Government’s land sales agent, launched land parcels at Chencharu Close and Sembawang Road for tender on 26 September 2024 and 29 May 2025 respectively. The tenders have closed and HDB has announced details of the provisional tender results."],
  ["/hdb-pulse/news/2025/provisional-tender-results-for-ec-at-senja-close-and-woodlands-drive-17","Provisional Tender Results For 2 Executive Condominium Housing Development Sites at Senja Close and Woodlands Drive 17","The Housing & Development Board (HDB), as the Government’s land sales agent, launched the land parcel at Senja Close for tender on 21 March 2025, and the land parcel at Woodlands Drive 17 for tender on 8 April 2025."],
  ["/hdb-pulse/news/2025/provisional-tender-results-for-land-parcel-at-hougang-avenue-10-hougang-central","Provisional Tender Results for Land Parcel at Hougang Avenue 10/ Hougang Central for Mixed Commercial and Residential Development","The Housing & Development Board (HDB), as the Government’s land sales agent, launched the land parcel at Hougang Avenue 10/ Hougang Central for sale by public tender on 29 May 2025."],
  ["/hdb-pulse/news/2025/sample-household-survey-2023-24","Sample Household Survey 2023/24: Family Bonds Remained Strong, With More Living Nearer to Each Other","More families chose to live closer to one another, with proximity playing an increasingly important role in strengthening family bonds and enabling more frequent visits between children and parents, HDB’s latest Sample Household Survey (SHS) found. Close to tw"],
  ["/hdb-pulse/news/2025/singapores-first-polder-at-pulau-tekong-adds-800-hectares-of-land","Singapore’s First Polder at Pulau Tekong Adds 800 Hectares of Land","Singapore has reclaimed about 800 hectares of land – the size of about two Toa Payoh towns – at the north-western tip of Pulau Tekong, with the completion of main construction works for Singapore’s first polder."],
  ["/hdb-pulse/news/2025/supermarket-food-court-and-wellness-trail-to-open-at-tengahs-newest-neighbourhood-centre-in-1q-2026","Supermarket, Food Court and Wellness Trail to Open at Tengah’s Newest Neighbourhood Centre in 1Q 2026","Parc Point, Tengah’s second Neighbourhood Centre (NC) after Plantation Plaza, will open in 1Q 2026, with FairPrice supermarket and Gourmet Paradise food court as the first shops to commence operations. The remaining shops will open progressively thereafter, gi"],
  ["/hdb-pulse/news/2025/temporary-road-closure-along-dunman-road-for-demolition-of-pedestrian-overhead-bridge","Temporary Road Closure along Dunman Road for Demolition of Pedestrian Overhead Bridge","A section of Dunman Road, between the cross junction of Tanjong Katong Road and the T-junction of Jalan Dua, will be temporarily closed to traffic from 1:30am to 5:00am on Tuesday, 28 October 2025."],
  ["/hdb-pulse/news/2025/temporary-road-closure-along-west-coast-highway-for-construction-of-new-pedestrian-overhead-bridge","Temporary Road Closure along West Coast Highway for Construction of New Pedestrian Overhead Bridge","A section of West Coast Highway, between the road junctions of West Coast Highway/ West Coast Link and West Coast Highway/ Pandan Crescent, will be temporarily closed to traffic in both directions from Tuesday 2 September 2025 to Friday 4 September 2025, from "],
  ["/hdb-pulse/news/2025/upcoming-flat-supply-and-1st-quarter-2025-public-housing-data","Upcoming Flat Supply and 1st Quarter 2025 Public Housing Data","HDB announces launch of 5,400 BTO flats across seven locations in July 2025, alongside Q1 2025 market updates showing 1.6% increase in resale prices, with plans to deliver over 50,000 new BTO units from 2025 to 2027."],
  ["/hdb-pulse/news/2025/upcoming-flat-supply-and-4th-quarter-2024-public-housing-data","Upcoming Flat Supply And 4th Quarter 2024 Public Housing Data","HDB will launch over 25,000 new flats in 2025 comprising 19,600 Build-To-Order (BTO) flats across three sales exercises and more than 5,500 flats under the Sale of Balance Flats (SBF) exercise. Of the 19,600 BTO flats, about 3,800 units are shorter waiting tim"],
  ["/hdb-pulse/news/2025/upcoming-flat-supply-and-flash-estimate-of-1st-quarter-2025-resale-price-index","Upcoming Flat Supply and Flash Estimate of 1st Quarter 2025 Resale Price Index","HDB’s flash estimate of the 1st Quarter 2025 Resale Price Index (RPI) is 200.9, an increase of 1.5% over that in the 4th Quarter 2024. In July 2025, HDB will launch about 5,400 Build-To-Order (BTO) flats in Bukit Merah, Bukit Panjang, Clementi, Sembawang, Tamp"],
  ["/hdb-pulse/news/2025/upcoming-flat-supply-and-flash-estimate-of-4th-quarter-2024-resale-price-index","Upcoming Flat Supply and Flash Estimate of 4th Quarter 2024 Resale Price Index","In 2024, HDB launched 21,225 new flats, comprising 19,637 Build-To-Order (BTO) flats and 1,588 flats offered under the Sale of Balance Flats (SBF) exercise."],
  ["/hdb-pulse/news/2025/ura-hdb-release-3-residential-sites-lakeside-drive-dunearn-road-woodlands-dr-17","Joint Press Release: URA and HDB release three residential sites at Lakeside Drive, Dunearn Road and Woodlands Drive 17","The Urban Redevelopment Authority (URA) and the Housing & Development Board (HDB) have released three residential sites at Lakeside Drive, Dunearn Road and Woodlands Drive 17 (Executive Condominium (EC)) for sale today under the first half 2025 (1H2025) Govern"],
  ["/hdb-pulse/news/2025/whampoa-park-bags-hdbs-inaugural-landscape-award","Whampoa Park Bags HDB’s Inaugural Landscape Award","A total of 36 projects will be conferred the HDB Awards, in recognition of their excellence in design, engineering, and construction in public housing. Among the winning projects is Whampoa Park, which will receive the first ever HDB Landscape Award."],
  ["/hdb-pulse/news/2026/18000-more-homes-to-be-upgraded-under-hdb-home-improvement-programme","18,000 More Homes to be Upgraded Under HDB’s Home Improvement Programme (HIP)","The Ministry of National Development (MND) and Housing & Development Board (HDB) have selected over 18,000 HDB flats across Singapore for home upgrading works, in the latest selection of the Home Improvement Programme (HIP)."],
  ["/hdb-pulse/news/2026/1q2026-flash-rpi","Flash Estimate of 1st Quarter 2026 Resale Price Index and Upcoming Flat Supply","HDB’s flash estimate of the 1st Quarter 2026 Resale Price Index (RPI) is 203.4, a decrease of 0.1% over that in 4th Quarter 2025."],
  ["/hdb-pulse/news/2026/1q2026-rpi","1st Quarter 2026 Public Housing Data and Upcoming Flat Supply","HDB’s Resale Price Index (RPI) for 1st Quarter 2026 is 203.4, a decrease of 0.1% from that in 4th Quarter 2025."],
  ["/hdb-pulse/news/2026/4th-quarter-2025-public-housing-data-and-upcoming-flat-supply","4th Quarter 2025 Public Housing Data and Upcoming Flat Supply","HDB’s Resale Price Index (RPI) for 4th Quarter 2025 is 203.6, largely unchanged from 3rd Quarter 2025’s index of 203.7. For the first time since 1st Quarter 2020, resale prices have remained flat, following four consecutive quarters of slower price growth. For"],
  ["/hdb-pulse/news/2026/about-1300-swt-flats-to-be-offered-in-feb-2026","About 1,300 Shorter Waiting Time Flats to be Offered in February 2026","HDB will launch 4,692 Build-To-Order (BTO) flats across six projects in the upcoming February 2026 sales exercise."],
  ["/hdb-pulse/news/2026/close-to-29000-hdb-households-to-benefit-from-upgrading-projects-to-enhance-their-neighbourhoods","Close to 29,000 HDB Households to Benefit From Upgrading Projects to Enhance Their Neighbourhoods","Around 29,000 HDB households will benefit from the upgrading works to be implemented under the latest batches of the Neighbourhood Renewal Programme (NRP) and Silver Upgrading Programme (SUP)."],
  ["/hdb-pulse/news/2026/cpf-interest-rates-from-1-april-to-30-june-2026","CPF Interest Rates From 1 April to 30 June 2026","The Special, MediSave and Retirement Accounts (SMRA) interest rate will remain unchanged at the floor rate of 4% per annum from 1 April to 30 June 2026, as the SMRA pegged rate remains below the floor rate of 4%."],
  ["/hdb-pulse/news/2026/cpf-interest-rates-from-1-july-to-30-september-2026","CPF Interest Rates from 1 July to 30 September 2026","The Special, MediSave and Retirement Accounts (SMRA) interest rate will remain unchanged at the floor rate of 4% per annum from 1 July to 30 September 2026, as the SMRA pegged rate remains below the floor rate of 4%."],
  ["/hdb-pulse/news/2026/enhanced-support-for-hdb-coffee-shops","Enhanced Support for HDB Coffee Shops to Provide Affordable Cooked Food Options in HDB Heartlands","HDB will provide enhanced support for HDB coffee shop operators and stallholders who choose to offer budget meal options, to keep the budget meal initiative sustainable while meeting essential needs of residents."],
  ["/hdb-pulse/news/2026/extension-of-temporary-relaxation-of-occupancy-cap-for-rental-of-hdb-flats-and-private-residential","Extension of Temporary Relaxation of Occupancy Cap for Rental of HDB Flats and Private Residential Properties Until 31 December 2028","The Housing & Development Board (HDB) and the Urban Redevelopment Authority (URA) will extend the temporary relaxation of the occupancy cap for rental of larger HDB flats and private residential properties for another two years, until 31 December 2028. This ex"],
  ["/hdb-pulse/news/2026/final-four-projects-in-bidadari-completed","Final Four Projects in Bidadari Completed","HDB has completed the final four Build-to-Order (BTO) projects in Bidadari estate – ParkEdge @ Bidadari, ParkView @ Bidadari, Bartley Beacon, and Bartley GreenRise. This marks the completion of all 12 public housing developments in the estate, delivering 8,872"],
  ["/hdb-pulse/news/2026/final-tender-result-for-ec-woodlands-dr-17","Final Tender Result for Executive Condominium (EC) Development Site at Woodlands Drive 17","The Housing & Development Board (HDB), as the Government’s land sales agent, launched the land parcel at Woodlands Drive 17 for tender on 16 October 2025."],
  ["/hdb-pulse/news/2026/final-tender-result-for-land-parcel-at-miltonia-close","Final Tender Result for Land Parcel at Miltonia Close for Executive Condominium Housing Development","The Housing & Development Board (HDB), as the Government’s land sales agent, launched the land parcel at Miltonia Close on 23 December 2025."],
  ["/hdb-pulse/news/2026/final-tender-result-for-mixed-development-at-hougang-avenue-10-hougang-central","Final Tender Result for Mixed Commercial and Residential Development at Hougang Avenue 10/ Hougang Central","The Housing & Development Board (HDB), as the Government’s land sales agent, launched the land parcel at Hougang Avenue 10/ Hougang Central on 29 May 2025."],
  ["/hdb-pulse/news/2026/flash-estimate-of-2nd-quarter-2026-resale-price-index-and-upcoming-flat-supply","Flash Estimate of 2nd Quarter 2026 Resale Price Index and Upcoming Flat Supply","HDB’s flash estimate of the 2nd Quarter 2026 Resale Price Index (RPI) is 202.7, a decrease of 0.3% over that in 1st Quarter 2026."],
  ["/hdb-pulse/news/2026/hdb-awards-new-centralised-cooling-system-contract-to-keppel-for-9-bto-projects-in-tengah","HDB Awards New Centralised Cooling System Contract to Keppel for Nine BTO projects in Tengah","The Housing & Development Board (HDB) has awarded Keppel Ltd.’s Infrastructure Division (Keppel) a chilled water supply contract to design, install and operate Centralised Cooling Systems (CCS), which are residential cooling systems, at nine upcoming Build-To-"],
  ["/hdb-pulse/news/2026/HDB-issues-rated-fixed-rate-green-notes-may26","HDB Issues Rated Fixed Rate Green Notes","The Housing & Development Board (\"HDB\") has issued S$1.115 billion, 5-year Fixed Rate Green Notes (the “Notes”) under its S$42 billion Multicurrency Medium Term Note (\"MTN\") Programme."],
  ["/hdb-pulse/news/2026/hdb-issues-rated-fixed-rate-notes-jan26","HDB Issues Rated Fixed Rate Notes","The Housing & Development Board (\"HDB\") has issued S$1.2 billion, 10-year Fixed Rate Notes (the \"Notes\") under its S$42 billion Multicurrency Medium Term Note (\"MTN\") Programme."],
  ["/hdb-pulse/news/2026/hdb-issues-rated-fixed-rate-notes-mar26","HDB Issues Rated Fixed Rate Notes","The Housing & Development Board (\"HDB\") has issued S$925 million, 7-year Fixed Rate Notes (the “Notes”) under its S$42 billion Multicurrency Medium Term Note (\"MTN\") Programme."],
  ["/hdb-pulse/news/2026/hdb-issues-rated-fixed-rate-notes-may-26","HDB Issues Rated Fixed Rate Notes","The Housing & Development Board (\"HDB\") has issued S$1.1 billion, 10-year Fixed Rate Notes (the “Notes”) under its S$42 billion Multicurrency Medium Term Note (\"MTN\") Programme."],
  ["/hdb-pulse/news/2026/hdb-launches-6952-flats-across-7-projects-in-june-2026-bto-sales-exercise","HDB Launches 6,952 Flats Across 7 Projects in June 2026 BTO Sales Exercise","HDB launched 6,952 flats across 7 projects in Ang Mo Kio, Bishan, Bukit Merah, Sembawang, and Woodlands for sale today under the June 2026 Build-To-Order (BTO) exercise."],
  ["/hdb-pulse/news/2026/hdb-launches-9012-flats-in-february-2026-bto-and-sbf-exercises","HDB Launches 9,012 Flats in February 2026 BTO and SBF Exercises","HDB launched a total of 9,012 flats for sale today, under the February 2026 Build-To-Order (BTO) and Sale of Balance Flats (SBF) exercises, offering homebuyers a wide range of housing options to meet different housing needs."],
  ["/hdb-pulse/news/2026/hdb-launches-tender-for-sale-site-at-admiralty-walk","HDB Launches Tender for Sale Site at Admiralty Walk","The Housing & Development Board (HDB), as the Government’s land sales agent, has launched an Executive Condominium (EC) site at Admiralty Walk for sale by public tender today."],
  ["/hdb-pulse/news/2026/hdb-launches-tender-for-sale-site-at-canberra-drive","HDB Launches Tender for Sale Site at Canberra Drive","The Housing & Development Board (HDB), as the Government’s land sales agent, has launched an Executive Condominium (EC) site at Canberra Drive for sale by public tender today."],
  ["/hdb-pulse/news/2026/hdb-to-launch-19600-bto-flats-in-2026","HDB to Launch 19,600 BTO Flats in 2026","HDB will launch about 19,600 Build-To-Order (BTO) flats in 2026 across three sales exercises in February, June and October."],
  ["/hdb-pulse/news/2026/hdb-to-launch-three-bto-projects-at-lakeview-and-shunfu-from-june-2026","HDB to Launch Three BTO Projects at Lakeview and Shunfu From June 2026","HDB will launch three Build-To-Order (BTO) projects at Lakeview and Shunfu from June 2026, marking the first time in over four decades that new public housing is introduced in these areas."],
  ["/hdb-pulse/news/2026/more-than-2500-flats-with-wait-times-of-around-three-years-or-less","More than 2,500 Flats with Wait Times of Around Three Years or Less to Be Offered in June 2026 BTO Sales Exercise","HDB will offer 2,520 Build-To-Order (BTO) flats with wait times of around three years or less in the upcoming June 2026 BTO sales exercise, providing more options for homebuyers who wish to get their flats sooner."],
  ["/hdb-pulse/news/2026/preparatory-works-for-long-island-project-to-commence-from-end-2026","Preparatory Works for 'Long Island' Project to Commence From End-2026; Measures to Be Implemented to Mitigate Impact on the Environment and Community","Preparatory works for ‘Long Island’, Singapore’s large-scale critical coastal protection strategy, will commence from end-2026."],
  ["/hdb-pulse/news/2026/provisional-tender-results-for-executive-condominium-development-site-at-miltonia-close","Provisional Tender Results for Executive Condominium Development Site at Miltonia Close","The Housing & Development Board (HDB), as the Government’s land sales agent, launched the land parcel at Miltonia Close for tender on 23 December 2025."],
  ["/hdb-pulse/news/2026/provisional-tender-results-for-executive-condominium-development-site-at-woodlands-drive-17","Provisional Tender Results for Executive Condominium Development Site at Woodlands Drive 17","The Housing & Development Board (HDB), as the Government’s land sales agent, launched the land parcel at Woodlands Drive 17 for tender on 16 October 2025."],
  ["/hdb-pulse/news/2026/public-housing-projects-will-be-developed-in-pearls-hill-and-toa-payoh-west","Public Housing Projects will be Developed in Pearl’s Hill and Toa Payoh West","At MND’s Committee of Supply debate today, Minister for National Development, Mr Chee Hong Tat, announced plans to develop public housing projects in Pearl’s Hill and Toa Payoh West to provide more housing options for Singaporeans. Senior Minister of State (SM"],
  ["/hdb-pulse/news/2026/residents-in-new-large-scale-bto-estates-to-enjoy-earlier-access-to-amenities","Residents in New Large-Scale Build-To-Order (BTO) Estates to Enjoy Earlier Access to Cooked Food, Groceries, Childcare and Bus Services","Going forward, residents moving into new large-scale BTO estates will enjoy earlier access to cooked food, groceries, childcare centres and bus services, up to three months earlier than before. Other measures to provide an enhanced living environment for these"],
  ["/hdb-pulse/news/2026/temporary-road-closure-along-bartley-road","Temporary Road Closure Along Bartley Road for Construction of New Pedestrian Overhead Bridge","On Sunday, 5 April 2026, a section of Bartley Road will be temporarily closed to traffic from 1:00 am to 5:30 am. The closed section of the road will be between the junction of Mount Vernon Road and Bidadari Park Drive."],
  ["/hdb-pulse/news/2026/temporary-road-closure-at-t-junction-between-tampines-ave-1-and-tampines-st-96","Temporary Road Closure at T-Junction between Tampines Avenue 1 and Tampines Street 96 for Demolition of Pedestrian Overhead Bridge","The T-junction between Tampines Avenue 1 and Tampines Street 96, will be temporarily closed to traffic from 1:00am to 5:00am on Saturday, 17 January 2026."],
  ["/hdb-pulse/news/2026/upcoming-flat-supply-4Q2025-rpi","Flash Estimate of 4th Quarter 2025 Resale Price Index and Upcoming Flat Supply","HDB’s flash estimate of the 4th Quarter 2025 Resale Price Index (RPI) is 203.6, largely unchanged from 3rd Quarter 2025’s index of 203.7."],
  ["/hdb-pulse/news/bto-table-template","BTO table template","BTO table template"],
  ["/hdb-pulse/publications","Publications","Learn more about Singapore's public housing story through our publications."],
  ["/hdb-pulse/publications/hdb-publications","HDB Publications","Read our publications to learn more about our public housing journey in Singapore."],
  ["/hdb-pulse/publications/life-storeys","Life Storeys","Our community publication brings you heartfelt human stories and interesting lifestyle features, to keep you updated on exciting happenings in your estate."],
  ["/hdb-pulse/reports","Reports","Read our annual reports and financial statements."],
  ["/hdb-pulse/reports/annual-reports-and-financial-statements","Annual Reports and Financial Statements","Learn more about our corporate, financial and sustainability performance."],
  ["/hdb-pulse/reports/green-finance-framework-and-reports","Green Finance Framework and Reports","Read about HDB’s Green Finance Framework and Green Finance Reports."],
  ["/hdb-renovation-portal/get-help","Get Help",""],
  ["/hdb-renovation-portal/terms-and-conditions","Terms and Conditions",""],
  ["/hdb-resale-portal-intent-to-buy/sell/employment-status","Employment Status",""],
  ["/hdb-resale-portal-intent-to-buy/terms-and-conditions","Terms and Conditions",""],
  ["/hdb-resale-portal-intent-to-sell/terms-and-conditions","Terms and Conditions",""],
  ["/hdbfileshare/get-help","Get Help",""],
  ["/hdbnews/budget-statement-2023","Budget Statement 2023","Learn more about the latest housing announcements in the Budget Statement 2023."],
  ["/hdbnews/committee-of-supply-2023","Committee of Supply 2023","Learn more about the latest housing announcements at the Committee of Supply Debate 2023."],
  ["/hdbnews/committee-of-supply-2024","Committee of Supply 2024","Learn more about the latest housing announcements at the Committee of Supply Debate 2024."],
  ["/hdbnews/committee-of-supply-2025","Committee of Supply 2025","Learn more about the latest housing announcements at the Committee of Supply Debate 2025."],
  ["/hdbnews/national-day-rally-2023-housing-announcements","National Day Rally 2023 Housing Announcements","Find out about the new measures to keep public housing affordable, accessible and inclusive."],
  ["/hip-e-opting/get-help","Get Help",""],
  ["/hip-e-opting/terms-and-conditions","Terms and Conditions",""],
  ["/hip/b12/open-field-beside-joo-chiat-complex-loading-bay-entrance","Home Improvement Programme at Blocks 3, 4 Joo Chiat Road",""],
  ["/hip/b13/G29H/50-moh-guan-terrace","Home Improvement Programme at Blocks 17 to 29, 33 to 38, 41 to 50 Tiong Bahru Road/ Lim Liak Street/ Kim Cheng Street/ Kim Pong Road/ Moh Guan Terrace/ Seng Poh Road",""],
  ["/hip/b14/G32D/C/503-bishan-st-11","Home Improvement Programme at Blocks 501 - 514, 505A, 505B, 505C, 505D, 514A, 514B & 514C Bishan Street 11/13",""],
  ["/hip/b15/G33A/244-simei-st-5","Home Improvement Programme at Blocks 242 to 247 and 253 to 256 Simei Street 1/ 5",""],
  ["/hip/b15/G33A/363-hougang-ave-5","Home Improvement Programme at Blocks 358 to 363 Hougang Avenue 5",""],
  ["/hip/b15/G33A/5-boon-keng-rd","Home Improvement Programme at Blocks 4, 5 and 6 Boon Keng Road",""],
  ["/hip/b15/G33A/833-hougang-central","Home Improvement Programme at Blocks 830 to 835 Hougang Central",""],
  ["/hip/b15/G33B/46-lor-5-tpy","Home Improvement Programme at Blocks 35 to 37, 43 to 46 & 48 to 50 Lorong 5 Toa Payoh",""],
  ["/hip/b15/G33B/507-sgn-nth-ave-4","Home Improvement Programme at Blocks 500 to 506, 506A, 506B & 507 to 511 Serangoon North Avenue 4",""],
  ["/hip/b15/G33B/542-sgn-nth-ave-4","Home Improvement Programme at Blocks 531 to 535, 535A & 536 to 542 Serangoon North Avenue 4",""],
  ["/hip/b15/G33C/210-choachukang-central","Home Improvement Programme at Blocks 201 to 221 Choa Chu Kang Avenue 1 / Central",""],
  ["/hip/b15/G33C/224-choachukang-central","Home Improvement Programme at Blocks 223 to 239 Choa Chu Kang Central",""],
  ["/hip/b15/G33C/437-fajar-road","Home Improvement Programme at Blocks 437, 440, 442 and 447 to 453 Fajar Road / Bukit Panjang Ring Road",""],
  ["/hip/b15/G33D/29-balam-rd","Home Improvement Programme at Blocks 27 - 29, 33, 41 - 42, 55 - 56, 92 and 92A Balam Road/ Circuit Road/ Pipit Road",""],
  ["/hip/b15/G33D/409-woodlands-st-41","Home Improvement Programme at Blocks 401, 406, 408 - 410, 413 - 418, 421 and 424 - 427 Woodlands Street 41",""],
  ["/hip/b15/G33D/560-choachukang-north-6","Home Improvement Programme at Blocks 553 to 569 Choa Chu Kang North 6 / Street 52",""],
  ["/hip/b15/G33E/480-pasir-ris-dr-4","Home Improvement Programme at Blocks 463 to 466 & 478 to 487 Pasir Ris Street 41 / Drive 4",""],
  ["/hip/b15/G33E/556-pasir-ris-st-51","Home Improvement Programme at Blocks 544 to 562 Pasir Ris Street 51",""],
  ["/hip/b15/G33E/564-pasir-ris-st-51","Home Improvement Programme at Blocks 531 to 543 & 564 to 569 Pasir Ris Drive 1 / Street 51",""],
  ["/hip/b15/G33F/603-858-wdl","Home Improvement Programme at Blocks 851, 856 to 864 and 601 to 605 Woodlands Street 83/ Drive 42",""],
  ["/hip/b15/G33F/703-746-wdl","Home Improvement Programme at Blocks 701 to 713 and 744 to 747 Woodlands Drive 40/ 70/ Circle",""],
  ["/hip/b15/G33G/285-bukit-batok-east-ave-3","Home Improvement Programme at Blocks 285 to 287, 290A to 290G & 291A to 291E, Bukit Batok East Ave 3/ Street 24",""],
  ["/hip/b15/G33G/491G-tampines-st-45","Home Improvement Programme at Blocks 491A – 491H, 492B – 492D, 493A – 493E, 494B, 494C, 495A – 495F & 496B – 496G Tampines Ave 9/ St 43/ St 45",""],
  ["/hip/b15/G33H/360-yung-an-rd","Home Improvement Programme at Blocks 357 – 363 & 365 – 369 Yung An Road / Corporation Drive",""],
  ["/hip/b15/G33H/812-jurong-west-st-81","Home Improvement Programme at Blocks 810 – 832, 828A & 830A Jurong West Street 81",""],
  ["/hip/b15/G33H/978-jurong-west-st-93","Home Improvement Programme at Blocks 961, 965 to 966, 974 to 980 Jurong West Street 92/93",""],
  ["/hip/b16/G34A/140-bedok-north-st-2/140-bedok-north-st-2","Home Improvement Programme at Block 140 Bedok North Street 2",""],
  ["/hip/b16/G34A/465-upper-serangoon-rd","Home Improvement Programme at Blocks 460 - 468 Hougang Ave 8 / Ave 10 / Upper Serangoon Road",""],
  ["/hip/b16/G34A/765-jurong-west-st-74","Home Improvement Programme at Blocks 752 - 761 & 764 - 766 Jurong West Street 74",""],
  ["/hip/b16/G34A/841-jurong-west-st-81","Home Improvement Programme at Blocks 833 to 853 Jurong West Street 81",""],
  ["/hip/b16/G34B/104A-ang-mo-kio-st-11","Home Improvement Programme at Blocks 104A & 104B Ang Mo Kio Street 11",""],
  ["/hip/b16/G34B/236-compassvale-walk","Home Improvement Programme at Blocks 229 to 236 Compassvale Walk",""],
  ["/hip/b16/G34B/253A-ang-mo-kio-st-21","Home Improvement Programme at Blocks 253 & 253A Ang Mo Kio Street 21",""],
  ["/hip/b16/G34B/317-ang-mo-kio-st-31","Home Improvement Programme at Block 317 Ang Mo Kio Street 31",""],
  ["/hip/b16/G34B/617-ang-mo-kio-ave-4","Home Improvement Programme at Blocks 613 to 619 Ang Mo Kio Ave 4",""],
  ["/hip/b16/G34B/659-wld-ring-rd","Home Improvement Programme at Blocks 659 to 664 Woodlands Ring Road",""],
  ["/hip/b16/G34B/717-wld-dr-70","Home Improvement Programme at Blocks 714 to 720 Woodlands Drive 70/ Avenue 6",""],
  ["/hip/b16/G34C/157-jalan-teck-whye","Home Improvement Programme at Blocks 150 to 152, 154 to 160 and 162 to 164 Jalan Teck Whye",""],
  ["/hip/b16/G34C/173-gangsa-road","Home Improvement Programme at Blocks 170 – 176 Gangsa/ Lompang Road",""],
  ["/hip/b16/G34C/355-choachukang-central","Home Improvement Programme at Blocks 305 to 308, 340 to 346 and 350 to 355 Choa Chu Kang Avenue 4/ Loop/ Central",""],
  ["/hip/b16/G34D/234A-serangoon-ave-2","Home Improvement Programme at Blocks 232A, 234A, 236A and 255 to 258 Serangoon Avenue 2 / Central Drive",""],
  ["/hip/b16/G34D/752-choachukang-north-5","Home Improvement Programme at Blocks 751 to 761 Choa Chu Kang North 5",""],
  ["/hip/b16/G34D/762-choachukang-north-5","Home Improvement Programme at Blocks 762 to 771 Choa Chu Kang North 5/ Street 54",""],
  ["/hip/b16/G34D/82a-toapayoh-lor-4","Home Improvement Programme at Blocks 80, 80A, 80B, 81, 81A, 81B, 82, 82A, 82B, 84, 84A, 84B and 86 Toa Payoh Lorong 2/ 4",""],
  ["/hip/b16/G34D/9-pine-close","Home Improvement Programme at Blocks 28, 30, 56 and 9 Cassia Crescent / Pine Close",""],
  ["/hip/b16/G34E/215-pasirris-st-21","Home Improvement Programme at Blocks 203 to 216 Pasir Ris Street 21",""],
  ["/hip/b16/G34E/225-pasirris-st-21","Home Improvement Programme at Blocks 217 to 230 Pasir Ris Street 21",""],
  ["/hip/b16/G34F/500-pasir-ris-st-52","Home Improvement Programme at Blocks 500 to 521 Pasir Ris Street 52",""],
  ["/hip/b16/G34G/488a-tampines-ave-9","Home Improvement Programme at Blocks 472, 474, 476, 477, 479 – 484, 485A – B, 486A – C, 487A – C, 488A – B, 489A – C, 490A – B Tampines Streets 43-45 / Avenue 9",""],
  ["/hip/b16/G34H/13-upper-boon-keng-rd","Home Improvement Programme at Blocks 13, 14, and 14A Upper Boon Keng Road",""],
  ["/hip/b16/G34H/317-tampines-st-33","Home Improvement Programme at Blocks 301 to 323 Tampines Street 32 / 33",""],
  ["/hip/b16/G34H/391-tampines-ave-7","Home Improvement Programme at Blocks 371 to 374 & 381 to 396 Tampines Avenue 7 / Street 32 / 34",""],
  ["/hip/b16/G34H/59B-geylang-bahru","Home Improvement Programme at Blocks 58, 59A, 59B, 59C & 60 Geylang Bahru",""],
  ["/improvement-works-portal/get-help","Get Help",""],
  ["/legal-fees-enquiry-facility/conveyancing-fees-rules","Conveyancing Fees Rules",""],
  ["/legal-fees-enquiry-facility/terms-and-conditions","Terms and Conditions",""],
  ["/listing-of-registered-contractors/navigating-using-the-map","Navigating Using the Map",""],
  ["/loan-package-listing/get-help","Get Help",""],
  ["/loan-package-listing/terms-and-conditions","Terms and Conditions",""],
  ["/maintenance-request-for-commercial-properties/get-help","Get Help",""],
  ["/make-full-repayment-of-housing-loan/get-help","Get Help",""],
  ["/make-full-repayment-of-housing-loan/terms-and-conditions","Terms and Conditions",""],
  ["/make-full-repayment-of-outstanding-upgrading-cost/get-help","Get Help",""],
  ["/make-full-repayment-of-outstanding-upgrading-cost/terms-and-conditions","Terms and Conditions",""],
  ["/make-housing-payments/get-help","Get Help",""],
  ["/make-housing-payments/terms-and-conditions","Terms and Conditions",""],
  ["/make-partial-repayment-of-housing-loan/get-help","Get Help",""],
  ["/make-partial-repayment-of-housing-loan/terms-and-conditions","Terms and Conditions",""],
  ["/make-partial-repayment-of-outstanding-upgrading-cost/get-help","Get Help",""],
  ["/make-partial-repayment-of-outstanding-upgrading-cost/terms-and-conditions","Terms and Conditions",""],
  ["/manage-auto-renewal-of-season-parking-by-giro/get-help","Get Help",""],
  ["/manage-auto-renewal-of-season-parking-by-giro/terms-and-conditions","Terms And Conditions",""],
  ["/manage-preferences-for-statement-of-account/get-help","Get Help",""],
  ["/manage-sales-appointment-for-new-flat-purchase/get-help","Get Help",""],
  ["/manage-sales-appointment-for-new-flat-purchase/terms-and-conditions","Terms and Conditions",""],
  ["/manage-temporary-extension-of-stay/get-help","Get Help",""],
  ["/managing-my-home","Managing My Home","Get information about living in an HDB flat, including moving in, renovation, home maintenance, and more."],
  ["/managing-my-home/finances","Finances","Key finance matters to consider when servicing your HDB housing loan, including how to manage your loan and the applicable CPF rules."],
  ["/managing-my-home/finances/citizen-topup","Citizen Top-Up","Find out how the Citizen Top-Up works and how to apply for it. You need to submit your application to HDB within 6 months of being eligible for it."],
  ["/managing-my-home/finances/cpf-rules-and-early-repayment","CPF Rules and Early Repayment","If you own an HDB flat, it is important to understand how CPF rules might impact your housing loan repayments."],
  ["/managing-my-home/finances/loan-matters","Loan Matters","Manage your HDB housing loan better with more details on loan statements, the various payments, and assistance measures."],
  ["/managing-my-home/finances/loan-matters/financial-assistance-measures","Financial Assistance Measures","Flat owners in financial difficulties can approach their HDB Branch to learn about and apply for our available financial assistance measures."],
  ["/managing-my-home/finances/loan-matters/interest-rate","Interest Rate for HDB Housing Loan","The HDB concessionary interest rate is pegged to the prevailing CPF interest rate. The HDB market interest rate is pegged to the rates of the 3 local banks."],
  ["/managing-my-home/finances/loan-matters/payments","Payments for HDB Housing Loan","Payments for monthly loan instalments, arrears payment, partial capital repayment, and redemption of HDB housing loan can be made through a number of ways."],
  ["/managing-my-home/finances/loan-matters/refinance","Refinance Your HDB Housing Loan","Flat owners can refinance their HDB housing loan with a bank if they choose, but they cannot refinance that loan with HDB subsequently."],
  ["/managing-my-home/finances/loan-matters/repayment-period","Repayment Period for HDB Housing Loan","You can apply to change your repayment period at any HDB branch. The application must be submitted in person and all the flat owners must be present."],
  ["/managing-my-home/finances/loan-matters/statement-of-account","Statement of Account for HDB Housing Loan","Get a statement of account for your HDB housing loan via MyHDB Page."],
  ["/managing-my-home/home-ownership","Home Ownership","Learn about HDB home ownership matters including moving in, occupancy changes, and other guidelines."],
  ["/managing-my-home/home-ownership/acquiring-private-property","Acquiring Private Property","Get an overview of the eligibility conditions and process for acquiring private residential property as an existing flat owner."],
  ["/managing-my-home/home-ownership/change-of-flat-owners-or-occupiers","Change of Flat Owners or Occupiers","Find out more about changing a flat's ownership or occupiers' details."],
  ["/managing-my-home/home-ownership/change-of-flat-owners-or-occupiers/change-in-flat-ownership-not-through-a-sale","Change in Flat Ownership (Not Through a Sale)","Existing owners can change flat ownership to eligible family members without going through a sale transaction (i.e. without monetary consideration)."],
  ["/managing-my-home/home-ownership/change-of-flat-owners-or-occupiers/change-in-flat-ownership-not-through-a-sale/additional-information","Additional Information for Change in Flat Ownership","In cases of a change in flat ownership arising from divorce, both parties should take note of these considerations and conditions."],
  ["/managing-my-home/home-ownership/change-of-flat-owners-or-occupiers/change-in-flat-ownership-not-through-a-sale/application-process","Application Process for Change in Flat Ownership","Learn about the application process for a change in flat ownership to eligible family members."],
  ["/managing-my-home/home-ownership/change-of-flat-owners-or-occupiers/change-in-flat-ownership-not-through-a-sale/conditions-after-change-in-flat-ownership","Conditions After Change in Flat Ownership","Both proposed and withdrawing owners of an HDB flat will need to take note of the conditions, following a change in flat ownership (not through a sale)."],
  ["/managing-my-home/home-ownership/change-of-flat-owners-or-occupiers/change-in-flat-ownership-not-through-a-sale/eligibility","Eligibility for Change in Flat Ownership","These are the eligibility criteria for a change in flat ownership (not through a sale) to eligible family members for HDB flats."],
  ["/managing-my-home/home-ownership/change-of-flat-owners-or-occupiers/change-in-flat-ownership-not-through-a-sale/guide-for-change-in-flat-ownership","Guide for Change in Flat Ownership","These are the required steps and checks to prepare for a change in flat ownership (not through a sale), before submitting your application."],
  ["/managing-my-home/home-ownership/change-of-flat-owners-or-occupiers/change-in-flat-ownership-not-through-a-sale/manner-of-holding","Manner of Holding After Change in Flat Ownership","Learn about joint tenancy and tenancy-in-common as ways to hold HDB flat ownership after a change in ownership."],
  ["/managing-my-home/home-ownership/change-of-flat-owners-or-occupiers/change-in-manner-of-holding-or-ownership-proportion","Change in Manner of Holding or Ownership Proportion","Find out about changing your HDB flat proportion of shares with a co-owner and the differences between the two forms of ownership."],
  ["/managing-my-home/home-ownership/change-of-flat-owners-or-occupiers/change-of-flat-occupiers","Change of Flat Occupiers","Read this guide to changing occupier details for your flat. Find out how to add or remove an occupier, eligibility criteria and application process."],
  ["/managing-my-home/home-ownership/change-of-flat-owners-or-occupiers/change-of-flat-occupiers/application-process","Application Process for Change of Flat Occupiers","Familiarise yourself with the application process for adding or removing an occupier, including the documents required."],
  ["/managing-my-home/home-ownership/change-of-flat-owners-or-occupiers/change-of-flat-occupiers/eligibility","Eligibility for Change of Flat Occupiers","Learn about the eligibility conditions for a change of occupiers, based on whether you are adding or removing an occupier."],
  ["/managing-my-home/home-ownership/change-of-flat-owners-or-occupiers/resale-of-partshare","Resale of Part-Share","Find out about the resale of part-share for HDB flats. Get details on the criteria, conditions, and application process."],
  ["/managing-my-home/home-ownership/change-of-flat-owners-or-occupiers/retain-flat-following-life-events","Retain Flat Following Life Events","Learn how HDB flat ownership may be affected by life events such as loss of citizenship, change in marital status, or bereavement."],
  ["/managing-my-home/home-ownership/checklist-for-moving-into-flat","Checklist for Moving Into Flat","Use this checklist when moving in to help you sort out flat matters such as personal particulars, defects, utilities, tax, and insurance."],
  ["/managing-my-home/home-ownership/fire-insurance","Fire Insurance","Find out how you can insure your home against fire incidents."],
  ["/managing-my-home/home-ownership/home-business","Home Business","You may run a home business from your HDB flat if it meets the guidelines and your business does not disrupt residents."],
  ["/managing-my-home/home-ownership/home-business/home-office-scheme","Home Office Scheme","Our Home Office Scheme allows you to operate a small-scale office or conduct administrative functions of a permissible business at home, subject to conditions."],
  ["/managing-my-home/home-ownership/home-business/home-office-scheme/apply-and-manage-registration","Apply and Manage Registration for Home Office Scheme","Learn how to register for the Home Office Scheme, update your business particulars, or terminate your home office."],
  ["/managing-my-home/home-ownership/home-business/home-office-scheme/conditions-of-use","Conditions of Use for Home Office Scheme","Find out the conditions of use and permitted business types under the Home Office Scheme."],
  ["/managing-my-home/home-ownership/home-business/homebased-business-scheme","Home-Based Business Scheme","Our Home-Based Business Scheme allows you to run a small business from home to supplement your household income, subject to conditions."],
  ["/managing-my-home/home-ownership/installing-smart-door-devices-and-cctv-cameras","Installing Smart Door Devices and CCTV Cameras","Learn the guidelines for installing smart door devices and CCTV cameras in your flat."],
  ["/managing-my-home/home-ownership/keeping-pets","Guidelines on Keeping Pets","Read guidelines on the type of pets that you can keep in your HDB flat."],
  ["/managing-my-home/home-ownership/purchasing-recess-area","Purchasing Recess Area","Find out how you can purchase the recess area outside your flat, if it fulfils certain conditions."],
  ["/managing-my-home/home-ownership/renting-out-a-flat-or-bedrooms","Renting Out a Flat or Bedrooms","Find out about renting out your HDB flat or spare bedrooms."],
  ["/managing-my-home/home-ownership/renting-out-a-flat-or-bedrooms/renting-out-a-flat","Renting Out a Flat","You can rent out your flat if you are a Singapore Citizen flat owner. See the eligibility conditions, regulations, statistics, and how to apply for approval."],
  ["/managing-my-home/home-ownership/renting-out-a-flat-or-bedrooms/renting-out-a-flat/application-process","Application Process for Renting Out a Flat","Find out how you can rent out your HDB flat and the costs involved."],
  ["/managing-my-home/home-ownership/renting-out-a-flat-or-bedrooms/renting-out-a-flat/eligibility","Eligibility for Renting Out a Flat","You must fulfil these eligibility conditions before you can rent out your flat. You will need to note the Non-Citizen Quota as well."],
  ["/managing-my-home/home-ownership/renting-out-a-flat-or-bedrooms/renting-out-a-flat/regulations","Regulations for Renting Out a Flat","These regulations inform you of your responsibilities as a flat owner. They help you avoid complications or infringements."],
  ["/managing-my-home/home-ownership/renting-out-a-flat-or-bedrooms/renting-out-a-flat/rental-statistics","Rental Statistics","If you plan to rent out your flat, you can use our e-Service to see the past year’s HDB rental rates. Search by town, block, or street."],
  ["/managing-my-home/home-ownership/renting-out-a-flat-or-bedrooms/renting-out-bedrooms","Renting Out Bedrooms","Flat owners of 3-room or bigger HDB flats may rent out spare bedroom(s) but you must obtain approval from HDB. Eligibility conditions apply."],
  ["/managing-my-home/home-ownership/renting-out-a-flat-or-bedrooms/renting-out-bedrooms/application-process","Application Process for Renting Out Bedrooms","You need to apply for approval to rent out your bedroom(s), and update the application details if there are any tenancy-related changes."],
  ["/managing-my-home/home-ownership/renting-out-a-flat-or-bedrooms/renting-out-bedrooms/eligibility","Eligibility for Renting Out Bedrooms","Check your eligibility to rent out bedrooms in your flat, and note the necessary conditions and occupant limits."],
  ["/managing-my-home/home-ownership/renting-out-a-flat-or-bedrooms/renting-out-bedrooms/regulations","Regulations for Renting Out Bedrooms","Familiarise yourself with the responsibilities and regulations for renting out bedrooms in your HDB flat."],
  ["/managing-my-home/living-in-my-community","Living in My Community","Discover activities, programmes, and tips for vibrant community living in HDB towns."],
  ["/managing-my-home/living-in-my-community/being-a-good-neighbour","Being a Good Neighbour","Find out how you can be a good neighbour and enjoy better relationships with others in your community."],
  ["/managing-my-home/living-in-my-community/being-a-good-neighbour/good-neighbours-movement","Good Neighbours Movement","Learn about the different initiatives promoting neighbourliness and social harmony in our community under the Good Neighbours Movement."],
  ["/managing-my-home/living-in-my-community/being-a-good-neighbour/keeping-killer-litter-away","Keeping Killer Litter Away","Killer litter poses a threat to you and your neighbours' safety. Find out some of the common accidents that can happen and how to prevent them."],
  ["/managing-my-home/living-in-my-community/being-a-good-neighbour/managing-neighbour-disputes","Managing Neighbour Disputes","If you are facing problems or issues with your neighbour, here are several options to help you manage the situation."],
  ["/managing-my-home/living-in-my-community/being-a-good-neighbour/tips-on-neighbourliness","Tips on Neighbourliness","Here are some things you can do to make your neighbourhood a pleasant and safe environment."],
  ["/managing-my-home/living-in-my-community/enlivening-my-neighbourhood","Enlivening My Neighbourhood","Play a part in shaping a great living environment and promote stronger bonds in your neighbourhoods!"],
  ["/managing-my-home/living-in-my-community/enlivening-my-neighbourhood/community-participatory-projects","Community Participatory Projects","Find out how HDB worked with communities and residents in the design and building of community spaces in the heartlands."],
  ["/managing-my-home/living-in-my-community/enlivening-my-neighbourhood/friends-of-our-heartlands-network","Friends of Our Heartlands Network","Join us as a Friend of Our Heartlands today and discover the different ways in which you can make a difference to your community."],
  ["/managing-my-home/living-in-my-community/enlivening-my-neighbourhood/lively-places-programme","Lively Places Programme","A joint initiative by HDB and URA to better support community-led efforts in enlivening Singapore’s public spaces."],
  ["/managing-my-home/living-in-my-community/enlivening-my-neighbourhood/lively-places-programme/lively-places-fund-and-challenge","Lively Places Fund and Challenge","Learn more about the Lively Places Fund and Lively Places Challenge under the Lively Places Programme."],
  ["/managing-my-home/living-in-my-community/enlivening-my-neighbourhood/programmes-and-resources-for-schools","Programmes and Resources for Schools","Explore programmes and resources for schools. Empower students and educators for community engagement. Tailored content for various school levels."],
  ["/managing-my-home/living-in-my-community/enlivening-my-neighbourhood/programmes-and-resources-for-schools/educational-resources-for-schools","Educational Resources for Schools","Discover resources for schools. Enhance lessons for gracious and harmonious living. Tailored content for various school levels."],
  ["/managing-my-home/living-in-my-community/enlivening-my-neighbourhood/programmes-and-resources-for-schools/ohyay-programme","OHYAY! Programme","Engaging school roadshows for the young and youth. Inspiring gracious community living through interactive activities for various school levels."],
  ["/managing-my-home/living-in-my-community/enlivening-my-neighbourhood/programmes-and-resources-for-schools/sphere","SPHERE+","SPHERE+ is a community programme providing funding for schools to promote intergenerational bonding activities between students and elderly living in HDB flats."],
  ["/managing-my-home/living-in-my-community/enlivening-my-neighbourhood/white-spaces","White Spaces","Play a part in transforming your precinct’s open lawn or void deck into a meaningful space that you and your neighbours can enjoy together."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood","Exploring My Neighbourhood","Learn about the shared facilities within HDB towns that provide convenient amenities and encourage neighbourly bonds."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town","Explore My Town","Explore various town and neighbourhood centres and shopping complexes located in each HDB town."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/ang-mo-kio","Ang Mo Kio","Explore Ang Mo Kio: Your guide to heartland shopping options in this town."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/ang-mo-kio/ang-mo-kio-town-centre","Ang Mo Kio Town Centre","Discover what Ang Mo Kio Town Centre offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/ang-mo-kio/cheng-san-centre","Cheng San Centre","Discover what Cheng San Centre offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/ang-mo-kio/chong-boon-centre","Chong Boon Centre","Discover what Chong Boon Centre offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/ang-mo-kio/kebun-baru-mall","Kebun Baru Mall","Discover what Kebun Baru Mall offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/ang-mo-kio/mayflower-shopping-and-food-centre","Mayflower Shopping and Food Centre","Discover what Mayflower Shopping and Food Centre offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/ang-mo-kio/teck-ghee-court","Teck Ghee Court","Discover what Teck Ghee Court offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/ang-mo-kio/teck-ghee-square","Teck Ghee Square","Discover what Teck Ghee Square offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/ang-mo-kio/yio-chu-kang-view","Yio Chu Kang View","Discover what Yio Chu Kang View offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bedok","Bedok","Explore Bedok: Your guide to heartland shopping options in this town."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bedok/bedok-town-centre","Bedok Town Centre","Discover what Bedok Town Centre offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bedok/blocks-16-18-bedok-south-road","Blocks 16 - 18 Bedok South Road","Discover the neighbourhood centre at Blocks 16 - 18 Bedok South Road and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bedok/blocks-25a-32a-chai-chee-road","Blocks 25A - 32A Chai Chee Road","Discover the neighbourhood centre at Blocks 25A - 32A Chai Chee Road and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bedok/blocks-509-511a-bedok-north-street-3","Blocks 509 - 511A Bedok North Street 3","Discover the neighbourhood centre at Blocks 509 - 511A Bedok North Street 3 and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bedok/blocks-537-539a-bedok-north-street-3","Blocks 537 - 539A Bedok North Street 3","Discover the neighbourhood centre at Blocks 537 - 539A Bedok North Street 3 and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bedok/blocks-630-632-bedok-reservoir-road","Blocks 630 - 632 Bedok Reservoir Road","Discover the neighbourhood centre at Blocks 630 - 632 Bedok Reservoir Road and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bedok/blocks-84-89-bedok-north-street-4","Blocks 84 - 89 Bedok North Street 4","Discover the neighbourhood centre at Blocks 84 - 89 Bedok North Street 4 and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bedok/reservoir-village","Reservoir Village","Discover what Reservoir Village offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bedok/the-marketplace58","The Marketplace@58","Discover the neighbourhood centre at The Marketplace@58 and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bishan","Bishan","Explore Bishan: Your guide to heartland shopping options in this town."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bishan/bishan-north-shopping-mall","Bishan North Shopping Mall","Discover what Bishan North Shopping Mall offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bishan/bishan-town-centre","Bishan Town Centre","Discover what Bishan Town Centre offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bishan/blocks-150-152a-bishan-street-11","Blocks 150 - 152A Bishan Street 11","Discover the neighbourhood centre at Blocks 150 - 152A Bishan Street 11 and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bukit-batok","Bukit Batok","Explore Bukit Batok: Your guide to heartland shopping options in this town."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bukit-batok/bukit-batok-east-point","Bukit Batok East Point","Discover what Bukit Batok East Point offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bukit-batok/bukit-batok-town-centre","Bukit Batok Town Centre","Discover what Bukit Batok Town Centre offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bukit-batok/bukit-batok-west-shopping-centre","Bukit Batok West Shopping Centre","Discover what Bukit Batok West Shopping Centre offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bukit-batok/bukit-gombak-neighbourhood-centre","Bukit Gombak Neighbourhood Centre","Discover what Bukit Gombak Neighbourhood Centre offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bukit-merah","Bukit Merah","Explore Bukit Merah: Your guide to heartland shopping options in this town."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bukit-merah/alexandra-village","Alexandra Village","Discover what Alexandra Village offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bukit-merah/blocks-111-112-jalan-bukit-merah","Blocks 111 - 112 Jalan Bukit Merah","Discover the neighbourhood centre at Blocks 111 - 112 Jalan Bukit Merah and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bukit-merah/blocks-115-116-bukit-merah-view","Blocks 115 - 116 Bukit Merah View","Discover the neighbourhood centre at Blocks 115 - 116 Bukit Merah View and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bukit-merah/blocks-34-40-beo-crescent","Blocks 34 - 40 Beo Crescent","Discover the neighbourhood centre at Blocks 34 - 40 Beo Crescent and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bukit-merah/blocks-35-38-telok-blangah-rise","Blocks 35 - 38 Telok Blangah Rise","Discover the neighbourhood centre at Blocks 35 - 38 Telok Blangah Rise and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bukit-merah/blocks-55-59-lengkok-bahru","Blocks 55 - 59 Lengkok Bahru","Discover the neighbourhood centre at Blocks 55 - 59 Lengkok Bahru and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bukit-merah/blocks-78-86-redhill-lane","Blocks 78 - 86 Redhill Lane","Discover the neighbourhood centre at Blocks 78 - 86 Redhill Lane and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bukit-merah/blocks-8-12-telok-blangah-crescent","Blocks 8 - 12 Telok Blangah Crescent","Discover the neighbourhood centre at Blocks 8 - 12 Telok Blangah Crescent and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bukit-merah/brickworks-estate","Brickworks Estate","Discover what Brickworks Estate offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bukit-merah/bukit-merah-town-centre","Bukit Merah Town Centre","Discover what Bukit Merah Town Centre offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bukit-merah/connection-one","Connection One","Discover what Connection One offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bukit-merah/depot-heights-shopping-centre","Depot Heights Shopping Centre","Discover what Depot Heights Shopping Centre offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bukit-merah/telok-blangah-mall","Telok Blangah Mall","Discover what Telok Blangah Mall offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bukit-panjang","Bukit Panjang","Explore Bukit Panjang: Your guide to heartland shopping options in this town."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bukit-panjang/bukit-panjang-neighbourhood-centre","Bukit Panjang Neighbourhood Centre","Discover what Bukit Panjang Neighbourhood Centre offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bukit-panjang/fajar-shopping-centre","Fajar Shopping Centre","Discover what Fajar Shopping Centre offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bukit-panjang/greenridge-shopping-centre","Greenridge Shopping Centre","Discover what Greenridge Shopping Centre offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bukit-timah","Bukit Timah","Explore Bukit Timah: Your guide to heartland shopping options in this town."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/bukit-timah/empress-mall","Empress Mall","Discover what Empress Mall offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/central-area","Central Area","Explore Central Area: Your guide to heartland shopping options in this town."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/central-area/bras-basah-complex","Bras Basah Complex","Discover what Bras Basah Complex offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/central-area/cheng-yan-court","Cheng Yan Court","Discover what Cheng Yan Court offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/central-area/chinatown-complex","Chinatown Complex","Discover what Chinatown Complex offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/central-area/hong-lim-complex","Hong Lim Complex","Discover what Hong Lim Complex offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/central-area/new-bridge-centre","New Bridge Centre","Discover what New Bridge Centre offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/central-area/peoples-park","People's Park","Discover what People's Park offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/central-area/tanjong-pagar-plaza","Tanjong Pagar Plaza","Discover what Tanjong Pagar Plaza offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/central-area/waterloo-centre","Waterloo Centre","Discover what Waterloo Centre offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/choa-chu-kang","Choa Chu Kang","Explore Choa Chu Kang: Your guide to heartland shopping options in this town."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/choa-chu-kang/choa-chu-kang-centre","Choa Chu Kang Centre","Discover what Choa Chu Kang Centre offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/choa-chu-kang/choa-chu-kang-town-centre","Choa Chu Kang Town Centre","Discover what Choa Chu Kang Town Centre offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/choa-chu-kang/keat-hong-shopping-centre","Keat Hong Shopping Centre","Discover what Keat Hong Shopping Centre offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/choa-chu-kang/limbang-shopping-centre","Limbang Shopping Centre","Discover what Limbang Shopping Centre offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/choa-chu-kang/sunshine-place","Sunshine Place","Discover what Sunshine Place offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/choa-chu-kang/teck-whye-shopping-centre","Teck Whye Shopping Centre","Discover what Teck Whye Shopping Centre offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/choa-chu-kang/yew-tee-square","Yew Tee Square","Discover what Yew Tee Square offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/clementi","Clementi","Explore Clementi: Your guide to heartland shopping options in this town."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/clementi/blocks-501-505-west-coast-drive","Blocks 501 - 505 West Coast Drive","Discover the neighbourhood centre at Blocks 501 - 505 West Coast Drive and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/clementi/blocks-720-727-clementi-west-street-2","Blocks 720 - 727 Clementi West Street 2","Discover the neighbourhood centre at Blocks 720 - 727 Clementi West Street 2 and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/clementi/clementi-avenue-2-shopping-centre","Clementi Avenue 2 Shopping Centre","Discover what Clementi Avenue 2 Shopping Centre offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/clementi/clementi-town-centre","Clementi Town Centre","Discover what Clementi Town Centre offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/clementi/sunset-way","Sunset Way","Discover what Sunset Way offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/geylang","Geylang","Explore Geylang: Your guide to heartland shopping options in this town."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/geylang/blocks-10-14-haig-road","Blocks 10 - 14 Haig Road","Discover the neighbourhood centre at Blocks 10 - 14 Haig Road and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/geylang/blocks-113-119-aljunied-avenue-2","Blocks 113 - 119 Aljunied Avenue 2","Discover the neighbourhood centre at Blocks 113 - 119 Aljunied Avenue 2 and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/geylang/blocks-1a-8-eunos-crescent","Blocks 1A - 8 Eunos Crescent","Discover the neighbourhood centre at Blocks 1A - 8 Eunos Crescent and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/geylang/blocks-37-64-80-circuit-road","Blocks 37, 64 - 80 Circuit Road","Discover the neighbourhood centre at Blocks 37, 64 - 80 Circuit Road and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/geylang/blocks-81-83-macpherson-lane","Blocks 81 - 83 Macpherson Lane","Discover the neighbourhood centre at Blocks 81 - 83 Macpherson Lane and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/geylang/blocks-86-89-circuit-road","Blocks 86 - 89 Circuit Road","Discover the neighbourhood centre at Blocks 86 - 89 Circuit Road and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/geylang/joo-chiat-complex","Joo Chiat Complex","Discover what Joo Chiat Complex offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/geylang/kallang-airport","Kallang Airport","Discover what Kallang Airport offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/geylang/kampong-ubi-greenville","Kampong Ubi Greenville","Discover what Kampong Ubi Greenville offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/geylang/sims-vista","Sims Vista","Discover what Sims Vista offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/hougang","Hougang","Explore Hougang: Your guide to heartland shopping options in this town."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/hougang/hougang-n1-centre","Hougang N1 Centre","Discover what Hougang N1 Centre offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/hougang/hougang-rivercourt","Hougang RiverCourt","Discover what Hougang RiverCourt offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/hougang/hougang-town-centre","Hougang Town Centre","Discover what Hougang Town Centre offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/hougang/hougang-village","Hougang Village","Discover what Hougang Village offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/hougang/kovan-city","Kovan City","Discover what Kovan City offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/jurong-east","Jurong East","Explore Jurong East: Your guide to heartland shopping options in this town."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/jurong-east/blocks-37-39-teban-gardens-road","Blocks 37 - 39 Teban Gardens Road","Discover the neighbourhood centre at Blocks 37 - 39 Teban Gardens Road and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/jurong-east/j-connect","J Connect","Discover what J Connect offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/jurong-east/teban-place","Teban Place","Discover what Teban Place offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/jurong-east/yuhua-place","Yuhua Place","Discover what Yuhua Place offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/jurong-east/yuhua-village","Yuhua Village","Discover what Yuhua Village offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/jurong-west","Jurong West","Explore Jurong West: Your guide to heartland shopping options in this town."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/jurong-west/blocks-959-966-jurong-west-street-92","Blocks 959 - 966 Jurong West Street 92","Discover the neighbourhood centre at Blocks 959 - 966 Jurong West Street 92 and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/jurong-west/boon-lay-shopping-centre","Boon Lay Shopping Centre","Discover what Boon Lay Shopping Centre offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/jurong-west/gek-poh-shopping-centre","Gek Poh Shopping Centre","Discover what Gek Poh Shopping Centre offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/jurong-west/hong-kah-point","Hong Kah Point","Discover what Hong Kah Point offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/jurong-west/hong-kah-ville","Hong Kah Ville","Discover what Hong Kah Ville offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/jurong-west/pioneer-mall","Pioneer Mall","Discover what Pioneer Mall offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/jurong-west/taman-jurong-shopping-centre","Taman Jurong Shopping Centre","Discover what Taman Jurong Shopping Centre offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/kallang-whampoa","Kallang/ Whampoa","Explore Kallang/ Whampoa: Your guide to heartland shopping options in this town."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/kallang-whampoa/balestier-hill-shopping-centre","Balestier Hill Shopping Centre","Discover what Balestier Hill Shopping Centre offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/kallang-whampoa/bendemeer-shopping-mall","Bendemeer Shopping Mall","Discover what Bendemeer Shopping Mall offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/kallang-whampoa/blocks-41-46-cambridge-road","Blocks 41 - 46 Cambridge Road","Discover the neighbourhood centre at Blocks 41 - 46 Cambridge Road and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/kallang-whampoa/blocks-66-71-kallang-bahru","Blocks 66 - 71 Kallang Bahru","Discover the neighbourhood centre at Blocks 66 - 71 Kallang Bahru and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/kallang-whampoa/blocks-81-92-whampoa-drive","Blocks 81 - 92 Whampoa Drive","Discover the neighbourhood centre at Blocks 81 - 92 Whampoa Drive and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/kallang-whampoa/boon-keng-ville","Boon Keng Ville","Discover what Boon Keng Ville offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/kallang-whampoa/di-tanjong-rhu","Di Tanjong Rhu","Discover what Di Tanjong Rhu offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/kallang-whampoa/kitchener-complex","Kitchener Complex","Discover what Kitchener Complex offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/marine-parade","Marine Parade","Explore Marine Parade: Your guide to heartland shopping options in this town."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/marine-parade/marine-parade-promenade","Marine Parade Promenade","Discover what Marine Parade Promenade offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/marine-parade/marine-terrace-haven","Marine Terrace Haven","Discover what Marine Terrace Haven offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/pasir-ris","Pasir Ris","Explore Pasir Ris: Your guide to heartland shopping options in this town."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/pasir-ris/blocks-440-446-pasir-ris-drive-4","Blocks 440 - 446 Pasir Ris Drive 4","Discover the neighbourhood centre at Blocks 440 - 446 Pasir Ris Drive 4 and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/pasir-ris/changi-village","Changi Village","Discover what Changi Village offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/pasir-ris/elias-mall","Elias Mall","Discover what Elias Mall offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/pasir-ris/loyang-point","Loyang Point","Discover what Loyang Point offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/pasir-ris/pasir-ris-west-plaza","Pasir Ris West Plaza","Discover what Pasir Ris West Plaza offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/punggol","Punggol","Explore Punggol: Your guide to heartland shopping options in this town."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/punggol/northshore-plaza","Northshore Plaza","Discover what Northshore Plaza offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/punggol/oasis-terraces","Oasis Terraces","Discover what Oasis Terraces offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/punggol/punggol-plaza","Punggol Plaza","Discover what Punggol Plaza offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/queenstown","Queenstown","Explore Queenstown: Your guide to heartland shopping options in this town."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/queenstown/blocks-116-118-commonwealth-crescent","Blocks 116 - 118 Commonwealth Crescent","Discover the neighbourhood centre at Blocks 116 - 118 Commonwealth Crescent and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/queenstown/blocks-1a-3a-46-49-commonwealth-drive","Blocks 1A - 3A, 46 - 49 Commonwealth Drive","Discover the neighbourhood centre at Blocks 1A - 3A, 46 - 49 Commonwealth Drive and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/queenstown/blocks-40-47-holland-drive","Blocks 40 - 47 Holland Drive","Discover the neighbourhood centre at Blocks 40 - 47 Holland Drive and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/queenstown/dawson-place","Dawson Place","Discover what Dawson Place offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/queenstown/ghim-moh-centre","Ghim Moh Centre","Discover what Ghim Moh Centre offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/queenstown/mei-ling-heights","Mei Ling Heights","Discover what Mei Ling Heights offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/sembawang","Sembawang","Explore Sembawang: Your guide to heartland shopping options in this town."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/sembawang/canberra-plaza","Canberra Plaza","Discover what Canberra Plaza offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/sembawang/sembawang-mart","Sembawang Mart","Discover what Sembawang Mart offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/sengkang","Sengkang","Explore Sengkang: Your guide to heartland shopping options in this town."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/sengkang/anchorvale-village","Anchorvale Village","Discover what Anchorvale Village offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/sengkang/buangkok-square","Buangkok Square","Discover what Buangkok Square offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/sengkang/rivervale-plaza","Rivervale Plaza","Discover what Rivervale Plaza offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/serangoon","Serangoon","Explore Serangoon: Your guide to heartland shopping options in this town."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/serangoon/serangoon-north-village","Serangoon North Village","Discover what Serangoon North Village offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/serangoon/serangoon-town-centre","Serangoon Town Centre","Discover what Serangoon Town Centre offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/tampines","Tampines","Explore Tampines: Your guide to heartland shopping options in this town."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/tampines/block-248-simei-street-3","Block 248 Simei Street 3","Discover the neighbourhood centre at Block 248 Simei Street 3 and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/tampines/blocks-136-139-tampines-street-11","Blocks 136 - 139 Tampines Street 11","Discover the neighbourhood centre at Blocks 136 - 139 Tampines Street 11 and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/tampines/blocks-201-201g-tampines-street-21","Blocks 201 - 201G Tampines Street 21","Discover the neighbourhood centre at Blocks 201 - 201G Tampines Street 21 and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/tampines/blocks-472-484-tampines-street-44","Blocks 472 - 484 Tampines Street 44","Discover the neighbourhood centre at Blocks 472 - 484 Tampines Street 44 and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/tampines/blocks-821-829-tampines-street-81","Blocks 821 - 829 Tampines Street 81","Discover the neighbourhood centre at Blocks 821 - 829 Tampines Street 81 and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/tampines/tampines-central-community-complex","Tampines Central Community Complex","Discover what Tampines Central Community Complex offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/tampines/tampines-town-centre","Tampines Town Centre","Discover what Tampines Town Centre offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/tengah","Tengah","Explore Tengah: Your guide to heartland shopping options in this town."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/tengah/plantation-plaza","Plantation Plaza","Learn more about Plantation Plaza and the latest happenings in the mall."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/toa-payoh","Toa Payoh","Explore Toa Payoh: Your guide to heartland shopping options in this town."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/toa-payoh/blocks-146-148-potong-pasir-avenue-1","Blocks 146 - 148 Potong Pasir Avenue 1","Discover the neighbourhood centre at Blocks 146 - 148 Potong Pasir Avenue 1 and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/toa-payoh/blocks-211-212-lorong-8-toa-payoh","Blocks 211 - 212 Lorong 8 Toa Payoh","Discover the neighbourhood centre at Blocks 211 - 212 Lorong 8 Toa Payoh and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/toa-payoh/hdb-hub","HDB Hub","Discover what HDB Hub offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/toa-payoh/joo-seng-green","Joo Seng Green","Discover what Joo Seng Green offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/toa-payoh/kim-keat-palm","Kim Keat Palm","Discover what Kim Keat Palm offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/toa-payoh/toa-payoh-palm-spring","Toa Payoh Palm Spring","Discover what Toa Payoh Palm Spring offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/toa-payoh/toa-payoh-town-centre","Toa Payoh Town Centre","Discover what Toa Payoh Town Centre offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/toa-payoh/toa-payoh-view","Toa Payoh View","Discover what Toa Payoh View offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/toa-payoh/toa-payoh-vista","Toa Payoh Vista","Discover what Toa Payoh Vista offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/woodlands","Woodlands","Explore Woodlands: Your guide to heartland shopping options in this town."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/woodlands/888-plaza","888 Plaza","Discover what 888 Plaza offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/woodlands/admiralty-place","Admiralty Place","Discover what Admiralty Place offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/woodlands/fuchun-neighbourhood-centre","Fuchun Neighbourhood Centre","Discover what Fuchun Neighbourhood Centre offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/woodlands/kampung-admiralty","Kampung Admiralty","Discover what Kampung Admiralty offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/woodlands/marsiling-court","Marsiling Court","Discover what Marsiling Court offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/woodlands/vista-point","Vista Point","Discover what Vista Point offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/woodlands/woodlands-civic-centre","Woodlands Civic Centre","Discover what Woodlands Civic Centre offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/woodlands/woodlands-mart","Woodlands Mart","Discover what Woodlands Mart offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/woodlands/woodlands-north-plaza","Woodlands North Plaza","Discover what Woodlands North Plaza offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/yishun","Yishun","Explore Yishun: Your guide to heartland shopping options in this town."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/yishun/chong-pang-city","Chong Pang City","Discover what Chong Pang City offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/yishun/khatib-central","Khatib Central","Discover what Khatib Central offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/yishun/nee-soon-east-courtyard","Nee Soon East Courtyard","Discover what Nee Soon East Courtyard offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/yishun/yishun-mall","Yishun Mall","Discover what Yishun Mall offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/explore-my-town/yishun/yishun-town-centre","Yishun Town Centre","Discover what Yishun Town Centre offers and how to get there."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/facilities","Facilities in HDB Neighbourhoods","We provide a range of recreational facilities and community spaces in HDB towns, to encourage active lifestyles, social interaction, and community bonding."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/neighbourhood-centres","Neighbourhood Centres","Neighbourhood Centres (NCs) are an integral part of HDB towns, giving residents easy access to dining, healthcare, shopping, and daily necessities."],
  ["/managing-my-home/living-in-my-community/exploring-my-neighbourhood/town-and-community-plazas","Town and Community Plazas","Look forward to new HDB town plazas, where you can meet and mingle with your friends and neighbours."],
  ["/managing-my-home/living-in-my-community/hdb-community-day","HDB Community Day","HDB Community Day celebrates residents who go the extra mile to enliven their neighbourhoods and build stronger neighbourly ties."],
  ["/managing-my-home/living-in-my-community/hdb-community-day/hdb-community-day-2023","HDB Community Day 2023","The HDB Community Day 2023 celebrates residents who go the extra mile to enliven their neighbourhoods and build stronger neighbourly ties."],
  ["/managing-my-home/living-in-my-community/hdb-community-day/hdb-community-day-2023/friends-of-our-heartlands-exhibition-2023","Friends of Our Heartlands Exhibition 2023","Learn how our outstanding 'Friends of Our Heartlands' volunteers bring people together."],
  ["/managing-my-home/living-in-my-community/hdb-community-day/hdb-community-day-2023/lively-places-challenge-2023","Lively Places Challenge 2023","Find out how HDB residents are empowered to initiate projects to brighten up the spaces in their neighbourhood."],
  ["/managing-my-home/living-in-my-community/hdb-community-day/hdb-community-day-2023/singapores-friendly-neighbourhood-award-2023","Singapore’s Friendly Neighbourhood Award 2023","Find out how residents go the extra mile to care for and support their neighbours."],
  ["/managing-my-home/living-in-my-community/hdb-community-day/partnerships","HDB Community Day – Partnerships","Learn how we nurture community partnerships with schools and organisations and celebrate resident-led initiatives and neighbourly acts in our estates."],
  ["/managing-my-home/living-in-my-community/hdb-community-day/people","HDB Community Day – People","Discover how our Friends of Our Heartlands volunteers build vibrant communities in the heartlands, and create meaningful connections with each other."],
  ["/managing-my-home/living-in-my-community/hdb-community-day/places","HDB Community Day – Places","Explore how HDB designs spaces that promote community-building in Tengah, our newest town."],
  ["/managing-my-home/living-in-my-community/practising-ecoliving","Practising Eco-Living","Learn how you can adopt a sustainable lifestyle through our programmes and tips."],
  ["/managing-my-home/living-in-my-community/practising-ecoliving/ecoliving-tips","Eco-Living Tips","Learn how you can play your part for the environment by adopting eco-friendly practices in your everyday life."],
  ["/managing-my-home/living-in-my-community/practising-ecoliving/sustainability-trails","Sustainability Trails","Embark on Sustainability Trails to learn more about the eco-destinations and green features that support eco-living."],
  ["/managing-my-home/living-in-my-community/practising-ecoliving/sustainability-trails/explorer-trail","Explorer Trail","Join us on the trail to learn more about the evolution of Punggol to Singapore’s first eco town."],
  ["/managing-my-home/living-in-my-community/practising-ecoliving/sustainability-trails/voyager-trail","Voyager Trail","Join us on the trail to learn more about the eco-design of Waterway Terraces I, and Punggol's sustainable development initiatives."],
  ["/managing-my-home/renovation-and-maintenance","Renovation and Maintenance","Find information on renovation guidelines and home maintenance for your flat."],
  ["/managing-my-home/renovation-and-maintenance/home-maintenance","Home Maintenance","Learn how you can attend to maintenance and repair matters for your flat."],
  ["/managing-my-home/renovation-and-maintenance/home-maintenance/function-of-hdb-branches-and-town-councils","Function of HDB Branches and Town Councils","Find out the shared roles and responsibilities among HDB, your Town Council and you in maintaining your flat."],
  ["/managing-my-home/renovation-and-maintenance/home-maintenance/guard-against-contractors-on-doortodoor-sales","Guard against Contractors on Door-to-Door Sales","Get tips to guard yourself against contractors doing door-to-door sales."],
  ["/managing-my-home/renovation-and-maintenance/home-maintenance/home-care-guide","Home Care Guide","Our maintenance guide contains useful information for you on how to keep your home in good condition."],
  ["/managing-my-home/renovation-and-maintenance/home-maintenance/home-care-guide/air-conditioners","Maintaining Air Conditioners in HDB Flats","Learn how to maintain your air conditioners and find a professional trained by the Building and Construction Authority."],
  ["/managing-my-home/renovation-and-maintenance/home-maintenance/home-care-guide/ceiling-leaks","Preventing and Fixing Ceiling Leaks in HDB Flats","Find out which parties are responsible for addressing ceiling leak repairs and the various methods for doing so."],
  ["/managing-my-home/renovation-and-maintenance/home-maintenance/home-care-guide/electrical-accessories-and-wiring","Maintaining Electrical Accessories and Wiring in HDB Flats","Learn about maintenance and repair of electrical accessories and wiring in your flat."],
  ["/managing-my-home/renovation-and-maintenance/home-maintenance/home-care-guide/floor-finishes","Cleaning and Maintaining Floor Tiles in HDB Flats","Find out how you can maintain and repair floor finishes in your flat."],
  ["/managing-my-home/renovation-and-maintenance/home-maintenance/home-care-guide/floor-traps","Fixing Choked Floor Traps in HDB Flats","Find out how you can maintain and repair floor traps in your flat."],
  ["/managing-my-home/renovation-and-maintenance/home-maintenance/home-care-guide/gate-and-door","Fixing Gate and Door Issues in HDB Flats","Find out how you can maintain and repair your flat’s gate and door."],
  ["/managing-my-home/renovation-and-maintenance/home-maintenance/home-care-guide/household-shelter","Fixing Household Shelter Door Issues in HDB Flats","Find out how you can maintan and repair your flat’s household shelter."],
  ["/managing-my-home/renovation-and-maintenance/home-maintenance/home-care-guide/pipes","Fixing Clogged or Leaking Pipes in HDB Flats","Learn about maintenance and repair of the water pipes and sanitary pipes in your flat."],
  ["/managing-my-home/renovation-and-maintenance/home-maintenance/home-care-guide/sinks-and-wash-basins","Fixing Clogged Sinks or Leaking Water Taps in HDB Flats","Learn about maintaining and repairing sinks and wash basins in your flat."],
  ["/managing-my-home/renovation-and-maintenance/home-maintenance/home-care-guide/spalling-concrete","Preventing and Fixing Spalling Concrete in HDB Flats","Spalling concrete is a common surface maintenance problem that can be prevented, and managed with proper repair."],
  ["/managing-my-home/renovation-and-maintenance/home-maintenance/home-care-guide/toilet-fittings","Cleaning and Maintaining Toilet Fittings in HDB Flats","Find out how you can maintain and repair your bathroom fittings."],
  ["/managing-my-home/renovation-and-maintenance/home-maintenance/home-care-guide/toilets","Fixing Toilet Flush Issues in HDB Flats","Find out how you can maintain and repair water closets in your flat."],
  ["/managing-my-home/renovation-and-maintenance/home-maintenance/home-care-guide/walls","Fixing Wall Cracks in HDB Flats","Find out how you can maintain and repair the ceiling and walls in your flat."],
  ["/managing-my-home/renovation-and-maintenance/home-maintenance/home-care-guide/windows","Keeping Windows of HDB Flats in Good Condition","Home owners are responsible for keeping your flat's windows in good condition. Learn how to maintain your windows to create a safe environment for everyone."],
  ["/managing-my-home/renovation-and-maintenance/home-maintenance/professional-help-and-contractors","Professional Help and Contractors","You can engage contractors to help with your flat’s maintenance and repair needs. Here are some things you should look out for before you do so."],
  ["/managing-my-home/renovation-and-maintenance/home-maintenance/professional-help-and-contractors/air-conditioners","Maintenance for Air Conditioners","Search for a professional trained by the Building and Construction Authority to carry out installation or repair works for air conditioners."],
  ["/managing-my-home/renovation-and-maintenance/home-maintenance/professional-help-and-contractors/minor-repairs","Maintenance for Minor Repairs","You can engage a contractor from the following list to carry out minor repairs in your flat."],
  ["/managing-my-home/renovation-and-maintenance/home-maintenance/professional-help-and-contractors/windows","Maintenance for Windows","Search for approved window contractors to carry out repair works."],
  ["/managing-my-home/renovation-and-maintenance/rectification-of-defects-in-new-flats","Rectification of Defects in New Flats","Inform the Building Service Centre or submit a maintenance request online, if there are areas in your new flat that require rectification,"],
  ["/managing-my-home/renovation-and-maintenance/renovation","Renovation","Read HDB’s guidelines for flat renovation works and engaging HDB’s registered renovation contractors."],
  ["/managing-my-home/renovation-and-maintenance/renovation/application-for-a-renovation-permit","Application for a Renovation Permit","Home owners should ensure approvals and permits are applied for before starting on renovations. Find out how you can apply for them."],
  ["/managing-my-home/renovation-and-maintenance/renovation/important-information-on-renovations","Important Information on Renovations","Home owners planning to have their flats renovated should take note of these important information."],
  ["/managing-my-home/renovation-and-maintenance/renovation/looking-for-renovation-contractors","Looking for Renovation Contractors","Use our e-Service to find HDB Registered Contractors and BCA Approved Window Contractors."],
  ["/managing-my-home/renovation-and-maintenance/renovation/renovation-guidelines","Renovation Guidelines","Familiarise yourself with HDB's renovation guidelines before you start renovating your home."],
  ["/managing-my-home/renovation-and-maintenance/renovation/renovation-guidelines/air-conditioner-installation-works","Renovation Guidelines for Air Conditioner Installation Works","You must engage a professional trained by the Building and Construction Authority to carry out installation works for air conditioners."],
  ["/managing-my-home/renovation-and-maintenance/renovation/renovation-guidelines/building-works","Renovation Guidelines for Building Works","Guidelines for building works have been put in place so you are aware of the types of works you can carry out in your flat."],
  ["/managing-my-home/renovation-and-maintenance/renovation/renovation-guidelines/electrical-works","Renovation Guidelines for Electrical Works","Guidelines for electrical works have been put in place so you are aware of the types of works you can carry out in your flat."],
  ["/managing-my-home/renovation-and-maintenance/renovation/renovation-guidelines/water-and-sanitary-plumbing-works-and-gas-works","Renovation Guidelines for Water and Sanitary Plumbing Works and Gas Works","Guidelines for water, sanitary plumbing and gas works have been put in place so you are aware of the types of works you can carry out in your flat."],
  ["/managing-my-home/renovation-and-maintenance/renovation/renovation-guidelines/window-works","Renovation Guidelines for Window Works","Guidelines for window works have been put in place so you are aware of the types of works you can carry out in your flat."],
  ["/managing-my-home/retirement-planning","Retirement Planning","Learn about the benefits you can enjoy under the Enhancement for Active Seniors (EASE) programme and the monetisation options to enhance your retirement."],
  ["/managing-my-home/retirement-planning/monetising-flat-for-retirement","Monetising Flat for Retirement","There are various housing monetisation options available to help you unlock the value of your HDB flat, to supplement your retirement needs."],
  ["/managing-my-home/retirement-planning/monetising-flat-for-retirement/lease-buyback-scheme-lbs","Lease Buyback Scheme (LBS)","The Lease Buyback Scheme (LBS) is an additional monetisation option to help elderly households supplement retirement funds."],
  ["/managing-my-home/retirement-planning/monetising-flat-for-retirement/lease-buyback-scheme-lbs/application-process","Application Process for Lease Buyback Scheme (LBS)","Find out what is required to apply for the Lease Buyback Scheme (LBS), what happens after your application, and the fees payable."],
  ["/managing-my-home/retirement-planning/monetising-flat-for-retirement/lease-buyback-scheme-lbs/understanding-the-lbs","Understanding the Lease Buyback Scheme (LBS)","Learn about how the Lease Buyback Scheme (LBS) works to boost your retirement savings as you age in place."],
  ["/managing-my-home/retirement-planning/monetising-flat-for-retirement/silver-housing-bonus","Silver Housing Bonus","Learn more about right-sizing your flat to supplement your retirement funds through the Silver Housing Bonus scheme."],
  ["/managing-my-home/retirement-planning/use-of-cpf-for-loan-repayment","Use of CPF for Loan Repayment","Gain a better understanding of CPF rules and find out how you can use your CPF to repay housing loans after 55."],
  ["/managing-my-home/selling-a-flat","Selling a Flat","If you plan to sell your HDB flat, find out what you need to consider for both the sale and your next home."],
  ["/managing-my-home/selling-a-flat/eligibility","Eligibility for Selling a Flat","Find out the eligibility conditions and requirements that you need to fulfil before selling your flat."],
  ["/managing-my-home/selling-a-flat/process-for-selling-a-flat","Process for Selling a Flat","Find out the process for selling an HDB flat."],
  ["/managing-my-home/selling-a-flat/process-for-selling-a-flat/intent-to-sell","Intent to Sell","Start your flat selling journey by registering an Intent to Sell."],
  ["/managing-my-home/selling-a-flat/process-for-selling-a-flat/option-to-purchase","Option to Purchase When Selling a Flat","Read about granting an Option to Purchase to your flat buyers, including the timeline and process."],
  ["/managing-my-home/selling-a-flat/process-for-selling-a-flat/overview","Overview of Flat Selling Process","Learn the steps involved in selling your flat."],
  ["/managing-my-home/selling-a-flat/process-for-selling-a-flat/resale-flat-application","Resale Flat Application for Sellers","Find out how to submit a resale application and what to expect after submission."],
  ["/managing-my-home/selling-a-flat/process-for-selling-a-flat/resale-flat-application/application-process","Application Process for Sale of Flat","Learn about the details and documents required when sellers submit a resale application."],
  ["/managing-my-home/selling-a-flat/process-for-selling-a-flat/resale-flat-application/approval-of-application","Approval of Resale Flat Application for Sellers","Find out what actions sellers need to take before the resale application is approved."],
  ["/managing-my-home/selling-a-flat/process-for-selling-a-flat/resale-flat-application/request-for-temporary-extension-of-stay","Request for Temporary Extension of Stay","Read more about the request for a temporary extension of stay."],
  ["/managing-my-home/selling-a-flat/process-for-selling-a-flat/resale-flat-completion","Resale Flat Completion for Sellers","Learn about what you need to do before and during the resale completion appointment."],
  ["/managing-my-home/selling-a-flat/process-for-selling-a-flat/resale-flat-planning","Resale Flat Planning for Sellers","Prepare for the sale of your flat by understanding the considerations and steps involved."],
  ["/managing-my-home/selling-a-flat/process-for-selling-a-flat/resale-flat-planning/managing-the-sale-of-flat","Managing the Sale of Flat","Learn how to manage the sale of your flat on your own or with a salesperson."],
  ["/managing-my-home/selling-a-flat/process-for-selling-a-flat/resale-flat-planning/resale-statistics","Resale Statistics","Access current and past resale statistics to understand HDB resale market movements and make an informed decision."],
  ["/managing-my-home/upgrading-and-redevelopment","Upgrading and Redevelopment","HDB has several upgrading and redevelopment programmes to enhance the overall living environment of HDB estates."],
  ["/managing-my-home/upgrading-and-redevelopment/enhancement-for-active-seniors-ease","Enhancement for Active Seniors (EASE)","Find out more about the benefits, eligibility criteria, and application process for the Enhancement for Active Seniors (EASE) programme."],
  ["/managing-my-home/upgrading-and-redevelopment/enhancement-for-active-seniors-ease/videos-on-ease-direct-application","Videos on EASE (Direct Application)","Enjoy short video clips on EASE and hear from a senior on how she had benefited from EASE."],
  ["/managing-my-home/upgrading-and-redevelopment/home-improvement-programme-hip","Home Improvement Programme (HIP)","The Home Improvement Programme (HIP) helps flat owners resolve common maintenance issues in ageing flats."],
  ["/managing-my-home/upgrading-and-redevelopment/lift-upgrading-programme-lup","Lift Upgrading Programme (LUP)","The Lift Upgrading Programme (LUP) improves lift access to flats, to provide greater convenience for residents."],
  ["/managing-my-home/upgrading-and-redevelopment/neighbourhood-renewal-programme-nrp","Neighbourhood Renewal Programme (NRP)","The Neighbourhood Renewal Programme (NRP) focuses on precinct and block improvements. It covers a larger area spanning 2 or more neighbouring precincts."],
  ["/managing-my-home/upgrading-and-redevelopment/pay-upgrading-cost","Pay Upgrading Cost","Find out the process to pay your upgrading cost, as well as the subsidies and financial assistance measures you can enjoy."],
  ["/managing-my-home/upgrading-and-redevelopment/pay-upgrading-cost/change-of-flat-ownership-and-liability-to-pay","Change of Flat Ownership and Liability to Pay Upgrading Cost","Find out who is liable to pay for the uprading cost when there is a change of flat ownership."],
  ["/managing-my-home/upgrading-and-redevelopment/pay-upgrading-cost/change-repayment-period-or-convert-interest-rate","Change Repayment Period or Convert Interest Rate of Upgrading Cost","If you have outstanding upgrading costs, you can apply to make changes to your repayment period or convert your interest rate."],
  ["/managing-my-home/upgrading-and-redevelopment/pay-upgrading-cost/process","Process for Paying Upgrading Cost","Find out how you can pay for your upgrading cost."],
  ["/managing-my-home/upgrading-and-redevelopment/pay-upgrading-cost/scheduled-billing-date-and-statement-of-account","Scheduled Billing Date and Statement of Account for Upgrading Cost","Learn when you will be billed for your upgrading cost."],
  ["/managing-my-home/upgrading-and-redevelopment/pay-upgrading-cost/subsidies-and-financial-assistance-measures","Subsidies and Financial Assistance Measures for Paying Upgrading Cost","Read about the financial assistance available if you have difficulties in paying your upgrading cost."],
  ["/managing-my-home/upgrading-and-redevelopment/selective-en-bloc-redevelopment-scheme-sers","Selective En bloc Redevelopment Scheme (SERS)","We renew our older estates through SERS. SERS residents will be offered the opportunity to live in a new flat on a fresh 99-year lease."],
  ["/marsiling-crescent-lane-acquisition-project","Marsiling Crescent/ Lane Acquisition Project","Find information about the Marsiling Crescent/ Lane acquisition project."],
  ["/mobile-concierge/terms-and-conditions","Terms and Conditions",""],
  ["/mortgage-loan/upgrading-cost-instalments-rent-and-other-charges/get-help","Get Help",""],
  ["/mortgage-loan/upgrading-cost-instalments-rent-and-other-charges/help","Help",""],
  ["/mydochdb/get-help","Get Help",""],
  ["/myhdb-mobile-app","MyHDB Mobile App","Download the MyHDB mobile app for easy access to HDB-related information on the go."],
  ["/myhdb-mobile-app/privacy-statement","Privacy Statement","Learn about HDB's data protection policies and how we handle your personal information."],
  ["/myhdb-page","",""],
  ["/myrequest/get-help","Get Help",""],
  ["/outstanding-parking-fees/get-help","Get Help",""],
  ["/outstanding-parking-fees/terms-and-conditions","Terms and Conditions",""],
  ["/parking","Parking","Discover HDB car park regulations and season parking options."],
  ["/parking/applying-for-season-parking","Applying for Season Parking","Find out about season parking in HDB car parks, including the types of season parking available, the application process, and related matters."],
  ["/parking/applying-for-season-parking/apply-for-concessionary-season-parking-for-motorcycles","Apply for Concessionary Season Parking for Motorcycles","With Concessionary Season Parking (CSP), you can park your motorcycle in unreserved lots at all HDB car parks without short-term charges."],
  ["/parking/applying-for-season-parking/apply-for-family-season-parking","Apply for Family Season Parking","With Family Season Parking (FSP), existing season parking holders can park at reserved lots near immediate family members' home at half the rate."],
  ["/parking/applying-for-season-parking/apply-for-family-season-parking/application-process","Application Process for Family Season Parking","Find out how to apply for Family Season Parking (FSP) and the documents you need."],
  ["/parking/applying-for-season-parking/apply-for-family-season-parking/eligibility","Eligibility for Family Season Parking","Check your eligibility before applying for Family Season Parking (FSP)."],
  ["/parking/applying-for-season-parking/apply-for-family-season-parking/family-season-parking-charges","Family Season Parking Charges","Learn more about Family Season Parking (FSP) charges, which vary for different vehicle types."],
  ["/parking/applying-for-season-parking/apply-for-season-parking","Apply for Season Parking","Find out how to apply for season parking and learn about the charges."],
  ["/parking/applying-for-season-parking/apply-for-season-parking-for-commercial-vehicles","Apply for Season Parking for Commercial Vehicles","Find out if you can park your commercial vehicles, such as vans, lorries, trucks, and other light goods vehicles, at HDB car parks."],
  ["/parking/other-parking-matters","Other Parking Matters","Find out about other parking matters, including short-term parking and car parks for business use."],
  ["/parking/other-parking-matters/car-parks-for-business-activities","Car Parks for Business Activities","Learn how to conduct a car cleaning, grooming, or car sharing business in HDB car parks."],
  ["/parking/other-parking-matters/car-parks-for-business-activities/car-cleaning-services","Car Cleaning Services","Find out how to operate a car cleaning service in HDB car parks."],
  ["/parking/other-parking-matters/car-parks-for-business-activities/courier-hub-scheme-chs","Courier Hub Scheme (CHS)","Find out more about the Courier Hub Scheme and how companies can apply."],
  ["/parking/other-parking-matters/car-parks-for-business-activities/other-business-activities","Other Business Activities","Learn about the guidelines and requirements for conducting business activities in HDB car parks."],
  ["/parking/other-parking-matters/shortterm-parking","Short-Term Parking","Learn about the different types of short-term parking at HDB car parks."],
  ["/parking/other-parking-matters/shortterm-parking/coupon-parking","Coupon Parking","If you do not have a valid season parking ticket for a particular HDB car park, you need to use parking coupons. Learn how."],
  ["/parking/other-parking-matters/shortterm-parking/coupon-parking/how-to-display-parking-coupons","How to Display Parking Coupons","Learn how to correctly display your parking coupon."],
  ["/parking/other-parking-matters/shortterm-parking/coupon-parking/how-to-seek-a-refund-for-unused-parking-coupons","How to Seek a Refund for Unused Parking Coupons","Get a refund for your unused or expired parking coupons at the URA Centre or selected HDB Branches."],
  ["/parking/other-parking-matters/shortterm-parking/coupon-parking/where-to-buy-parking-coupons","Where to Buy Parking Coupons","You can buy parking coupons at authorised sale outlets."],
  ["/parking/other-parking-matters/shortterm-parking/electronic-parking","Electronic Parking","Our electronic parking system eliminates the hassle of parking coupons by deducting parking charges from the CashCard in your In-Vehicle Unit upon exit."],
  ["/parking/other-parking-matters/shortterm-parking/free-parking-scheme-on-sundays-and-public-holidays","Free Parking Scheme on Sundays and Public Holidays","The Free Parking Scheme (FPS) is available in selected HDB car parks on Sundays and Public Holidays within the listed hours."],
  ["/parking/other-parking-matters/shortterm-parking/parkinghdb","Parking@HDB","Explore Parking@HDB, a smart parking system designed to offer a hassle-free parking experience for motorists."],
  ["/parking/other-parking-matters/shortterm-parking/parkinghdb/frequently-asked-questions","Frequently Asked Questions on Parking@HDB","Read frequently asked questions about the Parking@HDB smart parking system."],
  ["/parking/other-parking-matters/shortterm-parking/parkinghdb/privacy-statement","Privacy Statement for Parking@HDB","Read the privacy statement for the Parking@HDB smart parking system."],
  ["/parking/other-parking-matters/shortterm-parking/parkinghdb/terms-of-use","Terms of Use for Parking@HDB","Read the terms of use for the Parking@HDB smart parking system."],
  ["/parking/other-parking-matters/shortterm-parking/shortterm-parking-charges","Short-Term Parking Charges","Find out the short-term parking charges at HDB car parks."],
  ["/parking/other-parking-matters/temporary-parking-for-bereavement-matters","Temporary Parking for Bereavement Matters","Apply for temporary parking in an HDB estate when attending to bereavement matters."],
  ["/parking/parking-offences","Parking Offences","Learn about parking rules and how to pay a parking fine."],
  ["/parking/parking-offences/parking-rules-and-penalties","Parking Rules and Penalties","Learn about parking rules and penalties in HDB estates."],
  ["/parking/parking-offences/pay-parking-fines","Pay Parking Fines","Learn about the various channels for paying parking fines."],
  ["/parking/parking-offences/report-a-parking-offence","Report a Parking Offence","Learn how you can use the OneService App to report a suspected parking offence."],
  ["/parking/renewing-season-parking","Renewing Season Parking","Find out how to renew your season parking, family season parking, or concessionary season parking for motorcycles."],
  ["/parking/renewing-season-parking/renew-concessionary-season-parking-for-motorcycles","Renew Concessionary Season Parking for Motorcycles","You can renew your Concessionary Season Parking for Motorcycles (CSP) for a period longer than the normal validity."],
  ["/parking/renewing-season-parking/renew-family-season-parking","Renew Family Season Parking","You can renew your Family Season Parking (FSP) for a period no longer than the normal validity."],
  ["/parking/renewing-season-parking/renew-season-parking","Renew Season Parking","Renew your season parking and check for availability of lots at your preferred HDB car park."],
  ["/parking/terminating-season-parking","Terminating Season Parking","Find out how to terminate your season parking, family season parking, or concessionary season parking for motorcycles."],
  ["/parking/terminating-season-parking/terminate-concessionary-season-parking-for-motorcycles","Terminate Concessionary Season Parking for Motorcycles","Request to terminate your Concessionary Season Parking for Motorcycles (CSP) if it is no longer required."],
  ["/parking/terminating-season-parking/terminate-family-season-parking","Terminate Family Season Parking","You may terminate your Family Season Parking (FSP) and request for a refund if it is no longer needed."],
  ["/parking/terminating-season-parking/terminate-season-parking","Terminate Season Parking","Terminate your season parking if it is no longer required."],
  ["/parking/transferring-season-parking","Transferring Season Parking","Find out how to transfer your season parking or concessionary season parking for motorcycles."],
  ["/parking/transferring-season-parking/transfer-concessionary-season-parking-for-motorcycles","Transfer Concessionary Season Parking for Motorcycles","Transfer your Concessionary Season Parking for Motorcycles (CSP), if you changed vehicle or your family moved to another flat/ shop."],
  ["/parking/transferring-season-parking/transfer-season-parking","Transfer Season Parking","You may transfer your season parking if you have changed your vehicle or car park."],
  ["/pay-administrative-fees-to-rent-out-flat-bedroom/get-help","Get Help",""],
  ["/pay-fees-for-directory-of-renovation-contractors-drc/get-help","Get Help",""],
  ["/pay-fees-for-directory-of-renovation-contractors-drc/terms-and-conditions","Terms and Conditions",""],
  ["/pay-final-instalment-or-fees-for-discharge-of-housing-loan/get-help","Get Help",""],
  ["/pay-final-instalment-or-fees-for-discharge-of-housing-loan/terms-and-conditions","Terms and Conditions",""],
  ["/pay-full-upgrading-cost/get-help","Get Help",""],
  ["/pay-full-upgrading-cost/terms-and-conditions","Terms and Conditions",""],
  ["/pay-overdue-housing-loan-or-upgrading-cost-with-cpf/get-help","Get Help",""],
  ["/pay-overdue-housing-loan-or-upgrading-cost-with-cpf/terms-and-conditions","Terms and Conditions",""],
  ["/pay-parking-fines-via-vehicle-notice-reference-number/get-help","Get Help",""],
  ["/pay-parking-fines-via-vehicle-notice-reference-number/terms-and-conditions","Terms and Conditions",""],
  ["/pay-parking-fines/get-help","Get Help",""],
  ["/pay-parking-fines/terms-and-conditions","Terms and Conditions",""],
  ["/permanently-transfer-season-parking-to-another-car-park/get-help","Get Help",""],
  ["/permanently-transfer-season-parking-to-another-car-park/terms-and-conditions","Terms and Conditions",""],
  ["/permanently-transfer-season-parking-to-another-vehicle/get-help","Get Help",""],
  ["/permanently-transfer-season-parking-to-another-vehicle/terms-and-conditions","Terms and Conditions",""],
  ["/privacy-statement","Privacy Statement","Learn about HDB's data protection policies and how we handle your personal information."],
  ["/purchase-hdb-tender-documents/get-help","Get Help",""],
  ["/purchase-hdb-tender-documents/terms-and-conditions","Terms and Conditions",""],
  ["/renew-listing-in-directory-of-renovation-contractors-drc/get-help","Get Help",""],
  ["/renew-listing-in-directory-of-renovation-contractors-drc/terms-and-conditions","Terms and Conditions",""],
  ["/renew-season-parking/get-help","Get Help",""],
  ["/renew-season-parking/terms-and-conditions","Terms and Conditions",""],
  ["/renew-tenancy-or-licence-for-hdb-commercial-properties/get-help","Get Help",""],
  ["/renew-tenancy-or-licence-for-hdb-commercial-properties/terms-and-conditions","Terms and Conditions",""],
  ["/renewal-of-vehicle-parking-certificate/terms-and-conditions","Terms and Conditions",""],
  ["/renting-a-flat","Renting a Flat","Find out more about the flat rental options available to you."],
  ["/renting-a-flat/parenthood-provisional-housing-scheme","Parenthood Provisional Housing Scheme (PPHS)","Rent a temporary flat while waiting for your new home to be completed under the Parenthood Provisional Housing Scheme (PPHS)."],
  ["/renting-a-flat/parenthood-provisional-housing-scheme/application-changes-and-cancellation","Application Changes and Cancellation for PPHS","Find out how you can cancel your application for a flat under the Parenthood Provisional Housing Scheme."],
  ["/renting-a-flat/parenthood-provisional-housing-scheme/application-process","Application Process for Parenthood Provisional Housing Scheme (PPHS)","Check out the application and selection process of the Parenthood Provisional Housing Scheme."],
  ["/renting-a-flat/parenthood-provisional-housing-scheme/application-process/applications-received","Applications Received for Parenthood Provisional Housing Scheme (PPHS)","View the number of applications received for Parenthood Provisional Housing Scheme flats."],
  ["/renting-a-flat/parenthood-provisional-housing-scheme/application-process/pphs-flats-available-for-application","PPHS Flats Available for Application","Check out the flats you can rent under the Parenthood Provisional Housing Scheme, and information on flat locations, lease expiry, and furniture leasing."],
  ["/renting-a-flat/parenthood-provisional-housing-scheme/eligibility","Eligibility for Parenthood Provisional Housing Scheme (PPHS)","Check out the eligibility conditions for renting a flat under the Parenthood Provisional Housing Scheme."],
  ["/renting-a-flat/parenthood-provisional-housing-scheme/rents-and-deposits","Rents and Deposits for Parenthood Provisional Housing Scheme (PPHS)","Check out the rental rates of PPHS flats, which vary according to their location and type."],
  ["/renting-a-flat/parenthood-provisional-housing-scheme/tenancy-matters","Tenancy Matters for Parenthood Provisional Housing Scheme (PPHS)","Find out about the terms and conditions of your Parenthood Provisional Housing Scheme tenancy agreement."],
  ["/renting-a-flat/public-rental-scheme","Public Rental Scheme","Find out more about renting a flat from HDB through the Public Rental Scheme."],
  ["/renting-a-flat/public-rental-scheme/application-process","Application Process for Public Rental Scheme","Get more information on the application process to rent a flat under the Public Rental Scheme."],
  ["/renting-a-flat/public-rental-scheme/application-process/application-and-selection-of-rental-flat","Application and Selection of Flat Under Public Rental Scheme","Find out more about the application process for the Public Rental Scheme, the documents you need, and timelines."],
  ["/renting-a-flat/public-rental-scheme/application-process/application-changes-and-cancellation","Application Changes and Cancellation for Public Rental Scheme","If you have applied for a flat under the Public Rental Scheme and would like to change or cancel your application, learn how you can do so."],
  ["/renting-a-flat/public-rental-scheme/application-process/rental-flat-types-and-locations","Rental Flat Types and Locations Under Public Rental Scheme","View flat types and locations under the Public Rental Scheme."],
  ["/renting-a-flat/public-rental-scheme/application-process/rental-flat-types-and-locations/partitioned-flat","Partitioned Flat","Registered JSS applicants would be allocated a 1-room flat which has partitioned sleeping areas, subject to availability."],
  ["/renting-a-flat/public-rental-scheme/application-process/rents-and-deposits","Rents and Deposits for Public Rental Scheme","The rental rates for Public Rental Scheme flats vary according to the town and flat types. Check out the rates here."],
  ["/renting-a-flat/public-rental-scheme/eligibility","Eligibility for Public Rental Scheme","Get more information on the eligibility criteria for renting a flat under the Public Rental Scheme."],
  ["/renting-a-flat/public-rental-scheme/eligibility/comlink-rental-scheme","Comlink+ Rental Scheme","Learn about the Comlink+ Rental Scheme for families in public rental housing with children below 21 years old."],
  ["/renting-a-flat/public-rental-scheme/eligibility/joint-singles-scheme-operatorrun-jssor-pilot","Joint Singles Scheme Operator-Run (JSS-OR) Pilot","The Joint Singles Scheme Operator-Run (JSS-OR) Pilot allows singles to apply for rental housing without first having to find a flatmate."],
  ["/renting-a-flat/public-rental-scheme/eligibility/single-room-shared-facilities-srsf-pilot","Single Room Shared Facilities (SRSF) Pilot","HDB is piloting a new typology, the Single Room Shared Facilities (SRSF) model, to enhance options for singles under the Public Rental Scheme."],
  ["/renting-a-flat/public-rental-scheme/tenancy-matters","Tenancy Matters for Public Rental Flats","Get more information on tenancy matters such as rent payment and change of tenancy, if you have been allocated a rental flat."],
  ["/renting-a-flat/public-rental-scheme/tenancy-matters/assistance-for-tenants","Assistance for Tenants of Public Rental Flats","We have financial assistance measures to help rental flat tenants who are facing financial hardship."],
  ["/renting-a-flat/public-rental-scheme/tenancy-matters/change-of-occupiers","Change of Occupiers for Public Rental Flats","Find out about including or removing occupiers of your rental flat, and the conditions to be met."],
  ["/renting-a-flat/public-rental-scheme/tenancy-matters/change-of-tenancy","Change of Tenancy for Public Rental Flats","Find out how to apply for a change of tenancy through your rental flat’s managing HDB Branch."],
  ["/renting-a-flat/public-rental-scheme/tenancy-matters/rent-payment-and-late-charges","Rent Payment and Late Charges","Here are some of the ways you can pay for your HDB rental flat and late payment charges incurred."],
  ["/renting-a-flat/public-rental-scheme/tenancy-matters/transfer-to-another-public-rental-flat","Transfer to Another Public Rental Flat","Find out how you can apply for a transfer to another rental flat through your rental flat’s managing HDB Branch."],
  ["/renting-a-flat/public-rental-scheme/tenancy-renewal","Tenancy Renewal for Public Rental Flats","Find out how you can apply for a renewal of tenancy if you would like to cotinue renting your existing flat."],
  ["/renting-a-flat/public-rental-scheme/tenancy-termination","Tenancy Termination for Public Rental Flats","Learn what to do if you would like to terminate the tenancy of your rental flat."],
  ["/renting-a-flat/renting-from-open-market","Renting from Open Market","Get information about renting an HDB flat from the open market."],
  ["/renting-a-flat/renting-from-open-market/eligibility","Eligibility for Renting a Flat or a Bedroom from Open Market","View eligibility conditions and guidelines for renting an HDB flat or bedroom from the open market."],
  ["/renting-a-flat/renting-from-open-market/regulations","Regulations for Renting a Flat or a Bedroom from Open Market","Understand the regulations for renting out your HDB flat, including the maximum tenants and occupants allowed in different flat types."],
  ["/renting-a-flat/renting-from-open-market/rental-statistics","Rental Statistics","View past median rents of flats in various locations and number of rental approvals by flat type."],
  ["/renting-a-flat/renting-from-open-market/tenancy-matters","Tenancy Matters for Renting a Flat or a Bedroom from Open Market","Get information on rental and deposit payments, and handling disputes between tenants and flat owners."],
  ["/request-gst-refund/get-help","Get Help",""],
  ["/search-hdb-materials-list/get-help","Get Help",""],
  ["/search-hdb-materials-list/terms-and-conditions","Terms and Conditions",""],
  ["/search-results","Search Results","Browse search results, refine your query, or use filters for more precise results."],
  ["/security-advisory","Security Advisory","Learn how to protect yourself from phishing scams."],
  ["/set-up-cpf-giro-payment-for-upgrading-cost/get-help","Get Help",""],
  ["/set-up-cpf-giro-payment-for-upgrading-cost/terms-and-conditions","Terms and Conditions",""],
  ["/shops-and-offices","Shops and Offices","Rent, buy, sell, or manage HDB commercial spaces and facilities at HDB Hub."],
  ["/shops-and-offices/business-resources","Business Resources","Access business resources including newsletters and pro-business schemes and services."],
  ["/shops-and-offices/business-resources/Newsletter","Newsletter","Heartland Biz! is a newsletter designed for HDB shopkeepers, containing updates on business and marketing matters, as well as tips on improving business."],
  ["/shops-and-offices/business-resources/probusiness-schemes","Pro-Business Schemes","Find out more about the Revitalisation of Shops scheme and other pro-business measures by HDB and Enterprise Singapore."],
  ["/shops-and-offices/buying-from-open-market","Buying from Open Market","Take note of these points if you want to buy an HDB commercial unit from the open market."],
  ["/shops-and-offices/buying-from-open-market/application-guidelines","Application Guidelines for Buying an HDB Shop or Office from Open Market","Find out the eligibility criteria, process, and costs of buying HDB commercial properties from the open market."],
  ["/shops-and-offices/managing-an-hdb-shop-or-office","Managing an HDB Shop or Office","Learn how to manage the business matters of your HDB commercial unit."],
  ["/shops-and-offices/managing-an-hdb-shop-or-office/change-of-companys-name","Change of Company's Name","If you are renting an HDB commercial unit and changing your company's name, you will need to inform HDB about the change if you are not the sole-proprietor."],
  ["/shops-and-offices/managing-an-hdb-shop-or-office/change-of-partners-shareholders-mode-of-business","Change of Partners, Shareholders, Mode of Business","These are the necessary steps to take regarding a change of partners, shareholders, or mode of business for an HDB commercial unit."],
  ["/shops-and-offices/managing-an-hdb-shop-or-office/change-of-trade","Change of Trade","Take note of these important information and instructions if you are renting an HDB commercial unit, and there is to be a change of trade."],
  ["/shops-and-offices/managing-an-hdb-shop-or-office/change-of-use","Change of Use","Find out the guidelines and process to apply for a change in use for your HDB commercial unit."],
  ["/shops-and-offices/managing-an-hdb-shop-or-office/change-of-use/application-process","Application Process for Change in Use of HDB Shop or Office","See how you can apply for a change in use for your HDB commercial unit."],
  ["/shops-and-offices/managing-an-hdb-shop-or-office/change-of-use/permissible-trades","Permissible Trades","See the list of permissible trades for HDB commercial units."],
  ["/shops-and-offices/managing-an-hdb-shop-or-office/change-of-use/renew-change-of-use","Renew Change of Use of HDB Shop or Office","Find out how to renew the change of use approval for your HDB commercial unit."],
  ["/shops-and-offices/managing-an-hdb-shop-or-office/change-of-use/using-a-shops-living-quarters","Using a Shop’s Living Quarters","Renting out of your HDB shop’s living quarters is only allowed under specific conditions."],
  ["/shops-and-offices/managing-an-hdb-shop-or-office/guidelines-for-hdb-eating-houses","Guidelines for HDB Eating Houses","Learn about the guidelines for HDB eating houses, including requirements for the budget meal initiative."],
  ["/shops-and-offices/managing-an-hdb-shop-or-office/renew-tenancy","Tenancy Renewal for HDB Shop or Office","Find out how to renew the tenancy of your HDB commercial unit. You will need to meet the relevant criteria and submit supporting documents."],
  ["/shops-and-offices/managing-an-hdb-shop-or-office/renovation","Renovating an HDB Shop or Office","Read the guidelines for renovating your HDB commercial unit, with different processes to follow depending on the type of works."],
  ["/shops-and-offices/managing-an-hdb-shop-or-office/renovation/addition-alteration-aa-works","Addition & Alteration (A&A) Works","Read these renovation guidelines before conducting any addition and alteration works to your HDB commercial unit."],
  ["/shops-and-offices/managing-an-hdb-shop-or-office/renovation/application-process","Application Process for Renovation of HDB Shop or Office","Use CORENET to submit renovation applications for HDB commercial units. This does not apply for commercial units within shopping and office complexes."],
  ["/shops-and-offices/managing-an-hdb-shop-or-office/renovation/electrical-works","Electrical Works for HDB Shop or Office","Read guidelines for electrical work in HDB commercial units. These are not applicable for commercial units within shopping and office complexes."],
  ["/shops-and-offices/managing-an-hdb-shop-or-office/rental-payment","Rental Payment for HDB Shop or Office","Find out what you need to do to pay rent for your HDB commercial unit, and retrieve tax invoices and account statements."],
  ["/shops-and-offices/managing-an-hdb-shop-or-office/rental-payment/mode-of-payment-for-rent","Mode of Payment for Rental of HDB Shop or Office","Get information about making rental payment for your HDB commercial unit."],
  ["/shops-and-offices/managing-an-hdb-shop-or-office/rental-payment/retrieve-tax-invoice-and-statement-of-account","Retrieve Tax Invoice and Statement of Account","Find out how to view and print your Statement of Account and Tax Invoice."],
  ["/shops-and-offices/managing-an-hdb-shop-or-office/renting-out","Renting Out an HDB Shop or Office","Note these important information if you intend to rent out an HDB commercial unit to someone for business or residential use."],
  ["/shops-and-offices/managing-an-hdb-shop-or-office/renting-out/application-process","Application Process for Renting Out an HDB Shop or Office","Learn the application process and fees payable if you would like to rent out your HDB commercial unit."],
  ["/shops-and-offices/managing-an-hdb-shop-or-office/renting-out/manage-subtenant","Manage (Sub)tenant for HDB Shop or Office","Learn how to manage (sub)tenant matters or change (sub)tenants for your HDB commercial unit. (Sub)tenant matters are not applicable for office complexes."],
  ["/shops-and-offices/managing-an-hdb-shop-or-office/renting-out/proposed-subtenants-trade","Proposed Subtenant’s Trade","Know the criteria and applicable trade conditions for renting out your HDB commercial unit. Not applicable for renting out of units within office complexes."],
  ["/shops-and-offices/managing-an-hdb-shop-or-office/renting-out/renting-out-living-quarters","Renting Out Living Quarters of HDB Shop or Office","Conditions apply for renting out living quarters of HDB commercial units for residential or commercial use."],
  ["/shops-and-offices/managing-an-hdb-shop-or-office/renting-out/terms-and-conditions","Terms and Conditions for Renting Out an HDB Shop or Office","Read the terms and conditions for renting out your HDB commercial unit. Not applicable for renting out of units within office complexes."],
  ["/shops-and-offices/managing-an-hdb-shop-or-office/terminate-tenancy","Terminate Tenancy of HDB Shop or Office","Find out about the conditions and process to terminate tenancy for an HDB commercial unit."],
  ["/shops-and-offices/managing-an-hdb-shop-or-office/treatment-of-30year-leases","Treatment of 30-Year Leases","Learn what happens when the lease expires for commercial properties sold on 30-year leases."],
  ["/shops-and-offices/renting-from-hdb","Renting from HDB","Check out how you can rent an HDB commercial unit or facility located in HDB Hub."],
  ["/shops-and-offices/renting-from-hdb/crossagency-tenders","Cross-Agency Tenders","We partner agencies to tender out some properties to bring greater convenience to our residents."],
  ["/shops-and-offices/renting-from-hdb/hdb-hub-convention-centre-for-rent","HDB Hub Convention Centre for Rent","Find out how to rent the auditorium and function rooms at the HDB Hub Convention Centre, which can accommodate 30 to 480 people."],
  ["/shops-and-offices/renting-from-hdb/hdb-hub-mall-area-for-rent","HDB Hub Mall Area for Rent","Showcase your business or event by renting our mall concourse spaces at attractive rates."],
  ["/shops-and-offices/renting-from-hdb/shops-and-offices-for-rent","Shops and Offices for Rent","Find out the eating houses, supermarkets, New Generation Neighbourhood Centres, and other shops and offices available for tender."],
  ["/shops-and-offices/renting-from-hdb/shops-and-offices-for-rent/documents-and-checklists","Documents and Checklists for Renting an HDB Shop or Office","Find out next steps and required documents after you successfully bid for an HDB commercial unit."],
  ["/shops-and-offices/renting-from-hdb/shops-and-offices-for-rent/tender-process","Tender Process for Renting an HDB Shop or Office","Learn how to find and tender for an HDB commercial unit."],
  ["/shops-and-offices/renting-from-open-market","Renting from Open Market","Read information on renting an HDB commercial unit from the open market."],
  ["/shops-and-offices/renting-from-open-market/application-guidelines","Application Guidelines for Renting an HDB Shop or Office from Open Market","Learn the details and process for renting an HDB commercial unit from the open market."],
  ["/shops-and-offices/selling-on-open-market","Selling on Open Market","Learn the guidelines and process to selling your HDB commercial unit on the open market."],
  ["/shops-and-offices/selling-on-open-market/consent-to-mortgage","Consent to Mortgage an HDB Shop","Check if you need HDB's consent to mortgage a sold HDB shop."],
  ["/shops-and-offices/selling-on-open-market/documents-and-checklists","Documents and Checklists for Selling an HDB Shop or Office","Find out the criteria, fees, and required documents to sell your HDB commercial unit in the open market."],
  ["/shops-and-offices/selling-on-open-market/inspection-report","Inspection Report for Selling an HDB Shop or Office","Find out whether you need an inspection report of your HDB commercial unit and how to obtain it, as well as who is qualified to inspect the unit."],
  ["/shops-and-offices/selling-on-open-market/lodgement-scheme","Lodgement Scheme","Check if the HDB lodgement scheme applies to your commercial unit. If so, you only need to file the resale details online when you want to sell your shop."],
  ["/shops-and-offices/selling-on-open-market/transfer-ownership-or-sell","Transfer Ownership or Sell an HDB Shop","Learn how to apply to sell or transfer ownership of a sold HDB shop."],
  ["/site-requirements","Site Requirements","See supported browsers and platforms for optimal viewing on desktop and mobile devices."],
  ["/sitemap","Sitemap","View the site map."],
  ["/submit-appeal-against-parking-offence/get-help","Get Help",""],
  ["/submit-appeal-against-parking-offence/terms-and-conditions","Terms and Conditions",""],
  ["/submit-payment-claims-for-hdb-projects/get-help","Get Help",""],
  ["/submit-payment-claims-for-hdb-projects/terms-and-conditions","Terms and Conditions",""],
  ["/submit-payment-claims-for-hdb-projects/user-guide-getting-started","User Guide - Getting Started",""],
  ["/temporarily-transfer-season-parking-to-another-car-park/get-help","Get Help",""],
  ["/temporarily-transfer-season-parking-to-another-car-park/terms-and-conditions","Terms and Conditions",""],
  ["/temporarily-transfer-season-parking-to-another-vehicle/get-help","Get Help",""],
  ["/temporarily-transfer-season-parking-to-another-vehicle/terms-and-conditions","Terms and Conditions",""],
  ["/terminate-rental-of-bedroom/get-help","Get Help",""],
  ["/terminate-rental-of-flat/get-help","Get Help",""],
  ["/terminate-season-parking/get-help","Get Help",""],
  ["/terminate-season-parking/terms-and-conditions","Terms and Conditions",""],
  ["/terms-of-use","Terms of Use","Read our terms of use before surfing our site."],
  ["/update-credit-card-information-for-auto-renewal-of-season-parking/get-help","Get Help",""],
  ["/update-credit-card-information-for-auto-renewal-of-season-parking/terms-and-conditions","Terms and Conditions",""],
  ["/update-drivers-particulars-for-parking-offence/Get%20Help","Get Help",""],
  ["/update-tenant-details-for-flat-rental/get-help","Get Help",""],
  ["/useful-links","Useful Links","Find links to related Government agencies and partner organisations."],
  ["/view-available-season-parking-lots/get-help","Get Help",""],
  ["/view-available-season-parking-lots/terms-and-conditions","Terms and Conditions",""],
  ["/view-directory-of-renovation-contractors-drc/get-help","Get Help",""],
  ["/view-season-parking-transaction-history/get-help","Get Help",""],
  ["/view-season-parking-transaction-history/terms-and-conditions","Terms and Conditions",""],
  ["/view-service--conservancy-charges-scc-rebate/get-help","Get Help",""],
  ["/view-statements-of-account-for-housing-loan/get-help","Get Help",""],
  ["/view-statements-of-account-for-upgrading-cost/get-help","Get Help",""],
  ["/view-status-of-hdbs-upgrading-and-redevelopment-programmes/get-help","Get Help",""],
  ["/view-status-of-hdbs-upgrading-and-redevelopment-programmes/terms-and-conditions","Terms and Conditions",""],
  ["/where2shop/terms-and-conditions","Terms and Conditions",""],
  ["/works-order-portal/get-help","Get Help",""],
  ["/works-order-portal/terms-and-conditions","Terms and Conditions",""],
  ["/write-to-us","HDB | Write to Us","Share your feedback with HDB to help us improve our services."]

];
var pageMetadataByPath = new Map(publicPageMetadata.map(function (item) {
  return [item[0], { title: item[1], description: item[2] }];
}));
var allPublicSitemapPaths = publicPageMetadata.map(function (item) { return item[0]; });
var baseRoutePairs = coreRoutePairs.concat(extraRoutePairs);
var baseRoutePathSet = new Set(baseRoutePairs.map(function (pair) { return pair[0]; }));
var sitemapRoutePairs = publicPageMetadata
  .filter(function (item) { return !baseRoutePathSet.has(item[0]); })
  .map(function (item) { return [item[0], item[1] || titleFromSlug(item[0].split("/").filter(Boolean).pop())]; });
var knownRoutePathSet = new Set(baseRoutePairs.concat(sitemapRoutePairs).map(function (pair) { return pair[0]; }));
var synthesizedRoutePairs = [];
publicPageMetadata.forEach(function (item) {
  var segments = item[0].split("/").filter(Boolean);
  for (var index = 1; index < segments.length; index += 1) {
    var ancestorPath = "/" + segments.slice(0, index).join("/");
    if (knownRoutePathSet.has(ancestorPath)) continue;
    knownRoutePathSet.add(ancestorPath);
    synthesizedRoutePairs.push([ancestorPath, titleFromSlug(segments[index - 1])]);
  }
});
var allRoutePairs = baseRoutePairs.concat(sitemapRoutePairs, synthesizedRoutePairs);
var routeLabels = new Map(allRoutePairs);

var topicMeta = {
  "/buying-a-flat": {
    icon: "⌂",
    summary: "Excited about getting your own home? We are here to help. Check your eligibility and learn about the process and options available to you."
  },
  "/managing-my-home": {
    icon: "⌁",
    summary: "Find essential information on flat ownership, renovation and maintenance, upgrading programmes, and community living to make the most of your HDB experience."
  },
  "/renting-a-flat": {
    icon: "⌑",
    summary: "Not ready to buy your own home? Find out your options for renting a flat from HDB or the open market, and how to apply."
  },
  "/shops-and-offices": {
    icon: "▦",
    summary: "The chatter. The vibrancy. The community. There is no better place than the HDB heartlands to set up a shop or an office."
  },
  "/business-partners": {
    icon: "◇",
    summary: "We value our business partners who help make our mission of building quality homes possible. Access the information and resources you need to work with us here."
  },
  "/parking": {
    icon: "P",
    summary: "Find information on parking at HDB car parks, including season parking, short-term parking and other car park matters."
  }
};

var hubPageProfiles = {
  "/about-us": {
    lead: "As Singapore’s public housing authority, we plan and develop towns and estates, providing homes for Singaporeans and creating a quality environment to live, work, play and learn.",
    cards: [
      ["/about-us/our-story", "Our Story", "Learn about our organisation, our purpose and the milestones of our public housing journey."],
      ["/about-us/our-role", "Our Role", "We take pride in creating homes and towns to form a quality living environment where communities thrive."],
      ["/about-us/our-towns-and-estates", "Our Towns and Estates", "We design each HDB town to celebrate its distinct character. Find out what makes yours unique."],
      ["/about-us/work-with-us", "Work With Us", "Explore exciting career, scholarship or internship opportunities at HDB."],
      ["/about-us/contact-us", "Contact Us", "Send your enquiry or feedback on HDB-related matters."]
    ]
  },
  "/hdb-pulse": {
    lead: "Keep up to date with everything HDB here. Read our latest media releases, and get useful tips on buying, renovating and living in your HDB home.",
    cards: [
      ["/hdb-pulse/news", "News", "Keep updated on HDB news through our media releases."],
      ["/hdb-pulse/mynicehome", "MyNiceHome", "Discover everything you need to know about HDB living."],
      ["/hdb-pulse/reports", "Reports", "Get our annual reports and financial statements here."],
      ["/hdb-pulse/publications", "Publications", "Learn more about Singapore’s public housing story through our publications."]
    ]
  },
  "/buying-a-flat/bto-sbf-and-open-booking-of-flats/process-for-buying-a-new-flat": {
    lead: "Find out about the process of buying a flat from HDB and get started on your home buying journey.",
    note: "Buyers must have a valid HDB Flat Eligibility (HFE) letter before they may apply for a flat in HDB sales launches.",
    cards: [
      ["/buying-a-flat/bto-sbf-and-open-booking-of-flats/process-for-buying-a-new-flat/overview", "Overview of New Flat Buying Process", "Get an overview of the flat buying process."],
      ["/buying-a-flat/bto-sbf-and-open-booking-of-flats/process-for-buying-a-new-flat/modes-of-sales", "Modes of Sale", "Read about Build-To-Order (BTO), Sale of Balance Flats (SBF) exercises, and open booking of flats."],
      ["/buying-a-flat/bto-sbf-and-open-booking-of-flats/process-for-buying-a-new-flat/application", "Application for a New Flat", "Learn about applying for a new flat, the priority schemes available and Fresh Start Housing Scheme."],
      ["/buying-a-flat/bto-sbf-and-open-booking-of-flats/process-for-buying-a-new-flat/booking-of-flat", "Booking of Flat", "Learn about the flat booking process, deferred income assessment, and Optional Component Scheme."],
      ["/buying-a-flat/bto-sbf-and-open-booking-of-flats/process-for-buying-a-new-flat/sign-agreement-for-lease", "Sign Agreement for Lease", "Prepare for your appointment to sign the Agreement for Lease for your new flat."],
      ["/buying-a-flat/bto-sbf-and-open-booking-of-flats/process-for-buying-a-new-flat/key-collection", "Key Collection", "Find out the required payments at your key collection appointment and available financing schemes."]
    ]
  },
  "/buying-a-flat/resale-flats/process-for-buying-a-resale-flat": {
    lead: "Get started with your flat purchase by finding out about the process to buy a resale HDB flat.",
    note: "Resale flat buyers and sellers transact via My Flat Dashboard and are guided step-by-step to complete the transaction.",
    cards: [
      ["/buying-a-flat/resale-flats/process-for-buying-a-resale-flat/overview", "Overview of Resale Flat Buying Process", "Get an overview of the resale flat buying process."],
      ["/buying-a-flat/resale-flats/process-for-buying-a-resale-flat/resale-flat-planning", "Resale Flat Planning for Buyers", "Prepare for your resale flat purchase by understanding the considerations and steps involved."],
      ["/buying-a-flat/resale-flats/process-for-buying-a-resale-flat/option-to-purchase", "Option to Purchase When Buying a Resale Flat", "Find out what you need to know about entering into an Option to Purchase with flat sellers."],
      ["/buying-a-flat/resale-flats/process-for-buying-a-resale-flat/resale-flat-application", "Resale Flat Application for Buyers", "Find out how to submit a resale application and what to expect after submission."],
      ["/buying-a-flat/resale-flats/process-for-buying-a-resale-flat/resale-flat-completion", "Resale Flat Completion for Buyers", "Learn about resale completion and what to do before and during the appointment."]
    ]
  },
  "/buying-a-flat/resale-flats/process-for-buying-a-resale-flat/resale-flat-planning": {
    lead: "Prepare for your buying journey by learning about the planning considerations and steps involved in buying a resale flat.",
    cards: [
      ["/buying-a-flat/resale-flats/process-for-buying-a-resale-flat/resale-flat-planning/overview", "Overview of Resale Flat Planning for Buyers", "Find out what you need to do when planning to buy a resale flat."],
      ["/buying-a-flat/resale-flats/process-for-buying-a-resale-flat/resale-flat-planning/managing-the-flat-purchase", "Managing the Resale Flat Purchase", "Find out how you can buy a resale flat on your own or with a salesperson."],
      ["/buying-a-flat/resale-flats/process-for-buying-a-resale-flat/resale-flat-planning/eip-and-spr-quota", "Ethnic Integration Policy and SPR Quota", "Learn about the Ethnic Integration Policy and Singapore Permanent Resident Quota."],
      ["/buying-a-flat/resale-flats/process-for-buying-a-resale-flat/resale-flat-planning/mode-of-financing", "Mode of Financing for a Resale Flat", "Learn the financial considerations for buying a resale flat, and use planning tools and resources."],
      ["/buying-a-flat/resale-flats/process-for-buying-a-resale-flat/resale-flat-planning/resale-seminars", "Resale Seminars", "See upcoming seminars on the process of buying and selling a resale flat."]
    ]
  },
  "/managing-my-home/home-ownership/renting-out-a-flat-or-bedrooms": {
    lead: "Flats sold under the Home Ownership Scheme are meant for you and your family to live in. You can rent out your flat or bedrooms if you meet the eligibility conditions.",
    cards: [
      ["/managing-my-home/home-ownership/renting-out-a-flat-or-bedrooms/renting-out-a-flat", "Renting Out a Flat", "Singapore Citizen flat owners who have met the minimum occupation period can rent out their entire flat."],
      ["/managing-my-home/home-ownership/renting-out-a-flat-or-bedrooms/renting-out-bedrooms", "Renting Out Bedrooms", "Rent out spare bedrooms as a Singapore Citizen or Singapore Permanent Resident flat owner."]
    ]
  },
  "/managing-my-home/renovation-and-maintenance/renovation": {
    lead: "If you are looking to renovate your flat, engage a contractor listed in the Directory of Renovation Contractors so that the building structure is protected during renovation.",
    cards: [
      ["/managing-my-home/renovation-and-maintenance/renovation/renovation-guidelines", "Renovation Guidelines", "Get familiar with flat renovation guidelines to ensure safety and compliance with regulations."],
      ["/managing-my-home/renovation-and-maintenance/renovation/important-information-on-renovations", "Important Information on Renovations", "Learn your responsibilities as a home owner and see examples of disallowed renovation works."],
      ["/managing-my-home/renovation-and-maintenance/renovation/looking-for-renovation-contractors", "Looking for Renovation Contractors", "Find contractors in the DRC and BCA Approved Window Contractors directories."],
      ["/managing-my-home/renovation-and-maintenance/renovation/application-for-a-renovation-permit", "Application for a Renovation Permit", "Find out if your renovation requires a permit and how to obtain one."]
    ]
  },
  "/managing-my-home/renovation-and-maintenance/renovation/renovation-guidelines": {
    lead: "Planning your renovations thoroughly will guard against oversight and unauthorised work. Read the guidelines to understand renovation requirements.",
    cards: [
      ["/managing-my-home/renovation-and-maintenance/renovation/renovation-guidelines/building-works", "Renovation Guidelines for Building Works", "Follow building-work guidelines so your flat’s structural integrity is not compromised."],
      ["/managing-my-home/renovation-and-maintenance/renovation/renovation-guidelines/window-works", "Renovation Guidelines for Window Works", "Window works must be done by BCA-approved window contractors."],
      ["/managing-my-home/renovation-and-maintenance/renovation/renovation-guidelines/electrical-works", "Renovation Guidelines for Electrical Works", "Know your flat’s electrical loading provision when installing appliances."],
      ["/managing-my-home/renovation-and-maintenance/renovation/renovation-guidelines/air-conditioner-installation-works", "Air Conditioner Installation Works", "Engage an appropriately trained professional for installation works."],
      ["/managing-my-home/renovation-and-maintenance/renovation/renovation-guidelines/water-and-sanitary-plumbing-works-and-gas-works", "Water, Sanitary Plumbing and Gas Works", "Read guidelines that help prevent leaks and identify permitted works."]
    ]
  },
  "/parking/applying-for-season-parking/apply-for-family-season-parking": {
    lead: "If you want to park near your family member’s block, you can purchase Family Season Parking (FSP).",
    cards: [
      ["/parking/applying-for-season-parking/apply-for-family-season-parking/eligibility", "Eligibility for Family Season Parking", "Check the conditions you have to meet to qualify for Family Season Parking."],
      ["/parking/applying-for-season-parking/apply-for-family-season-parking/application-process", "Application Process for Family Season Parking", "Find out how to apply and which documents you need."],
      ["/parking/applying-for-season-parking/apply-for-family-season-parking/family-season-parking-charges", "Family Season Parking Charges", "Charges vary according to vehicle type."]
    ]
  }
};

var articlePageProfiles = {
  "/parking/applying-for-season-parking/apply-for-family-season-parking/eligibility": {
    title: "Eligibility for Family Season Parking",
    lead: "To apply for Family Season Parking, you must meet the following conditions:",
    sections: [
      { title: "Eligibility conditions", bullets: [
        "You must be the owner, authorised occupier or approved subtenant of an HDB flat or room, or an owner or tenant of an HDB shop with living quarters.",
        "You must have valid HDB season parking for your HDB flat or shop with living quarters.",
        "You must be able to prove your relationship with your family member, such as parents, children, siblings, grandparents or in-laws.",
        "You must be able to prove that your family member lives in the HDB flat or shop."
      ]},
      { title: "Number of parking locations", paragraphs: ["There is no limit on the number of Family Season Parking locations you can purchase, subject to availability at the selected car parks."] }
    ],
    recommended: [
      ["/parking/applying-for-season-parking", "Applying for Season Parking"],
      ["/parking/renewing-season-parking", "Renewing Season Parking"],
      ["/parking/other-parking-matters/shortterm-parking/coupon-parking", "Coupon Parking"],
      ["/parking/transferring-season-parking/transfer-season-parking", "Transfer Season Parking"]
    ]
  },
  "/buying-a-flat/flat-grant-and-loan-eligibility/application-for-an-hdb-flat-eligibility-hfe-letter": {
    title: "Application for an HDB Flat Eligibility (HFE) Letter",
    lead: "The HDB Flat Eligibility (HFE) letter gives you a holistic understanding of your housing and financing options before you start your home buying journey.",
    note: "Log in to the HDB Flat Portal using Singpass to apply. The application is free of charge.",
    sections: [
      { title: "Make an informed decision", paragraphs: ["The letter states your eligibility to buy a new or resale flat, the CPF housing grants and HDB housing loan available, and any resale levy or premium payable by second-timers."] },
      { title: "When to apply", paragraphs: ["Apply early. You need a valid HFE letter when applying for a new flat, and before obtaining an Option to Purchase for a resale flat. Processing takes up to one month after all documents are received and may take longer around sales exercises."] },
      { title: "How to apply", bullets: ["Step 1: Check Preliminary HDB Flat Eligibility.", "Step 2: Apply for the HDB Flat Eligibility Letter.", "Complete both steps within 30 calendar days of each other.", "All applicants and required occupiers must have valid Singpass accounts."] },
      { title: "Validity and review", paragraphs: ["The applicants and occupiers in the flat application must remain the same as those in the HFE letter application. If key details change, cancel the application and submit a fresh one."] }
    ],
    authenticated: true,
    recommended: [
      ["/buying-a-flat/financial-planning-for-a-flat-purchase/budget-for-a-flat", "Budget for a Flat"],
      ["/buying-a-flat/flat-grant-and-loan-eligibility/housing-loan", "Housing Loan"],
      ["/buying-a-flat/bto-sbf-and-open-booking-of-flats/process-for-buying-a-new-flat", "Process for Buying a New Flat"]
    ]
  },
  "/buying-a-flat/bto-sbf-and-open-booking-of-flats/process-for-buying-a-new-flat/application/fresh-start-housing-scheme": {
    title: "Fresh Start Housing Scheme",
    lead: "Fresh Start helps ComLink+ families with young children living in public rental flats to own their next homes.",
    note: "Interested households need to apply for Fresh Start before they can apply for a flat.",
    sections: [
      { title: "Key features", bullets: ["Eligible families may buy a 2-room Flexi or 3-room Standard flat on a shorter lease.", "First-timers may receive the Enhanced CPF Housing Grant of up to $120,000.", "Second-timers may receive a Fresh Start Housing Grant with upfront and deferred components."] },
      { title: "Eligibility conditions", paragraphs: ["All listed applicants and occupiers must meet the scheme’s family, housing, employment and social-support conditions."] },
      { title: "How to apply", paragraphs: ["If your household meets the eligibility conditions, apply for the Fresh Start Housing Scheme online before applying for a flat."] }
    ],
    authenticated: true,
    recommended: [
      ["/buying-a-flat/bto-sbf-and-open-booking-of-flats/process-for-buying-a-new-flat/application/priority-schemes", "Priority Schemes"],
      ["/buying-a-flat/flat-grant-and-loan-eligibility/couples-and-families", "Couples and Families"],
      ["/renting-a-flat/public-rental-scheme", "Public Rental Scheme"]
    ]
  }
};

Object.keys(hubPageProfiles).forEach(function (path) {
  hubPageProfiles[path].cards.forEach(function (card) { routeLabels.set(card[0], card[1]); });
});
Object.keys(articlePageProfiles).forEach(function (path) {
  if (articlePageProfiles[path].title) routeLabels.set(path, articlePageProfiles[path].title);
});

var primaryPaths = [
  "/buying-a-flat","/managing-my-home","/renting-a-flat",
  "/shops-and-offices","/business-partners","/parking","/eservices"
];

var advisories = [
  {
    short: "HDB will never request money transfers or bank log-in details from you over the phone.",
    title: "Beware of impersonation scams",
    body: "If in doubt, call the ScamShield Helpline at 1799 or visit the official ScamShield website for help."
  },
  {
    short: "Only use official HDB and .gov.sg websites for housing transactions.",
    title: "Check the website address",
    body: "Look for the official domain and a secure connection before entering personal or transaction details."
  },
  {
    short: "Do not share your Singpass password, OTP, or banking credentials with anyone.",
    title: "Protect your credentials",
    body: "HDB officers will not ask you to disclose passwords or one-time codes over the phone."
  }
];

var homeSlides = [
  {
    title: "Affordable homes for everyone.",
    description: "Be it for one family or one person, we have a home for your needs.",
    cta: "Begin your HDB journey",
    path: "/buying-a-flat/flat-grant-and-loan-eligibility/application-for-an-hdb-flat-eligibility-hfe-letter",
    art: "⌂"
  },
  {
    title: "You need a home fast. We hear you.",
    description: "Find out how we prioritise HDB flats for those with more urgent housing needs.",
    cta: "See our priority schemes",
    path: "/buying-a-flat/bto-sbf-and-open-booking-of-flats/process-for-buying-a-new-flat/application/priority-schemes",
    art: "⌛"
  },
  {
    title: "Turning neighbours into friends.",
    description: "Socialise with your neighbours and be involved in programmes to enliven your community.",
    cta: "Get involved",
    path: "/managing-my-home/living-in-my-community/enlivening-my-neighbourhood",
    art: "◌"
  }
];

var newsItems = [
  {
    date: "1 July 2026",
    title: "Flash Estimate of 2nd Quarter 2026 Resale Price Index and Upcoming Flat Supply",
    path: "/hdb-pulse/news/2026/flash-estimate-of-2nd-quarter-2026-resale-price-index-and-upcoming-flat-supply"
  },
  {
    date: "30 June 2026",
    title: "Preparatory Works for ‘Long Island’ Project to Commence From End-2026; Measures to Mitigate Impact on the Environment and Community",
    path: "/hdb-pulse/news/2026/preparatory-works-for-long-island-project-to-commence-from-end-2026"
  },
  {
    date: "30 June 2026",
    title: "HDB Launches Tender for Sale Site at Admiralty Walk",
    path: "/hdb-pulse/news/2026/hdb-launches-tender-for-sale-site-at-admiralty-walk"
  },
  {
    date: "17 June 2026",
    title: "HDB Launches 6,952 Flats Across 7 Projects in June 2026 BTO Sales Exercise",
    path: "/hdb-pulse/news/2026/hdb-launches-6952-flats-across-7-projects-in-june-2026-bto-sales-exercise"
  }
];

var app = document.getElementById("app");
var primaryLinksEl = document.getElementById("primary-links");
var megaMenu = document.getElementById("mega-menu");
var mobileNav = document.getElementById("mobile-nav");
var mobileMenu = document.getElementById("mobile-menu");
var scrim = document.getElementById("page-scrim");
var searchPanel = document.getElementById("search-panel");
var searchInput = document.getElementById("search-input");
var searchResults = document.getElementById("search-results");
var routeStatus = document.getElementById("route-status");
var loginDialog = document.getElementById("login-dialog");
var advisoryDialog = document.getElementById("advisory-dialog");
var carouselTimer = null;
var carouselIndex = 0;
var advisoryIndex = 0;
var megaCloseTimer = null;

function escapeHTML(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function titleFromSlug(value) {
  return String(value)
    .replace(/-/g, " ")
    .replace(/\b\w/g, function (character) { return character.toUpperCase(); })
    .replace(/\bHdb\b/g, "HDB")
    .replace(/\bCpf\b/g, "CPF")
    .replace(/\bBto\b/g, "BTO")
    .replace(/\bSbf\b/g, "SBF")
    .replace(/\bHfe\b/g, "HFE")
    .replace(/\bFsp\b/g, "FSP")
    .replace(/\bDrc\b/g, "DRC")
    .replace(/\bBca\b/g, "BCA")
    .replace(/\bEip\b/g, "EIP")
    .replace(/\bSpr\b/g, "SPR")
    .replace(/\bOtp\b/g, "OTP")
    .replace(/\bPphs\b/g, "PPHS")
    .replace(/\bHip\b/g, "HIP")
    .replace(/\bEase\b/g, "EASE")
    .replace(/\bSers\b/g, "SERS")
    .replace(/\bLup\b/g, "LUP")
    .replace(/\bNrp\b/g, "NRP")
    .replace(/\bTol\b/g, "TOL")
    .replace(/\bEc\b/g, "EC")
    .replace(/Shortterm/g, "Short-Term")
    .replace(/2room/g, "2-Room")
    .replace(/30year/g, "30-Year");
}

function normalizePath(value) {
  var raw = String(value || "/homepage").replace(/^#/, "");
  raw = raw.split("?")[0].split("&")[0];
  if (!raw || raw === "/") return "/homepage";
  if (raw.charAt(0) !== "/") raw = "/" + raw;
  return raw.replace(/\/+$/, "") || "/homepage";
}

function currentPath() {
  return normalizePath(window.location.hash);
}

function routeHref(path) {
  return "#" + normalizePath(path);
}

function routeLink(path, label, className) {
  return '<a class="route-link ' + (className || "") + '" href="' + routeHref(path) + '">' + escapeHTML(label) + "</a>";
}

function pathDepth(path) {
  return normalizePath(path).split("/").filter(Boolean).length;
}

function parentPath(path) {
  var parts = normalizePath(path).split("/").filter(Boolean);
  if (parts.length <= 1) return "/homepage";
  parts.pop();
  return "/" + parts.join("/");
}

function labelFor(path) {
  var clean = normalizePath(path);
  if (clean === "/homepage") return "Home";
  return routeLabels.get(clean) || titleFromSlug(clean.split("/").filter(Boolean).pop());
}

function directChildren(path) {
  var clean = normalizePath(path);
  var depth = clean === "/homepage" ? 0 : pathDepth(clean);
  var prefix = clean === "/homepage" ? "/" : clean + "/";
  var seen = new Set();
  return allRoutePairs.filter(function (pair) {
    if (seen.has(pair[0])) return false;
    if (pair[0].indexOf(prefix) !== 0) return false;
    if (pathDepth(pair[0]) !== depth + 1) return false;
    seen.add(pair[0]);
    return true;
  });
}

function siblings(path) {
  return directChildren(parentPath(path));
}

function rootPath(path) {
  var first = normalizePath(path).split("/").filter(Boolean)[0];
  return first ? "/" + first : "/homepage";
}

function breadcrumbs(path) {
  var clean = normalizePath(path);
  var segments = clean.split("/").filter(Boolean);
  var pieces = ['<nav class="breadcrumbs" aria-label="Breadcrumbs">'];
  pieces.push(routeLink("/homepage", "Home"));
  var running = "";
  segments.forEach(function (segment, index) {
    running += "/" + segment;
    if (running === "/homepage") return;
    pieces.push('<span aria-hidden="true">›</span>');
    if (index === segments.length - 1) {
      pieces.push("<span>" + escapeHTML(labelFor(running)) + "</span>");
    } else {
      pieces.push(routeLink(running, labelFor(running)));
    }
  });
  pieces.push("</nav>");
  return pieces.join("");
}

function pageHero(path, title) {
  return [
    '<section class="page-hero">',
    '<div class="shell">',
    breadcrumbs(path),
    "<h1>" + escapeHTML(title) + "</h1>",
    "</div>",
    "</section>"
  ].join("");
}

function renderPrimaryNavigation() {
  primaryLinksEl.innerHTML = primaryPaths.map(function (path) {
    var hasChildren = directChildren(path).length > 0;
    var content = hasChildren
      ? '<button class="primary-link" type="button" data-mega="' + path + '" aria-expanded="false">' + escapeHTML(labelFor(path)) + "</button>"
      : '<a class="primary-link route-link" href="' + routeHref(path) + '">' + escapeHTML(labelFor(path)) + "</a>";
    return "<li>" + content + "</li>";
  }).join("");

  primaryLinksEl.querySelectorAll("[data-mega]").forEach(function (button) {
    button.addEventListener("mouseenter", function () { openMegaMenu(button.dataset.mega, button); });
    button.addEventListener("focus", function () { openMegaMenu(button.dataset.mega, button); });
    button.addEventListener("click", function () {
      if (button.getAttribute("aria-expanded") === "true") {
        window.location.hash = button.dataset.mega;
      } else {
        openMegaMenu(button.dataset.mega, button);
      }
    });
  });

  document.querySelector(".primary-nav").addEventListener("mouseleave", scheduleMegaClose);
  megaMenu.addEventListener("mouseenter", cancelMegaClose);
  megaMenu.addEventListener("mouseleave", scheduleMegaClose);
}

function openMegaMenu(path, trigger) {
  cancelMegaClose();
  var groups = directChildren(path);
  if (!groups.length) {
    closeMegaMenu();
    return;
  }
  document.querySelectorAll("[data-mega]").forEach(function (item) {
    item.setAttribute("aria-expanded", item === trigger ? "true" : "false");
  });
  var columns = groups.map(function (group) {
    var leaves = directChildren(group[0]);
    return [
      '<section class="mega-group">',
      "<h3>" + routeLink(group[0], group[1]) + "</h3>",
      leaves.length ? "<ul>" + leaves.map(function (leaf) {
        return "<li>" + routeLink(leaf[0], leaf[1]) + "</li>";
      }).join("") + "</ul>" : "",
      "</section>"
    ].join("");
  }).join("");

  megaMenu.innerHTML = [
    '<div class="shell mega-menu-inner">',
    '<div class="mega-menu-head">',
    '<h2 class="mega-menu-title">' + escapeHTML(labelFor(path)) + "</h2>",
    routeLink(path, "View all " + labelFor(path), "mega-menu-all"),
    "</div>",
    '<div class="mega-columns">' + columns + "</div>",
    "</div>"
  ].join("");
  megaMenu.hidden = false;
}

function scheduleMegaClose() {
  cancelMegaClose();
  megaCloseTimer = window.setTimeout(closeMegaMenu, 150);
}

function cancelMegaClose() {
  if (megaCloseTimer) window.clearTimeout(megaCloseTimer);
}

function closeMegaMenu() {
  megaMenu.hidden = true;
  document.querySelectorAll("[data-mega]").forEach(function (item) {
    item.setAttribute("aria-expanded", "false");
  });
}

function renderMobileNavigation() {
  var utility = [
    ["/about-us", "About Us"], ["/hdb-pulse", "HDB Pulse"]
  ];
  var items = utility.concat(primaryPaths.map(function (path) { return [path, labelFor(path)]; }));
  mobileNav.innerHTML = '<ul class="mobile-nav-list">' + items.map(function (pair) {
    var groups = directChildren(pair[0]);
    var id = "mobile-" + pair[0].replace(/\W+/g, "-");
    var sublist = "";
    if (groups.length) {
      sublist = '<ul class="mobile-sublist" id="' + id + '" hidden>' + groups.map(function (group) {
        var children = directChildren(group[0]);
        return [
          "<li>",
          routeLink(group[0], group[1]),
          children.length ? '<ul class="mobile-sublist">' + children.map(function (child) {
            return "<li>" + routeLink(child[0], child[1]) + "</li>";
          }).join("") + "</ul>" : "",
          "</li>"
        ].join("");
      }).join("") + "</ul>";
    }
    return [
      "<li>",
      '<div class="mobile-nav-row">',
      routeLink(pair[0], pair[1]),
      groups.length ? '<button type="button" data-mobile-submenu="' + id + '" aria-expanded="false" aria-label="Open ' + escapeHTML(pair[1]) + ' submenu">›</button>' : "",
      "</div>",
      sublist,
      "</li>"
    ].join("");
  }).join("") + "</ul>";

  mobileNav.querySelectorAll("[data-mobile-submenu]").forEach(function (button) {
    button.addEventListener("click", function () {
      var target = document.getElementById(button.dataset.mobileSubmenu);
      var open = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!open));
      button.textContent = open ? "›" : "⌄";
      target.hidden = open;
    });
  });
}

function setActiveNavigation(path) {
  var root = rootPath(path);
  document.querySelectorAll(".primary-link").forEach(function (item) {
    var itemPath = item.dataset.mega || normalizePath(item.getAttribute("href") || "");
    item.classList.toggle("active", itemPath === root);
  });
}

function openMobileMenu() {
  mobileMenu.classList.add("open");
  mobileMenu.setAttribute("aria-hidden", "false");
  scrim.hidden = false;
  document.body.classList.add("menu-open");
  document.getElementById("menu-button").setAttribute("aria-expanded", "true");
}

function closeMobileMenu() {
  mobileMenu.classList.remove("open");
  mobileMenu.setAttribute("aria-hidden", "true");
  scrim.hidden = true;
  document.body.classList.remove("menu-open");
  document.getElementById("menu-button").setAttribute("aria-expanded", "false");
}

function toggleSearch(forceOpen) {
  var shouldOpen = typeof forceOpen === "boolean" ? forceOpen : searchPanel.hidden;
  searchPanel.hidden = !shouldOpen;
  document.getElementById("search-toggle").setAttribute("aria-expanded", String(shouldOpen));
  if (shouldOpen) {
    closeMegaMenu();
    window.setTimeout(function () { searchInput.focus(); }, 20);
  }
}

function renderSearchResults(query) {
  var term = String(query || "").trim().toLowerCase();
  if (!term) {
    searchResults.innerHTML = "";
    return;
  }
  var matches = allRoutePairs.filter(function (pair, index, array) {
    return pair[1].toLowerCase().indexOf(term) >= 0 &&
      array.findIndex(function (candidate) { return candidate[0] === pair[0]; }) === index;
  }).slice(0, 12);
  searchResults.innerHTML = matches.length ? matches.map(function (pair) {
    return '<a class="search-result route-link" href="' + routeHref(pair[0]) + '">' +
      escapeHTML(pair[1]) + "<span>" + escapeHTML(pair[0]) + "</span></a>";
  }).join("") : '<p class="search-empty">No pages match “' + escapeHTML(query) + '”.</p>';
}

function updateAdvisory() {
  var advisory = advisories[advisoryIndex];
  document.getElementById("advisory-text").textContent = advisory.short;
  document.getElementById("advisory-count").textContent = (advisoryIndex + 1) + " of " + advisories.length;
  document.getElementById("advisory-prev").disabled = advisoryIndex === 0;
  document.getElementById("advisory-next").disabled = advisoryIndex === advisories.length - 1;
}

function openDialog(dialog) {
  if (typeof dialog.showModal === "function") dialog.showModal();
  else dialog.setAttribute("open", "");
}

function closeDialog(dialog) {
  if (typeof dialog.close === "function") dialog.close();
  else dialog.removeAttribute("open");
}

function homePage() {
  var intentCards = primaryPaths.slice(0, 6).map(function (path) {
    var meta = topicMeta[path];
    return '<a class="intent-card route-link" href="' + routeHref(path) + '">' +
      '<span class="intent-icon" aria-hidden="true">' + escapeHTML(meta.icon) + "</span>" +
      "<span>" + escapeHTML(labelFor(path)) + "</span></a>";
  }).join("");

  var slides = homeSlides.map(function (slide) {
    return [
      '<article class="carousel-slide">',
      '<div class="carousel-copy">',
      "<h2>" + escapeHTML(slide.title) + "</h2>",
      "<p>" + escapeHTML(slide.description) + "</p>",
      '<a class="secondary-button route-link" href="' + routeHref(slide.path) + '">' + escapeHTML(slide.cta) + " →</a>",
      "</div>",
      '<div class="carousel-art" role="img" aria-label="HDB community illustration">',
      '<span class="scene-card" aria-hidden="true">' + escapeHTML(slide.art) + "</span>",
      "</div>",
      "</article>"
    ].join("");
  }).join("");

  var dots = homeSlides.map(function (slide, index) {
    return '<button class="carousel-dot' + (index === 0 ? " active" : "") + '" type="button" data-slide="' + index + '" aria-label="Go to slide ' + (index + 1) + '"></button>';
  }).join("");

  var topicCards = [
    ["/buying-a-flat/flat-grant-and-loan-eligibility/application-for-an-hdb-flat-eligibility-hfe-letter", "Buying a Flat", "Application for an HDB Flat Eligibility (HFE) Letter", "Learn about the HDB Flat Eligibility letter and loan applications from financial institutions."],
    ["/parking/renewing-season-parking/renew-season-parking", "Parking", "Renew Season Parking", "Renew your season parking and check for availability of lots at your preferred HDB car park."],
    ["/parking/transferring-season-parking/transfer-season-parking", "Parking", "Transfer Season Parking", "Transfer season parking after changing your vehicle or car park."]
  ].map(function (item) {
    return '<a class="info-card route-link" href="' + routeHref(item[0]) + '"><span class="card-kicker">' +
      escapeHTML(item[1]) + "</span><h3>" + escapeHTML(item[2]) + "</h3><p>" +
      escapeHTML(item[3]) + '</p><span class="card-arrow">→</span></a>';
  }).join("");

  var news = newsItems.map(function (item) {
    return '<a class="news-card route-link" href="' + routeHref(item.path) + '"><time>' +
      escapeHTML(item.date) + "</time><strong>" + escapeHTML(item.title) + "</strong></a>";
  }).join("");

  return [
    '<section class="home-hero">',
    '<div class="hero-art" aria-hidden="true"><span class="sun-disc"></span><span class="building one"></span><span class="building two"></span><span class="building three"></span><span class="ground-line"></span></div>',
    '<div class="shell"><h1>Welcome. How can we help you today?</h1><div class="intent-grid">' + intentCards + "</div></div>",
    "</section>",

    '<section class="feature-carousel" aria-label="Featured HDB information">',
    '<div class="shell carousel-shell"><div class="carousel-track"><div class="carousel-slides" id="carousel-slides">' + slides + "</div></div>",
    '<div class="carousel-controls"><button class="icon-button" id="carousel-prev" type="button" aria-label="Previous slide">‹</button><div class="carousel-dots">' +
      dots + '</div><button class="icon-button" id="carousel-next" type="button" aria-label="Next slide">›</button></div></div></section>',

    '<section class="services-section section-pad"><div class="shell">',
    '<div class="section-head"><h2>Recommended e-Services</h2>' + routeLink("/eservices", "Go to all e-Services") + "</div>",
    '<div class="service-row">',
    '<button class="service-card" type="button" data-auth><span class="service-icon">⌂</span>My Flat Dashboard</button>',
    '<button class="service-card" type="button" data-auth><span class="service-icon">✓</span>Apply for HDB Flat Eligibility (HFE) Letter</button>',
    '<button class="service-card" type="button" data-auth><span class="service-icon">$</span>Make Partial Repayment of Housing Loan</button>',
    '<button class="service-card" type="button" data-auth><span class="service-icon">i</span>View Housing Loan and Financial Information</button>',
    "</div></div></section>",

    '<section class="topics-section section-pad"><div class="shell"><div class="section-head"><h2>Recommended topics</h2></div><div class="card-grid">' +
      topicCards + "</div></div></section>",

    '<section class="useful-section section-pad"><div class="shell"><div class="section-head"><h2>Useful links</h2></div><div class="useful-grid">',
    '<button class="useful-card" type="button" data-auth><h3>MyHDB Page</h3><p>Access information on your flat, vehicle, and HDB transactions.</p></button>',
    '<a class="useful-card" href="https://homes.hdb.gov.sg/home/landing" target="_blank" rel="noreferrer"><h3>HDB Flat Portal ↗</h3><p>Transact with HDB as an HDB flat buyer or seller.</p></a>',
    '<a class="useful-card" href="https://www.mynicehome.gov.sg/" target="_blank" rel="noreferrer"><h3>MyNiceHome ↗</h3><p>Read articles on sales launches, HDB living, and how-to guides on buying a flat.</p></a>',
    '<a class="useful-card" href="https://place2lease.hdb.gov.sg/public/" target="_blank" rel="noreferrer"><h3>Place2Lease ↗</h3><p>View, manage and submit tenders to rent HDB commercial properties.</p></a>',
    "</div></div></section>",

    '<section class="tools-section section-pad compact"><div class="shell"><div class="section-head"><h2>Tools and resources</h2></div><div class="tools-row">',
    '<button class="tool-button" type="button" data-auth><span class="tool-icon">◷</span><span>Book Appointment at HDB Branch</span></button>',
    '<a class="tool-button route-link" href="' + routeHref("/hdb-ealerts") + '"><span class="tool-icon">♢</span><span>HDB e-Alerts</span></a>',
    '<a class="tool-button route-link" href="' + routeHref("/hdb-map") + '"><span class="tool-icon">⌖</span><span>HDB Map</span></a>',
    '<button class="tool-button" type="button" data-auth><span class="tool-icon">✉</span><span>My Correspondence</span></button>',
    "</div></div></section>",

    '<section class="news-section section-pad"><div class="shell"><div class="section-head"><h2>News</h2>' +
      routeLink("/hdb-pulse/news", "View all media releases") + '</div><div class="news-list">' + news + "</div></div></section>"
  ].join("");
}

function topicLandingPage(path) {
  var title = labelFor(path);
  var meta = topicMeta[path] || { icon: "i", summary: "Explore public HDB information, services, resources, and related topics." };
  var groups = directChildren(path);
  var groupCards = groups.map(function (group) {
    var leaves = directChildren(group[0]);
    var groupMetadata = pageMetadataByPath.get(group[0]) || {};
    var description = groupMetadata.description || (leaves.length
      ? "Explore " + leaves.slice(0, 3).map(function (leaf) { return leaf[1]; }).join(", ") + (leaves.length > 3 ? ", and more." : ".")
      : "Find public information and guidance for this topic.");
    return '<a class="topic-group-card route-link" href="' + routeHref(group[0]) + '"><h3>' +
      escapeHTML(group[1]) + "</h3><p>" + escapeHTML(description) + "</p><strong>View topic →</strong></a>";
  }).join("");

  var featured = [];
  groups.forEach(function (group) {
    directChildren(group[0]).slice(0, 2).forEach(function (leaf) {
      if (featured.length < 6) featured.push(leaf);
    });
  });
  var featuredCards = featured.map(function (leaf) {
    var leafMetadata = pageMetadataByPath.get(leaf[0]) || {};
    return '<a class="info-card route-link" href="' + routeHref(leaf[0]) + '"><span class="card-kicker">' +
      escapeHTML(title) + "</span><h3>" + escapeHTML(leaf[1]) + "</h3><p>" +
      escapeHTML(leafMetadata.description || "Read key information, requirements, and next steps.") + "</p><span class=\"card-arrow\">→</span></a>";
  }).join("");

  var portalCallout = path === "/buying-a-flat" ? [
    '<section class="callout-band"><div class="shell callout-inner"><div><h2>Looking to buy or sell a flat?</h2>',
    "<p>Plan your finances, view flats, and access buying or selling services.</p></div>",
    '<a class="primary-button" href="https://homes.hdb.gov.sg/home/landing" target="_blank" rel="noreferrer">Visit HDB Flat Portal ↗</a></div></section>'
  ].join("") : "";

  return [
    pageHero(path, title),
    '<section class="section-pad"><div class="shell">',
    '<div class="landing-intro"><span class="landing-icon" aria-hidden="true">' + escapeHTML(meta.icon) + "</span><p>" + escapeHTML(meta.summary) + "</p></div>",
    '<div class="section-head"><h2>Related topics</h2>' + routeLink("/eservices", "Go to e-Services") + "</div>",
    '<div class="topic-groups">' + groupCards + "</div></div></section>",
    portalCallout,
    featuredCards ? '<section class="section-pad"><div class="shell"><div class="section-head"><h2>Featured information</h2></div><div class="card-grid">' + featuredCards + "</div></div></section>" : "",
    toolsResourcesBlock()
  ].join("");
}

function toolsResourcesBlock() {
  return [
    '<section class="tools-section section-pad compact"><div class="shell"><div class="section-head"><h2>Tools and resources</h2></div><div class="tools-row">',
    '<button class="tool-button" type="button" data-auth><span class="tool-icon">◷</span><span>Book Appointment at HDB Branch</span></button>',
    '<a class="tool-button route-link" href="' + routeHref("/hdb-ealerts") + '"><span class="tool-icon">♢</span><span>HDB e-Alerts</span></a>',
    '<a class="tool-button route-link" href="' + routeHref("/hdb-map") + '"><span class="tool-icon">⌖</span><span>HDB Map</span></a>',
    '<button class="tool-button" type="button" data-auth><span class="tool-icon">✉</span><span>My Correspondence</span></button>',
    "</div></div></section>"
  ].join("");
}

function profiledHubPage(path) {
  var profile = hubPageProfiles[path];
  var cards = profile.cards.map(function (card) {
    return '<a class="info-card route-link" href="' + routeHref(card[0]) + '"><span class="card-kicker">' +
      escapeHTML(labelFor(rootPath(path))) + '</span><h3>' + escapeHTML(card[1]) + '</h3><p>' +
      escapeHTML(card[2]) + '</p><span class="card-arrow">→</span></a>';
  }).join("");
  var content = [
    '<article class="article-body profile-hub">',
    '<p class="lead">' + escapeHTML(profile.lead) + '</p>',
    profile.note ? '<div class="notice-box"><strong>Important</strong>' + escapeHTML(profile.note) + '</div>' : '',
    '<div class="section-head profile-section-head"><h2>Explore this topic</h2></div>',
    '<div class="card-grid">' + cards + '</div>',
    '</article>'
  ].join("");

  if (pathDepth(path) === 1) {
    return pageHero(path, labelFor(path)) + '<section class="section-pad"><div class="shell">' + content + '</div></section>';
  }
  return pageHero(path, labelFor(path)) + '<div class="shell content-layout">' + sectionNavigation(path) + content + '</div>';
}

function profiledArticlePage(path) {
  var profile = articlePageProfiles[path];
  var useAccordion = path.indexOf('hfe-letter') >= 0 || path.indexOf('fresh-start-housing-scheme') >= 0;
  var sections;

  if (useAccordion) {
    sections = '<div class="accordion" data-accordion>' + profile.sections.map(function (section, index) {
      var body = (section.paragraphs || []).map(function (paragraph) { return '<p>' + escapeHTML(paragraph) + '</p>'; }).join('') +
        (section.bullets ? '<ul>' + section.bullets.map(function (bullet) { return '<li>' + escapeHTML(bullet) + '</li>'; }).join('') + '</ul>' : '');
      return accordionItem('profile-' + index, section.title, 'Read the key information for this section.', body, index === 0);
    }).join('') + '</div>';
  } else {
    sections = profile.sections.map(function (section) {
      return '<section class="profile-section"><h2>' + escapeHTML(section.title) + '</h2>' +
        (section.paragraphs || []).map(function (paragraph) { return '<p>' + escapeHTML(paragraph) + '</p>'; }).join('') +
        (section.bullets ? '<ul class="check-list">' + section.bullets.map(function (bullet) { return '<li>' + escapeHTML(bullet) + '</li>'; }).join('') + '</ul>' : '') +
        '</section>';
    }).join('');
  }

  var authAction = profile.authenticated ? '<button class="primary-button article-auth-action" type="button" data-auth>Continue to official e-Service</button>' : '';
  var recommended = (profile.recommended || []).map(function (item) {
    return [item[0], item[1], 'Continue to related HDB information.'];
  });

  return [
    pageHero(path, labelFor(path)),
    '<div class="shell content-layout">',
    sectionNavigation(path),
    '<article class="article-body">',
    '<p class="lead">' + escapeHTML(profile.lead) + '</p>',
    profile.note ? '<div class="notice-box"><strong>Before you proceed</strong>' + escapeHTML(profile.note) + '</div>' : '',
    authAction,
    sections,
    deeperLinksBlock(path),
    recommended.length ? nextStepsBlock(recommended) : '',
    '</article></div>'
  ].join('');
}

function deeperLinksBlock(path) {
  var children = directChildren(path);
  if (!children.length) return '';
  return [
    '<section class="guide-links">',
    '<div class="section-head profile-section-head"><h2>In this guide</h2><span>' + children.length + ' pages</span></div>',
    '<div class="card-grid">',
    children.map(function (child) {
      var childMetadata = pageMetadataByPath.get(child[0]) || {};
      return '<a class="info-card route-link" href="' + routeHref(child[0]) + '"><span class="card-kicker">' +
        escapeHTML(labelFor(path)) + '</span><h3>' + escapeHTML(child[1]) +
        '</h3><p>' + escapeHTML(childMetadata.description || 'Open this detailed information page.') +
        '</p><span class="card-arrow">→</span></a>';
    }).join(''),
    '</div></section>'
  ].join('');
}

function guidanceCopyFor(path, title) {
  var root = rootPath(path);
  var metadata = pageMetadataByPath.get(path);
  var copy = {
    intro: 'Find essential information about ' + title.toLowerCase() + ' and the options available to you.',
    bullets: ['Review the conditions that apply to your situation.', 'Prepare the relevant information and supporting documents.', 'Use the official HDB service for personalised transactions.'],
    steps: ['Read the public guidance', 'Prepare the required details', 'Continue to the relevant page or service']
  };
  if (root === '/buying-a-flat') {
    copy.intro = 'Plan your flat purchase by understanding ' + title.toLowerCase() + ', financing considerations, eligibility and the buying journey.';
    copy.bullets = ['Check your HFE letter and eligibility where applicable.', 'Plan for CPF, cash, grants, loans and milestone payments.', 'Prepare the documents required for your chosen flat type.'];
    copy.steps = ['Check eligibility and finances', 'Review the buying stage', 'Complete the next step on the HDB Flat Portal'];
  } else if (root === '/managing-my-home') {
    copy.intro = 'Understand the responsibilities, approvals and practical guidance for ' + title.toLowerCase() + ' in an HDB flat.';
    copy.bullets = ['Check ownership, occupancy or minimum occupation conditions.', 'Use approved contractors or obtain permission where required.', 'Keep supporting records and follow town council or HDB guidance.'];
    copy.steps = ['Check the applicable rules', 'Prepare your flat details', 'Apply or make arrangements where needed'];
  } else if (root === '/renting-a-flat') {
    copy.intro = 'Review the eligibility, application, rent and tenancy information for ' + title.toLowerCase() + '.';
    copy.bullets = ['Check household and citizenship eligibility.', 'Review rent, deposit, occupier and tenancy conditions.', 'Prepare identity, income and household documents.'];
    copy.steps = ['Check eligibility', 'Prepare the application', 'Manage the tenancy responsibly'];
  } else if (root === '/parking') {
    copy.intro = 'Find parking rules, charges and application guidance for ' + title.toLowerCase() + ' at HDB car parks.';
    copy.bullets = ['Have your vehicle and car park details ready.', 'Check lot availability, charges and vehicle restrictions.', 'Use the official parking service for applications or payments.'];
    copy.steps = ['Choose the parking option', 'Check availability and charges', 'Complete the parking transaction'];
  } else if (root === '/shops-and-offices') {
    copy.intro = 'Review commercial tenancy, trade, renovation and approval information for ' + title.toLowerCase() + '.';
    copy.bullets = ['Check the approved trade and use of the premises.', 'Review tenancy, rent and renovation conditions.', 'Prepare company and authorised-person documents.'];
    copy.steps = ['Check commercial conditions', 'Prepare business documents', 'Submit the relevant request'];
  } else if (root === '/business-partners') {
    copy.intro = 'Access professional requirements, submissions and resources for ' + title.toLowerCase() + '.';
    copy.bullets = ['Review the technical or procurement requirements.', 'Use the latest forms, checklists and submission standards.', 'Keep project and company information ready.'];
    copy.steps = ['Review requirements', 'Prepare the submission', 'Track the official process'];
  }
  if (metadata && metadata.description) copy.intro = metadata.description;
  return copy;
}

function sectionNavigation(path) {
  var parent = parentPath(path);
  var items = siblings(path);
  if (!items.length) items = directChildren(path);
  return [
    '<nav class="section-nav" aria-label="In this section">',
    "<h2>" + escapeHTML(labelFor(parent)) + "</h2>",
    '<button class="section-nav-toggle" type="button" aria-expanded="false">' + escapeHTML(labelFor(parent)) + '<span aria-hidden="true">⌄</span></button>',
    "<ul>" + items.map(function (pair) {
      return '<li><a class="route-link' + (pair[0] === path ? " active" : "") + '" href="' +
        routeHref(pair[0]) + '">' + escapeHTML(pair[1]) + "</a></li>";
    }).join("") + "</ul>",
    "</nav>"
  ].join("");
}

function subsectionPage(path) {
  var title = labelFor(path);
  var children = directChildren(path);
  var cards = children.map(function (child) {
    var childMetadata = pageMetadataByPath.get(child[0]) || {};
    return '<a class="info-card route-link" href="' + routeHref(child[0]) + '"><span class="card-kicker">' +
      escapeHTML(labelFor(rootPath(path))) + "</span><h3>" + escapeHTML(child[1]) +
      "</h3><p>" + escapeHTML(childMetadata.description || "Find guidance, requirements, and the steps involved.") +
      "</p><span class=\"card-arrow\">→</span></a>";
  }).join("");
  var sectionMetadata = pageMetadataByPath.get(path) || {};
  return [
    pageHero(path, title),
    '<div class="shell content-layout">',
    sectionNavigation(path),
    '<article class="article-body">',
    '<p class="lead">' + escapeHTML(sectionMetadata.description || ("Find key information about " + title.toLowerCase() + ", including the available options, requirements, and steps to take.")) + "</p>",
    '<div class="article-illustration" role="img" aria-label="Topic illustration">' + escapeHTML(title) + "</div>",
    "<h2>What you need to know</h2>",
    "<p>Select a topic below for detailed guidance. Log in with Singpass where required to access personalised services.</p>",
    '<div class="card-grid">' + cards + "</div>",
    genericTabs(title),
    "</article></div>"
  ].join("");
}

function genericTabs(title) {
  return [
    '<div class="tab-list" role="tablist" aria-label="' + escapeHTML(title) + ' information">',
    '<button class="tab-button" type="button" role="tab" id="overview-tab" aria-controls="overview-panel" aria-selected="true">Overview</button>',
    '<button class="tab-button" type="button" role="tab" id="prepare-tab" aria-controls="prepare-panel" aria-selected="false">Before you start</button>',
    '<button class="tab-button" type="button" role="tab" id="help-tab" aria-controls="help-panel" aria-selected="false">Get help</button>',
    "</div>",
    '<section class="tab-panel" id="overview-panel" role="tabpanel" aria-labelledby="overview-tab"><p>Review the guidance for your situation, then choose the relevant page or service.</p></section>',
    '<section class="tab-panel" id="prepare-panel" role="tabpanel" aria-labelledby="prepare-tab" hidden><p>Have your identification, flat or vehicle details, and supporting documents ready where applicable.</p></section>',
    '<section class="tab-panel" id="help-panel" role="tabpanel" aria-labelledby="help-tab" hidden><p>For case-specific help, use Contact Us or continue to the official HDB service.</p></section>'
  ].join("");
}

function budgetArticle(path) {
  var next = [
    ["/buying-a-flat/flat-grant-and-loan-eligibility/housing-loan","Housing Loan","Understand the differences between taking a housing loan from HDB and financial institutions."],
    ["/buying-a-flat/flat-grant-and-loan-eligibility/application-for-an-hdb-flat-eligibility-hfe-letter","Application for an HDB Flat Eligibility (HFE) Letter","Learn about the HFE letter and loan applications from financial institutions."],
    ["/buying-a-flat/bto-sbf-and-open-booking-of-flats/finding-a-new-flat","Finding a New Flat","Find out about flat types and design features of new flats."]
  ];
  return [
    pageHero(path, "Budget for a Flat"),
    '<div class="shell content-layout">',
    sectionNavigation(path),
    '<article class="article-body">',
    '<p class="lead">The second step to our ABCs of financial planning is to work out your ‘<strong>B</strong>udget’ based on available funds.</p>',
    '<div class="article-illustration" role="img" aria-label="Working out the housing budget infographic">A · B · C<br><small>Working out your housing budget</small></div>',
    "<p>Before you embark on your home buying journey, apply for an " +
      routeLink("/buying-a-flat/flat-grant-and-loan-eligibility/application-for-an-hdb-flat-eligibility-hfe-letter", "HDB Flat Eligibility (HFE) letter") +
      " to find out your eligibility to buy a new or resale flat, the CPF housing grants available, and the HDB housing loan you may be eligible for.</p>",
    "<p>You can work out an estimated housing budget by adding up the following:</p>",
    "<ul><li>Available cash savings</li><li>Available CPF Ordinary Account savings (each flat applicant may retain up to $20,000)</li><li>Probable CPF housing grants</li><li>Estimated housing loan from HDB or participating financial institutions</li></ul>",
    '<div class="notice-box"><strong>Plan before committing</strong>Set aside funds for upfront payments, renovation, furnishing, moving expenses, and other major commitments.</div>',

    '<div class="accordion" data-accordion>',
    accordionItem("payments", "Understand the payments required", "Find out more about the upfront payments in cash and CPF for your flat purchase.", [
      "<p>A housing loan from HDB or a financial institution can only be used towards the purchase price of the flat, up to the prevailing loan-to-value limits.</p>",
      '<table class="data-table"><tbody><tr><th>New Flat</th><td><strong>Booking fee, downpayment and related costs</strong><p>Plan for the payments required at the various stages of your flat purchase from HDB.</p></td></tr>',
      '<tr><th>Resale Flat</th><td><strong>Initial payment and related costs</strong><ul><li>Deposit to flat seller</li><li>Property agent’s fees, if applicable</li><li>Cash payment for any difference between the resale price and the flat’s value</li></ul></td></tr></tbody></table>',
      "<h2>Use of CPF savings</h2><p>You may use your available CPF Ordinary Account savings to pay the downpayment or initial payment. If your CPF savings are not enough, the balance has to be paid in cash.</p>",
      "<h2>Other payments</h2><ul><li>Renovation, furnishing and moving expenses</li><li>Wedding expenses, if applicable</li></ul>"
    ].join(""), true),
    accordionItem("tools", "Financial tools", "Obtain a holistic view of your estimated budget and financing options using our calculators.", [
      '<table class="data-table"><tbody>',
      '<tr><th><a href="https://homes.hdb.gov.sg/home/calculator/budget" target="_blank" rel="noreferrer">Calculate housing budget ↗</a></th><td>Work out an estimated housing budget with housing loan information provided by HDB and participating financial institutions.</td></tr>',
      '<tr><th><a href="https://homes.hdb.gov.sg/home/calculator/payment-plan" target="_blank" rel="noreferrer">Create a payment plan ↗</a></th><td>Build a customised plan for a new or resale flat and understand payments at each milestone.</td></tr>',
      '<tr><th><a href="https://homes.hdb.gov.sg/home/calculator/sale-proceeds" target="_blank" rel="noreferrer">Calculate sale proceeds ↗</a></th><td>Estimate cash proceeds from selling your current flat and the amount to set aside for the next purchase.</td></tr>',
      "</tbody></table>"
    ].join(""), false),
    "</div>",
    nextStepsBlock(next),
    "</article></div>"
  ].join("");
}

function accordionItem(id, title, description, body, open) {
  return [
    '<section class="accordion-item">',
    '<button class="accordion-trigger" type="button" aria-expanded="' + String(open) + '" aria-controls="' + id + '-panel">',
    '<span><h3>' + escapeHTML(title) + "</h3><p>" + escapeHTML(description) + "</p></span>",
    '<span class="accordion-symbol" aria-hidden="true">' + (open ? "−" : "+") + "</span>",
    "</button>",
    '<div class="accordion-panel" id="' + id + '-panel"' + (open ? "" : " hidden") + ">" + body + "</div>",
    "</section>"
  ].join("");
}

function nextStepsBlock(items) {
  return [
    '<section class="next-steps"><h2>Next steps</h2><div class="next-grid">',
    items.map(function (item) {
      return '<a class="next-card route-link" href="' + routeHref(item[0]) + '"><strong>' +
        escapeHTML(item[1]) + "</strong><span>" + escapeHTML(item[2] || "Continue reading related HDB information.") + "</span><i>→</i></a>";
    }).join(""),
    "</div></section>"
  ].join("");
}

function generalArticle(path) {
  var title = labelFor(path);
  var nearby = siblings(path).filter(function (pair) { return pair[0] !== path; }).slice(0, 3);
  var lower = title.toLowerCase();
  var copy = guidanceCopyFor(path, title);
  if (!nearby.length) {
    nearby = [[rootPath(path), labelFor(rootPath(path)), "Return to the main topic page."]];
  }
  return [
    pageHero(path, title),
    '<div class="shell content-layout">',
    sectionNavigation(path),
    '<article class="article-body">',
    '<p class="lead">' + escapeHTML(copy.intro) + "</p>",
    '<div class="article-illustration" role="img" aria-label="Topic illustration">' + escapeHTML(title) + "</div>",
    "<h2>Overview</h2>",
    "<p>This public information page brings together the key considerations, requirements, and links related to " + escapeHTML(lower) + ".</p>",
    deeperLinksBlock(path),
    '<div class="notice-box"><strong>Singpass may be required</strong>Log in through the relevant HDB service to access personalised information or complete an application.</div>',
    "<h2>Before you start</h2>",
    '<ul class="check-list">' + copy.bullets.map(function (bullet) { return '<li>' + escapeHTML(bullet) + '</li>'; }).join('') + '</ul>',
    "<h2>How it works</h2>",
    '<ol class="step-list">' + copy.steps.map(function (step) { return '<li><strong>' + escapeHTML(step) + '</strong><br>Follow the guidance for your situation before continuing.</li>'; }).join('') + '</ol>',
    accordionItem("common-questions", "Common questions", "Open for a quick summary of the most common considerations.", "<p>Eligibility, documents, processing time, and fees vary by scheme. Refer to the official service before completing a transaction.</p>", false),
    genericTabs(title),
    '<p class="official-source-link"><a href="https://www.hdb.gov.sg' + escapeHTML(path) + '" target="_blank" rel="noreferrer">View the current official page ↗</a></p>',
    nextStepsBlock(nearby.map(function (pair) { return [pair[0], pair[1], "Continue to this related information page."]; })),
    "</article></div>"
  ].join("");
}

function eServicesPage(path) {
  var serviceSeen = new Set();
  var serviceRoutes = allRoutePairs.filter(function (pair) {
    if (!isServiceRoute(pair[0]) || serviceSeen.has(pair[0])) return false;
    serviceSeen.add(pair[0]);
    return true;
  }).sort(function (a, b) { return a[1].localeCompare(b[1]); });
  var directory = serviceRoutes.map(function (service) {
    var metadata = pageMetadataByPath.get(service[0]) || {};
    var parentTitle = labelFor(parentPath(service[0]));
    var isGenericServicePage = /^(Get Help|Terms and Conditions|User Guide|Employment Status)$/i.test(service[1]);
    var displayTitle = isGenericServicePage && parentTitle && parentTitle !== service[1]
      ? parentTitle + ' — ' + service[1]
      : service[1];
    var searchable = (displayTitle + ' ' + metadata.description + ' ' + service[0]).toLowerCase();
    return '<a class="info-card route-link service-directory-card" data-service-text="' + escapeHTML(searchable) + '" href="' + routeHref(service[0]) + '"><span class="card-kicker">e-Service</span><h3>' +
      escapeHTML(displayTitle) + '</h3><p>' + escapeHTML(metadata.description || 'Open the HDB e-Service information page.') + '</p><span class="card-arrow">→</span></a>';
  }).join('');
  return [
    pageHero(path, "e-Services"),
    '<section class="section-pad"><div class="shell">',
    '<div class="landing-intro"><span class="landing-icon">⌘</span><p>Access HDB information and online transactions. Log in with Singpass where required.</p></div>',
    '<div class="section-head"><h2>Popular services</h2></div>',
    '<div class="service-row">',
    '<button class="service-card" type="button" data-auth><span class="service-icon">⌂</span>My Flat Dashboard</button>',
    '<button class="service-card" type="button" data-auth><span class="service-icon">✓</span>Apply for an HFE Letter</button>',
    '<button class="service-card" type="button" data-auth><span class="service-icon">P</span>Season Parking Services</button>',
    '<button class="service-card" type="button" data-auth><span class="service-icon">✉</span>My Correspondence</button>',
    "</div>",
    '<div class="notice-box"><strong>Before you begin</strong>Have your Singpass and supporting information ready for applications, payments, and account services.</div>',
    '<section class="service-directory"><div class="section-head"><h2>All e-Services</h2><span>' + serviceRoutes.length + ' services</span></div>',
    '<label class="directory-filter" for="service-filter"><span>Filter services</span><input id="service-filter" type="search" autocomplete="off" placeholder="Try parking, loan, rental or renovation"></label>',
    '<div class="card-grid service-directory-grid">' + directory + '</div><p class="directory-empty" id="service-directory-empty" hidden>No matching services found.</p></section>',
    "</div></section>"
  ].join("");
}

function newsLandingPage(path) {
  var archive = {};
  allRoutePairs.forEach(function (pair) {
    var match = pair[0].match(/^\/hdb-pulse\/news\/(20\d{2})\//);
    if (!match) return;
    if (!archive[match[1]]) archive[match[1]] = [];
    if (!archive[match[1]].some(function (item) { return item[0] === pair[0]; })) archive[match[1]].push(pair);
  });
  var archiveSections = Object.keys(archive).sort().reverse().map(function (year) {
    return [
      '<section class="news-archive-year" id="news-' + year + '">',
      '<div class="section-head"><h2>' + year + ' archive</h2><span>' + archive[year].length + ' releases</span></div>',
      '<div class="card-grid">',
      archive[year].slice(0, 9).map(function (item) {
        return '<a class="info-card route-link" href="' + routeHref(item[0]) + '"><span class="card-kicker">' + year +
          '</span><h3>' + escapeHTML(item[1]) + '</h3><span class="card-arrow">→</span></a>';
      }).join(''),
      '</div></section>'
    ].join('');
  }).join('');
  return [
    pageHero(path, "News"),
    '<section class="section-pad"><div class="shell"><div class="section-head"><h2>Media releases</h2></div><div class="card-grid">',
    newsItems.map(function (item) {
      return '<a class="info-card route-link" href="' + routeHref(item.path) + '"><span class="card-kicker">' +
        escapeHTML(item.date) + "</span><h3>" + escapeHTML(item.title) + "</h3><span class=\"card-arrow\">→</span></a>";
    }).join(""),
    '</div><nav class="year-links" aria-label="News archive years">' + Object.keys(archive).sort().reverse().map(function (year) { return '<button type="button" data-scroll-target="news-' + year + '">' + year + '</button>'; }).join('') + '</nav>',
    archiveSections,
    "</div></section>"
  ].join("");
}

function newsArticle(path) {
  var item = newsItems.find(function (candidate) { return candidate.path === path; });
  var title = item ? item.title : labelFor(path);
  var yearMatch = path.match(/^\/hdb-pulse\/news\/(20\d{2})\//);
  var date = item ? item.date : (yearMatch ? yearMatch[1] : "Media release");
  var relatedNews = siblings(path).filter(function (candidate) { return candidate[0] !== path; }).slice(0, 3);
  if (!relatedNews.length) relatedNews = newsItems.filter(function (candidate) { return candidate.path !== path; }).slice(0, 3).map(function (candidate) { return [candidate.path, candidate.title]; });
  return [
    pageHero(path, title),
    '<div class="shell content-layout">',
    sectionNavigation("/hdb-pulse/news"),
    '<article class="article-body">',
    '<span class="eyebrow">Media release · ' + escapeHTML(date) + "</span>",
    '<p class="lead">HDB has released an update on ' + escapeHTML(title.toLowerCase()) + ".</p>",
    '<div class="article-illustration" role="img" aria-label="HDB news illustration">HDB<br>News</div>',
    "<h2>Overview</h2>",
    "<p>Read the complete media release for the announcement, supporting details, and related information.</p>",
    '<p><a href="https://www.hdb.gov.sg' + escapeHTML(path) + '" target="_blank" rel="noreferrer">Read the official media release ↗</a></p>',
    nextStepsBlock(relatedNews.map(function (candidate) { return [candidate[0], candidate[1], "Related HDB media release."]; })),
    "</article></div>"
  ].join("");
}

function townPage(path) {
  var town = labelFor(path);
  var relatedTowns = siblings(path).filter(function (item) { return item[0] !== path; }).slice(0, 3);
  return [
    pageHero(path, "Our Towns and Estates"),
    '<div class="shell content-layout">',
    sectionNavigation(path),
    '<article class="article-body town-article">',
    '<span class="eyebrow">Town profile</span>',
    '<h2>History of ' + escapeHTML(town) + '</h2>',
    '<p class="lead">Discover how ' + escapeHTML(town) + ' has evolved as part of Singapore’s public housing story.</p>',
    '<div class="article-illustration town-illustration" role="img" aria-label="Town illustration"><span>' + escapeHTML(town) + '</span><small>Homes · greenery · community</small></div>',
    '<h2>Evolving through the years</h2>',
    '<p>HDB towns are planned around homes, transport, green spaces, schools, shops and community facilities. Each town develops its own identity while following liveable and sustainable planning principles.</p>',
    '<div class="fact-grid"><article><strong>Connected</strong><span>Transport and walking links connect residents with daily amenities.</span></article><article><strong>Liveable</strong><span>Neighbourhoods bring homes, services and greenery together.</span></article><article><strong>Distinctive</strong><span>Town planning reflects the area’s history and character.</span></article></div>',
    '<h2>Notable places</h2>',
    '<p>Explore the town centre, neighbourhood facilities, parks and community spaces that support everyday life in ' + escapeHTML(town) + '.</p>',
    '<p class="official-source-link"><a href="https://www.hdb.gov.sg' + escapeHTML(path) + '" target="_blank" rel="noreferrer">Read the full official town history ↗</a></p>',
    nextStepsBlock(relatedTowns.map(function (item) { return [item[0], item[1], 'Explore another HDB town or estate.']; })),
    '</article></div>'
  ].join('');
}

function neighbourhoodPlacePage(path) {
  var place = labelFor(path);
  var townPath = parentPath(path);
  var town = labelFor(townPath);
  var nearby = siblings(path).filter(function (item) { return item[0] !== path; }).slice(0, 3);
  return [
    pageHero(path, "Explore My Town"),
    '<div class="shell content-layout">',
    sectionNavigation(path),
    '<article class="article-body place-article">',
    '<span class="eyebrow">' + escapeHTML(town) + '</span>',
    '<h2>' + escapeHTML(place) + '</h2>',
    '<p class="lead">Explore this neighbourhood destination and the services, food, shopping or community spaces around it.</p>',
    '<div class="article-illustration place-illustration" role="img" aria-label="Neighbourhood illustration">' + escapeHTML(place) + '</div>',
    '<h2>About this place</h2>',
    '<p>Discover this neighbourhood centre or community destination within ' + escapeHTML(town) + '.</p>',
    '<h2>Getting there</h2>',
    '<p>Use nearby public transport, walking and cycling connections. Refer to the official page for the current address and detailed directions.</p>',
    '<p class="official-source-link"><a href="https://www.hdb.gov.sg' + escapeHTML(path) + '" target="_blank" rel="noreferrer">View the official place guide ↗</a></p>',
    nextStepsBlock(nearby.map(function (item) { return [item[0], item[1], 'Explore another place in ' + town + '.']; })),
    '</article></div>'
  ].join('');
}

function sitemapPage(path) {
  var roots = ["/buying-a-flat", "/managing-my-home", "/renting-a-flat", "/shops-and-offices", "/business-partners", "/parking", "/about-us", "/hdb-pulse", "/hip", "/e-resale", "/hdb-flat-portal", "/hdbnews"];
  var coveredRoots = new Set(roots);
  var sections = roots.map(function (root) {
    var seen = new Set();
    var routes = allRoutePairs.filter(function (pair) {
      if (pair[0] !== root && pair[0].indexOf(root + "/") !== 0) return false;
      if (seen.has(pair[0])) return false;
      seen.add(pair[0]);
      return true;
    }).sort(function (a, b) {
      return pathDepth(a[0]) - pathDepth(b[0]) || a[1].localeCompare(b[1]);
    });
    return [
      '<details class="sitemap-group"' + (root === "/buying-a-flat" ? " open" : "") + '>',
      '<summary><strong>' + escapeHTML(labelFor(root)) + '</strong><span>' + routes.length + ' pages</span></summary>',
      '<div class="sitemap-links">',
      routes.map(function (route) {
        return '<a class="route-link depth-' + pathDepth(route[0]) + '" href="' + routeHref(route[0]) + '"><strong>' +
          escapeHTML(route[1]) + '</strong><small>' + escapeHTML(route[0]) + '</small></a>';
      }).join(''),
      '</div></details>'
    ].join('');
  }).join('');
  var otherSeen = new Set();
  var otherRoutes = allRoutePairs.filter(function (pair) {
    if (coveredRoots.has(rootPath(pair[0])) || otherSeen.has(pair[0])) return false;
    otherSeen.add(pair[0]);
    return true;
  }).sort(function (a, b) { return a[1].localeCompare(b[1]); });
  sections += [
    '<details class="sitemap-group">',
    '<summary><strong>Other Public Pages and e-Services</strong><span>' + otherRoutes.length + ' pages</span></summary>',
    '<div class="sitemap-links">',
    otherRoutes.map(function (route) {
      return '<a class="route-link depth-' + pathDepth(route[0]) + '" href="' + routeHref(route[0]) + '"><strong>' +
        escapeHTML(route[1]) + '</strong><small>' + escapeHTML(route[0]) + '</small></a>';
    }).join(''),
    '</div></details>'
  ].join('');

  return [
    pageHero(path, "Sitemap"),
    '<section class="section-pad"><div class="shell site-sitemap">',
    '<div class="landing-intro"><span class="landing-icon">⌘</span><p>Browse ' + allPublicSitemapPaths.length + ' public HDB page records, plus ' + synthesizedRoutePairs.length + ' navigable parent hubs added so every deep route can be traversed naturally.</p></div>',
    sections,
    '</div></section>'
  ].join('');
}

var portalRoots = new Set(["/hip", "/e-resale", "/hdb-flat-portal", "/hdbnews", "/hdb-map", "/where2shop", "/myhdb-mobile-app"]);
var contentRoots = new Set(["/buying-a-flat", "/managing-my-home", "/renting-a-flat", "/shops-and-offices", "/business-partners", "/parking", "/about-us", "/hdb-pulse"]);
var utilityPages = new Set(["/homepage", "/eservices", "/sitemap", "/privacy-statement", "/terms-of-use", "/site-requirements", "/useful-links", "/write-to-us", "/security-advisory"]);

function isServiceRoute(path) {
  var root = rootPath(path);
  return routeLabels.has(path) && !contentRoots.has(root) && !portalRoots.has(root) && !utilityPages.has(path);
}

function portalPage(path) {
  var title = labelFor(path);
  var metadata = pageMetadataByPath.get(path) || {};
  var children = directChildren(path);
  var cards = children.map(function (child) {
    var childMetadata = pageMetadataByPath.get(child[0]) || {};
    return '<a class="info-card route-link" href="' + routeHref(child[0]) + '"><span class="card-kicker">' +
      escapeHTML(labelFor(rootPath(path))) + '</span><h3>' + escapeHTML(child[1]) + '</h3><p>' +
      escapeHTML(childMetadata.description || 'Open this public portal information page.') + '</p><span class="card-arrow">→</span></a>';
  }).join('');
  var content = [
    '<article class="article-body portal-article">',
    '<div class="portal-badge" aria-hidden="true">HDB</div>',
    '<p class="lead">' + escapeHTML(metadata.description || ('Explore ' + title + ' information and public resources.')) + '</p>',
    children.length ? '<div class="section-head profile-section-head"><h2>Explore this portal</h2><span>' + children.length + ' pages</span></div><div class="card-grid">' + cards + '</div>' : '',
    '<div class="notice-box"><strong>Secure services</strong>Log in with Singpass to access payments, submissions, and account-specific features.</div>',
    '<p class="official-source-link"><a href="https://www.hdb.gov.sg' + escapeHTML(path) + '" target="_blank" rel="noreferrer">Open the official portal page ↗</a></p>',
    '</article>'
  ].join('');
  if (pathDepth(path) === 1) return pageHero(path, title) + '<section class="section-pad"><div class="shell">' + content + '</div></section>';
  return pageHero(path, title) + '<div class="shell content-layout">' + sectionNavigation(path) + content + '</div>';
}

function serviceNoticePage(path) {
  var title = labelFor(path);
  var metadata = pageMetadataByPath.get(path) || {};
  var parentTitle = labelFor(parentPath(path));
  var children = directChildren(path);
  var childCards = children.map(function (child) {
    var childMetadata = pageMetadataByPath.get(child[0]) || {};
    return '<a class="info-card route-link" href="' + routeHref(child[0]) + '"><span class="card-kicker">Service information</span><h3>' +
      escapeHTML(child[1]) + '</h3><p>' + escapeHTML(childMetadata.description || ('Read ' + child[1].toLowerCase() + ' for this service.')) +
      '</p><span class="card-arrow">→</span></a>';
  }).join('');
  return [
    pageHero(path, title),
    '<section class="section-pad"><div class="shell service-notice-page">',
    '<div class="service-lock" aria-hidden="true">▣</div>',
    '<span class="eyebrow">HDB e-Service' + (parentTitle && parentTitle !== title && parentTitle !== 'Home' ? ' · ' + escapeHTML(parentTitle) : '') + '</span>',
    '<h2>' + escapeHTML(title) + '</h2>',
    '<p class="lead">' + escapeHTML(metadata.description || 'This service continues on a secure HDB transaction page.') + '</p>',
    '<div class="notice-box"><strong>Singpass required</strong>Log in with Singpass to access personalised services and complete transactions securely.</div>',
    childCards ? '<div class="section-head profile-section-head"><h2>About this service</h2><span>' + children.length + ' pages</span></div><div class="card-grid">' + childCards + '</div>' : '',
    '<button class="primary-button" type="button" data-auth>View login options</button>',
    '<p class="official-source-link"><a href="https://www.hdb.gov.sg' + escapeHTML(path) + '" target="_blank" rel="noreferrer">Open the official e-Service information page ↗</a></p>',
    '</div></section>'
  ].join('');
}

function supportPage(path) {
  var title = labelFor(path);
  var metadata = pageMetadataByPath.get(path) || {};
  var children = directChildren(path);
  var cards = children.map(function (child) {
    var childMetadata = pageMetadataByPath.get(child[0]) || {};
    return '<a class="info-card route-link" href="' + routeHref(child[0]) + '"><h3>' +
      escapeHTML(child[1]) + '</h3><p>' + escapeHTML(childMetadata.description || 'Explore public HDB information and resources.') + '</p><span class="card-arrow">→</span></a>';
  }).join("");
  return [
    pageHero(path, title),
    '<section class="section-pad"><div class="shell">',
    '<p class="lead">' + escapeHTML(metadata.description || ('Find information and resources for ' + title.toLowerCase() + '.')) + '</p>',
    children.length ? '<div class="card-grid">' + cards + "</div>" : [
      '<article class="article-body">',
      "<h2>" + escapeHTML(title) + "</h2>",
      "<p>Explore information, guidance, and related services for this topic.</p>",
      '<div class="notice-box"><strong>Online services</strong>Some services require Singpass and supporting information before you begin.</div>',
      "<h2>Need more help?</h2><p>Use Contact Us for HDB-related enquiries, or visit the official website for current policy and service information.</p>",
      "</article>"
    ].join(""),
    "</div></section>"
  ].join("");
}

function notFoundPage(path) {
  return [
    '<section class="empty-route">',
    '<span class="error-code">404</span>',
    "<h1>Page not found</h1>",
    "<p>The requested page <code>" + escapeHTML(path) + "</code> could not be found.</p>",
    routeLink("/homepage", "Return to home", "primary-button"),
    "</section>"
  ].join("");
}

function renderRoute(options) {
  var opts = options || {};
  var path = currentPath();
  if (carouselTimer) {
    window.clearInterval(carouselTimer);
    carouselTimer = null;
  }
  closeMegaMenu();
  closeMobileMenu();
  toggleSearch(false);
  document.querySelectorAll("dialog[open]").forEach(function (dialog) { closeDialog(dialog); });

  var output;
  if (path === "/homepage") {
    output = homePage();
  } else if (path === "/eservices") {
    output = eServicesPage(path);
  } else if (path === "/hdb-pulse/news") {
    output = newsLandingPage(path);
  } else if (path === "/sitemap") {
    output = sitemapPage(path);
  } else if (path.indexOf("/hdb-pulse/news/") === 0) {
    output = newsArticle(path);
  } else if (path === "/buying-a-flat/financial-planning-for-a-flat-purchase/budget-for-a-flat") {
    output = budgetArticle(path);
  } else if (articlePageProfiles[path]) {
    output = profiledArticlePage(path);
  } else if (hubPageProfiles[path]) {
    output = profiledHubPage(path);
  } else if (topicMeta[path]) {
    output = topicLandingPage(path);
  } else if (/^\/about-us\/our-towns-and-estates\/[^/]+$/.test(path)) {
    output = townPage(path);
  } else if (path.indexOf("/explore-my-town/") >= 0 && pathDepth(path) >= 6 && !directChildren(path).length) {
    output = neighbourhoodPlacePage(path);
  } else if (portalRoots.has(rootPath(path))) {
    output = portalPage(path);
  } else if (isServiceRoute(path)) {
    output = serviceNoticePage(path);
  } else if (pathDepth(path) === 2 && directChildren(path).length) {
    output = subsectionPage(path);
  } else if (pathDepth(path) >= 3 && (routeLabels.has(path) || rootPath(path) === "/buying-a-flat")) {
    output = generalArticle(path);
  } else if (routeLabels.has(path)) {
    output = supportPage(path);
  } else {
    output = notFoundPage(path);
  }

  app.innerHTML = output;
  setActiveNavigation(path);
  initPageInteractions();
  document.title = path === "/homepage" ? "Housing & Development Board (HDB)" : labelFor(path) + " | HDB";
  routeStatus.textContent = labelFor(path) + " page loaded";
  if (!opts.preserveScroll) window.scrollTo(0, 0);
}

function initPageInteractions() {
  var serviceFilter = document.getElementById("service-filter");
  if (serviceFilter) {
    serviceFilter.addEventListener("input", function () {
      var query = serviceFilter.value.trim().toLowerCase();
      var visibleCount = 0;
      document.querySelectorAll(".service-directory-card").forEach(function (card) {
        var visible = !query || card.dataset.serviceText.indexOf(query) >= 0;
        card.hidden = !visible;
        if (visible) visibleCount += 1;
      });
      document.getElementById("service-directory-empty").hidden = visibleCount > 0;
    });
  }

  document.querySelectorAll("[data-scroll-target]").forEach(function (button) {
    button.addEventListener("click", function () {
      var target = document.getElementById(button.dataset.scrollTarget);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  document.querySelectorAll(".section-nav-toggle").forEach(function (button) {
    button.addEventListener("click", function () {
      var navigation = button.closest(".section-nav");
      var open = navigation.classList.toggle("open");
      button.setAttribute("aria-expanded", String(open));
      button.querySelector("span").textContent = open ? "⌃" : "⌄";
    });
  });

  document.querySelectorAll("[data-accordion]").forEach(function (accordion) {
    accordion.querySelectorAll(".accordion-trigger").forEach(function (button) {
      button.addEventListener("click", function () {
        var wasOpen = button.getAttribute("aria-expanded") === "true";
        accordion.querySelectorAll(".accordion-trigger").forEach(function (other) {
          other.setAttribute("aria-expanded", "false");
          other.querySelector(".accordion-symbol").textContent = "+";
          document.getElementById(other.getAttribute("aria-controls")).hidden = true;
        });
        if (!wasOpen) {
          button.setAttribute("aria-expanded", "true");
          button.querySelector(".accordion-symbol").textContent = "−";
          document.getElementById(button.getAttribute("aria-controls")).hidden = false;
        }
      });
    });
  });

  document.querySelectorAll('[role="tablist"]').forEach(function (tabList) {
    var tabs = Array.from(tabList.querySelectorAll('[role="tab"]'));
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        tabs.forEach(function (other) {
          var selected = other === tab;
          other.setAttribute("aria-selected", String(selected));
          document.getElementById(other.getAttribute("aria-controls")).hidden = !selected;
        });
      });
      tab.addEventListener("keydown", function (event) {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        event.preventDefault();
        var direction = event.key === "ArrowRight" ? 1 : -1;
        var nextIndex = (tabs.indexOf(tab) + direction + tabs.length) % tabs.length;
        tabs[nextIndex].focus();
        tabs[nextIndex].click();
      });
    });
  });

  if (document.getElementById("carousel-slides")) initCarousel();
}

function initCarousel() {
  carouselIndex = 0;
  var prev = document.getElementById("carousel-prev");
  var next = document.getElementById("carousel-next");
  prev.addEventListener("click", function () { showSlide(carouselIndex - 1); });
  next.addEventListener("click", function () { showSlide(carouselIndex + 1); });
  document.querySelectorAll(".carousel-dot").forEach(function (dot) {
    dot.addEventListener("click", function () { showSlide(Number(dot.dataset.slide)); });
  });
  showSlide(0);
}

function showSlide(index) {
  var track = document.getElementById("carousel-slides");
  if (!track) return;
  carouselIndex = (index + homeSlides.length) % homeSlides.length;
  track.style.transform = "translateX(-" + (carouselIndex * 100) + "%)";
  document.querySelectorAll(".carousel-dot").forEach(function (dot, dotIndex) {
    dot.classList.toggle("active", dotIndex === carouselIndex);
    dot.setAttribute("aria-current", dotIndex === carouselIndex ? "true" : "false");
  });
}

/* Global interactions */
document.getElementById("masthead-toggle").addEventListener("click", function (event) {
  var details = document.getElementById("masthead-details");
  var open = event.currentTarget.getAttribute("aria-expanded") === "true";
  event.currentTarget.setAttribute("aria-expanded", String(!open));
  details.hidden = open;
});

document.getElementById("advisory-prev").addEventListener("click", function () {
  advisoryIndex = Math.max(0, advisoryIndex - 1);
  updateAdvisory();
});

document.getElementById("advisory-next").addEventListener("click", function () {
  advisoryIndex = Math.min(advisories.length - 1, advisoryIndex + 1);
  updateAdvisory();
});

document.getElementById("advisory-close").addEventListener("click", function () {
  document.getElementById("advisory-bar").hidden = true;
});

document.getElementById("advisory-more").addEventListener("click", function () {
  document.getElementById("advisory-dialog-content").innerHTML = advisories.map(function (item) {
    return "<article><h3>" + escapeHTML(item.title) + "</h3><p>" + escapeHTML(item.body) + "</p></article>";
  }).join("");
  openDialog(advisoryDialog);
});

document.getElementById("messages-button").addEventListener("click", function () {
  document.getElementById("advisory-more").click();
});

document.getElementById("login-button").addEventListener("click", function () {
  openDialog(loginDialog);
});

document.getElementById("search-toggle").addEventListener("click", function () { toggleSearch(); });
document.getElementById("search-close").addEventListener("click", function () { toggleSearch(false); });
document.getElementById("menu-button").addEventListener("click", openMobileMenu);
document.getElementById("mobile-menu-close").addEventListener("click", closeMobileMenu);
document.getElementById("page-scrim").addEventListener("click", closeMobileMenu);
document.getElementById("mobile-search-trigger").addEventListener("click", function () {
  closeMobileMenu();
  toggleSearch(true);
});

document.getElementById("site-search").addEventListener("submit", function (event) {
  event.preventDefault();
  renderSearchResults(searchInput.value);
});
searchInput.addEventListener("input", function () { renderSearchResults(searchInput.value); });

document.addEventListener("click", function (event) {
  var authTarget = event.target.closest("[data-auth]");
  if (authTarget) {
    event.preventDefault();
    openDialog(loginDialog);
  }
  var routeTarget = event.target.closest(".route-link");
  if (routeTarget) {
    closeMegaMenu();
    closeMobileMenu();
  }
  var closeTarget = event.target.closest("[data-close-dialog]");
  if (closeTarget) closeDialog(closeTarget.closest("dialog"));
});

[loginDialog, advisoryDialog].forEach(function (dialog) {
  dialog.addEventListener("click", function (event) {
    if (event.target === dialog) closeDialog(dialog);
  });
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeMegaMenu();
    closeMobileMenu();
    toggleSearch(false);
  }
});

document.getElementById("back-to-top").addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("scroll", function () {
  document.getElementById("back-to-top").classList.toggle("visible", window.scrollY > 200);
}, { passive: true });

window.addEventListener("hashchange", function () { renderRoute(); });

renderPrimaryNavigation();
renderMobileNavigation();
updateAdvisory();

if (!window.location.hash) {
  window.location.hash = "/homepage";
} else {
  renderRoute();
}
