import logo from '../assets/logo.png'
function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center flex-wrap justify-between">
            <div className="flex items-center gap-2">
              <img src={logo} alt="Logo" className='w-20' />
              <span className="text-xl font-bold text-white">WorkGrid</span>
            </div>
            <div className="flex gap-8">
              <a href="#features" className="hover:text-white transition-colors">
                Features
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
            <p>&copy; {new Date().getFullYear()} WorkGrid. All rights reserved.</p>
          </div>
        </div>
      </footer>
  )
}

export default Footer
