import { Pageable, PageableQuery } from '@/lib/generated/graphql'

type PagingProps = {
  messages: Pageable
  query: PageableQuery | undefined
  setPageableQuery: (q: PageableQuery) => void
  scrollToTop: () => void
}

export default function Paging({
  messages,
  query,
  setPageableQuery,
  scrollToTop
}: PagingProps) {
  if (messages.allPageCount <= 1) return <></>
  const currentPageNumber =
    query?.isLatest === true
      ? messages.allPageCount
      : messages.currentPageNumber ?? 1
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

  const setPageNumber = (pageNumber: number) => {
    setPageableQuery({
      ...query!,
      pageNumber: pageNumber,
      isLatest: false
    })
    scrollToTop()
  }

  const setLatest = () => {
    setPageableQuery({
      ...query!,
      pageNumber: 1,
      isLatest: true
    })
    scrollToTop()
  }

  return (
    <div className='base-border flex justify-center border-b'>
      <ul className='flex py-2 text-xs'>
        <li>
          <button
            className='base-border w-8 border px-2 py-1 hover:bg-slate-200 disabled:bg-gray-400 disabled:text-white md:w-10'
            onClick={() => setPageNumber(1)}
            disabled={!messages.hasPrePage}
          >
            &lt;&lt;
          </button>
        </li>
        <li>
          <button
            className='base-border w-8 border px-2 py-1 hover:bg-slate-200 disabled:bg-gray-400 disabled:text-white md:w-10'
            onClick={() =>
              setPageNumber(
                query?.isLatest === true
                  ? messages.allPageCount
                  : currentPageNumber - 1
              )
            }
            disabled={!messages.hasPrePage}
          >
            &lt;
          </button>
        </li>
        {pageCounts.map((pageCount) => (
          <li key={pageCount}>
            <button
              className={`base-border w-10 border px-2 py-1 hover:bg-slate-200 ${
                query?.isLatest !== true &&
                pageCount === messages.currentPageNumber
                  ? 'primary-active'
                  : ''
              }`}
              onClick={() => setPageNumber(pageCount)}
            >
              {pageCount}
            </button>
          </li>
        ))}
        <li>
          <button
            className='base-border w-8 border px-2 py-1 hover:bg-slate-200 disabled:bg-gray-400 disabled:text-white md:w-10'
            onClick={() =>
              setPageNumber(
                query?.isLatest === true
                  ? messages.allPageCount
                  : currentPageNumber + 1
              )
            }
            disabled={!messages.hasNextPage}
          >
            &gt;
          </button>
        </li>
        <li>
          <button
            className='base-border w-8 border px-2 py-1 hover:bg-slate-200 disabled:bg-gray-400 disabled:text-white md:w-10'
            onClick={() => setPageNumber(messages.allPageCount)}
            disabled={!messages.hasNextPage}
          >
            &gt;&gt;
          </button>
        </li>
        {query?.isDesc === false && (
          <li>
            <button
              className={`base-border w-12 border px-2 py-1 hover:bg-slate-200 disabled:bg-gray-400 disabled:text-white ${
                query?.isLatest === true ? 'primary-active' : ''
              }`}
              onClick={() => setLatest()}
            >
              最新
            </button>
          </li>
        )}
      </ul>
    </div>
  )
}
