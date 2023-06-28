// @flow strict
/* eslint-disable */
import { sendTwirpRequest } from "./twirp";
import type { File, FileJSON } from "./model";
import { FileToJSON, JSONToFile } from "./model";
import type { Project, ProjectJSON } from "./model";
import { ProjectToJSON, JSONToProject } from "./model";
import type { Run, RunJSON } from "./model";
import { RunToJSON, JSONToRun } from "./model";
import type { RunResult, RunResultJSON } from "./model";
import { RunResultToJSON, JSONToRunResult } from "./model";
import type { Segment, SegmentJSON } from "./model";
import { SegmentToJSON, JSONToSegment } from "./model";
export type ProjectAddProjectRequest = {
  remote: boolean;
  data: string;
}

export type ProjectAddProjectRequestJSON = {
  remote?: boolean;
  data?: string;
}

export function ProjectAddProjectRequestToJSON(m: ProjectAddProjectRequest): ProjectAddProjectRequestJSON {
  return {
    remote: m.remote,
    data: m.data,
  };
}

export function JSONToProjectAddProjectRequest(m: ProjectAddProjectRequestJSON): ProjectAddProjectRequest {
  return {
    remote: m.remote != null ? m.remote : false,
    data: m.data != null ? m.data : "",
  };
}

export type ProjectAddProjectResponse = {
  projectId: string;
}

export type ProjectAddProjectResponseJSON = {
  project_id?: string;
}

export function ProjectAddProjectResponseToJSON(m: ProjectAddProjectResponse): ProjectAddProjectResponseJSON {
  return {
    project_id: m.projectId,
  };
}

export function JSONToProjectAddProjectResponse(m: ProjectAddProjectResponseJSON): ProjectAddProjectResponse {
  return {
    projectId: m.project_id != null ? m.project_id : "",
  };
}

export type ProjectProjectsRequest = {
  remote: boolean;
}

export type ProjectProjectsRequestJSON = {
  remote?: boolean;
}

export function ProjectProjectsRequestToJSON(m: ProjectProjectsRequest): ProjectProjectsRequestJSON {
  return {
    remote: m.remote,
  };
}

export function JSONToProjectProjectsRequest(m: ProjectProjectsRequestJSON): ProjectProjectsRequest {
  return {
    remote: m.remote != null ? m.remote : false,
  };
}

export type ProjectProjectsResponse = {
  projects: Array<Project>;
}

export type ProjectProjectsResponseJSON = {
  projects?: Array<ProjectJSON>;
}

export function ProjectProjectsResponseToJSON(m: ProjectProjectsResponse): ProjectProjectsResponseJSON {
  return {
    projects: m.projects.map(ProjectToJSON),
  };
}

export function JSONToProjectProjectsResponse(m: ProjectProjectsResponseJSON): ProjectProjectsResponse {
  return {
    projects: m.projects != null ? m.projects.map(JSONToProject) : [],
  };
}

export type ProjectProjectRequest = {
  remote: boolean;
  projectId: string;
}

export type ProjectProjectRequestJSON = {
  remote?: boolean;
  project_id?: string;
}

export function ProjectProjectRequestToJSON(m: ProjectProjectRequest): ProjectProjectRequestJSON {
  return {
    remote: m.remote,
    project_id: m.projectId,
  };
}

export function JSONToProjectProjectRequest(m: ProjectProjectRequestJSON): ProjectProjectRequest {
  return {
    remote: m.remote != null ? m.remote : false,
    projectId: m.project_id != null ? m.project_id : "",
  };
}

export type ProjectProjectResponse = {
  project: ?Project;
}

export type ProjectProjectResponseJSON = {
  project?: ProjectJSON;
}

export function ProjectProjectResponseToJSON(m: ProjectProjectResponse): ProjectProjectResponseJSON {
  return {
    project: m.project != null ? ProjectToJSON(m.project) : undefined,
  };
}

export function JSONToProjectProjectResponse(m: ProjectProjectResponseJSON): ProjectProjectResponse {
  return {
    project: m.project != null ? JSONToProject(m.project) : null,
  };
}

export type ProjectEditProjectRequest = {
  remote: boolean;
  projectId: string;
  delta: string;
}

export type ProjectEditProjectRequestJSON = {
  remote?: boolean;
  project_id?: string;
  delta?: string;
}

export function ProjectEditProjectRequestToJSON(m: ProjectEditProjectRequest): ProjectEditProjectRequestJSON {
  return {
    remote: m.remote,
    project_id: m.projectId,
    delta: m.delta,
  };
}

export function JSONToProjectEditProjectRequest(m: ProjectEditProjectRequestJSON): ProjectEditProjectRequest {
  return {
    remote: m.remote != null ? m.remote : false,
    projectId: m.project_id != null ? m.project_id : "",
    delta: m.delta != null ? m.delta : "",
  };
}

export type ProjectAddProjectFileRequest = {
  remote: boolean;
  projectId: string;
  blobId: string;
  fileType: string;
  parseProcess: string;
}

export type ProjectAddProjectFileRequestJSON = {
  remote?: boolean;
  project_id?: string;
  blob_id?: string;
  file_type?: string;
  parse_process?: string;
}

export function ProjectAddProjectFileRequestToJSON(m: ProjectAddProjectFileRequest): ProjectAddProjectFileRequestJSON {
  return {
    remote: m.remote,
    project_id: m.projectId,
    blob_id: m.blobId,
    file_type: m.fileType,
    parse_process: m.parseProcess,
  };
}

export function JSONToProjectAddProjectFileRequest(m: ProjectAddProjectFileRequestJSON): ProjectAddProjectFileRequest {
  return {
    remote: m.remote != null ? m.remote : false,
    projectId: m.project_id != null ? m.project_id : "",
    blobId: m.blob_id != null ? m.blob_id : "",
    fileType: m.file_type != null ? m.file_type : "",
    parseProcess: m.parse_process != null ? m.parse_process : "",
  };
}

export type ProjectAddProjectFileResponse = {
  fileId: string;
}

export type ProjectAddProjectFileResponseJSON = {
  file_id?: string;
}

export function ProjectAddProjectFileResponseToJSON(m: ProjectAddProjectFileResponse): ProjectAddProjectFileResponseJSON {
  return {
    file_id: m.fileId,
  };
}

export function JSONToProjectAddProjectFileResponse(m: ProjectAddProjectFileResponseJSON): ProjectAddProjectFileResponse {
  return {
    fileId: m.file_id != null ? m.file_id : "",
  };
}

export type ProjectDeleteProjectRequest = {
  remote: boolean;
  projectId: string;
}

export type ProjectDeleteProjectRequestJSON = {
  remote?: boolean;
  project_id?: string;
}

export function ProjectDeleteProjectRequestToJSON(m: ProjectDeleteProjectRequest): ProjectDeleteProjectRequestJSON {
  return {
    remote: m.remote,
    project_id: m.projectId,
  };
}

export function JSONToProjectDeleteProjectRequest(m: ProjectDeleteProjectRequestJSON): ProjectDeleteProjectRequest {
  return {
    remote: m.remote != null ? m.remote : false,
    projectId: m.project_id != null ? m.project_id : "",
  };
}

export type ProjectProjectFilesRequest = {
  remote: boolean;
  projectId: string;
}

export type ProjectProjectFilesRequestJSON = {
  remote?: boolean;
  project_id?: string;
}

export function ProjectProjectFilesRequestToJSON(m: ProjectProjectFilesRequest): ProjectProjectFilesRequestJSON {
  return {
    remote: m.remote,
    project_id: m.projectId,
  };
}

export function JSONToProjectProjectFilesRequest(m: ProjectProjectFilesRequestJSON): ProjectProjectFilesRequest {
  return {
    remote: m.remote != null ? m.remote : false,
    projectId: m.project_id != null ? m.project_id : "",
  };
}

export type ProjectProjectFilesResponse = {
  files: Array<File>;
}

export type ProjectProjectFilesResponseJSON = {
  files?: Array<FileJSON>;
}

export function ProjectProjectFilesResponseToJSON(m: ProjectProjectFilesResponse): ProjectProjectFilesResponseJSON {
  return {
    files: m.files.map(FileToJSON),
  };
}

export function JSONToProjectProjectFilesResponse(m: ProjectProjectFilesResponseJSON): ProjectProjectFilesResponse {
  return {
    files: m.files != null ? m.files.map(JSONToFile) : [],
  };
}

export type ProjectAddSegmentRequest = {
  remote: boolean;
  projectId: string;
  data: string;
}

export type ProjectAddSegmentRequestJSON = {
  remote?: boolean;
  project_id?: string;
  data?: string;
}

export function ProjectAddSegmentRequestToJSON(m: ProjectAddSegmentRequest): ProjectAddSegmentRequestJSON {
  return {
    remote: m.remote,
    project_id: m.projectId,
    data: m.data,
  };
}

export function JSONToProjectAddSegmentRequest(m: ProjectAddSegmentRequestJSON): ProjectAddSegmentRequest {
  return {
    remote: m.remote != null ? m.remote : false,
    projectId: m.project_id != null ? m.project_id : "",
    data: m.data != null ? m.data : "",
  };
}

export type ProjectAddSegmentResponse = {
  segmentId: string;
}

export type ProjectAddSegmentResponseJSON = {
  segment_id?: string;
}

export function ProjectAddSegmentResponseToJSON(m: ProjectAddSegmentResponse): ProjectAddSegmentResponseJSON {
  return {
    segment_id: m.segmentId,
  };
}

export function JSONToProjectAddSegmentResponse(m: ProjectAddSegmentResponseJSON): ProjectAddSegmentResponse {
  return {
    segmentId: m.segment_id != null ? m.segment_id : "",
  };
}

export type ProjectSegmentsRequest = {
  remote: boolean;
  projectId: string;
}

export type ProjectSegmentsRequestJSON = {
  remote?: boolean;
  project_id?: string;
}

export function ProjectSegmentsRequestToJSON(m: ProjectSegmentsRequest): ProjectSegmentsRequestJSON {
  return {
    remote: m.remote,
    project_id: m.projectId,
  };
}

export function JSONToProjectSegmentsRequest(m: ProjectSegmentsRequestJSON): ProjectSegmentsRequest {
  return {
    remote: m.remote != null ? m.remote : false,
    projectId: m.project_id != null ? m.project_id : "",
  };
}

export type ProjectSegmentsResponse = {
  segments: Array<Segment>;
}

export type ProjectSegmentsResponseJSON = {
  segments?: Array<SegmentJSON>;
}

export function ProjectSegmentsResponseToJSON(m: ProjectSegmentsResponse): ProjectSegmentsResponseJSON {
  return {
    segments: m.segments.map(SegmentToJSON),
  };
}

export function JSONToProjectSegmentsResponse(m: ProjectSegmentsResponseJSON): ProjectSegmentsResponse {
  return {
    segments: m.segments != null ? m.segments.map(JSONToSegment) : [],
  };
}

export type ProjectEditSegmentRequest = {
  remote: boolean;
  projectId: string;
  segmentId: string;
  delta: string;
}

export type ProjectEditSegmentRequestJSON = {
  remote?: boolean;
  project_id?: string;
  segment_id?: string;
  delta?: string;
}

export function ProjectEditSegmentRequestToJSON(m: ProjectEditSegmentRequest): ProjectEditSegmentRequestJSON {
  return {
    remote: m.remote,
    project_id: m.projectId,
    segment_id: m.segmentId,
    delta: m.delta,
  };
}

export function JSONToProjectEditSegmentRequest(m: ProjectEditSegmentRequestJSON): ProjectEditSegmentRequest {
  return {
    remote: m.remote != null ? m.remote : false,
    projectId: m.project_id != null ? m.project_id : "",
    segmentId: m.segment_id != null ? m.segment_id : "",
    delta: m.delta != null ? m.delta : "",
  };
}

export type ProjectDeleteSegmentRequest = {
  remote: boolean;
  projectId: string;
  segmentId: string;
}

export type ProjectDeleteSegmentRequestJSON = {
  remote?: boolean;
  project_id?: string;
  segment_id?: string;
}

export function ProjectDeleteSegmentRequestToJSON(m: ProjectDeleteSegmentRequest): ProjectDeleteSegmentRequestJSON {
  return {
    remote: m.remote,
    project_id: m.projectId,
    segment_id: m.segmentId,
  };
}

export function JSONToProjectDeleteSegmentRequest(m: ProjectDeleteSegmentRequestJSON): ProjectDeleteSegmentRequest {
  return {
    remote: m.remote != null ? m.remote : false,
    projectId: m.project_id != null ? m.project_id : "",
    segmentId: m.segment_id != null ? m.segment_id : "",
  };
}

export type ProjectRunsRequest = {
  remote: boolean;
  projectId: string;
}

export type ProjectRunsRequestJSON = {
  remote?: boolean;
  project_id?: string;
}

export function ProjectRunsRequestToJSON(m: ProjectRunsRequest): ProjectRunsRequestJSON {
  return {
    remote: m.remote,
    project_id: m.projectId,
  };
}

export function JSONToProjectRunsRequest(m: ProjectRunsRequestJSON): ProjectRunsRequest {
  return {
    remote: m.remote != null ? m.remote : false,
    projectId: m.project_id != null ? m.project_id : "",
  };
}

export type ProjectRunsResponse = {
  runs: Array<Run>;
  files: Array<File>;
}

export type ProjectRunsResponseJSON = {
  runs?: Array<RunJSON>;
  files?: Array<FileJSON>;
}

export function ProjectRunsResponseToJSON(m: ProjectRunsResponse): ProjectRunsResponseJSON {
  return {
    runs: m.runs.map(RunToJSON),
    files: m.files.map(FileToJSON),
  };
}

export function JSONToProjectRunsResponse(m: ProjectRunsResponseJSON): ProjectRunsResponse {
  return {
    runs: m.runs != null ? m.runs.map(JSONToRun) : [],
    files: m.files != null ? m.files.map(JSONToFile) : [],
  };
}

export type ProjectAddRunRequest = {
  remote: boolean;
  projectId: string;
  data: string;
}

export type ProjectAddRunRequestJSON = {
  remote?: boolean;
  project_id?: string;
  data?: string;
}

export function ProjectAddRunRequestToJSON(m: ProjectAddRunRequest): ProjectAddRunRequestJSON {
  return {
    remote: m.remote,
    project_id: m.projectId,
    data: m.data,
  };
}

export function JSONToProjectAddRunRequest(m: ProjectAddRunRequestJSON): ProjectAddRunRequest {
  return {
    remote: m.remote != null ? m.remote : false,
    projectId: m.project_id != null ? m.project_id : "",
    data: m.data != null ? m.data : "",
  };
}

export type ProjectAddRunResponse = {
  runId: string;
}

export type ProjectAddRunResponseJSON = {
  run_id?: string;
}

export function ProjectAddRunResponseToJSON(m: ProjectAddRunResponse): ProjectAddRunResponseJSON {
  return {
    run_id: m.runId,
  };
}

export function JSONToProjectAddRunResponse(m: ProjectAddRunResponseJSON): ProjectAddRunResponse {
  return {
    runId: m.run_id != null ? m.run_id : "",
  };
}

export type ProjectAddRunFileRequest = {
  remote: boolean;
  runId: string;
  blobId: string;
  fileType: string;
  parseProcess: string;
}

export type ProjectAddRunFileRequestJSON = {
  remote?: boolean;
  run_id?: string;
  blob_id?: string;
  file_type?: string;
  parse_process?: string;
}

export function ProjectAddRunFileRequestToJSON(m: ProjectAddRunFileRequest): ProjectAddRunFileRequestJSON {
  return {
    remote: m.remote,
    run_id: m.runId,
    blob_id: m.blobId,
    file_type: m.fileType,
    parse_process: m.parseProcess,
  };
}

export function JSONToProjectAddRunFileRequest(m: ProjectAddRunFileRequestJSON): ProjectAddRunFileRequest {
  return {
    remote: m.remote != null ? m.remote : false,
    runId: m.run_id != null ? m.run_id : "",
    blobId: m.blob_id != null ? m.blob_id : "",
    fileType: m.file_type != null ? m.file_type : "",
    parseProcess: m.parse_process != null ? m.parse_process : "",
  };
}

export type ProjectAddRunFileResponse = {
  fileId: string;
}

export type ProjectAddRunFileResponseJSON = {
  file_id?: string;
}

export function ProjectAddRunFileResponseToJSON(m: ProjectAddRunFileResponse): ProjectAddRunFileResponseJSON {
  return {
    file_id: m.fileId,
  };
}

export function JSONToProjectAddRunFileResponse(m: ProjectAddRunFileResponseJSON): ProjectAddRunFileResponse {
  return {
    fileId: m.file_id != null ? m.file_id : "",
  };
}

export type ProjectEditRunRequest = {
  remote: boolean;
  runId: string;
  delta: string;
}

export type ProjectEditRunRequestJSON = {
  remote?: boolean;
  run_id?: string;
  delta?: string;
}

export function ProjectEditRunRequestToJSON(m: ProjectEditRunRequest): ProjectEditRunRequestJSON {
  return {
    remote: m.remote,
    run_id: m.runId,
    delta: m.delta,
  };
}

export function JSONToProjectEditRunRequest(m: ProjectEditRunRequestJSON): ProjectEditRunRequest {
  return {
    remote: m.remote != null ? m.remote : false,
    runId: m.run_id != null ? m.run_id : "",
    delta: m.delta != null ? m.delta : "",
  };
}

export type ProjectDeleteRunRequest = {
  remote: boolean;
  runId: string;
}

export type ProjectDeleteRunRequestJSON = {
  remote?: boolean;
  run_id?: string;
}

export function ProjectDeleteRunRequestToJSON(m: ProjectDeleteRunRequest): ProjectDeleteRunRequestJSON {
  return {
    remote: m.remote,
    run_id: m.runId,
  };
}

export function JSONToProjectDeleteRunRequest(m: ProjectDeleteRunRequestJSON): ProjectDeleteRunRequest {
  return {
    remote: m.remote != null ? m.remote : false,
    runId: m.run_id != null ? m.run_id : "",
  };
}

export type ProjectRunFilesRequest = {
  remote: boolean;
  runId: string;
}

export type ProjectRunFilesRequestJSON = {
  remote?: boolean;
  run_id?: string;
}

export function ProjectRunFilesRequestToJSON(m: ProjectRunFilesRequest): ProjectRunFilesRequestJSON {
  return {
    remote: m.remote,
    run_id: m.runId,
  };
}

export function JSONToProjectRunFilesRequest(m: ProjectRunFilesRequestJSON): ProjectRunFilesRequest {
  return {
    remote: m.remote != null ? m.remote : false,
    runId: m.run_id != null ? m.run_id : "",
  };
}

export type ProjectRunFilesResponse = {
  files: Array<File>;
}

export type ProjectRunFilesResponseJSON = {
  files?: Array<FileJSON>;
}

export function ProjectRunFilesResponseToJSON(m: ProjectRunFilesResponse): ProjectRunFilesResponseJSON {
  return {
    files: m.files.map(FileToJSON),
  };
}

export function JSONToProjectRunFilesResponse(m: ProjectRunFilesResponseJSON): ProjectRunFilesResponse {
  return {
    files: m.files != null ? m.files.map(JSONToFile) : [],
  };
}

export type ProjectDeleteFileRequest = {
  remote: boolean;
  fileId: string;
}

export type ProjectDeleteFileRequestJSON = {
  remote?: boolean;
  file_id?: string;
}

export function ProjectDeleteFileRequestToJSON(m: ProjectDeleteFileRequest): ProjectDeleteFileRequestJSON {
  return {
    remote: m.remote,
    file_id: m.fileId,
  };
}

export function JSONToProjectDeleteFileRequest(m: ProjectDeleteFileRequestJSON): ProjectDeleteFileRequest {
  return {
    remote: m.remote != null ? m.remote : false,
    fileId: m.file_id != null ? m.file_id : "",
  };
}

export type ProjectParsedFileContentRequest = {
  remote: boolean;
  fileId: string;
  allValues: boolean;
  startIndex: number;
  endIndex: number;
  offset: number;
}

export type ProjectParsedFileContentRequestJSON = {
  remote?: boolean;
  file_id?: string;
  all_values?: boolean;
  start_index?: number;
  end_index?: number;
  offset?: number;
}

export function ProjectParsedFileContentRequestToJSON(m: ProjectParsedFileContentRequest): ProjectParsedFileContentRequestJSON {
  return {
    remote: m.remote,
    file_id: m.fileId,
    all_values: m.allValues,
    start_index: m.startIndex,
    end_index: m.endIndex,
    offset: m.offset,
  };
}

export function JSONToProjectParsedFileContentRequest(m: ProjectParsedFileContentRequestJSON): ProjectParsedFileContentRequest {
  return {
    remote: m.remote != null ? m.remote : false,
    fileId: m.file_id != null ? m.file_id : "",
    allValues: m.all_values != null ? m.all_values : false,
    startIndex: m.start_index != null ? m.start_index : 0,
    endIndex: m.end_index != null ? m.end_index : 0,
    offset: m.offset != null ? m.offset : 0,
  };
}

export type ProjectParsedFileContentResponse = {
  rows: Array<string>;
  totalCount: number;
}

export type ProjectParsedFileContentResponseJSON = {
  rows?: Array<string>;
  total_count?: number;
}

export function ProjectParsedFileContentResponseToJSON(m: ProjectParsedFileContentResponse): ProjectParsedFileContentResponseJSON {
  return {
    rows: m.rows,
    total_count: m.totalCount,
  };
}

export function JSONToProjectParsedFileContentResponse(m: ProjectParsedFileContentResponseJSON): ProjectParsedFileContentResponse {
  return {
    rows: m.rows != null ? m.rows : [],
    totalCount: m.total_count != null ? m.total_count : 0,
  };
}

export type ProjectRunResultsRequest = {
  remote: boolean;
  runId: string;
}

export type ProjectRunResultsRequestJSON = {
  remote?: boolean;
  run_id?: string;
}

export function ProjectRunResultsRequestToJSON(m: ProjectRunResultsRequest): ProjectRunResultsRequestJSON {
  return {
    remote: m.remote,
    run_id: m.runId,
  };
}

export function JSONToProjectRunResultsRequest(m: ProjectRunResultsRequestJSON): ProjectRunResultsRequest {
  return {
    remote: m.remote != null ? m.remote : false,
    runId: m.run_id != null ? m.run_id : "",
  };
}

export type ProjectRunResultsResponse = {
  results: Array<RunResult>;
}

export type ProjectRunResultsResponseJSON = {
  results?: Array<RunResultJSON>;
}

export function ProjectRunResultsResponseToJSON(m: ProjectRunResultsResponse): ProjectRunResultsResponseJSON {
  return {
    results: m.results.map(RunResultToJSON),
  };
}

export function JSONToProjectRunResultsResponse(m: ProjectRunResultsResponseJSON): ProjectRunResultsResponse {
  return {
    results: m.results != null ? m.results.map(JSONToRunResult) : [],
  };
}

export type ProjectAddResultRequest = {
  remote: boolean;
  runId: string;
  data: string;
}

export type ProjectAddResultRequestJSON = {
  remote?: boolean;
  run_id?: string;
  data?: string;
}

export function ProjectAddResultRequestToJSON(m: ProjectAddResultRequest): ProjectAddResultRequestJSON {
  return {
    remote: m.remote,
    run_id: m.runId,
    data: m.data,
  };
}

export function JSONToProjectAddResultRequest(m: ProjectAddResultRequestJSON): ProjectAddResultRequest {
  return {
    remote: m.remote != null ? m.remote : false,
    runId: m.run_id != null ? m.run_id : "",
    data: m.data != null ? m.data : "",
  };
}

export type ProjectAddResultResponse = {
  remote: boolean;
  resultId: string;
}

export type ProjectAddResultResponseJSON = {
  remote?: boolean;
  result_id?: string;
}

export function ProjectAddResultResponseToJSON(m: ProjectAddResultResponse): ProjectAddResultResponseJSON {
  return {
    remote: m.remote,
    result_id: m.resultId,
  };
}

export function JSONToProjectAddResultResponse(m: ProjectAddResultResponseJSON): ProjectAddResultResponse {
  return {
    remote: m.remote != null ? m.remote : false,
    resultId: m.result_id != null ? m.result_id : "",
  };
}

export type ProjectEditResultRequest = {
  remote: boolean;
  runId: string;
  resultId: string;
  delta: string;
}

export type ProjectEditResultRequestJSON = {
  remote?: boolean;
  run_id?: string;
  result_id?: string;
  delta?: string;
}

export function ProjectEditResultRequestToJSON(m: ProjectEditResultRequest): ProjectEditResultRequestJSON {
  return {
    remote: m.remote,
    run_id: m.runId,
    result_id: m.resultId,
    delta: m.delta,
  };
}

export function JSONToProjectEditResultRequest(m: ProjectEditResultRequestJSON): ProjectEditResultRequest {
  return {
    remote: m.remote != null ? m.remote : false,
    runId: m.run_id != null ? m.run_id : "",
    resultId: m.result_id != null ? m.result_id : "",
    delta: m.delta != null ? m.delta : "",
  };
}

export type ProjectDeleteResultRequest = {
  remote: boolean;
  runId: string;
  resultId: string;
}

export type ProjectDeleteResultRequestJSON = {
  remote?: boolean;
  run_id?: string;
  result_id?: string;
}

export function ProjectDeleteResultRequestToJSON(m: ProjectDeleteResultRequest): ProjectDeleteResultRequestJSON {
  return {
    remote: m.remote,
    run_id: m.runId,
    result_id: m.resultId,
  };
}

export function JSONToProjectDeleteResultRequest(m: ProjectDeleteResultRequestJSON): ProjectDeleteResultRequest {
  return {
    remote: m.remote != null ? m.remote : false,
    runId: m.run_id != null ? m.run_id : "",
    resultId: m.result_id != null ? m.result_id : "",
  };
}

export class ProjectService {
  hostname: string;
  pathPrefix: string = "/rpc.ProjectService/";

  constructor(hostname: string) {
    this.hostname = hostname;
  }

  async addProject(projectAddProjectRequest: ProjectAddProjectRequest): Promise<ProjectAddProjectResponse> {
    const url = this.hostname + this.pathPrefix + "AddProject";
    const body: ProjectAddProjectRequestJSON = ProjectAddProjectRequestToJSON(projectAddProjectRequest);
    const data = await sendTwirpRequest(url, body);
    return JSONToProjectAddProjectResponse(data);
  }

  async projects(projectProjectsRequest: ProjectProjectsRequest): Promise<ProjectProjectsResponse> {
    const url = this.hostname + this.pathPrefix + "Projects";
    const body: ProjectProjectsRequestJSON = ProjectProjectsRequestToJSON(projectProjectsRequest);
    const data = await sendTwirpRequest(url, body);
    return JSONToProjectProjectsResponse(data);
  }

  async project(projectProjectRequest: ProjectProjectRequest): Promise<ProjectProjectResponse> {
    const url = this.hostname + this.pathPrefix + "Project";
    const body: ProjectProjectRequestJSON = ProjectProjectRequestToJSON(projectProjectRequest);
    const data = await sendTwirpRequest(url, body);
    return JSONToProjectProjectResponse(data);
  }

  async editProject(projectEditProjectRequest: ProjectEditProjectRequest): Promise<void> {
    const url = this.hostname + this.pathPrefix + "EditProject";
    const body: ProjectEditProjectRequestJSON = ProjectEditProjectRequestToJSON(projectEditProjectRequest);
    await sendTwirpRequest(url, body);
  }

  async addProjectFile(projectAddProjectFileRequest: ProjectAddProjectFileRequest): Promise<ProjectAddProjectFileResponse> {
    const url = this.hostname + this.pathPrefix + "AddProjectFile";
    const body: ProjectAddProjectFileRequestJSON = ProjectAddProjectFileRequestToJSON(projectAddProjectFileRequest);
    const data = await sendTwirpRequest(url, body);
    return JSONToProjectAddProjectFileResponse(data);
  }

  async deleteProject(projectDeleteProjectRequest: ProjectDeleteProjectRequest): Promise<void> {
    const url = this.hostname + this.pathPrefix + "DeleteProject";
    const body: ProjectDeleteProjectRequestJSON = ProjectDeleteProjectRequestToJSON(projectDeleteProjectRequest);
    await sendTwirpRequest(url, body);
  }

  async projectFiles(projectProjectFilesRequest: ProjectProjectFilesRequest): Promise<ProjectProjectFilesResponse> {
    const url = this.hostname + this.pathPrefix + "ProjectFiles";
    const body: ProjectProjectFilesRequestJSON = ProjectProjectFilesRequestToJSON(projectProjectFilesRequest);
    const data = await sendTwirpRequest(url, body);
    return JSONToProjectProjectFilesResponse(data);
  }

  async addSegment(projectAddSegmentRequest: ProjectAddSegmentRequest): Promise<ProjectAddSegmentResponse> {
    const url = this.hostname + this.pathPrefix + "AddSegment";
    const body: ProjectAddSegmentRequestJSON = ProjectAddSegmentRequestToJSON(projectAddSegmentRequest);
    const data = await sendTwirpRequest(url, body);
    return JSONToProjectAddSegmentResponse(data);
  }

  async segments(projectSegmentsRequest: ProjectSegmentsRequest): Promise<ProjectSegmentsResponse> {
    const url = this.hostname + this.pathPrefix + "Segments";
    const body: ProjectSegmentsRequestJSON = ProjectSegmentsRequestToJSON(projectSegmentsRequest);
    const data = await sendTwirpRequest(url, body);
    return JSONToProjectSegmentsResponse(data);
  }

  async editSegment(projectEditSegmentRequest: ProjectEditSegmentRequest): Promise<void> {
    const url = this.hostname + this.pathPrefix + "EditSegment";
    const body: ProjectEditSegmentRequestJSON = ProjectEditSegmentRequestToJSON(projectEditSegmentRequest);
    await sendTwirpRequest(url, body);
  }

  async deleteSegment(projectDeleteSegmentRequest: ProjectDeleteSegmentRequest): Promise<void> {
    const url = this.hostname + this.pathPrefix + "DeleteSegment";
    const body: ProjectDeleteSegmentRequestJSON = ProjectDeleteSegmentRequestToJSON(projectDeleteSegmentRequest);
    await sendTwirpRequest(url, body);
  }

  async runs(projectRunsRequest: ProjectRunsRequest): Promise<ProjectRunsResponse> {
    const url = this.hostname + this.pathPrefix + "Runs";
    const body: ProjectRunsRequestJSON = ProjectRunsRequestToJSON(projectRunsRequest);
    const data = await sendTwirpRequest(url, body);
    return JSONToProjectRunsResponse(data);
  }

  async addRun(projectAddRunRequest: ProjectAddRunRequest): Promise<ProjectAddRunResponse> {
    const url = this.hostname + this.pathPrefix + "AddRun";
    const body: ProjectAddRunRequestJSON = ProjectAddRunRequestToJSON(projectAddRunRequest);
    const data = await sendTwirpRequest(url, body);
    return JSONToProjectAddRunResponse(data);
  }

  async addRunFile(projectAddRunFileRequest: ProjectAddRunFileRequest): Promise<ProjectAddRunFileResponse> {
    const url = this.hostname + this.pathPrefix + "AddRunFile";
    const body: ProjectAddRunFileRequestJSON = ProjectAddRunFileRequestToJSON(projectAddRunFileRequest);
    const data = await sendTwirpRequest(url, body);
    return JSONToProjectAddRunFileResponse(data);
  }

  async editRun(projectEditRunRequest: ProjectEditRunRequest): Promise<void> {
    const url = this.hostname + this.pathPrefix + "EditRun";
    const body: ProjectEditRunRequestJSON = ProjectEditRunRequestToJSON(projectEditRunRequest);
    await sendTwirpRequest(url, body);
  }

  async deleteRun(projectDeleteRunRequest: ProjectDeleteRunRequest): Promise<void> {
    const url = this.hostname + this.pathPrefix + "DeleteRun";
    const body: ProjectDeleteRunRequestJSON = ProjectDeleteRunRequestToJSON(projectDeleteRunRequest);
    await sendTwirpRequest(url, body);
  }

  async runFiles(projectRunFilesRequest: ProjectRunFilesRequest): Promise<ProjectRunFilesResponse> {
    const url = this.hostname + this.pathPrefix + "RunFiles";
    const body: ProjectRunFilesRequestJSON = ProjectRunFilesRequestToJSON(projectRunFilesRequest);
    const data = await sendTwirpRequest(url, body);
    return JSONToProjectRunFilesResponse(data);
  }

  async deleteFile(projectDeleteFileRequest: ProjectDeleteFileRequest): Promise<void> {
    const url = this.hostname + this.pathPrefix + "DeleteFile";
    const body: ProjectDeleteFileRequestJSON = ProjectDeleteFileRequestToJSON(projectDeleteFileRequest);
    await sendTwirpRequest(url, body);
  }

  async parsedFileContent(projectParsedFileContentRequest: ProjectParsedFileContentRequest): Promise<ProjectParsedFileContentResponse> {
    const url = this.hostname + this.pathPrefix + "ParsedFileContent";
    const body: ProjectParsedFileContentRequestJSON = ProjectParsedFileContentRequestToJSON(projectParsedFileContentRequest);
    const data = await sendTwirpRequest(url, body);
    return JSONToProjectParsedFileContentResponse(data);
  }

  async runResults(projectRunResultsRequest: ProjectRunResultsRequest): Promise<ProjectRunResultsResponse> {
    const url = this.hostname + this.pathPrefix + "RunResults";
    const body: ProjectRunResultsRequestJSON = ProjectRunResultsRequestToJSON(projectRunResultsRequest);
    const data = await sendTwirpRequest(url, body);
    return JSONToProjectRunResultsResponse(data);
  }

  async addResult(projectAddResultRequest: ProjectAddResultRequest): Promise<ProjectAddResultResponse> {
    const url = this.hostname + this.pathPrefix + "AddResult";
    const body: ProjectAddResultRequestJSON = ProjectAddResultRequestToJSON(projectAddResultRequest);
    const data = await sendTwirpRequest(url, body);
    return JSONToProjectAddResultResponse(data);
  }

  async editResult(projectEditResultRequest: ProjectEditResultRequest): Promise<void> {
    const url = this.hostname + this.pathPrefix + "EditResult";
    const body: ProjectEditResultRequestJSON = ProjectEditResultRequestToJSON(projectEditResultRequest);
    await sendTwirpRequest(url, body);
  }

  async deleteResult(projectDeleteResultRequest: ProjectDeleteResultRequest): Promise<void> {
    const url = this.hostname + this.pathPrefix + "DeleteResult";
    const body: ProjectDeleteResultRequestJSON = ProjectDeleteResultRequestToJSON(projectDeleteResultRequest);
    await sendTwirpRequest(url, body);
  }
}
