const API_BASE_URL = 'http://localhost:8080/api/menu';
const RESERVATION_API_URL = 'http://localhost:8080/api/reservations';

// --- 1. SCROLL ANIMATIONS ---
const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target); 
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal, .reveal-right').forEach((el) => {
    observer.observe(el);
});

// --- 2. DYNAMIC MENU FETCHING (Fixed for the new Grid CSS) ---
const menuContainer = document.getElementById('menu-container');

if (menuContainer) { 
    async function fetchMenu() {
        try {
            menuContainer.innerHTML = '<p style="font-size: 1.2rem; font-weight: bold; text-align: center; width: 100%;">Fetching heritage recipes from the database...</p>';
            
            const response = await fetch(API_BASE_URL);
            if (!response.ok) throw new Error('Backend not running');

            const menuItems = await response.json();
            menuContainer.innerHTML = ''; 
            let delay = 0;

            menuItems.forEach(item => {
                const card = document.createElement('div');
                // IMPORTANT: We are now injecting the premium 'card' class here
                card.classList.add('card', 'reveal'); 
                card.style.transitionDelay = `${delay}s`;
                delay += 0.2; 
                
                // The new HTML structure that matches your premium CSS
                card.innerHTML = `
                    <div class="card-img-box">
                        <img src="${item.imageUrl}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=600&auto=format&fit=crop'">
                    </div>
                    <div class="card-content">
                        <h3>${item.name}</h3>
                        <p>${item.description}</p>
                        <p style="color: var(--primary-color); font-weight: bold; margin-top: 15px; font-size: 1.2rem;">₹${item.price.toFixed(2)}</p>
                    </div>
                `;
                
                menuContainer.appendChild(card);
                observer.observe(card); 
            });
        } catch (error) {
            menuContainer.innerHTML = `<p style="color:red; text-align: center; width: 100%;">⚠️ Please start the Java Spring Boot backend on port 8080.</p>`;
        }
    }

    fetchMenu();
}

// --- 3. RESERVATION FORM HANDLING ---
const bookingForm = document.getElementById('booking-form');

if (bookingForm) { 
    const successMsg = document.getElementById('form-success');
    const submitButton = bookingForm.querySelector('button');

    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        submitButton.innerText = "Booking Table...";
        submitButton.disabled = true;

        const reservationData = {
            guestName: document.getElementById('name').value,
            reservationDate: document.getElementById('date').value,
            numberOfGuests: parseInt(document.getElementById('guests').value)
        };

        try {
            const response = await fetch(RESERVATION_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reservationData)
            });

            if (!response.ok) throw new Error('Failed');

            submitButton.style.display = 'none';
            successMsg.style.display = 'block';
            bookingForm.reset();
        } catch (error) {
            submitButton.innerText = "Error! Try Again.";
            submitButton.disabled = false;
        }
    });
}