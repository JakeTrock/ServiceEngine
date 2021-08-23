export interface util {
  id: string;
  owner: string;
  forkChain: string[];
  description: string;
  title: string;
  numUses: Number;
  numLikes: Number;
  updatedAt: Number;
  tags: string[];
  license: string;
  approved: boolean;
  permissions: string[];
  libraries: {
    childDeps: libInfo[];
    parentDeps: libInfo[];
  };
  createdAt: number;
}

export interface libInfo {
  libname: string;
  libprefix: string;
  permissionsNeeded: string[];
  functionsUsed: string[];
  libVersion: string | string[];
}

export interface lib {
  id: string;
  owner: string;
  forkChain: string[];
  description: string;
  title: string;
  updatedAt: Number;
  tags: string[];
  permissions: Permissions[];
  license: string;
  approved: string;
}

export interface profDetails {
  utils: [util] | [];
  libs: [lib] | [];
  username: string;
}

export interface usrCreds {
  confirmed: boolean;
  username: string;
  userSub: string;
}

export interface usrLogin {
  email: string;
  username: string;
  password: string;
}

export interface IFaceBlock {
  id: string;
  uuid?: string;
  defaults: { [key: string]: any }; //{ [key: string]: string | boolean | string[] | number };
  hooks?: { [key: string]: any }; //https://www.w3schools.com/jsref/dom_obj_event.asp
}

export interface interfaceDescription {
  title: string;
  tags: string;
  description: string;
  license: string;
  libraries: libInfo[] | [];
  permissions: string[] | [];
}

export interface exportCollection {
  [key: string]: {
    function: any;
    names: string[];
  };
}
