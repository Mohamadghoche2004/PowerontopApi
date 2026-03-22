export interface RegisterData {
    name: string;
    email: string;
    password: string;
}
export interface LoginData {
    email: string;
    password: string;
}
export interface AuthResponse {
    user: {
        _id: string;
        name: string;
        email: string;
        role: 'user' | 'admin';
    };
    token: string;
}
export declare const registerUser: (data: RegisterData) => Promise<AuthResponse>;
export declare const loginUser: (data: LoginData) => Promise<AuthResponse>;
//# sourceMappingURL=authService.d.ts.map