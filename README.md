# Aplikasi Todo Frontend

Aplikasi Todo ini adalah solusi sederhana untuk mengelola daftar tugas Anda. Dibangun dengan teknologi _frontend_ modern, aplikasi ini memungkinkan Anda untuk membuat, melihat, memperbarui, dan menghapus tugas, serta memiliki fitur otentikasi pengguna.

---

## Fitur

### Fitur Wajib

- **Autentikasi Pengguna**:
  - **Daftar (Register)**: Membuat akun pengguna baru.
  - **Masuk (Log In)**: Mengakses aplikasi dengan kredensial yang ada.
- **Operasi CRUD (Create, Read, Update, Delete) untuk Todo**:
  - **Buat (Create)**: Menambahkan tugas baru ke daftar.
  - **Lihat (Read)**: Menampilkan semua tugas yang ada.
  - **Perbarui (Update)**: Menandai tugas sebagai selesai/belum selesai.
  - **Hapus (Delete)**: Menghapus tugas dari daftar.
- **Filter Todo**: Memfilter daftar tugas berdasarkan kriteria tertentu (misalnya, selesai, belum selesai, semua).

### Fitur Opsional

- **Halaman Admin**:
  - Menampilkan informasi pengguna.
  - Dilengkapi dengan fitur _pagination_ dan _filtering_ untuk pengelolaan data pengguna yang lebih baik.

---

## Teknologi yang Digunakan

Aplikasi ini dibangun menggunakan tumpukan teknologi berikut:

- **Bahasa/Framework**:
  - **TypeScript**: Menambahkan keamanan tipe ke JavaScript.
  - **Next.js**: _Framework_ React untuk pengembangan aplikasi _web_ yang siap produksi.
- **Kerangka Kerja CSS/UI Kit**:
  - **Tailwind CSS**: Kerangka kerja CSS _utility-first_ untuk _styling_ yang cepat dan kustomisasi.
  - **Shadcn UI**: Koleksi komponen UI yang dapat diakses dan dapat disesuaikan.
- **Pustaka Pihak Ketiga**:
  - **React Query**: Untuk manajemen data _asynchronous_ yang efisien.
  - **Zod**: Skema deklarasi dan validasi untuk memastikan integritas data.
  - **Zustand**: Solusi manajemen _state_ yang kecil dan cepat.
  - **Axios**: Klien HTTP berbasis _Promise_ untuk membuat permintaan ke API.
  - **Clsx**: _Utility_ kecil untuk mengkondisikan nama kelas secara kondisional.
  - **Date Fns**: Pustaka utilitas tanggal yang komprehensif.
  - **Sonner**: Pustaka untuk notifikasi _toast_ yang cantik.

---

## Instalasi dan Menjalankan Proyek

Untuk menjalankan proyek ini secara lokal, ikuti langkah-langkah berikut:

1.  **Kloning Repositori**:

    ```bash
    git clone [URL_REPOSITORI_ANDA]
    cd [nama-folder-aplikasi]
    ```

    _(Ganti `[URL_REPOSITORI_ANDA]` dengan URL repositori GitHub pribadi Anda dan `[nama-folder-aplikasi]` dengan nama folder tempat Anda mengkloning repositori)._

2.  **Instal Dependensi**:

    ```bash
    npm install
    # atau
    yarn install
    # atau
    pnpm install
    ```

3.  **Variabel Lingkungan**:
    Buat file `.env.local` di _root_ proyek dan tambahkan URL API:

    ```
    NEXT_PUBLIC_API_BASE_URL=https://fe-test-api.nwappservice.com
    ```

4.  **Jalankan Aplikasi**:

    ```bash
    npm run dev
    # atau
    yarn dev
    # atau
    pnpm dev
    ```

    Aplikasi akan berjalan di `http://localhost:3000`.

---

## API

Aplikasi ini berinteraksi dengan API berikut:

- **Base API URL**: `https://fe-test-api.nwappservice.com`
- **Endpoints Spesifik**:
  - Daftar (Register): `/register`
  - Masuk (Log In): `/login`
  - Todos: `/todos`

### Kredensial Admin

Untuk mengakses halaman admin (jika diimplementasikan):

- **Email**: `eko@nodewave.id`
- **Kata Sandi**: `eko123`

---

## Deployment

Aplikasi ini di-deploy menggunakan **Vercel**. Kode sumbernya di-host di repositori **GitHub pribadi**.

---

## Kontribusi

Kontribusi dipersilakan\! Silakan buka _issue_ atau kirim _pull request_ untuk perbaikan atau fitur baru.

---

## Lisensi

Proyek ini dilisensikan di bawah Lisensi MIT - lihat file [LICENSE](LICENSE) untuk detail.

---
