/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createTodo = /* GraphQL */ `
  mutation CreateTodo(
    $input: CreateTodoInput!
    $condition: ModelTodoConditionInput
  ) {
    createTodo(input: $input, condition: $condition) {
      id
      name
      description
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateTodo = /* GraphQL */ `
  mutation UpdateTodo(
    $input: UpdateTodoInput!
    $condition: ModelTodoConditionInput
  ) {
    updateTodo(input: $input, condition: $condition) {
      id
      name
      description
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteTodo = /* GraphQL */ `
  mutation DeleteTodo(
    $input: DeleteTodoInput!
    $condition: ModelTodoConditionInput
  ) {
    deleteTodo(input: $input, condition: $condition) {
      id
      name
      description
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createForum = /* GraphQL */ `
  mutation CreateForum(
    $input: CreateForumInput!
    $condition: ModelForumConditionInput
  ) {
    createForum(input: $input, condition: $condition) {
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
export const updateForum = /* GraphQL */ `
  mutation UpdateForum(
    $input: UpdateForumInput!
    $condition: ModelForumConditionInput
  ) {
    updateForum(input: $input, condition: $condition) {
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
export const deleteForum = /* GraphQL */ `
  mutation DeleteForum(
    $input: DeleteForumInput!
    $condition: ModelForumConditionInput
  ) {
    deleteForum(input: $input, condition: $condition) {
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
export const createPost = /* GraphQL */ `
  mutation CreatePost(
    $input: CreatePostInput!
    $condition: ModelPostConditionInput
  ) {
    createPost(input: $input, condition: $condition) {
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
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updatePost = /* GraphQL */ `
  mutation UpdatePost(
    $input: UpdatePostInput!
    $condition: ModelPostConditionInput
  ) {
    updatePost(input: $input, condition: $condition) {
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
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deletePost = /* GraphQL */ `
  mutation DeletePost(
    $input: DeletePostInput!
    $condition: ModelPostConditionInput
  ) {
    deletePost(input: $input, condition: $condition) {
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
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createPersonalEvent = /* GraphQL */ `
  mutation CreatePersonalEvent(
    $input: CreatePersonalEventInput!
    $condition: ModelPersonalEventConditionInput
  ) {
    createPersonalEvent(input: $input, condition: $condition) {
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
export const updatePersonalEvent = /* GraphQL */ `
  mutation UpdatePersonalEvent(
    $input: UpdatePersonalEventInput!
    $condition: ModelPersonalEventConditionInput
  ) {
    updatePersonalEvent(input: $input, condition: $condition) {
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
export const deletePersonalEvent = /* GraphQL */ `
  mutation DeletePersonalEvent(
    $input: DeletePersonalEventInput!
    $condition: ModelPersonalEventConditionInput
  ) {
    deletePersonalEvent(input: $input, condition: $condition) {
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
export const createGlobalEvent = /* GraphQL */ `
  mutation CreateGlobalEvent(
    $input: CreateGlobalEventInput!
    $condition: ModelGlobalEventConditionInput
  ) {
    createGlobalEvent(input: $input, condition: $condition) {
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
export const updateGlobalEvent = /* GraphQL */ `
  mutation UpdateGlobalEvent(
    $input: UpdateGlobalEventInput!
    $condition: ModelGlobalEventConditionInput
  ) {
    updateGlobalEvent(input: $input, condition: $condition) {
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
export const deleteGlobalEvent = /* GraphQL */ `
  mutation DeleteGlobalEvent(
    $input: DeleteGlobalEventInput!
    $condition: ModelGlobalEventConditionInput
  ) {
    deleteGlobalEvent(input: $input, condition: $condition) {
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
