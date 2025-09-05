// public/js/utils.js
// Precisa ser definido no EJS antes dos scripts: window.__ID_CRIANCA = "<%= crianca.idCrianca %>";
window.idCrianca = window.__ID_CRIANCA;

window.showAlert = function showAlert(message) {
  const alertModal = document.getElementById('alertModal');
  const alertMessage = document.getElementById('alertMessage');
  if (!alertModal || !alertMessage) {
    alert(message);
    return;
  }
  alertMessage.textContent = message;
  alertModal.style.display = 'flex';
};

window.openModal = function openModal(modalId) {
  const el = document.getElementById(modalId);
  if (el) el.style.display = 'flex';
};
window.closeModal = function closeModal(modalId) {
  const el = document.getElementById(modalId);
  if (el) el.style.display = 'none';
};

// Logger global (debug)
window.onerror = (msg, src, line, col, err) => {
  console.error('Erro global:', msg, 'em', src, `${line}:${col}`, err);
};
