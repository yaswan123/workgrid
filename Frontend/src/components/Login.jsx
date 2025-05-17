import { useForm } from "react-hook-form"
import pic from "../assets/login_bg.png"
import { useDispatch } from "react-redux"
import axios from "axios"
import { login } from "../redux/userSlice"
import { useNavigate } from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify'
function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const navigate = useNavigate()

  let dispatch = useDispatch()
  const onSubmit = (data) => {
    toast.promise(
      axios.post('https://work-grid.vercel.app/user/login', data)
        .then((res) => {
          dispatch(login(res.data))
          setTimeout(() => navigate('/dashboard'), 2000)
        }),
      {
        pending: "Logging in...",
        success: "Logged in successfully! 🎉",
        error: {
          render({ data }) {
            return data.response?.data?.message || "Login failed! ❌"
          },
        },
      },
      {
        position: "top-center",
        autoClose: 2000,
        closeOnClick: true,
        draggable: true,
      }
    )    
  }
  return (
    <div
      className="pt-28 z-10"
      style={{
        backgroundImage: `url(${pic})`,
        backgroundSize: "cover",
        height: "100vh",
        backgroundPosition: "center",
      }}
    >
      <ToastContainer />
      <div className="max-w-md mx-auto bg-transparent backdrop-blur-xl p-6 rounded-lg shadow-[0_-10px_30px_-5px_rgba(0,0,0,0.3)]">
        <div className="text-center  text-4xl font-bold">Login</div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          <div>
            <label
              htmlFor="email"
              className="block  font-medium mb-1"
            >
              Email
            </label>
            <input
              type="email"
              {...register("email", { required: true })}
              className="bg-gray-100 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <span className="text-sm text-red-500 font-semibold mt-1">
                *Email is required
              </span>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block  font-medium mb-1"
            >
              Password
            </label>
            <input
              type="password"
              {...register("password", { required: true })}
              className="bg-gray-100 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <span className="text-sm text-red-500 font-semibold mt-1">
                *Password is required
              </span>
            )}
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-bold mt-5 py-2 px-4 rounded-lg hover:bg-blue-600 transition"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
