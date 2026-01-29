document.getElementById("studentForm").addEventListener("submit", async function(event) {
  event.preventDefault();

  const student = {
    name: document.getElementById("name").value,
    regno: document.getElementById("regno").value,
    dept: document.getElementById("dept").value,
    section: document.getElementById("section").value
  };

  await fetch("https://script.google.com/macros/s/AKfycbxHuWuhHbzzjq4Pqju0u_oUquTPutSh4T4Ab7umvl6oO3yLyOHdj1RBzFKD_E8tqV9qKA/exec", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(student)
  });

  document.getElementById("confirmation").textContent = "✔️ Thank you for filling your details!";
  document.getElementById("studentForm").reset();
  document.getElementById("confirmation").classList.add("show");

  setTimeout(() => {
    document.getElementById("confirmation").classList.remove("show");
  }, 3000);
});
