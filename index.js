

lucide.createIcons();
document.getElementById('copyright').innerHTML = `&copy; ${new Date().getFullYear()} programs.lol. All rights reserved.`;


const LANYARD_ID = '933788835052126258';
const spotifyContainer = document.getElementById('spotify-content');
let currentSpotifyData = null;

async function fetchLanyard() {
    try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${LANYARD_ID}`);
        const json = await res.json();

        if (json.data && json.data.listening_to_spotify && json.data.spotify) {
            currentSpotifyData = json.data.spotify;
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
    spotifyContainer.innerHTML = `
                <div class="flex items-center gap-4">
                    <div class="w-20 h-20 bg-neutral-800 rounded-md flex items-center justify-center text-3xl">
                        null
                    </div>
                    <div>
                        <p class="font-bold text-white">Not playing anything</p>
                        <p class="text-sm text-neutral-400">Spotify is currently silent.</p>
                    </div>
                </div>
            `;
}

function updateSpotifyDOM() {
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
              <div class="flex gap-4 mb-4">
                <img 
                    src="${album_art_url}" 
                    alt="Album Art" 
                    class="w-20 h-20 rounded-md object-cover shadow-lg border border-neutral-800"
                />
                <div class="flex flex-col justify-center min-w-0 flex-1">
                    <p class="text-xs font-bold text-[#1DB954] mb-1 uppercase tracking-wider">Listening to Spotify</p>
                    <p id="spotify-song-title" class="font-bold text-white truncate text-lg leading-tight" title="${song}">${song}</p>
                    <p class="text-sm text-neutral-400 truncate" title="${artist}">by ${artist}</p>
                </div>
              </div>
              <div class="w-full space-y-1.5">
                 <div class="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                        id="spotify-progress-bar"
                        class="h-full bg-white rounded-full transition-all duration-1000 linear"
                        style="width: ${progress}%"
                    ></div>
                 </div>
                 <div class="flex justify-between text-xs text-neutral-500 font-mono">
                    <span id="spotify-curr-time">${formatTime(Math.max(0, current))}</span>
                    <span id="spotify-tot-time">${formatTime(total)}</span>
                 </div>
              </div>
            `;
}


fetchLanyard();
setInterval(fetchLanyard, 10000); 


setInterval(() => {
    if (currentSpotifyData) updateSpotifyDOM();
}, 1000);

