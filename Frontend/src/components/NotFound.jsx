import { useLocation } from "react-router-dom"
function NotFound() {
  let location = useLocation()
  return (
    <div>
      <div className="text-center text-9xl py-10">404</div>
      <div className="text-center text-2xl pb-5">{location.pathname}</div>
      <div className="text-center text-6xl">Not Found</div>
    </div>
  )
}

export default NotFound