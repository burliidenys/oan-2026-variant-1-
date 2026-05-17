import { requestApi } from './apiClient.js';
let state = {
    accessRequests: [],
    filters: {
        search: '',
        typeId: 'all'
    }
};
const API_URL = 'http://localhost:3000/api/v5/requests';
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('accessRequestForm');
    fetchRequests();
    form?.addEventListener('submit', handleFormSubmit);
    document.getElementById('searchInput')?.addEventListener('input', (e) => {
        const target = e.target;
        state.filters.search = target.value.toLowerCase();
        renderRequests();
    });
    document.getElementById('filterType')?.addEventListener('change', (e) => {
        const target = e.target;
        state.filters.typeId = target.value;
        renderRequests();
    });
});
async function fetchRequests() {
    const tableBody = document.getElementById('requestTableBody');
    if (tableBody) {
        tableBody.innerHTML = '<tr><td colspan="6" class="loading-msg">Завантаження даних...</td></tr>';
    }
    try {
        const data = await requestApi.getList();
        state.accessRequests = data;
        renderRequests();
    }
    catch (err) {
        handleApiError(err);
        if (tableBody) {
            tableBody.innerHTML = '<tr><td colspan="6" class="error-msg" style="color: red; text-align: center;">Не вдалося завантажити дані. Перевірте з’єднання.</td></tr>';
        }
    }
}
function renderRequests() {
    const tableBody = document.getElementById('requestTableBody');
    if (!tableBody)
        return;
    tableBody.innerHTML = '';
    const filtered = state.accessRequests.filter(req => {
        const matchesSearch = req.userName.toLowerCase().includes(state.filters.search);
        const matchesType = state.filters.typeId === 'all' ||
            req.typeLabel === state.filters.typeId;
        return matchesSearch && matchesType;
    });
    if (filtered.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="empty-msg">Заявок не знайдено (спробуйте змінити фільтр)</td></tr>';
        return;
    }
    filtered.forEach(req => {
        const tr = document.createElement('tr');
        const displayDate = req.requestDate || req.createdAt || new Date().toISOString();
        tr.innerHTML = `
            <td>${req.id}</td>
            <td>${req.userName}</td>
            <td>${new Date(displayDate).toLocaleString()}</td>
            <td><span class="badge-type">${req.typeLabel || 'Звичайний'}</span></td>
            <td><span class="status-${(req.statusLabel || 'pending').toLowerCase()}">${req.statusLabel || 'Очікується'}</span></td>
            <td>
                <button class="btn-edit" onclick="fetchRequestDetails(${req.id})">⚙️</button>
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
    }
    else {
        const selected = new Date(requestDate).getTime();
        const now = Date.now();
        if (selected < now) {
            showError('requestDate', "Дата не може бути в минулому");
            isValid = false;
        }
    }
    if (!details || details.trim().length < 3) {
        showError('comments', "Напишіть причину");
        isValid = false;
    }
    return isValid;
}
async function handleFormSubmit(e) {
    e.preventDefault();
    if (typeof clearErrors === 'function')
        clearErrors();
    const userName = document.getElementById('userName').value.trim();
    const requestDate = document.getElementById('requestDate').value;
    const details = document.getElementById('comments').value.trim();
    const accessTypeId = document.getElementById('accessType').value;
    const editId = document.getElementById('editId').value;
    const isFormValid = validateForm(userName, requestDate, details);
    const clientErrors = [];
    if (!userName)
        clientErrors.push("Ім'я користувача обов'язкове");
    else if (userName.length < 2)
        clientErrors.push("Ім'я занадто коротке (мінімум 2 символи)");
    if (!details)
        clientErrors.push("Деталі запиту обов'язкові");
    else if (details.length < 5)
        clientErrors.push("Деталі мають містити хоча б 5 символів");
    if (!accessTypeId)
        clientErrors.push("Будь ласка, оберіть тип доступу");
    if (clientErrors.length > 0 || !isFormValid) {
        alert("Помилка заповнення форми:\n• " + clientErrors.join("\n• "));
        return;
    }
    if (!validateForm(userName, requestDate, details))
        return;
    const formData = { userName, details, accessTypeId, requestDate };
    try {
        if (editId) {
            await requestApi.update(parseInt(editId), formData);
        }
        else {
            await requestApi.create(formData);
        }
        alert(editId ? "Заявку успішно оновлено!" : "Заявку успішно створено!");
        resetForm();
        fetchRequests();
    }
    catch (err) {
        handleApiError(err);
    }
}
window.fetchRequestDetails = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const data = await response.json();
        fillForm(data);
    }
    catch (err) {
        handleApiError(err);
    }
};
window.fetchRequestDetails = async (id) => {
    try {
        const data = await requestApi.getById(id); // Використовуй готовий метод!
        fillForm(data);
    }
    catch (err) {
        handleApiError(err);
    }
};
window.editEntry = (id) => {
    const entry = state.accessRequests.find(r => r.id == id);
    if (!entry)
        return;
    document.getElementById('userName').value = entry.userName;
    document.getElementById('comments').value = entry.details;
    document.getElementById('accessType').value = entry.accessTypeId.toString() || "1";
    document.getElementById('editId').value = entry.id.toString();
    const btn = document.querySelector('.btn-primary');
    if (btn)
        btn.textContent = "Оновити заявку";
    const formCard = document.querySelector('.form-card');
    if (formCard)
        formCard.scrollIntoView({ behavior: 'smooth' });
};
function fillForm(data) {
    document.getElementById('editId').value = data.id;
    document.getElementById('userName').value = data.userName;
    document.getElementById('requestDate').value = data.requestDate;
    document.getElementById('comments').value = data.details;
    document.getElementById('accessType').value = data.accessTypeId;
    const btn = document.querySelector('.btn-primary');
    if (btn)
        btn.textContent = "Зберегти зміни";
}
function resetForm() {
    const form = document.getElementById('accessRequestForm');
    form?.reset();
    document.getElementById('editId').value = '';
    const btn = document.querySelector('.btn-primary');
    if (btn)
        btn.textContent = "Зареєструвати заявку";
}
function showError(fieldId, message) {
    const errSpan = document.getElementById(fieldId + 'Error');
    if (errSpan)
        errSpan.textContent = message;
    document.getElementById(fieldId)?.classList.add('input-error');
}
function clearErrors() {
    document.querySelectorAll('.error-label').forEach(el => (el.textContent = ''));
    document.querySelectorAll('input, textarea, select').forEach(el => el.classList.remove('input-error'));
}
const resetBtn = document.getElementById('resetBtn');
resetBtn?.addEventListener('click', () => resetForm());
function handleApiError(err) {
    console.error('API Error Details:', err);
    //Бекенд вимкнений / Мережа недоступна//
    if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
        alert("Помилка зв'язку: Сервер недоступний. Перевірте, чи запущено Backend.");
        return;
    }
    //Таймаут//
    if (err.status === 408) {
        alert("Час очікування вичерпано: Сервер занадто довго не відповідає.");
        return;
    }
    if (err.status === 400) {
        if (err.details && err.details.errors) {
            const serverErrors = err.details.errors;
            Object.keys(serverErrors).forEach(key => {
                const fieldId = key === 'details' ? 'comments' : key;
                showError(fieldId, serverErrors[key]);
            });
            alert("Помилка валідації. Перевірте підсвічені поля.");
        }
        else {
            alert(`Помилка валідації: ${err.message}`);
        }
        return;
    }
    if (err.status === 500) {
        alert("Внутрішня помилка сервера (500). Спробуйте пізніше або зверніться до адміністратора.");
        return;
    }
    if (err.status === 404) {
        alert("Помилка 404: Запис не знайдено.");
        return;
    }
    alert(`Сталася помилка: ${err.message}`);
}
window.deleteEntry = async (id) => {
    if (!confirm('Ви впевнені, що хочете видалити цю заявку?'))
        return;
    try {
        await requestApi.remove(id);
        alert('Заявку успішно видалено');
        await fetchRequests();
    }
    catch (err) {
        handleApiError(err);
    }
};
