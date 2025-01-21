import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function NavBar() {
  const location = useLocation();

  return (
    <header>
      <nav id="nav-bar" className="flex-column">
        <ul className="flex-column">
          <li>
            <Link
              to="/index"
              className={location.pathname === "/index" ? "active-page" : ""}
            >
              <i className="fa fa-music"></i>
              <span>Ma Bibliothèque</span>
            </Link>
          </li>

          <li>
            <Link
              to="/create_playlist"
              className={
                location.pathname === "/create_playlist" ? "active-page" : ""
              }
            >
              <i className="fa fa-plus"></i>
              <span>Créer Playlist</span>
            </Link>
          </li>

          <li>
            <Link
              to="/voting"
              className={location.pathname === "/voting" ? "active-page" : ""}
            >
              <i className="fa fa-check-circle"></i>
              <span>Vote for Songs</span>
            </Link>
          </li>

          <li>
            <Link
              to="/about"
              className={location.pathname === "/about" ? "active-page" : ""}
            >
              <i className="fa fa-info-circle"></i>
              <span>À Propos</span>
            </Link>
          </li>

          <li>
            <Link
              to="/faq"
              className={location.pathname === "/faq" ? "active-page" : ""}
            >
              <i className="fa fa-question-circle"></i>
              <span>FAQ</span>
            </Link>
          </li>

          {/* New Link for submitting songs */}
          <li>
            <Link
              to="/submit"
              className={location.pathname === "/submit" ? "active-page" : ""}
            >
              <i className="fa fa-microphone"></i>
              <span>Submit Song</span>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
