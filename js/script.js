// === Notifications dropdown ===
const bell = document.querySelector('.notification .bell-icon');
const dropdown = document.getElementById('notificationDropdown');
if (bell && dropdown) {
  bell.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
  });
  document.addEventListener('click', () => {
    if (dropdown.style.display === 'block') dropdown.style.display = 'none';
  });
}

/* ===== Dynamic Traffic Data (Exceeds) ===== */
const trafficSets = {
  hourly: {
    labels: ['12a','1a','2a','3a','4a','5a','6a','7a','8a','9a','10a','11a','12p','1p','2p','3p','4p','5p','6p','7p','8p','9p','10p','11p'],
    data:   [  45,  40,  38,  42,  50,  65, 120, 180, 240, 260, 300, 310, 320, 330, 280, 260, 240, 270, 290, 310, 280, 220, 160,  90]
  },
  daily: {
    labels: ['S','M','T','W','T','F','S'],
    data:   [ 120, 220, 350, 300, 260, 180, 140 ]
  },
  weekly: {
    labels: ['16–22','23–29','30–5','6–12','13–19','20–26','27–3','4–10','11–17','18–24','25–31'],
    data:   [   500,  1000, 1500, 2000, 1800, 1500, 2000, 2200, 1900, 1700, 2500 ]
  },
  monthly: {
    labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    data:   [  2200, 1800, 2000, 2400, 2600, 2800, 3000, 3200, 2900, 2700, 2500, 2300 ]
  }
};

// ====== Chart.js ======
const trafficChart = new Chart(document.getElementById('trafficChart'), {
  type: 'line',
  data: {
    labels: trafficSets.hourly.labels, // default to hourly
    datasets: [{
      label: '',
      data: trafficSets.hourly.data,
      borderColor: '#6a5acd',
      backgroundColor: 'rgba(106,90,205,0.12)',
      fill: true,
      tension: 0.25,
      pointRadius: 0
    }]
  },
  options: {
    responsive: true,
    plugins: { legend: { display: false }, title: { display: false } },
    scales: { x: { grid: { display: false } }, y: { beginAtZero: true } }
  }
});

const dailyTrafficChart = new Chart(document.getElementById('dailyTrafficChart'), {
  type: 'bar',
  data: {
    labels: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    datasets: [{ label: '', data: [50, 100, 150, 200, 180, 120, 90], backgroundColor: '#6a5acd' }]
  },
  options: { responsive: true, plugins: { legend: { display: false }, title: { display: false } } }
});

const mobileUsersChart = new Chart(document.getElementById('mobileUsersChart'), {
  type: 'doughnut',
  data: { labels: ['Desktop', 'Tablet', 'Phones'], datasets: [{ data: [60, 20, 20], backgroundColor: ['#6a5acd', '#90ee90', '#add8e6'] }] },
  options: {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'right', align: 'center', labels: { boxWidth: 15, padding: 10 } },
      title: { display: false }
    },
    layout: { padding: { right: 30 } }
  }
});

// === Alert closure ===
const closeBtn = document.querySelector('.close');
if (closeBtn) closeBtn.addEventListener('click', () => {
  const alertEl = document.getElementById('alert');
  if (alertEl) alertEl.style.display = 'none';
});

// === Timeframe buttons: swap traffic data dynamically ===
document.querySelectorAll('.timeframe button').forEach(btn => {
  btn.addEventListener('click', () => {
    const active = document.querySelector('.timeframe .active');
    if (active) active.classList.remove('active');
    btn.classList.add('active');

    const period = btn.dataset.period;
    const set = trafficSets[period] || trafficSets.weekly;

    trafficChart.data.labels = set.labels;
    trafficChart.data.datasets[0].data = set.data;
    trafficChart.update();
  });
});

// === Message form handling ===
const sendMessage = document.getElementById('sendMessage');
const userSearch = document.getElementById('userSearch');
const messageInput = document.getElementById('messageInput');
const messageError = document.getElementById('messageError');

if (sendMessage) {
  sendMessage.addEventListener('click', () => {
    if (!userSearch.value && !messageInput.value) {
      messageError.textContent = 'Please select a user and enter a message.';
    } else if (!userSearch.value) {
      messageError.textContent = 'Please select a user.';
    } else if (!messageInput.value) {
      messageError.textContent = 'Please enter a message.';
    } else {
      messageError.textContent = 'Message sent!';
      messageError.classList.remove('error');
      messageError.classList.add('success');
      userSearch.value = '';
      messageInput.value = '';
    }
    setTimeout(() => { messageError.textContent = ''; }, 3000);
  });
}

// === Settings (localStorage) ===
const saveBtn = document.getElementById('saveSettings');
const cancelBtn = document.getElementById('cancelSettings');

if (saveBtn) {
  saveBtn.addEventListener('click', () => {
    const tz = document.getElementById('timezone');
    const tzVal = tz && tz.value !== '' ? tz.value : '';
    localStorage.setItem('emailNotifications', document.getElementById('emailNotifications').checked);
    localStorage.setItem('profilePublic', document.getElementById('profilePublic').checked);
    if (tzVal) {
      localStorage.setItem('timezone', tzVal);
    } else {
      localStorage.removeItem('timezone');
    }
  });
}

if (cancelBtn) {
  cancelBtn.addEventListener('click', () => {
    // Clear saved values
    localStorage.removeItem('emailNotifications');
    localStorage.removeItem('profilePublic');
    localStorage.removeItem('timezone');

    // Reload
    document.getElementById('emailNotifications').checked = true;
    document.getElementById('profilePublic').checked = true;

    const tz = document.getElementById('timezone');
    if (tz) {
      tz.value = '';            // force placeholder option (value="")
      tz.dispatchEvent(new Event('change'));
    }
  });
}

window.addEventListener('load', () => {
  // Restore toggles if present
  const emailStored = localStorage.getItem('emailNotifications');
  const publicStored = localStorage.getItem('profilePublic');
  if (emailStored !== null) document.getElementById('emailNotifications').checked = (emailStored === 'true');
  if (publicStored !== null) document.getElementById('profilePublic').checked = (publicStored === 'true');


  const tz = document.getElementById('timezone');
  const tzStored = localStorage.getItem('timezone');

  if (tz) {
    tz.value = ''; 
    if (tzStored && tz.querySelector(`option[value="${tzStored}"]`)) {
      tz.value = tzStored;
    }
  }

  normalizeActivityItems();
  groupSettingsButtons();
});

/* Combine name + activity into one span for consistent wrapping */
function normalizeActivityItems() {
  document.querySelectorAll('.activity ul li').forEach(li => {
    if (li.querySelector('.activity-line')) return;
    const spans = li.querySelectorAll('span');
    if (spans.length < 3) return;

    const nameText = spans[0].textContent.trim();
    const activityText = spans[1].textContent.trim();
    const timeText = spans[2].textContent.trim();

    const line = document.createElement('span');
    line.className = 'activity-line';
    line.innerHTML = `<span class="who">${nameText}</span> <span class="what">${activityText}</span>`;

    const time = document.createElement('span');
    time.className = 'activity-time';
    time.textContent = timeText;

    spans[0].remove(); spans[1].remove(); spans[2].remove();
    li.appendChild(line);
    li.appendChild(time);
  });
}

/* Wrap Save/Cancel so they render side-by-side on all sizes- it was giving me proplems stacking on top of each other */
function groupSettingsButtons() {
  const settings = document.querySelector('.settings');
  const save = document.getElementById('saveSettings');
  const cancel = document.getElementById('cancelSettings');
  if (!settings || !save || !cancel) return;

  if (!settings.querySelector('.settings-buttons')) {
    const wrapper = document.createElement('div');
    wrapper.className = 'settings-buttons';
    settings.insertBefore(wrapper, save);
    wrapper.appendChild(save);
    wrapper.appendChild(cancel);
  }
}
