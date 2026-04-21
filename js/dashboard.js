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

const chartContext = dom.chartCanvas ? dom.chartCanvas.getContext('2d') : null;
let activeChart;

const dataSets = {
  '3m': { labels: ['Fév', 'Mar', 'Avr'], revenue: [1920000, 2340000, 2847350], expenses: [880000, 1040000, 1124690] },
  '6m': { labels: ['Nov', 'Déc', 'Jan', 'Fév', 'Mar', 'Avr'], revenue: [1540000, 1780000, 1650000, 1920000, 2340000, 2847350], expenses: [720000, 810000, 760000, 880000, 1040000, 1124690] },
  '1y': { labels: ['Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc', 'Jan', 'Fév', 'Mar', 'Avr'], revenue: [1200000, 1350000, 1180000, 1420000, 1600000, 1720000, 1540000, 1780000, 1650000, 1920000, 2340000, 2847350], expenses: [560000, 620000, 540000, 680000, 730000, 800000, 720000, 810000, 760000, 880000, 1040000, 1124690] }
};

function buildChart(period) {
  if (!chartContext || typeof Chart === 'undefined') return;
  if (activeChart) activeChart.destroy();
  const d = dataSets[period] || dataSets['3m'];

  activeChart = new Chart(chartContext, {
    type: 'line',
    data: {
      labels: d.labels,
      datasets: [
        { label: 'REVENUES', data: d.revenue, borderColor: '#00FF41', backgroundColor: 'rgba(0,255,65,0.05)', borderWidth: 2, fill: true, tension: 0.3 },
        { label: 'EXPENSES', data: d.expenses, borderColor: '#FF4444', backgroundColor: 'rgba(255,68,68,0.02)', borderWidth: 2, fill: true, tension: 0.3 }
      ]
    },
    options: { responsive: true, maintainAspectRatio: true }
  });
}

function switchTab(tabElement) {
  const period = tabElement.dataset.period;
  document.querySelectorAll('.tab').forEach((tab) => tab.classList.remove('active'));
  tabElement.classList.add('active');
  buildChart(period);
}

function simulateScan() {
  if (!dom.dropArea || !dom.scanLoading || !dom.scanResult) return;
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
  if (!dom.chatInput || !dom.chatMessages) return;
  const msg = dom.chatInput.value.trim();
  if (!msg) return;
  dom.chatMessages.innerHTML += `<div class="msg user"><div class="msg-bubble">>_ ${msg}</div></div>`;
  dom.chatInput.value = '';
  setTimeout(() => {
    dom.chatMessages.innerHTML += '<div class="msg ai"><div class="msg-bubble">>_ Réponse IA simulée.</div></div>';
    dom.chatMessages.scrollTop = dom.chatMessages.scrollHeight;
  }, 450);
}

function toggleSidebar() {
  if (dom.sidebar) dom.sidebar.classList.toggle('open');
}

function bindEvents() {
  document.querySelectorAll('.tab').forEach((tab) => tab.addEventListener('click', () => switchTab(tab)));
  if (dom.dropArea) {
    dom.dropArea.addEventListener('click', simulateScan);
    dom.dropArea.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        simulateScan();
      }
    });
  }
  if (dom.smartScanButton) dom.smartScanButton.addEventListener('click', simulateScan);
  if (dom.scanAgainButton) dom.scanAgainButton.addEventListener('click', simulateScan);
  if (dom.chatSendButton) dom.chatSendButton.addEventListener('click', sendMessage);
  if (dom.chatInput) dom.chatInput.addEventListener('keydown', (event) => { if (event.key === 'Enter') sendMessage(); });
  document.querySelectorAll('[data-question]').forEach((button) => button.addEventListener('click', () => {
    if (dom.chatInput) dom.chatInput.value = button.dataset.question || '';
    sendMessage();
  }));
  document.querySelectorAll('[data-action-msg]').forEach((button) => button.addEventListener('click', () => alert(`🔔 ${button.dataset.actionMsg}`)));
  if (dom.sidebarToggle) dom.sidebarToggle.addEventListener('click', toggleSidebar);
}

buildChart('3m');
bindEvents();
