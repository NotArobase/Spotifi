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
  LOOP: "TOGGLE_LOOP",
};

const httpManager = new HTTPManager();

export default function reducer(state, action) {
  async function playSong(index) {
    if (index === -1) {
      state.audio.paused ? state.audio.play() : state.audio.pause();
      return state.currentSongIndex;
    }

    const song = state.songs[index];
    if (!song) {
      console.error("Song not found in the list");
      return state.currentSongIndex;
    }

    console.log("Song details:", song); // Log the song to check the file structure

    if (song.isLocal) {
      // Assuming song.src contains the relative path or the file object
      const file = song.file || song.src; // Get the file object from metadata

      // Check if the file is an instance of File or Blob
      if (file instanceof File || file instanceof Blob) {
        console.log("Playing local song:", file);
        state.audio.src = URL.createObjectURL(file); // Use the file object for local songs
      } else {
        console.error("song.file is not a valid File or Blob:", file);
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
    const isMuted = state.audio.volume === 0;
    state.audio.volume = isMuted ? 1 : 0;
    return !isMuted;
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
      state.audio.currentTime = time;
      return { ...state };
    case ACTIONS.SCRUB:
      scrubTime(action.payload.delta);
      return { ...state };
    case ACTIONS.MUTE:
      return { ...state, mute: muteToggle() };
    case ACTIONS.SHUFFLE:
      return { ...state, shuffle: !state.shuffle };
    case ACTIONS.TOGGLE_LOOP:
      const nextLoopMode =
        state.loopMode === "none"
          ? "single"
          : state.loopMode === "single"
          ? "playlist"
          : "none";
        return { ...state, loopMode: nextLoopMode };
    default:
      return state;
  }
}
