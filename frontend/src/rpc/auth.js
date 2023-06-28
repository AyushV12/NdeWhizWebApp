// @flow strict
/* eslint-disable */
import { sendTwirpRequest } from "./twirp";
import type { User, UserJSON } from "./model";
import { UserToJSON, JSONToUser } from "./model";
export type AuthLoginRequest = {
  name: string;
  password: string;
}

export type AuthLoginRequestJSON = {
  name?: string;
  password?: string;
}

export function AuthLoginRequestToJSON(m: AuthLoginRequest): AuthLoginRequestJSON {
  return {
    name: m.name,
    password: m.password,
  };
}

export function JSONToAuthLoginRequest(m: AuthLoginRequestJSON): AuthLoginRequest {
  return {
    name: m.name != null ? m.name : "",
    password: m.password != null ? m.password : "",
  };
}

export type AuthMeResponse = {
  user: ?User;
  isAdmin: boolean;
}

export type AuthMeResponseJSON = {
  user?: UserJSON;
  is_admin?: boolean;
}

export function AuthMeResponseToJSON(m: AuthMeResponse): AuthMeResponseJSON {
  return {
    user: m.user != null ? UserToJSON(m.user) : undefined,
    is_admin: m.isAdmin,
  };
}

export function JSONToAuthMeResponse(m: AuthMeResponseJSON): AuthMeResponse {
  return {
    user: m.user != null ? JSONToUser(m.user) : null,
    isAdmin: m.is_admin != null ? m.is_admin : false,
  };
}

export type AuthAddAdminRequest = {
  password: string;
}

export type AuthAddAdminRequestJSON = {
  password?: string;
}

export function AuthAddAdminRequestToJSON(m: AuthAddAdminRequest): AuthAddAdminRequestJSON {
  return {
    password: m.password,
  };
}

export function JSONToAuthAddAdminRequest(m: AuthAddAdminRequestJSON): AuthAddAdminRequest {
  return {
    password: m.password != null ? m.password : "",
  };
}

export class AuthService {
  hostname: string;
  pathPrefix: string = "/rpc.AuthService/";

  constructor(hostname: string) {
    this.hostname = hostname;
  }

  async login(authLoginRequest: AuthLoginRequest): Promise<void> {
    const url = this.hostname + this.pathPrefix + "Login";
    const body: AuthLoginRequestJSON = AuthLoginRequestToJSON(authLoginRequest);
    await sendTwirpRequest(url, body);
  }

  async me(): Promise<AuthMeResponse> {
    const url = this.hostname + this.pathPrefix + "Me";
    const data = await sendTwirpRequest(url, {});
    return JSONToAuthMeResponse(data);
  }

  async logout(): Promise<void> {
    const url = this.hostname + this.pathPrefix + "Logout";
    await sendTwirpRequest(url, {});
  }

  async addAdmin(authAddAdminRequest: AuthAddAdminRequest): Promise<void> {
    const url = this.hostname + this.pathPrefix + "AddAdmin";
    const body: AuthAddAdminRequestJSON = AuthAddAdminRequestToJSON(authAddAdminRequest);
    await sendTwirpRequest(url, body);
  }
}
