export interface IUserData {
    userInfo: {
        firstName: string;
        lastName: string;
        born: Date;
        sex: 'male' | 'female';
        height: string;
    },
    userData: {
        weight: string;
        [x: string]: any;
    }
}