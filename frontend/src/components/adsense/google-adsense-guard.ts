export const googleAdnsenseStyleGuard = () => {
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
}
