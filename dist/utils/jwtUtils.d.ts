export interface JwtPayload {
    userId: string;
    email: string;
    role: 'user' | 'admin';
}
export declare const generateToken: (payload: JwtPayload) => string;
export declare const verifyToken: (token: string) => JwtPayload;
//# sourceMappingURL=jwtUtils.d.ts.map