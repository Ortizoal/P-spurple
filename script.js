// Main Script for P's Purple Website

let currentDate = new Date();
let revenueChart = null;

// ============ INITIALIZATION ============
document.addEventListener('DOMContentLoaded', function() {
    initializeUI();
    loadPackages();
    loadRateCard();
    updateDashboard();
    buildCalendar();
});

function initializeUI() {
    // Mobile menu toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Booking form
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingSubmit);
    }

    // Set min date to today
    const dateInput = document.getElementById('appointmentDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }
}

// ============ PACKAGES ============
function loadPackages() {
    const container = document.getElementById('packagesContainer');
    if (!container) return;

    container.innerHTML = '';

    // Load main bridal packages
    servicePackages.bridal.forEach(pkg => {
        const packageCard = document.createElement('div');
        packageCard.className = 'package-card';
        packageCard.innerHTML = `
            <div class="package-header">
                <h3>${pkg.name}</h3>
                <span class="package-category">BRIDAL</span>
            </div>
            <div class="package-body">
                <p class="package-description">${pkg.description}</p>
                <div class="package-details">
                    <span><i class="fas fa-clock"></i> ${pkg.duration}</span>
                    <span class="package-price">GHS ${pkg.price}</span>
                </div>
                <div class="package-includes">
                    <h5>Includes:</h5>
                    <ul>
                        ${pkg.includes.map(item => `<li><i class="fas fa-check"></i> ${item}</li>`).join('')}
                    </ul>
                </div>
            </div>
            <button class="btn btn-primary" onclick="scrollToBooking('${pkg.name}')">
                Book This Package
            </button>
        `;
        container.appendChild(packageCard);
    });

    // Load extras
    const extrasTitle = document.createElement('h3');
    extrasTitle.textContent = 'Additional Services';
    extrasTitle.style.marginTop = '3rem';
    extrasTitle.style.color = 'var(--primary-purple)';
    extrasTitle.style.textAlign = 'center';
    container.appendChild(extrasTitle);

    servicePackages.extras.forEach(pkg => {
        const packageCard = document.createElement('div');
        packageCard.className = 'package-card extras-card';
        packageCard.innerHTML = `
            <div class="package-header">
                <h3>${pkg.name}</h3>
                <span class="package-category">EXTRA</span>
            </div>
            <div class="package-body">
                <p class="package-description">${pkg.description}</p>
                <div class="package-details">
                    <span class="package-price">GHS ${pkg.price}</span>
                </div>
            </div>
        `;
        container.appendChild(packageCard);
    });
}

function scrollToBooking(serviceName) {
    const serviceSelect = document.getElementById('service');
    const bookingSection = document.getElementById('booking');
    
    // All services are bridal packages
    serviceSelect.value = serviceName;
    
    // Scroll to booking section
    bookingSection.scrollIntoView({ behavior: 'smooth' });
}

// ============ RATE CARD ============
function loadRateCard() {
    const tbody = document.getElementById('rateCardBody');
    if (!tbody) return;

    const rates = getAllRates();
    tbody.innerHTML = rates.map(rate => `
        <tr>
            <td>${rate.service}</td>
            <td>${rate.duration}</td>
            <td class="price-cell">${rate.price}</td>
        </tr>
    `).join('');
}

// ============ BOOKING ============
function handleBookingSubmit(e) {
    e.preventDefault();

    const appointment = {
        clientName: document.getElementById('clientName').value,
        clientEmail: document.getElementById('clientEmail').value,
        clientPhone: document.getElementById('clientPhone').value,
        service: document.getElementById('service').value,
        appointmentDate: document.getElementById('appointmentDate').value,
        appointmentTime: document.getElementById('appointmentTime').value,
        notes: document.getElementById('notes').value
    };

    // Save appointment
    saveAppointment(appointment);

    // Show success message
    const messageDiv = document.getElementById('bookingMessage');
    messageDiv.innerHTML = '<div class="alert alert-success"><i class="fas fa-check"></i> Booking confirmed! Check your email for details.</div>';
    messageDiv.style.display = 'block';

    // Reset form
    document.getElementById('bookingForm').reset();

    // Hide message after 5 seconds
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);

    // Update dashboard
    updateDashboard();
}

// ============ DASHBOARD ============
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    // Add active class to clicked button
    event.target.closest('.tab-btn').classList.add('active');

    // Trigger specific actions
    if (tabName === 'appointments') {
        loadAppointments();
    } else if (tabName === 'insights') {
        loadInsights();
    } else if (tabName === 'calendar') {
        buildCalendar();
    }
}

function updateDashboard() {
    const insights = calculateInsights();

    document.getElementById('totalBookings').textContent = insights.totalBookings;
    document.getElementById('totalRevenue').textContent = '$' + insights.totalRevenue;
    document.getElementById('avgRating').textContent = insights.averageRating + ' ⭐';
    document.getElementById('clientsMonth').textContent = insights.monthlyClients;

    loadAppointments();
    buildCalendar();
}

function loadAppointments() {
    const appointments = getAppointments();
    const container = document.getElementById('appointmentsList');
    
    if (!container) return;

    if (appointments.length === 0) {
        container.innerHTML = '<p class="text-muted">No appointments yet. Book your first service!</p>';
        return;
    }

    // Sort appointments by date
    appointments.sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));

    container.innerHTML = appointments.map(apt => `
        <div class="appointment-item">
            <div class="appointment-info">
                <h4>${apt.clientName}</h4>
                <p><i class="fas fa-phone"></i> ${apt.clientPhone}</p>
                <p><i class="fas fa-envelope"></i> ${apt.clientEmail}</p>
                <p><i class="fas fa-calendar"></i> ${apt.appointmentDate} at ${apt.appointmentTime}</p>
                <p><i class="fas fa-spa"></i> <strong>Service:</strong> ${apt.service}</p>
                ${apt.notes ? `<p><i class="fas fa-note-sticky"></i> ${apt.notes}</p>` : ''}
            </div>
            <button class="btn btn-danger" onclick="cancelAppointment(${apt.id})">Cancel</button>
        </div>
    `).join('');
}

function cancelAppointment(id) {
    if (confirm('Are you sure you want to cancel this appointment?')) {
        deleteAppointment(id);
        loadAppointments();
        updateDashboard();
    }
}

function loadInsights() {
    const insights = calculateInsights();
    const monthlyData = getMonthlyData();

    // Update cards
    document.getElementById('totalBookings').textContent = insights.totalBookings;
    document.getElementById('totalRevenue').textContent = '$' + insights.totalRevenue;

    // Create/update chart
    const chartCanvas = document.getElementById('revenueChart');
    if (chartCanvas) {
        if (revenueChart) {
            revenueChart.destroy();
        }

        revenueChart = new Chart(chartCanvas, {
            type: 'bar',
            data: {
                labels: monthlyData.labels,
                datasets: [{
                    label: 'Monthly Revenue',
                    data: monthlyData.data,
                    backgroundColor: 'rgba(107, 76, 138, 0.6)',
                    borderColor: 'rgba(107, 76, 138, 1)',
                    borderWidth: 2,
                    borderRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value;
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
}

// ============ CALENDAR ============
function buildCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    if (!calendarGrid) return;

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Update month/year display
    const monthYear = document.getElementById('monthYear');
    if (monthYear) {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                            'July', 'August', 'September', 'October', 'November', 'December'];
        monthYear.textContent = monthNames[month] + ' ' + year;
    }

    // Clear calendar
    calendarGrid.innerHTML = '';

    // Add day headers
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
        const header = document.createElement('div');
        header.className = 'calendar-day-header';
        header.textContent = day;
        calendarGrid.appendChild(header);
    });

    // Get first day and number of days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const appointments = getAppointments();

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
        const day = document.createElement('div');
        day.className = 'calendar-day other-month';
        day.textContent = daysInPrevMonth - i;
        calendarGrid.appendChild(day);
    }

    // Current month days
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
        const day = document.createElement('div');
        day.className = 'calendar-day';

        const currentDate = new Date(year, month, i);
        const isToday = currentDate.toDateString() === today.toDateString();
        const hasAppointment = appointments.some(apt => {
            return new Date(apt.appointmentDate).toDateString() === currentDate.toDateString();
        });

        if (isToday) day.classList.add('today');
        if (hasAppointment) day.classList.add('has-appointment');

        day.textContent = i;
        day.title = hasAppointment ? 'Has appointment' : '';

        calendarGrid.appendChild(day);
    }

    // Next month days
    const totalCells = calendarGrid.children.length - 7; // Subtract header row
    const remainingCells = 42 - totalCells; // 6 rows × 7 days
    for (let i = 1; i <= remainingCells; i++) {
        const day = document.createElement('div');
        day.className = 'calendar-day other-month';
        day.textContent = i;
        calendarGrid.appendChild(day);
    }
}

function prevMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    buildCalendar();
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    buildCalendar();
}

// ============ UTILITY FUNCTIONS ============
function viewPackage(category) {
    const element = document.getElementById('packages');
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Close mobile menu when clicking on a link
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-menu a');
    const navMenu = document.getElementById('navMenu');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
});
