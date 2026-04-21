'use strict';

const dom = {
  chartCanvas: document.getElementById('revenueChart'),
  dropArea: document.getElementById('dropArea'),
  scanLoading: document.getElementById('scanLoading'),
  scanResult: document.getElementById('scanResult'),
  chatInput: document.getElementById('chatInput'),
  chatMessages: document.getElementById('chatMessages'),
  sidebar: document.getElementById('sidebar'),
  sidebarToggle: document.getElementById('sidebarToggle'),
  smartScanButton: document.getElementById('smartScanButton'),
  scanAgainButton: document.getElementById('scanAgainButton'),
  chatSendButton: document.getElementById('chatSendButton')
};

const chartContext = dom.chartCanvas.getContext('2d');
let activeChart;

const dataSets = {
  '3m': { labels: ['Fév', 'Mar', 'Avr'], revenue: [1920000, 2340000, 2847350], expenses: [880000, 1040000, 1124690] },
  '6m': { labels: ['Nov', 'Déc', 'Jan', 'Fév', 'Mar', 'Avr'], revenue: [1540000, 1780000, 1650000, 1920000, 2340000, 2847350], expenses: [720000, 810000, 760000, 880000, 1040000, 1124690] },
  '1y': { labels: ['Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc', 'Jan', 'Fév', 'Mar', 'Avr'], revenue: [1200000, 1350000, 1180000, 1420000, 1600000, 1720000, 1540000, 1780000, 1650000, 1920000, 2340000, 2847350], expenses: [560000, 620000, 540000, 680000, 730000, 800000, 720000, 810000, 760000, 880000, 1040000, 1124690] }
};

function buildChart(period) {
  if (activeChart) activeChart.destroy();
  const d = dataSets[period];

  activeChart = new Chart(chartContext, {
    type: 'line',
    data: {
      labels: d.labels,
      datasets: [
        { label: 'REVENUES', data: d.revenue, borderColor: '#00FF41', backgroundColor: 'rgba(0,255,65,0.05)', borderWidth: 2, fill: true, tension: 0.3 },
        { label: 'EXPENSES', data: d.expenses, borderColor: '#FF4444', backgroundColor: 'rgba(255,68,68,0.02)', borderWidth: 2, fill: true, tension: 0.3 }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: { legend: { labels: { color: '#7FB07F' } } },
      scales: {
        y: { ticks: { color: '#7FB07F', callback: (v) => `${(v / 1e3).toFixed(0)}k` }, grid: { color: '#1A2A1A' } },
        x: { ticks: { color: '#7FB07F' }, grid: { color: '#1A2A1A' } }
      }
    }
  });
}

function switchTab(tabElement) {
  const period = tabElement.dataset.period;
  document.querySelectorAll('.tab').forEach((tab) => tab.classList.remove('active'));
  tabElement.classList.add('active');
  buildChart(period);
}

function simulateScan() {
  dom.dropArea.style.display = 'none';
  dom.scanLoading.style.display = 'block';
  dom.scanResult.style.display = 'none';

  setTimeout(() => {
    dom.scanLoading.style.display = 'none';
    dom.scanResult.style.display = 'block';
    dom.dropArea.style.display = 'block';
  }, 1500);
}

function sendMessage() {
  const msg = dom.chatInput.value.trim();
  if (!msg) return;

  dom.chatMessages.innerHTML += `<div class="msg user"><div class="msg-bubble">>_ ${msg}</div></div>`;
  dom.chatInput.value = '';

  setTimeout(() => {
    let reply = '>_ Commande reconnue. Analyse en cours... (simulation IA)';

    if (msg.toLowerCase().includes('tva')) {
      reply = '>_ TVA collectée: 186 240 MAD, déductible: 63 400 MAD. Solde: 122 840 MAD.';
    } else if (msg.toLowerCase().includes('flux')) {
      reply = '>_ Prévision flux net Mai: +342 000 MAD. Confiance 89%.';
    } else if (msg.toLowerCase().includes('facture')) {
      reply = '>_ 8 factures impayées, total 394 800 MAD.';
    }

    dom.chatMessages.innerHTML += `<div class="msg ai"><div class="msg-bubble">${reply}</div></div>`;
    dom.chatMessages.scrollTop = dom.chatMessages.scrollHeight;
  }, 600);
}

function askQuestion(q) {
  dom.chatInput.value = q;
  sendMessage();
}

function actionToast(msg) {
  alert(`🔔 ${msg}`);
}

function toggleSidebar() {
  dom.sidebar.classList.toggle('open');
}

function bindEvents() {
  document.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => switchTab(tab));
  });

  dom.dropArea.addEventListener('click', simulateScan);
  dom.dropArea.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      simulateScan();
    }
  });

  dom.smartScanButton.addEventListener('click', simulateScan);
  dom.scanAgainButton.addEventListener('click', simulateScan);
  dom.chatSendButton.addEventListener('click', sendMessage);
  dom.chatInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') sendMessage();
  });

  document.querySelectorAll('[data-question]').forEach((button) => {
    button.addEventListener('click', () => askQuestion(button.dataset.question));
  });

  document.querySelectorAll('[data-action-msg]').forEach((button) => {
    button.addEventListener('click', () => actionToast(button.dataset.actionMsg));
  });

  dom.sidebarToggle.addEventListener('click', toggleSidebar);
}

buildChart('3m');
bindEvents();
