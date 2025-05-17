import { motion } from "framer-motion";
import { FaTrash, FaEdit, FaEye, FaDownload, FaFileAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { deleteTask, fetchTasks } from "../redux/taskSlice";
import { Search } from "lucide-react";

export default function Tasks() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks);
  const user = useSelector((state) => state.user.user);
  const [search, setSearch] = useState("")
  const [filteredTasks, setFilteredTasks] = useState([])
  useEffect(() => {
    if (user?._id) {
      dispatch(fetchTasks(user._id));
    }
  }, [user?._id, dispatch]);

  useEffect(() => {
    // Filter tasks based on search query
    const filtered = tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredTasks(filtered);
  }, [search, tasks]);

  const formatDate = (dateString) => {
    if (!dateString) return "No due date";
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}-${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${date.getFullYear()}`;
  };
  const editTask = (task) => {
    navigate("../add", { state: { task: task } });
  };

  return (
    <div className="w-full mt-5 px-2 lg:px-20 max-w-4xl mx-auto">
      <div className="flex items-center justify-center mb-8">
          <div className="relative bg-blue-200 w-full max-w-md">
            <input
              type="text"
              placeholder="Search groups..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-400"
            />
            <Search className="absolute right-3 top-2.5 text-gray-500" />
          </div>
        </div>
      {filteredTasks.length ? (
        <h1 className="text-3xl font-bold text-center fonting text-gray-800 mb-6">
          Your Tasks
        </h1>
      ) : (
        <h1 className="text-2xl text-center text-gray-700">
          No Tasks Available
          <br />
          <Link to="../add" className="text-red-600 hover:underline">
            Add now
          </Link>
        </h1>
      )}
      <ul className="space-y-4">
        {filteredTasks.map((task, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex flex-col p-4 bg-white rounded-sm shadow-md border border-gray-200 sm:p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900">
              {task.title}
            </h2>
            <p className="text-gray-600">
              {task.description || "No description available"}
            </p>
            <p className="text-gray-500">
              Due Date: {formatDate(task.dueDate) || "No due date"}
            </p>
            <p
              className={`text-sm font-medium mt-1 w-fit px-2 py-1 rounded-md ${
                task.status === "completed"
                  ? "text-green-600 bg-green-200"
                  : "text-red-600 bg-red-200"
              }`}
            >
              Status:{" "}
              {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
            </p>
            <p
              className={`text-sm font-medium mt-1 w-fit px-2 py-1 rounded-md ${
                task.priority === "high"
                  ? "text-red-600 bg-red-200"
                  : task.priority === "medium"
                  ? "text-yellow-600 bg-yellow-200"
                  : "text-green-600 bg-green-200"
              }`}
            >
              Priority:{" "}
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </p>
            {task.files && task.files.length > 0 && (
              <div className="mt-2 border-t pt-2">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Attachments:
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {task.files.map((file, fileIndex) => (
                    <li
                      key={fileIndex}
                      className="flex justify-evenly items-center gap-2 p-2 bg-gray-100 rounded-md"
                    >
                      <span className="text-gray-700 truncate w-32 flex items-center">
                        <FaFileAlt className="text-gray-600" />
                        {file.fileName}
                      </span>
                      <a
                        href={file.filePath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline flex items-center gap-1"
                      >
                        <FaEye /> <span className="hidden sm:inline">View</span>
                      </a>
                      <a
                        href={file.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download={file.name || "download"}
                        onClick={(e) => {
                          if (
                            !file.downloadUrl.startsWith(window.location.origin)
                          ) {
                            e.preventDefault();
                            fetch(file.downloadUrl)
                              .then((res) => res.blob())
                              .then((blob) => {
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement("a");
                                a.href = url;
                                a.download = file.fileName || "download";
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                                URL.revokeObjectURL(url);
                              })
                              .catch((err) =>
                                console.error("Download failed", err)
                              );
                          }
                        }}
                        className="text-green-500 hover:underline flex items-center gap-1"
                      >
                        <FaDownload />{" "}
                        <span className="hidden sm:inline">Download</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex justify-end gap-4 mt-3">
              <button
                onClick={() => editTask(task)}
                className="text-blue-500 hover:text-blue-700 transition cursor-pointer"
              >
                <FaEdit size={18} />
              </button>
              <button
                className="text-red-500 hover:text-red-700 transition cursor-pointer"
                onClick={() => {
                  dispatch(deleteTask({ id: task._id }));
                  dispatch(fetchTasks(user._id));
                }}
              >
                <FaTrash size={18} />
              </button>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
