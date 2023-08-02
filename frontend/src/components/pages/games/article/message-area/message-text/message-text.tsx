type Props = {
  rawText: string
  isConvertDisabled?: boolean
}

export default function MessageText({
  rawText,
  isConvertDisabled = false
}: Props) {
  if (isConvertDisabled) {
    return <>{rawText}</>
  }

  let converted = rawText
  replaceTargets.forEach((target) => {
    converted = converted.replace(target.regex, target.replace)
  })

  return <span dangerouslySetInnerHTML={{ __html: converted }}></span>
}

interface ReplaceTarget {
  regex: RegExp
  replace: string
}
const replaceTargets: Array<ReplaceTarget> = [
  // html escape
  { regex: /&/g, replace: '&amp;' },
  { regex: /</g, replace: '&lt;' },
  { regex: />/g, replace: '&gt;' },
  { regex: /"/g, replace: '&quot;' },
  { regex: /'/g, replace: '&#039;' },
  // 文字列装飾
  {
    regex: /\[b\](.*?)\[\/b\]/g,
    replace: `<strong>$1</strong>`
  },
  {
    regex: /\[#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\](.*?)\[\/#\]/g,
    replace: `<span style="color: #$1;">$2</span>`
  },
  {
    regex: /\[i\](.*?)\[\/i\]/g,
    replace: `<em>$1</em>`
  },
  {
    regex: /\[u\](.*?)\[\/u\]/g,
    replace: `<u>$1</u>`
  },
  {
    regex: /\[s\](.*?)\[\/s\]/g,
    replace: `<s>$1</s>`
  },
  {
    regex: /\[sup\](.*?)\[\/sup\]/g,
    replace: `<sup>$1</sup>`
  },
  {
    regex: /\[sub\](.*?)\[\/sub\]/g,
    replace: `<sub>$1</sub>`
  },
  {
    regex: /\[small\](.*?)\[\/small\]/g,
    replace: `<small>$1</small>`
  },
  {
    regex: /\[large\](.*?)\[\/large\]/g,
    replace: `<span style="font-size: 150%;">$1</span>`
  },
  {
    regex: /\[huge\](.*?)\[\/huge\]/g,
    replace: `<span style="font-size: 200%;">$1</span>`
  },
  {
    regex: /\[kusodeka\](.*?)\[\/kusodeka\]/g,
    replace: `<span style="font-size: 300%;">$1</span>`
  },
  {
    regex: /\[ruby\](.*?)\[rt\](.*?)\[\/rt\]\[\/ruby\]/g,
    replace: `<ruby>$1<rt>$2</rt></ruby>`
  }
]
