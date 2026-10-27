// Praktik Dasar Sintaks, Tipe Data, dan Arrow Function

const namaProgrammer = "Tyaz Hakim";
const tahunMulai = 2022;
const tahunSekarang = new Date().getFullYear();

// Menghitung lama pengalaman
const hitungPengalaman = (mulai, sekarang) => sekarang - mulai;

const masaKerja = hitungPengalaman(
    tahunMulai,
    tahunSekarang
);

// Menentukan kategori pengalaman
const statusSenioritas = masaKerja >= 2
    ? "Mid-Level Developer"
    : "Junior Developer";

// Menampilkan informasi programmer
console.log("=== INFORMASI PENGEMBANG ===");
console.log(`Nama        : ${namaProgrammer}`);
console.log(`Pengalaman  : ${masaKerja} tahun`);
console.log(`Kategori    : ${statusSenioritas}`);

// Menguji perbandingan tipe data
console.log("\n=== UJI PERBANDINGAN TIPE DATA ===");

console.log("10 == '10'  :", 10 == "10");
console.log("10 === '10' :", 10 === "10");

console.log("Tipe 10     :", typeof 10);
console.log("Tipe '10'   :", typeof "10");

// Contoh penggunaan let dan const
const namaAplikasi = "Interactive Portfolio Tracker";
let jumlahProyek = 4;

jumlahProyek += 1;

console.log("\n=== INFORMASI APLIKASI ===");
console.log(`Nama aplikasi : ${namaAplikasi}`);
console.log(`Jumlah proyek : ${jumlahProyek}`);