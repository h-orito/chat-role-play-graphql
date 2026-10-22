import { memo } from 'react'
import { convertMessageText } from './convert-message-text'

type Props = {
  rawText: string
  isConvertDisabled?: boolean
}

export default memo(function MessageText({
  rawText,
  isConvertDisabled = false
}: Props) {
  if (isConvertDisabled) {
    return <>{rawText}</>
  }

  const converted = convertMessageText(rawText)

  return <span dangerouslySetInnerHTML={{ __html: converted }}></span>
})
