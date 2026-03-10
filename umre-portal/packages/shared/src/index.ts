export * from 'zod';

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}
