import { GameParticipant } from '@/lib/generated/graphql'

type Props = {
  myself: GameParticipant | null
  tab: string
  setTab: (tabName: string) => void
  existsHomeUnread: boolean
  existsFollowsUnread: boolean
}

export default function ArticleHeader({
  myself,
  tab,
  setTab,
  existsHomeUnread,
  existsFollowsUnread
}: Props) {
  const borderBottomClass = (tabName: string) => {
    if (tab === tabName) {
      return 'box-border border-b-2 border-blue-500'
    }
    return ''
  }
  const onClickTab = (tabName: string) => {
    setTab(tabName)
  }

  return (
    <div className='flex border-b border-gray-300'>
      <div className={`flex-1 text-center ${borderBottomClass('home')}`}>
        <button
          className='w-full  px-4 py-2 hover:bg-slate-200'
          onClick={() => onClickTab('home')}
        >
          {existsHomeUnread && (
            <span className='mr-2 text-xs text-blue-500'>●</span>
          )}
          ホーム
        </button>
      </div>
      {myself != null && (
        <>
          <div className={`flex-1 text-center ${borderBottomClass('follow')}`}>
            <button
              className='w-full  px-4 py-2 hover:bg-slate-200'
              onClick={() => onClickTab('follow')}
            >
              {existsFollowsUnread && (
                <span className='mr-2 text-xs text-blue-500'>●</span>
              )}
              フォロー中
            </button>
          </div>
          <div className={`flex-1 text-center ${borderBottomClass('dm')}`}>
            <button
              className='w-full  px-4 py-2 hover:bg-slate-200'
              onClick={() => onClickTab('dm')}
            >
              ダイレクトメッセージ
            </button>
          </div>
        </>
      )}
    </div>
  )
}
