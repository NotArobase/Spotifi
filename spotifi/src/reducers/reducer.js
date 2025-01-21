import HTTPManager from "../assets/js/http_manager";
import { random, modulo } from "../assets/js/utils";

export const ACTIONS = {
  LOAD: "load",
  PLAY: "play",
  STOP: "stop",
  NEXT: "next",
  PREVIOUS: "previous",
  SEEK: "seek",
  SCRUB: "scrub",
  SHUFFLE: "shuffle",
  MUTE: "mute",
  LOOP: "loop",
};

const httpManager = new HTTPManager();

export default function reducer(state, action) {
  async function playSong(index) {
    if (index === -1) {
      if (state.audio.paused) {
        await state.audio.play().catch(error => console.error("Play interrupted:", error));
      } else { state.audio.pause(); }
      return state.currentSongIndex;
    }

    
    const song = state.songs[index];
    if (!song) {
      console.error("Song not found in the list");
      return state.currentSongIndex;
    }

    console.log("Song details:", song); // Log the song to check the file structure

    if (song.isLocal) {
      try {
        // Request the user to select a folder if it's a local song
        const folderHandle = await window.showDirectoryPicker();
        console.log(song.src);
        const fileHandle = await folderHandle.getFileHandle(song.src);

        // Get the file object from the selected file
        const file = await fileHandle.getFile();
        console.log("Playing local song:", file);

        // Use the file object for local songs
        state.audio.src = URL.createObjectURL(file);
      } catch (error) {
        console.error("Error accessing local file:", error);
      }
    } else {
      // For remote songs, fetch the URL using your HTTPManager
      state.audio.load();
      const url = await httpManager.getSongURLFromId(song.src);
      state.audio.src = url;
    }

    state.audio.play();
    return index;
  }

  async function loadSongs(id) {
    const url = await httpManager.getSongURLFromId(id);
    state.audio.src = url;
  }

  function getNextIndex() {
    return state.shuffle ? random(0, state.songs.length) : modulo(state.currentSongIndex + 1, state.songs.length);
  }

  function getPreviousIndex() {
    return state.shuffle ? random(0, state.songs.length) : modulo(state.currentSongIndex - 1, state.songs.length);
  }

  function scrubTime(delta) {
    const newTime = state.audio.currentTime + delta;
    state.audio.currentTime = newTime;
  }

  function muteToggle() {
    const isLoop = state.loop === "loop";
    state.loop = isLoop ? 1 : 0;
    return !isLoop;
  }

  switch (action.type) {
    case ACTIONS.LOAD:
      // préchargement de la 1re chanson de la liste
      loadSongs(action.payload.songs[0].id);
      return {
        ...state,
        songs: [...action.payload.songs],
      };
    case ACTIONS.PLAY:
      const newIndex = action.payload.index === -1 ? state.currentSongIndex : action.payload.index;
      playSong(action.payload.index);
      return {
        ...state,
        currentSongIndex: newIndex,
        currentSong: state.songs[newIndex].name,
      };
    case ACTIONS.STOP:
      state.audio.pause();
      return state;
    case ACTIONS.NEXT:
      const nextIndex = getNextIndex();
      playSong(nextIndex);
      return { ...state, currentSongIndex: nextIndex, currentSong: state.songs[nextIndex].name };
    case ACTIONS.PREVIOUS:
      const previousIndex = getPreviousIndex();
      playSong(previousIndex);
      return { ...state, currentSongIndex: previousIndex, currentSong: state.songs[previousIndex].name };
    case ACTIONS.SEEK:
      const time = (action.payload.time * state.audio.duration) / 100;
      if (isFinite(time)) {
        state.audio.currentTime = time; }
      return { ...state };
    case ACTIONS.SCRUB:
      scrubTime(action.payload.delta);
      return { ...state };
    case ACTIONS.MUTE:
      return { ...state, mute: muteToggle() };
    case ACTIONS.SHUFFLE:
      return { ...state, shuffle: !state.shuffle };
    case ACTIONS.LOOP:
      return { ...state, loopMode: action.payload }; // Modes : "none", "single", "playlist"
    default:
      return state;
  }
}
