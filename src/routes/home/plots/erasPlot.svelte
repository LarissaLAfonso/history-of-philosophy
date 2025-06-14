<script>
    import philosophers from '../../../components/data/philosophers2.json';
    import eras from '../../../components/data/eras.json';
    import { onMount } from 'svelte';
    import * as d3 from 'd3';

    // Counting each era
    const counts_eras = {
        "Ancient": 0,
        "Medieval": 0,
        "Renaissance": 0,
        "Modern": 0,
        "Contemporary": 0
    }
    philosophers.forEach(philosopher => {
        const birthYear = philosopher.nascimento;
        const era = eras.find(e => birthYear >= e.start && birthYear < e.end);
        if (era) {
            counts_eras[era.name]++;
        }
    });

    const eraColors = {};
    eras.forEach(era => {
        eraColors[era.name] = era.textColor;
    });

    let chartContainer;

    onMount(() => {
        const data = Object.entries(counts_eras).map(([category, count]) => ({
            category,
            count,
            color: eraColors[category] 
        }));

        const margin = { top: 20, right: 120, bottom: 20, left: 40 };
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
            .domain([d3.max(data, d => d.count), 0])  
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
            .attr("x", d => x(d.count))
            .attr("width", d => width - x(d.count))
            .attr("fill", d => d.color)

        bars.append("text")
            .attr("class", "category-label")
            .attr("x", width + 10)  
            .attr("y", y.bandwidth() / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", "start")
            .attr("fill", d => d.color)
            .text(d => d.category);

        bars.append("text")
            .attr("class", "count-label")
            .attr("x", d => x(d.count) - 8)  
            .attr("y", y.bandwidth() / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", "end")
            .attr("fill", d => d.color)
            .text(d => d.count);
    });
</script>

<div bind:this={chartContainer}></div>
