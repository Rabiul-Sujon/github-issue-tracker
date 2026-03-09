// Configuration & State
const API_BASE = "https://phi-lab-server.vercel.app/api/v1/lab";
let allIssues = []; // stores the list for filtering

// --- 1. ADMIN LOGIN LOGIC ---
document.getElementById('login-btn').addEventListener('click', () => {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    //  credential check 
    if (user === 'admin' && pass === 'admin123') {
        document.getElementById('login-page').classList.add('hidden');
        document.getElementById('dashboard').classList.remove('hidden');
        loadIssues(); // load of all data
    } else {
        alert("Invalid Credentials! Use admin / admin123");
    }
});

// fetch function
 async function loadIssues(query = "") {
    const loader = document.getElementById('loader');
    const grid = document.getElementById('issues-grid');
    
    loader.classList.remove('hidden'); // Show the loading spinner
    grid.innerHTML = "";

    const url = query 
        ? `${API_BASE}/issues/search?q=${query}` 
        : `${API_BASE}/issues`;

    try {
        const res = await fetch(url);
        const result = await res.json();
        const data = result.data || [];

        // CRITICAL FIX: Only update the master list 'allIssues' if it's NOT a search.
        // This keeps the full list safe so you can click "All" later.
        if (!query) {
            allIssues = data;
        }
        
        renderCards(data); // Display what just fetched
    } catch (err) {
        console.error("API Error:", err);
        grid.innerHTML = `<p class="text-center col-span-4 py-10 text-red-500">Error loading data.</p>`;
    } finally {
        loader.classList.add('hidden'); // Hide the spinner
    }
}

