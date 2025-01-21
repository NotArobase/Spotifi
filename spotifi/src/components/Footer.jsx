import React from "react";
import { useLocation } from "react-router-dom";
import Player from "./Player";

export default function Footer() {
  function loadPlayer(pathname) {
    return <Player />;
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
