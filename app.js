let state = {
    accessRequests: JSON.parse(localStorage.getItem('requests')) || [], 
    filters: { search: '', type: 'all' }
};
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('accessRequestForm');
    render(); 
    form.addEventListener('submit', handleFormSubmit);
    document.getElementById('resetBtn')?.addEventListener('click', () => {
        form.reset();
        document.getElementById('editId').value = "";
        form.querySelector('button[type="submit"]').textContent = "Зареєструвати заявку";
        clearErrors();
    });
    document.getElementById('requestTableBody').addEventListener('click', (e) => {
        const id = Number(e.target.dataset.id);
        if (e.target.classList.contains('btn-delete')) deleteEntry(id);
        if (e.target.classList.contains('btn-edit')) editEntry(id);
    });
    document.getElementById('searchInput').addEventListener('input', (e) => {
        state.filters.search = e.target.value.toLowerCase();
        render();
    });
    document.getElementById('filterType').addEventListener('change', (e) => {
        state.filters.type = e.target.value;
        render();
    });
});
function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const dto = readForm(form);
    const editId = document.getElementById('editId').value;
    if (validate(dto)) {
        if (editId) {
            state.accessRequests = state.accessRequests.map(req => 
                req.id === Number(editId) ? { ...req, ...dto } : req
            );
            document.getElementById('editId').value = "";
            form.querySelector('button[type="submit"]').textContent = "Зареєструвати заявку";
        } else {
            state.accessRequests.push({ id: Date.now(), ...dto });
        }
        saveAndRender();
        form.reset(); 
        document.getElementById('status').value = "Pending"; 
        clearErrors();
    }
}
function readForm(form) {
    const formData = new FormData(form);
    return {
        userName: formData.get('userName'),
        requestDate: formData.get('requestDate'),
        accessType: formData.get('accessType'),
        comment: formData.get('comments'),
        status: document.getElementById('status').value
    };
}
function validate(dto) {
    clearErrors();
    let isValid = true;
    if (dto.userName.trim().length < 3) {
        showError("userName", "userNameError", "Мінімум 3 символи");
        isValid = false;
    }
    if (!dto.requestDate) {
        showError("requestDate", "requestDateError", "Оберіть дату");
        isValid = false;
    }
    if (dto.comment.trim().length < 5) {
        showError("comments", "commentsError", "Коментар занадто короткий");
        isValid = false;
    }
    return isValid;
}
function saveAndRender() {
    localStorage.setItem('requests', JSON.stringify(state.accessRequests));
    render();
}
function editEntry(id) {
    const item = state.accessRequests.find(req => req.id === id);
    if (!item) return;
    document.getElementById('editId').value = item.id;
    document.getElementById('userName').value = item.userName;
    document.getElementById('requestDate').value = item.requestDate;
    document.getElementById('accessType').value = item.accessType;
    document.getElementById('comments').value = item.comment;
    document.querySelector('button[type="submit"]').textContent = "Зберегти зміни";
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
function showError(inputId, errorId, message) {
    const inputElement = document.getElementById(inputId);
    const errorElement = document.getElementById(errorId);
    if (errorElement) errorElement.textContent = message;
    if (inputElement) inputElement.classList.add('input-error');
}
function clearErrors() {
    document.querySelectorAll('.error-label').forEach(el => el.textContent = "");
    document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
}
function render() {
    const tableBody = document.getElementById('requestTableBody');
    tableBody.innerHTML = "";
    const filteredData = state.accessRequests.filter(item => {
        const matchesSearch = item.userName.toLowerCase().includes(state.filters.search);
        const matchesType = state.filters.type === 'all' || item.accessType.trim() === state.filters.type;
        return matchesSearch && matchesType;
    });
    filteredData.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td> 
            <td><strong>${item.userName}</strong></td>
            <td>${item.requestDate.replace('T', ' ')}</td>
            <td>${item.accessType}</td>
            <td><span class="badge">${item.status}</span></td>
            <td>
                <button class="btn-edit" data-id="${item.id}">Редагувати</button>
                <button class="btn-delete" data-id="${item.id}">Видалити</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}
function deleteEntry(id) {
    if (confirm('Видалити цей запис?')) {
        state.accessRequests = state.accessRequests.filter(req => req.id !== id);
        saveAndRender();
    }
}