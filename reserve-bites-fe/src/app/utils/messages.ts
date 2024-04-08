export const notificationMessage = {
  MAKE_RESERVATION: 'Made a reservation',
  UPDATE_RESERVATION: 'Updated their reservation',
  CANCEL_RESERVATION: 'Canceled their reservation',
  REJECT_RESERVATION: 'Rejected your reservation',
  CONFIRM_RESERVATION: 'Comfirmed your reservation',

  POST_REVIEW: 'Posted a review of your restaurant',
  DELETE_REVIEW: 'Deleted their review of your restaurant',
  UPDATE_REVIEW: 'Updated their review of your restaurant',
};

export const notificationIcon = {
  MAKE_RESERVATION: 'heroTicket',
  UPDATE_RESERVATION: 'heroPencilSquare',
  CANCEL_RESERVATION: 'matCancelOutline',
  REJECT_RESERVATION: 'heroFaceFrown',
  CONFIRM_RESERVATION: 'heroFaceSmile',
  POST_REVIEW: 'heroChatBubbleBottomCenterText',
  DELETE_REVIEW: 'heroTrash',
  UPDATE_REVIEW: 'heroPencilSquare',
};

export type ValidationMessages = {
  required: string;
  email: string;
  minlength: string;
  pattern: string;
  matchPassword: string;
  min: string;
  max: string;
};

export const validationMessages: ValidationMessages = {
  required: 'This field is required',
  email: 'Check the email format',
  minlength: `Pasword must at least 8 characters`,
  pattern: 'Password must contain number, uppercase, lowercase and special character',
  matchPassword: 'New password and confirm password must match.',
  min: 'Minimum is 1',
  max: 'Maximum is 5',
};
