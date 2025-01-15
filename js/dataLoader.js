export class DataLoader {
    constructor() {
        this.data = [];
        this.currentDateIndex = 0;
    }

    async loadData() {
        const files = [
            'data/lmsys_20240807.csv', 'data/lmsys_20240814.csv', 'data/lmsys_20240823.csv',
            'data/lmsys_20240824.csv', 'data/lmsys_20240828.csv', 'data/lmsys_20240830.csv',
            'data/lmsys_20240906.csv', 'data/lmsys_20240909.csv', 'data/lmsys_20240911.csv',
            'data/lmsys_20240917.csv', 'data/lmsys_20240919.csv', 'data/lmsys_20240928.csv',
            'data/lmsys_20241008.csv', 'data/lmsys_20241016.csv', 'data/lmsys_20241024.csv',
            'data/lmsys_20241029.csv', 'data/lmsys_20241105.csv', 'data/lmsys_20241113.csv',
            'data/lmsys_20241115.csv', 'data/lmsys_20241121.csv', 'data/lmsys_20241122.csv',
            'data/lmsys_20241123.csv', 'data/lmsys_20241203.csv', 'data/lmsys_20241207.csv',
            'data/lmsys_20241212.csv', 'data/lmsys_20241216.csv', 'data/lmsys_20241220.csv',
            'data/lmsys_20241223.csv', 'data/lmsys_20241231.csv', 'data/lmsys_20250107.csv'
        ];

        try {
            const rawData = await Promise.all(files.map(async file => {
                const csvData = await d3.csv(file);
                const date = file.match(/\d{8}/)[0];
                return {
                    date: date,
                    models: csvData.slice(0, 15).map((d, i) => ({
                        model: d.model,
                        score: +d.arena_score,
                        organization: d.organization,
                        rank: i + 1
                    }))
                };
            }));

            // Filter and sort the raw data
            const sortedData = rawData
                .filter(d => d !== null)
                .sort((a, b) => a.date.localeCompare(b.date));

            // Interpolate between each pair of dates
            this.data = [sortedData[0]];  // Start with first date
            for (let i = 0; i < sortedData.length - 1; i++) {
                const interpolated = this.interpolateData(sortedData[i], sortedData[i + 1]);
                this.data.push(...interpolated);
                this.data.push(sortedData[i + 1]);
            }

            return this.getCurrentState();
        } catch (error) {
            console.error("Error loading data:", error);
            throw error;
        }
    }

    interpolateData(startData, endData) {
        const result = [];
        const startDate = new Date(startData.date.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'));
        const endDate = new Date(endData.date.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'));
        
        // Create a map of all models from both dates
        const allModels = new Set([
            ...startData.models.map(m => m.model),
            ...endData.models.map(m => m.model)
        ]);

        // Calculate steps for each day
        const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

        for (let i = 0; i <= daysDiff; i++) {
            const progress = i / daysDiff;
            const currentDate = new Date(startDate.getTime() + (endDate.getTime() - startDate.getTime()) * progress);
            const formattedDate = currentDate.toISOString().slice(0,10).replace(/-/g, '');
            
            // Interpolate scores with easing function for smoother movement
            const easeProgress = 0.5 - Math.cos(progress * Math.PI) / 2;
            
            const interpolatedModels = Array.from(allModels).map(model => {
                const startModel = startData.models.find(m => m.model === model);
                const endModel = endData.models.find(m => m.model === model);
                
                if (!startModel) return endModel;
                if (!endModel) return startModel;
                
                const score = startModel.score + (endModel.score - startModel.score) * easeProgress;
                return {
                    model: model,
                    score: score,
                    organization: startModel.organization,
                    rank: 0  // Will be calculated after sorting
                };
            });

            // Sort and assign ranks
            interpolatedModels.sort((a, b) => b.score - a.score);
            interpolatedModels.forEach((model, idx) => {
                model.rank = idx + 1;
            });

            // Keep only top 15
            result.push({
                date: formattedDate,
                models: interpolatedModels.slice(0, 15)
            });
        }
        
        return result.slice(1);  // Remove first item as it's the same as startData
    }

    getCurrentState() {
        const currentData = this.data[this.currentDateIndex];
        return {
            date: currentData.date,
            models: currentData.models,
            isFirst: this.currentDateIndex === 0,
            isLast: this.currentDateIndex === this.data.length - 1
        };
    }

    next() {
        if (this.currentDateIndex < this.data.length - 1) {
            this.currentDateIndex++;
            return this.getCurrentState();
        }
        return null;
    }

    previous() {
        if (this.currentDateIndex > 0) {
            this.currentDateIndex--;
            return this.getCurrentState();
        }
        return null;
    }

    reset() {
        this.currentDateIndex = 0;
        return this.getCurrentState();
    }

    formatDate(dateString) {
        return dateString.replace(
            /(\d{4})(\d{2})(\d{2})/,
            (_, year, month, day) => {
                const monthNames = [
                    'January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'
                ];
                return `${monthNames[parseInt(month)-1]} ${parseInt(day)}, ${year}`;
            }
        );
    }
}
