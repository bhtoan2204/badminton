const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main()
{
    await prisma.user.create({
        data: {
            username: 'Alice',
            password: 'alice123',
        },
    });

    await prisma.user.create({
        data: {
            username: 'Bob',
            password: 'bob123',
        },
    });
}

main()
    .catch(e =>
    {
        console.error(e);
        process.exit(1);
    })
    .finally(async () =>
    {
        await prisma.$disconnect();
    });
