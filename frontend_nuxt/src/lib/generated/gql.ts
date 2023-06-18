/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "query game($id: ID!) {\n  game(id: $id) {\n    id\n    name\n    participants(paging: {pageSize: 10, pageNumber: 1, isDesc: true}) {\n      id\n    }\n  }\n}": types.GameDocument,
    "query games($pageSize: Int!, $pageNumber: Int!) {\n  games(\n    query: {paging: {pageSize: $pageSize, pageNumber: $pageNumber, isDesc: false}}\n  ) {\n    id\n    name\n    participantsCount\n  }\n}": types.GamesDocument,
    "mutation registerGame($input: NewGame!) {\n  registerGame(input: $input) {\n    game {\n      id\n      name\n      participants {\n        id\n      }\n    }\n  }\n}": types.RegisterGameDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query game($id: ID!) {\n  game(id: $id) {\n    id\n    name\n    participants(paging: {pageSize: 10, pageNumber: 1, isDesc: true}) {\n      id\n    }\n  }\n}"): (typeof documents)["query game($id: ID!) {\n  game(id: $id) {\n    id\n    name\n    participants(paging: {pageSize: 10, pageNumber: 1, isDesc: true}) {\n      id\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query games($pageSize: Int!, $pageNumber: Int!) {\n  games(\n    query: {paging: {pageSize: $pageSize, pageNumber: $pageNumber, isDesc: false}}\n  ) {\n    id\n    name\n    participantsCount\n  }\n}"): (typeof documents)["query games($pageSize: Int!, $pageNumber: Int!) {\n  games(\n    query: {paging: {pageSize: $pageSize, pageNumber: $pageNumber, isDesc: false}}\n  ) {\n    id\n    name\n    participantsCount\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation registerGame($input: NewGame!) {\n  registerGame(input: $input) {\n    game {\n      id\n      name\n      participants {\n        id\n      }\n    }\n  }\n}"): (typeof documents)["mutation registerGame($input: NewGame!) {\n  registerGame(input: $input) {\n    game {\n      id\n      name\n      participants {\n        id\n      }\n    }\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;