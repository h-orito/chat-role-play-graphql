type Props = {
  click: (e: any) => void
  children: React.ReactNode
  className?: string
}

export default function SecondaryButton({ click, children, className }: Props) {
  return (
    <button
      className={`${
        className ?? ''
      } secondary-button rounded-sm border px-4 py-1`}
      onClick={click}
    >
      {children}
    </button>
  )
}
