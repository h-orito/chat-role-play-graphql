import { MessageType } from '@/lib/generated/graphql'

export const messageTypeValues = [
  MessageType.TalkNormal,
  MessageType.Monologue,
  MessageType.Secret,
  MessageType.Description,
  MessageType.SystemPublic
]

export const messageTypeLabels = [
  '通常',
  '独り言',
  '秘話',
  'ト書き',
  'システム'
]

export const messageTypeOptions = messageTypeValues.map((value, i) => ({
  label: messageTypeLabels[i],
  value
}))
