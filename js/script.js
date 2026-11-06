
const alumniForm = document.getElementById("alumniForm");
const eventForm = document.getElementById("eventForm");

let alumni = JSON.parse(localStorage.getItem("alumni")) || [];
let events = JSON.parse(localStorage.getItem("events")) || [];

function saveData() {
    localStorage.setItem("alumni", JSON.stringify(alumni));
    localStorage.setItem("events", JSON.stringify(events));
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

// Display alumni profiles
function displayAlumni(list = alumni) {
    const container = document.getElementById("alumniList");

    container.innerHTML = "";

    if (list.length === 0) {
        container.innerHTML = '<p class="empty">No alumni found.</p>';
    }

    list.forEach(person => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <h3>${escapeHTML(person.name)}</h3>
            <p><strong>Email:</strong> ${escapeHTML(person.email)}</p>
            <p><strong>Phone:</strong> ${escapeHTML(person.phone)}</p>
            <p><strong>Department:</strong> ${escapeHTML(person.department)}</p>
            <p><strong>Graduation:</strong> ${escapeHTML(person.year)}</p>
            <p><strong>Job:</strong> ${escapeHTML(person.job || "Not specified")}</p>

            <button class="edit-btn" onclick="editAlumni(${person.id})">
                Edit
            </button>

            <button class="delete-btn" onclick="deleteAlumni(${person.id})">
                Delete
            </button>
        `;

        container.appendChild(card);
    });

    updateStats();
}

// Add or update alumni
alumniForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const editId = document.getElementById("editId").value;

    const person = {
        id: editId ? Number(editId) : Date.now(),
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        department: document.getElementById("department").value.trim(),
        year: document.getElementById("year").value,
        job: document.getElementById("job").value.trim()
    };

    if (editId) {
        alumni = alumni.map(item =>
            item.id === Number(editId) ? person : item
        );
    } else {
        alumni.push(person);
    }

    saveData();
    displayAlumni();
    displayContacts();

    alumniForm.reset();
    document.getElementById("editId").value = "";
    document.getElementById("submitBtn").textContent = "Add Alumni";
});

// Edit alumni
function editAlumni(id) {
    const person = alumni.find(item => item.id === id);

    if (!person) return;

    document.getElementById("editId").value = person.id;
    document.getElementById("name").value = person.name;
    document.getElementById("email").value = person.email;
    document.getElementById("phone").value = person.phone;
    document.getElementById("department").value = person.department;
    document.getElementById("year").value = person.year;
    document.getElementById("job").value = person.job;

    document.getElementById("submitBtn").textContent = "Update Alumni";

    document.getElementById("profiles").scrollIntoView({
        behavior: "smooth"
    });
}

// Delete alumni
function deleteAlumni(id) {
    if (!confirm("Are you sure you want to delete this alumni?")) {
        return;
    }

    alumni = alumni.filter(person => person.id !== id);

    saveData();
    displayAlumni();
    displayContacts();
}

// Search alumni
document.getElementById("search").addEventListener("input", function() {
    const query = this.value.toLowerCase();

    const filtered = alumni.filter(person =>
        person.name.toLowerCase().includes(query) ||
        person.department.toLowerCase().includes(query)
    );

    displayAlumni(filtered);
});

// Display alumni contacts
function displayContacts() {
    const container = document.getElementById("contactList");

    container.innerHTML = "";

    if (alumni.length === 0) {
        container.innerHTML = '<p class="empty">No contacts available.</p>';
    }

    alumni.forEach(person => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <h3>${escapeHTML(person.name)}</h3>
            <p>Email: ${escapeHTML(person.email)}</p>
            <p>Phone: ${escapeHTML(person.phone)}</p>
            <p>Department: ${escapeHTML(person.department)}</p>
        `;

        container.appendChild(card);
    });

    updateStats();
}

// Add event
eventForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const newEvent = {
        id: Date.now(),
        name: document.getElementById("eventName").value.trim(),
        date: document.getElementById("eventDate").value,
        venue: document.getElementById("eventVenue").value.trim()
    };

    events.push(newEvent);

    saveData();
    displayEvents();
    eventForm.reset();
});

// Display events
function displayEvents() {
    const container = document.getElementById("eventList");

    container.innerHTML = "";

    const upcoming = events
        .filter(event => event.date >= new Date().toISOString().slice(0, 10))
        .sort((a, b) => a.date.localeCompare(b.date));

    if (upcoming.length === 0) {
        container.innerHTML = '<p class="empty">No upcoming events.</p>';
    }

    upcoming.forEach(event => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <h3>${escapeHTML(event.name)}</h3>
            <p><strong>Date:</strong> ${escapeHTML(event.date)}</p>
            <p><strong>Venue:</strong> ${escapeHTML(event.venue)}</p>

            <button class="delete-btn" onclick="deleteEvent(${event.id})">
                Delete Event
            </button>
        `;

        container.appendChild(card);
    });

    updateStats();
}

// Delete event
function deleteEvent(id) {
    if (!confirm("Delete this event?")) return;

    events = events.filter(event => event.id !== id);

    saveData();
    displayEvents();
}

// Update dashboard statistics
function updateStats() {
    document.getElementById("totalAlumni").textContent = alumni.length;

    document.getElementById("totalEvents").textContent =
        events.filter(event =>
            event.date >= new Date().toISOString().slice(0, 10)
        ).length;

    document.getElementById("totalContacts").textContent = alumni.length;
}

// Initial display
displayAlumni();
displayEvents();
displayContacts();
