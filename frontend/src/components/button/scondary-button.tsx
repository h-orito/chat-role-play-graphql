type Props = {
  click: (e: any) => void
  children: React.ReactNode
}

export default function SecondaryButton({ click, children }: Props) {
  return (
    <button
      className='rounded-sm border border-gray-500 bg-gray-100 px-4 py-1 hover:bg-gray-300'
      onClick={click}
    >
      {children}
    </button>
  )
}
