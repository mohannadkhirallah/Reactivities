export interface IUser {
    username:string;
    displayName:string;
    token:string;
    imgae?:string;
}

export interface IUserFormValues{
    email:string;
    password:string;
    displayName?:string;
    username?:string;
}