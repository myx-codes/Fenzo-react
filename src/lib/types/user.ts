import { UserStatus, UserType } from "../enums/user.enums";

export interface User {
    _id: string;
    userId: string;
    userType: UserType;
    userStatus: UserStatus;
    userNick: string;
    userPhone: string;
    userPassword: string;
    userImage?: string;
    userPoints: number;
    userAddress?: string;
    userDesc?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

export interface UserInput {
    userNick: string;
    userPhone: string;
    userPassword: string;
    userType?: UserType;
    userImage?: string;
    userAddress?: string;
    userDesc?: string;
}

export interface LoginInput {
    userNick: string;
    userPassword: string;
}

export interface UserUpdateInput {
    userNick?: string;
    userPhone?: string;
    userPassword?: string;
    userImage?: string;
    userAddress?: string;
    userDesc?: string;
}