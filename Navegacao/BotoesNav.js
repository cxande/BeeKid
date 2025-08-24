document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btnHome').addEventListener('click', e => {
        e.preventDefault();
        window.location.href = 'BeeKid.html';
    });

    document.getElementById('btnCuidadores').addEventListener('click', e => {
        e.preventDefault();
        window.location.href = 'http://127.0.0.1:5500/SelecionarCuidadores/SelecionarCuidadores.html';
    });

    document.getElementById('btnCriancas').addEventListener('click', e => {
        e.preventDefault();
        window.location.href = 'http://127.0.0.1:5500/SelecionarCriancas/SelecionarCriancas.html';
    });

    document.getElementById('btnChat').addEventListener('click', e => {
        e.preventDefault();
        window.location.href = 'http://127.0.0.1:5500/Chat/chat.html';
    });

    document.getElementById('btnSair').addEventListener('click', e => {
        e.preventDefault();
        localStorage.removeItem('cuidadorSelecionado');
        localStorage.removeItem('userRole');
        window.location.href = 'http://127.0.0.1:5500/BeeKid/Beekid.html';
    });
});



// Botão Sair
document.getElementById('btnSair').addEventListener('click', function(e){
    e.preventDefault();
    // Limpar dados de usuário
    localStorage.removeItem('cuidadorSelecionado');
    localStorage.removeItem('userRole');
    // Redirecionar para login
    window.location.href = 'http://127.0.0.1:5500/BeeKid/Beekid.html'; // troque pelo caminho da página de login
});


// ===== Esconder links para cuidadores =====
window.addEventListener('DOMContentLoaded', () => {
  const role = localStorage.getItem('userRole'); // 'cuidador' ou outro
  if (role === 'cuidador') {
    const navLinks = document.querySelectorAll('.sidebar nav a');
    navLinks.forEach(link => {
      // verifica se contém "Cuidadores"
      if (link.textContent.includes('Cuidadores')) {
        link.style.display = 'none';
      }
    });
  }
});

// ===== Carregar dados do usuário logado =====
window.addEventListener('DOMContentLoaded', () => {
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado')); // objeto com nome e cpf
  if (usuarioLogado) {
    document.getElementById('profileName').innerText = usuarioLogado.nome || "Nome Sobrenome";
    document.getElementById('profileCPF').innerText = usuarioLogado.cpf || "000.000.000-00";
  }
});

