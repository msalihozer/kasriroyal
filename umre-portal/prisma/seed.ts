import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

// Simple hash implementation for demo seed (In production use bcrypt/argon2)
function hashPassword(password: string) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function main() {
  console.log('Seeding database...');

  // 1. Admin User
  const adminEmail = 'admin@site.com';
  const adminExists = await prisma.adminUser.findUnique({ where: { email: adminEmail } });
  if (!adminExists) {
    await prisma.adminUser.create({
      data: {
        email: adminEmail,
        passwordHash: hashPassword('Admin123!'), // Placeholder hash
        role: 'ADMIN',
      },
    });
    console.log('Admin user created');
  }

  // 2. Site Settings
  const existingSettings = await prisma.siteSettings.findFirst();
  if (!existingSettings) {
    await prisma.siteSettings.create({
      data: {
        logoUrl: '/uploads/logo-placeholder.png',
        faviconUrl: '/uploads/favicon.ico',
        socialLinks: {
          instagram: 'https://instagram.com',
          facebook: 'https://facebook.com',
          youtube: 'https://youtube.com',
          x: 'https://x.com',
          tiktok: 'https://tiktok.com',
          whatsapp: 'https://wa.me/9055555555',
        },
        footerDiyanetImageUrl: '/uploads/diyanet-logo.png',
        footerDiyanetLink: 'https://diyanet.gov.tr',
        footerAgencyImageUrl: '/uploads/tursab-logo.png',
        footerAgencyLink: 'https://tursab.org.tr',
      },
    });
    console.log('Site settings created');
  }

  // 3. Menu Items
  const menuCount = await prisma.menuItem.count();
  if (menuCount === 0) {
    const menus = [
      { label: 'Anasayfa', url: '/', orderIndex: 1 },
      { label: 'VIP Umre', url: '/vip-umre', orderIndex: 2 },
      { label: 'Turlar', url: '/turlar', orderIndex: 3 },
      { label: 'Oteller', url: '/oteller', orderIndex: 4 },
      { label: 'Transfer', url: '/transfer', orderIndex: 5 },
      { label: 'Blog', url: '/blog', orderIndex: 6 },
      { label: 'İletişim', url: '/iletisim', orderIndex: 7 },
    ];
    for (const menu of menus) {
      await prisma.menuItem.create({ data: menu });
    }
    console.log('Menu items created');
  }

  // 4. Tours & Categories
  const catCount = await prisma.tourCategory.count();
  if (catCount === 0) {
    const economic = await prisma.tourCategory.create({ data: { name: 'Ekonomik', slug: 'ekonomik' } });
    const lux = await prisma.tourCategory.create({ data: { name: 'Lüks', slug: 'luks' } });

    for (let i = 1; i <= 6; i++) {
        await prisma.tour.create({
            data: {
                title: `Ornek Tur ${i}`,
                slug: `ornek-tur-${i}`,
                summary: 'Kısa açıklama buraya gelecek.',
                content: '<p>Detaylı tur programı buraya.</p>',
                durationDays: 7 + i,
                priceFrom: 1200 + (i * 100),
                currency: 'USD',
                isFeatured: i <= 3,
                categoryId: i % 2 === 0 ? economic.id : lux.id,
                startDates: ['2024-04-10', '2024-05-15'],
                included: ['Uçak Bileti', 'Vize', 'Otel Konaklama'],
                excluded: ['Kişisel Harcamalar'],
                status: 'published'
            }
        });
    }
    console.log('Tours created');
  }

  // 5. Hotels
   const hotelCount = await prisma.hotel.count();
   if (hotelCount === 0) {
       for (let i = 1; i <= 6; i++) {
           await prisma.hotel.create({
               data: {
                   title: `Hotel ${i}`,
                   slug: `hotel-${i}`,
                   city: i % 2 === 0 ? 'MEKKE' : 'MEDINE',
                   stars: 5,
                   description: '<p>Otel açıklaması...</p>',
                   amenities: ['Wifi', 'Restaurant', 'Transfer'],
                   isFeatured: i <= 2,
                   status: 'published'
               }
           });
       }
       console.log('Hotels created');
   }

   // 6. Homepage
    const homePage = await prisma.page.findUnique({ where: { slug: 'home' } });
    if (!homePage) {
        await prisma.page.create({
            data: {
                title: 'Anasayfa',
                slug: 'home',
                status: 'published',
                blocks: [
                    { type: 'heroVideo', data: { videoUrl: '/uploads/hero.mp4', title: 'Manevi Yolculuğunuz Başlıyor' } },
                    { type: 'searchBox', data: {} },
                    { type: 'cardGrid', data: { title: 'Umre Paketlerimiz' } },
                    { type: 'featuredTours', data: { title: 'Öne Çıkan Turlar' } },
                    { type: 'iconList', data: { items: [{ icon: 'check', title: 'Güvenilir Hizmet' }] } },
                    { type: 'testimonials', data: {} }
                ]
            }
        });
        console.log('Homepage created');
    }

    console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
