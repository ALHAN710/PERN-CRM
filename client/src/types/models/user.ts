export type TUser = {
  firstName?: string;
  lastName: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  roles?: string[];
}
