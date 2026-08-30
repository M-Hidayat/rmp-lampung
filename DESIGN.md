---
version: alpha
name: RMP Culinary Excellence System (Google Stitch Project Specification)
description: Design System resmi hasil ekstraksi dari Google Stitch Project 13575935854324424817 (Culinary Excellence System). Mengombinasikan Primary Deep Ember Red/Crimson (#B22222), Secondary Warm Gold/Amber (#FFC107 / #EA580C), Tertiary Midnight Navy (#0F172A), Neutral Clean Cream/Slate (#F9FAFB / #FFFFFF), dan tipografi Montserrat (Headline) + Inter (Body).
colors:
  primary: "#0F172A"
  primary-foreground: "#FFFFFF"
  secondary: "#F9FAFB"
  secondary-foreground: "#0F172A"
  tertiary: "#EA580C"
  tertiary-foreground: "#FFFFFF"
  brand-red: "#B22222"
  brand-gold: "#FFC107"
  background: "#F9FAFB"
  foreground: "#0F172A"
  card: "#FFFFFF"
  card-foreground: "#0F172A"
  muted: "#F1F5F9"
  muted-foreground: "#64748B"
  border: "#E2E8F0"
  input: "#E2E8F0"
  ring: "#EA580C"
  accent: "#FFF7ED"
  accent-foreground: "#C2410C"
  success: "#16A34A"
  destructive: "#DC2626"
typography:
  h1:
    fontFamily: Montserrat, Plus Jakarta Sans, sans-serif
    fontSize: 2.75rem
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  h2:
    fontFamily: Montserrat, Plus Jakarta Sans, sans-serif
    fontSize: 2rem
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  h3:
    fontFamily: Montserrat, Plus Jakarta Sans, sans-serif
    fontSize: 1.25rem
    fontWeight: 700
    lineHeight: 1.3
  body-lg:
    fontFamily: Inter, system-ui, sans-serif
    fontSize: 1.125rem
    lineHeight: 1.6
  body-md:
    fontFamily: Inter, system-ui, sans-serif
    fontSize: 1rem
    lineHeight: 1.5
  body-sm:
    fontFamily: Inter, system-ui, sans-serif
    fontSize: 0.875rem
    lineHeight: 1.4
  caption:
    fontFamily: Inter, system-ui, sans-serif
    fontSize: 0.75rem
    lineHeight: 1.4
rounded:
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  2xl: 24px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.md}"
    padding: 10px
  button-brand:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.tertiary-foreground}"
    rounded: "{rounded.md}"
    padding: 10px
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondary-foreground}"
    rounded: "{rounded.md}"
    padding: 10px
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    rounded: "{rounded.2xl}"
    padding: 24px
---

## Overview

Desain sistem **RMP Culinary Excellence System** adalah spesifikasi visual yang diimpor langsung dari Google Stitch Project `13575935854324424817`. Dirancang untuk sistem manajemen akademi kuliner, pendaftaran kursus komersial, integrasi pembayaran gateway, dan LMS presensi QR proyektor.

## Colors & Hierarchy

Sesuai token sistem Google Stitch:
- **Tertiary / Base Charcoal (`#0F172A`)**: Digunakan sebagai warna dominan teks, navbar, dan background proyektor.
- **Warm Culinary Amber / Gold (`#EA580C` & `#FFC107`)**: Warna aksen utama interaksi, status kuota, live countdown token 30 detik, dan tombol aksi (*Call to Action*).
- **Crimson Accents (`#B22222`)**: Aksen pendukung identitas kuliner tradisional.
- **Neutral Light Canvas (`#F9FAFB` & `#FFFFFF`)**: Latar belakang bersih dengan kartu putih bergaris batas halus (`#E2E8F0`).

## Typography

- **Headlines**: **Montserrat** (atau Plus Jakarta Sans fallback) dengan bobot 700/800 dan letter spacing rapat untuk judul modul dan silabus.
- **Body & Data**: **Inter** untuk tabel data, petunjuk pendaftaran, dan informasi invoice.

## Screens & Workflows (Google Stitch Blueprint)

1. **Course Catalog & Detail Syllabus**: Kartu bento program kursus, highlight fasilitas dapur komersial, dan formula HPP.
2. **Student Dashboard (`/user`)**: Kartu progres belajar, kartu kelas terdaftar, dan tombol cepat buka kamera absensi.
3. **Admin QR Projector Mode (`/admin/absensi`)**: Mode proyektor layar penuh berlatar gelap `#0F172A` dengan QR code besar dan progress bar dinamis 30 detik.
4. **Certificate & Verification (`/verifikasi`)**: Tampilan sertifikat digital dengan QR verification hash publik.
5. **Owner Financial Reports (`/pemilik`)**: Dashboard eksekutif ringkasan omzet dan audit dokumen.
