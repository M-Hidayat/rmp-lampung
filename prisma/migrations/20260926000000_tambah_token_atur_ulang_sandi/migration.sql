-- Token atur ulang kata sandi (fitur "lupa kata sandi").
--
-- Mengikuti pola token absensi: kolom `tokenHash` menyimpan SHA-256 dari token,
-- sehingga token mentah tidak pernah tersimpan di basis data. Kolom
-- `dipakaiPada` membuat token sekali pakai, dan `kedaluwarsaPada` membatasinya
-- dengan waktu.
--
-- ON DELETE CASCADE: menghapus pengguna otomatis membersihkan tokennya.

-- CreateTable
CREATE TABLE "TokenAturUlangSandi" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "kedaluwarsaPada" TIMESTAMP(3) NOT NULL,
    "dipakaiPada" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TokenAturUlangSandi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TokenAturUlangSandi_tokenHash_key" ON "TokenAturUlangSandi"("tokenHash");

-- CreateIndex
CREATE INDEX "TokenAturUlangSandi_userId_idx" ON "TokenAturUlangSandi"("userId");

-- AddForeignKey
ALTER TABLE "TokenAturUlangSandi" ADD CONSTRAINT "TokenAturUlangSandi_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
