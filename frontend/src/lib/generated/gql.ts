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
    "\n  query Game($id: ID!) {\n    game(id: $id) {\n      id\n      name\n      status\n      participants {\n        id\n      }\n      periods {\n        id\n      }\n      settings {\n        chara {\n          canOriginalCharacter\n        }\n        capacity {\n          min\n          max\n        }\n        rule {\n          canShorten\n          canSendDirectMessage\n        }\n        time {\n          periodPrefix\n          periodSuffix\n          periodIntervalSeconds\n          openAt\n          startParticipateAt\n          startGameAt\n        }\n        password {\n          hasPassword\n        }\n      }\n    }\n  }\n": types.GameDocument,
    "\n  query IndexGames($pageSize: Int!, $pageNumber: Int!) {\n    games(\n      query: {\n        paging: { pageSize: $pageSize, pageNumber: $pageNumber, isDesc: true }\n      }\n    ) {\n      id\n      name\n      participantsCount\n    }\n  }\n": types.IndexGamesDocument,
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
export function graphql(source: "\n  query Game($id: ID!) {\n    game(id: $id) {\n      id\n      name\n      status\n      participants {\n        id\n      }\n      periods {\n        id\n      }\n      settings {\n        chara {\n          canOriginalCharacter\n        }\n        capacity {\n          min\n          max\n        }\n        rule {\n          canShorten\n          canSendDirectMessage\n        }\n        time {\n          periodPrefix\n          periodSuffix\n          periodIntervalSeconds\n          openAt\n          startParticipateAt\n          startGameAt\n        }\n        password {\n          hasPassword\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query Game($id: ID!) {\n    game(id: $id) {\n      id\n      name\n      status\n      participants {\n        id\n      }\n      periods {\n        id\n      }\n      settings {\n        chara {\n          canOriginalCharacter\n        }\n        capacity {\n          min\n          max\n        }\n        rule {\n          canShorten\n          canSendDirectMessage\n        }\n        time {\n          periodPrefix\n          periodSuffix\n          periodIntervalSeconds\n          openAt\n          startParticipateAt\n          startGameAt\n        }\n        password {\n          hasPassword\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query IndexGames($pageSize: Int!, $pageNumber: Int!) {\n    games(\n      query: {\n        paging: { pageSize: $pageSize, pageNumber: $pageNumber, isDesc: true }\n      }\n    ) {\n      id\n      name\n      participantsCount\n    }\n  }\n"): (typeof documents)["\n  query IndexGames($pageSize: Int!, $pageNumber: Int!) {\n    games(\n      query: {\n        paging: { pageSize: $pageSize, pageNumber: $pageNumber, isDesc: true }\n      }\n    ) {\n      id\n      name\n      participantsCount\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;