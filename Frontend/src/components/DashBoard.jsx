import { Link, Outlet } from "react-router-dom"
import { useSelector } from "react-redux"
import { Plus } from "lucide-react"
export default function DashBoard() {
  const user = useSelector((state) => state.user.user)
  return (
    <div>
      {user ? (
        <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-white to-[#00719c] p-4">
          <nav className="flex gap-4 mb-5 flex-wrap justify-center">
            <Link
              to="add"
              className="bg-purple-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-purple-700 transition duration-300 transform hover:scale-105 flex items-center"
            >
              <Plus />
              Add Task
            </Link>
            <Link
              to="tasks"
              className="bg-teal-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-teal-700 transition duration-300 transform hover:scale-105"
            >
              📋 View Tasks
            </Link>
          </nav>

          <Outlet />
        </div>
      ) : (
        <div className="text-black text-center pt-40 text-xl fonting font-semibold h-screen bg-blue-200">
          Not logged in
          <br />
          <Link to={"../login"} className="text-red-900">
            Login here
          </Link>
        </div>
      )}
    </div>
  )
}
