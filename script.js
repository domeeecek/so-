let users = JSON.parse(localStorage.getItem("users")) || []
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null

const loginSection = document.getElementById("loginSection")
const adminForm = document.getElementById("adminForm")
const userForm = document.getElementById("userForm")
const userDash = document.getElementById("userDash")
const adminDash = document.getElementById("adminDash")
const carsContainer = document.getElementById("carsContainer")
const historyTable = document.querySelector("#historyTable tbody")
const adminCarsTable = document.querySelector("#adminCarsTable tbody")
const plateHistory = document.getElementById("plateHistory")
const adminHistory = document.getElementById("adminHistory")
const selectedPlate = document.getElementById("selectedPlate")
const timeDisplay = document.getElementById("currentTime")

document.getElementById("switchUser").addEventListener("click", () => {
  userForm.classList.remove("hidden")
  adminForm.classList.add("hidden")
})
document.getElementById("switchAdmin").addEventListener("click", () => {
  adminForm.classList.remove("hidden")
  userForm.classList.add("hidden")
})

setInterval(() => {
  if (timeDisplay) timeDisplay.textContent = new Date().toLocaleString()
}, 1000)

document.getElementById("userRegister").addEventListener("click", () => {
  const name = document.getElementById("userName").value
  const pass = document.getElementById("userPass").value
  if (!name || !pass) return alert("Vyplň všetky údaje")
  if (users.find(u => u.name === name)) return alert("Používateľ už existuje")
  users.push({ name, pass, cars: [], history: [] })
  localStorage.setItem("users", JSON.stringify(users))
  alert("Registrácia úspešná")
})

document.getElementById("userLogin").addEventListener("click", () => {
  const name = document.getElementById("userName").value
  const pass = document.getElementById("userPass").value
  const user = users.find(u => u.name === name && u.pass === pass)
  if (!user) return alert("Nesprávne údaje")
  currentUser = user
  localStorage.setItem("currentUser", JSON.stringify(user))
  showUserDashboard()
})

document.getElementById("adminLogin").addEventListener("click", () => {
  const name = document.getElementById("adminUser").value
  const pass = document.getElementById("adminPass").value
  if (name === "admin" && pass === "admin18") {
    showAdminDashboard()
  } else {
    alert("Nesprávne údaje")
  }
})

document.getElementById("addCar").addEventListener("click", () => {
  const plate = document.getElementById("userPlate").value.toUpperCase()
  if (!plate) return alert("Zadaj ŠPZ")
  currentUser.cars.push(plate)
  currentUser.history.push({ plate, status: "Nezaplatené", date: new Date().toLocaleString() })
  saveUserData()
  renderUserCars()
  renderUserHistory()
})

function renderUserCars() {
  carsContainer.innerHTML = ""
  currentUser.cars.forEach(plate => {
    let box = document.createElement("div")
    box.classList.add("carBox")
    box.innerHTML = `<p>${plate}</p>`
    box.onclick = () => {
      let record = currentUser.history.find(h => h.plate === plate && h.status === "Nezaplatené")
      if (record) {
        if (confirm("Toto auto má nezaplatené parkovanie. Chceš zaplatiť?")) {
          localStorage.setItem("payingUser", JSON.stringify(currentUser))
          localStorage.setItem("payingPlate", plate)
          window.location.href = "payment.html"
        }
      } else {
        alert("Toto auto má všetko zaplatené.")
      }
    }
    carsContainer.appendChild(box)
  })
}

function renderUserHistory() {
  historyTable.innerHTML = ""
  currentUser.history.forEach(h => {
    let row = document.createElement("tr")
    row.innerHTML = `
      <td>${h.plate}</td>
      <td><span class="badge ${h.status === "Zaplatené" ? "paid" : "notpaid"}">${h.status}</span></td>
      <td>${h.date}</td>
    `
    historyTable.appendChild(row)
  })
}

function saveUserData() {
  users = users.map(u => u.name === currentUser.name ? currentUser : u)
  localStorage.setItem("users", JSON.stringify(users))
  localStorage.setItem("currentUser", JSON.stringify(currentUser))
}

function showUserDashboard() {
  loginSection.classList.add("hidden")
  adminDash.classList.add("hidden")
  userDash.classList.remove("hidden")
  document.getElementById("userWelcome").textContent = `Vitaj ${currentUser.name}`
  renderUserCars()
  renderUserHistory()
}

function showAdminDashboard() {
  loginSection.classList.add("hidden")
  userDash.classList.add("hidden")
  adminDash.classList.remove("hidden")
  renderAdminCars()
}

function renderAdminCars() {
  adminCarsTable.innerHTML = ""
  users.forEach(u => {
    u.cars.forEach(plate => {
      let status = u.history.find(h => h.plate === plate)?.status || "Neznáme"
      let row = document.createElement("tr")
      row.innerHTML = `
        <td class="clickablePlate">${plate}</td>
        <td>${status}</td>
        <td>${u.name}</td>
      `
      row.querySelector(".clickablePlate").onclick = () => {
        selectedPlate.textContent = plate
        plateHistory.innerHTML = ""
        u.history.filter(h => h.plate === plate).forEach(h => {
          let r = document.createElement("tr")
          r.innerHTML = `<td>${h.status}</td><td>${h.date}</td>`
          plateHistory.appendChild(r)
        })
        adminHistory.classList.remove("hidden")
      }
      adminCarsTable.appendChild(row)
    })
  })
}

document.getElementById("logoutUser").addEventListener("click", () => {
  currentUser = null
  localStorage.removeItem("currentUser")
  loginSection.classList.remove("hidden")
  userDash.classList.add("hidden")
})
document.getElementById("logoutAdmin").addEventListener("click", () => {
  loginSection.classList.remove("hidden")
  adminDash.classList.add("hidden")
})
if (currentUser) showUserDashboard()
