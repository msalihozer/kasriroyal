import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting DB URL replacement...');
  const oldUrl = 'http://localhost:4000';
  const newUrl = 'https://api.kasriroyal.com';

  // Helper to replace in strings
  const replaceStr = (str) => typeof str === 'string' ? str.replace(new RegExp(oldUrl, 'g'), newUrl) : str;
  // Helper to replace in string arrays (Json fields)
  const replaceJsonArr = (arr) => {
      if (!Array.isArray(arr)) return arr;
      return arr.map(e => replaceStr(e));
  };
  
  // Media
  const media = await prisma.media.findMany();
  for (const m of media) {
      if (m.url && m.url.includes(oldUrl)) {
          await prisma.media.update({ where: { id: m.id }, data: { url: replaceStr(m.url) } });
      }
  }

  // Location
  const locations = await prisma.location.findMany();
  for (const loc of locations) {
      if (loc.imageUrl && loc.imageUrl.includes(oldUrl)) {
          await prisma.location.update({ where: { id: loc.id }, data: { imageUrl: replaceStr(loc.imageUrl) } });
      }
  }

  // Hotel
  const hotels = await prisma.hotel.findMany();
  for (const h of hotels) {
      let data: any = {};
      if (h.imageUrl && h.imageUrl.includes(oldUrl)) data.imageUrl = replaceStr(h.imageUrl);
      if (h.gallery) {
          const newG = replaceJsonArr(h.gallery as any);
          if (JSON.stringify(newG) !== JSON.stringify(h.gallery)) data.gallery = newG;
      }
      if (Object.keys(data).length > 0) await prisma.hotel.update({ where: { id: h.id }, data });
  }

  // Tour
  const tours = await prisma.tour.findMany();
  for (const t of tours) {
      let data: any = {};
      if (t.ogImageUrl && t.ogImageUrl.includes(oldUrl)) data.ogImageUrl = replaceStr(t.ogImageUrl);
      if (t.gallery) {
          const newG = replaceJsonArr(t.gallery as any);
          if (JSON.stringify(newG) !== JSON.stringify(t.gallery)) data.gallery = newG;
      }
      if (Object.keys(data).length > 0) await prisma.tour.update({ where: { id: t.id }, data });
  }

  // Vehicle
  const vehicles = await prisma.vehicle.findMany();
  for (const v of vehicles) {
      if (v.imageUrl && v.imageUrl.includes(oldUrl)) {
          await prisma.vehicle.update({ where: { id: v.id }, data: { imageUrl: replaceStr(v.imageUrl) } });
      }
  }

  // Post
  const posts = await prisma.post.findMany();
  for (const p of posts) {
      let data: any = {};
      if (p.coverImageUrl && p.coverImageUrl.includes(oldUrl)) data.coverImageUrl = replaceStr(p.coverImageUrl);
      if (p.ogImageUrl && p.ogImageUrl.includes(oldUrl)) data.ogImageUrl = replaceStr(p.ogImageUrl);
      if (Object.keys(data).length > 0) await prisma.post.update({ where: { id: p.id }, data });
  }

  // Page
  const pages = await prisma.page.findMany();
  for (const p of pages) {
      let data: any = {};
      if (p.imageUrl && p.imageUrl.includes(oldUrl)) data.imageUrl = replaceStr(p.imageUrl);
      if (p.ogImageUrl && p.ogImageUrl.includes(oldUrl)) data.ogImageUrl = replaceStr(p.ogImageUrl);
      if (Object.keys(data).length > 0) await prisma.page.update({ where: { id: p.id }, data });
  }

  // SiteSettings
  const settings = await prisma.siteSettings.findMany();
  for (const s of settings) {
      let data: any = {};
      if (s.logoUrl && s.logoUrl.includes(oldUrl)) data.logoUrl = replaceStr(s.logoUrl);
      if (s.faviconUrl && s.faviconUrl.includes(oldUrl)) data.faviconUrl = replaceStr(s.faviconUrl);
      if (s.heroVideoUrl && s.heroVideoUrl.includes(oldUrl)) data.heroVideoUrl = replaceStr(s.heroVideoUrl);
      if (s.footerDiyanetImageUrl && s.footerDiyanetImageUrl.includes(oldUrl)) data.footerDiyanetImageUrl = replaceStr(s.footerDiyanetImageUrl);
      if (s.footerAgencyImageUrl && s.footerAgencyImageUrl.includes(oldUrl)) data.footerAgencyImageUrl = replaceStr(s.footerAgencyImageUrl);
      if (Object.keys(data).length > 0) await prisma.siteSettings.update({ where: { id: s.id }, data });
  }

  console.log('Finished DB URL replacement successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
