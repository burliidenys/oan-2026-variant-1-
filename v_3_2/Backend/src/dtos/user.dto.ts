export interface UserCreateDto {
    name: string;
}
export const validate = (data: any): string | null => {
    if (!data.name || data.name.length < 2) return "Ім'я занадто коротке";
    return null;
};
export const toResponse = (user: any) => ({
    id: user.id,
    name: user.name
});