import "./Navbar.css";
import { NavLink } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faRefresh, faMagnifyingGlass, faHeart, faAddressBook, faPieChart } from '@fortawesome/free-solid-svg-icons'

const Navbar = () => {
  return (
    <nav>
      <NavLink title="Liked" className={({ isActive }) => (isActive ? 'active' : '')} to={"/"}>
        <FontAwesomeIcon className="icon" icon={faHeart} size="sm" />
      </NavLink>
      <NavLink title="Playlists" className={({ isActive }) => (isActive ? 'active' : '')} to={"/playlists"}>
        <FontAwesomeIcon className="icon" icon={faAddressBook} size="sm" />
      </NavLink>
      <NavLink title="Search" className={({ isActive }) => (isActive ? 'active' : '')} to={"/search"}>
        <FontAwesomeIcon className="icon" icon={faMagnifyingGlass} size="sm" />
      </NavLink>
      <div className="options">
        <span id="refresh" title="Refresh" onClick={() => window.location.reload()}>
          <FontAwesomeIcon icon={faRefresh} size="sm" />
        </span>
        <NavLink id="settings" title="Settings" className={({ isActive }) => (isActive ? 'active' : '')} to={"/settings"}>
          <FontAwesomeIcon icon={faCog} size="sm" />
        </NavLink>
        <NavLink id="settings" title="Top Items" className={({ isActive }) => (isActive ? 'active' : '')} to={"/chart"}>
          <FontAwesomeIcon icon={faPieChart} size="sm" />
        </NavLink>
      </div>
    </nav>
  )
}

export default Navbar;
