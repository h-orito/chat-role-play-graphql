import Head from 'next/head'
import { createInnerClient } from '@/components/graphql/client'
import { idToBase64 } from '@/components/graphql/convert'
import {
  Charachip,
  CharachipDetailDocument,
  CharachipDetailQuery,
  CharachipDetailQueryVariables
} from '@/lib/generated/graphql'
import PageHeader from '@/components/pages/page-header'
import CharaCards from '@/components/pages/charachips/chara-cards'

export const getServerSideProps = async (context: any) => {
  const { id } = context.params
  const client = createInnerClient()
  const charachipId = idToBase64(id, 'Charachip')
  const { data: charachipData } = await client.query<CharachipDetailQuery>({
    query: CharachipDetailDocument,
    variables: { id: charachipId } as CharachipDetailQueryVariables
  })
  return {
    props: {
      charachipId: id,
      charachip: charachipData.charachip
    }
  }
}

type Props = {
  charachipId: number
  charachip: Charachip
}

export default function CharachipPage({ charachipId, charachip }: Props) {
  return (
    <main className='w-full lg:flex lg:justify-center'>
      <Head>
        <title>ロールをプレイ！ | キャラチップ {charachip.name}</title>
      </Head>
      <article className='min-h-screen w-full text-center lg:w-[960px] lg:justify-center lg:border-x lg:border-gray-300'>
        <PageHeader href='/charachips' header={charachip.name} />
        <div className='p-4'>
          <p className='text-lg'>キャラチップ: {charachip.name}</p>
          <div className='mb-4 text-xs leading-5'>
            <p>作者: {charachip.designer.name}様</p>
            <p>名称変更: {charachip.canChangeName ? '可能' : '不可'}</p>
            <p>
              作者様HP:{' '}
              <a
                href={charachip.descriptionUrl}
                target='_blank'
                className='base-link'
              >
                {charachip.descriptionUrl}
              </a>
            </p>
          </div>
          <CharaCards charachip={charachip} />
        </div>
      </article>
    </main>
  )
}
