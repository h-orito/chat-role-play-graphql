import {
  ChangeEvent,
  ChangeEventHandler,
  FocusEventHandler,
  InputHTMLAttributes,
  useCallback
} from 'react'
import { FieldValues, useController, UseControllerProps } from 'react-hook-form'
import { FieldByType } from './types'
import TextareaAutosize, {
  TextareaAutosizeProps
} from 'react-textarea-autosize'

// see https://zukucode.com/2022/11/react-hook-form-typescript-control.html
type Props<
  TFieldValues extends FieldValues,
  TName extends FieldByType<TFieldValues, string>
> = UseControllerProps<TFieldValues, TName> &
  Exclude<
    Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'name'>,
    UseControllerProps<TFieldValues, TName>
  > & {
    id?: string
    label?: string
    maxLength?: number
    textareaclassname?: string
  } & TextareaAutosizeProps

const InputTextarea = <
  TFieldValues extends FieldValues,
  TName extends FieldByType<TFieldValues, string>
>(
  props: Props<TFieldValues, TName>
) => {
  const {
    id,
    textareaclassname, // classNameにすると崩れてしまう 原因がわからないので一旦回避
    name,
    control,
    rules,
    onChange,
    onBlur,
    label,
    maxLength,
    ...fieldProps
  } = props
  const {
    field,
    formState: { errors }
  } = useController<TFieldValues, TName>({ control, name, rules })

  const handleChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      field.onChange(e)
      if (onChange) onChange(e)
    },
    [field, onChange]
  )

  const handleBlur: FocusEventHandler<HTMLTextAreaElement> = useCallback(
    (e: React.FocusEvent<HTMLTextAreaElement, Element>) => {
      field.onBlur()
      if (onBlur) onBlur(e)
    },
    [field, onBlur]
  )

  const errorMessage = errors[name]?.message as string | undefined
  const borderClass = errorMessage ? 'danger-border' : 'base-border'

  return (
    <div>
      {label && (
        <label className='base-text block text-xs font-bold'>{label}</label>
      )}
      <TextareaAutosize
        id={id ?? field.name}
        className={`${textareaclassname} rounded border ${borderClass} w-full px-2 py-1 text-gray-700`}
        ref={field.ref}
        value={field.value}
        onChange={handleChange}
        onBlur={handleBlur}
        {...props}
      />
      {maxLength && <TextCount maxLength={maxLength} value={field.value} />}
      {errorMessage && <p className='danger-text text-xs'>{errorMessage}</p>}
    </div>
  )
}

export default InputTextarea

const TextCount = (props: { maxLength: number; value: string }) => {
  const isOver = props.value.length > props.maxLength
  return (
    <p className={`flex justify-end ${isOver ? 'danger-text' : ''}`}>
      {props.value.length} / {props.maxLength}
    </p>
  )
}
