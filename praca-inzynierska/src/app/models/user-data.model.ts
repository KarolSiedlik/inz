export interface IUserData {
    userInfo: {
        firstName: string;
        lastName: string;
        born: Date;
        sex: 'male' | 'female';
        height: string;
    },
    userData: {
        weight: { date: Date, value: string }[];
        [x: string]: { date: Date, value: string }[];
    }
}