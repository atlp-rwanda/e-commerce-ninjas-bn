export interface IToken{
    userId: number;
    device: string;
    accessToken: string;
}

export interface ILogin{
    email: string;
    password: string;
}