import { orgLogos, orgColors, modelPrefixes, chartConfig } from './config.js';

export class ChartRenderer {
    constructor(containerId) {
        this.containerId = containerId;
        this.svg = null;
        this.initChart();
    }

    initChart() {
        const { svgWidth, svgHeight, margin } = chartConfig;
        
        this.svg = d3.select(`#${this.containerId} svg`)
            .attr("width", svgWidth)
            .attr("height", svgHeight)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        window.addEventListener('resize', () => {
            // Handle responsive resizing if needed
            this.updateDimensions();
        });
    }

    updateDimensions() {
        // Could be implemented for responsive design
        // Would update SVG dimensions based on container size
    }

    getLogoPath(model, organization) {
        if (orgLogos[model]) return orgLogos[model];
        if (orgLogos[organization]) return orgLogos[organization];
        
        for (const prefix of modelPrefixes) {
            if (model.startsWith(prefix)) {
                return orgLogos[prefix];
            }
        }
        
        const baseModel = model.split('-')[0];
        return orgLogos[baseModel] || '';
    }

    updateChart(data) {
        const { duration, barHeight } = chartConfig;
        const width = chartConfig.svgWidth - chartConfig.margin.left - chartConfig.margin.right;

        // Update date display
        d3.select(".date-display").text(data.date);

        const x = d3.scaleLinear()
            .domain([0, 15])
            .range([0, width]);

        const y = d3.scaleBand()
            .domain(d3.range(data.models.length))
            .range([0, data.models.length * barHeight])
            .padding(0.15);

        // Update bars
        const bars = this.svg.selectAll(".bar")
            .data(data.models, d => d.model);

        // Enter new bars
        const barsEnter = bars.enter()
            .append("g")
            .attr("class", "bar")
            .attr("transform", (d, i) => `translate(0,${y(i)})`);

        barsEnter.append("rect")
            .attr("class", "rank-bar")
            .attr("height", y.bandwidth())
            .attr("width", width * 0.8)
            .attr("fill", d => orgColors[d.organization] || orgColors.default)
            .style("opacity", 0.9)
            .attr("rx", 4);

        barsEnter.append("text")
            .attr("class", "rank-label")
            .attr("y", y.bandwidth() / 2)
            .attr("dy", ".35em")
            .attr("x", 30)
            .attr("fill", "white")
            .attr("text-anchor", "start");

        barsEnter.append("image")
            .attr("class", "org-logo")
            .attr("y", y.bandwidth() * 0.1)
            .attr("x", 80)
            .attr("height", y.bandwidth() * 0.8)
            .attr("width", y.bandwidth() * 0.8)
            .attr("preserveAspectRatio", "xMidYMid meet")
            .style("opacity", "0.9")
            .style("filter", d => d.model === 'Grok' || d.organization === 'xAI' ? 'invert(100%)' : 'none');

        barsEnter.append("text")
            .attr("class", "bar-label")
            .attr("y", y.bandwidth() / 2)
            .attr("dy", ".35em")
            .attr("x", 80 + y.bandwidth() * 1.0)
            .attr("fill", "white")
            .attr("text-anchor", "start");

        // Update existing bars
        const barsUpdate = bars.merge(barsEnter);

        barsUpdate.transition()
            .duration(duration)
            .attr("transform", (d, i) => `translate(0,${y(i)})`);

        barsUpdate.select(".rank-label")
            .text(d => `#${d.rank}`);

        barsUpdate.select(".org-logo")
            .attr("href", d => this.getLogoPath(d.model, d.organization))
            .style("filter", d => d.model === 'Grok' || d.organization === 'xAI' ? 'invert(100%)' : 'none');

        barsUpdate.select(".bar-label")
            .text(d => d.model);

        // Remove old bars
        bars.exit().remove();
    }
}
