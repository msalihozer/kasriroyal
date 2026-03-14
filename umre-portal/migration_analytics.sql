-- Migration: add_analytics_security
-- Sunucuda çalıştırın: psql $DATABASE_URL -f migration_analytics.sql

-- PageView tablosu
CREATE TABLE IF NOT EXISTS "PageView" (
    "id"        TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "path"      TEXT NOT NULL,
    "referrer"  TEXT,
    "device"    TEXT,
    "duration"  INTEGER,
    "sessionId" TEXT,
    "ip"        TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PageView_pkey" PRIMARY KEY ("id")
);

-- BlockedIp tablosu
CREATE TABLE IF NOT EXISTS "BlockedIp" (
    "id"        TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "ip"        TEXT NOT NULL,
    "reason"    TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BlockedIp_pkey" PRIMARY KEY ("id")
);

-- BlockedIp unique index
CREATE UNIQUE INDEX IF NOT EXISTS "BlockedIp_ip_key" ON "BlockedIp"("ip");

-- Performans için index
CREATE INDEX IF NOT EXISTS "PageView_createdAt_idx" ON "PageView"("createdAt");
CREATE INDEX IF NOT EXISTS "PageView_path_idx" ON "PageView"("path");

-- Prisma migration kaydı (prisma migrate kullanıyorsanız bu satırları atlayın)
-- INSERT INTO "_prisma_migrations" ...  -- otomatik eklenir
