
let projects = [
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

let selectedCategory = "Semua";
let searchKeyword = "";

// Mengubah angka menjadi format Rupiah
const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(angka);
};

// Memperbarui kartu statistik
const updateStats = () => {
    const totalProjects = projects.length;

    const totalBudget = projects.reduce(
        (total, project) => total + project.budget,
        0
    );

    const completedCount = projects.filter(
        project => project.completed
    ).length;

    document.getElementById("stat-total-projects").textContent =
        totalProjects;

    document.getElementById("stat-total-budget").textContent =
        formatRupiah(totalBudget);

    document.getElementById("stat-completed-projects").textContent =
        completedCount;
};

// Mengamankan teks judul proyek
const escapeHTML = (text) => {
    return String(text).replace(/[&<>"']/g, character => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];
    });
};

// Menampilkan proyek berdasarkan pencarian dan kategori
const renderProjects = () => {
    const container = document.getElementById("project-list");

    const filteredProjects = projects.filter(project => {
        const matchesCategory =
            selectedCategory === "Semua" ||
            project.category === selectedCategory;

        const matchesSearch = project.title
            .toLowerCase()
            .includes(searchKeyword.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    if (filteredProjects.length === 0) {
        container.innerHTML = `
            <p class="empty-message">
                Tidak ada proyek yang sesuai.
            </p>
        `;
        return;
    }

    container.innerHTML = filteredProjects.map(project => {
        const statusClass = project.completed
            ? "badge-success"
            : "badge-pending";

        const statusText = project.completed
            ? "Selesai"
            : "Dalam Pengerjaan";

        return `
            <article class="project-card">
                <div class="project-info">
                    <span class="project-category">
                        ${project.category}
                    </span>

                    <h3>${escapeHTML(project.title)}</h3>

                    <p class="project-budget">
                        ${formatRupiah(project.budget)}
                    </p>

                    <span class="badge ${statusClass}">
                        ${statusText}
                    </span>
                </div>

                <div class="project-actions">
                    <button
                        type="button"
                        class="btn-status"
                        data-action="toggle"
                        data-id="${project.id}"
                    >
                        Ubah Status
                    </button>

                    <button
                        type="button"
                        class="btn-delete"
                        data-action="delete"
                        data-id="${project.id}"
                    >
                        Hapus Proyek
                    </button>
                </div>
            </article>
        `;
    }).join("");
};

// Mengambil elemen formulir
const projectForm = document.getElementById("project-form");

const titleInput = document.getElementById("project-title");
const categoryInput = document.getElementById("project-category");
const budgetInput = document.getElementById("project-budget");
const completedInput = document.getElementById("project-completed");

// Fitur 1: Menambahkan proyek baru
projectForm.addEventListener("submit", event => {
    event.preventDefault();

    const title = titleInput.value.trim();
    const category = categoryInput.value;
    const budget = Number(budgetInput.value);
    const completed = completedInput.checked;

    // Validasi judul proyek
    if (title === "") {
        alert("Judul proyek tidak boleh kosong.");
        titleInput.focus();
        return;
    }

    // Validasi anggaran
    if (
        budgetInput.value.trim() === "" ||
        !Number.isFinite(budget) ||
        budget <= 0
    ) {
        alert("Anggaran harus lebih besar dari 0.");
        budgetInput.focus();
        return;
    }

    // Membuat objek proyek baru
    const newProject = {
        id: Date.now(),
        title: title,
        category: category,
        budget: budget,
        completed: completed
    };

    // Menambahkan proyek menggunakan spread operator
    projects = [...projects, newProject];

    // Mengosongkan formulir
    projectForm.reset();

    // Mengembalikan filter ke semua proyek
    selectedCategory = "Semua";

    document.querySelectorAll(".btn-filter").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.category === "Semua"
        );
    });

    searchKeyword = "";
    document.getElementById("search-input").value = "";

    updateStats();
    renderProjects();

    alert("Proyek berhasil ditambahkan.");
});

// Fitur 2: Pencarian real-time
document.getElementById("search-input").addEventListener(
    "input",
    event => {
        searchKeyword = event.target.value.trim();
        renderProjects();
    }
);

// Filter berdasarkan kategori
document.querySelectorAll(".btn-filter").forEach(button => {
    button.addEventListener("click", () => {
        selectedCategory = button.dataset.category;

        document.querySelectorAll(".btn-filter").forEach(item => {
            item.classList.toggle("active", item === button);
        });

        renderProjects();
    });
});

// Fitur 3: Ubah status dan hapus proyek
document.getElementById("project-list").addEventListener(
    "click",
    event => {
        const button = event.target.closest("button[data-action]");

        if (!button) {
            return;
        }

        const projectId = Number(button.dataset.id);
        const action = button.dataset.action;

        if (action === "toggle") {

            // Mengubah status menggunakan map()
            projects = projects.map(project => {
                if (project.id === projectId) {
                    return {
                        ...project,
                        completed: !project.completed
                    };
                }

                return project;
            });

        } else if (action === "delete") {

            const project = projects.find(
                item => item.id === projectId
            );

            if (!project) {
                return;
            }

            const confirmation = confirm(
                `Yakin ingin menghapus proyek "${project.title}"?`
            );

            if (!confirmation) {
                return;
            }

            // Menghapus proyek menggunakan filter()
            projects = projects.filter(
                project => project.id !== projectId
            );
        }

        // Memperbarui tampilan dan statistik
        updateStats();
        renderProjects();
    }
);

// Menampilkan data pertama kali
updateStats();
renderProjects();
