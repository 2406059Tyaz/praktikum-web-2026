```javascript
// ========================================
// MODUL 5: TO-DO LIST
// Manipulasi DOM, Event Handling,
// Validasi Form, dan LocalStorage
// ========================================

document.addEventListener("DOMContentLoaded", () => {

    // 1. Memilih elemen HTML (DOM Selection)
    const todoForm = document.querySelector("#todoForm");
    const taskInput = document.querySelector("#taskInput");
    const inputError = document.querySelector("#inputError");
    const todoList = document.querySelector("#todoList");
    const taskCounter = document.querySelector("#taskCounter");
    const clearCompletedBtn = document.querySelector("#clearCompletedBtn");
    const taskLimitMessage = document.querySelector("#taskLimitMessage");

    // 2. Membaca dan menyimpan data LocalStorage
    const getTasks = () => {
        try {
            return JSON.parse(localStorage.getItem("todo_tasks")) || [];
        } catch (error) {
            console.error("Gagal membaca data tugas:", error);
            return [];
        }
    };

    const saveTasks = (tasks) => {
        localStorage.setItem("todo_tasks", JSON.stringify(tasks));
    };

    // 3. Menghitung jumlah tugas
    const updateCounter = (tasks) => {
        const total = tasks.length;
        const selesai = tasks.filter(task => task.completed).length;
        const belumSelesai = total - selesai;

        taskCounter.textContent =
            `Total: ${total} Tugas | Selesai: ${selesai} | Belum Selesai: ${belumSelesai}`;

        // Menampilkan peringatan merah jika sudah ada 5 tugas
        if (taskLimitMessage) {
            taskLimitMessage.style.display =
                total >= 5 ? "block" : "none";
        }
    };

    // 4. Menampilkan daftar tugas
    const renderTasks = () => {
        const tasks = getTasks();

        todoList.innerHTML = "";

        // Memperbarui penghitung dan peringatan
        updateCounter(tasks);

        if (tasks.length === 0) {
            const pesan = document.createElement("li");

            pesan.textContent = "Belum ada tugas tersimpan.";
            pesan.style.textAlign = "center";
            pesan.style.color = "#64748b";
            pesan.style.fontSize = "13px";
            pesan.style.padding = "10px";

            todoList.appendChild(pesan);
            return;
        }

        tasks.forEach((task, index) => {
            const li = document.createElement("li");

            li.className = "todo-item";

            if (task.completed) {
                li.classList.add("completed");
            }

            // Membuat teks tugas
            const taskText = document.createElement("span");
            taskText.className = "todo-text";
            taskText.textContent = task.text;

            // Membuat tempat tombol
            const actions = document.createElement("div");
            actions.className = "todo-actions";

            // Tombol selesai atau batal
            const completeBtn = document.createElement("button");
            completeBtn.type = "button";
            completeBtn.className = "action-btn complete-btn";
            completeBtn.dataset.index = index;
            completeBtn.textContent =
                task.completed ? "Batal" : "Selesai";

            // Tombol hapus
            const deleteBtn = document.createElement("button");
            deleteBtn.type = "button";
            deleteBtn.className = "action-btn delete-btn";
            deleteBtn.dataset.index = index;
            deleteBtn.textContent = "Hapus";

            actions.appendChild(completeBtn);
            actions.appendChild(deleteBtn);

            li.appendChild(taskText);
            li.appendChild(actions);

            todoList.appendChild(li);
        });
    };

    // 5. Menambahkan tugas dengan validasi
    todoForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const taskText = taskInput.value.trim();

        // Memeriksa input kosong atau kurang dari 3 karakter
        if (taskText.length < 3) {
            taskInput.classList.add("error");
            inputError.textContent =
                "Tugas tidak boleh kosong atau kurang dari 3 karakter!";
            inputError.style.display = "block";
            taskInput.focus();
            return;
        }

        // Menghilangkan pesan error jika input valid
        taskInput.classList.remove("error");
        inputError.style.display = "none";

        // Memeriksa jumlah tugas sebelum menambahkan
        const tasks = getTasks();

        if (tasks.length >= 5) {
            alert(
                "Maksimal 5 tugas! Hapus tugas lama untuk menambahkan tugas baru."
            );

            taskInput.value = "";
            taskInput.focus();
            return;
        }

        // Menambahkan tugas baru
        tasks.push({
            text: taskText,
            completed: false
        });

        // Menyimpan dan memperbarui tampilan
        saveTasks(tasks);
        renderTasks();

        taskInput.value = "";
        taskInput.focus();
    });

    // Menghilangkan tanda error saat pengguna mengetik
    taskInput.addEventListener("input", () => {
        taskInput.classList.remove("error");
        inputError.style.display = "none";
    });

    // 6. Menangani tombol Selesai dan Hapus
    todoList.addEventListener("click", (e) => {
        const target = e.target;

        if (target.dataset.index === undefined) {
            return;
        }

        const index = Number(target.dataset.index);
        const tasks = getTasks();

        // Mengubah status tugas
        if (target.classList.contains("complete-btn")) {
            tasks[index].completed = !tasks[index].completed;

            saveTasks(tasks);
            renderTasks();
        }

        // Konfirmasi sebelum menghapus
        else if (target.classList.contains("delete-btn")) {
            const yakin = confirm(
                "Apakah Anda yakin ingin menghapus tugas ini?"
            );

            if (yakin) {
                tasks.splice(index, 1);

                saveTasks(tasks);
                renderTasks();
            }
        }
    });

    // 7. Membersihkan tugas yang sudah selesai
    clearCompletedBtn.addEventListener("click", () => {
        const tasks = getTasks();

        const tugasSelesai = tasks.filter(task => task.completed);
        const tugasBelumSelesai = tasks.filter(task => !task.completed);

        if (tugasSelesai.length === 0) {
            alert("Tidak ada tugas selesai untuk dibersihkan.");
            return;
        }

        const yakin = confirm(
            `Hapus ${tugasSelesai.length} tugas yang sudah selesai?`
        );

        if (yakin) {
            saveTasks(tugasBelumSelesai);
            renderTasks();

            alert("Tugas yang selesai berhasil dibersihkan.");
        }
    });

    // 8. Menampilkan data saat halaman dibuka
    renderTasks();

});
```