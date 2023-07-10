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
    "mutation DeleteParticipantIcon($input: DeleteGameParticipantIcon!) {\n  deleteGameParticipantIcon(input: $input) {\n    ok\n  }\n}": types.DeleteParticipantIconDocument,
    "mutation FavoriteDirect($input: NewDirectMessageFavorite!) {\n  registerDirectMessageFavorite(input: $input) {\n    ok\n  }\n}": types.FavoriteDirectDocument,
    "mutation UnfavoriteDirect($input: DeleteDirectMessageFavorite!) {\n  deleteDirectMessageFavorite(input: $input) {\n    ok\n  }\n}": types.UnfavoriteDirectDocument,
    "mutation Follow($input: NewGameParticipantFollow!) {\n  registerGameParticipantFollow(input: $input) {\n    ok\n  }\n}": types.FollowDocument,
    "mutation Favorite($input: NewMessageFavorite!) {\n  registerMessageFavorite(input: $input) {\n    ok\n  }\n}": types.FavoriteDocument,
    "mutation Unfavorite($input: DeleteMessageFavorite!) {\n  deleteMessageFavorite(input: $input) {\n    ok\n  }\n}": types.UnfavoriteDocument,
    "mutation RegisterParticipantGroup($input: NewGameParticipantGroup!) {\n  registerGameParticipantGroup(input: $input) {\n    gameParticipantGroup {\n      id\n      name\n      participants {\n        id\n        name\n      }\n    }\n  }\n}": types.RegisterParticipantGroupDocument,
    "mutation RegisterGameParticipant($input: NewGameParticipant!) {\n  registerGameParticipant(input: $input) {\n    gameParticipant {\n      id\n    }\n  }\n}": types.RegisterGameParticipantDocument,
    "mutation TalkDirect($input: NewDirectMessage!) {\n  registerDirectMessage(input: $input) {\n    ok\n  }\n}": types.TalkDirectDocument,
    "mutation Talk($input: NewMessage!) {\n  registerMessage(input: $input) {\n    ok\n  }\n}": types.TalkDocument,
    "mutation Unfollow($input: DeleteGameParticipantFollow!) {\n  deleteGameParticipantFollow(input: $input) {\n    ok\n  }\n}": types.UnfollowDocument,
    "mutation UpdateParticipantGroup($input: UpdateGameParticipantGroup!) {\n  updateGameParticipantGroup(input: $input) {\n    ok\n  }\n}": types.UpdateParticipantGroupDocument,
    "mutation UpdateIcon($input: UpdateGameParticipantIcon!) {\n  updateGameParticipantIcon(input: $input) {\n    ok\n  }\n}": types.UpdateIconDocument,
    "mutation UpdateGameParticipantProfile($input: UpdateGameParticipantProfile!) {\n  updateGameParticipantProfile(input: $input) {\n    ok\n  }\n}": types.UpdateGameParticipantProfileDocument,
    "mutation UploadIcon($input: NewGameParticipantIcon!) {\n  registerGameParticipantIcon(input: $input) {\n    gameParticipantIcon {\n      id\n    }\n  }\n}": types.UploadIconDocument,
    "query DirectFavoriteParticipants($gameId: ID!, $directMessageId: ID!) {\n  directMessageFavoriteGameParticipants(\n    gameId: $gameId\n    directMessageId: $directMessageId\n  ) {\n    id\n    name\n    entryNumber\n    profileIcon {\n      id\n      url\n    }\n  }\n}": types.DirectFavoriteParticipantsDocument,
    "query GameDirectMessages($gameId: ID!, $query: DirectMessagesQuery!) {\n  directMessages(gameId: $gameId, query: $query) {\n    list {\n      id\n      content {\n        type\n        text\n        number\n        isConvertDisabled\n      }\n      time {\n        sendAt\n        sendUnixTimeMilli\n      }\n      sender {\n        participantId\n        name\n        icon {\n          url\n          width\n          height\n        }\n      }\n      reactions {\n        favoriteCounts\n        favoriteParticipantIds\n      }\n    }\n    allPageCount\n    hasPrePage\n    hasNextPage\n    currentPageNumber\n    isDesc\n  }\n}": types.GameDirectMessagesDocument,
    "query Followers($participantId: ID!) {\n  gameParticipantFollowers(participantId: $participantId) {\n    id\n    name\n    profileIcon {\n      id\n      url\n    }\n  }\n}": types.FollowersDocument,
    "query Follows($participantId: ID!) {\n  gameParticipantFollows(participantId: $participantId) {\n    id\n    name\n    profileIcon {\n      id\n      url\n    }\n  }\n}": types.FollowsDocument,
    "query GameMessages($gameId: ID!, $query: MessagesQuery!) {\n  messages(gameId: $gameId, query: $query) {\n    list {\n      id\n      content {\n        type\n        text\n        number\n        isConvertDisabled\n      }\n      time {\n        sendAt\n        sendUnixTimeMilli\n      }\n      sender {\n        participantId\n        name\n        icon {\n          url\n          width\n          height\n        }\n      }\n      replyTo {\n        messageId\n        participantId\n      }\n      reactions {\n        replyCount\n        favoriteCount\n        favoriteParticipantIds\n      }\n    }\n    allPageCount\n    hasPrePage\n    hasNextPage\n    currentPageNumber\n    isDesc\n  }\n}": types.GameMessagesDocument,
    "query ParticipantGroups($gameId: ID!, $participantId: ID) {\n  gameParticipantGroups(\n    gameId: $gameId\n    query: {memberParticipantId: $participantId}\n  ) {\n    id\n    name\n    participants {\n      id\n      name\n      profileIcon {\n        id\n        url\n      }\n    }\n  }\n}": types.ParticipantGroupsDocument,
    "query Icons($participantId: ID!) {\n  gameParticipantIcons(participantId: $participantId) {\n    id\n    url\n    width\n    height\n  }\n}": types.IconsDocument,
    "query GameParticipantProfile($participantId: ID!) {\n  gameParticipantProfile(participantId: $participantId) {\n    participantId\n    name\n    profileImageUrl\n    introduction\n    followsCount\n    followersCount\n  }\n}": types.GameParticipantProfileDocument,
    "query Game($id: ID!) {\n  game(id: $id) {\n    id\n    name\n    status\n    participants {\n      id\n      name\n      entryNumber\n      profileIcon {\n        id\n        url\n      }\n    }\n    periods {\n      id\n    }\n    settings {\n      chara {\n        canOriginalCharacter\n      }\n      capacity {\n        min\n        max\n      }\n      rule {\n        canShorten\n        canSendDirectMessage\n      }\n      time {\n        periodPrefix\n        periodSuffix\n        periodIntervalSeconds\n        openAt\n        startParticipateAt\n        startGameAt\n      }\n      password {\n        hasPassword\n      }\n    }\n  }\n}": types.GameDocument,
    "query FavoriteParticipants($gameId: ID!, $messageId: ID!) {\n  messageFavoriteGameParticipants(gameId: $gameId, messageId: $messageId) {\n    id\n    name\n    entryNumber\n    profileIcon {\n      id\n      url\n    }\n  }\n}": types.FavoriteParticipantsDocument,
    "query MessageReplies($gameId: ID!, $messageId: ID!) {\n  messageReplies(gameId: $gameId, messageId: $messageId) {\n    id\n    content {\n      type\n      text\n      number\n      isConvertDisabled\n    }\n    time {\n      sendAt\n      sendUnixTimeMilli\n    }\n    sender {\n      participantId\n      name\n      icon {\n        url\n        width\n        height\n      }\n    }\n    replyTo {\n      messageId\n      participantId\n    }\n    reactions {\n      replyCount\n      favoriteCount\n      favoriteParticipantIds\n    }\n  }\n}": types.MessageRepliesDocument,
    "query MyGameParticipant($gameId: ID!) {\n  myGameParticipant(gameId: $gameId) {\n    id\n    name\n    entryNumber\n    player {\n      id\n    }\n    profileIcon {\n      id\n      url\n    }\n    followParticipantIds\n    followerParticipantIds\n  }\n}": types.MyGameParticipantDocument,
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
export function graphql(source: "mutation DeleteParticipantIcon($input: DeleteGameParticipantIcon!) {\n  deleteGameParticipantIcon(input: $input) {\n    ok\n  }\n}"): (typeof documents)["mutation DeleteParticipantIcon($input: DeleteGameParticipantIcon!) {\n  deleteGameParticipantIcon(input: $input) {\n    ok\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation FavoriteDirect($input: NewDirectMessageFavorite!) {\n  registerDirectMessageFavorite(input: $input) {\n    ok\n  }\n}"): (typeof documents)["mutation FavoriteDirect($input: NewDirectMessageFavorite!) {\n  registerDirectMessageFavorite(input: $input) {\n    ok\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation UnfavoriteDirect($input: DeleteDirectMessageFavorite!) {\n  deleteDirectMessageFavorite(input: $input) {\n    ok\n  }\n}"): (typeof documents)["mutation UnfavoriteDirect($input: DeleteDirectMessageFavorite!) {\n  deleteDirectMessageFavorite(input: $input) {\n    ok\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Follow($input: NewGameParticipantFollow!) {\n  registerGameParticipantFollow(input: $input) {\n    ok\n  }\n}"): (typeof documents)["mutation Follow($input: NewGameParticipantFollow!) {\n  registerGameParticipantFollow(input: $input) {\n    ok\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Favorite($input: NewMessageFavorite!) {\n  registerMessageFavorite(input: $input) {\n    ok\n  }\n}"): (typeof documents)["mutation Favorite($input: NewMessageFavorite!) {\n  registerMessageFavorite(input: $input) {\n    ok\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Unfavorite($input: DeleteMessageFavorite!) {\n  deleteMessageFavorite(input: $input) {\n    ok\n  }\n}"): (typeof documents)["mutation Unfavorite($input: DeleteMessageFavorite!) {\n  deleteMessageFavorite(input: $input) {\n    ok\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation RegisterParticipantGroup($input: NewGameParticipantGroup!) {\n  registerGameParticipantGroup(input: $input) {\n    gameParticipantGroup {\n      id\n      name\n      participants {\n        id\n        name\n      }\n    }\n  }\n}"): (typeof documents)["mutation RegisterParticipantGroup($input: NewGameParticipantGroup!) {\n  registerGameParticipantGroup(input: $input) {\n    gameParticipantGroup {\n      id\n      name\n      participants {\n        id\n        name\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation RegisterGameParticipant($input: NewGameParticipant!) {\n  registerGameParticipant(input: $input) {\n    gameParticipant {\n      id\n    }\n  }\n}"): (typeof documents)["mutation RegisterGameParticipant($input: NewGameParticipant!) {\n  registerGameParticipant(input: $input) {\n    gameParticipant {\n      id\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation TalkDirect($input: NewDirectMessage!) {\n  registerDirectMessage(input: $input) {\n    ok\n  }\n}"): (typeof documents)["mutation TalkDirect($input: NewDirectMessage!) {\n  registerDirectMessage(input: $input) {\n    ok\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Talk($input: NewMessage!) {\n  registerMessage(input: $input) {\n    ok\n  }\n}"): (typeof documents)["mutation Talk($input: NewMessage!) {\n  registerMessage(input: $input) {\n    ok\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Unfollow($input: DeleteGameParticipantFollow!) {\n  deleteGameParticipantFollow(input: $input) {\n    ok\n  }\n}"): (typeof documents)["mutation Unfollow($input: DeleteGameParticipantFollow!) {\n  deleteGameParticipantFollow(input: $input) {\n    ok\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation UpdateParticipantGroup($input: UpdateGameParticipantGroup!) {\n  updateGameParticipantGroup(input: $input) {\n    ok\n  }\n}"): (typeof documents)["mutation UpdateParticipantGroup($input: UpdateGameParticipantGroup!) {\n  updateGameParticipantGroup(input: $input) {\n    ok\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation UpdateIcon($input: UpdateGameParticipantIcon!) {\n  updateGameParticipantIcon(input: $input) {\n    ok\n  }\n}"): (typeof documents)["mutation UpdateIcon($input: UpdateGameParticipantIcon!) {\n  updateGameParticipantIcon(input: $input) {\n    ok\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation UpdateGameParticipantProfile($input: UpdateGameParticipantProfile!) {\n  updateGameParticipantProfile(input: $input) {\n    ok\n  }\n}"): (typeof documents)["mutation UpdateGameParticipantProfile($input: UpdateGameParticipantProfile!) {\n  updateGameParticipantProfile(input: $input) {\n    ok\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation UploadIcon($input: NewGameParticipantIcon!) {\n  registerGameParticipantIcon(input: $input) {\n    gameParticipantIcon {\n      id\n    }\n  }\n}"): (typeof documents)["mutation UploadIcon($input: NewGameParticipantIcon!) {\n  registerGameParticipantIcon(input: $input) {\n    gameParticipantIcon {\n      id\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query DirectFavoriteParticipants($gameId: ID!, $directMessageId: ID!) {\n  directMessageFavoriteGameParticipants(\n    gameId: $gameId\n    directMessageId: $directMessageId\n  ) {\n    id\n    name\n    entryNumber\n    profileIcon {\n      id\n      url\n    }\n  }\n}"): (typeof documents)["query DirectFavoriteParticipants($gameId: ID!, $directMessageId: ID!) {\n  directMessageFavoriteGameParticipants(\n    gameId: $gameId\n    directMessageId: $directMessageId\n  ) {\n    id\n    name\n    entryNumber\n    profileIcon {\n      id\n      url\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GameDirectMessages($gameId: ID!, $query: DirectMessagesQuery!) {\n  directMessages(gameId: $gameId, query: $query) {\n    list {\n      id\n      content {\n        type\n        text\n        number\n        isConvertDisabled\n      }\n      time {\n        sendAt\n        sendUnixTimeMilli\n      }\n      sender {\n        participantId\n        name\n        icon {\n          url\n          width\n          height\n        }\n      }\n      reactions {\n        favoriteCounts\n        favoriteParticipantIds\n      }\n    }\n    allPageCount\n    hasPrePage\n    hasNextPage\n    currentPageNumber\n    isDesc\n  }\n}"): (typeof documents)["query GameDirectMessages($gameId: ID!, $query: DirectMessagesQuery!) {\n  directMessages(gameId: $gameId, query: $query) {\n    list {\n      id\n      content {\n        type\n        text\n        number\n        isConvertDisabled\n      }\n      time {\n        sendAt\n        sendUnixTimeMilli\n      }\n      sender {\n        participantId\n        name\n        icon {\n          url\n          width\n          height\n        }\n      }\n      reactions {\n        favoriteCounts\n        favoriteParticipantIds\n      }\n    }\n    allPageCount\n    hasPrePage\n    hasNextPage\n    currentPageNumber\n    isDesc\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Followers($participantId: ID!) {\n  gameParticipantFollowers(participantId: $participantId) {\n    id\n    name\n    profileIcon {\n      id\n      url\n    }\n  }\n}"): (typeof documents)["query Followers($participantId: ID!) {\n  gameParticipantFollowers(participantId: $participantId) {\n    id\n    name\n    profileIcon {\n      id\n      url\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Follows($participantId: ID!) {\n  gameParticipantFollows(participantId: $participantId) {\n    id\n    name\n    profileIcon {\n      id\n      url\n    }\n  }\n}"): (typeof documents)["query Follows($participantId: ID!) {\n  gameParticipantFollows(participantId: $participantId) {\n    id\n    name\n    profileIcon {\n      id\n      url\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GameMessages($gameId: ID!, $query: MessagesQuery!) {\n  messages(gameId: $gameId, query: $query) {\n    list {\n      id\n      content {\n        type\n        text\n        number\n        isConvertDisabled\n      }\n      time {\n        sendAt\n        sendUnixTimeMilli\n      }\n      sender {\n        participantId\n        name\n        icon {\n          url\n          width\n          height\n        }\n      }\n      replyTo {\n        messageId\n        participantId\n      }\n      reactions {\n        replyCount\n        favoriteCount\n        favoriteParticipantIds\n      }\n    }\n    allPageCount\n    hasPrePage\n    hasNextPage\n    currentPageNumber\n    isDesc\n  }\n}"): (typeof documents)["query GameMessages($gameId: ID!, $query: MessagesQuery!) {\n  messages(gameId: $gameId, query: $query) {\n    list {\n      id\n      content {\n        type\n        text\n        number\n        isConvertDisabled\n      }\n      time {\n        sendAt\n        sendUnixTimeMilli\n      }\n      sender {\n        participantId\n        name\n        icon {\n          url\n          width\n          height\n        }\n      }\n      replyTo {\n        messageId\n        participantId\n      }\n      reactions {\n        replyCount\n        favoriteCount\n        favoriteParticipantIds\n      }\n    }\n    allPageCount\n    hasPrePage\n    hasNextPage\n    currentPageNumber\n    isDesc\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query ParticipantGroups($gameId: ID!, $participantId: ID) {\n  gameParticipantGroups(\n    gameId: $gameId\n    query: {memberParticipantId: $participantId}\n  ) {\n    id\n    name\n    participants {\n      id\n      name\n      profileIcon {\n        id\n        url\n      }\n    }\n  }\n}"): (typeof documents)["query ParticipantGroups($gameId: ID!, $participantId: ID) {\n  gameParticipantGroups(\n    gameId: $gameId\n    query: {memberParticipantId: $participantId}\n  ) {\n    id\n    name\n    participants {\n      id\n      name\n      profileIcon {\n        id\n        url\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Icons($participantId: ID!) {\n  gameParticipantIcons(participantId: $participantId) {\n    id\n    url\n    width\n    height\n  }\n}"): (typeof documents)["query Icons($participantId: ID!) {\n  gameParticipantIcons(participantId: $participantId) {\n    id\n    url\n    width\n    height\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GameParticipantProfile($participantId: ID!) {\n  gameParticipantProfile(participantId: $participantId) {\n    participantId\n    name\n    profileImageUrl\n    introduction\n    followsCount\n    followersCount\n  }\n}"): (typeof documents)["query GameParticipantProfile($participantId: ID!) {\n  gameParticipantProfile(participantId: $participantId) {\n    participantId\n    name\n    profileImageUrl\n    introduction\n    followsCount\n    followersCount\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Game($id: ID!) {\n  game(id: $id) {\n    id\n    name\n    status\n    participants {\n      id\n      name\n      entryNumber\n      profileIcon {\n        id\n        url\n      }\n    }\n    periods {\n      id\n    }\n    settings {\n      chara {\n        canOriginalCharacter\n      }\n      capacity {\n        min\n        max\n      }\n      rule {\n        canShorten\n        canSendDirectMessage\n      }\n      time {\n        periodPrefix\n        periodSuffix\n        periodIntervalSeconds\n        openAt\n        startParticipateAt\n        startGameAt\n      }\n      password {\n        hasPassword\n      }\n    }\n  }\n}"): (typeof documents)["query Game($id: ID!) {\n  game(id: $id) {\n    id\n    name\n    status\n    participants {\n      id\n      name\n      entryNumber\n      profileIcon {\n        id\n        url\n      }\n    }\n    periods {\n      id\n    }\n    settings {\n      chara {\n        canOriginalCharacter\n      }\n      capacity {\n        min\n        max\n      }\n      rule {\n        canShorten\n        canSendDirectMessage\n      }\n      time {\n        periodPrefix\n        periodSuffix\n        periodIntervalSeconds\n        openAt\n        startParticipateAt\n        startGameAt\n      }\n      password {\n        hasPassword\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query FavoriteParticipants($gameId: ID!, $messageId: ID!) {\n  messageFavoriteGameParticipants(gameId: $gameId, messageId: $messageId) {\n    id\n    name\n    entryNumber\n    profileIcon {\n      id\n      url\n    }\n  }\n}"): (typeof documents)["query FavoriteParticipants($gameId: ID!, $messageId: ID!) {\n  messageFavoriteGameParticipants(gameId: $gameId, messageId: $messageId) {\n    id\n    name\n    entryNumber\n    profileIcon {\n      id\n      url\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query MessageReplies($gameId: ID!, $messageId: ID!) {\n  messageReplies(gameId: $gameId, messageId: $messageId) {\n    id\n    content {\n      type\n      text\n      number\n      isConvertDisabled\n    }\n    time {\n      sendAt\n      sendUnixTimeMilli\n    }\n    sender {\n      participantId\n      name\n      icon {\n        url\n        width\n        height\n      }\n    }\n    replyTo {\n      messageId\n      participantId\n    }\n    reactions {\n      replyCount\n      favoriteCount\n      favoriteParticipantIds\n    }\n  }\n}"): (typeof documents)["query MessageReplies($gameId: ID!, $messageId: ID!) {\n  messageReplies(gameId: $gameId, messageId: $messageId) {\n    id\n    content {\n      type\n      text\n      number\n      isConvertDisabled\n    }\n    time {\n      sendAt\n      sendUnixTimeMilli\n    }\n    sender {\n      participantId\n      name\n      icon {\n        url\n        width\n        height\n      }\n    }\n    replyTo {\n      messageId\n      participantId\n    }\n    reactions {\n      replyCount\n      favoriteCount\n      favoriteParticipantIds\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query MyGameParticipant($gameId: ID!) {\n  myGameParticipant(gameId: $gameId) {\n    id\n    name\n    entryNumber\n    player {\n      id\n    }\n    profileIcon {\n      id\n      url\n    }\n    followParticipantIds\n    followerParticipantIds\n  }\n}"): (typeof documents)["query MyGameParticipant($gameId: ID!) {\n  myGameParticipant(gameId: $gameId) {\n    id\n    name\n    entryNumber\n    player {\n      id\n    }\n    profileIcon {\n      id\n      url\n    }\n    followParticipantIds\n    followerParticipantIds\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query IndexGames($pageSize: Int!, $pageNumber: Int!) {\n    games(\n      query: {\n        paging: { pageSize: $pageSize, pageNumber: $pageNumber, isDesc: true }\n      }\n    ) {\n      id\n      name\n      participantsCount\n    }\n  }\n"): (typeof documents)["\n  query IndexGames($pageSize: Int!, $pageNumber: Int!) {\n    games(\n      query: {\n        paging: { pageSize: $pageSize, pageNumber: $pageNumber, isDesc: true }\n      }\n    ) {\n      id\n      name\n      participantsCount\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;