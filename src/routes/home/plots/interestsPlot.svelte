<script>
    import philosophers from '../../../components/data/philosophers2.json';
    import { onMount } from 'svelte';
    import * as d3 from 'd3';

    const count_categories = {
        "Logic": 0,
        "Epistemology": 0,
        "Metaphysics": 0,
        "Ethics": 0,
        "Politics": 0,
        "Aesthetics": 0
    };

    philosophers.forEach(fil => {
        fil.categorias.forEach(cat => {
        if (count_categories.hasOwnProperty(cat)) {
            count_categories[cat]++;
        }
        });
    });

    let chartContainer;
    const plotColor = "#A65526";

    function drawChart() {
        d3.select(chartContainer).selectAll("svg").remove();

        // const containerWidth = chartContainer.clientWidth * 0.7;
        const containerWidth = 500;
        const containerHeight = containerWidth / 2.5;

        const margin = {
            top: containerHeight * 0.08,    
            right: containerWidth * 0.06,    
            bottom: containerHeight * 0.08,  
            left: containerWidth * 0.25     
        };

        const width = containerWidth - margin.left - margin.right;
        const height = containerHeight - margin.top - margin.bottom;

        const data = Object.entries(count_categories).map(([category, count]) => ({
            category,
            count
        }));
        data.sort((a, b) => b.count - a.count);

        const svg = d3.select(chartContainer)
            .append("svg")
            .attr("width", containerWidth)
            .attr("height", containerHeight)
            .attr("viewBox", `0 0 ${containerWidth} ${containerHeight}`)
            .attr("preserveAspectRatio", "xMidYMid meet")
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const y = d3.scaleBand()
            .domain(data.map(d => d.category))
            .range([0, height])
            .padding(0.2);

        const x = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.count)])
            .range([0, width]);

        const bars = svg.selectAll(".bar-group")
            .data(data)
            .enter()
            .append("g")
            .attr("class", "bar-group")
            .attr("transform", d => `translate(0, ${y(d.category)})`);

        bars.append("rect")
            .attr("class", "bar")
            .attr("height", y.bandwidth())
            .attr("x", 0)
            .attr("width", d => x(d.count))
            .attr("fill", plotColor);

        bars.append("text")
            .attr("class", "category-label")
            .attr("x", -15)
            .attr("y", y.bandwidth() / 2)
            .attr("dy", "0.25em")
            .attr("text-anchor", "end")
            .attr("fill", plotColor)
            .style("font-size", "13px")  
            .style("font-family", "Segoe UI, Tahoma, Geneva, Verdana, sans-serif")
            .text(d => d.category);

        bars.append("text")
            .attr("class", "count-label")
            .attr("x", d => x(d.count) + 8)
            .attr("y", y.bandwidth() / 2)
            .attr("dy", "0.25em")
            .attr("fill", plotColor)
            .style("font-size", "13px")  
            .style("font-family", "Segoe UI, Tahoma, Geneva, Verdana, sans-serif")
            .text(d => d.count);
    }

    onMount(() => {
        drawChart();

        window.addEventListener('resize', () => {
        drawChart();
        });
    });
</script>

<div bind:this={chartContainer}></div>
