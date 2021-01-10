export interface IUserData {
    info: {
        firstName: string;
        lastName: string;
        born: Date;
        sex: 'male' | 'female';
        height: string;
    },
    data: {
        weight: { date: string, value: string }[];
        [x: string]: { date: string, value: string }[];
    }
}