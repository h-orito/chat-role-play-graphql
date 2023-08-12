import { Pageable, PageableQuery } from '@/lib/generated/graphql'

type PagingProps = {
  messages: Pageable
  query: PageableQuery | undefined
  setQuery: (pageNumber: number) => void
}

export default function Paging({ messages, query, setQuery }: PagingProps) {
  if (messages.allPageCount <= 1) return <></>
  const currentPageNumber = messages.currentPageNumber ?? 1
  let pageCounts: Array<number> = []
  if (messages.allPageCount <= 5) {
    pageCounts = [...Array(messages.allPageCount)].map((_, i) => i + 1)
  } else {
    if (currentPageNumber <= 3) {
      pageCounts = [1, 2, 3, 4, 5]
    } else if (messages.allPageCount - 3 < currentPageNumber) {
      pageCounts = [
        messages.allPageCount - 4,
        messages.allPageCount - 3,
        messages.allPageCount - 2,
        messages.allPageCount - 1,
        messages.allPageCount
      ]
    } else {
      pageCounts = [
        currentPageNumber - 2,
        currentPageNumber - 1,
        currentPageNumber,
        currentPageNumber + 1,
        currentPageNumber + 2
      ]
    }
  }

  return (
    <div className='flex justify-center border-b border-gray-300'>
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
            onClick={() => setQuery(currentPageNumber - 1)}
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
            onClick={() => setQuery(currentPageNumber + 1)}
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
