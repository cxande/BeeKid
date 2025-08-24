
function acessarPerfil(cuidadorId) {

  localStorage.setItem('cuidadorSelecionado', cuidadorId);

 
  window.location.href = 'perfilCuidador.html';
}