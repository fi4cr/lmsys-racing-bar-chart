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

## Features

- **Interactive Visualization**
  - Animated racing bar chart
  - Organization-specific colors and logos
  - Smooth transitions between states
  - Real-time rank display

- **Data Processing**
  - Automatic data loading and parsing
  - Interpolation between data points
  - Top 15 model filtering
  - Date-based organization

## Setup and Usage

1. Clone the repository:
   ```bash
   git clone https://github.com/fiacre/lmsys-racing-bar-chart.git
   cd lmsys-racing-bar-chart
   ```

2. Run the data collection scripts:
   ```bash
   python fetch_lmsys_history.py  # Fetch historical data
   python extract_top15.py        # Extract top 15 models
   ```

3. Serve the project:
   ```bash
   python -m http.server 8000
   ```

4. Open in browser:
   ```
   http://localhost:8000
   ```

## Technical Details

### Dependencies
- D3.js (v7) for visualization
- HTML2Canvas for frame capture
- Python 3.x for data collection scripts
- Modern web browser with ES6 module support

### Data Format
Each CSV file contains:
- Model name/identifier
- Arena score
- Organization
- Additional metadata

### Browser Support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Development

### Adding New Models
1. Update `config.js` with new model logos and colors
2. Add logo files to the `logos/` directory
3. Update model prefix mappings if needed

### Modifying the Visualization
1. Adjust chart parameters in `config.js`
2. Modify D3.js rendering in `chartRenderer.js`
3. Update styles in `styles.css`

## Data Sources
- LMSYS Arena: https://chat.lmsys.org/
- LLM Leaderboard CSV: https://github.com/fboulnois/llm-leaderboard-csv
- Model Icons: Some icons sourced from https://lobehub.com/icons

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

The data is sourced from the LMSYS leaderboard and retains its original licensing.
