# Blog publication and measurement runbook

## Baseline captured 2026-07-15

- Search Console range: 2025-12-08 to 2026-07-13.
- Whole site: 540 impressions, 15 clicks, 2.8% CTR, average position 18.5.
- Blog: 301 impressions, 3 clicks, 1.0% CTR, average position 16.8.
- Blog share of impressions: about 56%.
- Existing click-producing topics: CV Studio, Spring legacy migration, and Kafka/RabbitMQ.
- Technical query families currently dominate impressions: RabbitMQ, hexagonal architecture, and Kafka versus database.

## Deployment checkpoint

Record the deployed commit SHA and date. Confirm that the production sitemap contains all 54 bilingual blog URLs before requesting a fresh Search Console read.

## Search Console follow-up

1. Open the `https://jomiferse.com/` property.
2. Resubmit or request a new read of `https://jomiferse.com/sitemap-index.xml`.
3. Confirm the redirected `https://www.jomiferse.com/sitemap-0.xml` is fetchable and reports discovered URLs.
4. Inspect one buyer-led article, one technical-authority article, and one case-study article.
5. Record the first date Google reports the updated URL as indexed.

## Article review window

Do not evaluate removal until an article has been published, present in the sitemap, and indexable for at least 12 weeks after the corrected sitemap read.

Consider consolidation or removal only when all conditions are true:

- No non-brand impressions during a continuous 90-day window.
- No organic clicks or attributed leads.
- No external backlinks worth preserving.
- No unique proof or necessary role in its commercial cluster.
- A relevant replacement URL exists for a 301 redirect.

If any condition is false, keep or improve the article instead of deleting it.
