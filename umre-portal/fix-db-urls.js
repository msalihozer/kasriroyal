const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting DB URL replacement...');
  const oldUrl = 'http://localhost:4000';
  const newUrl = 'https://api.kasriroyal.com';

  // Update Users (avatar)
  const users = await prisma.user.findMany({ where: { avatar: { contains: oldUrl } } });
  for (const item of users) {
    await prisma.user.update({ where: { id: item.id }, data: { avatar: item.avatar.replace(oldUrl, newUrl) } });
  }

  // Update Settings (logo, favicon)
  const settings = await prisma.siteSettings.findMany();
  for (const item of settings) {
    let data = {};
    if (item.logo && item.logo.includes(oldUrl)) data.logo = item.logo.replace(oldUrl, newUrl);
    if (item.favicon && item.favicon.includes(oldUrl)) data.favicon = item.favicon.replace(oldUrl, newUrl);
    if (item.heroVideoUrl && item.heroVideoUrl.includes(oldUrl)) data.heroVideoUrl = item.heroVideoUrl.replace(oldUrl, newUrl);
    
    // Check contact emails or other JSON if needed, but strings are enough
    if (Object.keys(data).length > 0) {
      await prisma.siteSettings.update({ where: { id: item.id }, data });
    }
  }

  // Update Locations (image, coverImage)
  const locations = await prisma.location.findMany();
  for (const item of locations) {
    let data = {};
    if (item.image && item.image.includes(oldUrl)) data.image = item.image.replace(oldUrl, newUrl);
    if (item.coverImage && item.coverImage.includes(oldUrl)) data.coverImage = item.coverImage.replace(oldUrl, newUrl);
    if (Object.keys(data).length > 0) {
      await prisma.location.update({ where: { id: item.id }, data });
    }
  }

  // Update Hotels (images)
  const hotels = await prisma.hotel.findMany();
  for (const item of hotels) {
    if (item.images && Array.isArray(item.images)) {
      const newImages = item.images.map(img => typeof img === 'string' ? img.replace(oldUrl, newUrl) : img);
      if (JSON.stringify(newImages) !== JSON.stringify(item.images)) {
        await prisma.hotel.update({ where: { id: item.id }, data: { images: newImages } });
      }
    }
  }

  // Update Vehicles (images)
  const vehicles = await prisma.vehicle.findMany();
  for (const item of vehicles) {
    if (item.images && Array.isArray(item.images)) {
      const newImages = item.images.map(img => typeof img === 'string' ? img.replace(oldUrl, newUrl) : img);
      if (JSON.stringify(newImages) !== JSON.stringify(item.images)) {
        await prisma.vehicle.update({ where: { id: item.id }, data: { images: newImages } });
      }
    }
  }

  // Update Tour Types (icon)
  const tourTypes = await prisma.tourType.findMany();
  for (const item of tourTypes) {
     if (item.icon && item.icon.includes(oldUrl)) {
         await prisma.tourType.update({ where: { id: item.id }, data: { icon: item.icon.replace(oldUrl, newUrl) }});
     }
  }

  console.log('Finished updating URLs in the database.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
