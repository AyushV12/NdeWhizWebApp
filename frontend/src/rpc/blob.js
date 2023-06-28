// @flow strict
/* eslint-disable */
import { sendTwirpRequest } from "./twirp";

export type BlobDeleteBlobRequest = {
  blobId: string;
}

export type BlobDeleteBlobRequestJSON = {
  blob_id?: string;
}

export function BlobDeleteBlobRequestToJSON(m: BlobDeleteBlobRequest): BlobDeleteBlobRequestJSON {
  return {
    blob_id: m.blobId,
  };
}

export function JSONToBlobDeleteBlobRequest(m: BlobDeleteBlobRequestJSON): BlobDeleteBlobRequest {
  return {
    blobId: m.blob_id != null ? m.blob_id : "",
  };
}

export class BlobService {
  hostname: string;
  pathPrefix: string = "/rpc.BlobService/";

  constructor(hostname: string) {
    this.hostname = hostname;
  }

  async deleteBlob(blobDeleteBlobRequest: BlobDeleteBlobRequest): Promise<void> {
    const url = this.hostname + this.pathPrefix + "DeleteBlob";
    const body: BlobDeleteBlobRequestJSON = BlobDeleteBlobRequestToJSON(blobDeleteBlobRequest);
    await sendTwirpRequest(url, body);
  }
}
