/*
  Warnings:

  - You are about to drop the column `amenities` on the `Hotel` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `Hotel` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Hotel" DROP COLUMN "amenities",
DROP COLUMN "city",
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "locationId" TEXT,
ADD COLUMN     "locationText" TEXT,
ADD COLUMN     "shortDescription" TEXT,
ADD COLUMN     "websiteUrl" TEXT;

-- AlterTable
ALTER TABLE "Page" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'general',
ADD COLUMN     "content" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "summary" TEXT;

-- AlterTable
ALTER TABLE "SiteSettings" ADD COLUMN     "address" TEXT,
ADD COLUMN     "bankAccounts" JSONB,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "firmName" TEXT,
ADD COLUMN     "footerLogos" JSONB,
ADD COLUMN     "heroSubtitle" TEXT,
ADD COLUMN     "heroTitle" TEXT,
ADD COLUMN     "heroTitleColor" TEXT DEFAULT '#ffffff',
ADD COLUMN     "heroVideoUrl" TEXT,
ADD COLUMN     "mapEmbedUrl" TEXT,
ADD COLUMN     "mission" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "phones" JSONB,
ADD COLUMN     "tourImportantNotes" TEXT,
ADD COLUMN     "vision" TEXT;

-- AlterTable
ALTER TABLE "Tour" ADD COLUMN     "airline" TEXT,
ADD COLUMN     "departureLocation" TEXT,
ADD COLUMN     "durationNights" INTEGER,
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "excludedText" TEXT,
ADD COLUMN     "label" TEXT,
ADD COLUMN     "locationStays" JSONB,
ADD COLUMN     "pricing" JSONB,
ADD COLUMN     "returnDate" TIMESTAMP(3),
ADD COLUMN     "returnLocation" TEXT,
ADD COLUMN     "startDate" TIMESTAMP(3),
ADD COLUMN     "tourTypeId" TEXT,
ADD COLUMN     "vehicleId" TEXT,
ALTER COLUMN "currency" SET DEFAULT 'USD';

-- CreateTable
CREATE TABLE "TourType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "TourType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TourItinerary" (
    "id" TEXT NOT NULL,
    "tourId" TEXT NOT NULL,
    "day" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "locationId" TEXT,
    "hotelId" TEXT,

    CONSTRAINT "TourItinerary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HotelFeature" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "category" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HotelFeature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailSettings" (
    "id" TEXT NOT NULL,
    "host" TEXT NOT NULL,
    "port" INTEGER NOT NULL,
    "user" TEXT NOT NULL,
    "pass" TEXT NOT NULL,
    "fromEmail" TEXT NOT NULL,
    "notificationEmail" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "entityName" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "city" TEXT,
    "personCount" INTEGER NOT NULL,
    "tourId" TEXT,
    "tourName" TEXT,
    "note" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomTourRequest" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "personCount" INTEGER NOT NULL,
    "mekkeDays" INTEGER,
    "medineDays" INTEGER,
    "startDate" TIMESTAMP(3),
    "airline" TEXT,
    "flightClass" TEXT,
    "departureCity" TEXT,
    "hotelChoiceType" TEXT,
    "hotelSelection" JSONB,
    "hotelPreference" JSONB,
    "transferChoiceType" TEXT,
    "vehicleSelection" TEXT,
    "transferService" TEXT,
    "guideRequested" BOOLEAN NOT NULL DEFAULT false,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomTourRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_HotelToHotelFeature" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "TourType_slug_key" ON "TourType"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Location_slug_key" ON "Location"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "_HotelToHotelFeature_AB_unique" ON "_HotelToHotelFeature"("A", "B");

-- CreateIndex
CREATE INDEX "_HotelToHotelFeature_B_index" ON "_HotelToHotelFeature"("B");

-- AddForeignKey
ALTER TABLE "TourItinerary" ADD CONSTRAINT "TourItinerary_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TourItinerary" ADD CONSTRAINT "TourItinerary_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TourItinerary" ADD CONSTRAINT "TourItinerary_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tour" ADD CONSTRAINT "Tour_tourTypeId_fkey" FOREIGN KEY ("tourTypeId") REFERENCES "TourType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tour" ADD CONSTRAINT "Tour_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hotel" ADD CONSTRAINT "Hotel_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HotelToHotelFeature" ADD CONSTRAINT "_HotelToHotelFeature_A_fkey" FOREIGN KEY ("A") REFERENCES "Hotel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HotelToHotelFeature" ADD CONSTRAINT "_HotelToHotelFeature_B_fkey" FOREIGN KEY ("B") REFERENCES "HotelFeature"("id") ON DELETE CASCADE ON UPDATE CASCADE;
