# LLM Arena Visualization

An interactive visualization of language model performance evolution using data from the LMSYS Arena leaderboard. The project features a dynamic racing bar chart that shows how different models' rankings have changed over time.

## Project Structure

```
.
├── css/
│   └── styles.css          # Global styles and layout
├── js/
│   ├── config.js          # Configuration (logos, colors, chart settings)
│   ├── dataLoader.js      # Data loading and processing
│   ├── chartRenderer.js   # D3.js visualization logic
│   ├── animationController.js # Animation and playback control
│   └── main.js           # Application initialization
├── data/                 # Historical data files
│   └── lmsys_*.csv      # Leaderboard snapshots by date
├── logos/               # Organization and model logos
│   └── *.svg           # SVG logo files
├── extract_top15.py     # Script to extract top 15 models
├── fetch_lmsys_history.py # Script to fetch historical data
└── index.html          # Main HTML entry point
```

## Components

### Data Management (dataLoader.js)
- Loads and processes CSV data files
- Handles data interpolation between dates
- Manages data state and navigation
- Provides formatted date strings

### Visualization (chartRenderer.js)
- Renders the D3.js racing bar chart
- Handles logo mapping and display
- Manages smooth transitions and animations
- Responsive layout management

### Animation Control (animationController.js)
- Controls animation playback
- Manages state transitions
- Handles data updates
- Coordinates between data and visualization

### Configuration (config.js)
- Logo mappings for organizations and models
- Color schemes for different organizations
- Chart dimensions and settings
- Model prefix definitions

## Data Sources
- LMSYS Arena: https://chat.lmsys.org/
- LLM Leaderboard CSV: https://github.com/fboulnois/llm-leaderboard-csv
- Model Icons: Some icons sourced from https://lobehub.com/icons

## License
This project is open source. The data is sourced from the LMSYS leaderboard and retains its original licensing.
