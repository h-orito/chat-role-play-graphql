type Props = {
  click: (e: any) => void
  children: React.ReactNode
}

export default function DangerButton({ click, children }: Props) {
  return (
    <button
      className='rounded-sm border border-red-500 bg-red-100 px-4 py-1 hover:bg-red-300'
      onClick={click}
    >
      {children}
    </button>
  )
}
