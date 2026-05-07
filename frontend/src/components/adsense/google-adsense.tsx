import { useRouter } from 'next/router'
import { useEffect } from 'react'

const PUBLISHER_ID = '0917187897820609'
const isProduction = process.env.NODE_ENV === 'production'

type GoogleAdsenseProps = {
  slot: string
  style?: React.CSSProperties
  format?: string
  responsive?: string
}

export const GoogleAdsense = ({
  slot,
  style = { display: 'block' },
  format,
  responsive = 'false'
}: GoogleAdsenseProps) => {
  const { asPath } = useRouter()

  useEffect(() => {
    if (!isProduction) return
    try {
      ;((window as any).adsbygoogle = (window as any).adsbygoogle || []).push(
        {}
      )
    } catch (error) {
      console.log(error)
    }
  }, [asPath])

  if (!isProduction) {
    return (
      <div key={asPath}>
        <div
          className='flex items-center justify-center border border-dashed border-gray-300 text-xs text-gray-500'
          style={{ minHeight: 80, ...style }}
          data-testid='adsense-dummy'
        >
          Ad (dummy)
        </div>
      </div>
    )
  }

  return (
    <div key={asPath}>
      <ins
        className='adsbygoogle'
        style={style}
        data-adtest='off'
        data-ad-client={`ca-pub-${PUBLISHER_ID}`}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  )
}
