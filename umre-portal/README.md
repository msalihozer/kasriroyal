# Umre Portal Monorepo

Bu proje Next.js, NestJS, Prisma ve Docker kullanılarak geliştirilmiş bir Umre/Turizm portalıdır.

## Gereksinimler

- Node.js 18+
- pnpm
- Docker & Docker Compose

## Kurulum Adımları

1. **Bağımlılıkları Yükleyin**
   ```bash
   pnpm install
   ```

2. **Çevresel Değişkenleri Ayarlayın**
   `.env.example` dosyasını `.env` olarak kopyalayın:
   ```bash
   cp .env.example .env
   # Windows için: copy .env.example .env
   ```

3. **Veritabanını Başlatın**
   Docker Compose ile PostgreSQL'i ayağa kaldırın:
   ```bash
   docker-compose up -d
   ```

4. **Veritabanı Şemasını ve Seed Verilerini Yükleyin**
   ```bash
   pnpm prisma:migrate
   pnpm prisma:seed
   ```

5. **Uygulamaları Başlatın**
   Tüm uygulamaları (API, Web, Admin) geliştirme modunda başlatmak için:
   ```bash
   pnpm dev
   ```

## Uygulamalar

- **Web Sitesi**: [http://localhost:3000](http://localhost:3000)
- **Admin Paneli**: [http://localhost:3001](http://localhost:3001)
  - **Email**: admin@site.com
  - **Şifre**: Admin123!
- **API**: [http://localhost:4000](http://localhost:4000)
  - **Swagger Dokümantasyonu**: [http://localhost:4000/api/docs](http://localhost:4000/api/docs)

## Proje Yapısı

- `apps/api`: NestJS backend
- `apps/web`: Next.js kullanıcı arayüzü
- `apps/admin`: Next.js yönetim paneli
- `packages/shared`: Ortak tipler ve şemalar

## Özellikler

- **Admin Panel**: Turlar, oteller, blok yönetimi, medya kütüphanesi.
- **Web Sitesi**: Dinamik blok yapısı ile yönetilebilir anasayfa.
- **API**: Tam kapsamlı REST API, JWT auth, Swagger dokümantasyonu.
