const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main()
{
    for (let i = 1; i <= 5; i++)
    {
        const user = await prisma.user.create({
            data: {
                email: `user${i}@example.com`,
                phone: `123456789${i}`,
                password: 'securepassword',
                firstName: `John${i}`,
                lastName: `Doe${i}`,
                twoFA: false,
                isPhoneVerified: false,
            },
        });

        for (let j = 1; j <= 3; j++)
        {
            await prisma.otp.create({
                data: {
                    code: `12345${j}`,
                    userId: user.id,
                    expiresAt: new Date(Date.now() + 30 * 60000),
                    useCase: 'LOGIN',
                },
            });
        }
    }
}

main()
    .catch((e) =>
    {
        throw e;
    })
    .finally(async () =>
    {
        await prisma.$disconnect();
    });
