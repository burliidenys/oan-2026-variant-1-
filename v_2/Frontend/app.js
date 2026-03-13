let state = {
    accessRequests: [],
    filters: { search: '', type: 'all' }
};

const API_URL = 'http://localhost:3000/requests';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('accessRequestForm');
    const dateInput = document.getElementById('requestDate');
    if (dateInput) dateInput.min = new Date().toISOString().split("T")[0];

    fetchRequests();
    form.addEventListener('submit', handleFormSubmit);

    document.getElementById('resetBtn')?.addEventListener('click', () => {
        form.reset();
        clearErrors();
        document.getElementById('editId').value = "";
    });

    document.getElementById('requestTableBody').addEventListener('click', (e) => {
        const id = Number(e.target.dataset.id);
        if (e.target.classList.contains('btn-delete')) deleteEntry(id);
        if (e.target.classList.contains('btn-edit')) editEntry(id);
    });
});

// ВАЛІДАЦІЯ ТА ПІДСВІТКА
function validateForm(userName, requestDate, comments) {
    clearErrors();
    let isValid = true;

    if (userName.trim().length < 2) {
        showError('userName', "Ім'я занадто коротке!");
        isValid = false;
    }
    const today = new Date(); today.setHours(0, 0, 0, 0);
    if (!requestDate || new Date(requestDate) < today) {
        showError('requestDate', "Дата не може бути в минулому!");
        isValid = false;
    }
    if (comments.trim().length < 5) {
        showError('comments', "Мінімум 5 символів!");
        isValid = false;
    }
    return isValid;
}

function showError(id, msg) {
    const el = document.getElementById(id);
    const err = document.getElementById(id + 'Error');
    if (el) el.classList.add('input-error');
    if (err) err.textContent = msg;
}

function clearErrors() {
    document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
    document.querySelectorAll('.error-label').forEach(el => el.textContent = '');
}
async function fetchRequests() {
    try {
        const res = await fetch(API_URL);
        state.accessRequests = await res.json();
        render();
    } catch (e) { console.error(e); }
}

// ОБРОБКА ФОРМИ
async function handleFormSubmit(e) {
    e.preventDefault();
    const data = {
        userName: document.getElementById('userName').value,
        requestDate: document.getElementById('requestDate').value,
        accessType: document.getElementById('accessType').value,
        comments: document.getElementById('comments').value
    };

    if (!validateForm(data.userName, data.requestDate, data.comments)) return;

    const editId = document.getElementById('editId').value;
    const body = { 
        userId: 1, 
        details: `${data.userName} | ${data.requestDate} | ${data.accessType} | ${data.comments}` 
    };

    await fetch(editId ? `${API_URL}/${editId}` : API_URL, {
        method: editId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    e.target.reset();
    fetchRequests();
}

// РЕНДЕР ТАБЛИЦІ
// Додайте це всередину DOMContentLoaded
document.getElementById('searchInput')?.addEventListener('input', () => render());
document.getElementById('filterType')?.addEventListener('change', () => render());

// Оновіть функцію render
function render() {
    const tbody = document.getElementById('requestTableBody');
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const typeFilter = document.getElementById('filterType').value;
    
    tbody.innerHTML = '';
    
    state.accessRequests
        .filter(req => {
            const matchesSearch = req.details.toLowerCase().includes(searchTerm);
            const matchesType = typeFilter === 'all' || req.details.includes(typeFilter);
            return matchesSearch && matchesType;
        })
        .forEach(req => {
            const parts = req.details.split(' | ');
            tbody.innerHTML += `<tr>
                <td>${req.id}</td>
                <td>${parts[0]?.replace('Користувач: ', '')}</td>
                <td>${parts[1]?.replace('Дата: ', '')}</td>
                <td>${parts[2] || ''}</td>
                <td>Pending</td>
                <td>
                    <button class="btn-edit" data-id="${req.id}">Редагувати</button>
                    <button class="btn-delete" data-id="${req.id}">Видалити</button>
                </td>
            </tr>`;
        });
}

async function deleteEntry(id) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchRequests();
}

function editEntry(id) {
    const entry = state.accessRequests.find(r => r.id === id);
    const parts = entry.details.split(' | ');
    document.getElementById('userName').value = parts[0];
    document.getElementById('requestDate').value = parts[1];
    document.getElementById('accessType').value = parts[2];
    document.getElementById('comments').value = parts[3];
    document.getElementById('editId').value = entry.id;
}

document.getElementById('filterType')?.addEventListener('change', (e) => {
    state.filters.type = e.target.value; // Зберігаємо обраний тип у стейт
    render(); // Перемальовуємо таблицю
});