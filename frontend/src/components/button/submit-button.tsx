type Props = {
  label: string
  disabled?: boolean
}

export default function SubmitButton({ label, disabled }: Props) {
  const colorClass = disabled
    ? 'border-gray-400 bg-gray-400 text-white'
    : 'border-blue-500 bg-blue-100 hover:bg-blue-300'
  return (
    <input
      type='submit'
      value={label}
      disabled={disabled}
      className={`rounded-sm border px-4 py-1 ${colorClass}`}
    />
  )
}
