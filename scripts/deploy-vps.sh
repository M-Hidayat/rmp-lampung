#!/usr/bin/env bash
# Deploy RMP Lampung ke VPS mandiri.
#
# Menjalankan migrasi database SEBELUM aplikasi diarahkan ke trafik, dan
# MENGHENTIKAN seluruh proses bila migrasi gagal. Ini penting karena container
# aplikasi bisa saja "hijau" dengan database yang tidak punya tabel sama
# sekali - halaman login terbuka, tapi sistem tidak bisa dipakai.
#
# Pakai: bash scripts/deploy-vps.sh [--tls]
set -euo pipefail

APP_DIR="${APP_DIR:-$HOME/rmp-lampung}"
COMPOSE="sudo docker compose -f docker-compose.deploy.yml --env-file .env.docker"

cd "$APP_DIR"

echo "== 1/5 memeriksa berkas wajib =="
for berkas in docker-compose.deploy.yml .env.docker nginx/default.conf; do
	[ -f "$berkas" ] || { echo "GAGAL: $berkas tidak ditemukan di $APP_DIR"; exit 1; }
done
echo "   semua berkas ada"

echo "== 2/5 menyalakan database =="
$COMPOSE up -d postgres

echo "   menunggu database sehat (maks 120 detik)"
SEHAT=0
for i in $(seq 1 24); do
	if $COMPOSE exec -T postgres pg_isready -U "$(grep -E '^POSTGRES_USER=' .env.docker | cut -d= -f2)" >/dev/null 2>&1; then
		echo "   database siap"
		SEHAT=1
		break
	fi
	sleep 5
done
[ "$SEHAT" = "1" ] || { echo "GAGAL: database tidak pernah siap"; exit 1; }

echo "== 3/5 menerapkan migrasi (wajib berhasil) =="
# Dijalankan di dalam container aplikasi agar memakai DATABASE_URL yang sama
# dengan runtime, sehingga tidak ada perbedaan host/port antara migrasi dan app.
if ! $COMPOSE run --rm --no-deps app npx prisma migrate deploy; then
	echo "GAGAL: migrasi database tidak berhasil. Deploy dihentikan; aplikasi TIDAK dijalankan."
	echo "Periksa: $COMPOSE run --rm --no-deps app npx prisma migrate status"
	exit 1
fi

echo "   memverifikasi tidak ada drift antara database dan schema.prisma"
if ! $COMPOSE run --rm --no-deps app npx prisma migrate diff \
	--from-schema-datasource prisma/schema.prisma \
	--to-schema-datamodel prisma/schema.prisma --exit-code; then
	echo "GAGAL: skema database berbeda dari schema.prisma. Deploy dihentikan."
	exit 1
fi
echo "   migrasi bersih, tanpa drift"

echo "== 4/5 membangun & menyalakan aplikasi + nginx =="
$COMPOSE up -d --build app nginx

echo "   menunggu aplikasi sehat (maks 180 detik)"
SIAP=0
for i in $(seq 1 36); do
	STATUS=$(sudo docker inspect -f '{{.State.Health.Status}}' rmp_app 2>/dev/null || echo "tidak-ada")
	if [ "$STATUS" = "healthy" ]; then SIAP=1; break; fi
	echo "   [$i] status app: $STATUS"
	sleep 5
done
[ "$SIAP" = "1" ] || { echo "GAGAL: aplikasi tidak pernah sehat. Log:"; sudo docker logs rmp_app --tail 40; exit 1; }
echo "   aplikasi sehat"

echo "== 5/5 verifikasi dari luar container =="
DOMAIN=$(grep -E '^APP_URL=' .env.docker | cut -d= -f2 | sed 's#https\?://##')
KODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 20 "http://127.0.0.1/masuk" || echo 000)
echo "   http://127.0.0.1/masuk -> $KODE"
[ "$KODE" = "200" ] || { echo "GAGAL: nginx tidak melayani aplikasi dengan benar"; exit 1; }

if [ "${1:-}" = "--tls" ]; then
	echo "   memeriksa TLS untuk $DOMAIN"
	KTLS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 20 "https://$DOMAIN/masuk" || echo 000)
	echo "   https://$DOMAIN/masuk -> $KTLS"
	[ "$KTLS" = "200" ] || { echo "PERINGATAN: HTTPS belum melayani 200 - periksa sertifikat/DNS"; exit 1; }
fi

echo
echo "SELESAI. Aplikasi berjalan:"
echo "  - migrasi diterapkan dan bebas drift"
echo "  - container app sehat"
echo "  - HTTP melayani 200"
