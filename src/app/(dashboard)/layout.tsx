import Link from "next/link"
import { redirect } from "next/navigation"
import {
	Award,
	Bell,
	BookOpen,
	ChevronDown,
	CreditCard,
	FileText,
	HelpCircle,
	LayoutDashboard,
	LogOut,
	QrCode,
	Search,
	ShieldCheck,
	TrendingUp,
	User,
	Users,
	ExternalLink,
	Sparkles,
} from "lucide-react"

import { aksiKeluar } from "./aksi"
import { Button } from "@/components/ui/button"
import { sesiPengguna } from "@/lib/auth"
import { identitasTampilan } from "@/lib/identitas-rmp"

type ItemMenu = {
	href: string
	label: string
	ikon: React.ComponentType<{ className?: string }>
}

export default async function TataLetakDashboard({
	children,
}: {
	children: React.ReactNode
}) {
	const sesi = await sesiPengguna()
	if (!sesi) redirect("/masuk")

	// Menu Peserta (User)
	const menuPeserta: ItemMenu[] = [
		{ href: "/user", label: "Dashboard", ikon: LayoutDashboard },
		{ href: "/user/kelas-saya", label: "Kelas Saya", ikon: BookOpen },
		{ href: "/user/pembayaran", label: "Pembayaran", ikon: CreditCard },
		{ href: "/user/absensi", label: "Absensi QR", ikon: QrCode },
		{ href: "/user/invoice", label: "Invoice", ikon: FileText },
		{ href: "/user/sertifikat", label: "Sertifikat", ikon: Award },
		{ href: "/user/profil", label: "Profil Akun", ikon: User },
	]

	// Menu Admin Operasional
	const menuAdmin: ItemMenu[] = [
		{ href: "/admin", label: "Dashboard", ikon: LayoutDashboard },
		{ href: "/admin/kelas", label: "Kelola Kelas", ikon: BookOpen },
		{ href: "/admin/peserta", label: "Data Peserta", ikon: Users },
		{ href: "/admin/pembayaran", label: "Pembayaran", ikon: CreditCard },
		{ href: "/admin/absensi", label: "Sesi & QR Absensi", ikon: QrCode },
		{ href: "/admin/kehadiran", label: "Rekap Kehadiran", ikon: Award },
		{ href: "/admin/sertifikat", label: "Penerbitan Sertifikat", ikon: ShieldCheck },
	]

	// Menu Pemilik (Executive)
	const menuPemilik: ItemMenu[] = [
		{ href: "/pemilik", label: "Dashboard Eksekutif", ikon: TrendingUp },
		{ href: "/pemilik/admin", label: "Manajemen Admin", ikon: Users },
		{ href: "/pemilik/audit-sertifikat", label: "Audit Sertifikat", ikon: ShieldCheck },
	]

	let daftarMenu = menuPeserta
	if (sesi.peran === "ADMIN") {
		daftarMenu = menuAdmin
	} else if (sesi.peran === "PEMILIK") {
		daftarMenu = menuPemilik
	}

	const labelPeran =
		sesi.peran === "PEMILIK"
			? "Pemilik"
			: sesi.peran === "ADMIN"
				? "Admin"
				: "Peserta"

	const inisialNama = sesi.nama
		? sesi.nama
				.split(" ")
				.map((n) => n[0])
				.slice(0, 2)
				.join("")
				.toUpperCase()
		: "U"

	return (
		<div className="flex min-h-screen bg-[#FAF8F5] text-zinc-900">
			{/* Left Sidebar — Bodyshop SaaS Reference Style with Gold Accent */}
			<aside className="w-64 shrink-0 bg-white border-r border-[#EFECE6] flex flex-col justify-between hidden lg:flex">
				<div>
					{/* Workspace / Brand Header */}
					<div className="p-4 border-b border-[#F5F3EF] flex items-center justify-between">
						<Link href="/" className="flex items-center gap-3 min-w-0 transition-opacity hover:opacity-90">
							<div className="relative flex size-9 items-center justify-center rounded-full bg-linear-to-b from-[#FBF7EE] to-[#F1E5CF] p-0.5 shadow-xs ring-1 ring-[#D49A28]/40 shrink-0">
								<div className="flex size-full items-center justify-center rounded-full border border-[#D49A28] bg-linear-to-b from-[#FFFDF9] to-[#FDF8EE] text-center">
									<span className="font-serif text-[9px] font-extrabold text-[#854D0E]">RMP</span>
								</div>
							</div>
							<div className="min-w-0">
								<p className="font-bold text-xs text-zinc-950 truncate leading-tight font-heading">
									{identitasTampilan.nama}
								</p>
								<p className="text-[10px] text-zinc-500 truncate mt-0.5">
									{sesi.nama} ({labelPeran})
								</p>
							</div>
						</Link>
						<ChevronDown className="size-3.5 text-zinc-400 shrink-0" />
					</div>

					{/* Navigation List */}
					<nav aria-label="Sidebar Menu" className="p-3 space-y-1">
						{daftarMenu.map((item) => {
							const Ikon = item.ikon
							return (
								<Link
									key={item.href}
									href={item.href}
									className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-zinc-600 hover:bg-[#FAF8F5] hover:text-[#854D0E] transition-colors group"
								>
									<Ikon className="size-4 text-zinc-400 group-hover:text-[#D49A28] transition-colors shrink-0" />
									<span>{item.label}</span>
								</Link>
							)
						})}
					</nav>
				</div>

				{/* Bottom Usage / Status Widget */}
				<div className="p-4 border-t border-[#F5F3EF] space-y-3">
					<div className="space-y-1.5">
						<div className="flex justify-between text-[11px] font-semibold text-zinc-600">
							<span>Status sistem:</span>
							<span className="text-emerald-700 font-bold">Online</span>
						</div>
						<div className="h-1.5 w-full bg-[#F5F3EF] rounded-full overflow-hidden">
							<div className="h-full bg-emerald-500 w-full" />
						</div>
					</div>

					<div className="pt-2 border-t border-[#F5F3EF] flex items-center justify-between">
						<div className="flex items-center gap-2">
							<span className="size-2 rounded-full bg-emerald-500" />
							<span className="text-[11px] text-zinc-500 font-medium">LMS Ready</span>
						</div>
						<form action={aksiKeluar}>
							<button
								type="submit"
								className="text-xs text-zinc-400 hover:text-red-600 transition-colors flex items-center gap-1 cursor-pointer"
								title="Keluar"
							>
								<LogOut className="size-3.5" />
								<span>Keluar</span>
							</button>
						</form>
					</div>
				</div>
			</aside>

			{/* Main Workspace Area */}
			<div className="flex-1 flex flex-col min-w-0">
				{/* Topbar Header */}
				<header className="h-16 bg-white/95 backdrop-blur-xs border-b border-[#EFECE6] px-6 flex items-center justify-between sticky top-0 z-30">
					{/* Search Bar */}
					<div className="relative w-72 max-w-sm hidden sm:block">
						<Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
						<input
							type="text"
							placeholder="Cari menu, data, atau kelas..."
							className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D49A28] focus:bg-white transition-colors"
						/>
					</div>

					{/* Mobile brand text */}
					<div className="sm:hidden flex items-center gap-2">
						<div className="size-7 rounded-full bg-linear-to-b from-[#FBF7EE] to-[#F1E5CF] border border-[#D49A28] flex items-center justify-center font-bold text-[10px] text-[#854D0E]">
							RMP
						</div>
						<span className="font-bold text-xs text-zinc-950 font-heading">Panel {labelPeran}</span>
					</div>

					{/* Right Profile & Links Toolbar */}
					<div className="flex items-center gap-4">
						<Link
							href="/kelas"
							className="text-xs font-semibold text-[#854D0E] hover:text-[#713F12] transition-colors hidden md:inline-flex items-center gap-1"
						>
							<span>Lihat Katalog Publik</span>
							<ExternalLink className="size-3 opacity-70" />
						</Link>

						<button
							type="button"
							className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors relative cursor-pointer"
							aria-label="Notifikasi"
						>
							<Bell className="size-4" />
							<span className="size-1.5 rounded-full bg-[#D49A28] absolute top-1.5 right-1.5" />
						</button>

						<div className="h-4 w-px bg-zinc-200 hidden sm:block" />

						{/* User Capsule */}
						<div className="flex items-center gap-2.5 pl-1">
							<div className="size-8 rounded-full bg-[#FDF8ED] border border-[#F5D68B] text-[#854D0E] flex items-center justify-center text-xs font-bold shadow-2xs">
								{inisialNama}
							</div>
							<div className="hidden sm:block text-left">
								<p className="text-xs font-semibold text-zinc-900 leading-tight">
									{sesi.nama}
								</p>
								<p className="text-[10px] text-zinc-400 font-medium">
									{labelPeran}
								</p>
							</div>
						</div>
					</div>
				</header>

				{/* Mobile Navigation bar */}
				<div className="lg:hidden bg-white border-b border-[#EFECE6] px-4 py-2 overflow-x-auto flex gap-1">
					{daftarMenu.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-700 hover:bg-[#FAF8F5] hover:text-[#854D0E]"
						>
							{item.label}
						</Link>
					))}
				</div>

				{/* Body Content */}
				<main id="konten-utama" className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
					{children}
				</main>
			</div>
		</div>
	)
}
