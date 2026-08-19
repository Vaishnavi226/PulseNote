-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'AUTHOR', 'MODERATOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'BANNED');

-- CreateEnum
CREATE TYPE "ArticleStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ChallengeType" AS ENUM ('AGREE', 'DISAGREE', 'ADD_CONTEXT', 'FACT_CHECK', 'PERSONAL_EXPERIENCE');

-- CreateEnum
CREATE TYPE "VoteType" AS ENUM ('AGREE', 'DISAGREE');

-- CreateEnum
CREATE TYPE "ModerationStatus" AS ENUM ('VISIBLE', 'REPORTED', 'UNDER_REVIEW', 'HIDDEN', 'DELETED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('LIKE', 'CHALLENGE', 'CHALLENGE_VOTE', 'REPLY', 'MENTION', 'MODERATION', 'FEATURED');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'UNDER_REVIEW', 'RESOLVED', 'DISMISSED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "bio" TEXT,
    "title" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article_tags" (
    "articleId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "article_tags_pkey" PRIMARY KEY ("articleId","tagId")
);

-- CreateTable
CREATE TABLE "articles" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "quickTake" TEXT,
    "coverImageUrl" TEXT,
    "status" "ArticleStatus" NOT NULL DEFAULT 'DRAFT',
    "pulseScore" INTEGER NOT NULL DEFAULT 0,
    "views" INTEGER NOT NULL DEFAULT 0,
    "readingTimeMin" INTEGER NOT NULL DEFAULT 5,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "challenges" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "type" "ChallengeType" NOT NULL,
    "body" TEXT NOT NULL,
    "quotedText" TEXT,
    "sourceUrl" TEXT,
    "agreeCount" INTEGER NOT NULL DEFAULT 0,
    "disagreeCount" INTEGER NOT NULL DEFAULT 0,
    "replyCount" INTEGER NOT NULL DEFAULT 0,
    "status" "ModerationStatus" NOT NULL DEFAULT 'VISIBLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "challenges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "challenge_replies" (
    "id" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "parentReplyId" TEXT,
    "body" TEXT NOT NULL,
    "status" "ModerationStatus" NOT NULL DEFAULT 'VISIBLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "challenge_replies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "challenge_votes" (
    "id" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "voteType" "VoteType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "challenge_votes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "parentCommentId" TEXT,
    "body" TEXT NOT NULL,
    "status" "ModerationStatus" NOT NULL DEFAULT 'VISIBLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article_likes" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "article_likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article_bookmarks" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "article_bookmarks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "targetUrl" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reading_history" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "progressPercent" INTEGER NOT NULL DEFAULT 0,
    "lastReadAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reading_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article_analytics_daily" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "viewsCount" INTEGER NOT NULL DEFAULT 0,
    "likesCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "article_analytics_daily_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL,
    "reporterId" TEXT NOT NULL,
    "challengeId" TEXT,
    "commentId" TEXT,
    "reason" TEXT NOT NULL,
    "details" TEXT,
    "status" "ReportStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "details" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tags_slug_key" ON "tags"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "articles_slug_key" ON "articles"("slug");

-- CreateIndex
CREATE INDEX "articles_slug_idx" ON "articles"("slug");

-- CreateIndex
CREATE INDEX "articles_status_idx" ON "articles"("status");

-- CreateIndex
CREATE INDEX "articles_pulseScore_idx" ON "articles"("pulseScore");

-- CreateIndex
CREATE INDEX "articles_authorId_idx" ON "articles"("authorId");

-- CreateIndex
CREATE INDEX "articles_categoryId_idx" ON "articles"("categoryId");

-- CreateIndex
CREATE INDEX "articles_publishedAt_idx" ON "articles"("publishedAt");

-- CreateIndex
CREATE INDEX "challenges_articleId_idx" ON "challenges"("articleId");

-- CreateIndex
CREATE INDEX "challenges_authorId_idx" ON "challenges"("authorId");

-- CreateIndex
CREATE INDEX "challenges_status_idx" ON "challenges"("status");

-- CreateIndex
CREATE INDEX "challenge_replies_challengeId_idx" ON "challenge_replies"("challengeId");

-- CreateIndex
CREATE INDEX "challenge_replies_authorId_idx" ON "challenge_replies"("authorId");

-- CreateIndex
CREATE UNIQUE INDEX "challenge_votes_challengeId_userId_key" ON "challenge_votes"("challengeId", "userId");

-- CreateIndex
CREATE INDEX "comments_articleId_idx" ON "comments"("articleId");

-- CreateIndex
CREATE INDEX "comments_authorId_idx" ON "comments"("authorId");

-- CreateIndex
CREATE UNIQUE INDEX "article_likes_articleId_userId_key" ON "article_likes"("articleId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "article_bookmarks_articleId_userId_key" ON "article_bookmarks"("articleId", "userId");

-- CreateIndex
CREATE INDEX "notifications_userId_idx" ON "notifications"("userId");

-- CreateIndex
CREATE INDEX "notifications_userId_isRead_idx" ON "notifications"("userId", "isRead");

-- CreateIndex
CREATE UNIQUE INDEX "reading_history_userId_articleId_key" ON "reading_history"("userId", "articleId");

-- CreateIndex
CREATE UNIQUE INDEX "article_analytics_daily_articleId_date_key" ON "article_analytics_daily"("articleId", "date");

-- CreateIndex
CREATE INDEX "reports_status_idx" ON "reports"("status");

-- CreateIndex
CREATE INDEX "reports_reporterId_idx" ON "reports"("reporterId");

-- CreateIndex
CREATE INDEX "audit_logs_actorId_idx" ON "audit_logs"("actorId");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

-- AddForeignKey
ALTER TABLE "article_tags" ADD CONSTRAINT "article_tags_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_tags" ADD CONSTRAINT "article_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenge_replies" ADD CONSTRAINT "challenge_replies_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "challenges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenge_replies" ADD CONSTRAINT "challenge_replies_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenge_replies" ADD CONSTRAINT "challenge_replies_parentReplyId_fkey" FOREIGN KEY ("parentReplyId") REFERENCES "challenge_replies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenge_votes" ADD CONSTRAINT "challenge_votes_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "challenges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenge_votes" ADD CONSTRAINT "challenge_votes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_parentCommentId_fkey" FOREIGN KEY ("parentCommentId") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_likes" ADD CONSTRAINT "article_likes_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_likes" ADD CONSTRAINT "article_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_bookmarks" ADD CONSTRAINT "article_bookmarks_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_bookmarks" ADD CONSTRAINT "article_bookmarks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reading_history" ADD CONSTRAINT "reading_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reading_history" ADD CONSTRAINT "reading_history_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_analytics_daily" ADD CONSTRAINT "article_analytics_daily_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "challenges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
