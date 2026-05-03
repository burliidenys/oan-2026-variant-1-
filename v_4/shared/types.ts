// Це спільні інтерфейси для всього проєкту//
export interface AccessRequest {
    id: number;
    userName: string;
    details: string;
    accessTypeId: number;
    requestDate: string;
    createdAt: string;
    typeLabel?: string;
    statusLabel?: string;
}

export interface AccessRequestDTO {
    userName: string;
    details: string;
    accessTypeId: number | string;
    requestDate: string;
    userId?: number;
    statusId?: number;
}