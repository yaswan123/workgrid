import { useSelector } from "react-redux"
import { FaUserCircle, FaEnvelope, FaPhone } from "react-icons/fa"
import TaskBar from "./TaskBar"
function UserProfile() {
  const user = useSelector((state) => state.user.user)

  return (
    <div className="h-full items-center justify-center bg-gradient-to-r from-blue-400 to-purple-600 p-6">
        <div className="bg-white mx-auto my-20 rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
          <FaUserCircle className="text-6xl text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
          <p className="text-gray-500 text-sm">User Profile</p>
          <div className="mt-6 space-y-4 text-left">
            <div className="flex items-center space-x-3">
              <FaEnvelope className="text-gray-500" />
              <span className="text-gray-700">{user.email}</span>
            </div>
            <div className="flex items-center space-x-3">
              <FaPhone className="text-gray-500" />
              <span className="text-gray-700">{user.contact}</span>
            </div>
          </div>
        </div>
          <TaskBar />
    </div>
  )
}

export default UserProfile
