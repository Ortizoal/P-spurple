// Service and Pricing Data - P's Purple Rate Card
// All prices in Ghana Cedis (GHS)

const servicePackages = {
    bridal: [
        {
            id: 'bridal-trial',
            name: 'Bridal Trial & Consultation',
            duration: 'Flexible',
            price: 300,
            description: 'Trial & consultation session to establish rapport, discuss skin type, select cosmetics, and create your ideal look',
            includes: ['Skin Type Assessment', 'Product Selection', 'Look Creation', 'Discussion & Planning']
        },
        {
            id: 'bridal-silver',
            name: 'Silver Package',
            duration: '2 hours',
            price: 2000,
            description: 'Single event styling - White wedding, Traditional engagement, or Court signing',
            includes: ['One Complete Look', 'Professional Makeup', 'Touch-up Kit', 'Consultation']
        },
        {
            id: 'bridal-premium',
            name: 'Premium Package - Same Day',
            duration: '4 hours',
            price: 3500,
            description: 'Two distinct looks for two occasions on the same day - Traditional & White wedding, Traditional engagement & Reception, or Court signing & Reception',
            includes: ['Two Complete Looks', 'Professional Makeup', 'Touch-up Kit', 'Expert Styling', 'Multiple Event Coordination']
        },
        {
            id: 'bridal-chic',
            name: 'Chic Luxe Package',
            duration: '4 hours',
            price: 4500,
            description: '2-day event glam with one look for each day - Traditional & White wedding or Maid of honor/Mother of bride coverage',
            includes: ['Two Day Coverage', 'Two Complete Looks', 'Professional Makeup', 'Touch-up Kits', 'Expert Styling']
        },
        {
            id: 'bridal-opulent',
            name: 'Opulent Package',
            duration: '4 hours',
            price: 5500,
            description: '3-day comprehensive package covering Pre-wedding makeup, Traditional Engagement, and White Wedding & Reception',
            includes: ['Three Day Coverage', 'Pre-wedding Makeup', 'Traditional Engagement Look', 'White Wedding & Reception', 'Touch-up Kits', 'Expert Styling']
        },
        {
            id: 'bridal-purple',
            name: 'The Purple Experience',
            duration: 'Multi-day',
            price: 7000,
            description: 'Ultimate 4-day comprehensive package - Pre-wedding, Traditional Engagement, White Wedding & Reception, Sunday Thanksgiving, plus Maid of honor & Mother of bride coverage',
            includes: ['4-Day Full Coverage', 'Pre-wedding Makeup', 'Traditional Engagement', 'White Wedding & Reception', 'Sunday Thanksgiving', 'Maid of Honor Makeup', 'Mother of Bride Makeup', 'Touch-up Kits', 'Premium Styling']
        }
    ],
    extras: [
        {
            id: 'extra-thanksgiving',
            name: 'Sunday Thanksgiving',
            price: 1000,
            description: 'Makeup service for Sunday Thanksgiving event'
        },
        {
            id: 'extra-bridesmaid',
            name: 'Bridesmaids (1-5)',
            price: 500,
            description: 'Makeup for up to 5 bridesmaids'
        },
        {
            id: 'extra-bridesmaid-6',
            name: 'Bridesmaids (6+)',
            price: 400,
            description: 'Makeup per bridesmaid for 6 or more'
        },
        {
            id: 'extra-mother',
            name: 'Mother of Bride',
            price: 400,
            description: 'Makeup service for mother of the bride'
        },
        {
            id: 'extra-christening',
            name: 'Baby Christening',
            price: 1000,
            description: 'Professional makeup for baby christening event'
        },
        {
            id: 'extra-celebrant',
            name: 'Party Celebrant',
            price: 1000,
            description: 'Makeup service for party celebrant'
        },
        {
            id: 'extra-studio',
            name: 'Studio Service (Walk-in)',
            price: 300,
            description: 'Professional makeup at studio location'
        },
        {
            id: 'extra-home',
            name: 'Home Service',
            price: 500,
            description: 'Professional makeup service at your preferred location'
        },
        {
            id: 'extra-birthday',
            name: 'Birthday Shoot',
            price: 600,
            description: 'Professional makeup for birthday shoot/celebration'
        },
        {
            id: 'extra-waiting',
            name: 'Waiting Time (Per Hour)',
            price: 100,
            description: 'Charge for waiting time beyond scheduled hours'
        }
    ],
    transport: [
        {
            id: 'transport-same-day',
            name: 'Transport - Same Day',
            price: '150 - 250',
            description: 'Transportation charge for same day events'
        },
        {
            id: 'transport-diff-day',
            name: 'Transport - Different Days',
            price: '300 - 500',
            description: 'Transportation charge for events on different days'
        }
    ]
};

// Helper function to get all rates for the rate card
function getAllRates() {
    const rates = [];
    
    // Main bridal packages
    servicePackages.bridal.forEach(service => {
        rates.push({
            service: service.name,
            duration: service.duration,
            price: 'GHS ' + service.price
        });
    });
    
    // Extra services
    servicePackages.extras.forEach(service => {
        rates.push({
            service: service.name,
            duration: 'Variable',
            price: 'GHS ' + service.price
        });
    });
    
    // Transport charges
    servicePackages.transport.forEach(service => {
        rates.push({
            service: service.name,
            duration: 'Variable',
            price: 'GHS ' + service.price
        });
    });
    
    return rates;
}

// Initialize appointments storage
function initializeAppointments() {
    if (!localStorage.getItem('appointments')) {
        localStorage.setItem('appointments', JSON.stringify([]));
    }
}

// Get all appointments
function getAppointments() {
    return JSON.parse(localStorage.getItem('appointments') || '[]');
}

// Save appointment
function saveAppointment(appointment) {
    const appointments = getAppointments();
    appointment.id = Date.now();
    appointment.bookingDate = new Date().toLocaleString();
    appointments.push(appointment);
    localStorage.setItem('appointments', JSON.stringify(appointments));
    return appointment;
}

// Delete appointment
function deleteAppointment(id) {
    const appointments = getAppointments();
    const filtered = appointments.filter(a => a.id !== id);
    localStorage.setItem('appointments', JSON.stringify(filtered));
}

// Calculate insights
function calculateInsights() {
    const appointments = getAppointments();
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let totalRevenue = 0;
    let monthlyRevenue = 0;
    let monthlyClients = 0;

    appointments.forEach(apt => {
        // Get price from service
        let price = 0;
        const servicePackages = {
            bridal: [
                { name: 'Bridal Trial & Consultation', price: 300 },
                { name: 'Silver Package', price: 2000 },
                { name: 'Premium Package - Same Day', price: 3500 },
                { name: 'Chic Luxe Package', price: 4500 },
                { name: 'Opulent Package', price: 5500 },
                { name: 'The Purple Experience', price: 7000 }
            ]
        };
        
        servicePackages.bridal.forEach(service => {
            if (service.name.toLowerCase() === apt.service.toLowerCase()) {
                price = service.price;
            }
        });

        totalRevenue += price;

        const aptDate = new Date(apt.appointmentDate);
        if (aptDate.getMonth() === currentMonth && aptDate.getFullYear() === currentYear) {
            monthlyRevenue += price;
            monthlyClients++;
        }
    });

    return {
        totalBookings: appointments.length,
        totalRevenue: totalRevenue,
        monthlyRevenue: monthlyRevenue,
        monthlyClients: monthlyClients,
        averageRating: 4.8
    };
}

// Get monthly data for chart
function getMonthlyData() {
    const appointments = getAppointments();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData = new Array(12).fill(0);

    appointments.forEach(apt => {
        const aptDate = new Date(apt.appointmentDate);
        let price = 0;
        
        const servicePackages = {
            bridal: [
                { name: 'Bridal Trial & Consultation', price: 300 },
                { name: 'Silver Package', price: 2000 },
                { name: 'Premium Package - Same Day', price: 3500 },
                { name: 'Chic Luxe Package', price: 4500 },
                { name: 'Opulent Package', price: 5500 },
                { name: 'The Purple Experience', price: 7000 }
            ]
        };
        
        servicePackages.bridal.forEach(service => {
            if (service.name.toLowerCase() === apt.service.toLowerCase()) {
                price = service.price;
            }
        });
        
        monthlyData[aptDate.getMonth()] += price;
    });

    return {
        labels: months,
        data: monthlyData
    };
}

// Initialize on load
initializeAppointments();
