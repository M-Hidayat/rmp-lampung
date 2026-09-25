#!/usr/bin/env bash
#
# Perpanjang sertifikat Let's Encrypt lalu reload nginx bila benar-benar berubah.
#
# Aman dijalankan sesering apa pun: `certbot renew` hanya memperbarui sertifikat
# yang tersisa <= 30 hari, jadi hari-hari biasa skrip ini tidak mengubah apa pun.
#
# Kunci keamanannya: RELOAD HANYA TERJADI BILA ADA SERTIFIKAT YANG BENAR-BENAR
# DIPERBARUI. Caranya lewat --deploy-hook yang hanya dipanggil certbot saat ada
# pembaruan nyata, dan menulis jejak ke berkas penanda. Tanpa itu, nginx akan
# di-reload setiap hari tanpa alasan.
#
# Pemakaian:
#   bash scripts/perbarui-sertifikat.sh           # perpanjang bila perlu
#   bash scripts/perbarui-sertifikat.sh --status  # hanya laporkan masa berlaku

set -uo pipefail

VOLUME_LETSENCRYPT="${VOLUME_LETSENCRYPT:-serbamager_letsencrypt}"
VOLUME_WWW="${VOLUME_WWW:-serbamager_certbot-www}"
KONTAINER_NGINX="${KONTAINER_NGINX:-serbamager-nginx-1}"
IMAGE_CERTBOT="${IMAGE_CERTBOT:-certbot/certbot}"

log() { printf '[%s] %s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$*"; }

# ------- Mode status: laporkan masa berlaku tanpa mengubah apa pun -------
if [ "${1:-}" = "--status" ]; then
	sudo docker run --rm \
		-v "${VOLUME_LETSENCRYPT}:/etc/letsencrypt" \
		"${IMAGE_CERTBOT}" certificates 2>&1 | grep -E "Certificate Name|Expiry Date|Identifiers"
	exit $?
fi

TANDA="$(mktemp /tmp/tanda-renew.XXXXXX)"
trap 'rm -f "${TANDA}"' EXIT

log "Menjalankan certbot renew (hanya memperbarui bila <= 30 hari)."

sudo docker run --rm \
	-v "${VOLUME_LETSENCRYPT}:/etc/letsencrypt" \
	-v "${VOLUME_WWW}:/var/www/certbot" \
	-v "${TANDA}:/tanda-renew" \
	"${IMAGE_CERTBOT}" renew \
	--webroot --webroot-path /var/www/certbot \
	--non-interactive --quiet \
	--deploy-hook 'date -u +%Y-%m-%dT%H:%M:%SZ > /tanda-renew'
KODE=$?

if [ "${KODE}" -ne 0 ]; then
	log "GAGAL: certbot renew keluar dengan kode ${KODE}. Sertifikat tidak diubah."
	exit "${KODE}"
fi

if [ -s "${TANDA}" ]; then
	# Ada sertifikat yang benar-benar diperbarui -> uji konfigurasi dulu.
	if sudo docker exec "${KONTAINER_NGINX}" nginx -t >/dev/null 2>&1; then
		sudo docker exec "${KONTAINER_NGINX}" nginx -s reload
		log "Sertifikat diperbarui pada $(cat "${TANDA}"); nginx di-reload."
	else
		log "PERINGATAN: konfigurasi nginx tidak valid setelah pembaruan. Reload DIBATALKAN."
		exit 1
	fi
else
	log "Belum waktunya diperbarui (sisa > 30 hari). Tidak ada perubahan, nginx tidak di-reload."
fi