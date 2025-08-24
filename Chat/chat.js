// Selecionar CPF para conversar
function iniciarConversa(cpfDestino) {
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
  const conversaKey = `chat_${usuarioLogado.cpf}_${cpfDestino}`;
  const mensagens = JSON.parse(localStorage.getItem(conversaKey)) || [];
  
  mostrarMensagens(mensagens, conversaKey);
}

function mostrarMensagens(mensagens, conversaKey) {
  const chatBox = document.getElementById('chatBox');
  chatBox.innerHTML = '';
  
  mensagens.forEach(msg => {
    const div = document.createElement('div');
    div.className = msg.de === 'eu' ? 'mensagem-eu' : 'mensagem-outro';
    div.innerText = msg.texto;
    chatBox.appendChild(div);
  });
  
  // Scroll para baixo
  chatBox.scrollTop = chatBox.scrollHeight;

  // Botão enviar
  document.getElementById('btnEnviar').onclick = () => {
    const input = document.getElementById('mensagemInput');
    const texto = input.value.trim();
    if (!texto) return;
    mensagens.push({ de: 'eu', texto });
    localStorage.setItem(conversaKey, JSON.stringify(mensagens));
    input.value = '';
    mostrarMensagens(mensagens, conversaKey);
  };
}
