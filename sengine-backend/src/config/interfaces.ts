export interface IUser {
  _id: string;
  email: string;
  username: string;
  password: string;
  phone: string;
  currSecToken: string;
  currUsrOp: string;
  secTokExp: string; //TODO:should this be a str?
  utils: string[];
  likes: string[];
  dislikes: string[];
}

export interface IUtil {
  _id: string;
  authorId: string;
  forkChain: string[];
  title: string;
  description: string;
  tags: string[];
  permissions: string[];
  binHash: string;
  binLoc: string;
  srcLoc: string;
  jsonLoc: string;
  uses: number;
  likes: number;
  dislikes: number;
}

export interface IReport {
  _id: string;
  reportedBy: string;
  reason: string;
  util: string;
}
