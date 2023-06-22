import { Messages } from '@/lib/generated/graphql'

type PagingProps = {
  messages: Messages
}

export default function Paging({ messages }: PagingProps) {
  if (messages.allPageCount <= 1) return <></>
  let pageCounts: Array<number> = []
  if (messages.allPageCount <= 5) {
    pageCounts = [...Array(messages.allPageCount)].map((_, i) => i + 1)
  }

  return (
    <div className='flex justify-center border-t border-gray-300'>
      <ul className='flex py-2 text-xs'>
        <li>
          <button
            className='w-12 border border-gray-300 px-2 py-1 hover:bg-slate-200'
            disabled={!messages.hasPrePage}
          >
            &lt;&lt;
          </button>
        </li>
        <li>
          <button
            className='w-12 border border-gray-300 px-2 py-1 hover:bg-slate-200'
            disabled={!messages.hasPrePage}
          >
            &lt;
          </button>
        </li>
        {pageCounts.map((pageCount) => (
          <li>
            <button className='w-12 border border-gray-300 px-2 py-1 hover:bg-slate-200'>
              {pageCount}
            </button>
          </li>
        ))}
        <li>
          <button
            className='w-12 border border-gray-300 px-2 py-1 hover:bg-slate-200'
            disabled={!messages.hasNextPage}
          >
            &gt;&gt;
          </button>
        </li>
        <li>
          <button
            className='w-12 border border-gray-300 px-2 py-1 hover:bg-slate-200'
            disabled={!messages.hasNextPage}
          >
            &gt;
          </button>
        </li>
        <li>
          <button className='w-12 border border-gray-300 px-2 py-1 hover:bg-slate-200'>
            最新
          </button>
        </li>
      </ul>
    </div>
  )
}
