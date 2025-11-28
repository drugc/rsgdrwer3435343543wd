const audio = document.getElementById('backgroundMusic');
const playPauseBtn = document.getElementById('playPauseBtn');
const mainPlayBtn = document.getElementById('mainPlayBtn');
const progressFill = document.getElementById('progressFill');
const progressHandle = document.getElementById('progressHandle');
const progressBar = document.querySelector('.progress-bar');
const timeCurrent = document.getElementById('timeCurrent');
const timeTotal = document.getElementById('timeTotal');
const volumeSlider = document.getElementById('volumeSlider');
const trackName = document.getElementById('trackName');
const artistName = document.getElementById('artistName');

let isMusicPlaying = false;

if (audio) {
  audio.volume = 0.5;

  trackName.textContent = 'Pain 1993';
  artistName.textContent = 'Drake, Playboi Carti';

  const updateProgress = () => {
    if (audio.duration) {
      const progress = (audio.currentTime / audio.duration) * 100;
      progressFill.style.width = progress + '%';
      progressHandle.style.left = progress + '%';
      
      timeCurrent.textContent = formatTime(audio.currentTime);
      timeTotal.textContent = formatTime(audio.duration);
    }
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    if (isMusicPlaying) {
      audio.pause();
      updatePlayButtons(false);
      isMusicPlaying = false;
    } else {
      audio.play().catch(error => {
        console.log('Audio play failed:', error);
      });
      updatePlayButtons(true);
      isMusicPlaying = true;
    }
  };

  const updatePlayButtons = (playing) => {
    if (playing) {
      playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
      mainPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
      mainPlayBtn.classList.add('playing');
    } else {
      playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
      mainPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
      mainPlayBtn.classList.remove('playing');
    }
  };

  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePlay();
    });
  }

  if (mainPlayBtn) {
    mainPlayBtn.addEventListener('click', togglePlay);
  }

  audio.addEventListener('timeupdate', updateProgress);
  audio.addEventListener('loadedmetadata', () => {
    timeTotal.textContent = formatTime(audio.duration);
  });

  audio.addEventListener('play', () => {
    updatePlayButtons(true);
    isMusicPlaying = true;
  });

  audio.addEventListener('pause', () => {
    updatePlayButtons(false);
    isMusicPlaying = false;
  });

  audio.addEventListener('error', (e) => {
    console.error('Audio error:', e);
  });

  if (progressBar) {
    progressBar.addEventListener('click', (e) => {
      const rect = progressBar.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      audio.currentTime = pos * audio.duration;
    });
  }

  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      audio.volume = e.target.value / 100;
    });
  }
}
