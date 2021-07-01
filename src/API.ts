/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateReportInput = {
  id: string,
  owner?: string | null,
  reason: string,
  createdAt: number,
  reportUtilId: string,
};

export type ModelReportConditionInput = {
  reason?: ModelStringInput | null,
  createdAt?: ModelIntInput | null,
  and?: Array< ModelReportConditionInput | null > | null,
  or?: Array< ModelReportConditionInput | null > | null,
  not?: ModelReportConditionInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type Report = {
  __typename: "Report",
  id: string,
  owner?: string | null,
  reason: string,
  util: Util,
  createdAt: number,
  updatedAt: string,
};

export type Util = {
  __typename: "Util",
  id: string,
  owner?: string | null,
  forkChain?:  Array<Util | null > | null,
  title: string,
  description: string,
  tags: Array< string >,
  permissions?: Array< Permissions | null > | null,
  license: License,
  approved: Approval,
  reports?: ModelReportConnection | null,
  langType: Langs,
  binLoc: string,
  srcLoc: string,
  jsonLoc: string,
  numUses: number,
  numLikes: number,
  likes?: Array< string | null > | null,
  createdAt: number,
  updatedAt: number,
  version: number,
};

export enum Permissions {
  getCam = "getCam",
  getAud = "getAud",
  getVidAud = "getVidAud",
  getNet = "getNet",
  sendNet = "sendNet",
  getCurrentPos = "getCurrentPos",
  getClipboard = "getClipboard",
  setClipboard = "setClipboard",
  getScreen = "getScreen",
  GetScreenAudio = "GetScreenAudio",
}


export enum License {
  bsd = "bsd",
  gpl = "gpl",
  unlicense = "unlicense",
  apache = "apache",
}


export enum Approval {
  pending = "pending",
  approved = "approved",
  disapproved = "disapproved",
}


export type ModelReportConnection = {
  __typename: "ModelReportConnection",
  items?:  Array<Report | null > | null,
  nextToken?: string | null,
};

export enum Langs {
  typescript = "typescript",
  csharp = "csharp",
  rust = "rust",
  cpp = "cpp",
}


export type UpdateReportInput = {
  id: string,
  owner?: string | null,
  reason?: string | null,
  createdAt?: number | null,
  reportUtilId?: string | null,
};

export type DeleteReportInput = {
  id: string,
};

export type CreateUtilInput = {
  id: string,
  owner?: string | null,
  title: string,
  description: string,
  tags: Array< string >,
  permissions?: Array< Permissions | null > | null,
  license: License,
  approved: Approval,
  langType: Langs,
  binLoc: string,
  srcLoc: string,
  jsonLoc: string,
  numUses: number,
  numLikes: number,
  likes?: Array< string | null > | null,
  createdAt: number,
  updatedAt: number,
};

export type ModelUtilConditionInput = {
  title?: ModelStringInput | null,
  description?: ModelStringInput | null,
  tags?: ModelStringInput | null,
  permissions?: ModelPermissionsListInput | null,
  license?: ModelLicenseInput | null,
  approved?: ModelApprovalInput | null,
  langType?: ModelLangsInput | null,
  binLoc?: ModelStringInput | null,
  srcLoc?: ModelStringInput | null,
  jsonLoc?: ModelStringInput | null,
  numUses?: ModelIntInput | null,
  numLikes?: ModelIntInput | null,
  likes?: ModelStringInput | null,
  createdAt?: ModelIntInput | null,
  updatedAt?: ModelIntInput | null,
  and?: Array< ModelUtilConditionInput | null > | null,
  or?: Array< ModelUtilConditionInput | null > | null,
  not?: ModelUtilConditionInput | null,
};

export type ModelPermissionsListInput = {
  eq?: Array< Permissions | null > | null,
  ne?: Array< Permissions | null > | null,
  contains?: Permissions | null,
  notContains?: Permissions | null,
};

export type ModelLicenseInput = {
  eq?: License | null,
  ne?: License | null,
};

export type ModelApprovalInput = {
  eq?: Approval | null,
  ne?: Approval | null,
};

export type ModelLangsInput = {
  eq?: Langs | null,
  ne?: Langs | null,
};

export type UpdateUtilInput = {
  id: string,
  owner?: string | null,
  title?: string | null,
  description?: string | null,
  tags?: Array< string > | null,
  permissions?: Array< Permissions | null > | null,
  license?: License | null,
  approved?: Approval | null,
  langType?: Langs | null,
  binLoc?: string | null,
  srcLoc?: string | null,
  jsonLoc?: string | null,
  numUses?: number | null,
  numLikes?: number | null,
  likes?: Array< string | null > | null,
  createdAt?: number | null,
  updatedAt?: number | null,
  expectedVersion: number,
};

export type DeleteUtilInput = {
  id: string,
  expectedVersion: number,
};

export type ModelReportFilterInput = {
  id?: ModelStringInput | null,
  owner?: ModelStringInput | null,
  reason?: ModelStringInput | null,
  createdAt?: ModelIntInput | null,
  and?: Array< ModelReportFilterInput | null > | null,
  or?: Array< ModelReportFilterInput | null > | null,
  not?: ModelReportFilterInput | null,
};

export type ModelUtilFilterInput = {
  id?: ModelStringInput | null,
  owner?: ModelStringInput | null,
  title?: ModelStringInput | null,
  description?: ModelStringInput | null,
  tags?: ModelStringInput | null,
  permissions?: ModelPermissionsListInput | null,
  license?: ModelLicenseInput | null,
  approved?: ModelApprovalInput | null,
  langType?: ModelLangsInput | null,
  binLoc?: ModelStringInput | null,
  srcLoc?: ModelStringInput | null,
  jsonLoc?: ModelStringInput | null,
  numUses?: ModelIntInput | null,
  numLikes?: ModelIntInput | null,
  likes?: ModelStringInput | null,
  createdAt?: ModelIntInput | null,
  updatedAt?: ModelIntInput | null,
  and?: Array< ModelUtilFilterInput | null > | null,
  or?: Array< ModelUtilFilterInput | null > | null,
  not?: ModelUtilFilterInput | null,
};

export type ModelUtilConnection = {
  __typename: "ModelUtilConnection",
  items?:  Array<Util | null > | null,
  nextToken?: string | null,
};

export type ModelIntKeyConditionInput = {
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelUtilByTrendCompositeKeyConditionInput = {
  eq?: ModelUtilByTrendCompositeKeyInput | null,
  le?: ModelUtilByTrendCompositeKeyInput | null,
  lt?: ModelUtilByTrendCompositeKeyInput | null,
  ge?: ModelUtilByTrendCompositeKeyInput | null,
  gt?: ModelUtilByTrendCompositeKeyInput | null,
  between?: Array< ModelUtilByTrendCompositeKeyInput | null > | null,
  beginsWith?: ModelUtilByTrendCompositeKeyInput | null,
};

export type ModelUtilByTrendCompositeKeyInput = {
  numUses?: number | null,
  createdAt?: number | null,
};

export type CreateReportMutationVariables = {
  input: CreateReportInput,
  condition?: ModelReportConditionInput | null,
};

export type CreateReportMutation = {
  createReport?:  {
    __typename: "Report",
    id: string,
    owner?: string | null,
    reason: string,
    util:  {
      __typename: "Util",
      id: string,
      owner?: string | null,
      title: string,
      description: string,
      tags: Array< string >,
      permissions?: Array< Permissions | null > | null,
      license: License,
      approved: Approval,
      langType: Langs,
      binLoc: string,
      srcLoc: string,
      jsonLoc: string,
      numUses: number,
      numLikes: number,
      likes?: Array< string | null > | null,
      createdAt: number,
      updatedAt: number,
      version: number,
    },
    createdAt: number,
    updatedAt: string,
  } | null,
};

export type UpdateReportMutationVariables = {
  input: UpdateReportInput,
  condition?: ModelReportConditionInput | null,
};

export type UpdateReportMutation = {
  updateReport?:  {
    __typename: "Report",
    id: string,
    owner?: string | null,
    reason: string,
    util:  {
      __typename: "Util",
      id: string,
      owner?: string | null,
      title: string,
      description: string,
      tags: Array< string >,
      permissions?: Array< Permissions | null > | null,
      license: License,
      approved: Approval,
      langType: Langs,
      binLoc: string,
      srcLoc: string,
      jsonLoc: string,
      numUses: number,
      numLikes: number,
      likes?: Array< string | null > | null,
      createdAt: number,
      updatedAt: number,
      version: number,
    },
    createdAt: number,
    updatedAt: string,
  } | null,
};

export type DeleteReportMutationVariables = {
  input: DeleteReportInput,
  condition?: ModelReportConditionInput | null,
};

export type DeleteReportMutation = {
  deleteReport?:  {
    __typename: "Report",
    id: string,
    owner?: string | null,
    reason: string,
    util:  {
      __typename: "Util",
      id: string,
      owner?: string | null,
      title: string,
      description: string,
      tags: Array< string >,
      permissions?: Array< Permissions | null > | null,
      license: License,
      approved: Approval,
      langType: Langs,
      binLoc: string,
      srcLoc: string,
      jsonLoc: string,
      numUses: number,
      numLikes: number,
      likes?: Array< string | null > | null,
      createdAt: number,
      updatedAt: number,
      version: number,
    },
    createdAt: number,
    updatedAt: string,
  } | null,
};

export type CreateUtilMutationVariables = {
  input: CreateUtilInput,
  condition?: ModelUtilConditionInput | null,
};

export type CreateUtilMutation = {
  createUtil?:  {
    __typename: "Util",
    id: string,
    owner?: string | null,
    forkChain?:  Array< {
      __typename: "Util",
      id: string,
      owner?: string | null,
      title: string,
      description: string,
      tags: Array< string >,
      permissions?: Array< Permissions | null > | null,
      license: License,
      approved: Approval,
      langType: Langs,
      binLoc: string,
      srcLoc: string,
      jsonLoc: string,
      numUses: number,
      numLikes: number,
      likes?: Array< string | null > | null,
      createdAt: number,
      updatedAt: number,
      version: number,
    } | null > | null,
    title: string,
    description: string,
    tags: Array< string >,
    permissions?: Array< Permissions | null > | null,
    license: License,
    approved: Approval,
    reports?:  {
      __typename: "ModelReportConnection",
      nextToken?: string | null,
    } | null,
    langType: Langs,
    binLoc: string,
    srcLoc: string,
    jsonLoc: string,
    numUses: number,
    numLikes: number,
    likes?: Array< string | null > | null,
    createdAt: number,
    updatedAt: number,
    version: number,
  } | null,
};

export type UpdateUtilMutationVariables = {
  input: UpdateUtilInput,
  condition?: ModelUtilConditionInput | null,
};

export type UpdateUtilMutation = {
  updateUtil?:  {
    __typename: "Util",
    id: string,
    owner?: string | null,
    forkChain?:  Array< {
      __typename: "Util",
      id: string,
      owner?: string | null,
      title: string,
      description: string,
      tags: Array< string >,
      permissions?: Array< Permissions | null > | null,
      license: License,
      approved: Approval,
      langType: Langs,
      binLoc: string,
      srcLoc: string,
      jsonLoc: string,
      numUses: number,
      numLikes: number,
      likes?: Array< string | null > | null,
      createdAt: number,
      updatedAt: number,
      version: number,
    } | null > | null,
    title: string,
    description: string,
    tags: Array< string >,
    permissions?: Array< Permissions | null > | null,
    license: License,
    approved: Approval,
    reports?:  {
      __typename: "ModelReportConnection",
      nextToken?: string | null,
    } | null,
    langType: Langs,
    binLoc: string,
    srcLoc: string,
    jsonLoc: string,
    numUses: number,
    numLikes: number,
    likes?: Array< string | null > | null,
    createdAt: number,
    updatedAt: number,
    version: number,
  } | null,
};

export type DeleteUtilMutationVariables = {
  input: DeleteUtilInput,
  condition?: ModelUtilConditionInput | null,
};

export type DeleteUtilMutation = {
  deleteUtil?:  {
    __typename: "Util",
    id: string,
    owner?: string | null,
    forkChain?:  Array< {
      __typename: "Util",
      id: string,
      owner?: string | null,
      title: string,
      description: string,
      tags: Array< string >,
      permissions?: Array< Permissions | null > | null,
      license: License,
      approved: Approval,
      langType: Langs,
      binLoc: string,
      srcLoc: string,
      jsonLoc: string,
      numUses: number,
      numLikes: number,
      likes?: Array< string | null > | null,
      createdAt: number,
      updatedAt: number,
      version: number,
    } | null > | null,
    title: string,
    description: string,
    tags: Array< string >,
    permissions?: Array< Permissions | null > | null,
    license: License,
    approved: Approval,
    reports?:  {
      __typename: "ModelReportConnection",
      nextToken?: string | null,
    } | null,
    langType: Langs,
    binLoc: string,
    srcLoc: string,
    jsonLoc: string,
    numUses: number,
    numLikes: number,
    likes?: Array< string | null > | null,
    createdAt: number,
    updatedAt: number,
    version: number,
  } | null,
};

export type GetReportQueryVariables = {
  id: string,
};

export type GetReportQuery = {
  getReport?:  {
    __typename: "Report",
    id: string,
    owner?: string | null,
    reason: string,
    util:  {
      __typename: "Util",
      id: string,
      owner?: string | null,
      title: string,
      description: string,
      tags: Array< string >,
      permissions?: Array< Permissions | null > | null,
      license: License,
      approved: Approval,
      langType: Langs,
      binLoc: string,
      srcLoc: string,
      jsonLoc: string,
      numUses: number,
      numLikes: number,
      likes?: Array< string | null > | null,
      createdAt: number,
      updatedAt: number,
      version: number,
    },
    createdAt: number,
    updatedAt: string,
  } | null,
};

export type ListReportsQueryVariables = {
  filter?: ModelReportFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListReportsQuery = {
  listReports?:  {
    __typename: "ModelReportConnection",
    items?:  Array< {
      __typename: "Report",
      id: string,
      owner?: string | null,
      reason: string,
      createdAt: number,
      updatedAt: string,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type GetUtilQueryVariables = {
  id: string,
};

export type GetUtilQuery = {
  getUtil?:  {
    __typename: "Util",
    id: string,
    owner?: string | null,
    forkChain?:  Array< {
      __typename: "Util",
      id: string,
      owner?: string | null,
      title: string,
      description: string,
      tags: Array< string >,
      permissions?: Array< Permissions | null > | null,
      license: License,
      approved: Approval,
      langType: Langs,
      binLoc: string,
      srcLoc: string,
      jsonLoc: string,
      numUses: number,
      numLikes: number,
      likes?: Array< string | null > | null,
      createdAt: number,
      updatedAt: number,
      version: number,
    } | null > | null,
    title: string,
    description: string,
    tags: Array< string >,
    permissions?: Array< Permissions | null > | null,
    license: License,
    approved: Approval,
    reports?:  {
      __typename: "ModelReportConnection",
      nextToken?: string | null,
    } | null,
    langType: Langs,
    binLoc: string,
    srcLoc: string,
    jsonLoc: string,
    numUses: number,
    numLikes: number,
    likes?: Array< string | null > | null,
    createdAt: number,
    updatedAt: number,
    version: number,
  } | null,
};

export type ListUtilsQueryVariables = {
  filter?: ModelUtilFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUtilsQuery = {
  listUtils?:  {
    __typename: "ModelUtilConnection",
    items?:  Array< {
      __typename: "Util",
      id: string,
      owner?: string | null,
      title: string,
      description: string,
      tags: Array< string >,
      permissions?: Array< Permissions | null > | null,
      license: License,
      approved: Approval,
      langType: Langs,
      binLoc: string,
      srcLoc: string,
      jsonLoc: string,
      numUses: number,
      numLikes: number,
      likes?: Array< string | null > | null,
      createdAt: number,
      updatedAt: number,
      version: number,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type ListReportsBySpecificOwnerQueryVariables = {
  owner?: string | null,
  createdAt?: ModelIntKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelReportFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListReportsBySpecificOwnerQuery = {
  listReportsBySpecificOwner?:  {
    __typename: "ModelReportConnection",
    items?:  Array< {
      __typename: "Report",
      id: string,
      owner?: string | null,
      reason: string,
      createdAt: number,
      updatedAt: string,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type GetTrendingQueryVariables = {
  numLikes?: number | null,
  numUsesCreatedAt?: ModelUtilByTrendCompositeKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelUtilFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type GetTrendingQuery = {
  getTrending?:  {
    __typename: "ModelUtilConnection",
    items?:  Array< {
      __typename: "Util",
      id: string,
      owner?: string | null,
      title: string,
      description: string,
      tags: Array< string >,
      permissions?: Array< Permissions | null > | null,
      license: License,
      approved: Approval,
      langType: Langs,
      binLoc: string,
      srcLoc: string,
      jsonLoc: string,
      numUses: number,
      numLikes: number,
      likes?: Array< string | null > | null,
      createdAt: number,
      updatedAt: number,
      version: number,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type ListUtilsSortedByTimestampQueryVariables = {
  createdAt?: number | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelUtilFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUtilsSortedByTimestampQuery = {
  listUtilsSortedByTimestamp?:  {
    __typename: "ModelUtilConnection",
    items?:  Array< {
      __typename: "Util",
      id: string,
      owner?: string | null,
      title: string,
      description: string,
      tags: Array< string >,
      permissions?: Array< Permissions | null > | null,
      license: License,
      approved: Approval,
      langType: Langs,
      binLoc: string,
      srcLoc: string,
      jsonLoc: string,
      numUses: number,
      numLikes: number,
      likes?: Array< string | null > | null,
      createdAt: number,
      updatedAt: number,
      version: number,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type ListUtilsBySpecificOwnerQueryVariables = {
  owner?: string | null,
  createdAt?: ModelIntKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelUtilFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUtilsBySpecificOwnerQuery = {
  listUtilsBySpecificOwner?:  {
    __typename: "ModelUtilConnection",
    items?:  Array< {
      __typename: "Util",
      id: string,
      owner?: string | null,
      title: string,
      description: string,
      tags: Array< string >,
      permissions?: Array< Permissions | null > | null,
      license: License,
      approved: Approval,
      langType: Langs,
      binLoc: string,
      srcLoc: string,
      jsonLoc: string,
      numUses: number,
      numLikes: number,
      likes?: Array< string | null > | null,
      createdAt: number,
      updatedAt: number,
      version: number,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type OnCreateReportSubscriptionVariables = {
  owner?: string | null,
};

export type OnCreateReportSubscription = {
  onCreateReport?:  {
    __typename: "Report",
    id: string,
    owner?: string | null,
    reason: string,
    util:  {
      __typename: "Util",
      id: string,
      owner?: string | null,
      title: string,
      description: string,
      tags: Array< string >,
      permissions?: Array< Permissions | null > | null,
      license: License,
      approved: Approval,
      langType: Langs,
      binLoc: string,
      srcLoc: string,
      jsonLoc: string,
      numUses: number,
      numLikes: number,
      likes?: Array< string | null > | null,
      createdAt: number,
      updatedAt: number,
      version: number,
    },
    createdAt: number,
    updatedAt: string,
  } | null,
};

export type OnUpdateReportSubscriptionVariables = {
  owner?: string | null,
};

export type OnUpdateReportSubscription = {
  onUpdateReport?:  {
    __typename: "Report",
    id: string,
    owner?: string | null,
    reason: string,
    util:  {
      __typename: "Util",
      id: string,
      owner?: string | null,
      title: string,
      description: string,
      tags: Array< string >,
      permissions?: Array< Permissions | null > | null,
      license: License,
      approved: Approval,
      langType: Langs,
      binLoc: string,
      srcLoc: string,
      jsonLoc: string,
      numUses: number,
      numLikes: number,
      likes?: Array< string | null > | null,
      createdAt: number,
      updatedAt: number,
      version: number,
    },
    createdAt: number,
    updatedAt: string,
  } | null,
};

export type OnDeleteReportSubscriptionVariables = {
  owner?: string | null,
};

export type OnDeleteReportSubscription = {
  onDeleteReport?:  {
    __typename: "Report",
    id: string,
    owner?: string | null,
    reason: string,
    util:  {
      __typename: "Util",
      id: string,
      owner?: string | null,
      title: string,
      description: string,
      tags: Array< string >,
      permissions?: Array< Permissions | null > | null,
      license: License,
      approved: Approval,
      langType: Langs,
      binLoc: string,
      srcLoc: string,
      jsonLoc: string,
      numUses: number,
      numLikes: number,
      likes?: Array< string | null > | null,
      createdAt: number,
      updatedAt: number,
      version: number,
    },
    createdAt: number,
    updatedAt: string,
  } | null,
};

export type OnCreateUtilSubscription = {
  onCreateUtil?:  {
    __typename: "Util",
    id: string,
    owner?: string | null,
    forkChain?:  Array< {
      __typename: "Util",
      id: string,
      owner?: string | null,
      title: string,
      description: string,
      tags: Array< string >,
      permissions?: Array< Permissions | null > | null,
      license: License,
      approved: Approval,
      langType: Langs,
      binLoc: string,
      srcLoc: string,
      jsonLoc: string,
      numUses: number,
      numLikes: number,
      likes?: Array< string | null > | null,
      createdAt: number,
      updatedAt: number,
      version: number,
    } | null > | null,
    title: string,
    description: string,
    tags: Array< string >,
    permissions?: Array< Permissions | null > | null,
    license: License,
    approved: Approval,
    reports?:  {
      __typename: "ModelReportConnection",
      nextToken?: string | null,
    } | null,
    langType: Langs,
    binLoc: string,
    srcLoc: string,
    jsonLoc: string,
    numUses: number,
    numLikes: number,
    likes?: Array< string | null > | null,
    createdAt: number,
    updatedAt: number,
    version: number,
  } | null,
};

export type OnUpdateUtilSubscription = {
  onUpdateUtil?:  {
    __typename: "Util",
    id: string,
    owner?: string | null,
    forkChain?:  Array< {
      __typename: "Util",
      id: string,
      owner?: string | null,
      title: string,
      description: string,
      tags: Array< string >,
      permissions?: Array< Permissions | null > | null,
      license: License,
      approved: Approval,
      langType: Langs,
      binLoc: string,
      srcLoc: string,
      jsonLoc: string,
      numUses: number,
      numLikes: number,
      likes?: Array< string | null > | null,
      createdAt: number,
      updatedAt: number,
      version: number,
    } | null > | null,
    title: string,
    description: string,
    tags: Array< string >,
    permissions?: Array< Permissions | null > | null,
    license: License,
    approved: Approval,
    reports?:  {
      __typename: "ModelReportConnection",
      nextToken?: string | null,
    } | null,
    langType: Langs,
    binLoc: string,
    srcLoc: string,
    jsonLoc: string,
    numUses: number,
    numLikes: number,
    likes?: Array< string | null > | null,
    createdAt: number,
    updatedAt: number,
    version: number,
  } | null,
};

export type OnDeleteUtilSubscription = {
  onDeleteUtil?:  {
    __typename: "Util",
    id: string,
    owner?: string | null,
    forkChain?:  Array< {
      __typename: "Util",
      id: string,
      owner?: string | null,
      title: string,
      description: string,
      tags: Array< string >,
      permissions?: Array< Permissions | null > | null,
      license: License,
      approved: Approval,
      langType: Langs,
      binLoc: string,
      srcLoc: string,
      jsonLoc: string,
      numUses: number,
      numLikes: number,
      likes?: Array< string | null > | null,
      createdAt: number,
      updatedAt: number,
      version: number,
    } | null > | null,
    title: string,
    description: string,
    tags: Array< string >,
    permissions?: Array< Permissions | null > | null,
    license: License,
    approved: Approval,
    reports?:  {
      __typename: "ModelReportConnection",
      nextToken?: string | null,
    } | null,
    langType: Langs,
    binLoc: string,
    srcLoc: string,
    jsonLoc: string,
    numUses: number,
    numLikes: number,
    likes?: Array< string | null > | null,
    createdAt: number,
    updatedAt: number,
    version: number,
  } | null,
};
