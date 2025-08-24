window.addEventListener('DOMContentLoaded', () => {
  const salvarBtn = document.getElementById('salvarInfo');
  const campos = ['endereco', 'telefone', 'sobre'];

  // Sempre permitir edição
  campos.forEach(id => {
    document.getElementById(id).removeAttribute('readonly');
  });

  // Mostrar botão de salvar
  salvarBtn.style.display = 'inline-block'; 
  salvarBtn.addEventListener('click', salvarInformacoesCuidador);

  // Carregar informações salvas
  carregarInformacoesCuidador();
});

function salvarInformacoesCuidador() {
  const endereco = document.getElementById('endereco').value;
  const telefone = document.getElementById('telefone').value;
  const sobre = document.getElementById('sobre').value;

  const cuidador = {
    endereco,
    telefone,
    sobre
  };

  localStorage.setItem('perfilCuidador', JSON.stringify(cuidador));
  alert('Informações salvas com sucesso!');
}

function carregarInformacoesCuidador() {
  const dados = JSON.parse(localStorage.getItem('perfilCuidador')) || {};
  if (dados.endereco) document.getElementById('endereco').value = dados.endereco;
  if (dados.telefone) document.getElementById('telefone').value = dados.telefone;
  if (dados.sobre) document.getElementById('sobre').value = dados.sobre;
}
