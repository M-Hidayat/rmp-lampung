-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
-- Catatan: baseline ini mencerminkan skema SEBELUM migrasi
-- 20260919000000_remove_pemilik_role, karena migrasi tersebut meng-ALTER enum
-- ini menjadi ('ADMIN','USER'). Nilai 'PEMILIK' dipertahankan agar delta itu
-- tetap bermakna saat dijalankan pada database baru.
CREATE TYPE "Peran" AS ENUM ('PEMILIK', 'ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "StatusPendaftaran" AS ENUM ('PENDING', 'PAID', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "StatusPembayaran" AS ENUM ('PENDING', 'PAID', 'FAILED', 'EXPIRED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telepon" TEXT,
    "passwordHash" TEXT NOT NULL,
    "peran" "Peran" NOT NULL DEFAULT 'USER',
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseClass" (
    "id" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "harga" DECIMAL(12,2) NOT NULL,
    "kuota" INTEGER NOT NULL,
    "jadwalMulai" TIMESTAMP(3) NOT NULL,
    "jadwalSelesai" TIMESTAMP(3),
    "lokasi" TEXT NOT NULL,
    "gambarUrl" TEXT,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseClass_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enrollment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "status" "StatusPendaftaran" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Enrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "enrollmentId" TEXT NOT NULL,
    "pakasirRef" TEXT NOT NULL,
    "nominal" DECIMAL(12,2) NOT NULL,
    "status" "StatusPembayaran" NOT NULL DEFAULT 'PENDING',
    "metode" TEXT,
    "dibayarPada" TIMESTAMP(3),
    "payloadMentah" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttendanceSession" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "kedaluwarsaPada" TIMESTAMP(3) NOT NULL,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "dibuatOlehId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AttendanceSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" TEXT NOT NULL,
    "enrollmentId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "waktuScan" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "nomor" TEXT NOT NULL,
    "snapshotPeserta" JSONB NOT NULL,
    "snapshotKelas" JSONB NOT NULL,
    "nominal" DECIMAL(12,2) NOT NULL,
    "dibayarPada" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certificate" (
    "id" TEXT NOT NULL,
    "attendanceId" TEXT NOT NULL,
    "nomor" TEXT NOT NULL,
    "diterbitkanPada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_peran_idx" ON "User"("peran");

-- CreateIndex
CREATE UNIQUE INDEX "CourseClass_slug_key" ON "CourseClass"("slug");

-- CreateIndex
CREATE INDEX "CourseClass_aktif_jadwalMulai_idx" ON "CourseClass"("aktif", "jadwalMulai");

-- CreateIndex
CREATE INDEX "Enrollment_classId_status_idx" ON "Enrollment"("classId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Enrollment_userId_classId_key" ON "Enrollment"("userId", "classId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_enrollmentId_key" ON "Payment"("enrollmentId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_pakasirRef_key" ON "Payment"("pakasirRef");

-- CreateIndex
CREATE INDEX "Payment_status_dibayarPada_idx" ON "Payment"("status", "dibayarPada");

-- CreateIndex
CREATE UNIQUE INDEX "AttendanceSession_tokenHash_key" ON "AttendanceSession"("tokenHash");

-- CreateIndex
CREATE INDEX "AttendanceSession_classId_aktif_idx" ON "AttendanceSession"("classId", "aktif");

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_enrollmentId_key" ON "Attendance"("enrollmentId");

-- CreateIndex
CREATE INDEX "Attendance_sessionId_idx" ON "Attendance"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_paymentId_key" ON "Invoice"("paymentId");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_nomor_key" ON "Invoice"("nomor");

-- CreateIndex
CREATE UNIQUE INDEX "Certificate_attendanceId_key" ON "Certificate"("attendanceId");

-- CreateIndex
CREATE UNIQUE INDEX "Certificate_nomor_key" ON "Certificate"("nomor");

-- CreateIndex
CREATE INDEX "Certificate_revokedAt_idx" ON "Certificate"("revokedAt");

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_classId_fkey" FOREIGN KEY ("classId") REFERENCES "CourseClass"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceSession" ADD CONSTRAINT "AttendanceSession_classId_fkey" FOREIGN KEY ("classId") REFERENCES "CourseClass"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceSession" ADD CONSTRAINT "AttendanceSession_dibuatOlehId_fkey" FOREIGN KEY ("dibuatOlehId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "AttendanceSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_attendanceId_fkey" FOREIGN KEY ("attendanceId") REFERENCES "Attendance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

