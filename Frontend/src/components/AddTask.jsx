import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useLocation, useNavigate } from "react-router-dom"
import { FiUpload, FiCheckCircle } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"
import { createTask, updateTask } from "../redux/taskSlice"
import { toast, ToastContainer } from "react-toastify"

export default function AddTask() {
  const location = useLocation()
  let task = location.state?.task
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      priority: task?.priority || "medium",
      status: task?.status || "pending",
    },
  })
  const [selectedFiles, setSelectedFiles] = useState([])
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state) => state.user.user)

  // Handle multiple file selection
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files)
    setSelectedFiles(files)
  }

  const onSubmit = (data) => {
    const formData = new FormData()
    formData.append("createdBy", user._id)
    formData.append("title", data.title)
    formData.append("description", data.description || "")
    formData.append("dueDate", data.dueDate)
    formData.append("priority", data.priority)
    formData.append("status", data.status)
    if (selectedFiles.length > 5) {
      toast.error("Maximum 5 files are allowed", {
        position: "top-center",
        autoClose: 2000,
        draggable: true,
      })
      return
    }
    selectedFiles.forEach((file) => {
      formData.append("files", file) // Append multiple files
    })

    dispatch(createTask(formData))
    toast.success("Task created successfully", {
      position: "top-center",
      autoClose: 2000,
      draggable: true,
    })
    setTimeout(() => {
      navigate("../tasks")
    }, 2000)
  }
  useEffect(() => {
    if (task) {
      let newn = new Date(task?.dueDate).toISOString().split("T")[0]
      setValue("dueDate", newn)
    }
  }, [task, setValue])

  const onEdit = (obj) => {
    obj.createdAt = task.createdAt
    obj.files = task.files
    obj.createdBy = user._id

    toast.promise(
        dispatch(updateTask({ id: task._id, updatedTask: obj })).unwrap(),
        {
            pending: "Updating task...",
            success: "Task updated successfully! 🎉",
            error: "Failed to update task. Please try again. ❌",
        },
        {
            position: "top-center",
            autoClose: 2000,
            draggable: true,
        }
    ).then(() => {
        setTimeout(() => {
            navigate("../tasks")
        }, 2000)
    })
}

  return (
    <div className="flex w-[95vw] sm:w-xl justify-center items-center min-h-screen p-4">
      <ToastContainer />
      <div className="bg-white shadow-xl rounded-sm p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">
          {task?"Edit":"Create"} Task
        </h1>
        <form
          onSubmit={handleSubmit(!task ? onSubmit : onEdit)}
          className="space-y-4"
        >
          {/* Task Name */}
          <div>
            <label className="block text-gray-700 font-medium">Task Name</label>
            <input
              type="text"
              {...register("title", { required: "Task name is required" })}
              className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter task name"
              defaultValue={task?.title}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-medium">
              Description
            </label>
            <textarea
              {...register("description")}
              className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter task description"
              defaultValue={task?.description}
            ></textarea>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-gray-700 font-medium">Due Date</label>
            <input
              type="date"
              {...register("dueDate", { required: "Due date is required" })}
              className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.dueDate && (
              <p className="text-red-500 text-sm">{errors.dueDate.message}</p>
            )}
          </div>

          {/* Priority */}
          <div>
            <label className="block text-gray-700 font-medium">Priority</label>
            <select
              {...register("priority")}
              className="w-full mt-1 p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-gray-700 font-medium">Status</label>
            <select
              {...register("status")}
              className="w-full mt-1 p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="pending">Pending</option>
              <option value="inProgress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* File Upload (Supports Multiple Files) */}
          {!task && (
            <div>
              <label className="text-gray-700 font-medium flex items-center gap-2">
                <FiUpload /> Attach Files
              </label>
              <input
                type="file"
                multiple // Allows multiple files
                onChange={handleFileChange}
                className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              {selectedFiles.length > 0 && (
                <p className="text-green-600 text-sm mt-1">
                  {selectedFiles.length} file(s) selected
                </p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white p-3 rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            <FiCheckCircle /> {task?"Update":"Add"} Task
          </button>
        </form>
      </div>
    </div>
  )
}
