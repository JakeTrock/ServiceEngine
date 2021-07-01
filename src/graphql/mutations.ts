/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createReport = /* GraphQL */ `
  mutation CreateReport(
    $input: CreateReportInput!
    $condition: ModelReportConditionInput
  ) {
    createReport(input: $input, condition: $condition) {
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
export const updateReport = /* GraphQL */ `
  mutation UpdateReport(
    $input: UpdateReportInput!
    $condition: ModelReportConditionInput
  ) {
    updateReport(input: $input, condition: $condition) {
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
export const deleteReport = /* GraphQL */ `
  mutation DeleteReport(
    $input: DeleteReportInput!
    $condition: ModelReportConditionInput
  ) {
    deleteReport(input: $input, condition: $condition) {
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
export const createUtil = /* GraphQL */ `
  mutation CreateUtil(
    $input: CreateUtilInput!
    $condition: ModelUtilConditionInput
  ) {
    createUtil(input: $input, condition: $condition) {
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
export const updateUtil = /* GraphQL */ `
  mutation UpdateUtil(
    $input: UpdateUtilInput!
    $condition: ModelUtilConditionInput
  ) {
    updateUtil(input: $input, condition: $condition) {
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
export const deleteUtil = /* GraphQL */ `
  mutation DeleteUtil(
    $input: DeleteUtilInput!
    $condition: ModelUtilConditionInput
  ) {
    deleteUtil(input: $input, condition: $condition) {
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
