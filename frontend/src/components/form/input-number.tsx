import { InputHTMLAttributes, useCallback } from 'react'
import { FieldValues, useController, UseControllerProps } from 'react-hook-form'
import { FieldByType } from './types'

// see https://zukucode.com/2022/11/react-hook-form-typescript-control.html
type Props<
  TFieldValues extends FieldValues,
  TName extends FieldByType<TFieldValues, number>
> = UseControllerProps<TFieldValues, TName> &
  Exclude<
    Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'name'>,
    UseControllerProps<TFieldValues, TName>
  > & {
    label?: string
    className?: string
  }

const InputNumber = <
  TFieldValues extends FieldValues,
  TName extends FieldByType<TFieldValues, number>
>(
  props: Props<TFieldValues, TName>
) => {
  const {
    name,
    control,
    rules,
    onChange,
    onBlur,
    label,
    className,
    ...fieldProps
  } = props
  const {
    field,
    formState: { errors }
  } = useController<TFieldValues, TName>({ control, name, rules })

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      field.onChange(e)
      if (onChange) onChange(e)
    },
    [field, onChange]
  )

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement, Element>) => {
      field.onBlur()
      if (onBlur) onBlur(e)
    },
    [field, onBlur]
  )

  const errorMessage = errors[name]?.message as string | undefined
  const borderClass = errorMessage ? 'danger-border' : 'base-border'

  return (
    <div>
      {label && <label className='block text-xs font-bold'>{label}</label>}
      <input
        type='number'
        className={`${
          className ?? ''
        } rounded border ${borderClass} px-2 py-1 text-right`}
        name={field.name}
        ref={field.ref}
        value={field.value}
        onChange={handleChange}
        onBlur={handleBlur}
        {...fieldProps}
      />
      {errorMessage && <p className='danger-text text-xs'>{errorMessage}</p>}
    </div>
  )
}

export default InputNumber
