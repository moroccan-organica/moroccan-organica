const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const variants = await prisma.productVariant.findMany({
        take: 5
    });
    console.log(JSON.stringify(variants, null, 2));
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
