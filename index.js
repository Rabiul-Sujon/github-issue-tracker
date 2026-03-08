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

