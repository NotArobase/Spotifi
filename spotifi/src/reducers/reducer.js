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
  // Fonction pour récupérer le fichier local à partir du dossier sélectionné
  async function loadLocalSong(folder, filename) {
    // Vérifier si le dossier est déjà chargé
    if (state.loadedFolderPath === folder) {
      // Si le dossier est déjà ouvert, rechercher le fichier
      return findFileInFolder(folder, filename);
    }

    try {
      const folderHandle = await window.showDirectoryPicker();
      const files = [];

      // Mémoriser le chemin du dossier chargé
      state.loadedFolderPath = folderHandle.name;

      // Parcourir le dossier pour retrouver le fichier
      for await (const entry of folderHandle.values()) {
        if (entry.kind === "file" && entry.name === filename) {
          const file = await entry.getFile();
          files.push(file);
          return file;
        }
      }

      console.error("Fichier introuvable dans le dossier.");
      return null;
    } catch (err) {
      console.error("Erreur lors de l'accès au dossier:", err);
      return null;
    }
  }

  // Fonction pour rechercher un fichier dans un dossier déjà ouvert
  async function findFileInFolder(folder, filename) {
    try {
      // Rechercher le fichier dans le dossier
      const folderHandle = await window.showDirectoryPicker();
      for await (const entry of folderHandle.values()) {
        if (entry.kind === "file" && entry.name === filename) {
          const file = await entry.getFile();
          return file;
        }
      }

      console.error("Fichier introuvable dans le dossier.");
      return null;
    } catch (err) {
      console.error("Erreur lors de la recherche du fichier:", err);
      return null;
    }
  }

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

    console.log("Song details:", song);

    if (song.isLocal) {
      // Extraire le dossier et le nom du fichier
      const [folder, filename] = song.src.split("/");

      // Lorsque le fichier est local, demandez à l'utilisateur d'accéder au dossier pour retrouver le fichier
      const file = await loadLocalSong(folder, filename);

      if (file) {
        console.log("Playing local song:", file);
        state.audio.src = URL.createObjectURL(file);
        state.audio.play();
      } else {
        console.error("Fichier local introuvable.");
      }
    } else {
      // Pour les chansons distantes
      state.audio.load();
      const url = await httpManager.getSongURLFromId(song.src);
      state.audio.src = url;
      state.audio.play();
    }

    return index;
  }

  // Fonction pour charger les chansons
  async function loadSongs(id) {
    const url = await httpManager.getSongURLFromId(id);
    state.audio.src = url;

    // Mettre à jour les chansons dans l'état
    return { ...state, songs: state.songs }; // vous pouvez adapter cela selon la structure de votre application
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
      loadSongs(action.payload.songs[0].src);
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
