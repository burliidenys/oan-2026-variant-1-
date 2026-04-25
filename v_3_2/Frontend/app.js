let state = {
    accessRequests: [],
    filters: { 
        search: '', 
        typeId: 'all'
    }
};
const API_URL = 'http://localhost:3000/requests';
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('accessRequestForm');

    fetchRequests();

    form.addEventListener('submit', handleFormSubmit);

    document.getElementById('searchInput').addEventListener('input', (e) => {
        state.filters.search = e.target.value.toLowerCase();
        renderRequests();
    });

    // Фільтр типу (серверний - НАЙВАЖЛИВІШЕ)
    document.getElementById('filterType').addEventListener('change', (e) => {
        const val = e.target.value;
        if (val === 'all') {
            fetchRequests({}); // Завантажити все
        } else {
            fetchRequests({ accessTypeId: val }); // Завантажити відфільтроване
        }
    });
});

async function fetchRequests(filters = {}) {
    try {
        const params = new URLSearchParams(filters).toString();
        const url = params ? `${API_URL}?${params}` : API_URL;

        const response = await fetch(url);
        if (!response.ok) throw new Error('Помилка завантаження');
        
        const data = await response.json();
    
        state.accessRequests = data;

        renderRequests();
    } catch (error) {
        console.error("Помилка при отриманні даних:", error);
    }
}
function renderRequests() {
    const container = document.querySelector('.table-responsive');
    const tableBody = document.querySelector('.data-table tbody');

    tableBody.innerHTML = '';
    const filtered = state.accessRequests.filter(req => 
        req.userName.toLowerCase().includes(state.filters.search)
    );

    filtered.forEach(req => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${req.id}</td>
            <td>${req.userName}</td>
            <td>${new Date(req.createdAt).toLocaleString()}</td>
            <td><span class="badge-type">${req.typeLabel}</span></td>
            <td><span class="status-${req.statusLabel.toLowerCase()}">${req.statusLabel}</span></td>
            <td>
                <button class="btn-edit" onclick="editEntry(${req.id})">⚙️</button>
                <button class="btn-delete" onclick="deleteEntry(${req.id})">🗑️</button>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}
function validateForm(userName, requestDate, details) {
    clearErrors();
    let isValid = true;
    if (!userName || userName.trim().length < 2) {
        showError('userName', "Вкажіть коректне ім'я");
        isValid = false;
    }
    if (!requestDate) {
        showError('requestDate', "Оберіть дату візиту");
        isValid = false;
    } else {
        const selected = new Date(requestDate).getTime();
        const now = Date.now();

        if (selected < now) {
            showError('requestDate', "Дата не може бути в минулому");
            isValid = false;
        }
    }

    // 3. Перевірка коментарів
    if (!details || details.trim().length < 3) {
        showError('comments', "Напишіть причину");
        isValid = false;
    }

    return isValid;
}
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const userName = document.getElementById('userName').value;
    const comments = document.getElementById('comments').value;
    const requestDate = document.getElementById('requestDate').value;

    if (!validateForm(userName, requestDate, comments)) {
        return;
    }

    const id = document.getElementById('editId').value;
    const data = {
        userName: userName,
        details: comments,
        accessTypeId: document.getElementById('accessType').value
    };

    try {
        const url = id ? `${API_URL}/${id}` : API_URL;
        const method = id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
            
        if (response.ok) {
            resetForm();
            await fetchRequests(); 
        } else {
            const errData = await response.json();
            alert("Помилка: " + (errData.message || "Невідома помилка"));
        }
    } catch (error) {
        console.error("Помилка при відправці:", error);
        alert("Сервер не відповідає");
    }
}

function resetForm() {
    const form = document.getElementById('accessRequestForm');
    form.reset();
    document.getElementById('editId').value = '';
    document.querySelector('.btn-primary').textContent = "Зареєструвати заявку";
}
async function deleteEntry(id) {
    if (confirm("Видалити запис №" + id + "?")) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        fetchRequests();
    }
}

function editEntry(id) {
    const entry = state.accessRequests.find(r => r.id == id);
    if (!entry) return;
    document.getElementById('userName').value = entry.userName;
    document.getElementById('comments').value = entry.details;
    document.getElementById('accessType').value = entry.accessTypeId || "1";
    document.getElementById('editId').value = entry.id;
    document.querySelector('.btn-primary').textContent = "Оновити заявку";
    document.querySelector('.form-card').scrollIntoView({ behavior: 'smooth' });
}
function showError(fieldId, message) {
    const errSpan = document.getElementById(fieldId + 'Error');
    if (errSpan) errSpan.textContent = message;
    document.getElementById(fieldId)?.classList.add('input-error');
}

function clearErrors() {
    document.querySelectorAll('.error-label').forEach(el => el.textContent = '');
    document.querySelectorAll('input, textarea, select').forEach(el => el.classList.remove('input-error'));
}
const resetBtn = document.getElementById('resetBtn');

if (resetBtn) {
    resetBtn.addEventListener('click', () => {
        resetForm(); 
    });
}