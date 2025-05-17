import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchTasks } from "../redux/groupSlice";
import { Users, UserPlus, UserCircle, Search } from "lucide-react";

function Groups() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const { groups, status, error } = useSelector((state) => state.groups);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [filteredGroups, setFilteredGroups] = useState([]); // State for filtered groups

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchTasks(user._id));
    }
  }, [user, dispatch]);

  // Filter groups based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredGroups(groups);
    } else {
      const filtered = groups.filter((group) =>
        group.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredGroups(filtered);
    }
  }, [searchTerm, groups]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-white to-violet-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center mb-12">
          <Users className="w-12 h-12 text-blue-600 mr-4" strokeWidth={1.5} />
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Groups
          </h1>
        </div>

        {/* Search bar outside the group border */}
        <div className="flex items-center justify-center mb-8">
          <div className="relative bg-blue-200 w-full max-w-md">
            <input
              type="text"
              placeholder="Search groups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-400"
            />
            <Search className="absolute right-3 top-2.5 text-gray-500" />
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200 p-8">
          {status === "loading" ? (
            <p className="text-center text-gray-500">Loading groups...</p>
          ) : status === "failed" ? (
            <p className="text-center text-red-500">Error: {error}</p>
          ) : filteredGroups.length ? (
            <div className="flex flex-col gap-6">
              <Link
                to="/creategroup"
                className="ml-auto w-fit bg-purple-600 rounded-lg px-5 py-3 text-sm font-semibold text-white hover:bg-purple-700 shadow-md hover:shadow-lg transition-all duration-300"
              >
                Create Group
              </Link>
              {filteredGroups.map((group) => (
                <div
                  key={group._id}
                  className="group bg-white w-full rounded-sm shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 hover:border-blue-400"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                        <UserCircle
                          className="w-8 h-8 text-blue-600"
                          strokeWidth={1.5}
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {group.name}
                      </h3>
                      <p className="text-sm text-gray-500">Active Group</p>
                      <div className="mt-4 flex items-center space-x-2 text-sm text-gray-400">
                        <Users className="w-4 h-4" />
                        <span>{group.people.length} members</span>
                      </div>
                    </div>
                    <Link
                      to={"/group/" + group._id}
                      className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-full px-4 py-2 text-sm font-semibold text-blue-600 border border-blue-300 hover:bg-blue-200 hover:text-blue-800 transition-all"
                    >
                      Open
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center bg-blue-100 justify-center py-20 px-4 text-center rounded-xl shadow-lg">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full animate-pulse"></div>
                <Users
                  className="relative w-20 h-20 text-purple-600"
                  strokeWidth={1.5}
                />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                No Groups Found
              </h2>
              <p className="text-gray-600 mb-12 max-w-md">
                Try adjusting your search or create a new group to get started.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md">
                <Link
                  to="/creategroup"
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <UserPlus className="w-5 h-5" />
                  Create a Group
                </Link>
                <div className="text-gray-400 sm:px-4">or</div>
                <button className="w-full sm:w-auto px-8 py-4 bg-white text-blue-600 font-medium rounded-xl border-2 border-blue-300 hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg">
                  <Users className="w-5 h-5" />
                  Join a Group
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Groups;
