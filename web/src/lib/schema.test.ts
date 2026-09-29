import { describe, expect, it } from 'vitest';
import { breadcrumbList, creativeWork, faqPage, professionalService } from './schema';

describe('schema', () => {
  it('describe el servicio sin dirección física', () => {
    const data = professionalService('https://gubiadigital.example/');
    expect(data['@type']).toBe('ProfessionalService');
    expect(data).not.toHaveProperty('address');
    expect(data.areaServed).toEqual(['Madrid', 'España']);
  });

  it('arma la FAQ y las migas en orden', () => {
    const faq = faqPage([{ question: '¿La web es mía?', answer: 'Sí.' }]);
    expect(faq.mainEntity[0]?.acceptedAnswer.text).toBe('Sí.');
    const crumbs = breadcrumbList([
      { name: 'Casos', url: 'https://gubiadigital.example/casos/' },
      { name: 'Ana', url: 'https://gubiadigital.example/casos/ana/' },
    ]);
    expect(crumbs.itemListElement.map((item) => item.position)).toEqual([1, 2]);
  });

  it('incluye la imagen del caso cuando existe', () => {
    const work = creativeWork({
      name: 'Caso',
      url: 'https://gubiadigital.example/casos/ana/',
      description: 'Rediseño',
      image: 'https://gubiadigital.example/og/casos/ana.webp',
    });
    expect(work.image).toContain('/og/casos/ana.webp');
  });
});
