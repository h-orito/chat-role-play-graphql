/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
  Long: any;
};

export type Chara = {
  __typename?: 'Chara';
  id: Scalars['ID'];
  images: Array<CharaImage>;
  name: Scalars['String'];
};

export type CharaImage = {
  __typename?: 'CharaImage';
  id: Scalars['ID'];
  size: CharaSize;
  type: Scalars['String'];
  url: Scalars['String'];
};

export type CharaSize = {
  __typename?: 'CharaSize';
  height: Scalars['Int'];
  width: Scalars['Int'];
};

export type Charachip = {
  __typename?: 'Charachip';
  charas: Array<Chara>;
  designer: Designer;
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type CharachipsQuery = {
  ids?: InputMaybe<Array<Scalars['ID']>>;
  name?: InputMaybe<Scalars['String']>;
  paging?: InputMaybe<PageableQuery>;
};

export type DeleteDirectMessageFavorite = {
  directMessageId: Scalars['ID'];
  gameId: Scalars['ID'];
};

export type DeleteDirectMessageFavoritePayload = {
  __typename?: 'DeleteDirectMessageFavoritePayload';
  ok: Scalars['Boolean'];
};

export type DeleteGameMaster = {
  id: Scalars['ID'];
};

export type DeleteGameMasterPayload = {
  __typename?: 'DeleteGameMasterPayload';
  ok: Scalars['Boolean'];
};

export type DeleteGameParticipant = {
  gameId: Scalars['ID'];
};

export type DeleteGameParticipantFollow = {
  gameId: Scalars['ID'];
  targetGameParticipantId: Scalars['ID'];
};

export type DeleteGameParticipantFollowPayload = {
  __typename?: 'DeleteGameParticipantFollowPayload';
  ok: Scalars['Boolean'];
};

export type DeleteGameParticipantPayload = {
  __typename?: 'DeleteGameParticipantPayload';
  ok: Scalars['Boolean'];
};

export type DeleteMessageFavorite = {
  gameId: Scalars['ID'];
  messageId: Scalars['ID'];
};

export type DeleteMessageFavoritePayload = {
  __typename?: 'DeleteMessageFavoritePayload';
  ok: Scalars['Boolean'];
};

export type DeletePlayerSnsAccount = {
  id: Scalars['ID'];
};

export type DeletePlayerSnsAccountPayload = {
  __typename?: 'DeletePlayerSnsAccountPayload';
  ok: Scalars['Boolean'];
};

export type Designer = {
  __typename?: 'Designer';
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type DesignersQuery = {
  Name?: InputMaybe<Scalars['String']>;
  ids?: InputMaybe<Array<Scalars['ID']>>;
  paging?: InputMaybe<PageableQuery>;
};

export type DirectMessage = {
  __typename?: 'DirectMessage';
  content: MessageContent;
  id: Scalars['ID'];
  participantGroupId: Scalars['ID'];
  reactions: DirectMessageReactions;
  sender: MessageSender;
  time: MessageTime;
};

export type DirectMessageReactions = {
  __typename?: 'DirectMessageReactions';
  favoriteCounts: Scalars['Int'];
};

export type DirectMessages = Pageable & {
  __typename?: 'DirectMessages';
  allPageCount: Scalars['Int'];
  currentPageNumber?: Maybe<Scalars['Int']>;
  hasNextPage: Scalars['Boolean'];
  hasPrePage: Scalars['Boolean'];
  isDesc: Scalars['Boolean'];
  list: Array<DirectMessage>;
};

export type DirectMessagesQuery = {
  ids?: InputMaybe<Array<Scalars['ID']>>;
  keywords?: InputMaybe<Array<Scalars['String']>>;
  offsetUnixTimeMilli?: InputMaybe<Scalars['Long']>;
  paging?: InputMaybe<PageableQuery>;
  participantGroupId: Scalars['ID'];
  periodId?: InputMaybe<Scalars['ID']>;
  senderIds?: InputMaybe<Array<Scalars['ID']>>;
  sinceAt?: InputMaybe<Scalars['DateTime']>;
  types?: InputMaybe<Array<MessageType>>;
  untilAt?: InputMaybe<Scalars['DateTime']>;
};

export type Game = {
  __typename?: 'Game';
  gameMasters: Array<GameMaster>;
  id: Scalars['ID'];
  name: Scalars['String'];
  participants: Array<GameParticipant>;
  periods: Array<GamePeriod>;
  settings: GameSettings;
  status: GameStatus;
};


export type GameParticipantsArgs = {
  paging?: InputMaybe<PageableQuery>;
};

export type GameCapacity = {
  __typename?: 'GameCapacity';
  max: Scalars['Int'];
  min: Scalars['Int'];
};

export type GameCharaSetting = {
  __typename?: 'GameCharaSetting';
  canOriginalCharacter: Scalars['Boolean'];
  charachips: Array<Charachip>;
};

export type GameDiariesQuery = {
  participantId?: InputMaybe<Scalars['ID']>;
  periodId?: InputMaybe<Scalars['ID']>;
};

export type GameMaster = {
  __typename?: 'GameMaster';
  id: Scalars['ID'];
  isProducer: Scalars['Boolean'];
  player: Player;
};

export type GameNotificationCondition = {
  __typename?: 'GameNotificationCondition';
  participate: Scalars['Boolean'];
  start: Scalars['Boolean'];
};

export type GameParticipant = {
  __typename?: 'GameParticipant';
  chara: Chara;
  entryNumber: Scalars['Int'];
  id: Scalars['ID'];
  isGone: Scalars['Boolean'];
  lastAccessedAt: Scalars['DateTime'];
  name: Scalars['String'];
  player: Player;
};

export type GameParticipantDiary = {
  __typename?: 'GameParticipantDiary';
  body: Scalars['String'];
  id: Scalars['ID'];
  participant: GameParticipant;
  period: GamePeriod;
  title: Scalars['String'];
};

export type GameParticipantGroup = {
  __typename?: 'GameParticipantGroup';
  id: Scalars['ID'];
  name: Scalars['String'];
  participants: Array<GameParticipant>;
};

export type GameParticipantGroupsQuery = {
  memberParticipantId?: InputMaybe<Scalars['ID']>;
};

export type GameParticipantProfile = {
  __typename?: 'GameParticipantProfile';
  followersCount: Scalars['Int'];
  followsCount: Scalars['Int'];
  iconUrl?: Maybe<Scalars['String']>;
  introduction?: Maybe<Scalars['String']>;
  memo?: Maybe<Scalars['String']>;
};

export type GameParticipantSetting = {
  __typename?: 'GameParticipantSetting';
  notification: NotificationCondition;
};

export type GamePasswordSetting = {
  __typename?: 'GamePasswordSetting';
  hasPassword: Scalars['Boolean'];
};

export type GamePeriod = {
  __typename?: 'GamePeriod';
  count: Scalars['Int'];
  endAt: Scalars['DateTime'];
  id: Scalars['ID'];
  name: Scalars['String'];
  startAt: Scalars['DateTime'];
};

export type GameRuleSetting = {
  __typename?: 'GameRuleSetting';
  canSendDirectMessage: Scalars['Boolean'];
  canShorten: Scalars['Boolean'];
  isGameMasterProducer: Scalars['Boolean'];
};

export type GameSettings = {
  __typename?: 'GameSettings';
  capacity: GameCapacity;
  chara: GameCharaSetting;
  password: GamePasswordSetting;
  rule: GameRuleSetting;
  time: GameTimeSetting;
};

export enum GameStatus {
  Cancelled = 'Cancelled',
  Closed = 'Closed',
  Finished = 'Finished',
  Opening = 'Opening',
  Progress = 'Progress',
  Recruiting = 'Recruiting'
}

export type GameTimeSetting = {
  __typename?: 'GameTimeSetting';
  openAt: Scalars['DateTime'];
  periodIntervalSeconds: Scalars['Int'];
  periodPrefix?: Maybe<Scalars['String']>;
  periodSuffix?: Maybe<Scalars['String']>;
  startGameAt: Scalars['DateTime'];
  startParticipateAt: Scalars['DateTime'];
};

export type GamesQuery = {
  ids?: InputMaybe<Array<Scalars['ID']>>;
  name?: InputMaybe<Scalars['String']>;
  paging?: InputMaybe<PageableQuery>;
};

export type Message = {
  __typename?: 'Message';
  content: MessageContent;
  id: Scalars['ID'];
  reactions: MessageReactions;
  replyTo: MessageRecipient;
  sender: MessageSender;
  time: MessageTime;
};

export type MessageContent = {
  __typename?: 'MessageContent';
  isConvertDisabled: Scalars['Boolean'];
  number: Scalars['Int'];
  text: Scalars['String'];
  type: MessageType;
};

export type MessageNotificationCondition = {
  __typename?: 'MessageNotificationCondition';
  directMessage: Scalars['Boolean'];
  keywords: Array<Scalars['String']>;
  reply: Scalars['Boolean'];
};

export type MessageReactions = {
  __typename?: 'MessageReactions';
  favoriteCount: Scalars['Int'];
  replyCount: Scalars['Int'];
};

export type MessageRecipient = {
  __typename?: 'MessageRecipient';
  messageId: Scalars['ID'];
  participantId: Scalars['ID'];
};

export type MessageSender = {
  __typename?: 'MessageSender';
  charaImage: CharaImage;
  charaName: Scalars['String'];
  participantId: Scalars['ID'];
};

export type MessageTime = {
  __typename?: 'MessageTime';
  sendAt: Scalars['DateTime'];
  sendUnixTimeMilli: Scalars['Long'];
};

export enum MessageType {
  Description = 'Description',
  Monologue = 'Monologue',
  SystemPrivate = 'SystemPrivate',
  SystemPublic = 'SystemPublic',
  TalkNormal = 'TalkNormal'
}

export type Messages = Pageable & {
  __typename?: 'Messages';
  allPageCount: Scalars['Int'];
  currentPageNumber?: Maybe<Scalars['Int']>;
  hasNextPage: Scalars['Boolean'];
  hasPrePage: Scalars['Boolean'];
  isDesc: Scalars['Boolean'];
  list: Array<Message>;
};

export type MessagesQuery = {
  ids?: InputMaybe<Array<Scalars['ID']>>;
  keywords?: InputMaybe<Array<Scalars['String']>>;
  offsetUnixTimeMilli?: InputMaybe<Scalars['Long']>;
  paging?: InputMaybe<PageableQuery>;
  periodId?: InputMaybe<Scalars['ID']>;
  replyToMessageId?: InputMaybe<Scalars['ID']>;
  senderIds?: InputMaybe<Array<Scalars['ID']>>;
  sinceAt?: InputMaybe<Scalars['DateTime']>;
  types?: InputMaybe<Array<MessageType>>;
  untilAt?: InputMaybe<Scalars['DateTime']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  deleteDirectMessageFavorite: DeleteDirectMessageFavoritePayload;
  deleteGameMaster: DeleteGameMasterPayload;
  deleteGameParticipant: DeleteGameParticipantPayload;
  deleteGameParticipantFollow: DeleteGameParticipantFollowPayload;
  deleteMessageFavorite: DeleteMessageFavoritePayload;
  deletePlayerSnsAccount: DeletePlayerSnsAccountPayload;
  registerCharaImage: RegisterCharaImagePayload;
  registerCharachip: RegisterCharachipPayload;
  registerCharachipChara: RegisterCharaPayload;
  registerDesigner: RegisterDesignerPayload;
  registerDirectMessage: RegisterDirectMessagePayload;
  registerDirectMessageFavorite: RegisterDirectMessageFavoritePayload;
  registerGame: RegisterGamePayload;
  registerGameMaster: RegisterGameMasterPayload;
  registerGameParticipant: RegisterGameParticipantPayload;
  registerGameParticipantDiary: RegisterGameParticipantDiaryPayload;
  registerGameParticipantFollow: RegisterGameParticipantFollowPayload;
  registerMessage: RegisterMessagePayload;
  registerMessageFavorite: RegisterMessageFavoritePayload;
  registerPlayerProfile: RegisterPlayerProfilePayload;
  registerPlayerSnsAccount: RegisterPlayerSnsAccountPayload;
  updateChara: UpdateCharaPayload;
  updateCharaImage: UpdateCharaImagePayload;
  updateCharachip: UpdateCharachipPayload;
  updateDesigner: UpdateDesignerPayload;
  updateGameMaster: UpdateGameMasterPayload;
  updateGameParticipantDiary: UpdateGameParticipantDiaryPayload;
  updateGameParticipantProfile: UpdateGameParticipantProfilePayload;
  updateGameParticipantSetting: UpdateGameParticipantSettingPayload;
  updateGamePeriod: UpdateGamePeriodPayload;
  updateGameSetting: UpdateGameSettingPayload;
  updateGameStatus: UpdateGameStatusPayload;
  updatePlayerProfile: UpdatePlayerProfilePayload;
  updatePlayerSnsAccount: UpdatePlayerSnsAccountPayload;
};


export type MutationDeleteDirectMessageFavoriteArgs = {
  input: DeleteDirectMessageFavorite;
};


export type MutationDeleteGameMasterArgs = {
  input: DeleteGameMaster;
};


export type MutationDeleteGameParticipantArgs = {
  input: DeleteGameParticipant;
};


export type MutationDeleteGameParticipantFollowArgs = {
  input: DeleteGameParticipantFollow;
};


export type MutationDeleteMessageFavoriteArgs = {
  input: DeleteMessageFavorite;
};


export type MutationDeletePlayerSnsAccountArgs = {
  input: DeletePlayerSnsAccount;
};


export type MutationRegisterCharaImageArgs = {
  input: NewCharaImage;
};


export type MutationRegisterCharachipArgs = {
  input: NewCharachip;
};


export type MutationRegisterCharachipCharaArgs = {
  input: NewChara;
};


export type MutationRegisterDesignerArgs = {
  input: NewDesigner;
};


export type MutationRegisterDirectMessageArgs = {
  input: NewDirectMessage;
};


export type MutationRegisterDirectMessageFavoriteArgs = {
  input: NewDirectMessageFavorite;
};


export type MutationRegisterGameArgs = {
  input: NewGame;
};


export type MutationRegisterGameMasterArgs = {
  input: NewGameMaster;
};


export type MutationRegisterGameParticipantArgs = {
  input: NewGameParticipant;
};


export type MutationRegisterGameParticipantDiaryArgs = {
  input: NewGameParticipantDiary;
};


export type MutationRegisterGameParticipantFollowArgs = {
  input: NewGameParticipantFollow;
};


export type MutationRegisterMessageArgs = {
  input: NewMessage;
};


export type MutationRegisterMessageFavoriteArgs = {
  input: NewMessageFavorite;
};


export type MutationRegisterPlayerProfileArgs = {
  input: NewPlayerProfile;
};


export type MutationRegisterPlayerSnsAccountArgs = {
  input: NewPlayerSnsAccount;
};


export type MutationUpdateCharaArgs = {
  input: UpdateChara;
};


export type MutationUpdateCharaImageArgs = {
  input: UpdateCharaImage;
};


export type MutationUpdateCharachipArgs = {
  input: UpdateCharachip;
};


export type MutationUpdateDesignerArgs = {
  input: UpdateDesigner;
};


export type MutationUpdateGameMasterArgs = {
  input: UpdateGameMaster;
};


export type MutationUpdateGameParticipantDiaryArgs = {
  input: UpdateGameParticipantDiary;
};


export type MutationUpdateGameParticipantProfileArgs = {
  input: UpdateGameParticipantProfile;
};


export type MutationUpdateGameParticipantSettingArgs = {
  input: UpdateGameParticipantSetting;
};


export type MutationUpdateGamePeriodArgs = {
  input: UpdateGamePeriod;
};


export type MutationUpdateGameSettingArgs = {
  input: UpdateGameSetting;
};


export type MutationUpdateGameStatusArgs = {
  input: UpdateGameStatus;
};


export type MutationUpdatePlayerProfileArgs = {
  input: UpdatePlayerProfile;
};


export type MutationUpdatePlayerSnsAccountArgs = {
  input: UpdatePlayerSnsAccount;
};

export type NewChara = {
  charachipId: Scalars['ID'];
  name: Scalars['String'];
};

export type NewCharaImage = {
  charaId: Scalars['ID'];
  height: Scalars['Int'];
  type: Scalars['String'];
  url: Scalars['String'];
  width: Scalars['Int'];
};

export type NewCharachip = {
  designerId: Scalars['ID'];
  name: Scalars['String'];
};

export type NewDesigner = {
  name: Scalars['String'];
};

export type NewDirectMessage = {
  charaImageId: Scalars['ID'];
  charaName: Scalars['String'];
  gameId: Scalars['ID'];
  gameParticipantGroupId: Scalars['ID'];
  isConvertDisabled: Scalars['Boolean'];
  text: Scalars['String'];
  type: MessageType;
};

export type NewDirectMessageFavorite = {
  directMessageId: Scalars['ID'];
  gameId: Scalars['ID'];
};

export type NewGame = {
  name: Scalars['String'];
  settings: NewGameSettings;
};

export type NewGameCapacity = {
  max: Scalars['Int'];
  min: Scalars['Int'];
};

export type NewGameCharaSetting = {
  canOriginalCharacter: Scalars['Boolean'];
  charachipIds: Array<Scalars['Int']>;
};

export type NewGameMaster = {
  gameId: Scalars['ID'];
  isProducer: Scalars['Boolean'];
  playerId: Scalars['ID'];
};

export type NewGameParticipant = {
  Name: Scalars['String'];
  charaId: Scalars['ID'];
  gameId: Scalars['ID'];
};

export type NewGameParticipantDiary = {
  body: Scalars['String'];
  gameId: Scalars['ID'];
  periodId: Scalars['ID'];
  title: Scalars['String'];
};

export type NewGameParticipantFollow = {
  gameId: Scalars['ID'];
  targetGameParticipantId: Scalars['ID'];
};

export type NewGamePasswordSetting = {
  password?: InputMaybe<Scalars['String']>;
};

export type NewGameRuleSetting = {
  canSendDirectMessage: Scalars['Boolean'];
  canShorten: Scalars['Boolean'];
  isGameMasterProducer: Scalars['Boolean'];
};

export type NewGameSettings = {
  capacity: NewGameCapacity;
  chara: NewGameCharaSetting;
  password: NewGamePasswordSetting;
  rule: NewGameRuleSetting;
  time: NewGameTimeSetting;
};

export type NewGameTimeSetting = {
  openAt: Scalars['DateTime'];
  periodIntervalSeconds: Scalars['Int'];
  periodPrefix?: InputMaybe<Scalars['String']>;
  periodSuffix?: InputMaybe<Scalars['String']>;
  startGameAt: Scalars['DateTime'];
  startParticipateAt: Scalars['DateTime'];
};

export type NewMessage = {
  charaImageId: Scalars['ID'];
  charaName: Scalars['String'];
  gameId: Scalars['ID'];
  isConvertDisabled: Scalars['Boolean'];
  replyToMessageId?: InputMaybe<Scalars['ID']>;
  text: Scalars['String'];
  type: MessageType;
};

export type NewMessageFavorite = {
  gameId: Scalars['ID'];
  messageId: Scalars['ID'];
};

export type NewPlayerProfile = {
  iconUrl?: InputMaybe<Scalars['String']>;
  introduction?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
};

export type NewPlayerSnsAccount = {
  accountName: Scalars['String'];
  accountUrl: Scalars['String'];
  type: SnsType;
};

export type NotificationCondition = {
  __typename?: 'NotificationCondition';
  discordWebhookUrl?: Maybe<Scalars['String']>;
  game: GameNotificationCondition;
  message: MessageNotificationCondition;
};

export type Pageable = {
  allPageCount: Scalars['Int'];
  currentPageNumber?: Maybe<Scalars['Int']>;
  hasNextPage: Scalars['Boolean'];
  hasPrePage: Scalars['Boolean'];
  isDesc: Scalars['Boolean'];
};

export type PageableQuery = {
  isDesc: Scalars['Boolean'];
  pageNumber: Scalars['Int'];
  pageSize: Scalars['Int'];
};

export type ParticipantsQuery = {
  ids?: InputMaybe<Array<Scalars['ID']>>;
  paging?: InputMaybe<PageableQuery>;
  playerIds?: InputMaybe<Array<Scalars['ID']>>;
};

export type Player = {
  __typename?: 'Player';
  designer?: Maybe<Designer>;
  id: Scalars['ID'];
  name: Scalars['String'];
  profile?: Maybe<PlayerProfile>;
};

export type PlayerProfile = {
  __typename?: 'PlayerProfile';
  iconUrl?: Maybe<Scalars['String']>;
  introduction?: Maybe<Scalars['String']>;
  snsAccounts: Array<PlayerSnsAccount>;
};

export type PlayerSnsAccount = {
  __typename?: 'PlayerSnsAccount';
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  type: SnsType;
  url: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  chara?: Maybe<Chara>;
  charachip?: Maybe<Charachip>;
  charachips: Array<Charachip>;
  designer?: Maybe<Designer>;
  designers: Array<Designer>;
  directMessage?: Maybe<DirectMessage>;
  directMessageFavoriteGameParticipants: Array<GameParticipant>;
  directMessages: DirectMessages;
  game?: Maybe<Game>;
  gameDiaries: Array<GameParticipantDiary>;
  gameDiary?: Maybe<GameParticipantDiary>;
  gameParticipantFollowers: Array<GameParticipant>;
  gameParticipantFollows: Array<GameParticipant>;
  gameParticipantGroups: Array<GameParticipantGroup>;
  gameParticipantProfile: GameParticipantProfile;
  gameParticipantSetting: GameParticipantSetting;
  games: Array<SimpleGame>;
  message?: Maybe<Message>;
  messageFavoriteGameParticipants: Array<GameParticipant>;
  messageReplies: Array<Message>;
  messages: Messages;
  myGameParticipant?: Maybe<GameParticipant>;
  player?: Maybe<Player>;
};


export type QueryCharaArgs = {
  id: Scalars['ID'];
};


export type QueryCharachipArgs = {
  id: Scalars['ID'];
};


export type QueryCharachipsArgs = {
  query: CharachipsQuery;
};


export type QueryDesignerArgs = {
  id: Scalars['ID'];
};


export type QueryDesignersArgs = {
  query: DesignersQuery;
};


export type QueryDirectMessageArgs = {
  directMessageId: Scalars['ID'];
  gameId: Scalars['ID'];
};


export type QueryDirectMessageFavoriteGameParticipantsArgs = {
  directMessageId: Scalars['ID'];
  gameId: Scalars['ID'];
};


export type QueryDirectMessagesArgs = {
  gameId: Scalars['ID'];
  query: DirectMessagesQuery;
};


export type QueryGameArgs = {
  id: Scalars['ID'];
};


export type QueryGameDiariesArgs = {
  gameId: Scalars['ID'];
  query: GameDiariesQuery;
};


export type QueryGameDiaryArgs = {
  diaryId: Scalars['ID'];
  gameId: Scalars['ID'];
};


export type QueryGameParticipantFollowersArgs = {
  participantId: Scalars['ID'];
};


export type QueryGameParticipantFollowsArgs = {
  participantId: Scalars['ID'];
};


export type QueryGameParticipantGroupsArgs = {
  gameId: Scalars['ID'];
  query: GameParticipantGroupsQuery;
};


export type QueryGameParticipantProfileArgs = {
  participantId: Scalars['ID'];
};


export type QueryGameParticipantSettingArgs = {
  gameId: Scalars['ID'];
};


export type QueryGamesArgs = {
  query: GamesQuery;
};


export type QueryMessageArgs = {
  gameId: Scalars['ID'];
  messageId: Scalars['ID'];
};


export type QueryMessageFavoriteGameParticipantsArgs = {
  gameId: Scalars['ID'];
  messageId: Scalars['ID'];
};


export type QueryMessageRepliesArgs = {
  gameId: Scalars['ID'];
  messageId: Scalars['ID'];
};


export type QueryMessagesArgs = {
  gameId: Scalars['ID'];
  query: MessagesQuery;
};


export type QueryMyGameParticipantArgs = {
  gameId: Scalars['ID'];
};


export type QueryPlayerArgs = {
  id: Scalars['ID'];
};

export type RegisterCharaImagePayload = {
  __typename?: 'RegisterCharaImagePayload';
  charaImage: CharaImage;
};

export type RegisterCharaPayload = {
  __typename?: 'RegisterCharaPayload';
  chara: Chara;
};

export type RegisterCharachipPayload = {
  __typename?: 'RegisterCharachipPayload';
  charachip: Charachip;
};

export type RegisterDesignerPayload = {
  __typename?: 'RegisterDesignerPayload';
  designer: Designer;
};

export type RegisterDirectMessageFavoritePayload = {
  __typename?: 'RegisterDirectMessageFavoritePayload';
  ok: Scalars['Boolean'];
};

export type RegisterDirectMessagePayload = {
  __typename?: 'RegisterDirectMessagePayload';
  ok: Scalars['Boolean'];
};

export type RegisterGameMasterPayload = {
  __typename?: 'RegisterGameMasterPayload';
  gameMaster: GameMaster;
};

export type RegisterGameParticipantDiaryPayload = {
  __typename?: 'RegisterGameParticipantDiaryPayload';
  gameParticipantDiary: GameParticipantDiary;
};

export type RegisterGameParticipantFollowPayload = {
  __typename?: 'RegisterGameParticipantFollowPayload';
  ok: Scalars['Boolean'];
};

export type RegisterGameParticipantPayload = {
  __typename?: 'RegisterGameParticipantPayload';
  gameParticipant: GameParticipant;
};

export type RegisterGamePayload = {
  __typename?: 'RegisterGamePayload';
  game: Game;
};

export type RegisterMessageFavoritePayload = {
  __typename?: 'RegisterMessageFavoritePayload';
  ok: Scalars['Boolean'];
};

export type RegisterMessagePayload = {
  __typename?: 'RegisterMessagePayload';
  ok: Scalars['Boolean'];
};

export type RegisterPlayerProfilePayload = {
  __typename?: 'RegisterPlayerProfilePayload';
  playerProfile: PlayerProfile;
};

export type RegisterPlayerSnsAccountPayload = {
  __typename?: 'RegisterPlayerSnsAccountPayload';
  playerSnsAccount: PlayerSnsAccount;
};

export type SimpleGame = {
  __typename?: 'SimpleGame';
  id: Scalars['ID'];
  name: Scalars['String'];
  participantsCount: Scalars['Int'];
  periods: Array<GamePeriod>;
  settings: GameSettings;
  status: GameStatus;
};

export enum SnsType {
  Discord = 'Discord',
  Github = 'Github',
  Mastodon = 'Mastodon',
  Misskey = 'Misskey',
  Pixiv = 'Pixiv',
  Twitter = 'Twitter',
  WebSite = 'WebSite'
}

export type UpdateChara = {
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type UpdateCharaImage = {
  height: Scalars['Int'];
  id: Scalars['ID'];
  type: Scalars['String'];
  url: Scalars['String'];
  width: Scalars['Int'];
};

export type UpdateCharaImagePayload = {
  __typename?: 'UpdateCharaImagePayload';
  ok: Scalars['Boolean'];
};

export type UpdateCharaPayload = {
  __typename?: 'UpdateCharaPayload';
  ok: Scalars['Boolean'];
};

export type UpdateCharaSetting = {
  canOriginalCharacter: Scalars['Boolean'];
  charachipIds: Array<Scalars['Int']>;
};

export type UpdateCharachip = {
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type UpdateCharachipPayload = {
  __typename?: 'UpdateCharachipPayload';
  ok: Scalars['Boolean'];
};

export type UpdateDesigner = {
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type UpdateDesignerPayload = {
  __typename?: 'UpdateDesignerPayload';
  ok: Scalars['Boolean'];
};

export type UpdateGameCapacity = {
  max: Scalars['Int'];
  min: Scalars['Int'];
};

export type UpdateGameMaster = {
  id: Scalars['ID'];
  isProducer: Scalars['Boolean'];
};

export type UpdateGameMasterPayload = {
  __typename?: 'UpdateGameMasterPayload';
  ok: Scalars['Boolean'];
};

export type UpdateGameNotificationCondition = {
  participate: Scalars['Boolean'];
  start: Scalars['Boolean'];
};

export type UpdateGameParticipantDiary = {
  body: Scalars['String'];
  gameId: Scalars['ID'];
  id: Scalars['ID'];
  title: Scalars['String'];
};

export type UpdateGameParticipantDiaryPayload = {
  __typename?: 'UpdateGameParticipantDiaryPayload';
  ok: Scalars['Boolean'];
};

export type UpdateGameParticipantProfile = {
  gameParticipantId: Scalars['ID'];
  iconUrl?: InputMaybe<Scalars['String']>;
  introduction?: InputMaybe<Scalars['String']>;
  memo?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
};

export type UpdateGameParticipantProfilePayload = {
  __typename?: 'UpdateGameParticipantProfilePayload';
  ok: Scalars['Boolean'];
};

export type UpdateGameParticipantSetting = {
  gameParticipantId: Scalars['ID'];
  notification?: InputMaybe<UpdateNotificationCondition>;
};

export type UpdateGameParticipantSettingPayload = {
  __typename?: 'UpdateGameParticipantSettingPayload';
  ok: Scalars['Boolean'];
};

export type UpdateGamePasswordSetting = {
  password?: InputMaybe<Scalars['String']>;
};

export type UpdateGamePeriod = {
  endAt: Scalars['DateTime'];
  gameId: Scalars['ID'];
  name: Scalars['String'];
  startAt: Scalars['DateTime'];
};

export type UpdateGamePeriodPayload = {
  __typename?: 'UpdateGamePeriodPayload';
  ok: Scalars['Boolean'];
};

export type UpdateGameRuleSetting = {
  canSendDirectMessage: Scalars['Boolean'];
  canShorten: Scalars['Boolean'];
  isGameMasterProducer: Scalars['Boolean'];
};

export type UpdateGameSetting = {
  gameId: Scalars['ID'];
  settings: UpdateGameSettings;
};

export type UpdateGameSettingPayload = {
  __typename?: 'UpdateGameSettingPayload';
  ok: Scalars['Boolean'];
};

export type UpdateGameSettings = {
  capacity: UpdateGameCapacity;
  chara: UpdateCharaSetting;
  password: UpdateGamePasswordSetting;
  rule: UpdateGameRuleSetting;
  time: UpdateGameTimeSetting;
};

export type UpdateGameStatus = {
  gameId: Scalars['ID'];
  status: GameStatus;
};

export type UpdateGameStatusPayload = {
  __typename?: 'UpdateGameStatusPayload';
  ok: Scalars['Boolean'];
};

export type UpdateGameTimeSetting = {
  openAt: Scalars['DateTime'];
  periodIntervalSeconds: Scalars['Int'];
  periodPrefix?: InputMaybe<Scalars['String']>;
  periodSuffix?: InputMaybe<Scalars['String']>;
  startGameAt: Scalars['DateTime'];
  startParticipateAt: Scalars['DateTime'];
};

export type UpdateMessageNotificationCondition = {
  directMessage: Scalars['Boolean'];
  keywords: Array<Scalars['String']>;
  reply: Scalars['Boolean'];
};

export type UpdateNotificationCondition = {
  discordWebhookUrl?: InputMaybe<Scalars['String']>;
  game: UpdateGameNotificationCondition;
  message: UpdateMessageNotificationCondition;
};

export type UpdatePlayerProfile = {
  iconUrl?: InputMaybe<Scalars['String']>;
  introduction?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
};

export type UpdatePlayerProfilePayload = {
  __typename?: 'UpdatePlayerProfilePayload';
  ok: Scalars['Boolean'];
};

export type UpdatePlayerSnsAccount = {
  accountName: Scalars['String'];
  accountUrl: Scalars['String'];
  id: Scalars['ID'];
  type: SnsType;
};

export type UpdatePlayerSnsAccountPayload = {
  __typename?: 'UpdatePlayerSnsAccountPayload';
  ok: Scalars['Boolean'];
};

export type GameQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GameQuery = { __typename?: 'Query', game?: { __typename?: 'Game', id: string, name: string, participants: Array<{ __typename?: 'GameParticipant', id: string }> } | null };

export type GamesQueryVariables = Exact<{
  pageSize: Scalars['Int'];
  pageNumber: Scalars['Int'];
}>;


export type GamesQuery = { __typename?: 'Query', games: Array<{ __typename?: 'SimpleGame', id: string, name: string, participantsCount: number }> };

export type RegisterGameMutationVariables = Exact<{
  input: NewGame;
}>;


export type RegisterGameMutation = { __typename?: 'Mutation', registerGame: { __typename?: 'RegisterGamePayload', game: { __typename?: 'Game', id: string, name: string, participants: Array<{ __typename?: 'GameParticipant', id: string }> } } };


export const GameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"game"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"game"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"participants"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"paging"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"IntValue","value":"10"}},{"kind":"ObjectField","name":{"kind":"Name","value":"pageNumber"},"value":{"kind":"IntValue","value":"1"}},{"kind":"ObjectField","name":{"kind":"Name","value":"isDesc"},"value":{"kind":"BooleanValue","value":true}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<GameQuery, GameQueryVariables>;
export const GamesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"games"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageNumber"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"games"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"paging"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"pageNumber"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageNumber"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"isDesc"},"value":{"kind":"BooleanValue","value":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"participantsCount"}}]}}]}}]} as unknown as DocumentNode<GamesQuery, GamesQueryVariables>;
export const RegisterGameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"registerGame"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NewGame"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registerGame"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"game"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"participants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]} as unknown as DocumentNode<RegisterGameMutation, RegisterGameMutationVariables>;