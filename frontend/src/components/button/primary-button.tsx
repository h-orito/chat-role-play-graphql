type Props = {
  click?: (e: any) => void
  disabled?: boolean
  children: React.ReactNode
  className?: string
}

export default function PrimaryButton({
  click,
  disabled,
  children,
  className
}: Props) {
  return (
    <button
      className={`${
        className ?? ''
      } primary-button rounded-sm border px-4 py-1`}
      onClick={click}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
