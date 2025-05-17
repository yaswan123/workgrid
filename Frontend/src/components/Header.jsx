import { useEffect, useState, useRef } from "react"
import { Link } from "react-router-dom"
import gsap from "gsap"
import logo from "../assets/logo.png"
import { useSelector, useDispatch } from "react-redux"
import { logout } from "../redux/userSlice"
import { FaUserCircle } from "react-icons/fa"

function Header() {
  const desktopLinks = useRef(null)
  const menuLinks = useRef(null)
  const [menu, setMenu] = useState(false)
  const [dis, setDis] = useState({ sm: "hidden" })
  const user = useSelector((state) => state.user.user)
  const dispatch = useDispatch()
  useEffect(() => {
    setDis({ sm: menu ? "block" : "hidden" })
  }, [menu])
  useEffect(() => {
    if (desktopLinks.current) {
      const links = desktopLinks.current.querySelectorAll("a")
      if (links.length > 0) {
        gsap.fromTo(
          links,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1, stagger: 0.25 }
        )
      }
    }
  })

  useEffect(() => {
    if (menu && menuLinks.current) {
      const links = menuLinks.current.querySelectorAll("a")
      if (links.length > 0) {
        gsap.fromTo(
          links,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1, stagger: 0.25 }
        )
      }
    }
  }, [menu])

  return (
    <div className="bg-white p-5">
      <nav className="flex h-[50px] justify-between flex-wrap items-center">
        <div className="flex items-center">
          <img src={logo} alt="" className="w-20" />
          <div className="text-xl font-semibold fonting">WorkGrid</div>
        </div>

        {/* Mobile Menu */}
        {menu && (
          <div className={`${dis.sm}`}>
            {!user ? (
              <div
                className="flex flex-col absolute justify-between items-center bg-blend-multiply w-full backdrop-blur-lg bg-transparent top-1/2 transform -translate-y-1/2 left-0 z-[1000]"
                ref={menuLinks}
              >
                <Link
                  className="cursor-pointer text-[17px] pt-20"
                  to={"login"}
                  onClick={() => setMenu(false)}
                >
                  Sign In
                </Link>
                <Link
                  className="cursor-pointer text-[17px] py-20"
                  to={"register"}
                  onClick={() => setMenu(false)}
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div
                className="flex flex-col absolute justify-between items-center bg-blend-multiply w-full backdrop-blur-lg bg-transparent top-1/2 transform -translate-y-1/2 left-0 z-[1000]"
                ref={menuLinks}
              >
                <Link
                  className="cursor-pointer text-[17px] pt-20"
                  to={"dashboard"}
                  onClick={() => setMenu(false)}
                >
                  Dashboard
                </Link>
                <Link
                  className="cursor-pointer text-[17px] pt-20"
                  to={"groups"}
                  onClick={() => setMenu(false)}
                >
                  Groups
                </Link>
                <Link
                  className="cursor-pointer text-[17px] pt-20"
                  onClick={() => {
                    setMenu(false)
                    dispatch(logout())
                  }}
                >
                  Logout
                </Link>
                <Link
                  className="cursor-pointer text-[17px] py-20"
                  to={"profile"}
                  onClick={() => setMenu(false)}
                >
                  Profile
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Desktop Menu */}
        <div className="hidden md:block sm:block">
          {!user ? (
            <div
              className="flex flex-wrap justify-between items-center gap-20"
              ref={desktopLinks}
            >
              <Link className="cursor-pointer text-[17px]" to={"login"}>
                Sign In
              </Link>
              <Link
                className="cursor-pointer text-[17px] bg-blue-700 text-white py-2 px-5 rounded-md hover:bg-blue-800"
                to={"register"}
              >
                Get Started
              </Link>
            </div>
          ) : (
            <div
              className="flex flex-wrap justify-between items-center gap-20"
              ref={desktopLinks}
            >
              <Link className="cursor-pointer text-[17px]" to={"dashboard"}>
                Dashboard
              </Link>
              <Link className="cursor-pointer text-[17px]" to={"groups"}>
                Groups
              </Link>
              <Link
                className="cursor-pointer text-[17px]"
                onClick={() => {
                  setMenu(false)
                  dispatch(logout())
                }}
              >
                Logout
              </Link>
              <Link className="cursor-pointer text-[17px]" to={"profile"}>
                <FaUserCircle className="text-4xl text-gray-500" />
              </Link>
            </div>
          )}
        </div>

        {/* Toggle Menu Button */}
        <div
          className="block md:hidden sm:hidden cursor-pointer text-[24px] z-100"
          onClick={() => setMenu(!menu)}
        >
          {menu ? "✕" : "☰"}
        </div>
      </nav>
    </div>
  )
}

export default Header
