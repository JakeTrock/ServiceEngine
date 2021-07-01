/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getReport = /* GraphQL */ `
  query GetReport($id: ID!) {
    getReport(id: $id) {
      id
      owner
      reason
      util {
        id
        owner
        title
        description
        tags
        permissions
        license
        approved
        langType
        binLoc
        srcLoc
        jsonLoc
        numUses
        numLikes
        likes
        createdAt
        updatedAt
        version
      }
      createdAt
      updatedAt
    }
  }
`;
export const listReports = /* GraphQL */ `
  query ListReports(
    $filter: ModelReportFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listReports(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        owner
        reason
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getUtil = /* GraphQL */ `
  query GetUtil($id: ID!) {
    getUtil(id: $id) {
      id
      owner
      forkChain {
        id
        owner
        title
        description
        tags
        permissions
        license
        approved
        langType
        binLoc
        srcLoc
        jsonLoc
        numUses
        numLikes
        likes
        createdAt
        updatedAt
        version
      }
      title
      description
      tags
      permissions
      license
      approved
      reports {
        nextToken
      }
      langType
      binLoc
      srcLoc
      jsonLoc
      numUses
      numLikes
      likes
      createdAt
      updatedAt
      version
    }
  }
`;
export const listUtils = /* GraphQL */ `
  query ListUtils(
    $filter: ModelUtilFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUtils(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        owner
        title
        description
        tags
        permissions
        license
        approved
        langType
        binLoc
        srcLoc
        jsonLoc
        numUses
        numLikes
        likes
        createdAt
        updatedAt
        version
      }
      nextToken
    }
  }
`;
export const listReportsBySpecificOwner = /* GraphQL */ `
  query ListReportsBySpecificOwner(
    $owner: String
    $createdAt: ModelIntKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelReportFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listReportsBySpecificOwner(
      owner: $owner
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        owner
        reason
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getTrending = /* GraphQL */ `
  query GetTrending(
    $numLikes: Int
    $numUsesCreatedAt: ModelUtilByTrendCompositeKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelUtilFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getTrending(
      numLikes: $numLikes
      numUsesCreatedAt: $numUsesCreatedAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        owner
        title
        description
        tags
        permissions
        license
        approved
        langType
        binLoc
        srcLoc
        jsonLoc
        numUses
        numLikes
        likes
        createdAt
        updatedAt
        version
      }
      nextToken
    }
  }
`;
export const listUtilsSortedByTimestamp = /* GraphQL */ `
  query ListUtilsSortedByTimestamp(
    $createdAt: Int
    $sortDirection: ModelSortDirection
    $filter: ModelUtilFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUtilsSortedByTimestamp(
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        owner
        title
        description
        tags
        permissions
        license
        approved
        langType
        binLoc
        srcLoc
        jsonLoc
        numUses
        numLikes
        likes
        createdAt
        updatedAt
        version
      }
      nextToken
    }
  }
`;
export const listUtilsBySpecificOwner = /* GraphQL */ `
  query ListUtilsBySpecificOwner(
    $owner: String
    $createdAt: ModelIntKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelUtilFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUtilsBySpecificOwner(
      owner: $owner
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        owner
        title
        description
        tags
        permissions
        license
        approved
        langType
        binLoc
        srcLoc
        jsonLoc
        numUses
        numLikes
        likes
        createdAt
        updatedAt
        version
      }
      nextToken
    }
  }
`;
