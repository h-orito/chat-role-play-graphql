import { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

// 発言・ト書き・GM発言・DMの「固定」表示時の共通ラッパ。
// スマホ: max-h-[30vh] / PC(md+): max-h-[35vh]、いずれも縦スクロール可。
// overflow-y-scroll は集約前 4 箇所すべての挙動を維持するため auto ではなく scroll。
export default function FixedPanelWrapper({ children }: Props) {
  return (
    <div className='max-h-[30vh] overflow-y-scroll md:max-h-[35vh]'>
      {children}
    </div>
  )
}
