// Initialize Chart.js
const trafficChart = new Chart(document.getElementById('trafficChart'), {
    type: 'line',
    data: {
        labels: ['16-22', '23-29', '30-5', '6-12', '13-19', '20-26', '27-3', '4-10', '11-17', '18-24', '25-31'],
        datasets: [{
            label: '', // removed label text
            data: [500, 1000, 1500, 2000, 1800, 1500, 2000, 2200, 1900, 1700, 2500],
            borderColor: '#6a5acd',
            fill: true,
            tension: 0.1
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: false
            }
        }
    }
});

const dailyTrafficChart = new Chart(document.getElementById('dailyTrafficChart'), {
    type: 'bar',
    data: {
        labels: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
        datasets: [{
            label: '',
            data: [50, 100, 150, 200, 180, 120, 90],
            backgroundColor: '#6a5acd'
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: false
            }
        }
    }
});

const mobileUsersChart = new Chart(document.getElementById('mobileUsersChart'), {
    type: 'doughnut',
    data: {
        labels: ['Desktop', 'Tablet', 'Phones'],
        datasets: [{
            data: [60, 20, 20],
            backgroundColor: ['#6a5acd', '#90ee90', '#add8e6']
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'right',
                align: 'center',
                labels: {
                    boxWidth: 15,
                    padding: 10
                }
            },
            title: {
                display: false
            }
        },
        layout: {
            padding: {
                right: 30
            }
        }
    }
});

// Alert closure
document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('alert').style.display = 'none';
});

// Dynamic traffic chart
document.querySelectorAll('.timeframe button').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelector('.timeframe .active').classList.remove('active');
        button.classList.add('active');

        // Update chart data based on period (example)
        trafficChart.data.datasets[0].data = [500, 1000, 1500, 2000, 1800, 1500, 2000, 2200, 1900, 1700, 2500];
        trafficChart.update();
    });
});

// Message form handling
const sendMessage = document.getElementById('sendMessage');
const userSearch = document.getElementById('userSearch');
const messageInput = document.getElementById('messageInput');
const messageError = document.getElementById('messageError');

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

    setTimeout(() => {
        messageError.textContent = '';
    }, 3000);
});

// Settings (basic toggle and dropdown)
document.getElementById('saveSettings').addEventListener('click', () => {
    localStorage.setItem('emailNotifications', document.getElementById('emailNotifications').checked);
    localStorage.setItem('profilePublic', document.getElementById('profilePublic').checked);
    localStorage.setItem('timezone', document.getElementById('timezone').value);
});

document.getElementById('cancelSettings').addEventListener('click', () => {
    localStorage.clear();
    document.getElementById('emailNotifications').checked = true;
    document.getElementById('profilePublic').checked = true;
    document.getElementById('timezone').value = 'UTC';
    location.reload();
});

window.onload = () => {
    if (localStorage.getItem('emailNotifications')) {
        document.getElementById('emailNotifications').checked = localStorage.getItem('emailNotifications') === 'true';
    }
    if (localStorage.getItem('profilePublic')) {
        document.getElementById('profilePublic').checked = localStorage.getItem('profilePublic') === 'true';
    }
    if (localStorage.getItem('timezone')) {
        document.getElementById('timezone').value = localStorage.getItem('timezone');
    }
};
