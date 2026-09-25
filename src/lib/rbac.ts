import { KesalahanDomain } from "@/lib/kesalahan"

export type Peran = "ADMIN" | "USER"
export type SesiPengguna = { id: string; nama: string; email: string; peran: Peran }
export type Kemampuan = "kelola_kelas" | "kelola_peserta" | "kelola_pembayaran" | "kelola_absensi" | "kelola_sertifikat" | "lihat_dokumen_operasional" | "lihat_laporan_bisnis"
const kemampuanAdmin: Kemampuan[] = ["kelola_kelas", "kelola_peserta", "kelola_pembayaran", "kelola_absensi", "kelola_sertifikat", "lihat_dokumen_operasional", "lihat_laporan_bisnis"]
const petaKemampuan: Record<Peran, Kemampuan[]> = { ADMIN: kemampuanAdmin, USER: [] }
export function memilikiKemampuan(peran: Peran, kemampuan: Kemampuan): boolean { return petaKemampuan[peran].includes(kemampuan) }
export function adalahPeranOperasional(peran: Peran): boolean { return peran === "ADMIN" }
export function wajibSesi(sesi: SesiPengguna | null | undefined): SesiPengguna { if (!sesi) throw new KesalahanDomain("TIDAK_TERAUTENTIKASI", "Anda harus masuk terlebih dahulu untuk melanjutkan."); return sesi }
export function wajibKemampuan(sesi: SesiPengguna | null | undefined, kemampuan: Kemampuan): SesiPengguna { const pengguna = wajibSesi(sesi); if (!memilikiKemampuan(pengguna.peran, kemampuan)) throw new KesalahanDomain("TIDAK_BERWENANG", "Anda tidak memiliki hak akses untuk tindakan ini."); return pengguna }
export function wajibPeran(sesi: SesiPengguna | null | undefined, daftarPeran: Peran[]): SesiPengguna { const pengguna = wajibSesi(sesi); if (!daftarPeran.includes(pengguna.peran)) throw new KesalahanDomain("TIDAK_BERWENANG", "Anda tidak memiliki hak akses untuk halaman ini."); return pengguna }
export function wajibPemilikDokumenAtauOperasional(sesi: SesiPengguna | null | undefined, userIdPemilikDokumen: string): SesiPengguna { const pengguna = wajibSesi(sesi); if (pengguna.id !== userIdPemilikDokumen && !memilikiKemampuan(pengguna.peran, "lihat_dokumen_operasional")) throw new KesalahanDomain("TIDAK_BERWENANG", "Dokumen ini bukan milik akun Anda."); return pengguna }
export function berandaDashboard(peran: Peran): string { return peran === "ADMIN" ? "/admin" : "/user" }
export function peranDiizinkanUntukPath(path: string): Peran[] | null { if (path === "/admin" || path.startsWith("/admin/")) return ["ADMIN"]; if (path === "/user" || path.startsWith("/user/")) return ["USER", "ADMIN"]; return null }
