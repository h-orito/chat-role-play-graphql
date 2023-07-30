import PageHeader from '@/components/pages/page-header'

export default function CreateGame() {
  return (
    <main className='w-full lg:flex lg:justify-center'>
      <article className='min-h-screen w-full text-center lg:w-[960px] lg:justify-center lg:border-x lg:border-gray-300'>
        <PageHeader href='/' header='更新履歴' />
        <div className='p-4'>
          <div className='my-4 bg-gray-200 px-4 py-2'>
            <div className='flex border-b border-gray-500'>
              <p className='font-bold'>公開</p>
              <p className='ml-auto mt-auto text-xs text-gray-500'>
                2023/07/25
              </p>
            </div>
            <ul className='list-inside list-disc py-2 text-left text-xs'>
              <li>公開してみました。</li>
            </ul>
          </div>
        </div>
      </article>
    </main>
  )
}
