import {CommonErrors} from 'app/elements/validation/form-errors';

export class LoginErrors extends CommonErrors {
  constructor(){super(name);}
  non_field_errors = 'Unable to log in with provided credentials.';
}
