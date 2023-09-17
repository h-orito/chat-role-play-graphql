import { useState } from 'react'

type Props = {
  selector: string
  setMessage: (message: string) => void
}

export default function TalkTextDecorators(props: Props) {
  return (
    <div>
      <BoldButton {...props} />
      <EmButton {...props} />
      <UnderbarButton {...props} />
      <StrikeButton {...props} />
      <SupButton {...props} />
      <SubButton {...props} />
      <SmallButton {...props} />
      <LargeButton {...props} />
      <HugeButton {...props} />
      <KusodekaButton {...props} />
      <ColorButton {...props} color='f00' />
      <ColorButton {...props} color='ff8800' />
      <ColorButton {...props} color='ffff00' />
      <ColorButton {...props} color='00ff00' />
      <ColorButton {...props} color='00ffff' />
      <ColorButton {...props} color='00f' />
      <ColorButton {...props} color='ff00ff' />
      <RubyButton {...props} />
      <RandomKeywordSelect {...props} />
    </div>
  )
}

type DecorateButtonProps = {
  selector: string
  setMessage: (message: string) => void
  click: (e: any) => void
  children: React.ReactNode
}

const DecorateButton = ({ click, children }: DecorateButtonProps) => {
  const onClick = (e: any) => {
    e.preventDefault()
    if (click) click(e)
  }

  return (
    <button
      className='base-border ml-1 min-w-[24px] rounded-sm border p-1 text-xs first:ml-0 hover:bg-blue-300'
      onClick={onClick}
    >
      {children}
    </button>
  )
}

const SimpleDecorateButton = (
  props: Props & { tag: string; closeTag?: string; children: React.ReactNode }
) => {
  const click = (e: any) => {
    props.setMessage(
      addTag(props.selector, props.tag, props.closeTag ?? props.tag)
    )
  }
  return <DecorateButton {...props} click={click} />
}

const BoldButton = (props: Props) => (
  <SimpleDecorateButton {...props} tag='b'>
    <strong>B</strong>
  </SimpleDecorateButton>
)

const EmButton = (props: Props) => (
  <SimpleDecorateButton {...props} tag='i'>
    <em>あ</em>
  </SimpleDecorateButton>
)

const UnderbarButton = (props: Props) => (
  <SimpleDecorateButton {...props} tag='u'>
    <u>あ</u>
  </SimpleDecorateButton>
)

const StrikeButton = (props: Props) => (
  <SimpleDecorateButton {...props} tag='s'>
    <s>あ</s>
  </SimpleDecorateButton>
)

const SupButton = (props: Props) => (
  <SimpleDecorateButton {...props} tag='sup'>
    e<sup>2</sup>
  </SimpleDecorateButton>
)

const SubButton = (props: Props) => (
  <SimpleDecorateButton {...props} tag='sub'>
    C<sub>2</sub>
  </SimpleDecorateButton>
)

const SmallButton = (props: Props) => (
  <SimpleDecorateButton {...props} tag='small'>
    小
  </SimpleDecorateButton>
)

const LargeButton = (props: Props) => (
  <SimpleDecorateButton {...props} tag='large'>
    大
  </SimpleDecorateButton>
)

const HugeButton = (props: Props) => (
  <SimpleDecorateButton {...props} tag='huge'>
    巨大
  </SimpleDecorateButton>
)

const KusodekaButton = (props: Props) => (
  <SimpleDecorateButton {...props} tag='kusodeka'>
    クソデカ
  </SimpleDecorateButton>
)

const ColorButton = (props: Props & { color: string }) => (
  <SimpleDecorateButton {...props} tag={`#${props.color}`} closeTag='#'>
    <span style={{ color: `#${props.color}` }}>■</span>
  </SimpleDecorateButton>
)

const RubyButton = (props: Props) => {
  const click = (e: any) => {
    props.setMessage(addRubyTag(props.selector))
  }
  return (
    <DecorateButton {...props} click={click}>
      rb
    </DecorateButton>
  )
}

const addTag = (
  selector: string,
  tagPrefix: string,
  tagSuffix: string = tagPrefix
): string => {
  const textarea = document.querySelector(selector) as
    | HTMLTextAreaElement
    | undefined
  if (!textarea) return ''
  const currentText = textarea.innerHTML
  const selectionStart = textarea.selectionStart
  const selectionEnd = textarea.selectionEnd

  const replaced =
    currentText.slice(0, selectionStart) +
    `[${tagPrefix}]` +
    currentText.slice(selectionStart, selectionEnd) +
    `[/${tagSuffix}]` +
    currentText.slice(selectionEnd)

  return replaced
}

const addSingleTag = (selector: string, tag: string): string => {
  const textarea = document.querySelector(selector) as
    | HTMLTextAreaElement
    | undefined
  if (!textarea) return ''
  const currentText = textarea.innerHTML
  const selectionStart = textarea.selectionStart
  const selectionEnd = textarea.selectionEnd

  const replaced =
    currentText.slice(0, selectionStart) +
    `[${tag}]` +
    currentText.slice(selectionStart, selectionEnd) +
    currentText.slice(selectionEnd)

  return replaced
}

const addRubyTag = (selector: string): string => {
  const textarea = document.querySelector(selector) as
    | HTMLTextAreaElement
    | undefined
  if (!textarea) return ''
  const currentText = textarea.innerHTML
  const selectionStart = textarea.selectionStart
  const selectionEnd = textarea.selectionEnd

  const replaced =
    currentText.slice(0, selectionStart) +
    `[ruby]${currentText.slice(selectionStart, selectionEnd)}[rt][/rt][/ruby]` +
    currentText.slice(selectionEnd)

  return replaced
}

const RandomKeywordSelect = (props: Props) => {
  const candidates = [
    {
      label: '[ランダム]',
      value: ''
    },
    {
      label: '[dice]',
      value: '1d6'
    },
    {
      label: '[who]',
      value: 'who'
    },
    {
      label: '[or]',
      value: 'or'
    }
  ]
  const [selected, setSelected] = useState('')
  const handleRandomSelected = (value: string) => {
    if (value === '') return
    props.setMessage(addSingleTag(props.selector, value))
    setSelected('')
  }
  return (
    <select
      className='base-border ml-1 border p-1 text-xs text-gray-700'
      value={selected}
      onChange={(e: any) => handleRandomSelected(e.target.value)}
    >
      {candidates.map((c) => (
        <option key={c.value} value={c.value}>
          {c.label}
        </option>
      ))}
    </select>
  )
}
