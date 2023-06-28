// @flow strict
/* eslint-disable */
import axios from "axios";

type TwirpErrorJSON = {
  code: string;
  msg: string;
  meta: { [index: string]: string };
}

export class TwirpError extends Error {
  code: string;
  meta: { [index: string]: string };

  constructor(te: TwirpErrorJSON) {
    super(te.msg);

    this.code = te.code;
    this.meta = te.meta;
  }
}

export async function sendTwirpRequest<I, O>(url: string, body: I): Promise<O> {
  try {
    const resp = await axios.post(url, body, { withCredentials: true });
    return (resp.data: O);
  } catch (err) {
    if (err.response) {
      throw new TwirpError((err.response.data: TwirpErrorJSON));
    }
    throw err;
  }
}