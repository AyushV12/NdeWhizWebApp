// @flow strict
/* eslint-disable */
import { sendTwirpRequest } from "./twirp";
import type { Login, LoginJSON } from "./model";
import { LoginToJSON, JSONToLogin } from "./model";
import type { User, UserJSON } from "./model";
import { UserToJSON, JSONToUser } from "./model";
export type UserAddUserRequest = {
  name: string;
  password: string;
  data: string;
}

export type UserAddUserRequestJSON = {
  name?: string;
  password?: string;
  data?: string;
}

export function UserAddUserRequestToJSON(m: UserAddUserRequest): UserAddUserRequestJSON {
  return {
    name: m.name,
    password: m.password,
    data: m.data,
  };
}

export function JSONToUserAddUserRequest(m: UserAddUserRequestJSON): UserAddUserRequest {
  return {
    name: m.name != null ? m.name : "",
    password: m.password != null ? m.password : "",
    data: m.data != null ? m.data : "",
  };
}

export type UserUsersResponse = {
  users: Array<User>;
}

export type UserUsersResponseJSON = {
  users?: Array<UserJSON>;
}

export function UserUsersResponseToJSON(m: UserUsersResponse): UserUsersResponseJSON {
  return {
    users: m.users.map(UserToJSON),
  };
}

export function JSONToUserUsersResponse(m: UserUsersResponseJSON): UserUsersResponse {
  return {
    users: m.users != null ? m.users.map(JSONToUser) : [],
  };
}

export type UserDeleteUserRequest = {
  userId: string;
}

export type UserDeleteUserRequestJSON = {
  user_id?: string;
}

export function UserDeleteUserRequestToJSON(m: UserDeleteUserRequest): UserDeleteUserRequestJSON {
  return {
    user_id: m.userId,
  };
}

export function JSONToUserDeleteUserRequest(m: UserDeleteUserRequestJSON): UserDeleteUserRequest {
  return {
    userId: m.user_id != null ? m.user_id : "",
  };
}

export type UserSetUserPasswordRequest = {
  userId: string;
  password: string;
}

export type UserSetUserPasswordRequestJSON = {
  user_id?: string;
  password?: string;
}

export function UserSetUserPasswordRequestToJSON(m: UserSetUserPasswordRequest): UserSetUserPasswordRequestJSON {
  return {
    user_id: m.userId,
    password: m.password,
  };
}

export function JSONToUserSetUserPasswordRequest(m: UserSetUserPasswordRequestJSON): UserSetUserPasswordRequest {
  return {
    userId: m.user_id != null ? m.user_id : "",
    password: m.password != null ? m.password : "",
  };
}

export type UserChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
}

export type UserChangePasswordRequestJSON = {
  current_password?: string;
  new_password?: string;
}

export function UserChangePasswordRequestToJSON(m: UserChangePasswordRequest): UserChangePasswordRequestJSON {
  return {
    current_password: m.currentPassword,
    new_password: m.newPassword,
  };
}

export function JSONToUserChangePasswordRequest(m: UserChangePasswordRequestJSON): UserChangePasswordRequest {
  return {
    currentPassword: m.current_password != null ? m.current_password : "",
    newPassword: m.new_password != null ? m.new_password : "",
  };
}

export type UserLoginsResponse = {
  logins: Array<Login>;
}

export type UserLoginsResponseJSON = {
  logins?: Array<LoginJSON>;
}

export function UserLoginsResponseToJSON(m: UserLoginsResponse): UserLoginsResponseJSON {
  return {
    logins: m.logins.map(LoginToJSON),
  };
}

export function JSONToUserLoginsResponse(m: UserLoginsResponseJSON): UserLoginsResponse {
  return {
    logins: m.logins != null ? m.logins.map(JSONToLogin) : [],
  };
}

export type UserLoginsForUserRequest = {
  userId: string;
}

export type UserLoginsForUserRequestJSON = {
  user_id?: string;
}

export function UserLoginsForUserRequestToJSON(m: UserLoginsForUserRequest): UserLoginsForUserRequestJSON {
  return {
    user_id: m.userId,
  };
}

export function JSONToUserLoginsForUserRequest(m: UserLoginsForUserRequestJSON): UserLoginsForUserRequest {
  return {
    userId: m.user_id != null ? m.user_id : "",
  };
}

export type UserLoginsForUserResponse = {
  logins: Array<Login>;
}

export type UserLoginsForUserResponseJSON = {
  logins?: Array<LoginJSON>;
}

export function UserLoginsForUserResponseToJSON(m: UserLoginsForUserResponse): UserLoginsForUserResponseJSON {
  return {
    logins: m.logins.map(LoginToJSON),
  };
}

export function JSONToUserLoginsForUserResponse(m: UserLoginsForUserResponseJSON): UserLoginsForUserResponse {
  return {
    logins: m.logins != null ? m.logins.map(JSONToLogin) : [],
  };
}

export type UserEditUserRequest = {
  userId: string;
  delta: string;
}

export type UserEditUserRequestJSON = {
  user_id?: string;
  delta?: string;
}

export function UserEditUserRequestToJSON(m: UserEditUserRequest): UserEditUserRequestJSON {
  return {
    user_id: m.userId,
    delta: m.delta,
  };
}

export function JSONToUserEditUserRequest(m: UserEditUserRequestJSON): UserEditUserRequest {
  return {
    userId: m.user_id != null ? m.user_id : "",
    delta: m.delta != null ? m.delta : "",
  };
}

export class UserService {
  hostname: string;
  pathPrefix: string = "/rpc.UserService/";

  constructor(hostname: string) {
    this.hostname = hostname;
  }

  async addUser(userAddUserRequest: UserAddUserRequest): Promise<void> {
    const url = this.hostname + this.pathPrefix + "AddUser";
    const body: UserAddUserRequestJSON = UserAddUserRequestToJSON(userAddUserRequest);
    await sendTwirpRequest(url, body);
  }

  async users(): Promise<UserUsersResponse> {
    const url = this.hostname + this.pathPrefix + "Users";
    const data = await sendTwirpRequest(url, {});
    return JSONToUserUsersResponse(data);
  }

  async deleteUser(userDeleteUserRequest: UserDeleteUserRequest): Promise<void> {
    const url = this.hostname + this.pathPrefix + "DeleteUser";
    console.log("hereAtDeleteUserCall",url,body)
    const body: UserDeleteUserRequestJSON = UserDeleteUserRequestToJSON(userDeleteUserRequest);
    await sendTwirpRequest(url, body);
  }

  async setUserPassword(userSetUserPasswordRequest: UserSetUserPasswordRequest): Promise<void> {
    const url = this.hostname + this.pathPrefix + "SetUserPassword";
    const body: UserSetUserPasswordRequestJSON = UserSetUserPasswordRequestToJSON(userSetUserPasswordRequest);
    await sendTwirpRequest(url, body);
  }

  async changePassword(userChangePasswordRequest: UserChangePasswordRequest): Promise<void> {
    const url = this.hostname + this.pathPrefix + "ChangePassword";
    const body: UserChangePasswordRequestJSON = UserChangePasswordRequestToJSON(userChangePasswordRequest);
    await sendTwirpRequest(url, body);
  }

  async logins(): Promise<UserLoginsResponse> {
    const url = this.hostname + this.pathPrefix + "Logins";
    const data = await sendTwirpRequest(url, {});
    return JSONToUserLoginsResponse(data);
  }

  async loginsForUser(userLoginsForUserRequest: UserLoginsForUserRequest): Promise<UserLoginsForUserResponse> {
    const url = this.hostname + this.pathPrefix + "LoginsForUser";
    const body: UserLoginsForUserRequestJSON = UserLoginsForUserRequestToJSON(userLoginsForUserRequest);
    const data = await sendTwirpRequest(url, body);
    return JSONToUserLoginsForUserResponse(data);
  }

  async editUser(userEditUserRequest: UserEditUserRequest): Promise<void> {
    const url = this.hostname + this.pathPrefix + "EditUser";
    const body: UserEditUserRequestJSON = UserEditUserRequestToJSON(userEditUserRequest);
    await sendTwirpRequest(url, body);
  }
}
