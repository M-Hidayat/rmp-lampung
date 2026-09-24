DO $$ BEGIN IF EXISTS (SELECT 1 FROM "User" WHERE peran::text = 'PEMILIK') THEN RAISE EXCEPTION 'Jalankan npm run admin:provision sebelum migration'; END IF; END $$;
ALTER TABLE "User" ALTER COLUMN "peran" DROP DEFAULT;
CREATE TYPE "Peran_baru" AS ENUM ('ADMIN', 'USER');
ALTER TABLE "User" ALTER COLUMN "peran" TYPE "Peran_baru" USING ("peran"::text::"Peran_baru");
DROP TYPE "Peran";
ALTER TYPE "Peran_baru" RENAME TO "Peran";
ALTER TABLE "User" ALTER COLUMN "peran" SET DEFAULT 'USER';
