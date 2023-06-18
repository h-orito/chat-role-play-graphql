/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string | number; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  Long: { input: any; output: any; }
};

export type Chara = {
  __typename?: 'Chara';
  id: Scalars['ID']['output'];
  images: Array<CharaImage>;
  name: Scalars['String']['output'];
};

export type CharaImage = {
  __typename?: 'CharaImage';
  id: Scalars['ID']['output'];
  size: CharaSize;
  type: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type CharaSize = {
  __typename?: 'CharaSize';
  height: Scalars['Int']['output'];
  width: Scalars['Int']['output'];
};

export type Charachip = {
  __typename?: 'Charachip';
  charas: Array<Chara>;
  designer: Designer;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type CharachipsQuery = {
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  paging?: InputMaybe<PageableQuery>;
};

export type DeleteDirectMessageFavorite = {
  directMessageId: Scalars['ID']['input'];
  gameId: Scalars['ID']['input'];
};

export type DeleteDirectMessageFavoritePayload = {
  __typename?: 'DeleteDirectMessageFavoritePayload';
  ok: Scalars['Boolean']['output'];
};

export type DeleteGameMaster = {
  id: Scalars['ID']['input'];
};

export type DeleteGameMasterPayload = {
  __typename?: 'DeleteGameMasterPayload';
  ok: Scalars['Boolean']['output'];
};

export type DeleteGameParticipant = {
  gameId: Scalars['ID']['input'];
};

export type DeleteGameParticipantFollow = {
  gameId: Scalars['ID']['input'];
  targetGameParticipantId: Scalars['ID']['input'];
};

export type DeleteGameParticipantFollowPayload = {
  __typename?: 'DeleteGameParticipantFollowPayload';
  ok: Scalars['Boolean']['output'];
};

export type DeleteGameParticipantPayload = {
  __typename?: 'DeleteGameParticipantPayload';
  ok: Scalars['Boolean']['output'];
};

export type DeleteMessageFavorite = {
  gameId: Scalars['ID']['input'];
  messageId: Scalars['ID']['input'];
};

export type DeleteMessageFavoritePayload = {
  __typename?: 'DeleteMessageFavoritePayload';
  ok: Scalars['Boolean']['output'];
};

export type DeletePlayerSnsAccount = {
  id: Scalars['ID']['input'];
};

export type DeletePlayerSnsAccountPayload = {
  __typename?: 'DeletePlayerSnsAccountPayload';
  ok: Scalars['Boolean']['output'];
};

export type Designer = {
  __typename?: 'Designer';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type DesignersQuery = {
  Name?: InputMaybe<Scalars['String']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  paging?: InputMaybe<PageableQuery>;
};

export type DirectMessage = {
  __typename?: 'DirectMessage';
  content: MessageContent;
  id: Scalars['ID']['output'];
  participantGroupId: Scalars['ID']['output'];
  reactions: DirectMessageReactions;
  sender: MessageSender;
  time: MessageTime;
};

export type DirectMessageReactions = {
  __typename?: 'DirectMessageReactions';
  favoriteCounts: Scalars['Int']['output'];
};

export type DirectMessages = Pageable & {
  __typename?: 'DirectMessages';
  allPageCount: Scalars['Int']['output'];
  currentPageNumber?: Maybe<Scalars['Int']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPrePage: Scalars['Boolean']['output'];
  isDesc: Scalars['Boolean']['output'];
  list: Array<DirectMessage>;
};

export type DirectMessagesQuery = {
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  keywords?: InputMaybe<Array<Scalars['String']['input']>>;
  offsetUnixTimeMilli?: InputMaybe<Scalars['Long']['input']>;
  paging?: InputMaybe<PageableQuery>;
  participantGroupId: Scalars['ID']['input'];
  periodId?: InputMaybe<Scalars['ID']['input']>;
  senderIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  sinceAt?: InputMaybe<Scalars['DateTime']['input']>;
  types?: InputMaybe<Array<MessageType>>;
  untilAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type Game = {
  __typename?: 'Game';
  gameMasters: Array<GameMaster>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
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
  max: Scalars['Int']['output'];
  min: Scalars['Int']['output'];
};

export type GameCharaSetting = {
  __typename?: 'GameCharaSetting';
  canOriginalCharacter: Scalars['Boolean']['output'];
  charachips: Array<Charachip>;
};

export type GameDiariesQuery = {
  participantId?: InputMaybe<Scalars['ID']['input']>;
  periodId?: InputMaybe<Scalars['ID']['input']>;
};

export type GameMaster = {
  __typename?: 'GameMaster';
  id: Scalars['ID']['output'];
  isProducer: Scalars['Boolean']['output'];
  player: Player;
};

export type GameNotificationCondition = {
  __typename?: 'GameNotificationCondition';
  participate: Scalars['Boolean']['output'];
  start: Scalars['Boolean']['output'];
};

export type GameParticipant = {
  __typename?: 'GameParticipant';
  chara: Chara;
  entryNumber: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  isGone: Scalars['Boolean']['output'];
  lastAccessedAt: Scalars['DateTime']['output'];
  name: Scalars['String']['output'];
  player: Player;
};

export type GameParticipantDiary = {
  __typename?: 'GameParticipantDiary';
  body: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  participant: GameParticipant;
  period: GamePeriod;
  title: Scalars['String']['output'];
};

export type GameParticipantGroup = {
  __typename?: 'GameParticipantGroup';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  participants: Array<GameParticipant>;
};

export type GameParticipantGroupsQuery = {
  memberParticipantId?: InputMaybe<Scalars['ID']['input']>;
};

export type GameParticipantProfile = {
  __typename?: 'GameParticipantProfile';
  followersCount: Scalars['Int']['output'];
  followsCount: Scalars['Int']['output'];
  iconUrl?: Maybe<Scalars['String']['output']>;
  introduction?: Maybe<Scalars['String']['output']>;
  memo?: Maybe<Scalars['String']['output']>;
};

export type GameParticipantSetting = {
  __typename?: 'GameParticipantSetting';
  notification: NotificationCondition;
};

export type GamePasswordSetting = {
  __typename?: 'GamePasswordSetting';
  hasPassword: Scalars['Boolean']['output'];
};

export type GamePeriod = {
  __typename?: 'GamePeriod';
  count: Scalars['Int']['output'];
  endAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  startAt: Scalars['DateTime']['output'];
};

export type GameRuleSetting = {
  __typename?: 'GameRuleSetting';
  canSendDirectMessage: Scalars['Boolean']['output'];
  canShorten: Scalars['Boolean']['output'];
  isGameMasterProducer: Scalars['Boolean']['output'];
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
  openAt: Scalars['DateTime']['output'];
  periodIntervalSeconds: Scalars['Int']['output'];
  periodPrefix?: Maybe<Scalars['String']['output']>;
  periodSuffix?: Maybe<Scalars['String']['output']>;
  startGameAt: Scalars['DateTime']['output'];
  startParticipateAt: Scalars['DateTime']['output'];
};

export type GamesQuery = {
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  paging?: InputMaybe<PageableQuery>;
};

export type Message = {
  __typename?: 'Message';
  content: MessageContent;
  id: Scalars['ID']['output'];
  reactions: MessageReactions;
  replyTo: MessageRecipient;
  sender: MessageSender;
  time: MessageTime;
};

export type MessageContent = {
  __typename?: 'MessageContent';
  isConvertDisabled: Scalars['Boolean']['output'];
  number: Scalars['Int']['output'];
  text: Scalars['String']['output'];
  type: MessageType;
};

export type MessageNotificationCondition = {
  __typename?: 'MessageNotificationCondition';
  directMessage: Scalars['Boolean']['output'];
  keywords: Array<Scalars['String']['output']>;
  reply: Scalars['Boolean']['output'];
};

export type MessageReactions = {
  __typename?: 'MessageReactions';
  favoriteCount: Scalars['Int']['output'];
  replyCount: Scalars['Int']['output'];
};

export type MessageRecipient = {
  __typename?: 'MessageRecipient';
  messageId: Scalars['ID']['output'];
  participantId: Scalars['ID']['output'];
};

export type MessageSender = {
  __typename?: 'MessageSender';
  charaImage: CharaImage;
  charaName: Scalars['String']['output'];
  participantId: Scalars['ID']['output'];
};

export type MessageTime = {
  __typename?: 'MessageTime';
  sendAt: Scalars['DateTime']['output'];
  sendUnixTimeMilli: Scalars['Long']['output'];
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
  allPageCount: Scalars['Int']['output'];
  currentPageNumber?: Maybe<Scalars['Int']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPrePage: Scalars['Boolean']['output'];
  isDesc: Scalars['Boolean']['output'];
  list: Array<Message>;
};

export type MessagesQuery = {
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  keywords?: InputMaybe<Array<Scalars['String']['input']>>;
  offsetUnixTimeMilli?: InputMaybe<Scalars['Long']['input']>;
  paging?: InputMaybe<PageableQuery>;
  periodId?: InputMaybe<Scalars['ID']['input']>;
  replyToMessageId?: InputMaybe<Scalars['ID']['input']>;
  senderIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  sinceAt?: InputMaybe<Scalars['DateTime']['input']>;
  types?: InputMaybe<Array<MessageType>>;
  untilAt?: InputMaybe<Scalars['DateTime']['input']>;
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
  charachipId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type NewCharaImage = {
  charaId: Scalars['ID']['input'];
  height: Scalars['Int']['input'];
  type: Scalars['String']['input'];
  url: Scalars['String']['input'];
  width: Scalars['Int']['input'];
};

export type NewCharachip = {
  designerId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type NewDesigner = {
  name: Scalars['String']['input'];
};

export type NewDirectMessage = {
  charaImageId: Scalars['ID']['input'];
  charaName: Scalars['String']['input'];
  gameId: Scalars['ID']['input'];
  gameParticipantGroupId: Scalars['ID']['input'];
  isConvertDisabled: Scalars['Boolean']['input'];
  text: Scalars['String']['input'];
  type: MessageType;
};

export type NewDirectMessageFavorite = {
  directMessageId: Scalars['ID']['input'];
  gameId: Scalars['ID']['input'];
};

export type NewGame = {
  name: Scalars['String']['input'];
  settings: NewGameSettings;
};

export type NewGameCapacity = {
  max: Scalars['Int']['input'];
  min: Scalars['Int']['input'];
};

export type NewGameCharaSetting = {
  canOriginalCharacter: Scalars['Boolean']['input'];
  charachipIds: Array<Scalars['Int']['input']>;
};

export type NewGameMaster = {
  gameId: Scalars['ID']['input'];
  isProducer: Scalars['Boolean']['input'];
  playerId: Scalars['ID']['input'];
};

export type NewGameParticipant = {
  Name: Scalars['String']['input'];
  charaId: Scalars['ID']['input'];
  gameId: Scalars['ID']['input'];
};

export type NewGameParticipantDiary = {
  body: Scalars['String']['input'];
  gameId: Scalars['ID']['input'];
  periodId: Scalars['ID']['input'];
  title: Scalars['String']['input'];
};

export type NewGameParticipantFollow = {
  gameId: Scalars['ID']['input'];
  targetGameParticipantId: Scalars['ID']['input'];
};

export type NewGamePasswordSetting = {
  password?: InputMaybe<Scalars['String']['input']>;
};

export type NewGameRuleSetting = {
  canSendDirectMessage: Scalars['Boolean']['input'];
  canShorten: Scalars['Boolean']['input'];
  isGameMasterProducer: Scalars['Boolean']['input'];
};

export type NewGameSettings = {
  capacity: NewGameCapacity;
  chara: NewGameCharaSetting;
  password: NewGamePasswordSetting;
  rule: NewGameRuleSetting;
  time: NewGameTimeSetting;
};

export type NewGameTimeSetting = {
  openAt: Scalars['DateTime']['input'];
  periodIntervalSeconds: Scalars['Int']['input'];
  periodPrefix?: InputMaybe<Scalars['String']['input']>;
  periodSuffix?: InputMaybe<Scalars['String']['input']>;
  startGameAt: Scalars['DateTime']['input'];
  startParticipateAt: Scalars['DateTime']['input'];
};

export type NewMessage = {
  charaImageId: Scalars['ID']['input'];
  charaName: Scalars['String']['input'];
  gameId: Scalars['ID']['input'];
  isConvertDisabled: Scalars['Boolean']['input'];
  replyToMessageId?: InputMaybe<Scalars['ID']['input']>;
  text: Scalars['String']['input'];
  type: MessageType;
};

export type NewMessageFavorite = {
  gameId: Scalars['ID']['input'];
  messageId: Scalars['ID']['input'];
};

export type NewPlayerProfile = {
  iconUrl?: InputMaybe<Scalars['String']['input']>;
  introduction?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type NewPlayerSnsAccount = {
  accountName: Scalars['String']['input'];
  accountUrl: Scalars['String']['input'];
  type: SnsType;
};

export type NotificationCondition = {
  __typename?: 'NotificationCondition';
  discordWebhookUrl?: Maybe<Scalars['String']['output']>;
  game: GameNotificationCondition;
  message: MessageNotificationCondition;
};

export type Pageable = {
  allPageCount: Scalars['Int']['output'];
  currentPageNumber?: Maybe<Scalars['Int']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPrePage: Scalars['Boolean']['output'];
  isDesc: Scalars['Boolean']['output'];
};

export type PageableQuery = {
  isDesc: Scalars['Boolean']['input'];
  pageNumber: Scalars['Int']['input'];
  pageSize: Scalars['Int']['input'];
};

export type ParticipantsQuery = {
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  paging?: InputMaybe<PageableQuery>;
  playerIds?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type Player = {
  __typename?: 'Player';
  designer?: Maybe<Designer>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  profile?: Maybe<PlayerProfile>;
};

export type PlayerProfile = {
  __typename?: 'PlayerProfile';
  iconUrl?: Maybe<Scalars['String']['output']>;
  introduction?: Maybe<Scalars['String']['output']>;
  snsAccounts: Array<PlayerSnsAccount>;
};

export type PlayerSnsAccount = {
  __typename?: 'PlayerSnsAccount';
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  type: SnsType;
  url: Scalars['String']['output'];
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
  id: Scalars['ID']['input'];
};


export type QueryCharachipArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCharachipsArgs = {
  query: CharachipsQuery;
};


export type QueryDesignerArgs = {
  id: Scalars['ID']['input'];
};


export type QueryDesignersArgs = {
  query: DesignersQuery;
};


export type QueryDirectMessageArgs = {
  directMessageId: Scalars['ID']['input'];
  gameId: Scalars['ID']['input'];
};


export type QueryDirectMessageFavoriteGameParticipantsArgs = {
  directMessageId: Scalars['ID']['input'];
  gameId: Scalars['ID']['input'];
};


export type QueryDirectMessagesArgs = {
  gameId: Scalars['ID']['input'];
  query: DirectMessagesQuery;
};


export type QueryGameArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGameDiariesArgs = {
  gameId: Scalars['ID']['input'];
  query: GameDiariesQuery;
};


export type QueryGameDiaryArgs = {
  diaryId: Scalars['ID']['input'];
  gameId: Scalars['ID']['input'];
};


export type QueryGameParticipantFollowersArgs = {
  participantId: Scalars['ID']['input'];
};


export type QueryGameParticipantFollowsArgs = {
  participantId: Scalars['ID']['input'];
};


export type QueryGameParticipantGroupsArgs = {
  gameId: Scalars['ID']['input'];
  query: GameParticipantGroupsQuery;
};


export type QueryGameParticipantProfileArgs = {
  participantId: Scalars['ID']['input'];
};


export type QueryGameParticipantSettingArgs = {
  gameId: Scalars['ID']['input'];
};


export type QueryGamesArgs = {
  query: GamesQuery;
};


export type QueryMessageArgs = {
  gameId: Scalars['ID']['input'];
  messageId: Scalars['ID']['input'];
};


export type QueryMessageFavoriteGameParticipantsArgs = {
  gameId: Scalars['ID']['input'];
  messageId: Scalars['ID']['input'];
};


export type QueryMessageRepliesArgs = {
  gameId: Scalars['ID']['input'];
  messageId: Scalars['ID']['input'];
};


export type QueryMessagesArgs = {
  gameId: Scalars['ID']['input'];
  query: MessagesQuery;
};


export type QueryMyGameParticipantArgs = {
  gameId: Scalars['ID']['input'];
};


export type QueryPlayerArgs = {
  id: Scalars['ID']['input'];
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
  ok: Scalars['Boolean']['output'];
};

export type RegisterDirectMessagePayload = {
  __typename?: 'RegisterDirectMessagePayload';
  ok: Scalars['Boolean']['output'];
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
  ok: Scalars['Boolean']['output'];
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
  ok: Scalars['Boolean']['output'];
};

export type RegisterMessagePayload = {
  __typename?: 'RegisterMessagePayload';
  ok: Scalars['Boolean']['output'];
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
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  participantsCount: Scalars['Int']['output'];
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
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type UpdateCharaImage = {
  height: Scalars['Int']['input'];
  id: Scalars['ID']['input'];
  type: Scalars['String']['input'];
  url: Scalars['String']['input'];
  width: Scalars['Int']['input'];
};

export type UpdateCharaImagePayload = {
  __typename?: 'UpdateCharaImagePayload';
  ok: Scalars['Boolean']['output'];
};

export type UpdateCharaPayload = {
  __typename?: 'UpdateCharaPayload';
  ok: Scalars['Boolean']['output'];
};

export type UpdateCharaSetting = {
  canOriginalCharacter: Scalars['Boolean']['input'];
  charachipIds: Array<Scalars['Int']['input']>;
};

export type UpdateCharachip = {
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type UpdateCharachipPayload = {
  __typename?: 'UpdateCharachipPayload';
  ok: Scalars['Boolean']['output'];
};

export type UpdateDesigner = {
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type UpdateDesignerPayload = {
  __typename?: 'UpdateDesignerPayload';
  ok: Scalars['Boolean']['output'];
};

export type UpdateGameCapacity = {
  max: Scalars['Int']['input'];
  min: Scalars['Int']['input'];
};

export type UpdateGameMaster = {
  id: Scalars['ID']['input'];
  isProducer: Scalars['Boolean']['input'];
};

export type UpdateGameMasterPayload = {
  __typename?: 'UpdateGameMasterPayload';
  ok: Scalars['Boolean']['output'];
};

export type UpdateGameNotificationCondition = {
  participate: Scalars['Boolean']['input'];
  start: Scalars['Boolean']['input'];
};

export type UpdateGameParticipantDiary = {
  body: Scalars['String']['input'];
  gameId: Scalars['ID']['input'];
  id: Scalars['ID']['input'];
  title: Scalars['String']['input'];
};

export type UpdateGameParticipantDiaryPayload = {
  __typename?: 'UpdateGameParticipantDiaryPayload';
  ok: Scalars['Boolean']['output'];
};

export type UpdateGameParticipantProfile = {
  gameParticipantId: Scalars['ID']['input'];
  iconUrl?: InputMaybe<Scalars['String']['input']>;
  introduction?: InputMaybe<Scalars['String']['input']>;
  memo?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type UpdateGameParticipantProfilePayload = {
  __typename?: 'UpdateGameParticipantProfilePayload';
  ok: Scalars['Boolean']['output'];
};

export type UpdateGameParticipantSetting = {
  gameParticipantId: Scalars['ID']['input'];
  notification?: InputMaybe<UpdateNotificationCondition>;
};

export type UpdateGameParticipantSettingPayload = {
  __typename?: 'UpdateGameParticipantSettingPayload';
  ok: Scalars['Boolean']['output'];
};

export type UpdateGamePasswordSetting = {
  password?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateGamePeriod = {
  endAt: Scalars['DateTime']['input'];
  gameId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  startAt: Scalars['DateTime']['input'];
};

export type UpdateGamePeriodPayload = {
  __typename?: 'UpdateGamePeriodPayload';
  ok: Scalars['Boolean']['output'];
};

export type UpdateGameRuleSetting = {
  canSendDirectMessage: Scalars['Boolean']['input'];
  canShorten: Scalars['Boolean']['input'];
  isGameMasterProducer: Scalars['Boolean']['input'];
};

export type UpdateGameSetting = {
  gameId: Scalars['ID']['input'];
  settings: UpdateGameSettings;
};

export type UpdateGameSettingPayload = {
  __typename?: 'UpdateGameSettingPayload';
  ok: Scalars['Boolean']['output'];
};

export type UpdateGameSettings = {
  capacity: UpdateGameCapacity;
  chara: UpdateCharaSetting;
  password: UpdateGamePasswordSetting;
  rule: UpdateGameRuleSetting;
  time: UpdateGameTimeSetting;
};

export type UpdateGameStatus = {
  gameId: Scalars['ID']['input'];
  status: GameStatus;
};

export type UpdateGameStatusPayload = {
  __typename?: 'UpdateGameStatusPayload';
  ok: Scalars['Boolean']['output'];
};

export type UpdateGameTimeSetting = {
  openAt: Scalars['DateTime']['input'];
  periodIntervalSeconds: Scalars['Int']['input'];
  periodPrefix?: InputMaybe<Scalars['String']['input']>;
  periodSuffix?: InputMaybe<Scalars['String']['input']>;
  startGameAt: Scalars['DateTime']['input'];
  startParticipateAt: Scalars['DateTime']['input'];
};

export type UpdateMessageNotificationCondition = {
  directMessage: Scalars['Boolean']['input'];
  keywords: Array<Scalars['String']['input']>;
  reply: Scalars['Boolean']['input'];
};

export type UpdateNotificationCondition = {
  discordWebhookUrl?: InputMaybe<Scalars['String']['input']>;
  game: UpdateGameNotificationCondition;
  message: UpdateMessageNotificationCondition;
};

export type UpdatePlayerProfile = {
  iconUrl?: InputMaybe<Scalars['String']['input']>;
  introduction?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type UpdatePlayerProfilePayload = {
  __typename?: 'UpdatePlayerProfilePayload';
  ok: Scalars['Boolean']['output'];
};

export type UpdatePlayerSnsAccount = {
  accountName: Scalars['String']['input'];
  accountUrl: Scalars['String']['input'];
  id: Scalars['ID']['input'];
  type: SnsType;
};

export type UpdatePlayerSnsAccountPayload = {
  __typename?: 'UpdatePlayerSnsAccountPayload';
  ok: Scalars['Boolean']['output'];
};

export type GameQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GameQuery = { __typename?: 'Query', game?: { __typename?: 'Game', id: string, name: string, status: GameStatus, participants: Array<{ __typename?: 'GameParticipant', id: string }>, periods: Array<{ __typename?: 'GamePeriod', id: string }>, settings: { __typename?: 'GameSettings', chara: { __typename?: 'GameCharaSetting', canOriginalCharacter: boolean }, capacity: { __typename?: 'GameCapacity', min: number, max: number }, rule: { __typename?: 'GameRuleSetting', canShorten: boolean, canSendDirectMessage: boolean }, time: { __typename?: 'GameTimeSetting', periodPrefix?: string | null, periodSuffix?: string | null, periodIntervalSeconds: number, openAt: any, startParticipateAt: any, startGameAt: any }, password: { __typename?: 'GamePasswordSetting', hasPassword: boolean } } } | null };

export type IndexGamesQueryVariables = Exact<{
  pageSize: Scalars['Int']['input'];
  pageNumber: Scalars['Int']['input'];
}>;


export type IndexGamesQuery = { __typename?: 'Query', games: Array<{ __typename?: 'SimpleGame', id: string, name: string, participantsCount: number }> };


export const GameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Game"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"game"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"participants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"periods"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chara"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canOriginalCharacter"}}]}},{"kind":"Field","name":{"kind":"Name","value":"capacity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"min"}},{"kind":"Field","name":{"kind":"Name","value":"max"}}]}},{"kind":"Field","name":{"kind":"Name","value":"rule"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canShorten"}},{"kind":"Field","name":{"kind":"Name","value":"canSendDirectMessage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"time"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"periodPrefix"}},{"kind":"Field","name":{"kind":"Name","value":"periodSuffix"}},{"kind":"Field","name":{"kind":"Name","value":"periodIntervalSeconds"}},{"kind":"Field","name":{"kind":"Name","value":"openAt"}},{"kind":"Field","name":{"kind":"Name","value":"startParticipateAt"}},{"kind":"Field","name":{"kind":"Name","value":"startGameAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"password"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasPassword"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GameQuery, GameQueryVariables>;
export const IndexGamesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"IndexGames"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageNumber"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"games"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"paging"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"pageNumber"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageNumber"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"isDesc"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"participantsCount"}}]}}]}}]} as unknown as DocumentNode<IndexGamesQuery, IndexGamesQueryVariables>;