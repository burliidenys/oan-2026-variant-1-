export interface UserCreateDto {
    name: string;
}
export const validate = (data: any): string | null => {
    if (!data.name || typeof data.name !== 'string') return "Ім'я користувача обов'язкове";
    if (data.name.trim().length < 2 || data.name.length > 100) {
        return "Ім'я користувача має містити від 2 до 100 символів";
    }
    return null;
};
export const toResponse = (user: any) => ({
    id: user.id,
    name: user.name
});