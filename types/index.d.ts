export interface IToken{
    userId: number;
    device: string;
    accessToken: string;
    expiresAt: Date;
}

export interface ILogin{
    email: string;
    password: string;
}