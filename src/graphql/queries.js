/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getTodo = /* GraphQL */ `
  query GetTodo($id: ID!) {
    getTodo(id: $id) {
      id
      name
      description
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listTodos = /* GraphQL */ `
  query ListTodos(
    $filter: ModelTodoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTodos(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getForum = /* GraphQL */ `
  query GetForum($id: ID!) {
    getForum(id: $id) {
      id
      title
      groupName
      description
      createdBy
      posts {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listForums = /* GraphQL */ `
  query ListForums(
    $filter: ModelForumFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listForums(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        groupName
        description
        createdBy
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getPost = /* GraphQL */ `
  query GetPost($id: ID!) {
    getPost(id: $id) {
      id
      body
      author
      createdBy
      forumID
      forum {
        id
        title
        groupName
        description
        createdBy
        createdAt
        updatedAt
        __typename
      }
      parentPostID
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listPosts = /* GraphQL */ `
  query ListPosts(
    $filter: ModelPostFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPosts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        body
        author
        createdBy
        forumID
        parentPostID
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getPersonalEvent = /* GraphQL */ `
  query GetPersonalEvent($id: ID!) {
    getPersonalEvent(id: $id) {
      id
      title
      date
      time
      location
      notes
      owner
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listPersonalEvents = /* GraphQL */ `
  query ListPersonalEvents(
    $filter: ModelPersonalEventFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPersonalEvents(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        date
        time
        location
        notes
        owner
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getGlobalEvent = /* GraphQL */ `
  query GetGlobalEvent($id: ID!) {
    getGlobalEvent(id: $id) {
      id
      title
      date
      time
      location
      notes
      createdBy
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listGlobalEvents = /* GraphQL */ `
  query ListGlobalEvents(
    $filter: ModelGlobalEventFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listGlobalEvents(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        date
        time
        location
        notes
        createdBy
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const postsByForumID = /* GraphQL */ `
  query PostsByForumID(
    $forumID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelPostFilterInput
    $limit: Int
    $nextToken: String
  ) {
    postsByForumID(
      forumID: $forumID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        body
        author
        createdBy
        forumID
        parentPostID
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const personalEventsByOwner = /* GraphQL */ `
  query PersonalEventsByOwner(
    $owner: String!
    $sortDirection: ModelSortDirection
    $filter: ModelPersonalEventFilterInput
    $limit: Int
    $nextToken: String
  ) {
    personalEventsByOwner(
      owner: $owner
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        title
        date
        time
        location
        notes
        owner
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
