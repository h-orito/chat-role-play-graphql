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
    "mutation ChangePeriod($input: ChangePeriod!) {\n  changePeriodIfNeeded(input: $input) {\n    ok\n  }\n}": types.ChangePeriodDocument,
    "mutation DeleteGameMaster($input: DeleteGameMaster!) {\n  deleteGameMaster(input: $input) {\n    ok\n  }\n}": types.DeleteGameMasterDocument,
    "mutation DeleteParticipantIcon($input: DeleteGameParticipantIcon!) {\n  deleteGameParticipantIcon(input: $input) {\n    ok\n  }\n}": types.DeleteParticipantIconDocument,
    "mutation FavoriteDirect($input: NewDirectMessageFavorite!) {\n  registerDirectMessageFavorite(input: $input) {\n    ok\n  }\n}": types.FavoriteDirectDocument,
    "mutation UnfavoriteDirect($input: DeleteDirectMessageFavorite!) {\n  deleteDirectMessageFavorite(input: $input) {\n    ok\n  }\n}": types.UnfavoriteDirectDocument,
    "mutation Follow($input: NewGameParticipantFollow!) {\n  registerGameParticipantFollow(input: $input) {\n    ok\n  }\n}": types.FollowDocument,
    "mutation Favorite($input: NewMessageFavorite!) {\n  registerMessageFavorite(input: $input) {\n    ok\n  }\n}": types.FavoriteDocument,
    "mutation Unfavorite($input: DeleteMessageFavorite!) {\n  deleteMessageFavorite(input: $input) {\n    ok\n  }\n}": types.UnfavoriteDocument,
    "mutation RegisterGameMaster($input: NewGameMaster!) {\n  registerGameMaster(input: $input) {\n    gameMaster {\n      id\n      player {\n        id\n        name\n      }\n    }\n  }\n}": types.RegisterGameMasterDocument,
    "mutation RegisterParticipantGroup($input: NewGameParticipantGroup!) {\n  registerGameParticipantGroup(input: $input) {\n    gameParticipantGroup {\n      id\n      name\n      participants {\n        id\n        name\n      }\n    }\n  }\n}": types.RegisterParticipantGroupDocument,
    "mutation RegisterGameParticipant($input: NewGameParticipant!) {\n  registerGameParticipant(input: $input) {\n    gameParticipant {\n      id\n    }\n  }\n}": types.RegisterGameParticipantDocument,
    "mutation RegisterGame($input: NewGame!) {\n  registerGame(input: $input) {\n    game {\n      id\n    }\n  }\n}": types.RegisterGameDocument,
    "mutation TalkDirectDryRun($input: NewDirectMessage!) {\n  registerDirectMessageDryRun(input: $input) {\n    directMessage {\n      id\n      content {\n        type\n        text\n        number\n        isConvertDisabled\n      }\n      time {\n        sendAt\n        sendUnixTimeMilli\n      }\n      sender {\n        participantId\n        name\n        icon {\n          url\n          width\n          height\n        }\n      }\n      reactions {\n        favoriteCounts\n        favoriteParticipantIds\n      }\n    }\n  }\n}": types.TalkDirectDryRunDocument,
    "mutation TalkDirect($input: NewDirectMessage!) {\n  registerDirectMessage(input: $input) {\n    ok\n  }\n}": types.TalkDirectDocument,
    "mutation TalkDryRun($input: NewMessage!) {\n  registerMessageDryRun(input: $input) {\n    message {\n      id\n      content {\n        type\n        text\n        number\n        isConvertDisabled\n      }\n      time {\n        sendAt\n        sendUnixTimeMilli\n      }\n      sender {\n        participantId\n        name\n        icon {\n          url\n          width\n          height\n        }\n      }\n      replyTo {\n        messageId\n        participantId\n      }\n      reactions {\n        replyCount\n        favoriteCount\n        favoriteParticipantIds\n      }\n    }\n  }\n}": types.TalkDryRunDocument,
    "mutation Talk($input: NewMessage!) {\n  registerMessage(input: $input) {\n    ok\n  }\n}": types.TalkDocument,
    "mutation Unfollow($input: DeleteGameParticipantFollow!) {\n  deleteGameParticipantFollow(input: $input) {\n    ok\n  }\n}": types.UnfollowDocument,
    "mutation UpdateParticipantGroup($input: UpdateGameParticipantGroup!) {\n  updateGameParticipantGroup(input: $input) {\n    ok\n  }\n}": types.UpdateParticipantGroupDocument,
    "mutation UpdateIcon($input: UpdateGameParticipantIcon!) {\n  updateGameParticipantIcon(input: $input) {\n    ok\n  }\n}": types.UpdateIconDocument,
    "mutation UpdateGameParticipantProfile($input: UpdateGameParticipantProfile!) {\n  updateGameParticipantProfile(input: $input) {\n    ok\n  }\n}": types.UpdateGameParticipantProfileDocument,
    "mutation UpdateGameSettings($input: UpdateGameSetting!) {\n  updateGameSetting(input: $input) {\n    ok\n  }\n}": types.UpdateGameSettingsDocument,
    "mutation UpdatePlayerProfile($name: String!, $introduction: String) {\n  updatePlayerProfile(input: {name: $name, introduction: $introduction}) {\n    ok\n  }\n}": types.UpdatePlayerProfileDocument,
    "mutation UploadIcon($input: NewGameParticipantIcon!) {\n  registerGameParticipantIcon(input: $input) {\n    gameParticipantIcon {\n      id\n    }\n  }\n}": types.UploadIconDocument,
    "query DirectFavoriteParticipants($gameId: ID!, $directMessageId: ID!) {\n  directMessageFavoriteGameParticipants(\n    gameId: $gameId\n    directMessageId: $directMessageId\n  ) {\n    id\n    name\n    entryNumber\n    profileIcon {\n      id\n      url\n    }\n  }\n}": types.DirectFavoriteParticipantsDocument,
    "query DirectMessagesLatest($gameId: ID!, $query: DirectMessagesQuery!) {\n  directMessagesLatestUnixTimeMilli(gameId: $gameId, query: $query)\n}": types.DirectMessagesLatestDocument,
    "query GameDirectMessages($gameId: ID!, $query: DirectMessagesQuery!) {\n  directMessages(gameId: $gameId, query: $query) {\n    list {\n      id\n      content {\n        type\n        text\n        number\n        isConvertDisabled\n      }\n      time {\n        sendAt\n        sendUnixTimeMilli\n      }\n      sender {\n        participantId\n        name\n        icon {\n          url\n          width\n          height\n        }\n      }\n      reactions {\n        favoriteCounts\n        favoriteParticipantIds\n      }\n    }\n    allPageCount\n    hasPrePage\n    hasNextPage\n    currentPageNumber\n    isDesc\n    latestUnixTimeMilli\n  }\n}": types.GameDirectMessagesDocument,
    "query Followers($participantId: ID!) {\n  gameParticipantFollowers(participantId: $participantId) {\n    id\n    name\n    entryNumber\n    profileIcon {\n      id\n      url\n    }\n  }\n}": types.FollowersDocument,
    "query Follows($participantId: ID!) {\n  gameParticipantFollows(participantId: $participantId) {\n    id\n    name\n    entryNumber\n    profileIcon {\n      id\n      url\n    }\n  }\n}": types.FollowsDocument,
    "query MessagesLatest($gameId: ID!, $query: MessagesQuery!) {\n  messagesLatestUnixTimeMilli(gameId: $gameId, query: $query)\n}": types.MessagesLatestDocument,
    "query GameMessages($gameId: ID!, $query: MessagesQuery!) {\n  messages(gameId: $gameId, query: $query) {\n    list {\n      id\n      content {\n        type\n        text\n        number\n        isConvertDisabled\n      }\n      time {\n        sendAt\n        sendUnixTimeMilli\n      }\n      sender {\n        participantId\n        name\n        icon {\n          url\n          width\n          height\n        }\n      }\n      replyTo {\n        messageId\n        participantId\n      }\n      reactions {\n        replyCount\n        favoriteCount\n        favoriteParticipantIds\n      }\n    }\n    allPageCount\n    hasPrePage\n    hasNextPage\n    currentPageNumber\n    isDesc\n    latestUnixTimeMilli\n  }\n}": types.GameMessagesDocument,
    "query ParticipantGroups($gameId: ID!, $participantId: ID) {\n  gameParticipantGroups(\n    gameId: $gameId\n    query: {memberParticipantId: $participantId}\n  ) {\n    id\n    name\n    participants {\n      id\n      name\n      profileIcon {\n        id\n        url\n      }\n    }\n    latestUnixTimeMilli\n  }\n}": types.ParticipantGroupsDocument,
    "query Icons($participantId: ID!) {\n  gameParticipantIcons(participantId: $participantId) {\n    id\n    url\n    width\n    height\n    displayOrder\n  }\n}": types.IconsDocument,
    "query GameParticipantProfile($participantId: ID!) {\n  gameParticipantProfile(participantId: $participantId) {\n    participantId\n    name\n    profileImageUrl\n    introduction\n    followsCount\n    followersCount\n  }\n}": types.GameParticipantProfileDocument,
    "query Game($id: ID!) {\n  game(id: $id) {\n    id\n    name\n    status\n    gameMasters {\n      id\n      player {\n        id\n        name\n      }\n    }\n    participants {\n      id\n      name\n      entryNumber\n      profileIcon {\n        id\n        url\n      }\n    }\n    periods {\n      id\n    }\n    settings {\n      chara {\n        charachips {\n          name\n        }\n        canOriginalCharacter\n      }\n      capacity {\n        min\n        max\n      }\n      rule {\n        canShorten\n        canSendDirectMessage\n      }\n      time {\n        periodPrefix\n        periodSuffix\n        periodIntervalSeconds\n        openAt\n        startParticipateAt\n        startGameAt\n        finishGameAt\n      }\n      password {\n        hasPassword\n      }\n    }\n  }\n}": types.GameDocument,
    "query IndexGames($pageSize: Int!, $pageNumber: Int!, $statuses: [GameStatus!]) {\n  games(\n    query: {statuses: $statuses, paging: {pageSize: $pageSize, pageNumber: $pageNumber, isDesc: true}}\n  ) {\n    id\n    name\n    status\n    participantsCount\n    periods {\n      id\n      name\n      startAt\n      endAt\n    }\n    settings {\n      chara {\n        charachips {\n          name\n        }\n        canOriginalCharacter\n      }\n      capacity {\n        min\n        max\n      }\n      rule {\n        canShorten\n        canSendDirectMessage\n      }\n      time {\n        periodPrefix\n        periodSuffix\n        periodIntervalSeconds\n        openAt\n        startParticipateAt\n        startGameAt\n      }\n      password {\n        hasPassword\n      }\n    }\n  }\n}": types.IndexGamesDocument,
    "query FavoriteParticipants($gameId: ID!, $messageId: ID!) {\n  messageFavoriteGameParticipants(gameId: $gameId, messageId: $messageId) {\n    id\n    name\n    entryNumber\n    profileIcon {\n      id\n      url\n    }\n  }\n}": types.FavoriteParticipantsDocument,
    "query MessageReplies($gameId: ID!, $messageId: ID!) {\n  messageReplies(gameId: $gameId, messageId: $messageId) {\n    id\n    content {\n      type\n      text\n      number\n      isConvertDisabled\n    }\n    time {\n      sendAt\n      sendUnixTimeMilli\n    }\n    sender {\n      participantId\n      name\n      icon {\n        url\n        width\n        height\n      }\n    }\n    replyTo {\n      messageId\n      participantId\n    }\n    reactions {\n      replyCount\n      favoriteCount\n      favoriteParticipantIds\n    }\n  }\n}": types.MessageRepliesDocument,
    "query MyGameParticipant($gameId: ID!) {\n  myGameParticipant(gameId: $gameId) {\n    id\n    name\n    entryNumber\n    player {\n      id\n    }\n    profileIcon {\n      id\n      url\n    }\n    followParticipantIds\n    followerParticipantIds\n  }\n}": types.MyGameParticipantDocument,
    "query MyPlayer {\n  myPlayer {\n    id\n    name\n    profile {\n      introduction\n    }\n  }\n}": types.MyPlayerDocument,
    "query Player($id: ID!) {\n  player(id: $id) {\n    id\n    name\n    profile {\n      introduction\n    }\n  }\n}": types.PlayerDocument,
    "query QPlayers($query: PlayersQuery!) {\n  players(query: $query) {\n    id\n    name\n  }\n}": types.QPlayersDocument,
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
export function graphql(source: "mutation ChangePeriod($input: ChangePeriod!) {\n  changePeriodIfNeeded(input: $input) {\n    ok\n  }\n}"): (typeof documents)["mutation ChangePeriod($input: ChangePeriod!) {\n  changePeriodIfNeeded(input: $input) {\n    ok\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation DeleteGameMaster($input: DeleteGameMaster!) {\n  deleteGameMaster(input: $input) {\n    ok\n  }\n}"): (typeof documents)["mutation DeleteGameMaster($input: DeleteGameMaster!) {\n  deleteGameMaster(input: $input) {\n    ok\n  }\n}"];
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
export function graphql(source: "mutation RegisterGameMaster($input: NewGameMaster!) {\n  registerGameMaster(input: $input) {\n    gameMaster {\n      id\n      player {\n        id\n        name\n      }\n    }\n  }\n}"): (typeof documents)["mutation RegisterGameMaster($input: NewGameMaster!) {\n  registerGameMaster(input: $input) {\n    gameMaster {\n      id\n      player {\n        id\n        name\n      }\n    }\n  }\n}"];
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
export function graphql(source: "mutation RegisterGame($input: NewGame!) {\n  registerGame(input: $input) {\n    game {\n      id\n    }\n  }\n}"): (typeof documents)["mutation RegisterGame($input: NewGame!) {\n  registerGame(input: $input) {\n    game {\n      id\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation TalkDirectDryRun($input: NewDirectMessage!) {\n  registerDirectMessageDryRun(input: $input) {\n    directMessage {\n      id\n      content {\n        type\n        text\n        number\n        isConvertDisabled\n      }\n      time {\n        sendAt\n        sendUnixTimeMilli\n      }\n      sender {\n        participantId\n        name\n        icon {\n          url\n          width\n          height\n        }\n      }\n      reactions {\n        favoriteCounts\n        favoriteParticipantIds\n      }\n    }\n  }\n}"): (typeof documents)["mutation TalkDirectDryRun($input: NewDirectMessage!) {\n  registerDirectMessageDryRun(input: $input) {\n    directMessage {\n      id\n      content {\n        type\n        text\n        number\n        isConvertDisabled\n      }\n      time {\n        sendAt\n        sendUnixTimeMilli\n      }\n      sender {\n        participantId\n        name\n        icon {\n          url\n          width\n          height\n        }\n      }\n      reactions {\n        favoriteCounts\n        favoriteParticipantIds\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation TalkDirect($input: NewDirectMessage!) {\n  registerDirectMessage(input: $input) {\n    ok\n  }\n}"): (typeof documents)["mutation TalkDirect($input: NewDirectMessage!) {\n  registerDirectMessage(input: $input) {\n    ok\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation TalkDryRun($input: NewMessage!) {\n  registerMessageDryRun(input: $input) {\n    message {\n      id\n      content {\n        type\n        text\n        number\n        isConvertDisabled\n      }\n      time {\n        sendAt\n        sendUnixTimeMilli\n      }\n      sender {\n        participantId\n        name\n        icon {\n          url\n          width\n          height\n        }\n      }\n      replyTo {\n        messageId\n        participantId\n      }\n      reactions {\n        replyCount\n        favoriteCount\n        favoriteParticipantIds\n      }\n    }\n  }\n}"): (typeof documents)["mutation TalkDryRun($input: NewMessage!) {\n  registerMessageDryRun(input: $input) {\n    message {\n      id\n      content {\n        type\n        text\n        number\n        isConvertDisabled\n      }\n      time {\n        sendAt\n        sendUnixTimeMilli\n      }\n      sender {\n        participantId\n        name\n        icon {\n          url\n          width\n          height\n        }\n      }\n      replyTo {\n        messageId\n        participantId\n      }\n      reactions {\n        replyCount\n        favoriteCount\n        favoriteParticipantIds\n      }\n    }\n  }\n}"];
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
export function graphql(source: "mutation UpdateGameSettings($input: UpdateGameSetting!) {\n  updateGameSetting(input: $input) {\n    ok\n  }\n}"): (typeof documents)["mutation UpdateGameSettings($input: UpdateGameSetting!) {\n  updateGameSetting(input: $input) {\n    ok\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation UpdatePlayerProfile($name: String!, $introduction: String) {\n  updatePlayerProfile(input: {name: $name, introduction: $introduction}) {\n    ok\n  }\n}"): (typeof documents)["mutation UpdatePlayerProfile($name: String!, $introduction: String) {\n  updatePlayerProfile(input: {name: $name, introduction: $introduction}) {\n    ok\n  }\n}"];
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
export function graphql(source: "query DirectMessagesLatest($gameId: ID!, $query: DirectMessagesQuery!) {\n  directMessagesLatestUnixTimeMilli(gameId: $gameId, query: $query)\n}"): (typeof documents)["query DirectMessagesLatest($gameId: ID!, $query: DirectMessagesQuery!) {\n  directMessagesLatestUnixTimeMilli(gameId: $gameId, query: $query)\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GameDirectMessages($gameId: ID!, $query: DirectMessagesQuery!) {\n  directMessages(gameId: $gameId, query: $query) {\n    list {\n      id\n      content {\n        type\n        text\n        number\n        isConvertDisabled\n      }\n      time {\n        sendAt\n        sendUnixTimeMilli\n      }\n      sender {\n        participantId\n        name\n        icon {\n          url\n          width\n          height\n        }\n      }\n      reactions {\n        favoriteCounts\n        favoriteParticipantIds\n      }\n    }\n    allPageCount\n    hasPrePage\n    hasNextPage\n    currentPageNumber\n    isDesc\n    latestUnixTimeMilli\n  }\n}"): (typeof documents)["query GameDirectMessages($gameId: ID!, $query: DirectMessagesQuery!) {\n  directMessages(gameId: $gameId, query: $query) {\n    list {\n      id\n      content {\n        type\n        text\n        number\n        isConvertDisabled\n      }\n      time {\n        sendAt\n        sendUnixTimeMilli\n      }\n      sender {\n        participantId\n        name\n        icon {\n          url\n          width\n          height\n        }\n      }\n      reactions {\n        favoriteCounts\n        favoriteParticipantIds\n      }\n    }\n    allPageCount\n    hasPrePage\n    hasNextPage\n    currentPageNumber\n    isDesc\n    latestUnixTimeMilli\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Followers($participantId: ID!) {\n  gameParticipantFollowers(participantId: $participantId) {\n    id\n    name\n    entryNumber\n    profileIcon {\n      id\n      url\n    }\n  }\n}"): (typeof documents)["query Followers($participantId: ID!) {\n  gameParticipantFollowers(participantId: $participantId) {\n    id\n    name\n    entryNumber\n    profileIcon {\n      id\n      url\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Follows($participantId: ID!) {\n  gameParticipantFollows(participantId: $participantId) {\n    id\n    name\n    entryNumber\n    profileIcon {\n      id\n      url\n    }\n  }\n}"): (typeof documents)["query Follows($participantId: ID!) {\n  gameParticipantFollows(participantId: $participantId) {\n    id\n    name\n    entryNumber\n    profileIcon {\n      id\n      url\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query MessagesLatest($gameId: ID!, $query: MessagesQuery!) {\n  messagesLatestUnixTimeMilli(gameId: $gameId, query: $query)\n}"): (typeof documents)["query MessagesLatest($gameId: ID!, $query: MessagesQuery!) {\n  messagesLatestUnixTimeMilli(gameId: $gameId, query: $query)\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GameMessages($gameId: ID!, $query: MessagesQuery!) {\n  messages(gameId: $gameId, query: $query) {\n    list {\n      id\n      content {\n        type\n        text\n        number\n        isConvertDisabled\n      }\n      time {\n        sendAt\n        sendUnixTimeMilli\n      }\n      sender {\n        participantId\n        name\n        icon {\n          url\n          width\n          height\n        }\n      }\n      replyTo {\n        messageId\n        participantId\n      }\n      reactions {\n        replyCount\n        favoriteCount\n        favoriteParticipantIds\n      }\n    }\n    allPageCount\n    hasPrePage\n    hasNextPage\n    currentPageNumber\n    isDesc\n    latestUnixTimeMilli\n  }\n}"): (typeof documents)["query GameMessages($gameId: ID!, $query: MessagesQuery!) {\n  messages(gameId: $gameId, query: $query) {\n    list {\n      id\n      content {\n        type\n        text\n        number\n        isConvertDisabled\n      }\n      time {\n        sendAt\n        sendUnixTimeMilli\n      }\n      sender {\n        participantId\n        name\n        icon {\n          url\n          width\n          height\n        }\n      }\n      replyTo {\n        messageId\n        participantId\n      }\n      reactions {\n        replyCount\n        favoriteCount\n        favoriteParticipantIds\n      }\n    }\n    allPageCount\n    hasPrePage\n    hasNextPage\n    currentPageNumber\n    isDesc\n    latestUnixTimeMilli\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query ParticipantGroups($gameId: ID!, $participantId: ID) {\n  gameParticipantGroups(\n    gameId: $gameId\n    query: {memberParticipantId: $participantId}\n  ) {\n    id\n    name\n    participants {\n      id\n      name\n      profileIcon {\n        id\n        url\n      }\n    }\n    latestUnixTimeMilli\n  }\n}"): (typeof documents)["query ParticipantGroups($gameId: ID!, $participantId: ID) {\n  gameParticipantGroups(\n    gameId: $gameId\n    query: {memberParticipantId: $participantId}\n  ) {\n    id\n    name\n    participants {\n      id\n      name\n      profileIcon {\n        id\n        url\n      }\n    }\n    latestUnixTimeMilli\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Icons($participantId: ID!) {\n  gameParticipantIcons(participantId: $participantId) {\n    id\n    url\n    width\n    height\n    displayOrder\n  }\n}"): (typeof documents)["query Icons($participantId: ID!) {\n  gameParticipantIcons(participantId: $participantId) {\n    id\n    url\n    width\n    height\n    displayOrder\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GameParticipantProfile($participantId: ID!) {\n  gameParticipantProfile(participantId: $participantId) {\n    participantId\n    name\n    profileImageUrl\n    introduction\n    followsCount\n    followersCount\n  }\n}"): (typeof documents)["query GameParticipantProfile($participantId: ID!) {\n  gameParticipantProfile(participantId: $participantId) {\n    participantId\n    name\n    profileImageUrl\n    introduction\n    followsCount\n    followersCount\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Game($id: ID!) {\n  game(id: $id) {\n    id\n    name\n    status\n    gameMasters {\n      id\n      player {\n        id\n        name\n      }\n    }\n    participants {\n      id\n      name\n      entryNumber\n      profileIcon {\n        id\n        url\n      }\n    }\n    periods {\n      id\n    }\n    settings {\n      chara {\n        charachips {\n          name\n        }\n        canOriginalCharacter\n      }\n      capacity {\n        min\n        max\n      }\n      rule {\n        canShorten\n        canSendDirectMessage\n      }\n      time {\n        periodPrefix\n        periodSuffix\n        periodIntervalSeconds\n        openAt\n        startParticipateAt\n        startGameAt\n        finishGameAt\n      }\n      password {\n        hasPassword\n      }\n    }\n  }\n}"): (typeof documents)["query Game($id: ID!) {\n  game(id: $id) {\n    id\n    name\n    status\n    gameMasters {\n      id\n      player {\n        id\n        name\n      }\n    }\n    participants {\n      id\n      name\n      entryNumber\n      profileIcon {\n        id\n        url\n      }\n    }\n    periods {\n      id\n    }\n    settings {\n      chara {\n        charachips {\n          name\n        }\n        canOriginalCharacter\n      }\n      capacity {\n        min\n        max\n      }\n      rule {\n        canShorten\n        canSendDirectMessage\n      }\n      time {\n        periodPrefix\n        periodSuffix\n        periodIntervalSeconds\n        openAt\n        startParticipateAt\n        startGameAt\n        finishGameAt\n      }\n      password {\n        hasPassword\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query IndexGames($pageSize: Int!, $pageNumber: Int!, $statuses: [GameStatus!]) {\n  games(\n    query: {statuses: $statuses, paging: {pageSize: $pageSize, pageNumber: $pageNumber, isDesc: true}}\n  ) {\n    id\n    name\n    status\n    participantsCount\n    periods {\n      id\n      name\n      startAt\n      endAt\n    }\n    settings {\n      chara {\n        charachips {\n          name\n        }\n        canOriginalCharacter\n      }\n      capacity {\n        min\n        max\n      }\n      rule {\n        canShorten\n        canSendDirectMessage\n      }\n      time {\n        periodPrefix\n        periodSuffix\n        periodIntervalSeconds\n        openAt\n        startParticipateAt\n        startGameAt\n      }\n      password {\n        hasPassword\n      }\n    }\n  }\n}"): (typeof documents)["query IndexGames($pageSize: Int!, $pageNumber: Int!, $statuses: [GameStatus!]) {\n  games(\n    query: {statuses: $statuses, paging: {pageSize: $pageSize, pageNumber: $pageNumber, isDesc: true}}\n  ) {\n    id\n    name\n    status\n    participantsCount\n    periods {\n      id\n      name\n      startAt\n      endAt\n    }\n    settings {\n      chara {\n        charachips {\n          name\n        }\n        canOriginalCharacter\n      }\n      capacity {\n        min\n        max\n      }\n      rule {\n        canShorten\n        canSendDirectMessage\n      }\n      time {\n        periodPrefix\n        periodSuffix\n        periodIntervalSeconds\n        openAt\n        startParticipateAt\n        startGameAt\n      }\n      password {\n        hasPassword\n      }\n    }\n  }\n}"];
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
export function graphql(source: "query MyPlayer {\n  myPlayer {\n    id\n    name\n    profile {\n      introduction\n    }\n  }\n}"): (typeof documents)["query MyPlayer {\n  myPlayer {\n    id\n    name\n    profile {\n      introduction\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Player($id: ID!) {\n  player(id: $id) {\n    id\n    name\n    profile {\n      introduction\n    }\n  }\n}"): (typeof documents)["query Player($id: ID!) {\n  player(id: $id) {\n    id\n    name\n    profile {\n      introduction\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query QPlayers($query: PlayersQuery!) {\n  players(query: $query) {\n    id\n    name\n  }\n}"): (typeof documents)["query QPlayers($query: PlayersQuery!) {\n  players(query: $query) {\n    id\n    name\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;