import {UserProfile} from 'app/core/interfaces';
import Roles from './Roles.enum';


export default class UserProfileModel implements UserProfile {
    public id: number;
    public user?: string;
    public first_name: string;
    public last_name: string;
    public phone_number?: string;
    public photo?: string;
    public photo_bounds?: object;
    public photo_crop?: string;
    public address: string;
    public passport_photo?: string;
    public driver_license_photo?: string;
    public email?: string;
    public role: Roles;
    public user_name? :string;
    public security_question?:number;
    public password?:string;
    public zip?:number;
    public ssn?:number;
    public temp_password?:string;
    // public city?:string;
    // public state?:string;
    // public country?:string;
}
