type Props = {
  click: (e: any) => void
  children: React.ReactNode
}

export default function WarnButton({ click, children }: Props) {
  return (
    <button
      className='rounded-sm border border-yellow-500 bg-yellow-100 px-4 py-1 hover:bg-yellow-300'
      onClick={click}
    >
      {children}
    </button>
  )
}
