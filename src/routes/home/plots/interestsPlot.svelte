<script>
    import philosophers from '../../../components/data/philosophers2.json';
    import { onMount } from 'svelte';
    import * as d3 from 'd3';

    // Counting each interest
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

    onMount(() => {
        const plotColor = "#A65526";

        // Sort Data
        const data = Object.entries(count_categories).map(([category, count]) => ({
            category,
            count
        }));
        data.sort((a, b) => b.count - a.count);

        const margin = { top: 20, right: 40, bottom: 20, left: 100 };
        const width = 600 - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;

        const svg = d3.select(chartContainer)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const y = d3.scaleBand()
            .domain(data.map(d => d.category))
            .range([0, height])
            .padding(0.2);

        const x = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.count)])
            .range([0, width]);

        // Bars
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

        // Category 
        bars.append("text")
            .attr("class", "category-label")
            .attr("x", -15)  
            .attr("y", y.bandwidth() / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", "end")
            .attr("fill", plotColor)
            .text(d => d.category);

        bars.append("text")
            .attr("class", "count-label")
            .attr("x", d => x(d.count) + 8)  
            .attr("y", y.bandwidth() / 2)
            .attr("dy", "0.35em")
            .attr("fill", plotColor)
            .text(d => d.count);
    });
</script>

<div bind:this={chartContainer}></div>
