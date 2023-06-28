// @flow strict
/* eslint-disable */
import { sendTwirpRequest } from "./twirp";

export type Empty = {
}

export type EmptyJSON = {
}

export function EmptyToJSON(m: Empty): EmptyJSON {
  return {
  };
}

export function JSONToEmpty(m: EmptyJSON): Empty {
  return {
  };
}

export type User = {
  id: string;
  name: string;
  data: string;
  createdAt: string;
}

export type UserJSON = {
  id?: string;
  name?: string;
  data?: string;
  created_at?: string;
}

export function UserToJSON(m: User): UserJSON {
  return {
    id: m.id,
    name: m.name,
    data: m.data,
    created_at: m.createdAt,
  };
}

export function JSONToUser(m: UserJSON): User {
  return {
    id: m.id != null ? m.id : "",
    name: m.name != null ? m.name : "",
    data: m.data != null ? m.data : "",
    createdAt: m.created_at != null ? m.created_at : "",
  };
}

export type Project = {
  id: string;
  data: string;
  createdAt: string;
}

export type ProjectJSON = {
  id?: string;
  data?: string;
  created_at?: string;
}

export function ProjectToJSON(m: Project): ProjectJSON {
  return {
    id: m.id,
    data: m.data,
    created_at: m.createdAt,
  };
}

export function JSONToProject(m: ProjectJSON): Project {
  return {
    id: m.id != null ? m.id : "",
    data: m.data != null ? m.data : "",
    createdAt: m.created_at != null ? m.created_at : "",
  };
}

export type Segment = {
  id: string;
  projectId: string;
  data: string;
  createdAt: string;
}

export type SegmentJSON = {
  id?: string;
  project_id?: string;
  data?: string;
  created_at?: string;
}

export function SegmentToJSON(m: Segment): SegmentJSON {
  return {
    id: m.id,
    project_id: m.projectId,
    data: m.data,
    created_at: m.createdAt,
  };
}

export function JSONToSegment(m: SegmentJSON): Segment {
  return {
    id: m.id != null ? m.id : "",
    projectId: m.project_id != null ? m.project_id : "",
    data: m.data != null ? m.data : "",
    createdAt: m.created_at != null ? m.created_at : "",
  };
}

export type Run = {
  id: string;
  projectId: string;
  data: string;
  createdAt: string;
}

export type RunJSON = {
  id?: string;
  project_id?: string;
  data?: string;
  created_at?: string;
}

export function RunToJSON(m: Run): RunJSON {
  return {
    id: m.id,
    project_id: m.projectId,
    data: m.data,
    created_at: m.createdAt,
  };
}

export function JSONToRun(m: RunJSON): Run {
  return {
    id: m.id != null ? m.id : "",
    projectId: m.project_id != null ? m.project_id : "",
    data: m.data != null ? m.data : "",
    createdAt: m.created_at != null ? m.created_at : "",
  };
}

export type File = {
  id: string;
  projectId: string;
  runId: string;
  data: string;
  contentId: string;
  createdAt: string;
}

export type FileJSON = {
  id?: string;
  project_id?: string;
  run_id?: string;
  data?: string;
  content_id?: string;
  created_at?: string;
}

export function FileToJSON(m: File): FileJSON {
  return {
    id: m.id,
    project_id: m.projectId,
    run_id: m.runId,
    data: m.data,
    content_id: m.contentId,
    created_at: m.createdAt,
  };
}

export function JSONToFile(m: FileJSON): File {
  return {
    id: m.id != null ? m.id : "",
    projectId: m.project_id != null ? m.project_id : "",
    runId: m.run_id != null ? m.run_id : "",
    data: m.data != null ? m.data : "",
    contentId: m.content_id != null ? m.content_id : "",
    createdAt: m.created_at != null ? m.created_at : "",
  };
}

export type RunResult = {
  id: string;
  projectId: string;
  runId: string;
  data: string;
  createdAt: string;
}

export type RunResultJSON = {
  id?: string;
  project_id?: string;
  run_id?: string;
  data?: string;
  created_at?: string;
}

export function RunResultToJSON(m: RunResult): RunResultJSON {
  return {
    id: m.id,
    project_id: m.projectId,
    run_id: m.runId,
    data: m.data,
    created_at: m.createdAt,
  };
}

export function JSONToRunResult(m: RunResultJSON): RunResult {
  return {
    id: m.id != null ? m.id : "",
    projectId: m.project_id != null ? m.project_id : "",
    runId: m.run_id != null ? m.run_id : "",
    data: m.data != null ? m.data : "",
    createdAt: m.created_at != null ? m.created_at : "",
  };
}

export type Login = {
  userId: string;
  userName: string;
  loginAt: string;
}

export type LoginJSON = {
  user_id?: string;
  user_name?: string;
  login_at?: string;
}

export function LoginToJSON(m: Login): LoginJSON {
  return {
    user_id: m.userId,
    user_name: m.userName,
    login_at: m.loginAt,
  };
}

export function JSONToLogin(m: LoginJSON): Login {
  return {
    userId: m.user_id != null ? m.user_id : "",
    userName: m.user_name != null ? m.user_name : "",
    loginAt: m.login_at != null ? m.login_at : "",
  };
}

