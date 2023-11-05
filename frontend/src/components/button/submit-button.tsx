type Props = {
  label: string
  disabled?: boolean
}

export default function SubmitButton({ label, disabled }: Props) {
  return (
    <input
      type='submit'
      value={label}
      disabled={disabled}
      className={`primary-button rounded-sm border px-4 py-1`}
    />
  )
}
