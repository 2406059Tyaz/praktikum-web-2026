// Praktik Manipulasi Array of Objects dengan ES6+

const projects = [
    {
        id: 1,
        title: "Sistem Inventaris Keuangan",
        category: "Web App",
        budget: 2500000,
        completed: true
    },
    {
        id: 2,
        title: "Sistem Kasir Digital POS",
        category: "Desktop App",
        budget: 5000000,
        completed: true
    },
    {
        id: 3,
        title: "Landing Page Profil Perusahaan",
        category: "Web App",
        budget: 1500000,
        completed: false
    },
    {
        id: 4,
        title: "Aplikasi Presensi GPS Mobile",
        category: "Mobile App",
        budget: 4500000,
        completed: false
    }
];

// Fungsi untuk memformat angka menjadi Rupiah
const formatRupiah = angka => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(angka);
};

// 1. Menampilkan semua proyek menggunakan forEach()
console.log("=== 1. SEMUA DAFTAR PROYEK ===");

projects.forEach((project, index) => {
    const status = project.completed
        ? "[SELESAI]"
        : "[PROSES]";

    console.log(
        `${index + 1}. ${status} ${project.title} ` +
        `(${project.category}) - ${formatRupiah(project.budget)}`
    );
});

// 2. Menampilkan proyek kategori Web App menggunakan filter()
console.log("\n=== 2. PROYEK KATEGORI WEB APP ===");

const webProjects = projects.filter(
    project => project.category === "Web App"
);

console.table(webProjects);

// 3. Membuat ringkasan proyek menggunakan map()
console.log("\n=== 3. RINGKASAN NAMA DAN ANGGARAN ===");

const ringkasanProyek = projects.map(project => ({
    nama: project.title,
    biaya: formatRupiah(project.budget)
}));

console.table(ringkasanProyek);

// 4. Menghitung total anggaran menggunakan reduce()
console.log("\n=== 4. TOTAL ANGGARAN ===");

const totalAnggaran = projects.reduce(
    (total, project) => total + project.budget,
    0
);

console.log(
    `Total Estimasi Anggaran: ${formatRupiah(totalAnggaran)}`
);

// 5. Menghitung total anggaran proyek yang sudah selesai
console.log("\n=== 5. ANGGARAN PROYEK SELESAI ===");

const totalSelesai = projects
    .filter(project => project.completed)
    .reduce((total, project) => total + project.budget, 0);

console.log(
    `Total Anggaran Proyek Selesai: ${formatRupiah(totalSelesai)}`
);