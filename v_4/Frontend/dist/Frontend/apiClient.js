const BASE_URL = 'http://localhost:3000/api/v4/requests';
async function fetchWithErrorHandling(endpoint = '', options = {}) {
    const { timeout = 10000, ...fetchOptions } = options; // Автотаймаут 10 секунд
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    const url = `${BASE_URL}${endpoint}`;
    const defaultHeaders = { 'Content-Type': 'application/json' };
    try {
        const response = await fetch(url, {
            ...fetchOptions,
            signal: controller.signal,
            headers: { ...defaultHeaders, ...options.headers }
        });
        clearTimeout(timeoutId);
        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            }
            catch {
                errorData = { message: 'Невідома помилка сервера' };
            }
            const error = new Error(errorData.message || 'Сталася помилка');
            error.status = response.status;
            error.details = errorData;
            throw error;
        }
        return response.status === 204 ? null : await response.json();
    }
    catch (error) {
        // Очищуємо таймер у разі будь-якої помилки//
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            const timeoutError = new Error('Перевищено час очікування (Timeout)');
            timeoutError.status = 408; // Request Timeout
            throw timeoutError;
        }
        throw error;
    }
}
export const requestApi = {
    getList: async (searchParam = '') => {
        const query = searchParam ? `?search=${encodeURIComponent(searchParam)}` : '';
        return await fetchWithErrorHandling(query);
    },
    getById: async (id) => {
        return await fetchWithErrorHandling(`/${id}`);
    },
    create: async (data) => {
        return await fetchWithErrorHandling('', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },
    update: async (id, data) => {
        return await fetchWithErrorHandling(`/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },
    remove: async (id) => {
        return await fetchWithErrorHandling(`/${id}`, {
            method: 'DELETE'
        });
    }
};
