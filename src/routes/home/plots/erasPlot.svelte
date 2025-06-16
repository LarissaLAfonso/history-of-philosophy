<script>
    import philosophers from '../../../components/data/philosophers2.json';
    import eras from '../../../components/data/eras.json';
    import { onMount } from 'svelte';
    import * as d3 from 'd3';

    const counts_eras = {
        "Ancient": 0,
        "Medieval": 0,
        "Renaissance": 0,
        "Modern": 0,
        "Contemporary": 0
    };

    // Counting of the data
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

    function drawChart() {
        d3.select(chartContainer).selectAll("svg").remove();

        const containerWidth = 500;
        const containerHeight = containerWidth / 2.5; 

        const margin = {
            top: containerHeight * 0.08,    
            right: containerWidth * 0.25,    
            bottom: containerHeight * 0.08,  
            left: containerWidth * 0.06      
        };

        const width = containerWidth - margin.left - margin.right;
        const height = containerHeight - margin.top - margin.bottom;

        const data = Object.entries(counts_eras).map(([category, count]) => ({
            category,
            count,
            color: eraColors[category],
        }));

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
            .domain([d3.max(data, d => d.count), 0])
            .range([0, width]);

        const bars = svg.selectAll(".bar-group")
            .data(data)
            .enter()
            .append("g")
            .attr("class", "bar-group")
            .attr("transform", d => `translate(0, ${y(d.category)})`);

        // Bar Plot
        bars.append("rect")
            .attr("class", "bar")
            .attr("height", y.bandwidth())
            .attr("x", d => x(d.count))
            .attr("width", d => width - x(d.count))
            .attr("fill", d => d.color);

        // Category Label
        bars.append("text")
            .attr("class", "category-label")
            .attr("x", width + 10)
            .attr("y", y.bandwidth() / 2)
            .attr("dy", "0.25em")
            .attr("text-anchor", "start")
            .attr("fill", d => d.color)
            .style("font-size", "13px")
            .style("font-family", "Segoe UI, Tahoma, Geneva, Verdana, sans-serif")  
            .text(d => d.category);

        // Number od occurrences
        bars.append("text")
            .attr("class", "count-label")
            .attr("x", d => x(d.count) - 8)
            .attr("y", y.bandwidth() / 2)
            .attr("dy", "0.25em")
            .attr("text-anchor", "end")
            .attr("fill", d => d.color)
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