/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateReport = /* GraphQL */ `
  subscription OnCreateReport($owner: String) {
    onCreateReport(owner: $owner) {
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
export const onUpdateReport = /* GraphQL */ `
  subscription OnUpdateReport($owner: String) {
    onUpdateReport(owner: $owner) {
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
export const onDeleteReport = /* GraphQL */ `
  subscription OnDeleteReport($owner: String) {
    onDeleteReport(owner: $owner) {
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
export const onCreateUtil = /* GraphQL */ `
  subscription OnCreateUtil {
    onCreateUtil {
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
export const onUpdateUtil = /* GraphQL */ `
  subscription OnUpdateUtil {
    onUpdateUtil {
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
export const onDeleteUtil = /* GraphQL */ `
  subscription OnDeleteUtil {
    onDeleteUtil {
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
