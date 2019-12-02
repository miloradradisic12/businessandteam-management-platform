import Answer from './Answer';

export default class Question {
  pk: number;
  title: string;
  subtitle: string;
  question_type: string;
  answer?: Answer;
  values?: string[];
  is_private?: boolean;
  options?: any;
  group: string;
  order: number;
  model?:string;
}
