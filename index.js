// Configuration & State
const API_BASE = "https://phi-lab-server.vercel.app/api/v1/lab";
let allIssues = []; // stores the list for filtering

// 1. ADMIN LOGIN LOGIC ---
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

//  2. fetch function
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

        // full list safe to click "All" later.
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
// 3. Render or Injecting cards 

function renderCards(issues) {
    const grid = document.getElementById('issues-grid');
    document.getElementById('issue-count').innerText = issues.length;
    grid.innerHTML = "";

    issues.forEach(item => {
        const status = item.status?.toLowerCase();
        
        const statusIcon = status === "open" 
            ? "./assets/Open-Status.png"
            : "./assets/Closed- Status .png";

        const borderStyle = status === 'closed' ? 'border-closed' : 'border-open';

        const card = document.createElement('div');
        card.className = `card bg-white shadow-sm p-5 border border-gray-100 rounded-lg ${borderStyle}`;
        
        card.innerHTML = `
            <div class="flex justify-between items-start mb-3">
                <img src="${statusIcon}" alt="${status}" class="w-6 h-6">
                <span class="text-[10px] font-bold px-3 py-1 rounded-full bg-red-50 text-red-500 uppercase">
                    ${item.priority || 'HIGH'}
                </span>
            </div>

            <h4 class="font-bold text-gray-800 text-md mb-2 cursor-pointer hover:text-indigo-600 transition-colors" 
                onclick="showIssueDetail(${item.id})">
                ${item.title}
            </h4>
            <p class="text-xs text-gray-400 mb-6 line-clamp-2 leading-relaxed">
                ${item.description}
            </p>

            <div class="flex gap-2 mb-6">
                <span class="flex items-center gap-1 bg-red-50 text-red-500 text-[10px] px-2 py-1 rounded-full font-bold border border-red-100 uppercase">
                    <i class="fa-solid fa-bug text-[8px]"></i> BUG
                </span>
                <span class="flex items-center gap-1 bg-yellow-50 text-yellow-600 text-[10px] px-2 py-1 rounded-full font-bold border border-yellow-100 uppercase">
                    <i class="fa-solid fa-circle-dot text-[8px]"></i> HELP WANTED
                </span>
            </div>

            <div class="pt-4 border-t border-gray-50 flex flex-col gap-1">
                <p class="text-[11px] text-gray-400 font-medium">#${item.id} by ${item.author}</p>
                <p class="text-[11px] text-gray-400 font-medium">${item.createdAt || '1/15/2026'}</p>
            </div>
        `;
        grid.appendChild(card);
    });
}

// --- 4. Tab filtering logic---
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
        // UI State: Highlight the active button
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('tab-active', 'bg-indigo-600', 'text-white'));
        e.target.classList.add('tab-active', 'bg-indigo-600', 'text-white');

        const filter = e.target.dataset.filter;

        if (filter === 'all') {
            // When clicking 'All', clear search and show the master list
            document.getElementById('search-input').value = "";
            renderCards(allIssues); 
        } else {
            // Filter the saved 'allIssues' list locally
            const filteredData = allIssues.filter(i => i.status?.toLowerCase() === filter);
            renderCards(filteredData);
        }
    });
});

