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
};

export type Chara = {
  __typename?: 'Chara';
  id: Scalars['ID'];
  images: Array<CharaImage>;
  name: Scalars['String'];
};

export type CharaImage = {
  __typename?: 'CharaImage';
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
  paging?: InputMaybe<PageableQuery>;
};

export type Designer = {
  __typename?: 'Designer';
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type DirectMessage = {
  __typename?: 'DirectMessage';
  content: MessageContent;
  id: Scalars['ID'];
  participantGroup: GameParticipantGroup;
  sender: MessageSender;
  time: MessageTime;
};

export type DirectMessageQuery = {
  keywords?: InputMaybe<Array<Scalars['String']>>;
  paging?: InputMaybe<PageableQuery>;
  participantGroupId: Scalars['ID'];
  periodId?: InputMaybe<Scalars['ID']>;
  types?: InputMaybe<Array<MessageType>>;
};

export type DirectMessages = Pageable & {
  __typename?: 'DirectMessages';
  allPageCount: Scalars['Int'];
  currentPageNum?: Maybe<Scalars['Int']>;
  hasNextPage: Scalars['Boolean'];
  hasPrePage: Scalars['Boolean'];
  isLatest: Scalars['Boolean'];
  list: Array<DirectMessage>;
};

export type Game = {
  __typename?: 'Game';
  gameMasters: Array<Player>;
  id: Scalars['ID'];
  name: Scalars['String'];
  participants: Array<GameParticipant>;
  periods: Array<GamePeriod>;
  setting: GameSetting;
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

export type GameNotificationCondition = {
  __typename?: 'GameNotificationCondition';
  participate: Scalars['Boolean'];
  start: Scalars['Boolean'];
};

export type GameParticipant = {
  __typename?: 'GameParticipant';
  chara: Chara;
  id: Scalars['ID'];
  name: Scalars['String'];
  player: Player;
  setting: GameParticipantSetting;
};

export type GameParticipantGroup = {
  __typename?: 'GameParticipantGroup';
  id: Scalars['ID'];
  participants: Array<GameParticipant>;
};

export type GameParticipantSetting = {
  __typename?: 'GameParticipantSetting';
  notification: NotificationCondition;
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

export type GameSetting = {
  __typename?: 'GameSetting';
  capacity: GameCapacity;
  chara: GameCharaSetting;
  password?: Maybe<Scalars['String']>;
  rule: GameRuleSetting;
  time: GameTimeSetting;
};

export enum GameStatus {
  Canceled = 'CANCELED',
  Closed = 'CLOSED',
  Finished = 'FINISHED',
  Opening = 'OPENING',
  Progress = 'PROGRESS',
  Recruiting = 'RECRUITING'
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
  canConvertDisabled: Scalars['Boolean'];
  number: Scalars['Int'];
  text: Scalars['String'];
  type: MessageType;
};

export type MessageFavorite = {
  __typename?: 'MessageFavorite';
  participantId: Scalars['ID'];
};

export type MessageNotificationCondition = {
  __typename?: 'MessageNotificationCondition';
  directMessage: Scalars['Boolean'];
  keywords: Array<Scalars['String']>;
  reply: Scalars['Boolean'];
};

export type MessageQuery = {
  keywords?: InputMaybe<Array<Scalars['String']>>;
  paging?: InputMaybe<PageableQuery>;
  periodId?: InputMaybe<Scalars['ID']>;
  recipientIds?: InputMaybe<Array<Scalars['ID']>>;
  senderIds?: InputMaybe<Array<Scalars['ID']>>;
  types?: InputMaybe<Array<MessageType>>;
};

export type MessageReactions = {
  __typename?: 'MessageReactions';
  favorites: Array<MessageFavorite>;
  replies: Array<MessageReply>;
};

export type MessageRecipient = {
  __typename?: 'MessageRecipient';
  messageId: Scalars['ID'];
  participantId: Scalars['ID'];
};

export type MessageReply = {
  __typename?: 'MessageReply';
  messageId: Scalars['ID'];
};

export type MessageSender = {
  __typename?: 'MessageSender';
  charaImage: CharaImage;
  name: Scalars['String'];
  participant: GameParticipant;
};

export type MessageTime = {
  __typename?: 'MessageTime';
  period: GamePeriod;
  sendAt: Scalars['DateTime'];
  sendUnixTimeMilli: Scalars['Int'];
};

export enum MessageType {
  Monologue = 'MONOLOGUE',
  Talknormal = 'TALKNORMAL'
}

export type Messages = Pageable & {
  __typename?: 'Messages';
  allPageCount: Scalars['Int'];
  currentPageNum?: Maybe<Scalars['Int']>;
  hasNextPage: Scalars['Boolean'];
  hasPrePage: Scalars['Boolean'];
  isLatest: Scalars['Boolean'];
  list: Array<Message>;
};

export type Mutation = {
  __typename?: 'Mutation';
  registerGame: RegisterGamePayload;
  registerParticipant: RegisterParticipantPayload;
};


export type MutationRegisterGameArgs = {
  input: NewGame;
};


export type MutationRegisterParticipantArgs = {
  input: NewParticipant;
};

export type NewGame = {
  name: Scalars['String'];
};

export type NewParticipant = {
  gameId: Scalars['ID'];
  playerId: Scalars['ID'];
};

export type NotificationCondition = {
  __typename?: 'NotificationCondition';
  discordWebhookUrl?: Maybe<Scalars['String']>;
  game: GameNotificationCondition;
  message: MessageNotificationCondition;
};

export type Pageable = {
  allPageCount: Scalars['Int'];
  currentPageNum?: Maybe<Scalars['Int']>;
  hasNextPage: Scalars['Boolean'];
  hasPrePage: Scalars['Boolean'];
  isLatest: Scalars['Boolean'];
};

export type PageableQuery = {
  isLatest: Scalars['Boolean'];
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
  description?: Maybe<Scalars['String']>;
  iconUrl?: Maybe<Scalars['String']>;
  snsAccounts: Array<PlayerSnsAccount>;
};

export type PlayerSnsAccount = {
  __typename?: 'PlayerSnsAccount';
  name?: Maybe<Scalars['String']>;
  type: SnsType;
  url: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  chara: Chara;
  charachip: Charachip;
  charachips: Array<Charachip>;
  directMessages: DirectMessages;
  game?: Maybe<Game>;
  gameParticipantGroups: Array<GameParticipantGroup>;
  games: Array<SimpleGame>;
  message: Message;
  messages: Messages;
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


export type QueryDirectMessagesArgs = {
  gameId: Scalars['ID'];
  query: DirectMessageQuery;
};


export type QueryGameArgs = {
  id: Scalars['ID'];
};


export type QueryGameParticipantGroupsArgs = {
  gameId: Scalars['ID'];
};


export type QueryGamesArgs = {
  query: GamesQuery;
};


export type QueryMessageArgs = {
  id: Scalars['ID'];
};


export type QueryMessagesArgs = {
  gameId: Scalars['ID'];
  query: MessageQuery;
};


export type QueryPlayerArgs = {
  name: Scalars['String'];
};

export type RegisterGamePayload = {
  __typename?: 'RegisterGamePayload';
  game: Game;
};

export type RegisterParticipantPayload = {
  __typename?: 'RegisterParticipantPayload';
  participant: GameParticipant;
};

export type SimpleGame = {
  __typename?: 'SimpleGame';
  id: Scalars['ID'];
  name: Scalars['String'];
  participantsCount: Scalars['Int'];
};

export enum SnsType {
  Discord = 'DISCORD',
  Github = 'GITHUB',
  Pixiv = 'PIXIV',
  Twitter = 'TWITTER',
  Website = 'WEBSITE'
}

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


export const GameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"game"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"game"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"participants"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"paging"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"IntValue","value":"10"}},{"kind":"ObjectField","name":{"kind":"Name","value":"pageNumber"},"value":{"kind":"IntValue","value":"1"}},{"kind":"ObjectField","name":{"kind":"Name","value":"isLatest"},"value":{"kind":"BooleanValue","value":false}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<GameQuery, GameQueryVariables>;
export const GamesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"games"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageNumber"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"games"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"paging"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"pageNumber"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageNumber"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"isLatest"},"value":{"kind":"BooleanValue","value":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"participantsCount"}}]}}]}}]} as unknown as DocumentNode<GamesQuery, GamesQueryVariables>;
export const RegisterGameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"registerGame"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NewGame"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registerGame"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"game"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"participants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]} as unknown as DocumentNode<RegisterGameMutation, RegisterGameMutationVariables>;