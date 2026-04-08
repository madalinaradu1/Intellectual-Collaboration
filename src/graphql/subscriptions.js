/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateTodo = /* GraphQL */ `
  subscription OnCreateTodo($filter: ModelSubscriptionTodoFilterInput) {
    onCreateTodo(filter: $filter) {
      id
      name
      description
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateTodo = /* GraphQL */ `
  subscription OnUpdateTodo($filter: ModelSubscriptionTodoFilterInput) {
    onUpdateTodo(filter: $filter) {
      id
      name
      description
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteTodo = /* GraphQL */ `
  subscription OnDeleteTodo($filter: ModelSubscriptionTodoFilterInput) {
    onDeleteTodo(filter: $filter) {
      id
      name
      description
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateForum = /* GraphQL */ `
  subscription OnCreateForum($filter: ModelSubscriptionForumFilterInput) {
    onCreateForum(filter: $filter) {
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
export const onUpdateForum = /* GraphQL */ `
  subscription OnUpdateForum($filter: ModelSubscriptionForumFilterInput) {
    onUpdateForum(filter: $filter) {
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
export const onDeleteForum = /* GraphQL */ `
  subscription OnDeleteForum($filter: ModelSubscriptionForumFilterInput) {
    onDeleteForum(filter: $filter) {
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
export const onCreatePost = /* GraphQL */ `
  subscription OnCreatePost($filter: ModelSubscriptionPostFilterInput) {
    onCreatePost(filter: $filter) {
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
export const onUpdatePost = /* GraphQL */ `
  subscription OnUpdatePost($filter: ModelSubscriptionPostFilterInput) {
    onUpdatePost(filter: $filter) {
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
export const onDeletePost = /* GraphQL */ `
  subscription OnDeletePost($filter: ModelSubscriptionPostFilterInput) {
    onDeletePost(filter: $filter) {
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
export const onCreatePersonalEvent = /* GraphQL */ `
  subscription OnCreatePersonalEvent(
    $filter: ModelSubscriptionPersonalEventFilterInput
  ) {
    onCreatePersonalEvent(filter: $filter) {
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
export const onUpdatePersonalEvent = /* GraphQL */ `
  subscription OnUpdatePersonalEvent(
    $filter: ModelSubscriptionPersonalEventFilterInput
  ) {
    onUpdatePersonalEvent(filter: $filter) {
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
export const onDeletePersonalEvent = /* GraphQL */ `
  subscription OnDeletePersonalEvent(
    $filter: ModelSubscriptionPersonalEventFilterInput
  ) {
    onDeletePersonalEvent(filter: $filter) {
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
export const onCreateGlobalEvent = /* GraphQL */ `
  subscription OnCreateGlobalEvent(
    $filter: ModelSubscriptionGlobalEventFilterInput
  ) {
    onCreateGlobalEvent(filter: $filter) {
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
export const onUpdateGlobalEvent = /* GraphQL */ `
  subscription OnUpdateGlobalEvent(
    $filter: ModelSubscriptionGlobalEventFilterInput
  ) {
    onUpdateGlobalEvent(filter: $filter) {
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
export const onDeleteGlobalEvent = /* GraphQL */ `
  subscription OnDeleteGlobalEvent(
    $filter: ModelSubscriptionGlobalEventFilterInput
  ) {
    onDeleteGlobalEvent(filter: $filter) {
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
