import utilSchema from "../models/util";

export interface IRemix {
  metadata: utilSchema;
  files: {
    jsonLoc: string;
    binLoc: string;
    srcLoc: string;
  };
}

export interface IhttpResult {
  statusCode: number;
  headers: {
    "Content-Type": string;
  };
  body: string;
}

export interface utcreate {
  binHash?: string;
  title?: string;
  tags?: string[];
  description?: string;
}
