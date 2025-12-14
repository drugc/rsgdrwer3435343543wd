document.addEventListener('DOMContentLoaded', function() {
  initializeAnimations();
  initializeScrollEffects();
  initializeSpotify();
});

function initializeAnimations() {
  const sections = document.querySelectorAll('.section-row');

  sections.forEach((section, index) => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';

    setTimeout(() => {
      section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      section.style.opacity = '1';
      section.style.transform = 'translateY(0)';
    }, index * 200);
  });

  const heading = document.querySelector('h1');
  if (heading) {
    heading.style.opacity = '0';
    heading.style.transform = 'translateY(-10px)';

    setTimeout(() => {
      heading.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      heading.style.opacity = '1';
      heading.style.transform = 'translateY(0)';
    }, 100);
  }
}

function initializeScrollEffects() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;

        if (element.tagName === 'IMG') {
          element.style.opacity = '0';
          element.style.transform = 'scale(0.95)';

          setTimeout(() => {
            element.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
          }, 100);
        }

        observer.unobserve(element);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('img').forEach(img => {
    observer.observe(img);
  });

  const textElements = document.querySelectorAll('.text-content h2, .text-content p');
  textElements.forEach(el => {
    observer.observe(el);
  });
}

window.addEventListener('resize', () => {
  const footer = document.querySelector('.footer');
  if (footer) {
    footer.style.transition = 'all 0.3s ease';
  }
});



const copyrightEl = document.getElementById('copyright');
if (copyrightEl) {
  copyrightEl.innerHTML = `&copy; ${new Date().getFullYear()} programs.lol. All rights reserved.`;
}

const LANYARD_ID = '933788835052126258';
let spotifyContainer = null;
let currentSpotifyData = null;

function initializeSpotify() {
    spotifyContainer = document.getElementById('spotify-content');
    if (!spotifyContainer) {
        console.error('Spotify container not found');
        return;
    }
    fetchLanyard();
    setInterval(fetchLanyard, 10000);
    setInterval(() => {
        if (currentSpotifyData) updateSpotifyDOM();
    }, 1000);
}

async function fetchLanyard() {
    try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${LANYARD_ID}`);
        const json = await res.json();

        if (json.data && json.data.listening_to_spotify && json.data.spotify) {
            currentSpotifyData = json.data.spotify;
            console.log('Spotify data updated:', currentSpotifyData);
        } else {
            currentSpotifyData = null;
        }
        updateSpotifyDOM();
    } catch (e) {
        console.error("Lanyard Fetch Error", e);
        if (!currentSpotifyData) renderIdle();
    }
}

function renderIdle() {
    if (!spotifyContainer) return;
    spotifyContainer.innerHTML = `
        <div style="display: flex; align-items: center; gap: 1rem;">
            <div style="width: 5rem; height: 5rem; background-color: #262626; border-radius: 0.375rem; display: flex; align-items: center; justify-content: center; font-size: 1.875rem;">
                ♪
            </div>
            <div>
                <p style="font-weight: bold; color: white; margin: 0;">Not playing anything</p>
                <p style="font-size: 0.875rem; color: #a3a3a3; margin: 0.5rem 0 0 0;">Spotify is currently silent.</p>
            </div>
        </div>
    `;
}

function updateSpotifyDOM() {
    if (!spotifyContainer) return;
    
    if (!currentSpotifyData) {
        renderIdle();
        return;
    }

    const { song, artist, album_art_url, timestamps } = currentSpotifyData;
    const now = Date.now();
    const start = timestamps.start;
    const end = timestamps.end;
    const total = end - start;
    const current = now - start;
    const progress = Math.min(100, Math.max(0, (current / total) * 100));

    const formatTime = (ms) => {
        const totalSeconds = Math.floor(ms / 1000);
        const m = Math.floor(totalSeconds / 60);
        const s = totalSeconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const existingTitle = document.getElementById('spotify-song-title');
    if (existingTitle && existingTitle.innerText === song) {
        const progressBar = document.getElementById('spotify-progress-bar');
        const currTimeEl = document.getElementById('spotify-curr-time');
        const totTimeEl = document.getElementById('spotify-tot-time');

        if (progressBar) progressBar.style.width = `${progress}%`;
        if (currTimeEl) currTimeEl.innerText = formatTime(Math.max(0, current));
        if (totTimeEl) totTimeEl.innerText = formatTime(total);
        return;
    }

    spotifyContainer.innerHTML = `
        <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
            <img 
                src="${album_art_url}" 
                alt="Album Art" 
                style="width: 5rem; height: 5rem; border-radius: 0.375rem; object-fit: cover; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); border: 1px solid #262626; flex-shrink: 0;"
            />
            <div style="display: flex; flex-direction: column; justify-content: center; flex: 1; min-width: 0;">
                <p style="font-size: 0.75rem; font-weight: bold; color: #1DB954; margin: 0 0 0.25rem 0; text-transform: uppercase; letter-spacing: 0.05em;">Listening to Spotify</p>
                <p id="spotify-song-title" style="font-weight: bold; color: white; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 1.125rem; line-height: 1.25; margin: 0;" title="${song}">${song}</p>
                <p style="font-size: 0.875rem; color: #a3a3a3; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin: 0.25rem 0 0 0;" title="${artist}">by ${artist}</p>
            </div>
        </div>
        <div style="width: 100%;">
            <div style="width: 100%; background-color: #262626; height: 0.375rem; border-radius: 9999px; overflow: hidden;">
                <div 
                    id="spotify-progress-bar"
                    style="height: 100%; background-color: white; border-radius: 9999px; transition: width 1000ms linear; width: ${progress}%"
                ></div>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: #737373; font-family: monospace; margin-top: 0.375rem;">
                <span id="spotify-curr-time">${formatTime(Math.max(0, current))}</span>
                <span id="spotify-tot-time">${formatTime(total)}</span>
            </div>
        </div>
    `;
}

