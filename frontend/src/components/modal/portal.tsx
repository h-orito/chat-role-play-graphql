import ReactDOM from 'react-dom'

type PortalProps = {
  children: React.ReactNode
}

const Portal = ({ children }: PortalProps) => {
  if (typeof window === 'undefined') {
    return null
  }
  const element = document.querySelector('#__next')
  return element ? ReactDOM.createPortal(children, element) : null
}

export default Portal
