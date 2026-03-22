export interface UserResponse {
    _id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    createdAt: Date;
}
export interface CreateUserData {
    name: string;
    email: string;
    password: string;
    role?: string;
}
export interface UpdateUserData {
    name?: string;
    email?: string;
    password?: string;
    role?: string;
}
export declare const getUsers: () => Promise<UserResponse[]>;
export declare const getUserById: (id: string) => Promise<UserResponse | null>;
export declare const createUser: (data: CreateUserData) => Promise<UserResponse>;
export declare const updateUser: (id: string, data: UpdateUserData) => Promise<UserResponse>;
export declare const deleteUser: (id: string) => Promise<void>;
//# sourceMappingURL=userService.d.ts.map