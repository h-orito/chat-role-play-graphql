import SubmitButton from '@/components/button/submit-button'
import InputText from '@/components/form/input-text'
import Modal from '@/components/modal/modal'
import {
  Chara,
  Charachip,
  Game,
  NewGameParticipant,
  RegisterGameParticipantDocument,
  RegisterGameParticipantMutation,
  RegisterGameParticipantMutationVariables
} from '@/lib/generated/graphql'
import { useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import Link from 'next/link'
import RadioGroup from '@/components/form/radio-group'
import InputSelect from '@/components/form/input-select'
import PrimaryButton from '@/components/button/primary-button'
import CharaSelect from './chara-select'
import { useGameValue } from '../game-hook'

type Props = {
  close: (e: any) => void
}

interface FormInput {
  participantName: string
  password: string
}

export default function Participate({ close }: Props) {
  const game = useGameValue()
  const router = useRouter()
  const { control, formState, handleSubmit, setValue } = useForm<FormInput>({
    defaultValues: {
      participantName: '',
      password: ''
    }
  })
  const [checkedTerm, setCheckedTerm] = useState(false)
  const [checkedPolicy, setCheckedPolicy] = useState(false)
  const [participate] = useMutation<RegisterGameParticipantMutation>(
    RegisterGameParticipantDocument
  )
  const [bizError, setBizError] = useState<string | null>(null)

  const canUseCharachip = game.settings.chara.charachips.length > 0
  const charachips = canUseCharachip ? game.settings.chara.charachips : []
  const [useCharachip, setUseCharachip] = useState<boolean>(false)
  const [charachip, setCharachip] = useState<Charachip | null>(
    canUseCharachip ? charachips[0] : null
  )
  const canChangeName =
    !useCharachip || charachip == null || charachip.canChangeName
  const [chara, setChara] = useState<Chara | null>(null)
  const handleSelectCharachip = (id: string) => {
    setCharachip(charachips.find((c) => c.id === id) || null)
    setChara(null)
  }
  const handleSelectChara = (id: string) => {
    const chara = charachip?.charas?.find((c) => c.id === id) || null
    setChara(chara)
    if (chara) {
      setValue('participantName', chara.name, {
        shouldValidate: true
      })
    }
  }
  const [isOpenCharaSelectModal, setIsOpenCharaSelectModel] = useState(false)
  const toggleCharaSelectModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsOpenCharaSelectModel(!isOpenCharaSelectModal)
    }
  }

  const onSubmit: SubmitHandler<FormInput> = useCallback(
    async (data) => {
      setBizError(null)
      const { errors } = await participate({
        variables: {
          input: {
            gameId: game.id,
            name: data.participantName,
            charaId: chara?.id,
            password: data.password
          } as NewGameParticipant
        } as RegisterGameParticipantMutationVariables
      })
      if (errors) {
        if (errors[0].extensions?.code === 'PARTICIPATE_ERROR') {
          setBizError(errors[0].message)
        }
      } else {
        router.reload()
      }
    },
    [participate, chara]
  )

  const canSubmit: boolean =
    (!useCharachip || (useCharachip && charachip != null && chara != null)) &&
    formState.isValid &&
    !formState.isSubmitting &&
    checkedTerm &&
    checkedPolicy

  return (
    <div>
      {bizError && (
        <div className='my-4'>
          <div className='danger-background my-1 rounded-sm p-2'>
            <ul className='list-inside list-disc text-xs'>
              <li>{bizError}</li>
            </ul>
          </div>
        </div>
      )}
      <div className='my-4'>
        <label className='text-xs font-bold'>参加条件の確認</label>
        <div className='my-1'>
          <input
            type='checkbox'
            id='term-check'
            checked={checkedTerm}
            onChange={(e: any) => setCheckedTerm((prev) => !prev)}
          />
          <label htmlFor='term-check' className='ml-2 text-xs'>
            <Link target='_blank' href='/rules' className='base-link'>
              ルール
            </Link>
            を確認し、守るべき事項について理解しました。
          </label>
        </div>
        <div>
          <input
            type='checkbox'
            id='policy-check'
            checked={checkedPolicy}
            onChange={(e: any) => setCheckedPolicy((prev) => !prev)}
          />
          <label htmlFor='policy-check' className='ml-2 text-xs'>
            他者への礼節を欠いたり、正常な運営を妨げるような行為を行なった場合、管理人の裁量により処罰される可能性があることについて理解しました。
          </label>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {canUseCharachip && (
          <>
            <div className='my-4'>
              <label className='text-xs font-bold'>キャラチップ利用</label>
              <div className='mt-1'>
                <RadioGroup
                  name='use-charachip'
                  className='text-xs'
                  candidates={[
                    {
                      label: 'オリジナルキャラクター',
                      value: 'false'
                    },
                    {
                      label: 'キャラチップ利用',
                      value: 'true'
                    }
                  ]}
                  selected={useCharachip ? 'true' : 'false'}
                  setSelected={(value) => setUseCharachip(value === 'true')}
                />
              </div>
            </div>

            {useCharachip && (
              <>
                <div className='my-4'>
                  <label className='text-xs font-bold'>キャラチップ</label>
                  <InputSelect
                    className='w-64 text-xs md:w-96'
                    candidates={game.settings.chara.charachips.map((c) => ({
                      label: `${c.name}（${c.designer.name}様）`,
                      value: c.id
                    }))}
                    selected={charachip?.id}
                    setSelected={handleSelectCharachip}
                  />
                </div>
                <div className='my-4'>
                  <label className='text-xs font-bold'>キャラクター</label>
                  <div className='danger-background my-1 rounded-sm p-2'>
                    <ul className='list-inside list-disc text-xs'>
                      <li>
                        参加後に変更することができないためご注意ください。
                      </li>
                    </ul>
                  </div>
                  <div className='my-2 flex'>
                    <p className='mr-2 self-center text-xs'>
                      {chara == null ? '未選択' : chara.name}
                    </p>
                    <PrimaryButton
                      click={(e: any) => {
                        e.preventDefault()
                        setIsOpenCharaSelectModel(true)
                      }}
                    >
                      選択
                    </PrimaryButton>
                  </div>
                  {isOpenCharaSelectModal && (
                    <Modal close={toggleCharaSelectModal} hideFooter>
                      <CharaSelect
                        charas={charachip?.charas || []}
                        setValue={(id: string) => {
                          setIsOpenCharaSelectModel(false)
                          handleSelectChara(id)
                        }}
                      />
                    </Modal>
                  )}
                </div>
              </>
            )}
          </>
        )}

        <div className='my-4'>
          <label className='text-xs font-bold'>キャラクター名</label>
          <div className='notification-background notification-border notification-text my-1 rounded-sm border p-2'>
            <ul className='list-inside list-disc text-xs'>
              {canChangeName ? (
                <li>後で変更可能です。</li>
              ) : (
                <li className='text-red-500'>
                  名称変更不可キャラチップのため、変更できません。
                </li>
              )}
              <li>プロフィール等は参加登録後に編集可能になります。</li>
            </ul>
          </div>
          <InputText
            name='participantName'
            control={control}
            rules={{
              required: '必須です',
              maxLength: {
                value: 50,
                message: `50文字以内で入力してください`
              }
            }}
            disabled={!canChangeName}
          />
        </div>
        {game.settings.password.hasPassword && (
          <div className='my-4'>
            <label className='text-xs font-bold'>参加パスワード</label>
            <InputText
              name='password'
              control={control}
              rules={{
                required: '必須です',
                maxLength: {
                  value: 50,
                  message: `50文字以内で入力してください`
                }
              }}
            />
          </div>
        )}
        <div className='flex justify-end'>
          <SubmitButton label='参加登録' disabled={!canSubmit} />
        </div>
      </form>
    </div>
  )
}
