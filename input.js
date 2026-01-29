// Utility: open IndexedDB
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("StudentDB", 1);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("students")) {
        db.createObjectStore("students", { keyPath: "regno" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Save student locally
async function saveStudentOffline(student) {
  const db = await openDB();
  const tx = db.transaction("students", "readwrite");
  tx.objectStore("students").put(student);
  return tx.complete;
}

// Get all students
async function getStudentsOffline() {
  const db = await openDB();
  return new Promise((resolve) => {
    const tx = db.transaction("students", "readonly");
    const store = tx.objectStore("students");
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
  });
}

// Try syncing offline students to server
async function syncStudents() {
  const students = await getStudentsOffline();
  for (const student of students) {
    try {
      await fetch("http://localhost:5000/addStudent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(student)
      });
    } catch (err) {
      console.log("Server offline, will retry later.");
    }
  }
}

// Form submission
document.getElementById("studentForm").addEventListener("submit", async function(event) {
  event.preventDefault();

  const student = {
    name: document.getElementById("name").value,
    regno: document.getElementById("regno").value,
    dept: document.getElementById("dept").value,
    section: document.getElementById("section").value
  };

  // Save offline first
  await saveStudentOffline(student);

  // Try sending to server
  try {
    await fetch("http://localhost:5000/addStudent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(student)
    });
  } catch (err) {
    console.log("Server offline, student saved locally.");
  }

  document.getElementById("confirmation").textContent = "✔️ Thank you for filling your details!";
  document.getElementById("confirmation").classList.add("show");

  setTimeout(() => {
    document.getElementById("confirmation").classList.remove("show");
  }, 3000);

  document.getElementById("studentForm").reset();
  loadStudents();
});

// Load students (from local DB)
async function loadStudents() {
  const students = await getStudentsOffline();
  const list = document.getElementById("studentList");
  list.innerHTML = "";
  students.forEach(student => {
    const li = document.createElement("li");
    li.textContent = `Name: ${student.name}, Reg No: ${student.regno}, Dept: ${student.dept}, Section: ${student.section}`;
    list.appendChild(li);
  });
}

// Sync when online
window.addEventListener("online", syncStudents);

// Initial load
window.onload = loadStudents;
