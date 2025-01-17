import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import Player from "./Player";

export default function Footer() {
  function loadPlayer(pathname) {
    if (pathname.startsWith("/playlist")) {
      return <Player />;
    } else {
      return (
        <div>
          <p>
            Choisir une playlist à travers la
            <NavLink
              to="/index"
              className="text-blue-500 hover:text-blue-700 underline transition-colors duration-200"
            >
              {" "}
              Bibliothèque
            </NavLink>{" "}
            pour la faire jouer
          </p>
        </div>
      );
    }
  }

  return (
    <footer id="playing-bar" className="p-4 bg-gray-800 text-white">
      {loadPlayer(useLocation().pathname)}
      <div id="creators" className="text-center mt-4">
        <p></p>
        <p></p>
      </div>
    </footer>
  );
}
