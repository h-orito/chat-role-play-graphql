type Props = {
  click: (e: any) => void
  children: React.ReactNode
  className?: string
}

export default function SecondaryButton({ click, children, className }: Props) {
  return (
    <button
      className={`${className} rounded-sm border border-gray-500 bg-gray-100 px-4 py-1 hover:bg-gray-300`}
      onClick={click}
    >
      {children}
    </button>
  )
}
