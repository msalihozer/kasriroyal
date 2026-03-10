const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const result = await prisma.page.updateMany({
        where: {
            category: 'vip-umre'
        },
        data: {
            status: 'published'
        }
    });
    console.log(`Updated ${result.count} pages to published.`);

    const pages = await prisma.page.findMany({ where: { category: 'vip-umre' } });
    console.log('Current VIP Pages:', pages.map(p => ({ title: p.title, status: p.status })));
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
