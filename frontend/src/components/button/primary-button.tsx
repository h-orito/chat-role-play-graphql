type Props = {
  click: (e: any) => void
  children: React.ReactNode
}

export default function PrimaryButton({ click, children }: Props) {
  return (
    <button
      className='rounded-sm border border-blue-500 bg-blue-100 px-4 py-1 hover:bg-blue-300'
      onClick={click}
    >
      {children}
    </button>
  )
}
