const sounds = {
    click: new Audio('/assets/sounds/mixkit-sci-fi-click-900.mp3'),
    hover: new Audio('/assets/sounds/minimalist-button-hover-sound-effect-399749.mp3'),
    success: new Audio('/assets/sounds/Voicy_Rick Sanchez Thank you.mp3')
};
sounds.click.volume = 0.5;
sounds.hover.volume = 1;
sounds.success.volume = 0.6;
export function playSound(type) {
    const audio = sounds[type];
    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(e => console.log("Audio blocked via browser policy"));
    }
}
