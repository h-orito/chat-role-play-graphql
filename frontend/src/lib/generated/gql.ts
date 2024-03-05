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
    "mutation Leave($input: DeleteGameParticipant!) {\n  deleteGameParticipant(input: $input) {\n    ok\n  }\n}": types.LeaveDocument,
    "mutation DeletePeriod($input: DeleteGamePeriod!) {\n  deleteGamePeriod(input: $input) {\n    ok\n  }\n}": types.DeletePeriodDocument,
    "mutation DeleteParticipantIcon($input: DeleteGameParticipantIcon!) {\n  deleteGameParticipantIcon(input: $input) {\n    ok\n  }\n}": types.DeleteParticipantIconDocument,
    "mutation FavoriteDirect($input: NewDirectMessageFavorite!) {\n  registerDirectMessageFavorite(input: $input) {\n    ok\n  }\n}": types.FavoriteDirectDocument,
    "mutation UnfavoriteDirect($input: DeleteDirectMessageFavorite!) {\n  deleteDirectMessageFavorite(input: $input) {\n    ok\n  }\n}": types.UnfavoriteDirectDocument,
    "mutation Follow($input: NewGameParticipantFollow!) {\n  registerGameParticipantFollow(input: $input) {\n    ok\n  }\n}": types.FollowDocument,
    "mutation Favorite($input: NewMessageFavorite!) {\n  registerMessageFavorite(input: $input) {\n    ok\n  }\n}": types.FavoriteDocument,
    "mutation Unfavorite($input: DeleteMessageFavorite!) {\n  deleteMessageFavorite(input: $input) {\n    ok\n  }\n}": types.UnfavoriteDocument,
    "mutation DebugMessages($input: RegisterDebugMessages!) {\n  registerDebugMessages(input: $input) {\n    ok\n  }\n}": types.DebugMessagesDocument,
    "mutation RegisterGameMaster($input: NewGameMaster!) {\n  registerGameMaster(input: $input) {\n    gameMaster {\n      id\n      player {\n        id\n        name\n      }\n    }\n  }\n}": types.RegisterGameMasterDocument,
    "mutation RegisterParticipantGroup($input: NewGameParticipantGroup!) {\n  registerGameParticipantGroup(input: $input) {\n    gameParticipantGroup {\n      id\n      name\n      participants {\n        id\n        name\n      }\n    }\n  }\n}": types.RegisterParticipantGroupDocument,
    "mutation RegisterGameParticipant($input: NewGameParticipant!) {\n  registerGameParticipant(input: $input) {\n    gameParticipant {\n      id\n    }\n  }\n}": types.RegisterGameParticipantDocument,
    "mutation RegisterGame($input: NewGame!) {\n  registerGame(input: $input) {\n    game {\n      id\n    }\n  }\n}": types.RegisterGameDocument,
    "mutation TalkDirectDryRun($input: NewDirectMessage!) {\n  registerDirectMessageDryRun(input: $input) {\n    directMessage {\n      id\n      content {\n        type\n        text\n        number\n        isConvertDisabled\n      }\n      time {\n        sendAt\n        sendUnixTimeMilli\n      }\n      sender {\n        participantId\n        name\n        icon {\n          url\n          width\n          height\n        }\n      }\n      reactions {\n        favoriteCounts\n        favoriteParticipantIds\n      }\n    }\n  }\n}": types.TalkDirectDryRunDocument,
    "mutation TalkDirect($input: NewDirectMessage!) {\n  registerDirectMessage(input: $input) {\n    ok\n  }\n}": types.TalkDirectDocument,
    "mutation TalkDryRun($input: NewMessage!) {\n  registerMessageDryRun(input: $input) {\n    message {\n      id\n      content {\n        type\n        text\n        number\n        isConvertDisabled\n      }\n      time {\n        sendAt\n        sendUnixTimeMilli\n      }\n      sender {\n        participantId\n        name\n        icon {\n          url\n          width\n          height\n        }\n      }\n      receiver {\n        participantId\n        name\n        entryNumber\n      }\n      replyTo {\n        messageId\n        participantId\n      }\n      reactions {\n        replyCount\n        favoriteCount\n        favoriteParticipantIds\n      }\n    }\n  }\n}": types.TalkDryRunDocument,
    "mutation Talk($input: NewMessage!) {\n  registerMessage(input: $input) {\n    ok\n  }\n}": types.TalkDocument,
    "mutation Unfollow($input: DeleteGameParticipantFollow!) {\n  deleteGameParticipantFollow(input: $input) {\n    ok\n  }\n}": types.UnfollowDocument,
    "mutation UpdateParticipantGroup($input: UpdateGameParticipantGroup!) {\n  updateGameParticipantGroup(input: $input) {\n    ok\n  }\n}": types.UpdateParticipantGroupDocument,
    "mutation UpdateIcon($input: UpdateGameParticipantIcon!) {\n  updateGameParticipantIcon(input: $input) {\n    ok\n  }\n}": types.UpdateIconDocument,
    "mutation UpdateGameParticipantProfile($input: UpdateGameParticipantProfile!) {\n  updateGameParticipantProfile(input: $input) {\n    ok\n  }\n}": types.UpdateGameParticipantProfileDocument,
    "mutation UpdateGameParticipantSetting($input: UpdateGameParticipantSetting!) {\n  updateGameParticipantSetting(input: $input) {\n    ok\n  }\n}": types.UpdateGameParticipantSettingDocument,
    "mutation UpdatePeriod($input: UpdateGamePeriod!) {\n  updateGamePeriod(input: $input) {\n    ok\n  }\n}": types.UpdatePeriodDocument,
    "mutation UpdateGameSettings($input: UpdateGameSetting!) {\n  updateGameSetting(input: $input) {\n    ok\n  }\n}": types.UpdateGameSettingsDocument,
    "mutation UpdateStatus($input: UpdateGameStatus!) {\n  updateGameStatus(input: $input) {\n    ok\n  }\n}": types.UpdateStatusDocument,
    "mutation UpdatePlayerProfile($name: String!, $introduction: String) {\n  updatePlayerProfile(input: {name: $name, introduction: $introduction}) {\n    ok\n  }\n}": types.UpdatePlayerProfileDocument,
    "mutation UploadIcon($input: NewGameParticipantIcon!) {\n  registerGameParticipantIcon(input: $input) {\n    gameParticipantIcon {\n      id\n    }\n  }\n}": types.UploadIconDocument,
    "mutation UploadIcons($input: NewGameParticipantIcons!) {\n  registerGameParticipantIcons(input: $input) {\n    gameParticipantIcons {\n      id\n    }\n  }\n}": types.UploadIconsDocument,
    "query CharachipDetail($id: ID!) {\n  charachip(id: $id) {\n    id\n    name\n    descriptionUrl\n    canChangeName\n    designer {\n      name\n    }\n    charas {\n      id\n      name\n      size {\n        width\n        height\n      }\n      images {\n        type\n        url\n      }\n    }\n  }\n}": types.CharachipDetailDocument,
    "query CharachipDetails($query: CharachipsQuery!) {\n  charachips(query: $query) {\n    id\n    name\n    designer {\n      name\n    }\n    charas {\n      id\n      name\n      size {\n        width\n        height\n      }\n      images {\n        type\n        url\n      }\n    }\n  }\n}": types.CharachipDetailsDocument,
    "query DirectFavoriteParticipants($gameId: ID!, $directMessageId: ID!) {\n  directMessageFavoriteGameParticipants(\n    gameId: $gameId\n    directMessageId: $directMessageId\n  ) {\n    id\n    name\n    entryNumber\n    profileIcon {\n      id\n      url\n    }\n  }\n}": types.DirectFavoriteParticipantsDocument,
    "query DirectMessagesLatest($gameId: ID!, $query: DirectMessagesQuery!) {\n  directMessagesLatestUnixTimeMilli(gameId: $gameId, query: $query)\n}": types.DirectMessagesLatestDocument,
    "query GameDirectMessages($gameId: ID!, $query: DirectMessagesQuery!) {\n  directMessages(gameId: $gameId, query: $query) {\n    list {\n      id\n      content {\n        type\n        text\n        number\n        isConvertDisabled\n      }\n      time {\n        sendAt\n        sendUnixTimeMilli\n      }\n      sender {\n        participantId\n        name\n        entryNumber\n        icon {\n          url\n          width\n          height\n        }\n      }\n      reactions {\n        favoriteCounts\n        favoriteParticipantIds\n      }\n    }\n    allPageCount\n    hasPrePage\n    hasNextPage\n    currentPageNumber\n    isDesc\n    latestUnixTimeMilli\n  }\n}": types.GameDirectMessagesDocument,
    "query Followers($participantId: ID!) {\n  gameParticipantFollowers(participantId: $participantId) {\n    id\n    name\n    entryNumber\n    profileIcon {\n      id\n      url\n    }\n  }\n}": types.FollowersDocument,
    "query Follows($participantId: ID!) {\n  gameParticipantFollows(participantId: $participantId) {\n    id\n    name\n    entryNumber\n    profileIcon {\n      id\n      url\n    }\n  }\n}": types.FollowsDocument,
    "query GameMessage($gameId: ID!, $messageId: ID!) {\n  message(gameId: $gameId, messageId: $messageId) {\n    id\n    content {\n      type\n      text\n      number\n      isConvertDisabled\n    }\n    time {\n      sendAt\n      sendUnixTimeMilli\n    }\n    sender {\n      participantId\n      name\n      entryNumber\n      icon {\n        url\n        width\n        height\n      }\n    }\n    receiver {\n      participantId\n      name\n      entryNumber\n    }\n    replyTo {\n      messageId\n      participantId\n    }\n    reactions {\n      replyCount\n      favoriteCount\n      favoriteParticipantIds\n    }\n  }\n}": types.GameMessageDocument,
    "query MessagesLatest($gameId: ID!, $query: MessagesQuery!) {\n  messagesLatestUnixTimeMilli(gameId: $gameId, query: $query)\n}": types.MessagesLatestDocument,
    "query GameMessages($gameId: ID!, $query: MessagesQuery!) {\n  messages(gameId: $gameId, query: $query) {\n    list {\n      id\n      content {\n        type\n        text\n        number\n        isConvertDisabled\n      }\n      time {\n        sendAt\n        sendUnixTimeMilli\n      }\n      sender {\n        participantId\n        name\n        entryNumber\n        icon {\n          url\n          width\n          height\n        }\n      }\n      receiver {\n        participantId\n        name\n        entryNumber\n      }\n      replyTo {\n        messageId\n        participantId\n      }\n      reactions {\n        replyCount\n        favoriteCount\n        favoriteParticipantIds\n      }\n    }\n    allPageCount\n    hasPrePage\n    hasNextPage\n    currentPageNumber\n    isDesc\n    latestUnixTimeMilli\n  }\n}": types.GameMessagesDocument,
    "query ParticipantGroups($gameId: ID!, $participantId: ID) {\n  gameParticipantGroups(\n    gameId: $gameId\n    query: {memberParticipantId: $participantId}\n  ) {\n    id\n    name\n    participants {\n      id\n      name\n      profileIcon {\n        id\n        url\n      }\n    }\n    latestUnixTimeMilli\n  }\n}": types.ParticipantGroupsDocument,
    "query Icons($participantId: ID!) {\n  gameParticipantIcons(participantId: $participantId) {\n    id\n    url\n    width\n    height\n    displayOrder\n  }\n}": types.IconsDocument,
    "query GameParticipantProfile($participantId: ID!) {\n  gameParticipantProfile(participantId: $participantId) {\n    participantId\n    name\n    entryNumber\n    isGone\n    profileImageUrl\n    introduction\n    followsCount\n    followersCount\n    isPlayerOpen\n    playerName\n  }\n}": types.GameParticipantProfileDocument,
    "query GameParticipantSetting($gameId: ID!) {\n  gameParticipantSetting(gameId: $gameId) {\n    notification {\n      discordWebhookUrl\n      game {\n        participate\n        start\n      }\n      message {\n        reply\n        secret\n        directMessage\n        keywords\n      }\n    }\n  }\n}": types.GameParticipantSettingDocument,
    "query Game($id: ID!) {\n  game(id: $id) {\n    id\n    name\n    status\n    labels {\n      name\n      type\n    }\n    gameMasters {\n      id\n      player {\n        id\n        name\n      }\n    }\n    participants {\n      id\n      name\n      entryNumber\n      profileIcon {\n        id\n        url\n      }\n      canChangeName\n      chara {\n        id\n      }\n      isGone\n    }\n    periods {\n      id\n      name\n      count\n      startAt\n      endAt\n    }\n    settings {\n      background {\n        introduction\n        catchImageUrl\n      }\n      chara {\n        charachips {\n          id\n          name\n          designer {\n            name\n          }\n          canChangeName\n          charas {\n            id\n            name\n            size {\n              width\n              height\n            }\n            images {\n              type\n              url\n            }\n          }\n        }\n        canOriginalCharacter\n      }\n      capacity {\n        min\n        max\n      }\n      rule {\n        canShorten\n        canSendDirectMessage\n        theme\n      }\n      time {\n        periodPrefix\n        periodSuffix\n        periodIntervalSeconds\n        openAt\n        startParticipateAt\n        startGameAt\n        epilogueGameAt\n        finishGameAt\n      }\n      password {\n        hasPassword\n      }\n    }\n  }\n}": types.GameDocument,
    "query IndexGames($pageSize: Int!, $pageNumber: Int!, $statuses: [GameStatus!]) {\n  games(\n    query: {statuses: $statuses, paging: {pageSize: $pageSize, pageNumber: $pageNumber, isDesc: true, isLatest: false}}\n  ) {\n    id\n    name\n    status\n    labels {\n      name\n      type\n    }\n    participantsCount\n    periods {\n      id\n      name\n      startAt\n      endAt\n    }\n    settings {\n      background {\n        introduction\n        catchImageUrl\n      }\n      chara {\n        charachips {\n          name\n        }\n        canOriginalCharacter\n      }\n      capacity {\n        min\n        max\n      }\n      rule {\n        canShorten\n        canSendDirectMessage\n      }\n      time {\n        periodPrefix\n        periodSuffix\n        periodIntervalSeconds\n        openAt\n        startParticipateAt\n        startGameAt\n        epilogueGameAt\n        finishGameAt\n      }\n      password {\n        hasPassword\n      }\n    }\n  }\n}": types.IndexGamesDocument,
    "query FavoriteParticipants($gameId: ID!, $messageId: ID!) {\n  messageFavoriteGameParticipants(gameId: $gameId, messageId: $messageId) {\n    id\n    name\n    entryNumber\n    profileIcon {\n      id\n      url\n    }\n  }\n}": types.FavoriteParticipantsDocument,
    "query MessageReplies($gameId: ID!, $messageId: ID!) {\n  messageReplies(gameId: $gameId, messageId: $messageId) {\n    id\n    content {\n      type\n      text\n      number\n      isConvertDisabled\n    }\n    time {\n      sendAt\n      sendUnixTimeMilli\n    }\n    sender {\n      participantId\n      name\n      icon {\n        url\n        width\n        height\n      }\n    }\n    receiver {\n      participantId\n      name\n      entryNumber\n    }\n    replyTo {\n      messageId\n      participantId\n    }\n    reactions {\n      replyCount\n      favoriteCount\n      favoriteParticipantIds\n    }\n  }\n}": types.MessageRepliesDocument,
    "query MyGameParticipant($gameId: ID!) {\n  myGameParticipant(gameId: $gameId) {\n    id\n    name\n    entryNumber\n    player {\n      id\n    }\n    profileIcon {\n      id\n      url\n    }\n    chara {\n      id\n    }\n    canChangeName\n    followParticipantIds\n    followerParticipantIds\n  }\n}": types.MyGameParticipantDocument,
    "query MyPlayer {\n  myPlayer {\n    id\n    name\n    profile {\n      introduction\n    }\n    authorityCodes\n  }\n}": types.MyPlayerDocument,
    "query Player($id: ID!) {\n  player(id: $id) {\n    id\n    name\n    profile {\n      introduction\n    }\n  }\n}": types.PlayerDocument,
    "query QPlayers($query: PlayersQuery!) {\n  players(query: $query) {\n    id\n    name\n  }\n}": types.QPlayersDocument,
    "query QCharachips($query: CharachipsQuery!) {\n  charachips(query: $query) {\n    id\n    name\n    designer {\n      name\n    }\n  }\n}": types.QCharachipsDocument,
    "query ThreadMessages($gameId: ID!, $messageId: ID!) {\n  threadMessages(gameId: $gameId, messageId: $messageId) {\n    id\n    content {\n      type\n      text\n      number\n      isConvertDisabled\n    }\n    time {\n      sendAt\n      sendUnixTimeMilli\n    }\n    sender {\n      participantId\n      name\n      icon {\n        url\n        width\n        height\n      }\n    }\n    receiver {\n      participantId\n      name\n      entryNumber\n    }\n    replyTo {\n      messageId\n      participantId\n    }\n    reactions {\n      replyCount\n      favoriteCount\n      favoriteParticipantIds\n    }\n  }\n}": types.ThreadMessagesDocument,
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
export function graphql(source: "mutation Leave($input: DeleteGameParticipant!) {\n  deleteGameParticipant(input: $input) {\n    ok\n  }\n}"): (typeof documents)["mutation Leave($input: DeleteGameParticipant!) {\n  deleteGameParticipant(input: $input) {\n    ok\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation DeletePeriod($input: DeleteGamePeriod!) {\n  deleteGamePeriod(input: $input) {\n    ok\n  }\n}"): (typeof documents)["mutation DeletePeriod($input: DeleteGamePeriod!) {\n  deleteGamePeriod(input: $input) {\n    ok\n  }\n}"];
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
export function graphql(source: "mutation DebugMessages($input: RegisterDebugMessages!) {\n  registerDebugMessages(input: $input) {\n    ok\n  }\n}"): (typeof documents)["mutation DebugMessages($input: RegisterDebugMessages!) {\n  registerDebugMessages(input: $input) {\n    ok\n  }\n}"];
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
export function graphql(source: "mutation TalkDryRun($input: NewMessage!) {\n  registerMessageDryRun(input: $input) {\n    message {\n      id\n      content {\n        type\n        text\n        number\n        isConvertDisabled\n      }\n      time {\n        sendAt\n        sendUnixTimeMilli\n      }\n      sender {\n        participantId\n        name\n        icon {\n          url\n          width\n          height\n        }\n      }\n      receiver {\n        participantId\n        name\n        entryNumber\n      }\n      replyTo {\n        messageId\n        participantId\n      }\n      reactions {\n        replyCount\n        favoriteCount\n        favoriteParticipantIds\n      }\n    }\n  }\n}"): (typeof documents)["mutation TalkDryRun($input: NewMessage!) {\n  registerMessageDryRun(input: $input) {\n    message {\n      id\n      content {\n        type\n        text\n        number\n        isConvertDisabled\n      }\n      time {\n        sendAt\n        sendUnixTimeMilli\n      }\n      sender {\n        participantId\n        name\n        icon {\n          url\n          width\n          height\n        }\n      }\n      receiver {\n        participantId\n        name\n        entryNumber\n      }\n      replyTo {\n        messageId\n        participantId\n      }\n      reactions {\n        replyCount\n        favoriteCount\n        favoriteParticipantIds\n      }\n    }\n  }\n}"];
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
export function graphql(source: "mutation UpdateGameParticipantSetting($input: UpdateGameParticipantSetting!) {\n  updateGameParticipantSetting(input: $input) {\n    ok\n  }\n}"): (typeof documents)["mutation UpdateGameParticipantSetting($input: UpdateGameParticipantSetting!) {\n  updateGameParticipantSetting(input: $input) {\n    ok\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation UpdatePeriod($input: UpdateGamePeriod!) {\n  updateGamePeriod(input: $input) {\n    ok\n  }\n}"): (typeof documents)["mutation UpdatePeriod($input: UpdateGamePeriod!) {\n  updateGamePeriod(input: $input) {\n    ok\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation UpdateGameSettings($input: UpdateGameSetting!) {\n  updateGameSetting(input: $input) {\n    ok\n  }\n}"): (typeof documents)["mutation UpdateGameSettings($input: UpdateGameSetting!) {\n  updateGameSetting(input: $input) {\n    ok\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation UpdateStatus($input: UpdateGameStatus!) {\n  updateGameStatus(input: $input) {\n    ok\n  }\n}"): (typeof documents)["mutation UpdateStatus($input: UpdateGameStatus!) {\n  updateGameStatus(input: $input) {\n    ok\n  }\n}"];
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
export function graphql(source: "mutation UploadIcons($input: NewGameParticipantIcons!) {\n  registerGameParticipantIcons(input: $input) {\n    gameParticipantIcons {\n      id\n    }\n  }\n}"): (typeof documents)["mutation UploadIcons($input: NewGameParticipantIcons!) {\n  registerGameParticipantIcons(input: $input) {\n    gameParticipantIcons {\n      id\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query CharachipDetail($id: ID!) {\n  charachip(id: $id) {\n    id\n    name\n    descriptionUrl\n    canChangeName\n    designer {\n      name\n    }\n    charas {\n      id\n      name\n      size {\n        width\n        height\n      }\n      images {\n        type\n        url\n      }\n    }\n  }\n}"): (typeof documents)["query CharachipDetail($id: ID!) {\n  charachip(id: $id) {\n    id\n    name\n    descriptionUrl\n    canChangeName\n    designer {\n      name\n    }\n    charas {\n      id\n      name\n      size {\n        width\n        height\n      }\n      images {\n        type\n        url\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query CharachipDetails($query: CharachipsQuery!) {\n  charachips(query: $query) {\n    id\n    name\n    designer {\n      name\n    }\n    charas {\n      id\n      name\n      size {\n        width\n        height\n      }\n      images {\n        type\n        url\n      }\n    }\n  }\n}"): (typeof documents)["query CharachipDetails($query: CharachipsQuery!) {\n  charachips(query: $query) {\n    id\n    name\n    designer {\n      name\n    }\n    charas {\n      id\n      name\n      size {\n        width\n        height\n      }\n      images {\n        type\n        url\n      }\n    }\n  }\n}"];
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
export function graphql(source: "query GameDirectMessages($gameId: ID!, $query: DirectMessagesQuery!) {\n  directMessages(gameId: $gameId, query: $query) {\n    list {\n      id\n      content {\n        type\n        text\n        number\n        isConvertDisabled\n      }\n      time {\n        sendAt\n        sendUnixTimeMilli\n      }\n      sender {\n        participantId\n        name\n        entryNumber\n        icon {\n          url\n          width\n          height\n        }\n      }\n      reactions {\n        favoriteCounts\n        favoriteParticipantIds\n      }\n    }\n    allPageCount\n    hasPrePage\n    hasNextPage\n    currentPageNumber\n    isDesc\n    latestUnixTimeMilli\n  }\n}"): (typeof documents)["query GameDirectMessages($gameId: ID!, $query: DirectMessagesQuery!) {\n  directMessages(gameId: $gameId, query: $query) {\n    list {\n      id\n      content {\n        type\n        text\n        number\n        isConvertDisabled\n      }\n      time {\n        sendAt\n        sendUnixTimeMilli\n      }\n      sender {\n        participantId\n        name\n        entryNumber\n        icon {\n          url\n          width\n          height\n        }\n      }\n      reactions {\n        favoriteCounts\n        favoriteParticipantIds\n      }\n    }\n    allPageCount\n    hasPrePage\n    hasNextPage\n    currentPageNumber\n    isDesc\n    latestUnixTimeMilli\n  }\n}"];
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
export function graphql(source: "query GameMessage($gameId: ID!, $messageId: ID!) {\n  message(gameId: $gameId, messageId: $messageId) {\n    id\n    content {\n      type\n      text\n      number\n      isConvertDisabled\n    }\n    time {\n      sendAt\n      sendUnixTimeMilli\n    }\n    sender {\n      participantId\n      name\n      entryNumber\n      icon {\n        url\n        width\n        height\n      }\n    }\n    receiver {\n      participantId\n      name\n      entryNumber\n    }\n    replyTo {\n      messageId\n      participantId\n    }\n    reactions {\n      replyCount\n      favoriteCount\n      favoriteParticipantIds\n    }\n  }\n}"): (typeof documents)["query GameMessage($gameId: ID!, $messageId: ID!) {\n  message(gameId: $gameId, messageId: $messageId) {\n    id\n    content {\n      type\n      text\n      number\n      isConvertDisabled\n    }\n    time {\n      sendAt\n      sendUnixTimeMilli\n    }\n    sender {\n      participantId\n      name\n      entryNumber\n      icon {\n        url\n        width\n        height\n      }\n    }\n    receiver {\n      participantId\n      name\n      entryNumber\n    }\n    replyTo {\n      messageId\n      participantId\n    }\n    reactions {\n      replyCount\n      favoriteCount\n      favoriteParticipantIds\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query MessagesLatest($gameId: ID!, $query: MessagesQuery!) {\n  messagesLatestUnixTimeMilli(gameId: $gameId, query: $query)\n}"): (typeof documents)["query MessagesLatest($gameId: ID!, $query: MessagesQuery!) {\n  messagesLatestUnixTimeMilli(gameId: $gameId, query: $query)\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GameMessages($gameId: ID!, $query: MessagesQuery!) {\n  messages(gameId: $gameId, query: $query) {\n    list {\n      id\n      content {\n        type\n        text\n        number\n        isConvertDisabled\n      }\n      time {\n        sendAt\n        sendUnixTimeMilli\n      }\n      sender {\n        participantId\n        name\n        entryNumber\n        icon {\n          url\n          width\n          height\n        }\n      }\n      receiver {\n        participantId\n        name\n        entryNumber\n      }\n      replyTo {\n        messageId\n        participantId\n      }\n      reactions {\n        replyCount\n        favoriteCount\n        favoriteParticipantIds\n      }\n    }\n    allPageCount\n    hasPrePage\n    hasNextPage\n    currentPageNumber\n    isDesc\n    latestUnixTimeMilli\n  }\n}"): (typeof documents)["query GameMessages($gameId: ID!, $query: MessagesQuery!) {\n  messages(gameId: $gameId, query: $query) {\n    list {\n      id\n      content {\n        type\n        text\n        number\n        isConvertDisabled\n      }\n      time {\n        sendAt\n        sendUnixTimeMilli\n      }\n      sender {\n        participantId\n        name\n        entryNumber\n        icon {\n          url\n          width\n          height\n        }\n      }\n      receiver {\n        participantId\n        name\n        entryNumber\n      }\n      replyTo {\n        messageId\n        participantId\n      }\n      reactions {\n        replyCount\n        favoriteCount\n        favoriteParticipantIds\n      }\n    }\n    allPageCount\n    hasPrePage\n    hasNextPage\n    currentPageNumber\n    isDesc\n    latestUnixTimeMilli\n  }\n}"];
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
export function graphql(source: "query GameParticipantProfile($participantId: ID!) {\n  gameParticipantProfile(participantId: $participantId) {\n    participantId\n    name\n    entryNumber\n    isGone\n    profileImageUrl\n    introduction\n    followsCount\n    followersCount\n    isPlayerOpen\n    playerName\n  }\n}"): (typeof documents)["query GameParticipantProfile($participantId: ID!) {\n  gameParticipantProfile(participantId: $participantId) {\n    participantId\n    name\n    entryNumber\n    isGone\n    profileImageUrl\n    introduction\n    followsCount\n    followersCount\n    isPlayerOpen\n    playerName\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GameParticipantSetting($gameId: ID!) {\n  gameParticipantSetting(gameId: $gameId) {\n    notification {\n      discordWebhookUrl\n      game {\n        participate\n        start\n      }\n      message {\n        reply\n        secret\n        directMessage\n        keywords\n      }\n    }\n  }\n}"): (typeof documents)["query GameParticipantSetting($gameId: ID!) {\n  gameParticipantSetting(gameId: $gameId) {\n    notification {\n      discordWebhookUrl\n      game {\n        participate\n        start\n      }\n      message {\n        reply\n        secret\n        directMessage\n        keywords\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Game($id: ID!) {\n  game(id: $id) {\n    id\n    name\n    status\n    labels {\n      name\n      type\n    }\n    gameMasters {\n      id\n      player {\n        id\n        name\n      }\n    }\n    participants {\n      id\n      name\n      entryNumber\n      profileIcon {\n        id\n        url\n      }\n      canChangeName\n      chara {\n        id\n      }\n      isGone\n    }\n    periods {\n      id\n      name\n      count\n      startAt\n      endAt\n    }\n    settings {\n      background {\n        introduction\n        catchImageUrl\n      }\n      chara {\n        charachips {\n          id\n          name\n          designer {\n            name\n          }\n          canChangeName\n          charas {\n            id\n            name\n            size {\n              width\n              height\n            }\n            images {\n              type\n              url\n            }\n          }\n        }\n        canOriginalCharacter\n      }\n      capacity {\n        min\n        max\n      }\n      rule {\n        canShorten\n        canSendDirectMessage\n        theme\n      }\n      time {\n        periodPrefix\n        periodSuffix\n        periodIntervalSeconds\n        openAt\n        startParticipateAt\n        startGameAt\n        epilogueGameAt\n        finishGameAt\n      }\n      password {\n        hasPassword\n      }\n    }\n  }\n}"): (typeof documents)["query Game($id: ID!) {\n  game(id: $id) {\n    id\n    name\n    status\n    labels {\n      name\n      type\n    }\n    gameMasters {\n      id\n      player {\n        id\n        name\n      }\n    }\n    participants {\n      id\n      name\n      entryNumber\n      profileIcon {\n        id\n        url\n      }\n      canChangeName\n      chara {\n        id\n      }\n      isGone\n    }\n    periods {\n      id\n      name\n      count\n      startAt\n      endAt\n    }\n    settings {\n      background {\n        introduction\n        catchImageUrl\n      }\n      chara {\n        charachips {\n          id\n          name\n          designer {\n            name\n          }\n          canChangeName\n          charas {\n            id\n            name\n            size {\n              width\n              height\n            }\n            images {\n              type\n              url\n            }\n          }\n        }\n        canOriginalCharacter\n      }\n      capacity {\n        min\n        max\n      }\n      rule {\n        canShorten\n        canSendDirectMessage\n        theme\n      }\n      time {\n        periodPrefix\n        periodSuffix\n        periodIntervalSeconds\n        openAt\n        startParticipateAt\n        startGameAt\n        epilogueGameAt\n        finishGameAt\n      }\n      password {\n        hasPassword\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query IndexGames($pageSize: Int!, $pageNumber: Int!, $statuses: [GameStatus!]) {\n  games(\n    query: {statuses: $statuses, paging: {pageSize: $pageSize, pageNumber: $pageNumber, isDesc: true, isLatest: false}}\n  ) {\n    id\n    name\n    status\n    labels {\n      name\n      type\n    }\n    participantsCount\n    periods {\n      id\n      name\n      startAt\n      endAt\n    }\n    settings {\n      background {\n        introduction\n        catchImageUrl\n      }\n      chara {\n        charachips {\n          name\n        }\n        canOriginalCharacter\n      }\n      capacity {\n        min\n        max\n      }\n      rule {\n        canShorten\n        canSendDirectMessage\n      }\n      time {\n        periodPrefix\n        periodSuffix\n        periodIntervalSeconds\n        openAt\n        startParticipateAt\n        startGameAt\n        epilogueGameAt\n        finishGameAt\n      }\n      password {\n        hasPassword\n      }\n    }\n  }\n}"): (typeof documents)["query IndexGames($pageSize: Int!, $pageNumber: Int!, $statuses: [GameStatus!]) {\n  games(\n    query: {statuses: $statuses, paging: {pageSize: $pageSize, pageNumber: $pageNumber, isDesc: true, isLatest: false}}\n  ) {\n    id\n    name\n    status\n    labels {\n      name\n      type\n    }\n    participantsCount\n    periods {\n      id\n      name\n      startAt\n      endAt\n    }\n    settings {\n      background {\n        introduction\n        catchImageUrl\n      }\n      chara {\n        charachips {\n          name\n        }\n        canOriginalCharacter\n      }\n      capacity {\n        min\n        max\n      }\n      rule {\n        canShorten\n        canSendDirectMessage\n      }\n      time {\n        periodPrefix\n        periodSuffix\n        periodIntervalSeconds\n        openAt\n        startParticipateAt\n        startGameAt\n        epilogueGameAt\n        finishGameAt\n      }\n      password {\n        hasPassword\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query FavoriteParticipants($gameId: ID!, $messageId: ID!) {\n  messageFavoriteGameParticipants(gameId: $gameId, messageId: $messageId) {\n    id\n    name\n    entryNumber\n    profileIcon {\n      id\n      url\n    }\n  }\n}"): (typeof documents)["query FavoriteParticipants($gameId: ID!, $messageId: ID!) {\n  messageFavoriteGameParticipants(gameId: $gameId, messageId: $messageId) {\n    id\n    name\n    entryNumber\n    profileIcon {\n      id\n      url\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query MessageReplies($gameId: ID!, $messageId: ID!) {\n  messageReplies(gameId: $gameId, messageId: $messageId) {\n    id\n    content {\n      type\n      text\n      number\n      isConvertDisabled\n    }\n    time {\n      sendAt\n      sendUnixTimeMilli\n    }\n    sender {\n      participantId\n      name\n      icon {\n        url\n        width\n        height\n      }\n    }\n    receiver {\n      participantId\n      name\n      entryNumber\n    }\n    replyTo {\n      messageId\n      participantId\n    }\n    reactions {\n      replyCount\n      favoriteCount\n      favoriteParticipantIds\n    }\n  }\n}"): (typeof documents)["query MessageReplies($gameId: ID!, $messageId: ID!) {\n  messageReplies(gameId: $gameId, messageId: $messageId) {\n    id\n    content {\n      type\n      text\n      number\n      isConvertDisabled\n    }\n    time {\n      sendAt\n      sendUnixTimeMilli\n    }\n    sender {\n      participantId\n      name\n      icon {\n        url\n        width\n        height\n      }\n    }\n    receiver {\n      participantId\n      name\n      entryNumber\n    }\n    replyTo {\n      messageId\n      participantId\n    }\n    reactions {\n      replyCount\n      favoriteCount\n      favoriteParticipantIds\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query MyGameParticipant($gameId: ID!) {\n  myGameParticipant(gameId: $gameId) {\n    id\n    name\n    entryNumber\n    player {\n      id\n    }\n    profileIcon {\n      id\n      url\n    }\n    chara {\n      id\n    }\n    canChangeName\n    followParticipantIds\n    followerParticipantIds\n  }\n}"): (typeof documents)["query MyGameParticipant($gameId: ID!) {\n  myGameParticipant(gameId: $gameId) {\n    id\n    name\n    entryNumber\n    player {\n      id\n    }\n    profileIcon {\n      id\n      url\n    }\n    chara {\n      id\n    }\n    canChangeName\n    followParticipantIds\n    followerParticipantIds\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query MyPlayer {\n  myPlayer {\n    id\n    name\n    profile {\n      introduction\n    }\n    authorityCodes\n  }\n}"): (typeof documents)["query MyPlayer {\n  myPlayer {\n    id\n    name\n    profile {\n      introduction\n    }\n    authorityCodes\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Player($id: ID!) {\n  player(id: $id) {\n    id\n    name\n    profile {\n      introduction\n    }\n  }\n}"): (typeof documents)["query Player($id: ID!) {\n  player(id: $id) {\n    id\n    name\n    profile {\n      introduction\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query QPlayers($query: PlayersQuery!) {\n  players(query: $query) {\n    id\n    name\n  }\n}"): (typeof documents)["query QPlayers($query: PlayersQuery!) {\n  players(query: $query) {\n    id\n    name\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query QCharachips($query: CharachipsQuery!) {\n  charachips(query: $query) {\n    id\n    name\n    designer {\n      name\n    }\n  }\n}"): (typeof documents)["query QCharachips($query: CharachipsQuery!) {\n  charachips(query: $query) {\n    id\n    name\n    designer {\n      name\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query ThreadMessages($gameId: ID!, $messageId: ID!) {\n  threadMessages(gameId: $gameId, messageId: $messageId) {\n    id\n    content {\n      type\n      text\n      number\n      isConvertDisabled\n    }\n    time {\n      sendAt\n      sendUnixTimeMilli\n    }\n    sender {\n      participantId\n      name\n      icon {\n        url\n        width\n        height\n      }\n    }\n    receiver {\n      participantId\n      name\n      entryNumber\n    }\n    replyTo {\n      messageId\n      participantId\n    }\n    reactions {\n      replyCount\n      favoriteCount\n      favoriteParticipantIds\n    }\n  }\n}"): (typeof documents)["query ThreadMessages($gameId: ID!, $messageId: ID!) {\n  threadMessages(gameId: $gameId, messageId: $messageId) {\n    id\n    content {\n      type\n      text\n      number\n      isConvertDisabled\n    }\n    time {\n      sendAt\n      sendUnixTimeMilli\n    }\n    sender {\n      participantId\n      name\n      icon {\n        url\n        width\n        height\n      }\n    }\n    receiver {\n      participantId\n      name\n      entryNumber\n    }\n    replyTo {\n      messageId\n      participantId\n    }\n    reactions {\n      replyCount\n      favoriteCount\n      favoriteParticipantIds\n    }\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;