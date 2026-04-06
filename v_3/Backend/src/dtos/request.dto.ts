export interface CreateRequestDto {
    userName: string;
    details: string;
    accessTypeId: number;
}

export const validate = (data: any): string | null => {
    if (!data.userName || typeof data.userName !== 'string') return "Ім'я користувача обов'язкове";
    if (!data.details || data.details.length < 3) return "Деталі занадто короткі";
    if (!data.accessTypeId) return "Не вказано тип доступу";
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