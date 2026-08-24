import { PrismaClient, Role, ArticleStatus, ChallengeType, ModerationStatus, VoteType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Helper to generate deterministic dates relative to "now"
function daysAgo(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(12, 0, 0, 0);
  return d;
}

// ==================== SEED DATA ====================

const EXISTING_AUTHOR_EMAIL = 'author@pulsenote.dev';
const EXISTING_MEMBER_EMAIL = 'member@pulsenote.dev';
const EXISTING_ADMIN_EMAIL = 'admin@pulsenote.dev';

const TAGS = [
  { name: 'Artificial Intelligence', slug: 'artificial-intelligence' },
  { name: 'Machine Learning', slug: 'machine-learning' },
  { name: 'TypeScript', slug: 'typescript' },
  { name: 'React', slug: 'react' },
  { name: 'JavaScript', slug: 'javascript' },
  { name: 'Node.js', slug: 'nodejs' },
  { name: 'Python', slug: 'python' },
  { name: 'DevOps', slug: 'devops' },
  { name: 'Cloud Computing', slug: 'cloud-computing' },
  { name: 'Cybersecurity', slug: 'cybersecurity' },
  { name: 'API Design', slug: 'api-design' },
  { name: 'Software Architecture', slug: 'software-architecture' },
  { name: 'UI/UX Design', slug: 'ui-ux-design' },
  { name: 'Design Systems', slug: 'design-systems' },
  { name: 'Product Management', slug: 'product-management' },
  { name: 'Developer Experience', slug: 'developer-experience' },
  { name: 'Testing', slug: 'testing' },
  { name: 'Performance', slug: 'performance' },
  { name: 'Remote Work', slug: 'remote-work' },
  { name: 'Open Source', slug: 'open-source' },
  { name: 'Database', slug: 'database' },
  { name: 'Edge Computing', slug: 'edge-computing' },
  { name: 'Quantum Computing', slug: 'quantum-computing' },
  { name: 'Blockchain', slug: 'blockchain' },
];

// Articles: 16 new (14 published + 2 draft) → 18 total (16 published + 2 draft)
const NEW_ARTICLES = [
  // ── AI (1 new published) ──────────────────────────────────
  {
    categoryId: 'ai',
    title: 'Prompt Engineering Is Dead. Long Live Prompt Architecture.',
    slug: 'prompt-engineering-is-dead-long-live-prompt-architecture',
    excerpt: 'Structured prompt design has evolved from one-shot tricks to reproducible, testable engineering systems.',
    content: `# Prompt Engineering Is Dead. Long Live Prompt Architecture.\n\nThe era of crafting clever one-shot prompts and hoping for the best is over. In 2026, teams building production AI systems have moved far beyond the "magic spell" model of prompt engineering toward something far more rigorous: prompt architecture.\n\n## From Tricks to Systems\n\nEarly prompt engineering was a black art — Chain-of-Thought here, few-shot examples there, temperature tweaking as a dark ritual. But as LLMs power customer support, code generation, document analysis, and autonomous agents, the ad-hoc approach breaks down immediately.\n\nPrompt architecture treats prompts as **versioned, testable software components**. Each prompt has defined inputs, expected outputs, evaluation metrics, and regression test suites. Teams maintain prompt registries the way they maintain API schemas.\n\n## The Architecture Pattern\n\nA well-structured prompt system separates concerns:\n\n1. **System prompts** define role, boundaries, and safety constraints\n2. **Context injection** dynamically pulls relevant data from vector stores or APIs\n3. **Instruction templates** use structured formats (JSON schemas, XML tags) for reliable parsing\n4. **Output validators** verify the LLM response matches expected structure before downstream processing\n\n## Evaluation Is Everything\n\nThe real revolution isn't in how you write prompts — it's in how you measure them. Teams now maintain evaluation datasets with hundreds of test cases, tracking precision, recall, safety violations, and latency across prompt versions.\n\nPrompt architecture is software engineering applied to natural language interfaces. The practitioners who thrive are those who treat prompts as code: versioned, tested, and deployed with confidence.`,
    quickTake: '• Prompt engineering has evolved from ad-hoc tricks to structured, testable prompt architecture systems.\n• Production AI requires versioned prompts with evaluation metrics, regression tests, and safety constraints.\n• The real skill is evaluation design and system composition, not clever one-shot prompt crafting.',
    coverImageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
    status: 'PUBLISHED',
    readingTimeMin: 5,
    views: 312,
    pulseScore: 48,
    publishedAt: daysAgo(3),
    seoTitle: 'Prompt Architecture: The Evolution Beyond Prompt Engineering in 2026',
    seoDescription: 'How prompt engineering has evolved into structured prompt architecture with versioning, testing, and evaluation for production AI systems.',
    tags: ['artificial-intelligence', 'machine-learning', 'software-architecture'],
    faqs: [
      {
        question: 'Is prompt engineering still a useful skill if prompt architecture is the future?',
        answer: 'Yes, but the skill set is shifting. Understanding how to craft effective instructions remains essential, but the focus moves from isolated one-shot tricks to designing repeatable, testable prompt systems. Teams that treat prompts as versioned software components — with input/output contracts, evaluation metrics, and regression tests — will outperform those still relying on ad-hoc prompt crafting.',
      },
      {
        question: 'What tools do teams actually use for prompt versioning and evaluation?',
        answer: 'Most production teams use a combination of prompt registries (often just versioned template files in Git), evaluation frameworks like promptfoo or Langsmith, and CI pipelines that run test suites against prompt changes. The key is treating prompts like any other code artifact: reviewed, tested, and deployed through established workflows.',
      },
      {
        question: 'How do you measure prompt quality systematically?',
        answer: 'Define evaluation metrics specific to your use case: precision and recall for extraction tasks, safety violation rates for content generation, latency for real-time applications, and human preference scores for open-ended generation. Maintain a regression test dataset with hundreds of cases and track these metrics across prompt versions over time.',
      },
    ],
  },
  // ── DEVELOPMENT (2 new) ──────────────────────────────────
  {
    categoryId: 'development',
    title: 'Why Every Senior Developer Should Write Tests First',
    slug: 'why-every-senior-developer-should-write-tests-first',
    excerpt: 'Test-driven development isn\'t about catching bugs. It\'s about thinking clearly before you code.',
    content: `# Why Every Senior Developer Should Write Tests First\n\nThere's a persistent myth that TDD is a junior practice — something you graduate from once you're "good enough" to just write code. In reality, the opposite is true: the more experienced you are, the more dangerous untested code becomes, because you write it faster and with more confidence in your incorrect assumptions.\n\n## The Design Argument\n\nWriting a test before code forces you to think about the interface before the implementation. You must decide: what does this function accept? What does it return? What are the edge cases? These questions, answered before a single line of implementation, produce cleaner, more intentional APIs.\n\n## The Confidence Argument\n\nSenior developers ship faster with TDD, not slower. The initial investment in test writing pays compounding returns as you refactor, add features, and hand off code. Without tests, every change is a leap of faith. With tests, every change is a verified step.\n\n## The Refactoring Argument\n\nThe strongest case for TDD is refactoring. You can restructure implementation details aggressively when a comprehensive test suite catches behavioral regressions. Without that safety net, refactoring becomes fear-driven — small, conservative changes that leave architectural debt untouched.\n\n## The Humility Argument\n\nTDD is an exercise in intellectual humility. It forces you to confront edge cases your ego says don't exist. Boundary conditions, error paths, empty inputs — the tests surface assumptions you'd otherwise miss.\n\nWrite tests first. Ship with confidence.`,
    quickTake: '• TDD is not a junior practice — it becomes more valuable as code complexity and developer experience increase.\n• Writing tests first forces clean interface design before implementation details cloud judgment.\n• The real payoff is confident refactoring: test suites enable aggressive structural improvements.',
    coverImageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    status: 'PUBLISHED',
    readingTimeMin: 4,
    views: 198,
    pulseScore: 31,
    publishedAt: daysAgo(7),
    seoTitle: 'Why Senior Developers Should Practice Test-Driven Development',
    seoDescription: 'The case for TDD at senior level: design clarity, refactoring confidence, and intellectual humility in software engineering.',
    tags: ['testing', 'software-architecture', 'developer-experience'],
  },
  {
    categoryId: 'development',
    title: 'TypeScript 6 Changes Everything About Type Safety',
    slug: 'typescript-6-changes-everything-about-type-safety',
    excerpt: 'The next major TypeScript release introduces patterns that make previously impossible type safety trivial.',
    content: `# TypeScript 6 Changes Everything About Type Safety\n\nTypeScript has been steadily closing the gap between "types that document" and "types that guarantee." With the upcoming TypeScript 6 release, that gap is nearly gone.\n\n## Pattern Matching in Types\n\nTypeScript 6 introduces native pattern matching syntax that replaces verbose conditional types with expressive, readable type transformations. Where you once needed recursive conditional types and template literal gymnastics, you can now express complex type logic in a few clean lines.\n\n## Effect Tracking\n\nThe most anticipated feature is optional effect tracking. Functions can declare their side effects in the type system, enabling the compiler to warn when impure functions are called in contexts that expect purity. This bridges the gap between TypeScript and languages like Kotlin and Swift that have been experimenting with effect systems.\n\n## Branded Types Made First-Class\n\nBranded types — the pattern of distinguishing structs with identical shapes — become a first-class language feature. No more intersection hacks or unique symbol tricks. The语法 is native, readable, and composable.\n\n## The Practical Impact\n\nThese features collectively mean TypeScript can now enforce architectural constraints at compile time that previously required runtime checks, custom lint rules, or code review discipline. The type system becomes a true specification language.\n\nTypeScript 6 doesn't just add features — it changes what you can prove about your code at compile time.`,
    quickTake: '• TypeScript 6 introduces pattern matching, effect tracking, and first-class branded types.\n• These features enable compile-time enforcement of architectural constraints previously requiring runtime checks.\n• The type system evolves from documentation to provable code specification.',
    coverImageUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&w=1200&q=80',
    status: 'PUBLISHED',
    readingTimeMin: 4,
    views: 290,
    pulseScore: 44,
    publishedAt: daysAgo(5),
    seoTitle: 'TypeScript 6 Features: Pattern Matching, Effect Tracking, Branded Types',
    seoDescription: 'A deep look at TypeScript 6 features that transform type safety: pattern matching, effect tracking, and first-class branded types.',
    tags: ['typescript', 'javascript', 'developer-experience'],
    faqs: [
      {
        question: 'When will TypeScript 6 be available for production use?',
        answer: 'TypeScript 6 is currently in beta. The final release timeline depends on the TypeScript team\'s release cycle, but based on past patterns, a stable release is expected within the next few months. Teams can start experimenting with beta releases to evaluate the new features and plan migration strategies.',
      },
      {
        question: 'Will TypeScript 6 break existing codebases?',
        answer: 'TypeScript has a strong commitment to backward compatibility. The new features — pattern matching, effect tracking, and branded types — are additive. Existing code will continue to compile without changes. However, teams using workarounds for branded types or complex conditional types may want to refactor to use the new native syntax once they adopt TypeScript 6.',
      },
      {
        question: 'Is effect tracking mandatory in TypeScript 6?',
        answer: 'No, effect tracking is optional. It\'s designed as an opt-in feature for teams that want to enforce purity constraints at compile time. You can adopt it incrementally — start with new modules or critical paths where purity guarantees matter most, and expand coverage over time.',
      },
    ],
  },
  // ── WEB DEVELOPMENT (2 new) ──────────────────────────────
  {
    categoryId: 'web-development',
    title: 'Server Components Are Not the End of Client-Side React',
    slug: 'server-components-are-not-end-of-client-side-react',
    excerpt: 'React Server Components complement client-side rendering rather than replacing it. Here\'s how to think about it.',
    content: `# Server Components Are Not the End of Client-Side React\n\nThe narrative around React Server Components often suggests a zero-sum replacement: server-side rendering replaces client-side interactivity. This framing is wrong, and it leads teams to make poor architectural decisions.\n\n## The Mental Model Shift\n\nServer Components aren't a replacement for client components — they're an additional layer. The mental model is:\n\n1. **Server Components** handle data fetching, content rendering, and static layout composition with zero client-side JavaScript cost\n2. **Client Components** handle interactivity, state management, and browser APIs\n3. **The boundary** between them is explicit and intentional\n\n## Where Each excels\n\nUse Server Components for:\n- Article content, product listings, blog posts — anything read-heavy\n- Data transformations that don't need user interaction\n- Reducing client bundle size for performance-critical routes\n\nUse Client Components for:\n- Forms, modals, drag-and-drop interfaces\n- Real-time updates, animations, and transitions\n- Any state that changes based on user interaction\n\n## The Composition Pattern\n\nThe real power is composition: Server Components can import and render Client Components, passing server-fetched data as props. This eliminates the waterfall problem where client components must sequentially fetch data after mounting.\n\nServer Components don't end client-side React. They give it a powerful server-side foundation.`,
    quickTake: '• React Server Components are an additional rendering layer, not a replacement for client-side interactivity.\n• Server Components excel at content rendering and data fetching; Client Components handle interactivity.\n• The composition pattern eliminates data-fetching waterfalls by passing server data as props to client components.',
    coverImageUrl: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&w=1200&q=80',
    status: 'PUBLISHED',
    readingTimeMin: 5,
    views: 215,
    pulseScore: 35,
    publishedAt: daysAgo(10),
    seoTitle: 'React Server Components vs Client Components: When to Use Each',
    seoDescription: 'Understanding the mental model for React Server Components and Client Components — when each excels and how they compose together.',
    tags: ['react', 'javascript', 'performance'],
    faqs: [
      {
        question: 'Do I need to rewrite my existing React app to use Server Components?',
        answer: 'No. Server Components are an additive feature, not a replacement. You can adopt them incrementally — start with new pages or components that would benefit from zero client-side JavaScript cost, like article content or product listings. Existing client components continue to work exactly as before.',
      },
      {
        question: 'Can Server Components fetch data directly without useEffect?',
        answer: 'Yes, that\'s one of their primary advantages. Server Components can call databases, APIs, or file systems directly during rendering. This eliminates the client-side waterfall pattern where components mount, then fetch, then render — reducing both latency and client JavaScript.',
      },
      {
        question: 'What happens when a Server Component needs interactivity?',
        answer: 'Server Components cannot use hooks like useState or useEffect. When you need interactivity, you create a separate Client Component (marked with "use client") and import it into your Server Component. The Server Component can pass server-fetched data as props to the Client Component, combining the benefits of both.',
      },
    ],
  },
  {
    categoryId: 'web-development',
    title: 'Building Accessible Web Applications in 2026',
    slug: 'building-accessible-web-applications-in-2026',
    excerpt: 'Accessibility is not a feature checkbox. It\'s a fundamental quality metric that benefits every user.',
    content: `# Building Accessible Web Applications in 2026\n\nWeb accessibility has moved from a compliance checkbox to a core engineering quality metric. Modern tools make it easier than ever, but the fundamental challenge remains: accessibility requires intentional design from the start, not retrofitted ARIA attributes.\n\n## Semantic HTML First\n\nThe most impactful accessibility decision is using correct HTML elements. A \`<button>\` is inherently focusable, keyboard-operable, and screen-reader-announced. A \`<div onClick>\` is none of these without extensive ARIA work. Start with semantics.\n\n## The Testing Gap\n\nAutomated accessibility testing catches roughly 30% of real-world issues.axe-core and Lighthouse can find missing alt text and color contrast failures, but they cannot verify that a modal trap is implemented correctly or that focus returns to the triggering element after dismissal.\n\nManual testing with keyboard navigation and screen readers remains essential. Budget time for it.\n\n## Design System Integration\n\nThe highest-leverage accessibility investment is building accessibility into your design system. When component primitives — buttons, inputs, modals, navigation — are accessible by default, application developers get accessibility for free.\n\n## The Business Case\n\nAccessible applications rank higher in search engines, work better on mobile devices, and are usable by the 15% of the global population with disabilities. Accessibility is good engineering and good business.`,
    quickTake: '• Semantic HTML provides 80% of accessibility for 0% extra effort — use native elements before reaching for ARIA.\n• Automated testing catches only ~30% of accessibility issues; manual keyboard and screen reader testing is essential.\n• The highest-leverage investment is baking accessibility into design system components so app developers inherit it.',
    coverImageUrl: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=1200&q=80',
    status: 'PUBLISHED',
    readingTimeMin: 5,
    views: 178,
    pulseScore: 26,
    publishedAt: daysAgo(14),
    seoTitle: 'Web Accessibility in 2026: Semantic HTML, Testing, and Design Systems',
    seoDescription: 'Practical guide to building accessible web applications: semantic HTML, testing strategies, and design system integration.',
    tags: ['react', 'ui-ux-design', 'design-systems'],
  },
  // ── STARTUPS (2 new) ─────────────────────────────────────
  {
    categoryId: 'startups',
    title: 'What YC Actually Teaches That MBA Programs Don\'t',
    slug: 'what-yc-actually-teaches-that-mba-programs-dont',
    excerpt: 'The real YC curriculum isn\'t about ideas or funding — it\'s about a radically different approach to building companies.',
    content: `# What YC Actually Teaches That MBA Programs Don't\n\nThe visible output of YC is Demo Day, funding rounds, and billion-dollar exits. But the actual curriculum — what founders learn during the three-month batch — is fundamentally different from what business schools teach.\n\n## Talk to Users, Not Market Researchers\n\nMBA programs teach market analysis, competitive positioning, and financial modeling. YC teaches founders to talk to five potential users today, understand their specific pain points, and build what they actually need. The granularity is at the individual level, not the market level.\n\n## Ship, Then Perfect\n\nBusiness school teaches planning, analysis, and risk assessment before execution. YC inverts this: ship the minimum thing today, get it in front of users tomorrow, and iterate based on real feedback. The bias is toward action over analysis.\n\n## Growth as the Primary Metric\n\nRevenue, margins, and unit economics matter eventually. But YC teaches that for early-stage startups, the only metric that matters is week-over-week growth. If users are signing up and coming back, the business model will emerge. If they're not, no amount of financial engineering fixes the problem.\n\n## The Network Effect\n\nThe most valuable YC asset isn't the curriculum — it's the network. Former founders helping current ones with introductions, advice, and emotional support during the inevitable crisis moments.\n\nYC teaches startup-specific survival skills that no general business education provides.`,
    quickTake: '• YC\'s core curriculum is user-level problem discovery, not market-level analysis or financial modeling.\n• The bias is radically toward shipping and iterating over planning and analyzing.\n• Week-over-week growth is the primary early metric; business models emerge from traction, not spreadsheets.',
    coverImageUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=80',
    status: 'PUBLISHED',
    readingTimeMin: 5,
    views: 245,
    pulseScore: 38,
    publishedAt: daysAgo(8),
    seoTitle: 'What Y Combinator Actually Teaches Founders vs MBA Programs',
    seoDescription: 'The real YC curriculum: user-level discovery, rapid shipping, growth metrics, and the founder network that MBA programs cannot replicate.',
    tags: ['product-management', 'developer-experience', 'open-source'],
  },
  {
    categoryId: 'startups',
    title: 'Remote Work Killed the Office. Here\'s What Replaced It.',
    slug: 'remote-work-killed-office-heres-what-replaced-it',
    excerpt: 'The post-pandemic distributed work model isn\'t just "work from home" — it\'s a fundamentally different organizational architecture.',
    content: `# Remote Work Killed the Office. Here's What Replaced It.\n\nFive years after the pandemic forced distributed work, the conversation has shifted from "when are we going back to the office" to "how do we build organizations that are distributed by default."\n\n## The Async-First Organization\n\nThe biggest structural change isn't location — it's time. Async-first organizations don't schedule meetings to discuss documents; they write documents to avoid meetings. Decisions are recorded in writing, discussions happen in threads, and synchronous time is reserved for genuine collaboration.\n\n## The Tooling Evolution\n\nThe first wave of remote work tools replicated office experiences (Zoom for meetings, Slack for hallway chat). The second wave replaced them with purpose-built async tools: Loom for video updates, Notion for shared docs, Linear for project tracking.\n\n## The Culture Shift\n\nThe hardest part isn't tools or processes — it's trust. Managers who measured presence must learn to measure outcomes. Teams who bonded over lunch must find new ways to build social connection. The organizations that figured this out are shipping faster with lower burnout.\n\n## The Hybrid Trap\n\nMost organizations that tried "hybrid" (some days in office, some remote) discovered it's the worst of both worlds: you get the coordination cost of remote work plus the attendance requirement of office work. Fully distributed or fully in-office are both better than hybrid.\n\nThe future of work isn't a place. It's a set of practices.`,
    quickTake: '• The real shift is from synchronous-presence to async-first organizational design, not just location changes.\n• The second wave of remote tools replaced office replication with purpose-built async collaboration.\n• Most hybrid models fail because they combine the worst costs of both remote and in-office work.',
    coverImageUrl: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&w=1200&q=80',
    status: 'PUBLISHED',
    readingTimeMin: 5,
    views: 195,
    pulseScore: 29,
    publishedAt: daysAgo(12),
    seoTitle: 'The Post-Remote Work Organization: Async-First Culture and Distributed Teams',
    seoDescription: 'How distributed work evolved beyond "work from home" into async-first organizational architecture with purpose-built tooling.',
    tags: ['remote-work', 'product-management', 'developer-experience'],
  },
  // ── CYBERSECURITY (2 new) ────────────────────────────────
  {
    categoryId: 'cybersecurity',
    title: 'Zero Trust Isn\'t a Product. It\'s a Permission Architecture.',
    slug: 'zero-trust-isnt-a-product-its-a-permission-architecture',
    excerpt: 'Most zero trust implementations are just VPN replacements. True zero trust redesigns how every request is authorized.',
    content: `# Zero Trust Isn't a Product. It's a Permission Architecture.\n\nEvery major security vendor now sells a "zero trust" product. Most of these products are rebranded VPNs with slightly different authentication flows. True zero trust is an architectural principle, not something you buy.\n\n## The Core Principle\n\nZero trust means: **never trust, always verify**. Every request — from any user, any device, any network location — must prove its identity and authorization. There is no "inside" the network that gets automatic trust.\n\n## The Implementation Layers\n\nA genuine zero trust architecture operates at multiple layers:\n\n1. **Identity verification** — every user and device is authenticated for every access request\n2. **Least-privilege access** — permissions are granted per-resource, not per-network\n3. **Micro-segmentation** — the network is divided into small, isolated zones\n4. **Continuous monitoring** — access is continuously evaluated, not just checked at login\n5. **Encryption everywhere** — data is encrypted in transit and at rest, regardless of network location\n\n## The Common Failure\n\nMost organizations implement zero trust at the perimeter (better authentication at the door) without implementing it internally (every service still trusts every other service). This creates a hard shell with a soft center.\n\n## The Real Work\n\nThe hardest part of zero trust isn't technology — it's auditing every permission, every service dependency, and every data flow in your organization. Most teams discover they have far more access than they thought.\n\nZero trust is a journey of continuous improvement, not a product deployment.`,
    quickTake: '• True zero trust is an architectural principle — never trust, always verify — not a product you purchase.\n• Most implementations only harden the perimeter without addressing internal service-to-service trust.\n• The hardest work is auditing every permission and data flow; most teams discover excessive access they didn\'t know existed.',
    coverImageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f2?auto=format&fit=crop&w=1200&q=80',
    status: 'PUBLISHED',
    readingTimeMin: 6,
    views: 240,
    pulseScore: 39,
    publishedAt: daysAgo(6),
    seoTitle: 'Zero Trust Architecture: Beyond the Marketing Hype to Real Implementation',
    seoDescription: 'What zero trust actually means: identity verification, least privilege, micro-segmentation, and the hard work of auditing every permission.',
    tags: ['cybersecurity', 'cloud-computing', 'software-architecture'],
    faqs: [
      {
        question: 'How long does a typical zero trust implementation take?',
        answer: 'A meaningful zero trust implementation typically takes 12-18 months for a mid-size organization. The timeline depends on the complexity of existing infrastructure, the number of services and permissions to audit, and how much technical debt exists. Most teams start with identity verification at the perimeter and progressively tighten internal service-to-service trust.',
      },
      {
        question: 'Can we implement zero trust without replacing our existing VPN?',
        answer: 'Yes, and that\'s actually the recommended approach. Zero trust is an architectural principle, not a product swap. Start by implementing strong identity verification and least-privilege access alongside your existing VPN. Over time, as you build out micro-segmentation and continuous monitoring, the VPN becomes less critical for many access patterns.',
      },
      {
        question: 'What\'s the biggest mistake organizations make with zero trust?',
        answer: 'Implementing zero trust at the perimeter without addressing internal trust. Most teams harden the outer boundary — better authentication at the door — but still allow unrestricted service-to-service communication inside the network. This creates a hard shell with a soft center, which is exactly what attackers exploit once they breach the perimeter.',
      },
    ],
  },
  {
    categoryId: 'cybersecurity',
    title: 'Software Supply Chain Attacks Are the New Normal',
    slug: 'software-supply-chain-attacks-are-the-new-normal',
    excerpt: 'Your application is only as secure as every dependency, build tool, and CI pipeline in your supply chain.',
    content: `# Software Supply Chain Attacks Are the New Normal\n\nThe SolarWinds hack, the Log4Shell vulnerability, and the xz backdoor revealed a consistent truth: modern software is built on foundations we don't fully control or audit. Supply chain attacks target the tools and libraries developers trust implicitly.\n\n## The Attack Surface\n\nA typical application depends on hundreds of open-source packages, each maintained by small teams (or single individuals) with varying security practices. Attackers have realized that compromising one popular library gives them access to every application that depends on it.\n\n## The Categories\n\nSupply chain attacks fall into several categories:\n\n1. **Dependency confusion** — publishing malicious packages with names similar to internal packages\n2. **Maintainer compromise** — gaining control of a legitimate package account\n3. **Build system attacks** — injecting malicious code during the build or CI/CD process\n4. **Typosquatting** — publishing packages with names one character different from popular ones\n\n## The Defenses\n\n- **Lockfiles** — pin exact dependency versions and verify checksums\n- **SBOM (Software Bill of Materials)** — maintain a complete inventory of every dependency\n- **Sigstore** — verify cryptographic signatures on package releases\n- **Minimal dependencies** — every dependency is a trust decision; minimize them\n- **Audit tooling** — automated scanning for known vulnerabilities in your dependency tree\n\n## The Cultural Shift\n\nSecurity can't be the responsibility of a separate team. Every developer who runs \`npm install\` is making a security decision. The shift is toward making security visible and actionable at the developer level.`,
    quickTake: '• Supply chain attacks exploit trust in dependencies, build tools, and package registries — not your application code.\n• Lockfiles, SBOMs, Sigstore signatures, and minimal dependencies are practical defense layers.\n• Security must be a developer-level concern, not outsourced to a separate security team.',
    coverImageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    status: 'PUBLISHED',
    readingTimeMin: 5,
    views: 202,
    pulseScore: 33,
    publishedAt: daysAgo(9),
    seoTitle: 'Software Supply Chain Security: Attacks, Defenses, and Developer Practices',
    seoDescription: 'Understanding software supply chain attacks: dependency confusion, maintainer compromise, and practical defenses for modern development.',
    tags: ['cybersecurity', 'devops', 'open-source'],
  },
  // ── DESIGN (2 new) ──────────────────────────────────────
  {
    categoryId: 'design',
    title: 'The Typography System That Actually Scales',
    slug: 'the-typography-system-that-actually-scales',
    excerpt: 'Most design systems fail at typography. A modular scale with contextual overrides solves the scaling problem.',
    content: `# The Typography System That Actually Scales\n\nTypography is the backbone of digital design, yet most design systems treat it as an afterthought — a list of font sizes and line heights that breaks down the moment content needs to vary across contexts.\n\n## The Problem with Static Scales\n\nA fixed type scale (12, 14, 16, 20, 24, 32px) works fine for a landing page. But when you need to handle article headlines, card titles, navigation labels, form fields, and data tables — all with different density requirements — the static scale collapses.\n\n## The Modular Scale Approach\n\nA modular type scale is built on a ratio (1.25 for body text, 1.333 for display). Each step in the scale is the previous step multiplied by the ratio. This creates visual harmony while providing enough range for every context.\n\n## Contextual Layers\n\nThe real innovation is layering contextual overrides on top of the modular scale:\n\n1. **Base scale** — the modular ratio applied to body text sizes\n2. **Density variants** — compact (data-heavy), comfortable (reading), spacious (hero sections)\n3. **Responsive scaling** — size adjusts across breakpoints while maintaining the ratio\n4. **Content-aware sizing** — headlines scale based on character count to prevent orphaned words\n\n## The Implementation\n\nThe best implementations use CSS custom properties for the base values and component-level overrides for density. This keeps the system flexible without requiring developers to make sizing decisions for every component.\n\nGood typography systems are invisible — they just work at every scale.`,
    quickTake: '• Static type scales break down when content density varies across different UI contexts.\n• A modular scale based on mathematical ratios provides visual harmony with enough range for all contexts.\n• Layering density variants, responsive scaling, and content-aware sizing on top of the base scale creates a system that actually scales.',
    coverImageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
    status: 'PUBLISHED',
    readingTimeMin: 5,
    views: 176,
    pulseScore: 27,
    publishedAt: daysAgo(11),
    seoTitle: 'Modular Typography System: Scaling Type in Design Systems',
    seoDescription: 'Building a typography system that scales: modular ratios, density variants, responsive scaling, and content-aware sizing.',
    tags: ['design-systems', 'ui-ux-design', 'css'],
  },
  {
    categoryId: 'design',
    title: 'Dark Mode Design Is More Than Inverting Colors',
    slug: 'dark-mode-design-is-more-than-inverting-colors',
    excerpt: 'Proper dark mode requires rethinking contrast, elevation, color saturation, and visual hierarchy — not just swapping black and white.',
    content: `# Dark Mode Design Is More Than Inverting Colors\n\nThe most common dark mode implementation is trivial: swap background light for dark and text dark for light. The result looks functional but feels wrong. Proper dark mode requires rethinking fundamental design principles.\n\n## The Elevation Problem\n\nIn light mode, we signal elevation with shadows. In dark mode, shadows are invisible against dark backgrounds. The solution is **luminance-based elevation**: lighter surfaces appear closer, darker surfaces appear farther. Material Design's dark theme surface system exemplifies this.\n\n## The Contrast Challenge\n\nPure white (#FFF) text on pure black (#000) background creates 21:1 contrast — the maximum. This is actually too high for extended reading. The optimal dark mode text contrast is around 15:1, achieved with slightly off-white text on slightly off-black backgrounds.\n\n## Color Saturation Shift\n\nColors that work in light mode often appear oversaturated against dark backgrounds. The fix is reducing saturation and increasing lightness for dark mode variants. A bright blue button in light mode becomes a softer, desaturated blue in dark mode.\n\n## The Hierarchy Reset\n\nIn light mode, primary content is typically black on white. In dark mode, the hierarchy often inverts: headers become brighter, body text becomes dimmer, and secondary information recedes further. The visual weight distribution shifts.\n\nGood dark mode isn't a color theme — it's a parallel design system that respects how human vision works in low-light environments.`,
    quickTake: '• Dark mode requires luminance-based elevation (lighter = closer) since shadows are invisible on dark backgrounds.\n• Optimal dark mode contrast is ~15:1, not the maximum 21:1 — pure white on pure black causes eye strain.\n• Colors need desaturation and lightness adjustments for dark backgrounds; the visual hierarchy often inverts.',
    coverImageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    status: 'PUBLISHED',
    readingTimeMin: 4,
    views: 234,
    pulseScore: 36,
    publishedAt: daysAgo(4),
    seoTitle: 'Dark Mode Design Principles: Beyond Color Inversion',
    seoDescription: 'Proper dark mode design: luminance-based elevation, optimal contrast ratios, color desaturation, and hierarchy resets for low-light environments.',
    tags: ['ui-ux-design', 'design-systems', 'css'],
  },
  // ── TECH CAREERS (2 new) ────────────────────────────────
  {
    categoryId: 'tech-careers',
    title: 'The Engineering Manager\'s Dilemma: Technical Depth vs. Team Breadth',
    slug: 'engineering-managers-dilemma-technical-depth-vs-team-breadth',
    excerpt: 'Moving into management means choosing between staying technically deep and scaling your impact across people.',
    content: `# The Engineering Manager's Dilemma: Technical Depth vs. Team Breadth\n\nEvery senior engineer who moves into management faces the same crisis: the technical skills that got you here are atrophying, but the management skills that will define your career need constant investment. You can't do both at the same depth.\n\n## The 18-Month Wall\n\nMost new engineering managers hit a wall around 18 months. The initial excitement of hiring, mentoring, and unblocking teams fades. Meanwhile, the codebase has evolved, new frameworks have emerged, and you realize you can no longer debug the tricky production issues you used to own.\n\n## The Three Paths\n\nEngineers at this crossroads typically take one of three paths:\n\n1. **Full management** — embrace the people side, delegate technical decisions, focus on team health, hiring, and strategy\n2. **Technical leadership** — stay on the IC track as Staff+ engineer, avoid management entirely\n3. **Hybrid (the hard path)** — maintain enough technical depth to make informed architectural decisions while building management skills\n\n## The Hybrid Approach\n\nThe hybrid path requires deliberate scheduling: code review time, architecture review participation, and regular pair programming sessions. It's unsustainable for many — and that's okay. Not every manager needs to stay technical.\n\n## What Actually Matters\n\nThe best engineering managers aren't the ones who can still write code fastest. They're the ones who can identify technical risks early, hire engineers who are better than themselves, and create environments where technical excellence thrives.\n\nImpact scales through people, not through your own keyboard.`,
    quickTake: '• The 18-month wall is real: new managers lose technical currency while management skills need investment.\n• Three paths exist: full management, pure IC/Staff+, or a deliberate hybrid that requires scheduled technical engagement.\n• The best engineering managers scale impact through hiring, team health, and technical risk identification — not their own code output.',
    coverImageUrl: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80',
    status: 'PUBLISHED',
    readingTimeMin: 5,
    views: 245,
    pulseScore: 41,
    publishedAt: daysAgo(2),
    seoTitle: 'Engineering Manager Career Path: Technical Depth vs Management Breadth',
    seoDescription: 'The engineering manager dilemma: navigating the choice between technical depth and people management, and the hybrid path that tries both.',
    tags: ['remote-work', 'developer-experience', 'product-management'],
  },
  {
    categoryId: 'tech-careers',
    title: 'Technical Interviews Are Broken. Here\'s How to Survive Them.',
    slug: 'technical-interviews-are-broken-heres-how-to-survive-them',
    excerpt: 'The gap between what interviews measure and what the job requires has never been wider. Here\'s the pragmatic approach.',
    content: `# Technical Interviews Are Broken. Here's How to Survive Them.\n\nThe engineering interview process measures a narrow slice of what makes a good engineer. Algorithm puzzles don't predict system design ability. Whiteboard coding doesn't test collaboration. Culture fit questions often measure "culture mimicry" instead of actual value alignment.\n\n## What Interviews Actually Measure\n\nTechnical interviews primarily measure:\n- Pattern recognition under time pressure\n- Familiarity with common algorithm paradigms\n- Communication of thought process (when done well)\n- Performance anxiety management\n\nNone of these are the primary skills needed for most engineering roles.\n\n## The Pragmatic Approach\n\nUnderstanding that the game is imperfect, the pragmatic approach is:\n\n1. **Study the game** — practice LeetCode-style problems not because they're valuable, but because they're the filter\n2. **Signal your real skills** — use behavioral rounds and portfolio reviews to demonstrate what algorithms can't measure\n3. **Interview the company** — the best candidates evaluate whether the company's interview process reflects how they actually build software\n\n## The Better Alternative\n\nCompanies like Basecamp, Linear, and GitLab have experimented with work trials, take-home projects, and architecture discussions as alternatives. These take more effort to evaluate but measure actual job skills.\n\nThe interview process is a tax every engineer pays. Understanding it as a game — and playing it strategically — is more productive than expecting it to be fair.`,
    quickTake: '• Technical interviews measure pattern recognition and anxiety management, not the primary skills needed for most engineering roles.\n• The pragmatic approach: study the game for the filter, signal real skills through behavioral rounds and portfolios.\n• Work trials and take-home projects measure actual job skills better but require more evaluation effort from companies.',
    coverImageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80',
    status: 'PUBLISHED',
    readingTimeMin: 5,
    views: 310,
    pulseScore: 46,
    publishedAt: daysAgo(1),
    seoTitle: 'How to Survive Technical Interviews: A Pragmatic Engineer\'s Guide',
    seoDescription: 'Understanding what technical interviews actually measure and the pragmatic approach to passing them while signaling your real engineering skills.',
    tags: ['developer-experience', 'software-architecture', 'testing'],
    faqs: [
      {
        question: 'How many LeetCode problems should I solve before interviewing?',
        answer: 'Quality over quantity. Focus on 80-100 problems across the core categories: arrays, strings, trees, graphs, dynamic programming, and system design. The goal isn\'t memorization — it\'s pattern recognition. Solve each problem, then solve similar variations until the pattern clicks. Most candidates who solve 100+ problems indiscriminately waste time without building transferable intuition.',
      },
      {
        question: 'Should I negotiate a job offer if the interview process felt disrespectful?',
        answer: 'The interview process is a strong signal of how the company operates. If the process felt disorganized, disrespectful, or无视 of your time, negotiate with clear expectations and strong boundaries — but also seriously evaluate whether this is a company you want to join. A bad interview process often reflects deeper cultural issues.',
      },
      {
        question: 'What\'s the best way to prepare for system design interviews?',
        answer: 'Practice structured thinking: start with requirements clarification, define the high-level architecture, then drill into specific components. Study real-world systems (how Twitter handles timelines, how Netflix does CDN, how Uber handles surge pricing) not as trivia, but as design case studies. The ability to reason through trade-offs matters more than memorizing specific architectures.',
      },
    ],
  },
  // ── EMERGING TECH (2 new) ────────────────────────────────
  {
    categoryId: 'emerging-technology',
    title: 'Quantum Computing Reaches Its First Real-World Application',
    slug: 'quantum-computing-reaches-first-real-world-application',
    excerpt: 'After decades of promise, quantum computers are finding their niche in molecular simulation and optimization.',
    content: `# Quantum Computing Reaches Its First Real-World Application\n\nQuantum computing has been "five years away" for twenty years. But in 2026, the technology has finally found a genuine commercial niche: molecular simulation for drug discovery and materials science.\n\n## Why Molecular Simulation?\n\nClassical computers struggle with molecular simulation because the computational complexity grows exponentially with the number of quantum states. A molecule with 50 atoms has more possible configurations than there are atoms in the observable universe. Classical computers approximate. Quantum computers can simulate natively.\n\n## The Current State\n\nToday's quantum computers — primarily superconducting qubits from IBM and Google, plus trapped-ion systems from Quantinuum — can simulate molecules with up to 100 qubits reliably. Error correction is still limited, but for molecular simulation specifically, approximate answers are often sufficient.\n\n## The Commercial Impact\n\nPharmaceutical companies are using quantum-assisted molecular simulation to screen drug candidates faster. Instead of synthesizing thousands of compounds in a lab, researchers simulate quantum interactions to narrow the field to the most promising candidates. This doesn't replace wet-lab testing — it accelerates the initial screening phase.\n\n## The Honest Assessment\n\nQuantum computing won't replace classical computing for general-purpose tasks. It won't break encryption overnight. But for specific problems with inherent quantum complexity — molecular simulation, certain optimization problems, materials design — it's delivering real value for the first time.\n\nQuantum computing's first killer app is quiet, specialized, and genuinely useful.`,
    quickTake: '• Quantum computing has found its first commercial niche: molecular simulation for drug discovery and materials science.\n• Classical computers can\'t handle the exponential complexity of quantum states; quantum computers simulate them natively.\n• The technology won\'t replace classical computing but is delivering real value for specific quantum-complex problems.',
    coverImageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80',
    status: 'PUBLISHED',
    readingTimeMin: 5,
    views: 198,
    pulseScore: 32,
    publishedAt: daysAgo(13),
    seoTitle: 'Quantum Computing First Real-World Application: Molecular Simulation',
    seoDescription: 'How quantum computing finally found a commercial application in molecular simulation for drug discovery and materials science.',
    tags: ['quantum-computing', 'machine-learning', 'python'],
  },
  {
    categoryId: 'emerging-technology',
    title: 'Edge Computing Changes the Latency Equation for Every App',
    slug: 'edge-computing-changes-latency-equation-every-app',
    excerpt: 'Moving compute to the edge doesn\'t just reduce latency — it enables entirely new application architectures.',
    content: `# Edge Computing Changes the Latency Equation for Every App\n\nThe traditional model of client-server architecture is being inverted. Instead of every request traveling to a centralized data center, edge computing moves computation to servers physically closer to the user — often within the same city or region.\n\n## The Latency Math\n\nLight travels at approximately 300,000 km/s in fiber. A request from New York to a server in San Francisco takes roughly 40ms round-trip. From New York to a server in New Jersey, it takes 2ms. For real-time applications — gaming, collaboration tools, financial trading — that 38ms difference is the gap between responsive and sluggish.\n\n## The Architecture Shift\n\nEdge computing enables a new architecture pattern:\n\n1. **Static assets** served from edge CDN nodes (already common)\n2. **API logic** running at edge functions — authentication, data transformation, personalization\n3. **Database reads** from edge-replicated data stores\n4. **Real-time features** via WebSocket connections terminated at edge nodes\n\n## The Tradeoffs\n\nEdge computing introduces complexity: data consistency across edge nodes, cold start latency for edge functions, and the operational overhead of deploying to dozens of locations. It's not universally better — it's better for specific latency-sensitive use cases.\n\n## The Emerging Standard\n\nPlatforms like Cloudflare Workers, Vercel Edge Functions, and Deno Deploy are making edge deployment as simple as deploying to a single server. The infrastructure complexity is abstracted away.\n\nEdge computing doesn't just make existing apps faster. It enables apps that weren't possible before.`,
    quickTake: '• Edge computing inverts client-server architecture by moving computation physically closer to users.\n• The latency difference (40ms vs 2ms) is critical for real-time applications like gaming and collaboration.\n• Edge deployment platforms are abstracting infrastructure complexity, making edge computing accessible to standard applications.',
    coverImageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    status: 'PUBLISHED',
    readingTimeMin: 5,
    views: 167,
    pulseScore: 24,
    publishedAt: daysAgo(15),
    seoTitle: 'Edge Computing Architecture: Reducing Latency for Modern Applications',
    seoDescription: 'How edge computing changes application architecture: moving computation closer to users, the latency math, and emerging deployment platforms.',
    tags: ['edge-computing', 'cloud-computing', 'performance'],
  },
  // ── DIGITAL CULTURE (2 new) ─────────────────────────────
  {
    categoryId: 'digital-culture',
    title: 'Blockchain\'s Quiet Revolution in Digital Identity',
    slug: 'blockchains-quiet-revolution-in-digital-identity',
    excerpt: 'Forget cryptocurrency. The most impactful blockchain application may be self-sovereign digital identity.',
    content: `# Blockchain's Quiet Revolution in Digital Identity\n\nThe cryptocurrency hype has overshadowed blockchain's most practical application: self-sovereign digital identity. While speculation dominates headlines, a quieter revolution in how we prove who we are online is gaining real traction.\n\n## The Current Identity Problem\n\nToday, your digital identity is fragmented across dozens of services. Google, Facebook, Apple, and your employer each hold pieces. When you "log in with Google," you're not controlling your identity — you're renting access from a centralized provider who can revoke it.\n\n## Self-Sovereign Identity\n\nSelf-sovereign identity (SSI) flips this model. Using decentralized identifiers (DIDs) anchored on blockchain, you own your identity credentials. You can prove facts about yourself (age, employment, qualifications) without revealing unnecessary information, and no single provider can revoke your identity.\n\n## The Practical Use Cases\n\n- **Credential verification** — universities issue verifiable diplomas; employers verify without calling\n- **Age verification** — prove you're over 18 without revealing your birthdate\n- **Professional licensing** — doctors, lawyers, engineers prove credentials across jurisdictions\n- **Refugee identity** — displaced people maintain verifiable identity without government documents\n\n## The Adoption Path\n\nGovernment initiatives in Estonia, Singapore, and the EU are leading adoption. The EU's eIDAS 2.0 framework mandates digital identity wallets for all citizens by 2026.\n\nThe blockchain identity revolution is happening. It's just not loud about it.`,
    quickTake: '• Self-sovereign digital identity using blockchain lets individuals own and control their identity credentials.\n• The model eliminates dependence on centralized providers like Google or Facebook for identity verification.\n• Government initiatives in the EU, Estonia, and Singapore are leading real-world adoption of decentralized identity.',
    coverImageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=80',
    status: 'PUBLISHED',
    readingTimeMin: 5,
    views: 156,
    pulseScore: 22,
    publishedAt: daysAgo(16),
    seoTitle: 'Blockchain Digital Identity: Self-Sovereign Identity Beyond Cryptocurrency',
    seoDescription: 'How blockchain enables self-sovereign digital identity: practical use cases in credential verification, age proof, and government adoption.',
    tags: ['blockchain', 'cybersecurity', 'open-source'],
  },
  {
    categoryId: 'digital-culture',
    title: 'How Open Source Maintainers Actually Make Decisions',
    slug: 'how-open-source-maintainers-actually-make-decisions',
    excerpt: 'Benevolent dictator, lazy consensus, or committee? The real decision-making processes behind major open source projects.',
    content: `# How Open Source Maintainers Actually Make Decisions\n\nOpen source governance sounds dry until you realize it determines how the software that powers the internet gets built. The decision-making model of a project directly affects its velocity, inclusivity, and long-term sustainability.\n\n## The Models\n\nOpen source projects generally follow one of several governance models:\n\n1. **Benevolent Dictator for Life (BDFL)** — one person has final say (Linus Torvalds for Linux)\n2. **Core team with lazy consensus** — decisions pass unless someone objects (Rust, Python)\n3. **Foundation governance** — elected boards make strategic decisions (Apache, CNCF)\n4. **Corporate stewardship** — one company controls direction (React, Angular)\n\n## The Real Dynamics\n\nThe formal governance model often differs from the informal reality. In practice, most decisions are made by whoever shows up. Active maintainers have outsized influence simply because they're the ones reviewing PRs and triaging issues.\n\n## The Burnout Problem\n\nOpen source maintainer burnout is a systemic issue. The combination of endless feature requests, hostile issue reports, and uncompensated labor drives talented people away. Projects that distribute decision-making across a team handle this better than BDFL models.\n\n## The Sustainability Question\n\nThe hardest decisions aren't technical — they're about resource allocation. When a project needs funding, the governance model determines who controls the money and how it's spent. Projects that address this early tend to survive.\n\nOpen source governance is a microcosm of democratic systems — messy, human, and essential.`,
    quickTake: '• Open source governance models (BDFL, lazy consensus, foundation, corporate stewardship) directly affect project velocity and inclusivity.\n• Informal power dynamics often differ from formal governance — active maintainers have outsized influence through daily work.\n• Distributing decision-making across teams, not individuals, is the best defense against maintainer burnout.',
    coverImageUrl: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?auto=format&fit=crop&w=1200&q=80',
    status: 'PUBLISHED',
    readingTimeMin: 5,
    views: 143,
    pulseScore: 20,
    publishedAt: daysAgo(17),
    seoTitle: 'Open Source Governance: Decision-Making Models Behind Major Projects',
    seoDescription: 'How open source maintainers make decisions: BDFL, lazy consensus, foundation governance, and the real dynamics behind formal models.',
    tags: ['open-source', 'developer-experience', 'product-management'],
  },
  // ── DRAFTS (1 AI + 1 Startups) ──────────────────────────
  {
    categoryId: 'ai',
    title: 'RAG vs Fine-Tuning: When to Use Which Approach',
    slug: 'rag-vs-fine-tuning-when-to-use-which-approach',
    excerpt: 'Retrieval-augmented generation and fine-tuning solve different problems. Choosing wrong wastes months of engineering effort.',
    content: `# RAG vs Fine-Tuning: When to Use Which Approach\n\nThe two dominant approaches to customizing LLM behavior — Retrieval-Augmented Generation (RAG) and fine-tuning — are often presented as competing strategies. In reality, they solve different problems and are frequently complementary.\n\n## What RAG Does Well\n\nRAG excels when you need the model to reference specific, frequently changing information:\n- Document Q&A over a large corpus\n- Customer support with up-to-date product information\n- Code search across a large repository\n\nRAG keeps knowledge current without retraining. The retrieval step fetches relevant documents at query time, giving the LLM access to information beyond its training data.\n\n## What Fine-Tuning Does Well\n\nFine-tuning excels when you need to change how the model behaves:\n- Adopting a specific writing style or tone\n- Learning domain-specific terminology and conventions\n- Following complex formatting or output structure requirements\n\nFine-tuning bakes behavior into the model weights. The model "knows" the behavior without needing retrieval context.\n\n## The Complementary Pattern\n\nThe most effective production systems often combine both:\n\n1. Fine-tune the model for tone, style, and structural behavior\n2. Use RAG to provide current, domain-specific knowledge\n3. The fine-tuned model generates responses in the right style while RAG supplies factual grounding\n\n## The Decision Framework\n\nAsk: "Do I need the model to know something new, or behave differently?" Knowledge → RAG. Behavior → Fine-tuning. Both → combine them.\n\nNote: This article is a draft and not yet published.`,
    quickTake: '• RAG is for knowledge: providing the model with current, specific information it doesn\'t have in training data.\n• Fine-tuning is for behavior: changing how the model responds, its tone, style, and structural patterns.\n• The most effective production systems combine both: fine-tuned behavior with RAG-sourced knowledge.',
    coverImageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80',
    status: 'DRAFT',
    readingTimeMin: 6,
    views: 0,
    pulseScore: 0,
    publishedAt: null,
    seoTitle: 'RAG vs Fine-Tuning: When to Use Each LLM Customization Approach',
    seoDescription: 'Decision framework for choosing between RAG and fine-tuning: when each excels, when to combine them, and how to avoid wasting engineering effort.',
    tags: ['artificial-intelligence', 'machine-learning', 'software-architecture'],
  },
  {
    categoryId: 'startups',
    title: 'Why Most Developer Tools Fail to Reach $10M ARR',
    slug: 'why-most-developer-tools-fail-to-reach-10m-arr',
    excerpt: 'Developer tools face a unique growth ceiling: bottom-up adoption is easy, but enterprise expansion is brutally hard.',
    content: `# Why Most Developer Tools Fail to Reach $10M ARR\n\nDeveloper tools have a天然 growth path: individual developers adopt them freely, teams formalize usage, and the tool attempts to expand to enterprise contracts. Most developer tools stall between $2M and $5M ARR because the transition from individual to enterprise is a fundamentally different business.\n\n## The Adoption Funnel Problem\n\nDeveloper tools thrive on self-service adoption. Developers discover the tool, try it on a side project, bring it to their team, and potentially champion it company-wide. This funnel works brilliantly up to the team level.\n\n## The Enterprise Gap\n\nThe enterprise sales motion requires:\n- Procurement and legal review processes\n- SSO, SCIM, and audit logging compliance\n- Dedicated support and SLA guarantees\n- Budget justification for non-technical stakeholders\n- Integration with enterprise identity and security systems\n\nEach of these is a legitimate requirement that most developer tool startups haven't built.\n\n## The Pricing Trap\n\nMany developer tools price for individuals ($10-50/month per seat) and discover that enterprise customers expect volume discounts, annual contracts, and custom pricing. The transition from self-service pricing to enterprise pricing is a business model reinvention.\n\n## The Survival Playbook\n\nThe developer tools that cross $10M ARR typically:\n1. Build enterprise features proactively, not reactively\n2. Hire a dedicated enterprise sales team that speaks both business and technical\n3. Maintain a generous free tier to keep the adoption funnel healthy\n4. Price based on value delivered, not seats occupied\n\nNote: This article is a draft and not yet published.`,
    quickTake: '• Developer tools hit a growth ceiling at $2-5M ARR because the enterprise sales motion requires capabilities most startups haven\'t built.\n• Enterprise requirements (SSO, SCIM, procurement, SLAs) are legitimate blockers that need proactive investment.\n• The tools that cross $10M build enterprise features early, hire technical sales, and price on value delivered.',
    coverImageUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=80',
    status: 'DRAFT',
    readingTimeMin: 6,
    views: 0,
    pulseScore: 0,
    publishedAt: null,
    seoTitle: 'Why Developer Tools Struggle to Scale Past $10M ARR',
    seoDescription: 'The enterprise gap in developer tools: why bottom-up adoption stalls and what it takes to cross $10M ARR.',
    tags: ['product-management', 'developer-experience', 'open-source'],
  },
];

// Challenges data — 8 challenges distributed across articles
const CHALLENGES = [
  {
    articleSlug: 'prompt-engineering-is-dead-long-live-prompt-architecture',
    authorEmail: EXISTING_MEMBER_EMAIL,
    type: 'DISAGREE',
    quotedText: 'The era of crafting clever one-shot prompts and hoping for the best is over.',
    body: 'One-shot prompting is still incredibly effective for many use cases. Not every application needs production-grade prompt architecture. For rapid prototyping and exploration, the "craft a clever prompt" approach is faster and more creative.',
    agreeCount: 7,
    disagreeCount: 2,
  },
  {
    articleSlug: 'why-every-senior-developer-should-write-tests-first',
    authorEmail: EXISTING_MEMBER_EMAIL,
    type: 'AGREE',
    quotedText: 'Without tests, every change is a leap of faith.',
    body: 'Completely agree. I switched to TDD two years ago and my confidence in shipping has increased dramatically. The initial slowdown pays for itself within the first major refactor.',
    agreeCount: 12,
    disagreeCount: 1,
  },
  {
    articleSlug: 'is-react-still-the-right-choice-in-2026',
    authorEmail: EXISTING_ADMIN_EMAIL,
    type: 'ADD_CONTEXT',
    quotedText: 'For enterprise scale, team hiring, and component library support, React remains the safest high-leverage default.',
    body: 'Worth noting that Vue and Svelte have significantly improved their hiring pools in 2025-2026. The "React is the only option for hiring" argument is weakening, particularly in European markets where Vue adoption is much higher.',
    agreeCount: 8,
    disagreeCount: 3,
  },
  {
    articleSlug: 'zero-trust-isnt-a-product-its-a-permission-architecture',
    authorEmail: EXISTING_MEMBER_EMAIL,
    type: 'FACT_CHECK',
    quotedText: 'Light travels at approximately 300,000 km/s in fiber.',
    body: 'The speed of light in fiber optic cable is actually about 200,000 km/s (roughly 2/3 of the speed in vacuum) due to the refractive index of glass. This means the latency calculations in the article are slightly optimistic.',
    agreeCount: 5,
    disagreeCount: 0,
  },
  {
    articleSlug: 'what-yc-actually-teaches-that-mba-programs-dont',
    authorEmail: EXISTING_ADMIN_EMAIL,
    type: 'ADD_CONTEXT',
    quotedText: 'The most valuable YC asset isn\'t the curriculum — it\'s the network.',
    body: 'Important to note that the YC network advantage has been diluted somewhat by the growth of alternative founder communities like On Deck, South Park Commons, and various Discord-based groups. The network moat is real but not as strong as it was five years ago.',
    agreeCount: 9,
    disagreeCount: 2,
  },
  {
    articleSlug: 'technical-interviews-are-broken-heres-how-to-survive-them',
    authorEmail: EXISTING_ADMIN_EMAIL,
    type: 'DISAGREE',
    quotedText: 'The best candidates evaluate whether the company\'s interview process reflects how they actually build software.',
    body: 'In practice, candidates rarely have the leverage to evaluate a company\'s interview process — especially in a tight job market. This advice works for senior engineers at top companies but is unrealistic for most job seekers.',
    agreeCount: 11,
    disagreeCount: 4,
  },
  {
    articleSlug: 'how-open-source-maintainers-actually-make-decisions',
    authorEmail: EXISTING_MEMBER_EMAIL,
    type: 'PERSONAL_EXPERIENCE',
    quotedText: 'Open source maintainer burnout is a systemic issue.',
    body: 'As a maintainer of a moderately popular npm package (2k stars), I can confirm this. The expectation of instant responses, the volume of feature requests disguised as issues, and the guilt of saying no — it takes a real toll. I\'ve moved to a quarterly release cycle to protect my wellbeing.',
    agreeCount: 15,
    disagreeCount: 0,
  },
  {
    articleSlug: 'server-components-are-not-end-of-client-side-react',
    authorEmail: EXISTING_MEMBER_EMAIL,
    type: 'ADD_CONTEXT',
    quotedText: 'Server Components don\'t end client-side React. They give it a powerful server-side foundation.',
    body: 'The mental model section is excellent, but it\'s worth adding that the learning curve for Server Components is steep. Teams with deep client-side React muscle memory often struggle with the paradigm shift. The transition cost is non-trivial.',
    agreeCount: 6,
    disagreeCount: 1,
  },
];

// Comment data — 15 comments distributed across articles
const COMMENTS = [
  // Article 1 (prompt architecture)
  { articleSlug: 'prompt-engineering-is-dead-long-live-prompt-architecture', authorEmail: EXISTING_MEMBER_EMAIL, body: 'The evaluation framework concept is exactly what we needed at my company. We\'ve been treating prompts as config files when they should be treated as code.', parentCommentIndex: null },
  { articleSlug: 'prompt-engineering-is-dead-long-live-prompt-architecture', authorEmail: EXISTING_ADMIN_EMAIL, body: 'Prompt versioning with git has been a game changer for our team. Being able to diff prompt changes and roll back bad ones is something we took for granted.', parentCommentIndex: 0 },
  // Article 2 (TDD)
  { articleSlug: 'why-every-senior-developer-should-write-tests-first', authorEmail: EXISTING_ADMIN_EMAIL, body: 'The humility argument is underrated. TDD forces you to confront assumptions you didn\'t know you had.', parentCommentIndex: null },
  // Article 3 (TypeScript)
  { articleSlug: 'typescript-6-changes-everything-about-type-safety', authorEmail: EXISTING_MEMBER_EMAIL, body: 'The effect tracking feature alone would save our team hours of code review time. Currently we rely on naming conventions to signal impure functions.', parentCommentIndex: null },
  // Article 4 (Server Components)
  { articleSlug: 'server-components-are-not-end-of-client-side-react', authorEmail: EXISTING_ADMIN_EMAIL, body: 'Great mental model. I\'d add that the boundary between server and client components is where most performance bugs hide — accidental client components that should be server components.', parentCommentIndex: null },
  // Article 5 (Accessible web apps)
  { articleSlug: 'building-accessible-web-applications-in-2026', authorEmail: EXISTING_MEMBER_EMAIL, body: 'The 30% automated testing stat is sobering. We\'ve been relying entirely on axe-core and calling it accessible. Time to budget for manual testing.', parentCommentIndex: null },
  // Article 6 (YC vs MBA)
  { articleSlug: 'what-yc-actually-teaches-that-mba-programs-dont', authorEmail: EXISTING_MEMBER_EMAIL, body: 'The "talk to five users today" principle changed how I approach product work. The granularity of individual conversations beats market surveys every time.', parentCommentIndex: null },
  // Article 7 (Remote work)
  { articleSlug: 'remote-work-killed-office-heres-what-replaced-it', authorEmail: EXISTING_ADMIN_EMAIL, body: 'The hybrid trap section is spot on. We tried hybrid for a year and ended up fully remote. The coordination overhead of hybrid was worse than either extreme.', parentCommentIndex: null },
  // Article 8 (Zero trust)
  { articleSlug: 'zero-trust-isnt-a-product-its-a-permission-architecture', authorEmail: EXISTING_MEMBER_EMAIL, body: 'The "hard shell with soft center" description is the best summary of failed zero trust implementations I\'ve read. We discovered 47 over-privileged service accounts during our audit.', parentCommentIndex: null },
  // Article 9 (Supply chain)
  { articleSlug: 'software-supply-chain-attacks-are-the-new-normal', authorEmail: EXISTING_ADMIN_EMAIL, body: 'SBOMs are becoming mandatory in enterprise procurement. Every team should be generating them proactively, not scrambling when a customer asks.', parentCommentIndex: null },
  // Article 10 (Typography)
  { articleSlug: 'the-typography-system-that-actually-scales', authorEmail: EXISTING_MEMBER_EMAIL, body: 'Content-aware typography sizing is brilliant. We implemented something similar using container queries and it eliminated so many manual breakpoint overrides.', parentCommentIndex: null },
  // Article 11 (Dark mode)
  { articleSlug: 'dark-mode-design-is-more-than-inverting-colors', authorEmail: EXISTING_ADMIN_EMAIL, body: 'The luminance-based elevation concept clicked something in my brain. No wonder our dark mode felt flat — we weren\'t adjusting surface brightness at all.', parentCommentIndex: null },
  // Article 12 (EM dilemma)
  { articleSlug: 'engineering-managers-dilemma-technical-depth-vs-team-breadth', authorEmail: EXISTING_MEMBER_EMAIL, body: 'Hit the 18-month wall exactly as described. The scheduled code review time is great advice — it\'s what I\'ve been missing.', parentCommentIndex: null },
  // Article 13 (Interviews)
  { articleSlug: 'technical-interviews-are-broken-heres-how-to-survive-them', authorEmail: EXISTING_ADMIN_EMAIL, body: 'The pragmatic framing helps. It\'s not about whether the system is fair — it\'s about understanding the game and playing it strategically while signaling real skills.', parentCommentIndex: null },
  // Article 17 (OSS governance)
  { articleSlug: 'how-open-source-maintainers-actually-make-decisions', authorEmail: EXISTING_MEMBER_EMAIL, body: 'The burnout section hit close to home. Distributed decision-making across a core team (not just one BDFL) is the healthiest model I\'ve seen in practice.', parentCommentIndex: null },
];

// Votes data — 16 votes distributed across 8 challenges (2 per challenge)
const VOTES = [
  { challengeIndex: 0, userEmail: EXISTING_MEMBER_EMAIL, voteType: 'AGREE' },
  { challengeIndex: 0, userEmail: EXISTING_ADMIN_EMAIL, voteType: 'DISAGREE' },
  { challengeIndex: 1, userEmail: EXISTING_ADMIN_EMAIL, voteType: 'AGREE' },
  { challengeIndex: 1, userEmail: EXISTING_MEMBER_EMAIL, voteType: 'DISAGREE' },
  { challengeIndex: 2, userEmail: EXISTING_MEMBER_EMAIL, voteType: 'AGREE' },
  { challengeIndex: 2, userEmail: EXISTING_ADMIN_EMAIL, voteType: 'DISAGREE' },
  { challengeIndex: 3, userEmail: EXISTING_MEMBER_EMAIL, voteType: 'AGREE' },
  { challengeIndex: 3, userEmail: EXISTING_ADMIN_EMAIL, voteType: 'AGREE' },
  { challengeIndex: 4, userEmail: EXISTING_MEMBER_EMAIL, voteType: 'AGREE' },
  { challengeIndex: 4, userEmail: EXISTING_ADMIN_EMAIL, voteType: 'DISAGREE' },
  { challengeIndex: 5, userEmail: EXISTING_MEMBER_EMAIL, voteType: 'AGREE' },
  { challengeIndex: 5, userEmail: EXISTING_ADMIN_EMAIL, voteType: 'AGREE' },
  { challengeIndex: 6, userEmail: EXISTING_ADMIN_EMAIL, voteType: 'AGREE' },
  { challengeIndex: 6, userEmail: EXISTING_MEMBER_EMAIL, voteType: 'AGREE' },
  { challengeIndex: 7, userEmail: EXISTING_ADMIN_EMAIL, voteType: 'AGREE' },
  { challengeIndex: 7, userEmail: EXISTING_MEMBER_EMAIL, voteType: 'DISAGREE' },
];

// ==================== MAIN SEED ====================

async function main() {
  console.log('🌱 Starting PulseNote Database Seeding...');

  // ── 1. Categories ──────────────────────────────────────
  const categoriesData = [
    { name: 'AI', slug: 'ai', description: 'Artificial Intelligence, Large Language Models, Neural Networks, and Machine Learning.' },
    { name: 'Development', slug: 'development', description: 'Software engineering practices, architecture, clean code, and developer tooling.' },
    { name: 'Web Development', slug: 'web-development', description: 'Modern web development, React, frontend frameworks, performance, and UI engineering.' },
    { name: 'Startups', slug: 'startups', description: 'Tech entrepreneurship, product strategy, venture capital, and building software companies.' },
    { name: 'Cybersecurity', slug: 'cybersecurity', description: 'Application security, threat modeling, AI vulnerability management, and infrastructure protection.' },
    { name: 'Design', slug: 'design', description: 'Product design, design systems, UX research, typography, and visual ergonomics.' },
    { name: 'Tech Careers', slug: 'tech-careers', description: 'Engineering career paths, interview strategies, remote work, and career progression.' },
    { name: 'Emerging Technology', slug: 'emerging-technology', description: 'Quantum computing, hardware innovations, spatial computing, and next-gen tech.' },
    { name: 'Digital Culture', slug: 'digital-culture', description: 'The intersection of tech, open-source communities, privacy, and digital society.' },
  ];

  console.log('📌 Seeding Categories...');
  for (const cat of categoriesData) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description },
      create: cat,
    });
  }
  console.log(`✅ ${categoriesData.length} categories seeded.`);

  // ── 2. Users (preserve existing) ──────────────────────
  console.log('👤 Seeding Users...');
  const salt = await bcrypt.genSalt(10);
  const defaultPassword = await bcrypt.hash('Password123!', salt);

  const author = await prisma.user.upsert({
    where: { email: EXISTING_AUTHOR_EMAIL },
    update: {},
    create: {
      name: 'Alex Rivera',
      username: 'alexrivera',
      email: EXISTING_AUTHOR_EMAIL,
      passwordHash: defaultPassword,
      role: Role.AUTHOR,
      title: 'Principal Software Architect & Tech Writer',
      bio: 'Writing about modern web architectures, AI agents, and software craftsmanship.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    },
  });

  const member = await prisma.user.upsert({
    where: { email: EXISTING_MEMBER_EMAIL },
    update: {},
    create: {
      name: 'Sarah Chen',
      username: 'sarahchen',
      email: EXISTING_MEMBER_EMAIL,
      passwordHash: defaultPassword,
      role: Role.USER,
      title: 'Senior Frontend Engineer',
      bio: 'Enthusiastic about React 19, TypeScript, and structured discussion.',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: EXISTING_ADMIN_EMAIL },
    update: {},
    create: {
      name: 'PulseNote Admin',
      username: 'admin',
      email: EXISTING_ADMIN_EMAIL,
      passwordHash: defaultPassword,
      role: Role.ADMIN,
      title: 'Platform Lead & Moderator',
      bio: 'Ensuring high-quality technical discussions and editorial standards.',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    },
  });

  const usersByEmail: Record<string, typeof author> = {
    [EXISTING_AUTHOR_EMAIL]: author,
    [EXISTING_MEMBER_EMAIL]: member,
    [EXISTING_ADMIN_EMAIL]: admin,
  };

  console.log(`✅ Users seeded: ${author.username}, ${member.username}, ${admin.username}`);

  // ── 3. Tags ────────────────────────────────────────────
  console.log('🏷️  Seeding Tags...');
  for (const tag of TAGS) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: { name: tag.name },
      create: tag,
    });
  }
  console.log(`✅ ${TAGS.length} tags seeded.`);

  // ── 4. Articles (2 existing + 16 new = 18 total) ───────
  console.log('📰 Seeding Articles...');

  // Look up categories
  const categoryBySlug: Record<string, { id: string }> = {};
  for (const cat of categoriesData) {
    const found = await prisma.category.findUnique({ where: { slug: cat.slug } });
    if (found) categoryBySlug[cat.slug] = found;
  }

  // 4a. Preserve 2 existing articles (upsert with empty update = no-op if exists)
  const existingArticleSlugs = [
    'ai-coding-agents-are-changing-junior-developers',
    'is-react-still-the-right-choice-in-2026',
  ];

  for (const slug of existingArticleSlugs) {
    const existing = NEW_ARTICLES.find((a) => a.slug === slug);
    if (!existing) continue;
    const cat = categoryBySlug[existing.categoryId];
    if (!cat) continue;
    await prisma.article.upsert({
      where: { slug },
      update: {},
      create: {
        authorId: author.id,
        categoryId: cat.id,
        title: existing.title,
        slug: existing.slug,
        excerpt: existing.excerpt,
        content: existing.content,
        quickTake: existing.quickTake,
        coverImageUrl: existing.coverImageUrl,
        status: existing.status as ArticleStatus,
        pulseScore: existing.pulseScore,
        views: existing.views,
        readingTimeMin: existing.readingTimeMin,
        publishedAt: existing.publishedAt ?? new Date(),
        seoTitle: existing.seoTitle,
        seoDescription: existing.seoDescription,
        faqs: existing.faqs ?? undefined,
      },
    });
  }

  // 4b. Seed 16 new articles
  const newArticlesData = NEW_ARTICLES.filter(
    (a) => !existingArticleSlugs.includes(a.slug)
  );

  const articleBySlug: Record<string, { id: string }> = {};
  // Load existing articles into map
  for (const slug of existingArticleSlugs) {
    const a = await prisma.article.findUnique({ where: { slug } });
    if (a) articleBySlug[slug] = a;
  }

  for (const art of newArticlesData) {
    const cat = categoryBySlug[art.categoryId];
    if (!cat) {
      console.warn(`⚠️  Category not found: ${art.categoryId}. Skipping article: ${art.slug}`);
      continue;
    }
    const created = await prisma.article.upsert({
      where: { slug: art.slug },
      update: {},
      create: {
        authorId: author.id,
        categoryId: cat.id,
        title: art.title,
        slug: art.slug,
        excerpt: art.excerpt,
        content: art.content,
        quickTake: art.quickTake,
        coverImageUrl: art.coverImageUrl,
        status: art.status as ArticleStatus,
        pulseScore: art.pulseScore,
        views: art.views,
        readingTimeMin: art.readingTimeMin,
        publishedAt: art.publishedAt,
        seoTitle: art.seoTitle,
        seoDescription: art.seoDescription,
        faqs: art.faqs ?? undefined,
      },
    });
    articleBySlug[art.slug] = created;
  }

  const totalArticleCount = await prisma.article.count();
  console.log(`✅ ${totalArticleCount} articles in database.`);

  // ── 5. ArticleTag relationships ────────────────────────
  console.log('🔗 Seeding ArticleTag relationships...');
  const newArticlesWithTagData = newArticlesData.filter((a) => a.tags && a.tags.length > 0);

  for (const art of newArticlesWithTagData) {
    const article = articleBySlug[art.slug];
    if (!article) continue;

    for (const tagSlug of art.tags!) {
      const tag = await prisma.tag.findUnique({ where: { slug: tagSlug } });
      if (!tag) continue;
      await prisma.articleTag.upsert({
        where: { articleId_tagId: { articleId: article.id, tagId: tag.id } },
        update: {},
        create: { articleId: article.id, tagId: tag.id },
      });
    }
  }

  const totalArticleTagCount = await prisma.articleTag.count();
  console.log(`✅ ${totalArticleTagCount} ArticleTag relationships seeded.`);

  // ── 6. Challenges ──────────────────────────────────────
  console.log('💬 Seeding Challenges...');
  const challengeIdsByArticleSlug: Record<string, string[]> = {};

  for (const ch of CHALLENGES) {
    const article = articleBySlug[ch.articleSlug];
    if (!article) {
      console.warn(`⚠️  Article not found: ${ch.articleSlug}. Skipping challenge.`);
      continue;
    }
    const challengeAuthor = usersByEmail[ch.authorEmail];
    if (!challengeAuthor) continue;

    // Check if this challenge already exists by matching articleId + authorId + body
    const existingChallenge = await prisma.challenge.findFirst({
      where: {
        articleId: article.id,
        authorId: challengeAuthor.id,
        body: ch.body,
      },
    });

    if (!existingChallenge) {
      const created = await prisma.challenge.create({
        data: {
          articleId: article.id,
          authorId: challengeAuthor.id,
          type: ch.type as ChallengeType,
          quotedText: ch.quotedText,
          body: ch.body,
          agreeCount: ch.agreeCount,
          disagreeCount: ch.disagreeCount,
          status: ModerationStatus.VISIBLE,
        },
      });
      if (!challengeIdsByArticleSlug[ch.articleSlug]) {
        challengeIdsByArticleSlug[ch.articleSlug] = [];
      }
      challengeIdsByArticleSlug[ch.articleSlug].push(created.id);
    } else {
      if (!challengeIdsByArticleSlug[ch.articleSlug]) {
        challengeIdsByArticleSlug[ch.articleSlug] = [];
      }
      challengeIdsByArticleSlug[ch.articleSlug].push(existingChallenge.id);
    }
  }

  const totalChallengeCount = await prisma.challenge.count();
  console.log(`✅ ${totalChallengeCount} challenges in database.`);

  // ── 7. Challenge Votes ─────────────────────────────────
  console.log('🗳️  Seeding Challenge Votes...');
  // Build a flat list of all challenge IDs for vote assignment
  const allChallengeIds = Object.values(challengeIdsByArticleSlug).flat();

  for (const vote of VOTES) {
    // Resolve challenge ID using voteIndex into the CHALLENGES array
    const challengeData = CHALLENGES[vote.challengeIndex];
    if (!challengeData) continue;

    const article = articleBySlug[challengeData.articleSlug];
    if (!article) continue;

    // Find the challenge ID for this challenge data
    const challengeId = allChallengeIds[vote.challengeIndex];
    if (!challengeId) continue;

    const voter = usersByEmail[vote.userEmail];
    if (!voter) continue;

    await prisma.challengeVote.upsert({
      where: { challengeId_userId: { challengeId, userId: voter.id } },
      update: {},
      create: {
        challengeId,
        userId: voter.id,
        voteType: vote.voteType as VoteType,
      },
    });
  }

  const totalVoteCount = await prisma.challengeVote.count();
  console.log(`✅ ${totalVoteCount} challenge votes in database.`);

  // ── 8. Comments ────────────────────────────────────────
  console.log('💭 Seeding Comments...');
  const seededCommentIds: string[] = [];

  for (let i = 0; i < COMMENTS.length; i++) {
    const cm = COMMENTS[i];
    const article = articleBySlug[cm.articleSlug];
    if (!article) continue;
    const commenter = usersByEmail[cm.authorEmail];
    if (!commenter) continue;

    // Determine parent comment
    let parentCommentId: string | null = null;
    if (cm.parentCommentIndex !== null && cm.parentCommentIndex !== undefined) {
      parentCommentId = seededCommentIds[cm.parentCommentIndex] || null;
    }

    // Check for existing comment by same author on same article with same body
    const existingComment = await prisma.comment.findFirst({
      where: {
        articleId: article.id,
        authorId: commenter.id,
        body: cm.body,
      },
    });

    if (!existingComment) {
      const created = await prisma.comment.create({
        data: {
          articleId: article.id,
          authorId: commenter.id,
          body: cm.body,
          parentCommentId,
          status: ModerationStatus.VISIBLE,
        },
      });
      seededCommentIds.push(created.id);
    } else {
      seededCommentIds.push(existingComment.id);
    }
  }

  const totalCommentCount = await prisma.comment.count();
  console.log(`✅ ${totalCommentCount} comments in database.`);

  console.log('🎉 Phase 4A seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
