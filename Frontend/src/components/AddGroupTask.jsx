import { useForm } from "react-hook-form";
import { useState } from "react";
import Select from "react-select";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { createTask, fetchTasks } from "../redux/taskSlice";
import { useNavigate } from "react-router-dom";
import { updateTask } from "../redux/taskSlice";
export default function AddGroupTask() {
  const location = useLocation();
  const task = location.state.task;
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: task ? task.title : "",
      description: task ? task.description : "",
      status: task ? task.status : "pending",
      priority: task ? task.priority : "medium",
      dueDate: task ? new Date(task.dueDate).toISOString().split("T")[0] : "",
      assignedTo: task ? task.assignedTo.map((user) => user) : [],
      files: [],
    },
  });
  const user = useSelector((state) => state.user.user)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const users = location.state.people;
  const id = location.state.groupId;
  const createdBy = location.state.userId;
  const [selectedAssignees, setSelectedAssignees] = useState(
    task
      ? task.assignedTo.map((user) => ({
          value: user.username,
          label: user.username,
        }))
      : []
  );

  const handleFileChange = (e) => {
    const uploadedFiles = Array.from(e.target.files);
    if (uploadedFiles.length > 5) {
      toast.error("Maximum 5 files are allowed", {
        position: "top-center",
        autoClose: 2000,
        draggable: true,
      });
      setValue("files", []);
      return;
    }
    setValue("files", uploadedFiles);
  };

  const onSubmit = async (data) => {
    if (data.assignedTo.length === 0) {
      toast.error("Please select at least one assignee", {
        position: "top-center",
        autoClose: 2000,
        draggable: true,
        closeOnClick: true,
      });
      return;
    }
    if (data.files.length > 5) {
      toast.error("Maximum 5 files are allowed", {
        position: "top-center",
        autoClose: 2000,
        draggable: true,
      });
      return;
    }
    let formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("status", data.status);
    formData.append("priority", data.priority);
    formData.append("dueDate", data.dueDate);
    formData.append("assignedTo", JSON.stringify(data.assignedTo));
    data.files.forEach((fileObj) => {
      formData.append("files", fileObj);
    });
    formData.append("createdBy", createdBy);
    formData.append("groupId", id);
    toast.promise(
      dispatch(createTask(formData)).unwrap(),
      {
        pending: "Creating task...",
        success: "Task created successfully 🎉",
        error: {
          render({ data }) {
            // `data` contains the error object
            return data.message || "Failed to create task 🤯";
          },
        },
      },
      {
        position: "top-center",
        autoClose: 2000,
        draggable: true,
      }
    );
    dispatch(fetchTasks(user._id));    
    setTimeout(() => {
      navigate(`/group/${id}`);
    }, 2000);
  };
  const handleEdit = (obj) => {
    toast.promise(
      dispatch(updateTask({ id: task._id, updatedTask: obj })),
      {
        pending: "Updating task...",
        success: "Task updated successfully! 🎉",
        error: "Failed to update task. Please try again. ⚠️",
      },
      {
        position: "top-center",
        autoClose: 2000,
        draggable: true,
      }
    );

    setTimeout(() => {
      navigate(`/group/${id}`);
    }, 2000);
  };
  const handleAssigneeChange = (selectedOptions) => {
    setSelectedAssignees(selectedOptions);
    setValue(
      "assignedTo",
      selectedOptions.map((opt) => opt.value)
    );
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-200 via-white to-violet-400">
      <ToastContainer />
      <form
        onSubmit={handleSubmit(task ? handleEdit : onSubmit)}
        className="bg-white p-6 rounded-xl shadow-md mt-6 w-full max-w-lg mx-auto space-y-4"
      >
        <h2 className="text-xl font-semibold text-center">
          {task ? "Edit" : "Create"} Task
        </h2>

        {/* Task Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            {...register("title", { required: "Title is required" })}
            type="text"
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>

        {/* Task Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            {...register("description", {
              required: "Description is required",
            })}
            rows="3"
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>

        {/* Status & Priority */}
        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              {...register("status")}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            >
              <option value="pending">Pending</option>
              <option value="inProgress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700">
              Priority
            </label>
            <select
              {...register("priority")}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Due Date
          </label>
          <input
            {...register("dueDate", { required: "Due date is required" })}
            type="date"
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
          {errors.dueDate && (
            <p className="text-red-500 text-sm">{errors.dueDate.message}</p>
          )}
        </div>

        {/* Assign Users with Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Assign To
          </label>
          <Select
            isMulti
            options={users.map((user) => ({
              value: user.username,
              label: user.username,
            }))}
            value={selectedAssignees}
            onChange={handleAssigneeChange}
            className="mt-1"
          />
        </div>

        {/* File Upload */}
        {!task && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Attach Files
            </label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            />
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          {task ? "Update" : "Create"} Task
        </button>
      </form>
    </div>
  );
}
