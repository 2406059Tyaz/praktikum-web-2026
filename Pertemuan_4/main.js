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

// Mengamankan teks judul yang ditampilkan dalam HTML
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

// Menambahkan proyek baru
const projectForm = document.getElementById("project-form");

projectForm.addEventListener("submit", event => {
    event.preventDefault();

    const titleInput = document.getElementById("project-title");
    const categoryInput = document.getElementById("project-category");
    const budgetInput = document.getElementById("project-budget");
    const completedInput = document.getElementById("project-completed");

    const title = titleInput.value.trim();
    const category = categoryInput.value;
    const budget = Number(budgetInput.value);
    const completed = completedInput.checked;

    if (title === "") {
        alert("Judul proyek tidak boleh kosong.");
        titleInput.focus();
        return;
    }

    if (!Number.isFinite(budget) || budget <= 0) {
        alert("Anggaran harus lebih besar dari 0.");
        budgetInput.focus();
        return;
    }

    const newProject = {
        id: Date.now(),
        title: title,
        category: category,
        budget: budget,
        completed: completed
    };

    projects.push(newProject);

    projectForm.reset();

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

// Pencarian real-time
document.getElementById("search-input").addEventListener(
    "input",
    event => {
        searchKeyword = event.target.value.trim();
        renderProjects();
    }
);

// Filter kategori
document.querySelectorAll(".btn-filter").forEach(button => {
    button.addEventListener("click", () => {
        selectedCategory = button.dataset.category;

        document.querySelectorAll(".btn-filter").forEach(item => {
            item.classList.toggle("active", item === button);
        });

        renderProjects();
    });
});

// Aksi ubah status dan hapus proyek
document.getElementById("project-list").addEventListener(
    "click",
    event => {
        const button = event.target.closest("button[data-action]");

        if (!button) {
            return;
        }

        const projectId = Number(button.dataset.id);
        const action = button.dataset.action;

        const project = projects.find(item => item.id === projectId);

        if (!project) {
            return;
        }

        if (action === "toggle") {
            project.completed = !project.completed;

            updateStats();
            renderProjects();
        }

        if (action === "delete") {
            const confirmation = confirm(
                `Yakin ingin menghapus proyek "${project.title}"?`
            );

            if (!confirmation) {
                return;
            }

            const index = projects.findIndex(
                item => item.id === projectId
            );

            if (index !== -1) {
                projects.splice(index, 1);
            }

            updateStats();
            renderProjects();
        }
    }
);

// Menampilkan data pertama kali
updateStats();
renderProjects();