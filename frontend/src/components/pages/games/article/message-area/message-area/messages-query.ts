import {
  DirectMessagesQuery,
  Game,
  GameParticipant,
  GameParticipantGroup,
  MessageType,
  MessagesQuery
} from '@/lib/generated/graphql'
import { atom, useAtom } from 'jotai'
import { messageTypeOptions, messageTypeValues } from './message-type'
import { ParsedUrlQueryInput } from 'querystring'
import { base64ToId, idToBase64 } from '@/components/graphql/convert'

export const emptyMessageQuery: MessagesQuery = {
  senderIds: null,
  recipientIds: null,
  periodId: null,
  paging: {
    pageSize: 10,
    pageNumber: 1,
    isDesc: true,
    isLatest: true
  }
}

const messagesQueryAtom = atom<MessagesQuery>(emptyMessageQuery)
export const useMessagesQuery = () => {
  const [getter, setter] = useAtom(messagesQueryAtom)
  return [getter, setter] as const
}

export const toUrlQuery = (
  game: Game,
  types: MessageType[],
  senders: GameParticipant[],
  receivers: GameParticipant[],
  keyword: string,
  sinceAt: Date | null,
  untilAt: Date | null
): ParsedUrlQueryInput => {
  const participants = game.participants.filter((p) => !p.isGone)
  return {
    mt:
      types.length > 0 && types.length !== messageTypeOptions.length
        ? types
        : undefined,
    msid:
      senders.length > 0 && senders.length !== participants.length
        ? senders.map((s) => base64ToId(s.id))
        : undefined,
    mrid:
      receivers.length > 0 && receivers.length !== participants.length
        ? receivers.map((r) => base64ToId(r.id))
        : undefined,
    mk: keyword.length > 0 ? keyword : undefined,
    msa: sinceAt ? sinceAt.toISOString() : undefined,
    mua: untilAt ? untilAt.toISOString() : undefined
  }
}

export const fromUrlQuery = (query: any, game: Game): MessagesQuery => {
  const types = getQueryStringAsArray(query.mt).map(
    (messageTypeString: string) => {
      return MessageType[messageTypeString as keyof typeof MessageType]
    }
  )
  const senderIds = getQueryStringAsArray(query.msid).map((id: string) =>
    idToBase64(parseInt(id), 'GameParticipant')
  )
  const recipientIds = getQueryStringAsArray(query.mrid).map((id: string) =>
    idToBase64(parseInt(id), 'GameParticipant')
  )
  const keyword = query.mk
  const sinceAt = query.msa && query.msa.length > 0 ? query.msa : null
  const untilAt = query.mua && query.mua.length > 0 ? query.mua : null

  const participants = game.participants.filter((p) => !p.isGone)
  return {
    types: types.length > 0 ? types : messageTypeValues,
    periodId: game.periods[game.periods.length - 1].id,
    senderIds:
      senderIds.length !== 0 && senderIds.length !== participants.length
        ? senderIds
        : null,
    recipientIds:
      recipientIds.length !== 0 && recipientIds.length !== participants.length
        ? recipientIds
        : null,
    keywords: keyword && keyword.length > 0 ? keyword.split(' ') : null,
    sinceAt,
    untilAt
  }
}

const getQueryStringAsArray = (
  param: undefined | string | string[]
): string[] => {
  if (param == null) {
    return []
  }
  if (Array.isArray(param)) {
    return param
  }
  return param.length > 0 ? [param] : []
}

export const isFiltering = (
  messagesQuery: MessagesQuery,
  game: Game
): boolean => {
  const participants = game.participants.filter((p) => !p.isGone)
  return (
    (messagesQuery.types &&
      messagesQuery.types.length !== messageTypeValues.length) ||
    (messagesQuery.senderIds &&
      messagesQuery.senderIds.length > 0 &&
      messagesQuery.senderIds.length !== participants.length) ||
    (messagesQuery.recipientIds &&
      messagesQuery.recipientIds.length > 0 &&
      messagesQuery.recipientIds.length !== participants.length) ||
    (messagesQuery.keywords && messagesQuery.keywords.length > 0) ||
    messagesQuery.sinceAt ||
    messagesQuery.untilAt
  )
}

export const isDirectMessagesQueryFiltering = (
  messagesQuery: DirectMessagesQuery,
  group: GameParticipantGroup
): boolean => {
  return (
    (messagesQuery.types &&
      messagesQuery.types.length !== messageTypeValues.length) ||
    (messagesQuery.senderIds &&
      messagesQuery.senderIds.length > 0 &&
      messagesQuery.senderIds.length !== group.participants.length) ||
    (messagesQuery.keywords && messagesQuery.keywords.length > 0) ||
    messagesQuery.sinceAt ||
    messagesQuery.untilAt
  )
}
