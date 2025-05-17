import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import Home from './components/Home'
import RootLayout from './RootLayout'
import Register from './components/Register'
import Login from './components/Login'
import DashBoard from './components/DashBoard'
import UserProfile from './components/UserProfile'
import Groups from './components/Groups'
import NotFound from './components/NotFound'
import AddTask from './components/AddTask'
import Tasks from './components/Tasks'
import './App.css'
import CreateGroup from './components/CreateGroup'
import GroupDetails from './components/GroupDetails'
import AddGroupTask from './components/AddGroupTask'
function App() {
  const browser = createBrowserRouter([
    {
      path: '',
      element: <RootLayout />,
      children: [
        {
          path: '',
          element: <Home />
        },
        {
          path: 'register',
          element: <Register />
        },
        {
          path: 'login',
          element: <Login />
        },
        {
          path: 'dashboard',
          element: <DashBoard />,
          children: [
            {
              path: 'add',
              element: <AddTask />
            },
            {
              path: 'tasks',
              element: <Tasks />
            },
            {
              path: '',
              element: <Navigate to={'tasks'} />
            }
          ]
        },
        {
          path: 'profile',
          element: <UserProfile />
        },
        {
          path: 'groups',
          element: <Groups />
        },
        {
          path: 'group/:id',
          element: <GroupDetails />
        },
        {
          path: 'group/:id/tasks',
          element: <AddGroupTask />
        },
        {
          path: 'creategroup',
          element: <CreateGroup />
        },
        {
          path: '*',
          element: <NotFound />
        }
      ]
    }
  ])
  return (
    <RouterProvider router={browser} />
  )
}

export default App
