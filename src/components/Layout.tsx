import type { ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'
import './Layoout.css'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Header />
      <main className=''>
        {children}
        <div
          className="finish_line bg-amber-50"
          style={{ width: '2px' }}
        ></div>
    </main>
      <Footer />
    </>
  )
}

export default Layout