import { useRouter } from 'next/router'
import { useEffect } from 'react'

const PUBLISHER_ID = '0917187897820609'

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
}: GoogleAdsenseProps): JSX.Element => {
  const { asPath } = useRouter()

  useEffect(() => {
    try {
      ;((window as any).adsbygoogle = (window as any).adsbygoogle || []).push(
        {}
      )
    } catch (error) {
      console.log(error)
    }
  }, [asPath])

  // GoogleAdsenseがstyle属性を勝手に付与してくるので回避するための処理
  // see https://deep.tacoskingdom.com/blog/195
  document.querySelectorAll('.mut-height-guard').forEach((target) => {
    const heightChangeObserver = new MutationObserver(() => {
      ;(target as HTMLElement).style.height = ''
    })
    heightChangeObserver.observe(target, {
      attributes: true,
      attributeFilter: ['style']
    })
  })

  return (
    <div key={asPath}>
      <ins
        className='adsbygoogle'
        style={style}
        data-adtest={process.env.NODE_ENV === 'production' ? 'off' : 'on'}
        data-ad-client={`ca-pub-${PUBLISHER_ID}`}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  )
}
