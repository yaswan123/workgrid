import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Users, Edit, UserPlus, Plus, X, Minus } from "lucide-react";
import { editGroupAsync, fetchTasks } from "../redux/groupSlice";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { deleteTask } from "../redux/taskSlice";
import { FaEye, FaDownload, FaFileAlt, FaEdit, FaTrash } from "react-icons/fa";

function GroupDetails() {
  const { id } = useParams(); // Get group ID from URL
  const {
    formState: { errors },
    setError,
    clearErrors,
    trigger,
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const groups = useSelector((state) => state.groups.groups); // Get groups from Redux
  const user = useSelector((state) => state.user.user);
  const [group, setGroup] = useState(null);
  // const [task, setTask] = useState(""); // Task input state
  const [editMode, setEditMode] = useState(false);
  const [editedGroup, setEditedGroup] = useState({ name: "", description: "" });
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [add, setAdd] = useState(false);

  useEffect(() => {
    if (groups) {
      const selectedGroup = groups.find((g) => g._id === id);
      setGroup(selectedGroup);
      setEditedGroup({
        name: selectedGroup?.name,
        description: selectedGroup?.description,
      });
    }
  }, [groups, id]);
  useEffect(() => {
    dispatch(fetchTasks(user._id));
  }, [dispatch, user, id]);

  if (!group) {
    return <p className="text-center text-gray-500">Group not found...</p>;
  }
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
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
  // Handle task submission
  // const handleAddTask = () => {
  //   if (!task.trim()) return;
  //   console.log(`Task added: ${task}`);
  //   setTask(""); // Clear input
  // };

  // Handle group edit submission
  const EditTask = (task) => {
    navigate("./tasks", {
      state: {
        task: task,
        people: group.people,
        groupId: group._id,
        userId: user._id,
      },
    });
  };
  const handleSaveEdit = () => {
    if (!editedGroup.name.trim()) return;
    dispatch(editGroupAsync({ id, updatedGroup: editedGroup }))
      .unwrap()
      .then(() => {
        return dispatch(fetchTasks(user._id));
      })
      .catch((error) => {
        toast.error(error, {
          position: "top-center",
          autoClose: 2000,
          draggable: true,
        });
      })
      .finally(() => setEditMode(false));
  };
  const delTask = (id) => {
    dispatch(deleteTask({ id }))
      .unwrap()
      .then(() => {
        return dispatch(fetchTasks(user._id));
      })
      .catch((error) => {
        toast.error(error, {
          position: "top-center",
          autoClose: 2000,
          draggable: true,
        });
      });
  };
  // Handle adding people
  const handleAddPeople = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`https://work-grid.vercel.app/group/addPeople/${id}`, {
        people: tags,
      });
      // setGroup(response.data.group); // Update state with new people
      setTags([]); // Clear tags

      dispatch(fetchTasks(user._id));
      let res = groups.find((g) => g._id === id);
      setGroup(res);
      toast.success("Members added successfully", {
        position: "top-center",
        autoClose: 2000,
        draggable: true,
      });
    } catch (error) {
      console.error("Error adding people:", error);
      toast.error(error.response.data.message, {
        position: "top-center",
        autoClose: 2000,
        draggable: true,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-white to-purple-200">
      <ToastContainer />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Users
              className="w-10 h-10 text-indigo-600 mr-3"
              strokeWidth={1.5}
            />
            {!editMode ? (
              <h1 className="text-3xl font-bold text-gray-900">{group.name}</h1>
            ) : (
              <input
                type="text"
                value={editedGroup.name}
                onChange={(e) => setEditedGroup({ name: e.target.value })}
                className="text-3xl font-bold border-b-2 border-indigo-500 focus:outline-none"
              />
            )}
          </div>

          <button onClick={() => setEditMode(!editMode)}>
            <Edit className="w-6 h-6 text-gray-600 cursor-pointer" />
          </button>
        </div>

        {!editMode ? (
          <p className="text-gray-600">
            {group.description || "No description available."}
          </p>
        ) : (
          <textarea
            value={editedGroup.description}
            onChange={(e) =>
              setEditedGroup({ ...editedGroup, description: e.target.value })
            }
            className="w-full p-2 border rounded-md"
            rows="2"
          />
        )}

        {editMode && (
          <button
            onClick={handleSaveEdit}
            className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded-md"
          >
            Save Changes
          </button>
        )}

        {/* Members Section */}
        <div className="mt-6 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-2 flex justify-between items-center">
            Members{" "}
            {add ? (
              <Minus
                className="w-6 h-6 text-gray-600 cursor-pointer"
                onClick={() => setAdd(!add)}
              />
            ) : (
              <Plus
                className="w-6 h-6 text-gray-600 cursor-pointer"
                onClick={() => setAdd(!add)}
              />
            )}
          </h2>
          {group.people.map((person) => person.username).join(", ")}
        </div>

        {/* Add People Section */}
        {add && (
          <div className="mt-6 bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold mb-4">Add People</h2>
            <form onSubmit={handleAddPeople} className="flex">
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-blue-500 text-white px-3 py-1 rounded-full flex items-center justify-between text-sm cursor-pointer hover:bg-blue-600"
                      onClick={() => handleDeleteTag(tag)}
                    >
                      {tag} <X className="ml-1 w-5 h-5" />
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
              <button
                type="submit"
                className="ml-2 bg-blue-600 text-white px-3 py-2 rounded-md flex items-center"
              >
                <UserPlus className="w-5 h-5 mr-1" />
                Add
              </button>
            </form>
          </div>
        )}

        {/* Task Section */}
        <div className="bg-white p-6 rounded-xl shadow-md mt-6">
          <div className="flex justify-between items center">
            <div className="text-xl font-semibold text-center mb-4">Tasks</div>
            <div>
              <Plus
                className="cursor-pointer"
                onClick={() =>
                  navigate("./tasks", {
                    state: {
                      people: group.people,
                      groupId: group._id,
                      userId: user._id,
                    },
                  })
                }
              />
            </div>
          </div>
          <div className="space-y-4">
            {group.tasks.length === 0 && <p>No tasks found.</p>}
            {group.tasks.map((task) => (
              <div
                key={task._id}
                className="p-4 border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition duration-200"
              >
                <div className="text-lg font-medium text-gray-800">
                  <div className="flex items-center justify-between">
                    {task.title}
                    <div className="flex gap-2 items-center">
                      <FaEdit
                        className="cursor-pointer"
                        onClick={() => EditTask(task)}
                      />
                      <FaTrash
                        className="cursor-pointer text-red-500"
                        onClick={() => delTask(task._id)}
                      />
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  {task.description}
                </div>

                <div className="flex flex-wrap gap-2 text-sm">
                  <span
                    className={`px-2 py-1 rounded-sm font-medium ${
                      task.status === "Completed"
                        ? "bg-green-200 text-green-700"
                        : task.status === "Pending"
                        ? "bg-yellow-200 text-yellow-700"
                        : "bg-red-200 text-red-700"
                    }`}
                  >
                    {task.status}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-sm font-medium ${
                      task.priority === "High"
                        ? "bg-red-200 text-red-700"
                        : task.priority === "Medium"
                        ? "bg-yellow-200 text-yellow-700"
                        : "bg-green-200 text-green-700"
                    }`}
                  >
                    Priority: {task.priority}
                  </span>
                </div>

                <div className="text-sm text-gray-500 mt-2">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </div>

                <div className="mt-3 text-sm">
                  <strong>Assigned To:</strong>{" "}
                  <span className="text-gray-700">
                    {task.assignedTo
                      .map((person) => person.username)
                      .join(", ")}
                  </span>
                </div>

                <div className="text-sm text-gray-500">
                  <strong>Created By:</strong> {task.createdBy.username}
                </div>
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
                            <FaEye />{" "}
                            <span className="hidden sm:inline">View</span>
                          </a>
                          <a
                            href={file.downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            download={file.name || "download"}
                            onClick={(e) => {
                              if (
                                !file.downloadUrl.startsWith(
                                  window.location.origin
                                )
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupDetails;
