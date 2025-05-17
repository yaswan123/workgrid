import { useState } from "react";
import { useForm } from "react-hook-form";
import { Users, X } from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchTasks } from "../redux/groupSlice";
function CreateGroup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    trigger,
  } = useForm();
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const user = useSelector((state) => state.user.user);
  let navigate = useNavigate();
  const dispatch = useDispatch();
  // Function to validate and submit the form
  const create = (obj) => {
    if (tags.length === 0) {
      setError("people", {
        type: "manual",
        message: "At least one user must be tagged",
      });
      return;
    }
    clearErrors("people"); // Clear error when valid
    obj.people = tags;
    obj.tasks = [];
    toast
      .promise(
        axios.post(`https://work-grid.vercel.app/group/create/${user._id}`, obj),
        {
          pending: "Creating group...",
          success: "Group created successfully 👌",
          error: {
            render({ data }) {
              return (
                data.response.data.message ||
                "Something went wrong, please try again"
              );
            }
          },
        },
        {
          position: "top-center",
          autoClose: 2000,
          closeOnClick: true,
          pauseOnHover: true,
        }
      )
      .then(() => {
        dispatch(fetchTasks(user._id)).then(() => {
          setTimeout(() => {
            navigate("/groups");
          }, 2000)
        });
      });
  };

  // Handle input change for user tagging
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Add user on Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (inputValue.trim() && !tags.includes(inputValue.trim())) {
        setTags([...tags, inputValue.trim()]);
        setInputValue("");
        clearErrors("people"); // Remove error when a tag is added
        trigger("people"); // Revalidate
      }
    }
  };

  // Remove a tagged user
  const handleDeleteTag = (tag) => {
    const updatedTags = tags.filter((t) => t !== tag);
    setTags(updatedTags);
    if (updatedTags.length === 0) {
      setError("people", {
        type: "manual",
        message: "At least one user must be tagged",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex justify-center items-center p-4">
      <ToastContainer />
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit(create)}
          className="bg-white rounded-2xl shadow-xl p-8 space-y-6"
        >
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Create a Group</h2>
            <p className="mt-2 text-gray-600">
              Start collaborating with your team
            </p>
          </div>

          {/* Group Name */}
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Group Name
            </label>
            <input
              type="text"
              id="name"
              {...register("name", { required: "Group name is required" })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ease-in-out"
              placeholder="Enter group name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Group Description */}
          <div className="space-y-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Group Description
            </label>
            <textarea
              id="description"
              {...register("description")}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ease-in-out"
              placeholder="Enter a description (optional)"
              rows="4"
            />
          </div>

          {/* People (Tag Users) */}
          <div className="space-y-2">
            <label
              htmlFor="people"
              className="block text-sm font-medium text-gray-700"
            >
              People (Tag Users)
            </label>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-blue-600 flex items-center"
                  onClick={() => handleDeleteTag(tag)}
                >
                  {tag}{" "}
                  <span className="ml-2">
                    <X className="w-5 h-5" />
                  </span>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type user name and press Enter"
            />
            {errors.people && (
              <p className="text-red-500 text-sm mt-1">
                {errors.people.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all duration-200 ease-in-out hover:scale-[1.02] active:scale-[0.98]"
          >
            Create Group
          </button>

          <p className="text-center text-sm text-gray-500">
            By creating a group, you agree to our Terms of Service and Privacy
            Policy
          </p>
        </form>
      </div>
    </div>
  );
}

export default CreateGroup;
