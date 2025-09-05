// public/js/info.js
const INFO_BASE = '/api/info';

async function openInfoModal(idInfo = null) {
  const modal = document.getElementById('infoModal');
  const title = document.getElementById('infoModalTitle');
  const btn   = document.getElementById('salvarInfoBtn');

  // limpa
  document.getElementById('infoIdInput').value = '';
  document.getElementById('tipoInfoSelect').value = 'alergias';
  document.getElementById('infoDescricaoInput').value = '';

  if (idInfo) {
    try {
      const resp = await fetch(`${INFO_BASE}/${idInfo}`, { headers: { ...authHeaders() } });
      if (!resp.ok) throw new Error('Não encontrado');
      const info = await resp.json();

      document.getElementById('infoIdInput').value = info.idInfo_crianca;
      document.getElementById('tipoInfoSelect').value = info.tipo_info;
      document.getElementById('infoDescricaoInput').value = info.descricao || '';

      title.textContent = 'Editar informação';
      btn.textContent   = 'Atualizar';
    } catch (e) {
      console.error(e);
      showAlert('Erro ao carregar informação.');
      return;
    }
  } else {
    title.textContent = 'Adicionar informação';
    btn.textContent   = 'Salvar';
  }

  modal.style.display = 'flex';
}

let savingInfo = false;
async function salvarInfo() {
  if (savingInfo) return;
  savingInfo = true;
  const btn = document.getElementById('salvarInfoBtn');
  if (btn) btn.disabled = true;

  try {
    const idInfo     = document.getElementById('infoIdInput').value;
    const tipo_info  = document.getElementById('tipoInfoSelect').value; // 'alergias' | 'medicamento' | 'outros'
    const descricao  = document.getElementById('infoDescricaoInput').value.trim();

    if (!descricao) { showAlert('Descrição é obrigatória.'); return; }

    const payload = { tipo_info, descricao, id_crianca: idCrianca };
    const method  = idInfo ? 'PUT' : 'POST';
    const url     = idInfo ? `${INFO_BASE}/${idInfo}` : INFO_BASE;

    const resp = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(payload)
    });

    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      console.error('Salvar info falhou:', resp.status, data);
      showAlert(data?.message || data?.error || 'Erro ao salvar informação.');
      return;
    }

    showAlert(idInfo ? 'Informação atualizada!' : 'Informação adicionada!');
    closeModal('infoModal');
    carregarInfos();
  } catch (e) {
    console.error(e);
    showAlert('Erro ao conectar com o servidor.');
  } finally {
    savingInfo = false;
    if (btn) btn.disabled = false;
  }
}

async function carregarInfos() {
  try {
    const resp = await fetch(`${INFO_BASE}/crianca/${idCrianca}`, { headers: { ...authHeaders() } });
    const lista = document.getElementById('listaInfos');
    if (!lista) return;
    lista.innerHTML = '';

    if (!resp.ok) {
      if (resp.status === 404) {
        lista.innerHTML = '<li class="no-data">Nenhuma informação cadastrada.</li>';
        return;
      }
      throw new Error('Falha ao carregar informações.');
    }

    const infos = await resp.json();
    if (!Array.isArray(infos) || infos.length === 0) {
      lista.innerHTML = '<li class="no-data">Nenhuma informação cadastrada.</li>';
      return;
    }

    infos.forEach(info => {
      const li = document.createElement('li');
      li.innerHTML = `
        <div class="info-item">
          <strong>[${info.tipo_info}]</strong>
          <p>${info.descricao || ''}</p>
        </div>
        <div class="info-actions">
          <button onclick="openInfoModal(${info.idInfo_crianca})">Editar</button>
          <button onclick="deletarInfo(${info.idInfo_crianca})">Excluir</button>
        </div>
      `;
      lista.appendChild(li);
    });
  } catch (e) {
    console.error(e);
    showAlert('Não foi possível carregar as informações.');
  }
}

async function deletarInfo(idInfo) {
  if (!confirm('Deseja excluir esta informação?')) return;
  try {
    const resp = await fetch(`${INFO_BASE}/${idInfo}`, {
      method: 'DELETE',
      headers: { ...authHeaders() }
    });
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      showAlert(data?.message || data?.error || 'Erro ao excluir informação.');
      return;
    }
    showAlert('Informação excluída.');
    carregarInfos();
  } catch (e) {
    console.error(e);
    showAlert('Erro ao conectar com o servidor.');
  }
}

// expor
window.openInfoModal = openInfoModal;
window.salvarInfo    = salvarInfo;
window.carregarInfos = carregarInfos;
window.deletarInfo   = deletarInfo;

// init
document.addEventListener('DOMContentLoaded', () => {
  const btnInfo = document.getElementById('salvarInfoBtn');
  if (btnInfo) btnInfo.addEventListener('click', salvarInfo);
  carregarInfos();
});
