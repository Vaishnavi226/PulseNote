import { PrismaClient, Role, ArticleStatus, ChallengeType, ModerationStatus, VoteType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting PulseNote Database Seeding...');

  // 1. Seed Categories
  const categoriesData = [
    {
      name: 'AI',
      slug: 'ai',
      description: 'Artificial Intelligence, Large Language Models, Neural Networks, and Machine Learning.',
    },
    {
      name: 'Development',
      slug: 'development',
      description: 'Software engineering practices, architecture, clean code, and developer tooling.',
    },
    {
      name: 'Web Development',
      slug: 'web-development',
      description: 'Modern web development, React, frontend frameworks, performance, and UI engineering.',
    },
    {
      name: 'Startups',
      slug: 'startups',
      description: 'Tech entrepreneurship, product strategy, venture capital, and building software companies.',
    },
    {
      name: 'Cybersecurity',
      slug: 'cybersecurity',
      description: 'Application security, threat modeling, AI vulnerability management, and infrastructure protection.',
    },
    {
      name: 'Design',
      slug: 'design',
      description: 'Product design, design systems, UX research, typography, and visual ergonomics.',
    },
    {
      name: 'Tech Careers',
      slug: 'tech-careers',
      description: 'Engineering career paths, interview strategies, remote work, and career progression.',
    },
    {
      name: 'Emerging Technology',
      slug: 'emerging-technology',
      description: 'Quantum computing, hardware innovations, spatial computing, and next-gen tech.',
    },
    {
      name: 'Digital Culture',
      slug: 'digital-culture',
      description: 'The intersection of tech, open-source communities, privacy, and digital society.',
    },
  ];

  console.log('📌 Seeding Categories...');
  for (const cat of categoriesData) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description },
      create: cat,
    });
  }
  console.log(`✅ ${categoriesData.length} categories seeded successfully.`);

  // 2. Seed Users
  console.log('👤 Seeding Users...');
  const salt = await bcrypt.genSalt(10);
  const defaultPassword = await bcrypt.hash('Password123!', salt);

  const author = await prisma.user.upsert({
    where: { email: 'author@pulsenote.dev' },
    update: {},
    create: {
      name: 'Alex Rivera',
      username: 'alexrivera',
      email: 'author@pulsenote.dev',
      passwordHash: defaultPassword,
      role: Role.AUTHOR,
      title: 'Principal Software Architect & Tech Writer',
      bio: 'Writing about modern web architectures, AI agents, and software craftsmanship.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    },
  });

  const member = await prisma.user.upsert({
    where: { email: 'member@pulsenote.dev' },
    update: {},
    create: {
      name: 'Sarah Chen',
      username: 'sarahchen',
      email: 'member@pulsenote.dev',
      passwordHash: defaultPassword,
      role: Role.USER,
      title: 'Senior Frontend Engineer',
      bio: 'Enthusiastic about React 19, TypeScript, and structured discussion.',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@pulsenote.dev' },
    update: {},
    create: {
      name: 'PulseNote Admin',
      username: 'admin',
      email: 'admin@pulsenote.dev',
      passwordHash: defaultPassword,
      role: Role.ADMIN,
      title: 'Platform Lead & Moderator',
      bio: 'Ensuring high-quality technical discussions and editorial standards.',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    },
  });

  console.log(`✅ Users seeded: ${author.username}, ${member.username}, ${admin.username}`);

  // 3. Seed Articles
  console.log('📰 Seeding Sample Articles...');
  const aiCategory = await prisma.category.findUnique({ where: { slug: 'ai' } });
  const webDevCategory = await prisma.category.findUnique({ where: { slug: 'web-development' } });

  if (aiCategory && webDevCategory) {
    const article1 = await prisma.article.upsert({
      where: { slug: 'ai-coding-agents-are-changing-junior-developers' },
      update: {},
      create: {
        authorId: author.id,
        categoryId: aiCategory.id,
        title: 'AI Coding Agents Are Changing What Junior Developers Actually Do',
        slug: 'ai-coding-agents-are-changing-junior-developers',
        excerpt: 'Autonomous coding agents are shifting developer work from raw code generation to architecture, review, and verification.',
        content: `
# AI Coding Agents Are Changing What Junior Developers Actually Do

The role of a junior software developer has traditionally centered around writing boilerplate code, fixing minor bugs, and implementing small feature requests. However, with the rapid maturation of autonomous AI coding agents, this model is undergoing a fundamental transformation.

## The Shift from Writing to Reviewing

Rather than spending hours writing CRUD endpoints or writing CSS from scratch, junior developers are increasingly stepping into the role of **code reviewers and dynamic system integrators**. AI agents generate initial drafts, but human engineers must assess:

1. **Correctness**: Does the code handle boundary edge cases?
2. **Security**: Are input validation and authorization boundaries maintained?
3. **Architecture**: Does the solution conform to established repository design tokens and conventions?

## What Skills Matter Now?

Systems thinking, debugging, unit testing, and prompt engineering are taking center stage. The developers who thrive in 2026 will not be those who type the fastest, but those who ask the sharpest structural questions.
        `.trim(),
        quickTake: `• AI coding agents handle routine syntax and boilerplate, shifting junior developer focus to system architecture.
• Code review, testing, and security verification are becoming mandatory core skills for entry-level roles.
• Entry-level developers must focus on system design and boundary correctness rather than raw typing speed.`,
        coverImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
        status: ArticleStatus.PUBLISHED,
        pulseScore: 42,
        views: 180,
        readingTimeMin: 4,
        publishedAt: new Date(),
      },
    });

    const article2 = await prisma.article.upsert({
      where: { slug: 'is-react-still-the-right-choice-in-2026' },
      update: {},
      create: {
        authorId: author.id,
        categoryId: webDevCategory.id,
        title: 'Is React Still the Right Choice for New Projects in 2026?',
        slug: 'is-react-still-the-right-choice-in-2026',
        excerpt: 'With React 19, Server Components, and competing frameworks maturing, we evaluate whether React remains the default frontend choice.',
        content: `
# Is React Still the Right Choice for New Projects in 2026?

React has dominated web engineering for over a decade. But as modern applications demand instant initial render times, seamless state management, and minimal client JavaScript bundles, developers are re-evaluating their core stack choices.

## The Strengths of React 19

React 19 brings built-in async transitions, enhanced server components, and improved compilation. Combined with lightweight build tooling like Vite and TanStack Query, React offers an ecosystem that is virtually unmatched in ecosystem maturity.

## Where Alternatives Shine

Svelte 5 and SolidJS offer fine-grained reactivity without a virtual DOM overhead. For highly reactive single-page applications, these alternatives minimize CPU frame drops under complex rendering operations.

## The Verdict

For enterprise scale, team hiring, and component library support, React remains the safest high-leverage default.
        `.trim(),
        quickTake: `• React 19 stabilizes server components and async state handling across modern applications.
• Ecosystem depth and component libraries continue to make React the default choice for engineering teams.
• Fine-grained reactivity frameworks (Svelte, Solid) offer strong performance for niche high-frequency UI updates.`,
        coverImageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80',
        status: ArticleStatus.PUBLISHED,
        pulseScore: 28,
        views: 125,
        readingTimeMin: 5,
        publishedAt: new Date(),
      },
    });

    // 4. Seed Challenges & Votes
    console.log('💬 Seeding Sample Challenges...');
    const challenge1 = await prisma.challenge.create({
      data: {
        articleId: article1.id,
        authorId: member.id,
        type: ChallengeType.DISAGREE,
        quotedText: 'Junior developers are increasingly stepping into the role of code reviewers...',
        body: 'I disagree that junior developers should primarily act as code reviewers. Without deep hands-on experience writing code from scratch, a junior engineer lacks the intuition to detect subtle race conditions or architectural flaws in AI-generated output.',
        agreeCount: 5,
        disagreeCount: 1,
        status: ModerationStatus.VISIBLE,
      },
    });

    await prisma.challengeVote.create({
      data: {
        challengeId: challenge1.id,
        userId: author.id,
        voteType: VoteType.AGREE,
      },
    });

    console.log('✅ Articles and Challenges seeded successfully.');
  }

  console.log('🎉 Seeding completed cleanly!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
