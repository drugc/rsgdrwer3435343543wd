const USER_ID = "933788835052126258";
const POLLING_INTERVAL = 15000;

// Fetch data from Lanyard API
async function fetchLanyardStatus(userId) {
    try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
        if (!response.ok) {
            throw new Error(`Error fetching status: ${response.statusText}`);
        }
        const json = await response.json();
        if (json.success) {
            return json.data;
        }
        return null;
    } catch (error) {
        console.error("Failed to fetch Lanyard data", error);
        return null;
    }
}

// Get status color
function getStatusColor(status) {
    switch (status) {
        case 'online': return 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]';
        case 'idle': return 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]';
        case 'dnd': return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]';
        default: return 'bg-gray-500';
    }
}

// Format time
function formatTime(ms) {
    if (!ms || ms < 0) return "0:00";
    const seconds = Math.floor(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Tech stack data
const techStack = [
    { name: 'HTML5', color: '#E34F26' },
    { name: 'CSS3', color: '#1572B6' },
    { name: 'JavaScript', color: '#F7DF1E' },
    { name: 'React', color: '#61DAFB' },
    { name: 'Git', color: '#F05032' },
    { name: 'VS Code', color: '#007ACC' },
];

// Render tech stack
function renderTechStack() {
    const container = document.getElementById('tech-stack');
    container.innerHTML = techStack.map(tech => `
        <div class="tech-card">
            <span class="font-medium" style="color: ${tech.color}">${tech.name}</span>
        </div>
    `).join('');
}

// Render Spotify Card
function renderSpotifyCard(activity) {
    if (!activity) return;
    
    const albumArt = activity.assets?.large_image 
        ? `https://i.scdn.co/image/${activity.assets.large_image.replace("spotify:", "")}` 
        : "https://picsum.photos/300/300";

    const container = document.getElementById('spotify-container');
    container.innerHTML = `
        <div class="p-4 bg-gradient-to-br from-[#1db954] to-[#1aa34a] rounded-lg shadow-lg w-full text-white transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/30 group">
            <div class="flex items-center gap-3">
                <!-- Album Art -->
                <div class="w-16 h-16 flex-shrink-0 rounded overflow-hidden shadow-md bg-black/20 flex items-center justify-center">
                    <img src="${albumArt}" alt="Album Art" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                </div>
                
                <!-- Content -->
                <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-1.5 mb-1">
                        <svg class="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.6-1.56.3z"/></svg>
                        <span class="text-[10px] font-bold uppercase tracking-wide">Now Playing</span>
                    </div>
                    <h3 class="font-bold text-sm sm:text-base truncate leading-tight">${activity.details || "Unknown Song"}</h3>
                    <p class="text-xs sm:text-sm opacity-90 truncate">${activity.state || "Unknown Artist"}</p>
                </div>

                <!-- Music Bars -->
                <div class="flex items-end gap-0.5 h-8 flex-shrink-0">
                    <div class="w-1 bg-white rounded-full animate-music-bar-1" style="height: 6px;"></div>
                    <div class="w-1 bg-white rounded-full animate-music-bar-2" style="height: 12px;"></div>
                    <div class="w-1 bg-white rounded-full animate-music-bar-3" style="height: 8px;"></div>
                </div>
            </div>

            <!-- Progress Bar -->
            <div class="mt-3">
                <div class="h-0.5 bg-black/30 rounded-full overflow-hidden w-full">
                    <div id="spotify-progress" class="h-full bg-white rounded-full transition-all duration-100 ease-linear" style="width: 0%"></div>
                </div>
                <div class="flex justify-between text-[9px] font-mono mt-1 opacity-80">
                    <span id="current-time">0:00</span>
                    <span id="duration-time">0:00</span>
                </div>
            </div>
        </div>
    `;

    // Animate Spotify progress
    animateSpotifyProgress(activity);
}

// Animate Spotify progress bar
function animateSpotifyProgress(activity) {
    const timestamps = activity.timestamps;
    
    if (!timestamps || !timestamps.start || !timestamps.end) return;

    const start = timestamps.start;
    const end = timestamps.end;
    const totalDuration = end - start;

    document.getElementById('duration-time').textContent = formatTime(totalDuration);

    const animate = () => {
        const now = Date.now();
        const elapsed = now - start;
        const percent = Math.min((elapsed / totalDuration) * 100, 100);

        const progressBar = document.getElementById('spotify-progress');
        if (progressBar) {
            progressBar.style.width = `${percent}%`;
        }
        document.getElementById('current-time').textContent = formatTime(elapsed);

        if (elapsed < totalDuration) {
            requestAnimationFrame(animate);
        }
    };

    requestAnimationFrame(animate);
}

// Render Activity Item
function renderActivityItem(activity) {
    let iconUrl = null;
    if (activity.assets?.large_image) {
        if (activity.assets.large_image.startsWith("mp:external")) {
            iconUrl = `https://media.discordapp.net/${activity.assets.large_image.replace("mp:", "")}`;
        } else {
            iconUrl = `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.png`;
        }
    }

    const activityType = {
        0: "Playing",
        1: "Streaming",
        3: "Watching"
    }[activity.type] || "Active";

    const div = document.createElement('div');
    div.className = 'bg-card p-4 rounded-xl border border-white/5 flex items-center gap-4 transition-all hover:border-white/20 hover:bg-white/5';
    div.innerHTML = `
        ${iconUrl ? `<img src="${iconUrl} " alt="${activity.name}" class="w-12 h-12 rounded-lg object-cover bg-black/30">` : `<div class="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-xs font-bold text-gray-500">APP</div>`}
        <div class="flex-1 min-w-0">
            <h4 class="font-bold text-white truncate text-sm">${activity.name}</h4>
            <div class="text-xs text-gray-400 space-y-0.5">
                ${activity.details ? `<p class="truncate">${activity.details}</p>` : ''}
                ${activity.state ? `<p class="truncate">${activity.state}</p>` : ''}
            </div>
        </div>
        <div class="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded">
            ${activityType}
        </div>
    `;
    return div;
}

// Render activities
function renderActivities(activities) {
    const container = document.getElementById('activities-container');
    
    if (activities.length === 0) {
        container.innerHTML = `
            <div class="p-8 rounded-xl bg-card border border-white/5 flex flex-col items-center justify-center text-center h-64 text-gray-500">
                <p>No other public activities active.</p>
                <p class="text-xs mt-2 opacity-50">Coding in VS Code usually shows up here!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = '';
    activities.forEach(activity => {
        container.appendChild(renderActivityItem(activity));
    });
}

// Update user data
async function updateUserData() {
    const data = await fetchLanyardStatus(USER_ID);
    
    if (!data) {
        console.log("Using fallback data");
        return;
    }

    // Update avatar
    const avatarUrl = data.discord_user.avatar 
        ? `https://cdn.discordapp.com/avatars/${data.discord_user.id}/${data.discord_user.avatar}.png?size=256`
        : `https://ui-avatars.com/api/?name=${data.discord_user.username}&background=random`;
    
    document.getElementById('avatar').src = avatarUrl;

    // Update status indicator
    const statusIndicator = document.getElementById('status-indicator');
    statusIndicator.className = `absolute bottom-3 right-3 md:bottom-5 md:right-5 w-8 h-8 rounded-full border-4 border-card ${getStatusColor(data.discord_status)}`;

    // Update Spotify
    const spotifyActivity = data.activities.find(a => a.name === "Spotify" || a.id === "spotify:1");
    if (spotifyActivity) {
        renderSpotifyCard(spotifyActivity);
    }

    // Update other activities
    const otherActivities = data.activities.filter(a => a.name !== "Spotify" && a.id !== "spotify:1");
    renderActivities(otherActivities);
}

// Set current year
document.getElementById('year').textContent = new Date().getFullYear();

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    renderTechStack();
    updateUserData();
    setInterval(updateUserData, POLLING_INTERVAL);
});

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Set avatar (placeholder)
function loadAvatar() {
    const avatar = document.getElementById('avatar');
    avatar.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aiden';
}

// Simulate online status
function updateStatus() {
    const indicator = document.getElementById('status-indicator');
    const isOnline = Math.random() > 0.3;
    
    if (isOnline) {
        indicator.classList.remove('bg-gray-500');
        indicator.classList.add('bg-green-500', 'animate-pulse');
    } else {
        indicator.classList.remove('bg-green-500', 'animate-pulse');
        indicator.classList.add('bg-gray-500');
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    renderTechStack();
    loadAvatar();
    updateStatus();
});

// Update status every 30 seconds
setInterval(updateStatus, 30000);
