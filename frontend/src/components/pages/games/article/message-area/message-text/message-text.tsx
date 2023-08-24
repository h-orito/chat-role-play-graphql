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
  // .*?だと改行にマッチしないので、[\s\S]*?にする
  {
    regex: /\[b\]([\s\S]*?)\[\/b\]/g,
    replace: `<strong>$1</strong>`
  },
  {
    regex: /\[#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\]([\s\S]*?)\[\/#\]/g,
    replace: `<span style="color: #$1;">$2</span>`
  },
  {
    regex: /\[i\]([\s\S]*?)\[\/i\]/g,
    replace: `<em>$1</em>`
  },
  {
    regex: /\[u\]([\s\S]*?)\[\/u\]/g,
    replace: `<u>$1</u>`
  },
  {
    regex: /\[s\]([\s\S]*?)\[\/s\]/g,
    replace: `<s>$1</s>`
  },
  {
    regex: /\[sup\]([\s\S]*?)\[\/sup\]/g,
    replace: `<sup>$1</sup>`
  },
  {
    regex: /\[sub\]([\s\S]*?)\[\/sub\]/g,
    replace: `<sub>$1</sub>`
  },
  {
    regex: /\[small\]([\s\S]*?)\[\/small\]/g,
    replace: `<small>$1</small>`
  },
  {
    regex: /\[large\]([\s\S]*?)\[\/large\]/g,
    replace: `<span style="font-size: 150%;">$1</span>`
  },
  {
    regex: /\[huge\]([\s\S]*?)\[\/huge\]/g,
    replace: `<span style="font-size: 200%;">$1</span>`
  },
  {
    regex: /\[kusodeka\]([\s\S]*?)\[\/kusodeka\]/g,
    replace: `<span style="font-size: 250%;">$1</span>`
  },
  {
    regex: /\[ruby\]([\s\S]*?)\[rt\]([\s\S]*?)\[\/rt\]\[\/ruby\]/g,
    replace: `<ruby>$1<rt>$2</rt></ruby>`
  },
  {
    regex: /(\[\dd\d{1,5}\])/g,
    replace: `<strong><small>$1</small></strong>`
  },
  {
    regex: /(\[.*or.*\])/g,
    replace: `<strong><small>$1</small></strong>`
  },
  {
    regex: /(\[who])/g,
    replace: `<strong><small>$1</small></strong>`
  }
]
