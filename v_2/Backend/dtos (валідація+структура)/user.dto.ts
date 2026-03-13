// Визначаємо інтерфейс для того, що очікуємо від клієнта
export interface UserCreateDto {
    name: string;
    email: string;
}
export const validate = (data: any): string | null => {
    if (!data.name || data.name.length < 2) return "Ім'я занадто коротке";
    if (!data.email || !data.email.includes('@')) return "Некоректний email";
    return null;
};

// Функція для форматування відповіді (щоб не віддавати зайвого)
export const toResponse = (user: any) => ({
    id: user.id,
    name: user.name,
    email: user.email
});