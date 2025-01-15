import { DataLoader } from './dataLoader.js';
import { ChartRenderer } from './chartRenderer.js';
import { AnimationController } from './animationController.js';

let animationController;
const pauseButton = document.getElementById('pauseButton');

function updatePauseButtonState() {
    if (animationController.isPlaying) {
        pauseButton.style.display = 'none';
    } else {
        pauseButton.style.display = 'block';
        pauseButton.textContent = '▶️';
    }
}

async function initializeApp() {
    try {
        const dataLoader = new DataLoader();
        const chartRenderer = new ChartRenderer('chart');
        animationController = new AnimationController(dataLoader, chartRenderer);
        
        // Add click handlers
        document.addEventListener('click', (event) => {
            if (event.target !== pauseButton) {
                animationController.toggleAnimation();
                updatePauseButtonState();
            }
        });

        pauseButton.addEventListener('click', (event) => {
            event.stopPropagation();
            animationController.toggleAnimation();
            updatePauseButtonState();
        });

        // Initialize the visualization
        await animationController.initialize();

    } catch (error) {
        console.error('Failed to initialize application:', error);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);
