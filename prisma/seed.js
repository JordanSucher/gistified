const PrismaClient = require('@prisma/client').PrismaClient

const prisma = global.prisma || new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.subscription.deleteMany({});
  await prisma.summary.deleteMany({});
  await prisma.episode.deleteMany({});
  await prisma.publication.deleteMany({});
  await prisma.user.deleteMany({});

  // Seed Users
  const users = await Promise.all([
    prisma.user.create({ data: { name: 'Alice', email: 'alice@example.com' } }),
    prisma.user.create({ data: { name: 'Bob', email: 'bob@example.com' } }),
    prisma.user.create({ data: { name: 'Charles', email: 'charles@example.com' } }),
  ]);

  // Seed Publications
  const thisAmericanLife = await prisma.publication.create({
    data: {
      title: 'This American Life',
      description: 'This American Life is a weekly public radio program and podcast. Each week we choose a theme and put together different kinds of stories on that theme.',
      rssFeedUrl: 'https://www.thisamericanlife.org/podcast/rss.xml',
    },
  });

  // Seed Episodes
  const episodes = await Promise.all([
    prisma.episode.create({
      data: {
        title: 'How I learned to shave',
        description: 'Things our dads taught us, whether they intended to or not',
        publicationId: thisAmericanLife.id,
      },
    }),
    prisma.episode.create({
      data: {
        title: 'What happens when you realize the people in charge dont have the answers',
        description: 'Guest Host Chana Joffe-Walt asks her kids when they first encountered adult fallibility',
        publicationId: thisAmericanLife.id,
      },
    }),
  ]);

  // Seed Summaries
  await prisma.summary.create({
    data: {
      content: 'Ira talks about the time his dad taught him to shave, and how unusual that was.',
      episodeId: episodes[0].id, // Assuming first episode
    },
  });

  // Seed Subscriptions
  await prisma.subscription.create({
    data: {
      userId: users[0].id, // Assuming Alice
      publicationId: thisAmericanLife.id,
    },
  });
}

main().catch(e => {
    console.error(e)
    process.exit(1)
}).finally(async () => {
    await prisma.$disconnect()
})