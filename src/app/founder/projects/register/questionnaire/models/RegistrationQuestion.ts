import RegistrationAnswer from './RegistrationAnswer';

export default class RegistrationQuestion {
  id: number;
  title: string;
  subtitle: string;
  registration_type:number;
  question_type: string;
  answer?: RegistrationAnswer;
  values?: string[];
  is_private?: boolean;
  options?: any;
  group: string;
  order: number;
  model?:string;
  option_list?:any;
}