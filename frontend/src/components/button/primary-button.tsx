type Props = {
  click: (e: any) => void
  disabled?: boolean
  children: React.ReactNode
}

export default function PrimaryButton({ click, disabled, children }: Props) {
  return (
    <button
      className='rounded-sm border border-blue-500 bg-blue-100 px-4 py-1 hover:bg-blue-300 disabled:bg-gray-400 disabled:text-white'
      onClick={click}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
