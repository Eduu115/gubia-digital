import { site } from '../data/site';

export interface Crumb {
  name: string;
  url: string;
}

export function professionalService(url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: site.name,
    url,
    email: site.email,
    telephone: site.phoneTel,
    areaServed: ['Madrid', 'España'],
  };
}

export function faqPage(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function breadcrumbList(items: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function creativeWork(input: { name: string; url: string; description: string; image?: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: input.name,
    url: input.url,
    description: input.description,
    ...(input.image ? { image: input.image } : {}),
    creator: {
      '@type': 'Organization',
      name: 'Gubia Digital',
    },
  };
}
