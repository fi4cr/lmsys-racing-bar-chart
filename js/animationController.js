export class AnimationController {
    constructor(dataLoader, chartRenderer) {
        this.dataLoader = dataLoader;
        this.chartRenderer = chartRenderer;
        this.animationInterval = null;
        this.isPlaying = false;
        this.animationSpeed = 250; // milliseconds between updates
    }

    async initialize() {
        const initialState = await this.dataLoader.loadData();
        await this.updateVisualization(initialState);
        this.startAnimation();
    }

    startAnimation() {
        if (!this.isPlaying) {
            this.isPlaying = true;
            this.animationInterval = setInterval(() => {
                const nextState = this.dataLoader.next();
                if (nextState) {
                    this.updateVisualization(nextState);
                } else {
                    // Pause for 5 seconds before resetting
                    this.stopAnimation();
                    setTimeout(() => {
                        const initialState = this.dataLoader.reset();
                        this.updateVisualization(initialState);
                        this.startAnimation();
                    }, 5000);
                }
            }, this.animationSpeed);
        }
    }

    stopAnimation() {
        if (this.isPlaying) {
            this.isPlaying = false;
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
    }

    toggleAnimation() {
        if (this.isPlaying) {
            this.stopAnimation();
        } else {
            this.startAnimation();
        }
    }

    next() {
        this.stopAnimation();
        const nextState = this.dataLoader.next();
        if (nextState) {
            this.updateVisualization(nextState);
        }
    }

    previous() {
        this.stopAnimation();
        const prevState = this.dataLoader.previous();
        if (prevState) {
            this.updateVisualization(prevState);
        }
    }

    reset() {
        this.stopAnimation();
        const initialState = this.dataLoader.reset();
        this.updateVisualization(initialState);
    }

    updateVisualization(state) {
        // Format the date for display
        const formattedDate = this.dataLoader.formatDate(state.date);
        state.date = formattedDate;
        
        // Update the chart
        this.chartRenderer.updateChart(state);
    }
}
