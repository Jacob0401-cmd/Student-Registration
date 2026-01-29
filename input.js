
document.getElementById("studentForm").addEventListener("submit", async function(event) {
  event.preventDefault(); // stop page reload

  // Get values
  const name = document.getElementById("name").value;
  const regno = document.getElementById("regno").value;
  const dept = document.getElementById("dept").value;
  const section = document.getElementById("section").value;
  
   await fetch("http://localhost:5000/addStudent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, regno, dept, section })
  });
   
  document.getElementById("confirmation").textContent = "✔️ Thank you for filling your details!";
  document.getElementById("studentForm").reset();
   confirmation.classList.add("show");


   
    setTimeout(() => {
    confirmation.classList.remove("show");
  }, 3000);

  loadStudents(); // refresh list
});
  const cors = require("cors");
app.use(cors());

 
  async function loadStudents() {
  const res = await fetch("http://localhost:5000/index");
  const students = await res.json();

  const list = document.getElementById("studentList");
  list.innerHTML = "";
  students.forEach(student => {
    const li = document.createElement("li");
    li.textContent = `Name: ${student.name}, Reg No: ${student.regno}, Dept: ${student.dept}, Section: ${student.section}`;
    list.appendChild(li);
  });
   document.getElementById("studentForm").reset();
}
 

  window.onload = loadStudents;