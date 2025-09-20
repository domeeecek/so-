document.getElementById("paymentForm").addEventListener("submit", (e) => {
  e.preventDefault()
  document.getElementById("paymentForm").classList.add("hidden")
  document.getElementById("success").classList.remove("hidden")

  let user = JSON.parse(localStorage.getItem("payingUser"))
  let plate = localStorage.getItem("payingPlate")
  if (user && plate) {
    let record = user.history.find(h => h.plate === plate && h.status === "Nezaplatené")
    if (record) record.status = "Zaplatené"
    localStorage.setItem("currentUser", JSON.stringify(user))
    let users = JSON.parse(localStorage.getItem("users")) || []
    users = users.map(u => u.name === user.name ? user : u)
    localStorage.setItem("users", JSON.stringify(users))
  }

  setTimeout(() => {
    window.location.href = "index.html"
  }, 2000)
})
