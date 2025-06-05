// Global variables
let collection = JSON.parse(localStorage.getItem('collection')) || [];
let currentSong = null;
let audioInstance = null;
let isPlaying = false;


// List of artists for random selection
const popularArtists = [
    'Taylor Swift', 'Adele', 'Ed Sheeran', 'Billie Eilish',
    'Blur', 'Future', 'Juice WRLD', 'Childish Gambino', 'Tyler The Creator',
    '070 Shake', 'Jaden', 'Rich Brian', 'King Crimson', 'Travis Scott',
    'Brika', 'Oasis', 'XXXTENTACION', 'Eason Chan', 'BROCKHAMPTON','Pink Floyd', 'Gorillaz', '21 Savage', 'J. Cole', 
    'Frank Ocean', 'Kendrick Lamar', 'Kanye West'
];


// Fetch random song from Deezer
async function fetchRandomSong() {
    try {
        console.log('Fetching random song...');
        const randomArtist = popularArtists[Math.floor(Math.random() * popularArtists.length)];
        console.log('Selected artist:', randomArtist);

        const proxyUrl = "https://shade-metal-smartphone.glitch.me/proxy/";
        const searchUrl = `https://api.deezer.com/search?q=artist:"${encodeURIComponent(randomArtist)}"`;
        const response = await fetch(proxyUrl + searchUrl, {
            headers: {
                "X-Requested-With": "XMLHttpRequest"
            }
        });

        if (!response.ok) {
            throw new Error('Search failed');
        }

        const data = await response.json();
        console.log('Search results:', data);

        if (!data.data || data.data.length === 0) {
            throw new Error('No tracks found');
        }

        const randomTrack = data.data[Math.floor(Math.random() * data.data.length)];

        // Clear previous audio instance
        if (audioInstance) {
            audioInstance.pause();
            audioInstance = null;
            isPlaying = false;
        }

        displaySong(randomTrack);

    } catch (error) {
        console.error('Error fetching song:', error);
        alert('Unable to fetch song. Please try again.');
    }
}

// Display song in UI
function displaySong(song) {
    currentSong = {
        title: song.title,
        artist: song.artist.name,
        albumImage: song.album.cover_big || song.album.cover_medium || song.album.cover,
        songUrl: song.preview,
        deezerUrl: song.link,
        album: song.album.title,
        duration: formatDuration(song.duration),
        rank: song.rank,
        hasPreview: !!song.preview
    };

    const albumArt = document.getElementById('album-art');
    const albumImage = document.getElementById('album-image');
    if (albumImage) {
        albumImage.style.backgroundImage = `url(${currentSong.albumImage})`;
        albumImage.style.display = 'block';
        albumImage.textContent = '';
    }

    if (albumArt) {
        albumArt.classList.add('active'); // 添加 active 类，允许显示 overlay
    }

    const songTitle = document.getElementById('song-title');
    const artistName = document.getElementById('artist-name');
    if (songTitle) songTitle.textContent = currentSong.title;
    if (artistName) artistName.textContent = currentSong.artist;

    const playButton = document.getElementById('play-button');
    if (playButton) {
        if (currentSong.hasPreview) {
            playButton.style.display = 'block';
            playButton.onclick = () => handlePlayback(playButton);
            updatePlayButtonIcon(playButton, false);
        } else {
            playButton.style.display = 'none';
        }
    }
  const addButton = document.getElementById('add-to-collection');
    if (addButton) {
        addButton.onclick = () => {
            if (!collection.some(item => item.songUrl === currentSong.songUrl)) {
                collection.push(currentSong);
                localStorage.setItem('collection', JSON.stringify(collection));
                alert(`${currentSong.title} by ${currentSong.artist} added to your collection!`);
            } else {
                alert(`${currentSong.title} is already in your collection.`);
            }
        };
    }
}

// Reset overlay when no cover image is available
function resetAlbumArt() {
    const albumArt = document.getElementById('album-art');
    const albumImage = document.getElementById('album-image');
    if (albumArt) albumArt.classList.remove('active'); // 移除 active 类
    if (albumImage) {
        albumImage.style.backgroundImage = '';
        albumImage.style.display = 'none';
        albumImage.textContent = '♬'; // 恢复默认状态
    }
}
// Handle audio playback
function handlePlayback(playButton) {
    if (!currentSong || !currentSong.songUrl) {
        alert('No preview available');
        return;
    }

    if (!audioInstance) {
        audioInstance = new Audio(currentSong.songUrl);
        audioInstance.play().catch(error => {
            console.error('Playback failed:', error);
            alert('Failed to play preview. Please try another song.');
        });
        isPlaying = true;
    } else {
        if (isPlaying) {
            audioInstance.pause();
            isPlaying = false;
        } else {
            audioInstance.play().catch(error => {
                console.error('Playback failed:', error);
                alert('Failed to play preview. Please try another song.');
            });
            isPlaying = true;
        }
    }

    updatePlayButtonIcon(playButton, isPlaying);

    if (!audioInstance.onended) {
        audioInstance.onended = () => {
            isPlaying = false;
            updatePlayButtonIcon(playButton, isPlaying);
            audioInstance = null;
        };
    }
}

// Add event listener for the gallery button
function initGalleryButton() {
    const galleryButton = document.getElementById("gallery-page-button");
    if (galleryButton) {
        galleryButton.onclick = () => {
            window.location.href = "gallery.html"; // Redirect to gallery.html
        };
    }
}

// Helper functions
function updatePlayButtonIcon(button, isPlaying) {
   button.style.fontSize = '1.5rem'; // 设置字符的字体大小
    button.innerHTML = isPlaying ? '❚❚' : '▶';
}

function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Initialize app
function initApp() {
    document.addEventListener('DOMContentLoaded', function () {
        console.log('Initializing app...');
        const fetchButton = document.getElementById('fetch-song');
        if (fetchButton) {
            fetchButton.onclick = fetchRandomSong;
        }
        initGalleryButton(); // Initialize gallery button
    });
}

// Start the app
initApp();


