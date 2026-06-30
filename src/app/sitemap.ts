import type { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://slintorm.vercel.app';

const routes = [
  { url: '/',                                      priority: 1.0,  changeFrequency: 'weekly' },
  { url: '/docs/installation',                     priority: 0.9,  changeFrequency: 'monthly' },
  { url: '/docs/configuration',                    priority: 0.9,  changeFrequency: 'monthly' },
  { url: '/docs/models',                           priority: 0.9,  changeFrequency: 'monthly' },
  { url: '/docs/define-model',                     priority: 0.9,  changeFrequency: 'monthly' },
  { url: '/docs/crud',                             priority: 0.9,  changeFrequency: 'monthly' },
  { url: '/docs/query-builder',                    priority: 0.85, changeFrequency: 'monthly' },
  { url: '/docs/query-builder/select',             priority: 0.8,  changeFrequency: 'monthly' },
  { url: '/docs/query-builder/where',              priority: 0.8,  changeFrequency: 'monthly' },
  { url: '/docs/query-builder/joins',              priority: 0.8,  changeFrequency: 'monthly' },
  { url: '/docs/query-builder/ordering-pagination',priority: 0.8,  changeFrequency: 'monthly' },
  { url: '/docs/query-builder/preloads',           priority: 0.8,  changeFrequency: 'monthly' },
  { url: '/docs/query-builder/aggregates',         priority: 0.8,  changeFrequency: 'monthly' },
  { url: '/docs/query-builder/subqueries',         priority: 0.75, changeFrequency: 'monthly' },
  { url: '/docs/query-builder/relation-traversal', priority: 0.75, changeFrequency: 'monthly' },
  { url: '/docs/query-builder/scopes',             priority: 0.75, changeFrequency: 'monthly' },
  { url: '/docs/soft-delete',                      priority: 0.8,  changeFrequency: 'monthly' },
  { url: '/docs/validation',                       priority: 0.8,  changeFrequency: 'monthly' },
  { url: '/docs/hooks',                            priority: 0.8,  changeFrequency: 'monthly' },
  { url: '/docs/transactions',                     priority: 0.8,  changeFrequency: 'monthly' },
  { url: '/docs/error-handling',                   priority: 0.8,  changeFrequency: 'monthly' },
  { url: '/docs/relations',                        priority: 0.85, changeFrequency: 'monthly' },
  { url: '/docs/migrations',                       priority: 0.85, changeFrequency: 'monthly' },
  { url: '/docs/cli',                              priority: 0.8,  changeFrequency: 'monthly' },
  { url: '/docs/edge-serverless',                  priority: 0.85, changeFrequency: 'monthly' },
  { url: '/docs/drivers',                          priority: 0.8,  changeFrequency: 'monthly' },
  { url: '/docs/typescript',                       priority: 0.8,  changeFrequency: 'monthly' },
  { url: '/docs/schema-generation',                priority: 0.8,  changeFrequency: 'monthly' },
  { url: '/docs/changelog',                        priority: 0.6,  changeFrequency: 'weekly'  },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map(route => ({
    url: `${baseUrl}${route.url}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
