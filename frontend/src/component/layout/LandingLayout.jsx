import {Outlet} from "react-router-dom"

const LandingLayout = () => {
  return (
    <main>
      <div className="landing-wrapper">
        <div className="landing-overlay">
          <Outlet />
        </div>
      </div>
    </main>
  )
}

export default LandingLayout