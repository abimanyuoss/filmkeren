# FilmKeren

FilmKeren adalah aplikasi admin cinema berbasis Next.js dan React, dibuat dari desain di folder `stitch_cinema_netflix_dashboard`.

## Menjalankan Lokal

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

## Neon Database

1. Buat database PostgreSQL di Neon.
2. Salin connection string ke file `.env`:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST.neon.tech/DBNAME?sslmode=require"
```

3. Jalankan schema dan seed:

```bash
npm run db:setup
```

Jika `DATABASE_URL` belum diisi, aplikasi tetap berjalan memakai data demo lokal.
