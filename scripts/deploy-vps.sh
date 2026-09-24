#!/usr/bin/env bash
# Deploy/refresh RMP Lampung di VPS bersama serbamager.
#
# Arsitektur nyata: stack ini TIDAK menjalankan nginx sendiri. nginx milik
# stack serbamager (port 80/443) mem-proxy vhost rumahmamapintar.my.id ke
# container app lewat jaringan Docker `serbamager_default` dengan alias rmp-app.
#
# Urutan ini penting: migrasi dijalankan SEBELUM app dianggap berhasil, dan
# seluruh proses berhenti bila migrasi gagal. Tanpa itu, container bisa
# terlihat sehat dengan database yang tidak punya tabel sama sekali.
#
# Pakai: bash scripts/deploy-vps.sh
set -euo pipefail

APP_DIR="${APP_DIR:-$HOME/rmp-lampung}"
KOMPOS="sudo docker compose -f docker-compose.deploy.yml --env-file .env.docker"

cd "$APP_DIR"

echo "== 1/6 memeriksa berkas wajib =="
for berkas in docker-compose.deploy.yml .env.docker Dockerfile; do
	[ -f "$berkas" ] || { echo "GAGAL: $berkas tidak ada di $APP_DIR"; exit 1; }
done
grep -q '^DATABASE_URL=' .env.docker || { echo "GAGAL: DATABASE_URL belum ada di .env.docker"; exit 1; }
echo "   berkas lengkap"

echo "== 2/6 memastikan jaringan nginx serbamager ada =="
sudo docker network inspect serbamager_default >/dev/null 2>&1 \
	|| { echo "GAGAL: jaringan serbamager_default tidak ditemukan"; exit 1; }
echo "   jaringan siap"

echo "== 3/6 menyalakan database =="
$KOMPOS up -d postgres
for i in $(seq 1 24); do
	if sudo docker exec rmp_postgres pg_isready -U "$(grep -m1 '^POSTGRES_USER=' .env.docker | cut -d= -f2-)" >/dev/null 2>&1; then
		echo "   database siap"; break
	fi
	[ "$i" = "24" ] && { echo "GAGAL: database tidak pernah siap"; exit 1; }
	sleep 5
done

echo "== 4/6 menerapkan migrasi (wajib berhasil) =="
# Dijalankan lewat profil `tools` karena image runtime standalone tidak membawa
# Prisma CLI. Stage `migrator` sudah melakukan `prisma generate`.
if ! $KOMPOS --profile tools run --rm --no-deps migrate; then
	echo "GAGAL: migrasi tidak berhasil. Aplikasi TIDAK dijalankan."
	exit 1
fi

echo "   memverifikasi tidak ada drift skema"
if ! $KOMPOS --profile tools run --rm --no-deps --entrypoint npx migrate \
	prisma migrate diff --from-schema-datasource prisma/schema.prisma \
	--to-schema-datamodel prisma/schema.prisma --exit-code; then
	echo "GAGAL: skema database berbeda dari schema.prisma."
	exit 1
fi
echo "   migrasi bersih, tanpa drift"

echo "== 5/6 membangun & menyalakan aplikasi =="
$KOMPOS up -d --build app
for i in $(seq 1 36); do
	s=$(sudo docker inspect -f '{{.State.Health.Status}}' rmp_app 2>/dev/null || echo none)
	[ "$s" = "healthy" ] && { echo "   aplikasi sehat"; break; }
	[ "$i" = "36" ] && { echo "GAGAL: aplikasi tidak sehat"; sudo docker logs rmp_app --tail 40; exit 1; }
	sleep 5
done

echo "== 6/6 verifikasi publik =="
DOMAIN="rumahmamapintar.my.id"
for u in "https://$DOMAIN/masuk" "https://www.$DOMAIN/masuk"; do
	printf '   %-46s ' "$u"
	curl -s -o /dev/null -w '%{http_code}\n' --max-time 20 "$u"
done
KODE=$(curl -s -o /dev/null -w '%{http_code}' --max-time 20 "https://$DOMAIN/masuk")
[ "$KODE" = "200" ] || { echo "GAGAL: HTTPS belum melayani 200"; exit 1; }
JUDUL=$(curl -s --max-time 20 "https://$DOMAIN/masuk" | grep -oE '<title>[^<]*</title>' | head -1)
echo "   identitas: $JUDUL"

echo
echo "SELESAI: migrasi diterapkan, aplikasi sehat, HTTPS melayani 200."
