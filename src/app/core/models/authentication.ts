export enum UserRole {
  SuperAdmin = 'Super Admin',
  Admin = 'Admin',
  Operator = 'Operator',
  User = 'User'
}

export enum UserRoleLabel {
  SuperAdmin = 'Super Admin',
  Admin = 'Admin',
  NormalUser = 'Normal User',
  Observe = 'Observe',
  Operator = 'Operator'
}

export interface ILogin {
  email: string;
  password: string;
}

export interface IForgotPassword {
  Email: string;
}

export interface IForgotPasswordForm {
  email: string;
  password: string;
  confirmPassword: string;
  code: string;
}

export function parseUserRoleNumber(roleNumber: number): string {
  if (roleNumber === 2) {
    return UserRoleLabel.Admin;
  } else if (roleNumber === 1) {
    return UserRoleLabel.SuperAdmin;
  } else if (roleNumber === 3) { // Operator is same as normal user for beta release
    return UserRoleLabel.Operator;
  } else if (roleNumber === 4) {
    return UserRoleLabel.NormalUser;
  } else {
    return UserRoleLabel.Observe;
  }
}
