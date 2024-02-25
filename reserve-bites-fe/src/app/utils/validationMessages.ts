export type ValidationMessages = {
  required: string;
  email: string;
  minlength: string;
  pattern: string;
  matchPassword: string;
  min: string;
  max: string;
};

const validationMessages: ValidationMessages = {
  required: 'This field is required',
  email: 'Check the email format',
  minlength: `Pasword must at least 8 characters`,
  pattern:
    'Password must contain number, uppercase, lowercase and special character',
  matchPassword: 'New password and confirm password must match.',
  min: 'Minimum is 1',
  max: 'Maximum is 5',
};

export default validationMessages;
