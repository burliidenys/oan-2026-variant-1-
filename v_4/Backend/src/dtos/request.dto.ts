export interface CreateRequestDto {
    userName: string;
    details: string;
    accessTypeId: number;
}

export const validate = (data: any): string | null => {
    if (!data.userName || typeof data.userName !== 'string') return "Ім'я користувача обов'язкове";
    if (!data.details || typeof data.details !== 'string') return "Поле 'деталі' має бути рядком";
    if (data.accessTypeId === undefined || data.accessTypeId === null) return "Не вказано тип доступу";
    if (data.userName.trim().length < 2 || data.userName.length > 60) {
        return "Ім'я користувача має бути від 2 до 60 символів";
    }
    if (data.details.trim().length < 5 || data.details.length > 500) {
        return "Деталі мають містити від 5 до 500 символів";
    }
    const typeId = Number(data.accessTypeId);
    if (isNaN(typeId) || typeId < 1 || typeId > 100) {
        return "Некоректний ID типу доступу (діапазон 1-100)";
    }
    if (data.requestDate) {
        const d = new Date(data.requestDate);
        if (isNaN(d.getTime())) return "Некоректний формат дати";
    }
    return null; 
};
export const toResponse = (data: any) => ({
    id: data.id,
    userName: data.userName,
    createdAt: data.createdAt,
    typeLabel: data.typeLabel,
    statusLabel: data.statusLabel,
    details: data.details
});