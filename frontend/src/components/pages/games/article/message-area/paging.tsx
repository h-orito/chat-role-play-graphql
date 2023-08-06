import { Pageable, PageableQuery } from '@/lib/generated/graphql'

type PagingProps = {
  messages: Pageable
  query: PageableQuery | undefined
  setQuery: (pageNumber: number) => void
}

export default function Paging({ messages, query, setQuery }: PagingProps) {
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
            className='w-10 border border-gray-300 px-2 py-1 hover:bg-slate-200 disabled:bg-gray-400 disabled:text-white'
            onClick={() => setQuery(1)}
            disabled={!messages.hasPrePage}
          >
            &lt;&lt;
          </button>
        </li>
        <li>
          <button
            className='w-10 border border-gray-300 px-2 py-1 hover:bg-slate-200 disabled:bg-gray-400 disabled:text-white'
            onClick={() =>
              setQuery(messages.currentPageNumber ?? messages.allPageCount - 1)
            }
            disabled={!messages.hasPrePage}
          >
            &lt;
          </button>
        </li>
        {pageCounts.map((pageCount) => (
          <li key={pageCount}>
            <button
              className={`w-10 border border-gray-300 px-2 py-1 hover:bg-slate-200 ${
                pageCount === messages.currentPageNumber ? 'bg-blue-300' : ''
              }`}
              onClick={() => setQuery(pageCount)}
            >
              {pageCount}
            </button>
          </li>
        ))}
        <li>
          <button
            className='w-10 border border-gray-300 px-2 py-1 hover:bg-slate-200 disabled:bg-gray-400 disabled:text-white'
            onClick={() =>
              setQuery(messages.currentPageNumber ?? messages.allPageCount + 1)
            }
            disabled={!messages.hasNextPage}
          >
            &gt;
          </button>
        </li>
        <li>
          <button
            className='w-10 border border-gray-300 px-2 py-1 hover:bg-slate-200 disabled:bg-gray-400 disabled:text-white'
            onClick={() => setQuery(messages.allPageCount)}
            disabled={!messages.hasNextPage}
          >
            &gt;&gt;
          </button>
        </li>
      </ul>
    </div>
  )
}
