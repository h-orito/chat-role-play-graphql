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
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  Long: { input: any; output: any; }
  Upload: { input: any; output: any; }
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

export type DeleteGameParticipantIcon = {
  gameId: Scalars['ID']['input'];
  iconId: Scalars['ID']['input'];
};

export type DeleteGameParticipantIconPayload = {
  __typename?: 'DeleteGameParticipantIconPayload';
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
  favoriteParticipantIds: Array<Scalars['ID']['output']>;
};

export type DirectMessages = Pageable & {
  __typename?: 'DirectMessages';
  allPageCount: Scalars['Int']['output'];
  currentPageNumber?: Maybe<Scalars['Int']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPrePage: Scalars['Boolean']['output'];
  isDesc: Scalars['Boolean']['output'];
  latestUnixTimeMilli: Scalars['Long']['output'];
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
  entryNumber: Scalars['Int']['output'];
  followParticipantIds: Array<Scalars['ID']['output']>;
  followerParticipantIds: Array<Scalars['ID']['output']>;
  id: Scalars['ID']['output'];
  isGone: Scalars['Boolean']['output'];
  lastAccessedAt: Scalars['DateTime']['output'];
  memo?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  player: Player;
  profileIcon?: Maybe<GameParticipantIcon>;
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
  latestUnixTimeMilli: Scalars['Long']['output'];
  name: Scalars['String']['output'];
  participants: Array<GameParticipant>;
};

export type GameParticipantGroupsQuery = {
  memberParticipantId?: InputMaybe<Scalars['ID']['input']>;
};

export type GameParticipantIcon = {
  __typename?: 'GameParticipantIcon';
  displayOrder: Scalars['Int']['output'];
  height: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  url: Scalars['String']['output'];
  width: Scalars['Int']['output'];
};

export type GameParticipantProfile = {
  __typename?: 'GameParticipantProfile';
  followersCount: Scalars['Int']['output'];
  followsCount: Scalars['Int']['output'];
  introduction?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  participantId: Scalars['ID']['output'];
  profileImageUrl?: Maybe<Scalars['String']['output']>;
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
  statuses?: InputMaybe<Array<GameStatus>>;
};

export type Message = {
  __typename?: 'Message';
  content: MessageContent;
  id: Scalars['ID']['output'];
  reactions: MessageReactions;
  replyTo?: Maybe<MessageRecipient>;
  sender?: Maybe<MessageSender>;
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
  favoriteParticipantIds: Array<Scalars['ID']['output']>;
  replyCount: Scalars['Int']['output'];
};

export type MessageRecipient = {
  __typename?: 'MessageRecipient';
  messageId: Scalars['ID']['output'];
  participantId: Scalars['ID']['output'];
};

export type MessageSender = {
  __typename?: 'MessageSender';
  icon: GameParticipantIcon;
  name: Scalars['String']['output'];
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
  latestUnixTimeMilli: Scalars['Long']['output'];
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
  deleteGameParticipantIcon: DeleteGameParticipantIconPayload;
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
  registerGameParticipantGroup: RegisterGameParticipantGroupPayload;
  registerGameParticipantIcon: RegisterGameParticipantIconPayload;
  registerMessage: RegisterMessagePayload;
  registerMessageFavorite: RegisterMessageFavoritePayload;
  registerPlayerSnsAccount: RegisterPlayerSnsAccountPayload;
  updateChara: UpdateCharaPayload;
  updateCharaImage: UpdateCharaImagePayload;
  updateCharachip: UpdateCharachipPayload;
  updateDesigner: UpdateDesignerPayload;
  updateGameMaster: UpdateGameMasterPayload;
  updateGameParticipantDiary: UpdateGameParticipantDiaryPayload;
  updateGameParticipantGroup: UpdateGameParticipantGroupPayload;
  updateGameParticipantIcon: UpdateGameParticipantIconPayload;
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


export type MutationDeleteGameParticipantIconArgs = {
  input: DeleteGameParticipantIcon;
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


export type MutationRegisterGameParticipantGroupArgs = {
  input: NewGameParticipantGroup;
};


export type MutationRegisterGameParticipantIconArgs = {
  input: NewGameParticipantIcon;
};


export type MutationRegisterMessageArgs = {
  input: NewMessage;
};


export type MutationRegisterMessageFavoriteArgs = {
  input: NewMessageFavorite;
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


export type MutationUpdateGameParticipantGroupArgs = {
  input: UpdateGameParticipantGroup;
};


export type MutationUpdateGameParticipantIconArgs = {
  input: UpdateGameParticipantIcon;
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
  file: Scalars['Upload']['input'];
  height: Scalars['Int']['input'];
  type: Scalars['String']['input'];
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
  gameId: Scalars['ID']['input'];
  gameParticipantGroupId: Scalars['ID']['input'];
  iconId: Scalars['ID']['input'];
  isConvertDisabled: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
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
  charaId?: InputMaybe<Scalars['ID']['input']>;
  gameId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
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

export type NewGameParticipantGroup = {
  gameId: Scalars['ID']['input'];
  gameParticipantIds: Array<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
};

export type NewGameParticipantIcon = {
  gameId: Scalars['ID']['input'];
  height: Scalars['Int']['input'];
  iconFile: Scalars['Upload']['input'];
  width: Scalars['Int']['input'];
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
  gameId: Scalars['ID']['input'];
  iconId: Scalars['ID']['input'];
  isConvertDisabled: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
  replyToMessageId?: InputMaybe<Scalars['ID']['input']>;
  text: Scalars['String']['input'];
  type: MessageType;
};

export type NewMessageFavorite = {
  gameId: Scalars['ID']['input'];
  messageId: Scalars['ID']['input'];
};

export type NewPlayerProfile = {
  introduction?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  profileImageFile?: InputMaybe<Scalars['Upload']['input']>;
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
  introduction?: Maybe<Scalars['String']['output']>;
  profileImageUrl?: Maybe<Scalars['String']['output']>;
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
  directMessagesLatestUnixTimeMilli: Scalars['Long']['output'];
  game?: Maybe<Game>;
  gameDiaries: Array<GameParticipantDiary>;
  gameDiary?: Maybe<GameParticipantDiary>;
  gameParticipantFollowers: Array<GameParticipant>;
  gameParticipantFollows: Array<GameParticipant>;
  gameParticipantGroups: Array<GameParticipantGroup>;
  gameParticipantIcons: Array<GameParticipantIcon>;
  gameParticipantProfile: GameParticipantProfile;
  gameParticipantSetting: GameParticipantSetting;
  games: Array<SimpleGame>;
  message?: Maybe<Message>;
  messageFavoriteGameParticipants: Array<GameParticipant>;
  messageReplies: Array<Message>;
  messages: Messages;
  messagesLatestUnixTimeMilli: Scalars['Long']['output'];
  myGameParticipant?: Maybe<GameParticipant>;
  myPlayer?: Maybe<Player>;
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


export type QueryDirectMessagesLatestUnixTimeMilliArgs = {
  gameId: Scalars['ID']['input'];
  query: DirectMessagesQuery;
};


export type QueryGameArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGameDiariesArgs = {
  query: GameDiariesQuery;
};


export type QueryGameDiaryArgs = {
  diaryId: Scalars['ID']['input'];
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


export type QueryGameParticipantIconsArgs = {
  participantId: Scalars['ID']['input'];
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


export type QueryMessagesLatestUnixTimeMilliArgs = {
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

export type RegisterGameParticipantGroupPayload = {
  __typename?: 'RegisterGameParticipantGroupPayload';
  gameParticipantGroup: GameParticipantGroup;
};

export type RegisterGameParticipantIconPayload = {
  __typename?: 'RegisterGameParticipantIconPayload';
  gameParticipantIcon: GameParticipantIcon;
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
  file: Scalars['Upload']['input'];
  height: Scalars['Int']['input'];
  id: Scalars['ID']['input'];
  type: Scalars['String']['input'];
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

export type UpdateGameParticipantGroup = {
  gameId: Scalars['ID']['input'];
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type UpdateGameParticipantGroupPayload = {
  __typename?: 'UpdateGameParticipantGroupPayload';
  ok: Scalars['Boolean']['output'];
};

export type UpdateGameParticipantIcon = {
  displayOrder: Scalars['Int']['input'];
  gameId: Scalars['ID']['input'];
  id: Scalars['ID']['input'];
};

export type UpdateGameParticipantIconPayload = {
  __typename?: 'UpdateGameParticipantIconPayload';
  ok: Scalars['Boolean']['output'];
};

export type UpdateGameParticipantProfile = {
  gameId: Scalars['ID']['input'];
  introduction?: InputMaybe<Scalars['String']['input']>;
  memo?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  profileIconId?: InputMaybe<Scalars['ID']['input']>;
  profileImageFile?: InputMaybe<Scalars['Upload']['input']>;
  profileImageUrl?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateGameParticipantProfilePayload = {
  __typename?: 'UpdateGameParticipantProfilePayload';
  ok: Scalars['Boolean']['output'];
};

export type UpdateGameParticipantSetting = {
  gameId: Scalars['ID']['input'];
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
  introduction?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  profileImageFile?: InputMaybe<Scalars['Upload']['input']>;
  profileImageUrl?: InputMaybe<Scalars['String']['input']>;
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

export type DeleteParticipantIconMutationVariables = Exact<{
  input: DeleteGameParticipantIcon;
}>;


export type DeleteParticipantIconMutation = { __typename?: 'Mutation', deleteGameParticipantIcon: { __typename?: 'DeleteGameParticipantIconPayload', ok: boolean } };

export type FavoriteDirectMutationVariables = Exact<{
  input: NewDirectMessageFavorite;
}>;


export type FavoriteDirectMutation = { __typename?: 'Mutation', registerDirectMessageFavorite: { __typename?: 'RegisterDirectMessageFavoritePayload', ok: boolean } };

export type UnfavoriteDirectMutationVariables = Exact<{
  input: DeleteDirectMessageFavorite;
}>;


export type UnfavoriteDirectMutation = { __typename?: 'Mutation', deleteDirectMessageFavorite: { __typename?: 'DeleteDirectMessageFavoritePayload', ok: boolean } };

export type FollowMutationVariables = Exact<{
  input: NewGameParticipantFollow;
}>;


export type FollowMutation = { __typename?: 'Mutation', registerGameParticipantFollow: { __typename?: 'RegisterGameParticipantFollowPayload', ok: boolean } };

export type FavoriteMutationVariables = Exact<{
  input: NewMessageFavorite;
}>;


export type FavoriteMutation = { __typename?: 'Mutation', registerMessageFavorite: { __typename?: 'RegisterMessageFavoritePayload', ok: boolean } };

export type UnfavoriteMutationVariables = Exact<{
  input: DeleteMessageFavorite;
}>;


export type UnfavoriteMutation = { __typename?: 'Mutation', deleteMessageFavorite: { __typename?: 'DeleteMessageFavoritePayload', ok: boolean } };

export type RegisterParticipantGroupMutationVariables = Exact<{
  input: NewGameParticipantGroup;
}>;


export type RegisterParticipantGroupMutation = { __typename?: 'Mutation', registerGameParticipantGroup: { __typename?: 'RegisterGameParticipantGroupPayload', gameParticipantGroup: { __typename?: 'GameParticipantGroup', id: string, name: string, participants: Array<{ __typename?: 'GameParticipant', id: string, name: string }> } } };

export type RegisterGameParticipantMutationVariables = Exact<{
  input: NewGameParticipant;
}>;


export type RegisterGameParticipantMutation = { __typename?: 'Mutation', registerGameParticipant: { __typename?: 'RegisterGameParticipantPayload', gameParticipant: { __typename?: 'GameParticipant', id: string } } };

export type RegisterGameMutationVariables = Exact<{
  input: NewGame;
}>;


export type RegisterGameMutation = { __typename?: 'Mutation', registerGame: { __typename?: 'RegisterGamePayload', game: { __typename?: 'Game', id: string } } };

export type TalkDirectMutationVariables = Exact<{
  input: NewDirectMessage;
}>;


export type TalkDirectMutation = { __typename?: 'Mutation', registerDirectMessage: { __typename?: 'RegisterDirectMessagePayload', ok: boolean } };

export type TalkMutationVariables = Exact<{
  input: NewMessage;
}>;


export type TalkMutation = { __typename?: 'Mutation', registerMessage: { __typename?: 'RegisterMessagePayload', ok: boolean } };

export type UnfollowMutationVariables = Exact<{
  input: DeleteGameParticipantFollow;
}>;


export type UnfollowMutation = { __typename?: 'Mutation', deleteGameParticipantFollow: { __typename?: 'DeleteGameParticipantFollowPayload', ok: boolean } };

export type UpdateParticipantGroupMutationVariables = Exact<{
  input: UpdateGameParticipantGroup;
}>;


export type UpdateParticipantGroupMutation = { __typename?: 'Mutation', updateGameParticipantGroup: { __typename?: 'UpdateGameParticipantGroupPayload', ok: boolean } };

export type UpdateIconMutationVariables = Exact<{
  input: UpdateGameParticipantIcon;
}>;


export type UpdateIconMutation = { __typename?: 'Mutation', updateGameParticipantIcon: { __typename?: 'UpdateGameParticipantIconPayload', ok: boolean } };

export type UpdateGameParticipantProfileMutationVariables = Exact<{
  input: UpdateGameParticipantProfile;
}>;


export type UpdateGameParticipantProfileMutation = { __typename?: 'Mutation', updateGameParticipantProfile: { __typename?: 'UpdateGameParticipantProfilePayload', ok: boolean } };

export type UpdatePlayerProfileMutationVariables = Exact<{
  name: Scalars['String']['input'];
  introduction?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdatePlayerProfileMutation = { __typename?: 'Mutation', updatePlayerProfile: { __typename?: 'UpdatePlayerProfilePayload', ok: boolean } };

export type UploadIconMutationVariables = Exact<{
  input: NewGameParticipantIcon;
}>;


export type UploadIconMutation = { __typename?: 'Mutation', registerGameParticipantIcon: { __typename?: 'RegisterGameParticipantIconPayload', gameParticipantIcon: { __typename?: 'GameParticipantIcon', id: string } } };

export type DirectFavoriteParticipantsQueryVariables = Exact<{
  gameId: Scalars['ID']['input'];
  directMessageId: Scalars['ID']['input'];
}>;


export type DirectFavoriteParticipantsQuery = { __typename?: 'Query', directMessageFavoriteGameParticipants: Array<{ __typename?: 'GameParticipant', id: string, name: string, entryNumber: number, profileIcon?: { __typename?: 'GameParticipantIcon', id: string, url: string } | null }> };

export type DirectMessagesLatestQueryVariables = Exact<{
  gameId: Scalars['ID']['input'];
  query: DirectMessagesQuery;
}>;


export type DirectMessagesLatestQuery = { __typename?: 'Query', directMessagesLatestUnixTimeMilli: any };

export type GameDirectMessagesQueryVariables = Exact<{
  gameId: Scalars['ID']['input'];
  query: DirectMessagesQuery;
}>;


export type GameDirectMessagesQuery = { __typename?: 'Query', directMessages: { __typename?: 'DirectMessages', allPageCount: number, hasPrePage: boolean, hasNextPage: boolean, currentPageNumber?: number | null, isDesc: boolean, latestUnixTimeMilli: any, list: Array<{ __typename?: 'DirectMessage', id: string, content: { __typename?: 'MessageContent', type: MessageType, text: string, number: number, isConvertDisabled: boolean }, time: { __typename?: 'MessageTime', sendAt: any, sendUnixTimeMilli: any }, sender: { __typename?: 'MessageSender', participantId: string, name: string, icon: { __typename?: 'GameParticipantIcon', url: string, width: number, height: number } }, reactions: { __typename?: 'DirectMessageReactions', favoriteCounts: number, favoriteParticipantIds: Array<string> } }> } };

export type FollowersQueryVariables = Exact<{
  participantId: Scalars['ID']['input'];
}>;


export type FollowersQuery = { __typename?: 'Query', gameParticipantFollowers: Array<{ __typename?: 'GameParticipant', id: string, name: string, entryNumber: number, profileIcon?: { __typename?: 'GameParticipantIcon', id: string, url: string } | null }> };

export type FollowsQueryVariables = Exact<{
  participantId: Scalars['ID']['input'];
}>;


export type FollowsQuery = { __typename?: 'Query', gameParticipantFollows: Array<{ __typename?: 'GameParticipant', id: string, name: string, entryNumber: number, profileIcon?: { __typename?: 'GameParticipantIcon', id: string, url: string } | null }> };

export type MessagesLatestQueryVariables = Exact<{
  gameId: Scalars['ID']['input'];
  query: MessagesQuery;
}>;


export type MessagesLatestQuery = { __typename?: 'Query', messagesLatestUnixTimeMilli: any };

export type GameMessagesQueryVariables = Exact<{
  gameId: Scalars['ID']['input'];
  query: MessagesQuery;
}>;


export type GameMessagesQuery = { __typename?: 'Query', messages: { __typename?: 'Messages', allPageCount: number, hasPrePage: boolean, hasNextPage: boolean, currentPageNumber?: number | null, isDesc: boolean, latestUnixTimeMilli: any, list: Array<{ __typename?: 'Message', id: string, content: { __typename?: 'MessageContent', type: MessageType, text: string, number: number, isConvertDisabled: boolean }, time: { __typename?: 'MessageTime', sendAt: any, sendUnixTimeMilli: any }, sender?: { __typename?: 'MessageSender', participantId: string, name: string, icon: { __typename?: 'GameParticipantIcon', url: string, width: number, height: number } } | null, replyTo?: { __typename?: 'MessageRecipient', messageId: string, participantId: string } | null, reactions: { __typename?: 'MessageReactions', replyCount: number, favoriteCount: number, favoriteParticipantIds: Array<string> } }> } };

export type ParticipantGroupsQueryVariables = Exact<{
  gameId: Scalars['ID']['input'];
  participantId?: InputMaybe<Scalars['ID']['input']>;
}>;


export type ParticipantGroupsQuery = { __typename?: 'Query', gameParticipantGroups: Array<{ __typename?: 'GameParticipantGroup', id: string, name: string, latestUnixTimeMilli: any, participants: Array<{ __typename?: 'GameParticipant', id: string, name: string, profileIcon?: { __typename?: 'GameParticipantIcon', id: string, url: string } | null }> }> };

export type IconsQueryVariables = Exact<{
  participantId: Scalars['ID']['input'];
}>;


export type IconsQuery = { __typename?: 'Query', gameParticipantIcons: Array<{ __typename?: 'GameParticipantIcon', id: string, url: string, width: number, height: number, displayOrder: number }> };

export type GameParticipantProfileQueryVariables = Exact<{
  participantId: Scalars['ID']['input'];
}>;


export type GameParticipantProfileQuery = { __typename?: 'Query', gameParticipantProfile: { __typename?: 'GameParticipantProfile', participantId: string, name: string, profileImageUrl?: string | null, introduction?: string | null, followsCount: number, followersCount: number } };

export type GameQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GameQuery = { __typename?: 'Query', game?: { __typename?: 'Game', id: string, name: string, status: GameStatus, participants: Array<{ __typename?: 'GameParticipant', id: string, name: string, entryNumber: number, profileIcon?: { __typename?: 'GameParticipantIcon', id: string, url: string } | null }>, periods: Array<{ __typename?: 'GamePeriod', id: string }>, settings: { __typename?: 'GameSettings', chara: { __typename?: 'GameCharaSetting', canOriginalCharacter: boolean, charachips: Array<{ __typename?: 'Charachip', name: string }> }, capacity: { __typename?: 'GameCapacity', min: number, max: number }, rule: { __typename?: 'GameRuleSetting', canShorten: boolean, canSendDirectMessage: boolean }, time: { __typename?: 'GameTimeSetting', periodPrefix?: string | null, periodSuffix?: string | null, periodIntervalSeconds: number, openAt: any, startParticipateAt: any, startGameAt: any }, password: { __typename?: 'GamePasswordSetting', hasPassword: boolean } } } | null };

export type IndexGamesQueryVariables = Exact<{
  pageSize: Scalars['Int']['input'];
  pageNumber: Scalars['Int']['input'];
  statuses?: InputMaybe<Array<GameStatus> | GameStatus>;
}>;


export type IndexGamesQuery = { __typename?: 'Query', games: Array<{ __typename?: 'SimpleGame', id: string, name: string, status: GameStatus, participantsCount: number, periods: Array<{ __typename?: 'GamePeriod', id: string, name: string, startAt: any, endAt: any }>, settings: { __typename?: 'GameSettings', chara: { __typename?: 'GameCharaSetting', canOriginalCharacter: boolean, charachips: Array<{ __typename?: 'Charachip', name: string }> }, capacity: { __typename?: 'GameCapacity', min: number, max: number }, rule: { __typename?: 'GameRuleSetting', canShorten: boolean, canSendDirectMessage: boolean }, time: { __typename?: 'GameTimeSetting', periodPrefix?: string | null, periodSuffix?: string | null, periodIntervalSeconds: number, openAt: any, startParticipateAt: any, startGameAt: any }, password: { __typename?: 'GamePasswordSetting', hasPassword: boolean } } }> };

export type FavoriteParticipantsQueryVariables = Exact<{
  gameId: Scalars['ID']['input'];
  messageId: Scalars['ID']['input'];
}>;


export type FavoriteParticipantsQuery = { __typename?: 'Query', messageFavoriteGameParticipants: Array<{ __typename?: 'GameParticipant', id: string, name: string, entryNumber: number, profileIcon?: { __typename?: 'GameParticipantIcon', id: string, url: string } | null }> };

export type MessageRepliesQueryVariables = Exact<{
  gameId: Scalars['ID']['input'];
  messageId: Scalars['ID']['input'];
}>;


export type MessageRepliesQuery = { __typename?: 'Query', messageReplies: Array<{ __typename?: 'Message', id: string, content: { __typename?: 'MessageContent', type: MessageType, text: string, number: number, isConvertDisabled: boolean }, time: { __typename?: 'MessageTime', sendAt: any, sendUnixTimeMilli: any }, sender?: { __typename?: 'MessageSender', participantId: string, name: string, icon: { __typename?: 'GameParticipantIcon', url: string, width: number, height: number } } | null, replyTo?: { __typename?: 'MessageRecipient', messageId: string, participantId: string } | null, reactions: { __typename?: 'MessageReactions', replyCount: number, favoriteCount: number, favoriteParticipantIds: Array<string> } }> };

export type MyGameParticipantQueryVariables = Exact<{
  gameId: Scalars['ID']['input'];
}>;


export type MyGameParticipantQuery = { __typename?: 'Query', myGameParticipant?: { __typename?: 'GameParticipant', id: string, name: string, entryNumber: number, followParticipantIds: Array<string>, followerParticipantIds: Array<string>, player: { __typename?: 'Player', id: string }, profileIcon?: { __typename?: 'GameParticipantIcon', id: string, url: string } | null } | null };

export type MyPlayerQueryVariables = Exact<{ [key: string]: never; }>;


export type MyPlayerQuery = { __typename?: 'Query', myPlayer?: { __typename?: 'Player', id: string, name: string, profile?: { __typename?: 'PlayerProfile', introduction?: string | null } | null } | null };

export type PlayerQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type PlayerQuery = { __typename?: 'Query', player?: { __typename?: 'Player', id: string, name: string, profile?: { __typename?: 'PlayerProfile', introduction?: string | null } | null } | null };


export const DeleteParticipantIconDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteParticipantIcon"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteGameParticipantIcon"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteGameParticipantIcon"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<DeleteParticipantIconMutation, DeleteParticipantIconMutationVariables>;
export const FavoriteDirectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"FavoriteDirect"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NewDirectMessageFavorite"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registerDirectMessageFavorite"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<FavoriteDirectMutation, FavoriteDirectMutationVariables>;
export const UnfavoriteDirectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UnfavoriteDirect"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteDirectMessageFavorite"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteDirectMessageFavorite"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<UnfavoriteDirectMutation, UnfavoriteDirectMutationVariables>;
export const FollowDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Follow"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NewGameParticipantFollow"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registerGameParticipantFollow"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<FollowMutation, FollowMutationVariables>;
export const FavoriteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Favorite"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NewMessageFavorite"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registerMessageFavorite"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<FavoriteMutation, FavoriteMutationVariables>;
export const UnfavoriteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Unfavorite"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteMessageFavorite"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteMessageFavorite"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<UnfavoriteMutation, UnfavoriteMutationVariables>;
export const RegisterParticipantGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RegisterParticipantGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NewGameParticipantGroup"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registerGameParticipantGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gameParticipantGroup"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"participants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<RegisterParticipantGroupMutation, RegisterParticipantGroupMutationVariables>;
export const RegisterGameParticipantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RegisterGameParticipant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NewGameParticipant"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registerGameParticipant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gameParticipant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<RegisterGameParticipantMutation, RegisterGameParticipantMutationVariables>;
export const RegisterGameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RegisterGame"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NewGame"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registerGame"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"game"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<RegisterGameMutation, RegisterGameMutationVariables>;
export const TalkDirectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"TalkDirect"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NewDirectMessage"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registerDirectMessage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<TalkDirectMutation, TalkDirectMutationVariables>;
export const TalkDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Talk"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NewMessage"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registerMessage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<TalkMutation, TalkMutationVariables>;
export const UnfollowDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Unfollow"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteGameParticipantFollow"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteGameParticipantFollow"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<UnfollowMutation, UnfollowMutationVariables>;
export const UpdateParticipantGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateParticipantGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateGameParticipantGroup"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateGameParticipantGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<UpdateParticipantGroupMutation, UpdateParticipantGroupMutationVariables>;
export const UpdateIconDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateIcon"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateGameParticipantIcon"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateGameParticipantIcon"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<UpdateIconMutation, UpdateIconMutationVariables>;
export const UpdateGameParticipantProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateGameParticipantProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateGameParticipantProfile"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateGameParticipantProfile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<UpdateGameParticipantProfileMutation, UpdateGameParticipantProfileMutationVariables>;
export const UpdatePlayerProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePlayerProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"introduction"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePlayerProfile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"introduction"},"value":{"kind":"Variable","name":{"kind":"Name","value":"introduction"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<UpdatePlayerProfileMutation, UpdatePlayerProfileMutationVariables>;
export const UploadIconDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UploadIcon"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NewGameParticipantIcon"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registerGameParticipantIcon"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gameParticipantIcon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<UploadIconMutation, UploadIconMutationVariables>;
export const DirectFavoriteParticipantsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DirectFavoriteParticipants"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"directMessageId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"directMessageFavoriteGameParticipants"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"gameId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}}},{"kind":"Argument","name":{"kind":"Name","value":"directMessageId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"directMessageId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"entryNumber"}},{"kind":"Field","name":{"kind":"Name","value":"profileIcon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]} as unknown as DocumentNode<DirectFavoriteParticipantsQuery, DirectFavoriteParticipantsQueryVariables>;
export const DirectMessagesLatestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DirectMessagesLatest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DirectMessagesQuery"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"directMessagesLatestUnixTimeMilli"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"gameId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}}},{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}}]}]}}]} as unknown as DocumentNode<DirectMessagesLatestQuery, DirectMessagesLatestQueryVariables>;
export const GameDirectMessagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GameDirectMessages"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DirectMessagesQuery"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"directMessages"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"gameId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}}},{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"list"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"isConvertDisabled"}}]}},{"kind":"Field","name":{"kind":"Name","value":"time"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendAt"}},{"kind":"Field","name":{"kind":"Name","value":"sendUnixTimeMilli"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sender"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"participantId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"reactions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"favoriteCounts"}},{"kind":"Field","name":{"kind":"Name","value":"favoriteParticipantIds"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"allPageCount"}},{"kind":"Field","name":{"kind":"Name","value":"hasPrePage"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"currentPageNumber"}},{"kind":"Field","name":{"kind":"Name","value":"isDesc"}},{"kind":"Field","name":{"kind":"Name","value":"latestUnixTimeMilli"}}]}}]}}]} as unknown as DocumentNode<GameDirectMessagesQuery, GameDirectMessagesQueryVariables>;
export const FollowersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Followers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"participantId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gameParticipantFollowers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"participantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"participantId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"entryNumber"}},{"kind":"Field","name":{"kind":"Name","value":"profileIcon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]} as unknown as DocumentNode<FollowersQuery, FollowersQueryVariables>;
export const FollowsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Follows"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"participantId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gameParticipantFollows"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"participantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"participantId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"entryNumber"}},{"kind":"Field","name":{"kind":"Name","value":"profileIcon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]} as unknown as DocumentNode<FollowsQuery, FollowsQueryVariables>;
export const MessagesLatestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MessagesLatest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MessagesQuery"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"messagesLatestUnixTimeMilli"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"gameId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}}},{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}}]}]}}]} as unknown as DocumentNode<MessagesLatestQuery, MessagesLatestQueryVariables>;
export const GameMessagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GameMessages"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MessagesQuery"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"messages"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"gameId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}}},{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"list"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"isConvertDisabled"}}]}},{"kind":"Field","name":{"kind":"Name","value":"time"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendAt"}},{"kind":"Field","name":{"kind":"Name","value":"sendUnixTimeMilli"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sender"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"participantId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"replyTo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"messageId"}},{"kind":"Field","name":{"kind":"Name","value":"participantId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reactions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"replyCount"}},{"kind":"Field","name":{"kind":"Name","value":"favoriteCount"}},{"kind":"Field","name":{"kind":"Name","value":"favoriteParticipantIds"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"allPageCount"}},{"kind":"Field","name":{"kind":"Name","value":"hasPrePage"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"currentPageNumber"}},{"kind":"Field","name":{"kind":"Name","value":"isDesc"}},{"kind":"Field","name":{"kind":"Name","value":"latestUnixTimeMilli"}}]}}]}}]} as unknown as DocumentNode<GameMessagesQuery, GameMessagesQueryVariables>;
export const ParticipantGroupsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ParticipantGroups"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"participantId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gameParticipantGroups"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"gameId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}}},{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"memberParticipantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"participantId"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"participants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"profileIcon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"latestUnixTimeMilli"}}]}}]}}]} as unknown as DocumentNode<ParticipantGroupsQuery, ParticipantGroupsQueryVariables>;
export const IconsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Icons"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"participantId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gameParticipantIcons"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"participantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"participantId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"displayOrder"}}]}}]}}]} as unknown as DocumentNode<IconsQuery, IconsQueryVariables>;
export const GameParticipantProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GameParticipantProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"participantId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gameParticipantProfile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"participantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"participantId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"participantId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"profileImageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"introduction"}},{"kind":"Field","name":{"kind":"Name","value":"followsCount"}},{"kind":"Field","name":{"kind":"Name","value":"followersCount"}}]}}]}}]} as unknown as DocumentNode<GameParticipantProfileQuery, GameParticipantProfileQueryVariables>;
export const GameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Game"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"game"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"participants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"entryNumber"}},{"kind":"Field","name":{"kind":"Name","value":"profileIcon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"periods"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chara"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"charachips"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"canOriginalCharacter"}}]}},{"kind":"Field","name":{"kind":"Name","value":"capacity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"min"}},{"kind":"Field","name":{"kind":"Name","value":"max"}}]}},{"kind":"Field","name":{"kind":"Name","value":"rule"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canShorten"}},{"kind":"Field","name":{"kind":"Name","value":"canSendDirectMessage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"time"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"periodPrefix"}},{"kind":"Field","name":{"kind":"Name","value":"periodSuffix"}},{"kind":"Field","name":{"kind":"Name","value":"periodIntervalSeconds"}},{"kind":"Field","name":{"kind":"Name","value":"openAt"}},{"kind":"Field","name":{"kind":"Name","value":"startParticipateAt"}},{"kind":"Field","name":{"kind":"Name","value":"startGameAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"password"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasPassword"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GameQuery, GameQueryVariables>;
export const IndexGamesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"IndexGames"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageNumber"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"statuses"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GameStatus"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"games"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"statuses"},"value":{"kind":"Variable","name":{"kind":"Name","value":"statuses"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"paging"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"pageNumber"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageNumber"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"isDesc"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"participantsCount"}},{"kind":"Field","name":{"kind":"Name","value":"periods"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"startAt"}},{"kind":"Field","name":{"kind":"Name","value":"endAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chara"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"charachips"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"canOriginalCharacter"}}]}},{"kind":"Field","name":{"kind":"Name","value":"capacity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"min"}},{"kind":"Field","name":{"kind":"Name","value":"max"}}]}},{"kind":"Field","name":{"kind":"Name","value":"rule"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canShorten"}},{"kind":"Field","name":{"kind":"Name","value":"canSendDirectMessage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"time"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"periodPrefix"}},{"kind":"Field","name":{"kind":"Name","value":"periodSuffix"}},{"kind":"Field","name":{"kind":"Name","value":"periodIntervalSeconds"}},{"kind":"Field","name":{"kind":"Name","value":"openAt"}},{"kind":"Field","name":{"kind":"Name","value":"startParticipateAt"}},{"kind":"Field","name":{"kind":"Name","value":"startGameAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"password"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasPassword"}}]}}]}}]}}]}}]} as unknown as DocumentNode<IndexGamesQuery, IndexGamesQueryVariables>;
export const FavoriteParticipantsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FavoriteParticipants"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"messageId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"messageFavoriteGameParticipants"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"gameId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}}},{"kind":"Argument","name":{"kind":"Name","value":"messageId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"messageId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"entryNumber"}},{"kind":"Field","name":{"kind":"Name","value":"profileIcon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]} as unknown as DocumentNode<FavoriteParticipantsQuery, FavoriteParticipantsQueryVariables>;
export const MessageRepliesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MessageReplies"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"messageId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"messageReplies"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"gameId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}}},{"kind":"Argument","name":{"kind":"Name","value":"messageId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"messageId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"isConvertDisabled"}}]}},{"kind":"Field","name":{"kind":"Name","value":"time"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendAt"}},{"kind":"Field","name":{"kind":"Name","value":"sendUnixTimeMilli"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sender"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"participantId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"replyTo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"messageId"}},{"kind":"Field","name":{"kind":"Name","value":"participantId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reactions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"replyCount"}},{"kind":"Field","name":{"kind":"Name","value":"favoriteCount"}},{"kind":"Field","name":{"kind":"Name","value":"favoriteParticipantIds"}}]}}]}}]}}]} as unknown as DocumentNode<MessageRepliesQuery, MessageRepliesQueryVariables>;
export const MyGameParticipantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyGameParticipant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myGameParticipant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"gameId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"entryNumber"}},{"kind":"Field","name":{"kind":"Name","value":"player"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"profileIcon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"followParticipantIds"}},{"kind":"Field","name":{"kind":"Name","value":"followerParticipantIds"}}]}}]}}]} as unknown as DocumentNode<MyGameParticipantQuery, MyGameParticipantQueryVariables>;
export const MyPlayerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyPlayer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myPlayer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"introduction"}}]}}]}}]}}]} as unknown as DocumentNode<MyPlayerQuery, MyPlayerQueryVariables>;
export const PlayerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Player"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"player"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"introduction"}}]}}]}}]}}]} as unknown as DocumentNode<PlayerQuery, PlayerQueryVariables>;