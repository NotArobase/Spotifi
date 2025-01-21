import React from "react";
import { NavLink } from "react-router-dom";

export default function Playlist({ playlist }) {
  return (
    <NavLink className="playlist-item flex-column" to={`/playlist/${playlist._id}`}>
      <div className="playlist-preview">
        <i className="fa fa-2x fa-play-circle hidden playlist-play-icon"></i>
      </div>
      {/* Affichage des informations de la playlist */}
      <p>{playlist.name}</p>
      <p>{playlist.description}</p>
    </NavLink>
  );
}
