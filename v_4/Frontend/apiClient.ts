import { AccessRequest, AccessRequestDTO } from '../shared/types.js';

interface ApiError extends Error {
    status?: number;
    details?: any;
}
const BASE_URL = 'http://localhost:3000/api/v4/requests';

interface ExtendedRequestInit extends RequestInit {
    timeout?: number;
}
async function fetchWithErrorHandling<T>(endpoint: string = '', options: RequestInit & { timeout?: number } = {}): Promise<T> {
    const { timeout = 10000, ...fetchOptions } = options; // Автотаймаут 10 секунд
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    const url = `${BASE_URL}${endpoint}`;
    const defaultHeaders: Record<string, string> = { 'Content-Type': 'application/json' };
    try {
        const response = await fetch(url, {
            ...fetchOptions,
            signal: controller.signal, 
            headers: { ...defaultHeaders, ...(options.headers as Record<string, string>) }
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
            let errorData;
            try { 
                errorData = await response.json(); 
            } catch { 
                errorData = { message: 'Невідома помилка сервера' }; 
            }
            const error = new Error(errorData.message || 'Сталася помилка') as ApiError;
            error.status = response.status;
            error.details = errorData;
            throw error;
        }

        return response.status === 204 ? (null as T) : await response.json();

    } catch (error: any) {
        // Очищуємо таймер у разі будь-якої помилки//
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            const timeoutError = new Error('Перевищено час очікування (Timeout)') as ApiError;
            timeoutError.status = 408; // Request Timeout
            throw timeoutError;
        }
        throw error;
    }
}

export const requestApi = {
    getList: async (searchParam: string = ''): Promise<AccessRequest[]> => {
        const query = searchParam ? `?search=${encodeURIComponent(searchParam)}` : '';
        return await fetchWithErrorHandling<AccessRequest[]>(query);
    },
    getById: async (id: number | string): Promise<AccessRequest> => {
        return await fetchWithErrorHandling<AccessRequest>(`/${id}`);
    },
    create: async (data: AccessRequestDTO): Promise<AccessRequest> => {
        return await fetchWithErrorHandling<AccessRequest>('', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },
    update: async (id: number | string, data: AccessRequestDTO): Promise<AccessRequest> => {
        return await fetchWithErrorHandling<AccessRequest>(`/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },
    remove: async (id: number | string): Promise<void> => {
        return await fetchWithErrorHandling<void>(`/${id}`, {
            method: 'DELETE'
        });
    }
};