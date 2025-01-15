import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PlaylistContext from "../contexts/PlaylistContext";
//import { loadForEdit } from "../assets/js/utils";

export default function CreatePlaylist() {
  const api = useContext(PlaylistContext).api;
  const params = useParams();
  const navigate = useNavigate();
  const [songs, setSongs] = useState([]);
  const [addedSongs, setAddedSongs] = useState([""]);
  const [data, setData] = useState({
    name: "",
    description: "",
    songs: [],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    api.getAllSongs().then((songs) => {
      setSongs(songs);
      if (params.id) {
        api.getPlaylistById(params.id).then((playlist) => {
          const songsInPlaylist = playlist.songs.map((song) => getNameFromId(song.id, songs));
          setAddedSongs(songsInPlaylist);
          setData(playlist);
          //loadForEdit(playlist);
        });
      }
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!data.name || !data.description) return;
    if (params.id) {
      api.updatePlaylist(data);
    } else {
      api.addNewPlaylist(data);
    }
    navigate("/index");
  };

  const addItemSelect = (event) => {
    event.preventDefault();
    setAddedSongs([...addedSongs, ""]);
  };

  const removeItemSelect = (event, index) => {
    event.preventDefault();
    const newArr = [...addedSongs];
    newArr.splice(index, 1);
    setAddedSongs(newArr);
    const allSongs = newArr.map((song) => {
      const id = getIdFromName(song);
      if (id !== -1) return { id };
    });
    setData({ ...data, songs: allSongs });
  };

  const getIdFromName = (elementName) => {
    const element = songs.find((element) => element.name === elementName);
    const id = element ? element.id : -1;
    return id;
  };

  const getNameFromId = (elementId, songs) => {
    const song = songs.find((song) => song.id === elementId);
    const name = song ? song.name : "";
    return name;
  };

  const handleNameChange = (event) => {
    setData({ ...data, name: event.target.value });
  };

    const handleChangeInput = (event, index) => {
      const newSongChoises = addedSongs;
      newSongChoises[index] = event.target.value;
      setAddedSongs(newSongChoises);
      const allSongs = addedSongs
        .map((song) => {
          const id = getIdFromName(song);
          if (id !== -1) return { id };
        })
        .filter((x) => x !== undefined);
      setData({ ...data, songs: allSongs });
    };

  const handleDescriptionChange = (event) => {
    setData({ ...data, description: event.target.value });
  };

  const deletePlaylist = async (id) => {
    api.deletePlaylist(data.id);
    navigate("/index");
  };

  return (
    <main id="main-area" className="flex-row">
      <form className="form-group" id="playlist-form">
        <div id="general-info" className="flex-row">
          <fieldset className="form-control">
            <legend>Informations générales</legend>
            <div className="form-control flex-row">
              <label htmlFor="name"> Nom: </label>
              <input
                type="text"
                id="name"
                placeholder="Playlist#1"
                value={data.name}
                required
                onChange={handleNameChange}
              />
            </div>
            <div className="form-control flex-row">
              <label htmlFor="description">Description: </label>
              <input
                type="text"
                id="description"
                placeholder="Nouvelle playlist"
                value={data.description}
                required
                onChange={handleDescriptionChange}
              />
            </div>
          </fieldset>
        </div>
        <fieldset className="form-control">
          <legend>Chansons</legend>
          <datalist id="song-dataList">
            {songs.map((song) => (
              <option key={song.id} value={song.name} />
            ))}
          </datalist>
          <button id="add-song-btn" className="fa fa-plus" onClick={addItemSelect}></button>
          <div id="song-list">
            {addedSongs.map((x, index) => (
              <div key={index}>
                <label htmlFor={`song-${index + 1}`}>#{index + 1}</label>
                <input
                  className="song-input"
                  id={`song-${index + 1}`}
                  type="select"
                  list="song-dataList"
                  value={x}
                  onChange={(e) => handleChangeInput(e, index)}
                  required
                />
                {index ? <button className="fa fa-minus" onClick={(e) => removeItemSelect(e, index)}></button> : <></>}
              </div>
            ))}
          </div>
        </fieldset>
        {params.id ? (
          <input type="submit" value={"Modifier la playlist"} onClick={handleSubmit} id="playlist-submit" />
        ) : (
          <input type="submit" value={"Ajouter la playlist"} onClick={handleSubmit} id="playlist-submit" />
        )}
      </form>
      {params.id ? (
        <button
          className="fa fa-trash"
          id="playlist-delete"
          onClick={() => {
            deletePlaylist(params.id);
          }}
        ></button>
      ) : (
        <></>
      )}
    </main>
  );
}
