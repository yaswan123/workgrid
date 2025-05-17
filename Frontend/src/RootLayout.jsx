import Header from './components/Header'
import Footer from './components/Footer'
import { Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

function RootLayout() {
  const user = useSelector((state) => state.user.user)
  const location = useLocation()

  // Allow access to Home ("/") route for all users
  const isHomePage = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register'

  return (
    <div>
      <Header />
      <div className='min-h-screen'>
        {
          user || isHomePage ? (
            <Outlet />
          ) : (
            <div className='flex justify-center items-center h-screen bg-blue-300'>
              <h1 className='text-2xl'>Please login to view this page</h1>
            </div>
          )
        }
      </div>
      <Footer />
    </div>
  )
}

export default RootLayout
