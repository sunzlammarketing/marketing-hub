---
title: "Google Analytics 4 Basics: Setup and the Only 5 Reports You Need"
description: "GA4 has so many reports it becomes overwhelming. How to set it up, configure conversions, and focus only on the five reports that actually drive decisions."
pubDate: 2026-07-01
category: "du-lieu-do-luong"
tags: ["ga4", "analytics", "measurement", "website"]
readingTime: 8
lang: "en"
---

Opening Google Analytics 4 for the first time, most people feel the same thing: too many menus, too many numbers, no idea where to look.

The good news is you **do not need all of it**. Set it up correctly and read five reports, and you can answer almost every important question about your website.

## Setup in 15 minutes

**Step 1 — Create an account.** Go to `analytics.google.com`, create a Property, and set the correct timezone and currency from the start (changing them later is painful).

**Step 2 — Get your measurement ID.** It looks like `G-XXXXXXX`.

**Step 3 — Install it on your site.**
- Custom-coded site: paste the snippet into the `<head>` tag
- WordPress: use a plugin such as Site Kit
- Shopify/Wix: there is a built-in field for your GA4 ID in settings

**Step 4 — Verify.** Go to **Reports → Realtime** and open your site on your phone. If you see one active user, it is working.

**Step 5 — Link Search Console.** Under Admin → Product links. This lets you see SEO data inside GA4.

## The 3 core GA4 concepts

GA4 differs fundamentally from the old version because everything is an **event**:

| Concept | Plain meaning |
|---|---|
| **Event** | An action: page view, scroll, link click, purchase |
| **Conversion** | An event you mark as important (order placed, form submitted) |
| **Session** | One visit, from arrival until the person leaves |

The most important task after installing: **mark your conversions**. Without this, GA4 only tells you how many people visited, not how many created value.

Go to **Admin → Events** and toggle "Mark as conversion" for the events that matter to you (for example `purchase`, `generate_lead`, or your contact-button click event).

## The 5 reports worth reading, and why

**1. Traffic acquisition** *(Acquisition → Traffic acquisition)*
Shows where visitors come from: organic search, social, paid, direct.
→ **Use it to**: decide which channel deserves more investment.

**2. Pages and screens** *(Engagement → Pages and screens)*
Ranks pages by views and engagement time.
→ **Use it to**: see which content works so you can write more on similar topics.

**3. Realtime**
→ **Use it to**: check immediately after publishing a post or launching an ad whether traffic is arriving.

**4. User attributes & Tech**
→ **Use it to**: if 80% of visitors are on mobile and your site is awkward on phones, that becomes priority number one.

**5. Funnel exploration** *(Explore → Funnel exploration)*
Build your own multi-step funnel: view product → add to cart → checkout → purchase.
→ **Use it to**: pinpoint exactly which step loses the most people.

That fifth report is the most valuable and the least used — it turns GA4 from a dashboard into a diagnostic tool.

## 4 common GA4 mistakes

1. **Not filtering internal traffic** — you and your staff visiting the site skews the data. Exclude internal IPs in Admin.
2. **Never marking conversions** — pretty data that answers nothing.
3. **Comparing mismatched periods** — comparing February (28 days) to January (31 days) and concluding "we declined".
4. **Checking numbers daily** — daily swings are noisy. Look weekly or monthly to see the real trend.

## A 10-minute weekly habit

Every Monday, open GA4 and answer exactly three questions:

1. Which channel brought most visitors last week?
2. Which content was viewed most?
3. Did conversions go up or down versus the previous week?

Ten minutes a week, sustained for three months, will give you a better feel for your website than any course.
