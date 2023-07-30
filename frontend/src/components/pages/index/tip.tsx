import PrimaryButton from '@/components/button/primary-button'

export default function Tip() {
  return (
    <div>
      <div className='my-4'>
        <p className='text-lg font-bold'>Amazonほしい物リスト</p>
        <div className='flex justify-end'>
          <a
            href='https://www.amazon.jp/hz/wishlist/ls/1KZSJAJS1ETW4?ref_=wl_share'
            target='_blank'
          >
            <PrimaryButton>Amazonほしいものリスト</PrimaryButton>
          </a>
        </div>
      </div>
      <hr />
      <div className='my-4'>
        <p className='text-lg font-bold'>Amazonギフト券（Eメールタイプ）</p>
        <ul className='list-inside list-disc'>
          <li>
            受取人に「wolfortあっとgooglegroups.com」を指定してください（あっとのところは@に変えてください）。
          </li>
          <li>金額は15円以上で自由に変更できます。</li>
        </ul>
        <div className='flex justify-end'>
          <a href='https://www.amazon.co.jp/dp/B004N3APGO' target='_blank'>
            <PrimaryButton>Amazonギフト券</PrimaryButton>
          </a>
        </div>
      </div>
      <hr />
      <div className='my-4'>
        <p className='text-lg font-bold'>Amazonアソシエイト経由での買い物</p>
        <ul className='list-inside list-disc'>
          <li>
            下記からAmazonに遷移してカートに追加＆購入すると、開発者に若干の紹介料が入ります。
          </li>
        </ul>
        <div className='flex justify-end'>
          <iframe
            src='https://rcm-fe.amazon-adsystem.com/e/cm?o=9&p=20&l=ez&f=ifr&linkID=c5438f7fc033eeee42260876403c6c51&t=wolfort0d-22&tracking_id=wolfort0d-22'
            className='border border-gray-300'
            scrolling='no'
            style={{ border: 'none', width: '120px', height: '90px' }}
          ></iframe>
        </div>
      </div>
      <hr />
      <div className='my-4'>
        <p className='text-lg font-bold'>Pixiv Fanbox</p>
        <div className='flex justify-end'>
          <a href='https://ort.fanbox.cc/' target='_blank'>
            <PrimaryButton>Pixiv Fanbox</PrimaryButton>
          </a>
        </div>
      </div>
    </div>
  )
}
