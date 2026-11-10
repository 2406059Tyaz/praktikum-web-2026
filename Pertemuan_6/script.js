
document.addEventListener("DOMContentLoaded", () => {

    // 1. Mengambil elemen HTML
    const btnFetch = document.querySelector("#btnFetch");
    const statusMessage = document.querySelector("#statusMessage");
    const userList = document.querySelector("#userList");

    // 2. Fungsi mengambil data pengguna
    const fetchUsers = async () => {

        btnFetch.disabled = true;
        statusMessage.textContent = "Sedang memuat data dari server...";
        statusMessage.className = "status-msg";
        userList.innerHTML = "";

        try {

            // Mengambil data dari API
            const response = await fetch(
                "https://jsonplaceholder.typicode.com/users"
            );

            // Memeriksa respons server
            if (!response.ok) {
                throw new Error(
                    `Gagal mengambil data! Status HTTP: ${response.status}`
                );
            }

            // Mengubah JSON menjadi objek JavaScript
            const users = await response.json();

            // Menampilkan jumlah data
            statusMessage.textContent =
                `Berhasil memuat ${users.length} data pengguna!`;

            // Menampilkan data pengguna
            renderUsers(users);

        } catch (error) {

            // Menangani kesalahan
            statusMessage.textContent =
                `Gagal memuat data: ${error.message}`;

            statusMessage.className = "status-msg error";

        } finally {

            // Mengaktifkan kembali tombol
            btnFetch.disabled = false;

        }
    };

    // 3. Fungsi membuat kartu pengguna
    const renderUsers = (users) => {

        userList.innerHTML = "";

        users.forEach(user => {

            const card = document.createElement("div");
            card.className = "user-card";

            card.innerHTML = `
                <div class="user-name">${user.name}</div>
                <div class="user-email">${user.email}</div>
                <div class="user-company">${user.company.name}</div>
            `;

            userList.appendChild(card);

        });
    };

    // 4. Menjalankan fungsi ketika tombol diklik
    btnFetch.addEventListener("click", fetchUsers);

});
