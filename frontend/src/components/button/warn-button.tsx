type Props = {
  click: (e: any) => void
  children: React.ReactNode
}

export default function WarnButton({ click, children }: Props) {
  return (
    <button
      className='warning-button rounded-sm border px-4 py-1'
      onClick={click}
    >
      {children}
    </button>
  )
}
