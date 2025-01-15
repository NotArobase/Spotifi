class MusicPlayer {
    constructor(audioElement, playlist) {
      this.audio = audioElement;
      this.playlist = playlist;
      for (i=0; i<playlist["songs"].length;i++){
        if (playlist["songs"][i] === audioElement["id"]){
            this.currentIndex = i; // Index du morceau en cours
        }
      }
      this.loopMode = "none"; // Modes : "none", "single", "playlist"
  
      // Écoute l'événement de fin de son
      this.audio.addEventListener("ended", () => this.handleEnd());
    }
  
    play(index = this.currentIndex) {
      this.currentIndex = index;
      this.audio.src = this.playlist[this.currentIndex];
      this.audio.play();
    }
  
    handleEnd() {
      if (this.loopMode === "single") {
        // Répéter le même morceau
        this.audio.currentTime = 0;
        this.audio.play();
      } else if (this.loopMode === "playlist") {
        // Passer au morceau suivant ou revenir au début
        this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
        this.play();
      }
    }
  
    toggleLoop(mode) {
      // Modes : "none", "single", "playlist"
      this.loopMode = mode;
      console.log(`Loop mode set to: ${this.loopMode}`);
    }
  }

  