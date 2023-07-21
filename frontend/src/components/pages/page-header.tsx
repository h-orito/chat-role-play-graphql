import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

type Props = {
  href: string
  header: string
}

export default function PageHeader(props: Props) {
  return (
    <div className='relative mb-2 border-b border-gray-300 py-2 text-center'>
      <Link className='absolute start-0 block px-2' href={props.href}>
        <button>
          <ArrowLeftIcon className='h-6 w-6' />
        </button>
      </Link>
      <h2 className='text-xl font-bold'>{props.header}</h2>
    </div>
  )
}
