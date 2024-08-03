const canvas = document.getElementById('artCanvas');
const ctx = canvas.getContext('2d');
const newArtBtn = document.getElementById('newArtBtn');
const complexitySlider = document.getElementById('complexity');
const complexityValue = document.getElementById('complexityValue');
const paletteSelect = document.getElementById('palette');
const toggleModeBtn = document.getElementById('toggleMode');

canvas.width = 800;
canvas.height = 600;

const simplex = new SimplexNoise();

function getPalette(type) {
    switch (type) {
        case 'soft':
            return ['#F3E5D1', '#E6C6B2', '#FFDAB9', '#C7E1BA', '#B2D0E3'];
        case 'earth':
            return ['#795C34', '#D6A656', '#C39D7D', '#8E644D', '#A0522D'];
        case 'jewel':
            return ['#4B0082', '#800080', '#9400D3', '#8A2BE2', '#9370DB'];
        case 'mono':
            const baseHue = Math.random() * 360;
            return [0, 15, 30, 45, 60].map(offset => `hsl(${baseHue}, 50%, ${40 + offset}%)`);
        default:
            return ['#F3E5D1', '#E6C6B2', '#FFDAB9', '#C7E1BA', '#B2D0E3'];
    }
}

function drawCurve(startX, startY, endX, endY, controlX, controlY) {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.quadraticCurveTo(controlX, controlY, endX, endY);
    ctx.stroke();
}

function generateArt() {
    const complexity = parseInt(complexitySlider.value);
    const palette = getPalette(paletteSelect.value);
    
    ctx.fillStyle = document.body.classList.contains('dark-mode') ? '#222' : '#f8f8f8';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Background texture
    for (let x = 0; x < canvas.width; x += 4) {
        for (let y = 0; y < canvas.height; y += 4) {
            const noise = simplex.noise2D(x / 200, y / 200);
            ctx.fillStyle = `rgba(128, 128, 128, ${Math.abs(noise) * 0.03})`;
            ctx.fillRect(x, y, 4, 4);
        }
    }
    
    const layerCount = 3 + Math.floor(Math.random() * 3);
    
    for (let layer = 0; layer < layerCount; layer++) {
        const shapeCount = 20 + Math.floor(Math.random() * 30 * complexity);
        
        for (let i = 0; i < shapeCount; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const size = 30 + Math.random() * 100 * (complexity / 5);
            
            ctx.beginPath();
            const points = Math.floor(3 + Math.random() * 3 * complexity);
            for (let j = 0; j < points; j++) {
                const angle = (j / points) * Math.PI * 2;
                const distance = size * (0.5 + Math.random() * 0.5);
                const px = x + Math.cos(angle) * distance;
                const py = y + Math.sin(angle) * distance;
                if (j === 0) {
                    ctx.moveTo(px, py);
                } else {
                    const controlX = x + Math.cos(angle - Math.PI/4) * distance * 1.2;
                    const controlY = y + Math.sin(angle - Math.PI/4) * distance * 1.2;
                    ctx.quadraticCurveTo(controlX, controlY, px, py);
                }
            }
            ctx.closePath();
            
            const color = palette[Math.floor(Math.random() * palette.length)];
            ctx.fillStyle = color;
            ctx.globalAlpha = 0.4 + Math.random() * 0.2;
            ctx.fill();
            
            if (Math.random() < 0.5) {
                ctx.strokeStyle = palette[(palette.indexOf(color) + 1) % palette.length];
                ctx.lineWidth = 1 + Math.random() * 2;
                ctx.globalAlpha = 0.2 + Math.random() * 0.3;
                ctx.stroke();
            }
        }
    }
    
    // Add some flowing lines
    ctx.globalAlpha = 0.3;
    for (let i = 0; i < 20; i++) {
        const startX = Math.random() * canvas.width;
        const startY = Math.random() * canvas.height;
        const endX = Math.random() * canvas.width;
        const endY = Math.random() * canvas.height;
        const controlX = (startX + endX) / 2 + (Math.random() - 0.5) * 200;
        const controlY = (startY + endY) / 2 + (Math.random() - 0.5) * 200;
        
        ctx.strokeStyle = palette[Math.floor(Math.random() * palette.length)];
        ctx.lineWidth = 1 + Math.random() * 3;
        drawCurve(startX, startY, endX, endY, controlX, controlY);
    }

    // Add glowing particles
    ctx.globalAlpha = 0.6;
    for (let i = 0; i < 100; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 3;
        const color = palette[Math.floor(Math.random() * palette.length)];
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
    }
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const modeLabel = document.getElementById('mode-label');
    modeLabel.textContent = document.body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';
    generateArt();
}

newArtBtn.addEventListener('click', generateArt);

complexitySlider.addEventListener('input', () => {
    complexityValue.textContent = complexitySlider.value;
});

complexitySlider.addEventListener('change', generateArt);
paletteSelect.addEventListener('change', generateArt);
toggleModeBtn.addEventListener('click', toggleDarkMode);

generateArt();

// Add a subtle animation effect
function animateBackground() {
    const time = Date.now() * 0.001;
    const x = Math.sin(time) * 5;
    const y = Math.cos(time) * 5;
    canvas.style.transform = `translate(${x}px, ${y}px)`;
    requestAnimationFrame(animateBackground);
}

animateBackground();