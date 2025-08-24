let currentCard = null;
let editingItem = null;

window.onload = function () {
  const crianca = JSON.parse(localStorage.getItem("crianca"));
  const responsavel = JSON.parse(localStorage.getItem("usuarioLogado"));
  const role = localStorage.getItem("userRole"); 

  if (crianca) {
    document.getElementById("headerName").innerText = crianca.nome;
    document.querySelector(".header img").src = crianca.foto || "./images.jpeg";
  }

  if (responsavel) {
    document.getElementById("profileName").innerText = responsavel.nome;
    document.getElementById("profileCPF").innerText = responsavel.cpf;
  }

  carregarDados("atividades", role);
  carregarDados("alergias", role);
  carregarDados("cuidadores", role);

  renderCalendar();
};


function openModal(cardId, item = null) {
  const role = localStorage.getItem("userRole");
  if (role === "cuidador") return; 

  currentCard = cardId;
  editingItem = item;
  document.getElementById("modal").style.display = "flex";

  if (item) {
    document.getElementById("titulo").value = item.querySelector("strong").innerText;
    document.getElementById("descricao").value = item.querySelector("p").innerText;
  } else {
    document.getElementById("titulo").value = "";
    document.getElementById("descricao").value = "";
  }
}

function addItem() {
  const role = localStorage.getItem("userRole");
  if (role === "cuidador") return;

  const titulo = document.getElementById("titulo").value;
  const descricao = document.getElementById("descricao").value;
  const modal = document.getElementById("modal");

  if (editingItem) {
    editingItem.querySelector("strong").innerText = titulo;
    editingItem.querySelector("p").innerText = descricao;
    editingItem = null;
  } else {
    const item = document.createElement("div");
    item.className = "item";
    item.innerHTML = `
      <strong>${titulo}</strong>
      <p>${descricao}</p>
      <div class="actions">
        <button onclick="openModal('${currentCard}', this.closest('.item'))">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button onclick="removerItem(this, '${currentCard}')">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    `;
    item.onclick = function (e) {
      if (!e.target.closest(".actions")) {
        this.classList.toggle("open");
      }
    };
    document.getElementById(currentCard).appendChild(item);
  }

  salvarDados(currentCard);
  modal.style.display = "none";
}

function removerItem(btn, cardId) {
  const role = localStorage.getItem("userRole");
  if (role === "cuidador") return; 

  btn.closest(".item").remove();
  salvarDados(cardId);
}


function openCpfModal() {
  const role = localStorage.getItem("userRole");
  if (role === "cuidador") return; 

  document.getElementById("cpfInput").value = "";
  document.getElementById("cpfModal").style.display = "flex";
}

function vincularCuidador() {
  const role = localStorage.getItem("userRole");
  if (role === "cuidador") return; 

  const cpf = document.getElementById("cpfInput").value.trim();
  const modal = document.getElementById("cpfModal");

  if (cuidadoresValidos.includes(cpf)) {
    const item = document.createElement("div");
    item.className = "item";
    item.innerHTML = `
      <strong>Cuidador CPF: ${cpf}</strong>
      <div class="actions">
        <button onclick="removerItem(this, 'cuidadores')">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    `;
    document.getElementById("cuidadores").appendChild(item);
    salvarDados("cuidadores");
    modal.style.display = "none";
  } else {
    modal.style.display = "none";
    showAlert("CPF não encontrado");
  }
}

function showAlert(msg) {
  document.getElementById("alertMsg").innerText = msg;
  document.getElementById("alertModal").style.display = "flex";
}

function closeAlert() {
  document.getElementById("alertModal").style.display = "none";
}

window.onclick = function (event) {
  const modals = ["modal", "cpfModal", "alertModal"];
  modals.forEach(id => {
    const modal = document.getElementById(id);
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
};

function salvarDados(cardId) {
  const items = Array.from(document.getElementById(cardId).querySelectorAll(".item")).map(item => {
    return {
      titulo: item.querySelector("strong")?.innerText || "",
      descricao: item.querySelector("p")?.innerText || ""
    };
  });
  localStorage.setItem(cardId, JSON.stringify(items));
}

function carregarDados(cardId, role) {
  const items = JSON.parse(localStorage.getItem(cardId)) || [];
  items.forEach(data => {
    const item = document.createElement("div");
    item.className = "item";
    item.innerHTML = `
      <strong>${data.titulo}</strong>
      <p>${data.descricao}</p>
      <div class="actions">
        <button onclick="openModal('${cardId}', this.closest('.item'))">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button onclick="removerItem(this, '${cardId}')">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    `;

    if (role === "cuidador") {
      item.querySelector(".actions").style.display = "none";
      const conferirBtn = document.createElement("button");
      conferirBtn.textContent = "Conferir Tarefa";
      conferirBtn.classList.add("check-btn");
      conferirBtn.onclick = () => alert(`Conferindo tarefa: ${data.titulo}`);
      item.querySelector(".item")?.appendChild(conferirBtn) || item.appendChild(conferirBtn);
    }

    item.onclick = function (e) {
      if (!e.target.closest(".actions")) {
        this.classList.toggle("open");
      }
    };
    document.getElementById(cardId).appendChild(item);
  });
}

let date = new Date();
let currentMonth = date.getMonth();
let currentYear = date.getFullYear();

const monthNames = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

function renderCalendar() {
  const daysContainer = document.getElementById("calendar-days");
  const monthYear = document.getElementById("month-year");

  daysContainer.innerHTML = "";
  monthYear.textContent = `${monthNames[currentMonth]} ${currentYear}`;

  let firstDay = new Date(currentYear, currentMonth, 1).getDay();
  let lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();
  let prevLastDate = new Date(currentYear, currentMonth, 0).getDate();

  for (let x = firstDay; x > 0; x--) {
    let div = document.createElement("div");
    div.classList.add("inactive");
    div.textContent = prevLastDate - x + 1;
    daysContainer.appendChild(div);
  }

  for (let i = 1; i <= lastDate; i++) {
    let div = document.createElement("div");
    div.textContent = i;

    if (
      i === date.getDate() &&
      currentMonth === new Date().getMonth() &&
      currentYear === new Date().getFullYear()
    ) {
      div.classList.add("today");
    }

    daysContainer.appendChild(div);
  }
}

function prevMonth() {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar();
}

function nextMonth() {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar();
}
