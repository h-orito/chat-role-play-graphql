type Props = {
  click: (e: any) => void
  children: React.ReactNode
  className?: string
  disabled?: boolean
}

export default function DangerButton({
  click,
  children,
  className,
  disabled
}: Props) {
  return (
    <button
      className={`${className} rounded-sm border border-red-500 bg-red-100 px-4 py-1 hover:bg-red-300 disabled:bg-gray-400 disabled:text-white`}
      onClick={click}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
