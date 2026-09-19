# Wylie Neuro — Score Calculator

Ekstensi Chrome untuk pencarian cepat dan kalkulator interaktif berbagai *scoring system* di bidang neurologi. Dibuat untuk membantu residen dan dokter neurologi mengakses skor klinis dengan cepat langsung dari toolbar browser. tanpa perlu online, bisa digunakan dalam jaringan wifi lokal yang tidak dapat mengakses internet.

##  Fitur

-  **Pencarian instan** — cari skor (NIHSS, GCS, mRS, dll) langsung dari popup ekstensi.
-  **Kalkulator interaktif** — sejumlah skor dilengkapi kalkulator langsung (ditandai badge `CALC`).
-  **109+ scoring system** terorganisir dalam **13 divisi neurologi**: Neurovaskular, Neuroinfeksi, Neuroimunologi, Neuropain, Neurobehavior, Epilepsi, Neuromuskuler, Neuro-ICU, Neurorehabilitasi, Sleep Neurology, Neurokhusus, Neuro-Onkologi, dan Preoperatif.
-  **Navigasi keyboard** — `↑` `↓` untuk navigasi, `Enter` untuk membuka, `Esc` untuk menutup.
-  Antarmuka gelap yang ringan dan cepat, dirancang untuk penggunaan klinis sehari-hari.

##  Instalasi (Developer Mode)

1. Clone atau download repository ini.
2. Buka Chrome dan navigasikan ke `chrome://extensions`.
3. Aktifkan **Developer mode** (toggle di kanan atas).
4. Klik **Load unpacked**, lalu pilih folder repository ini.
5. Ikon ekstensi "Wylie Neuro" akan muncul di toolbar Chrome.

##  Cara Pakai

1. Klik ikon ekstensi di toolbar Chrome.
2. Ketik nama skor pada kolom pencarian (contoh: `NIHSS`, `GCS`, `mRS`).
3. Gunakan panah atas/bawah untuk memilih, lalu tekan `Enter` untuk membuka detail/kalkulator skor.
4. Klik **Buka Semua Score** untuk melihat daftar lengkap semua skor yang tersedia.

##  Struktur Proyek

```
├── manifest.json       # Konfigurasi ekstensi (Manifest V3)
├── popup.html          # Tampilan popup ekstensi
├── popup.js            # Logika pencarian & navigasi popup
├── scores-data.js       # Indeks/metadata seluruh scoring system
├── scores.js           # Logika & definisi kalkulator skor
├── index.html          # Halaman referensi lengkap scoring system
├── icons/              # Ikon ekstensi
└── Images/             # Aset gambar referensi (mis. ASPECT Score, Stupp protocol)
```

##  Teknologi

- Vanilla JavaScript, HTML, CSS (tanpa dependency eksternal)
- Chrome Extension **Manifest V3**

##  Disclaimer

Ekstensi ini dibuat sebagai alat bantu referensi cepat dan **tidak menggantikan penilaian klinis profesional**. Selalu verifikasi hasil perhitungan dan gunakan penilaian klinis yang sesuai sebelum mengambil keputusan medis.

##  Author

Dibuat oleh **Wylie Neuro**.

##  Lisensi

Belum ditentukan — silakan tambahkan lisensi sesuai kebutuhan sebelum distribusi publik.
