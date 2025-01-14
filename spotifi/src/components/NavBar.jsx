import { Link, useLocation } from "react-router-dom";

import React from "react";

export default function NavBar() {
  const location = useLocation();

  return (
    <header>
      <nav id="nav-bar" className="flex-column">
        <ul className="flex-column">
          <li>
            {/*TODO : ajouter le lien de navigation vers la page /index */}
            <Link to="/index" className={location.pathname === "/index" ? "active-page" : ""}>
              <i className="fa fa-music"></i>
              <span>Ma Bibliothèque</span>
            </Link>
          </li>
          <li>
            {/*TODO : ajouter le lien de navigation vers la page /create_playlist */}
            <Link to="/create_playlist" className={location.pathname === "/create_playlist" ? "active-page" : ""}>
              <i className="fa fa-plus"></i>
              <span>Créer Playlist</span>
            </Link>
          </li>
          <li>
            {/*TODO : ajouter le lien de navigation vers la page /create_playlist */}
            <Link to="/about" className={location.pathname === "/about" ? "active-page" : ""}>
              <i className="fa fa-info-circle"></i>
              <span>À Propos</span>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
