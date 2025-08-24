// ====================
// Seletores dos modais e inputs
// ====================
const modalCadastro = document.getElementById("modalCadastro");
const modalResponsavel = document.getElementById("modalResponsavel");

const btnAbrirCadastro = document.getElementById("btnAbrirModal");
const btnFecharCadastro = document.getElementById("btnFecharCadastro");
const btnCadastrar = document.getElementById("btnCadastrar");

const btnFecharResponsavel = document.getElementById("btnFecharResponsavel");
const radios = document.getElementsByName("tipo");

const nomeCadastro = document.getElementById("nomeCadastro");
const cpfCadastro = document.getElementById("cpfCadastro");
const senhaCadastro = document.getElementById("senhaCadastro");

const finalizarResponsavel = modalResponsavel.querySelector("#btnFinalizarCadastro");
const voltarResponsavel = modalResponsavel.querySelector(".voltar");

// ====================
// Modais de aviso (erro e sucesso)
// ====================
const modalErro = document.getElementById("modalErro");
const modalSucesso = document.getElementById("modalSucesso");
const btnFecharErro = document.getElementById("btnFecharErro");
const btnFecharSucesso = document.getElementById("btnFecharSucesso");

btnFecharErro.onclick = () => modalErro.style.display = "none";
btnFecharSucesso.onclick = () => modalSucesso.style.display = "none";

window.addEventListener("click", (e) => {
    if (e.target === modalErro) modalErro.style.display = "none";
    if (e.target === modalSucesso) modalSucesso.style.display = "none";
});

// ====================
// Foto principal e galeria
// ====================
const fotoPrincipal = document.getElementById('fotoPrincipal');
const overlayGaleria = document.getElementById('overlayGaleria');
const fecharGaleria = document.getElementById('fecharGaleria');
const fotos = document.querySelectorAll('.perfil-opcao');

let fotoSelecionada = null;

fotoPrincipal.addEventListener('click', () => overlayGaleria.style.display = 'flex');
fecharGaleria.addEventListener('click', () => overlayGaleria.style.display = 'none');
overlayGaleria.addEventListener('click', (e) => {
    if (e.target === overlayGaleria) overlayGaleria.style.display = 'none';
});

fotos.forEach(foto => {
    foto.addEventListener('click', () => {
        fotos.forEach(f => f.classList.remove('selecionado'));
        foto.classList.add('selecionado');
        fotoPrincipal.src = foto.src;
        fotoSelecionada = foto.src;
        overlayGaleria.style.display = 'none';
    });
});

// ====================
// Funções auxiliares
// ====================
function resetModalCadastro() {
    nomeCadastro.value = "";
    cpfCadastro.value = "";
    senhaCadastro.value = "";
    radios.forEach(r => r.checked = false);

    fotoPrincipal.src = 'caminho/para/foto/padrao.png'; // substitua pelo src padrão
    fotoSelecionada = fotoPrincipal.src;

    fotos.forEach(f => f.classList.remove('selecionado'));
}

function abrirModalErro(mensagem = "Por favor, preencha todos os campos!") {
    modalErro.querySelector("p").innerText = mensagem;
    modalErro.style.display = "flex";
}

function abrirModalSucesso() {
    modalSucesso.style.display = "flex";
}

// ====================
// Abrir e fechar modais de cadastro
// ====================
btnAbrirCadastro.onclick = () => {
    resetModalCadastro();
    modalCadastro.style.display = "flex";
};

btnFecharCadastro.onclick = () => {
    resetModalCadastro();
    modalCadastro.style.display = "none";
};

btnFecharResponsavel.onclick = () => {
    resetModalCadastro();
    modalResponsavel.style.display = "none";
};

// ====================
// Função de validação de CPF
// ====================
function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g,'');
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    let soma = 0, resto;

    for (let i = 1; i <= 9; i++)
        soma += parseInt(cpf.substring(i-1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++)
        soma += parseInt(cpf.substring(i-1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;

    return true;
}

// ====================
// Cadastro principal
// ====================
btnCadastrar.onclick = () => {
    const tipoSelecionado = Array.from(radios).find(r => r.checked);

    if (!nomeCadastro.value.trim() || !cpfCadastro.value.trim() || !senhaCadastro.value.trim() || !tipoSelecionado) {
        abrirModalErro();
        return;
    }

    if (!validarCPF(cpfCadastro.value)) {
        abrirModalErro("CPF inválido!");
        return;
    }

    if (tipoSelecionado.value === "responsavel") {
        modalCadastro.style.display = "none";
        modalResponsavel.style.display = "flex";
    } else if (tipoSelecionado.value === "cuidador") {
        modalCadastro.style.display = "none";
        abrirModalSucesso();
    }
};

// ====================
// Cadastro do responsável - finalizar
// ====================
const fotoPadrao = 'caminho/para/foto/padrao.png'; // define a foto padrão

finalizarResponsavel.onclick = () => {
    const inputs = modalResponsavel.querySelectorAll("input");

    for (let i of inputs) {
        if (!i.value.trim()) {
            abrirModalErro();
            return;
        }
    }

    if (!fotoSelecionada || fotoSelecionada === fotoPadrao) {
        abrirModalErro();
        return;
    }

    modalResponsavel.style.display = "none";
    abrirModalSucesso();
};

// ====================
// Voltar do modal responsável
// ====================
voltarResponsavel.onclick = () => {
    modalResponsavel.style.display = "none";
    modalCadastro.style.display = "flex";
};

// ====================
// Toggle de exibir/ocultar senha
// ====================
const toggles = document.querySelectorAll('.toggleSenha');

toggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
        const input = toggle.previousElementSibling; // pega o input anterior (senha)
        if (input.type === 'password') {
            input.type = 'text';
            toggle.classList.replace('bx-show', 'bx-hide'); // olho fechado
        } else {
            input.type = 'password';
            toggle.classList.replace('bx-hide', 'bx-show'); // olho aberto
        }
    });
});

// ====================
// Login simplificado (sem banco)
// ====================
const formLogin = document.querySelector("form"); // pega seu form de login
formLogin.addEventListener("submit", (e) => {
    e.preventDefault();

    const cpf = formLogin.querySelector("input[placeholder='CPF']").value;
    const senha = formLogin.querySelector("#senhaLogin").value;

    if (!cpf.trim() || !senha.trim()) {
        abrirModalErro("Preencha CPF e senha!");
        return;
    }

    // Login simulado
    window.location.href = "http://127.0.0.1:5500/SelecionarCriancas/SelecionarCriancas.html"; 
});
