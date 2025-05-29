<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
    import './timeline.css';
    import './infos.js';
    import { categorias, filosofos } from './infos.js';

    let anoInical = -600;
    let anoFinal = 2000;
    let stepAnos = 100; 

    const anos = d3.range(anoInical, anoFinal + 1, stepAnos);

    const colors = {
        background: '#f5efe6',
        timeline: '#6b4f3a',
        accent: '#8c7a6d',
        text: '#3e2d23',
        highlight: '#c5a173'
    };

    // Posição das x categorias para serem usadas no template  
    let categoriaPositions = [];

    onMount(() => {
        let y;

        const svgElement = document.getElementById('timeline');
        const width = svgElement.getBoundingClientRect().width;
        const height = 6000;
        const margin = { top: 80, right: 80, bottom: 80, left: 80 };
        
        const svg = d3.select('#timeline')
            .attr('width', width)
            .attr('height', height)
            .style('background', colors.background);
 
        y = d3.scaleLinear()
            .domain([anoInical, anoFinal])
            .range([margin.top, height - margin.bottom]);

        // Largura de cada coluna com base no número de categorias
        const columnWidth = (width - margin.left - margin.right) / categorias.length;

        // Delimitações verticais entre as colunas 
        const delimitations = d3.range(0, categorias.length + 1).map(i => margin.left + i * columnWidth);

        // svg.selectAll('.category-line')
        //     .data(delimitations)
        //     .enter()
        //     .append('line')
        //     .attr('x1', d => d)
        //     .attr('x2', d => d)
        //     .attr('y1', margin.top)
        //     .attr('y2', height - margin.bottom)
        //     .attr('stroke', colors.accent)
        //     .attr('stroke-width', 1)
        //     .attr('stroke-dasharray', '5,3');

        // Posição central x de cada categoria no topo da timeline
        categoriaPositions = categorias.map((cat, i) => ({
            ...cat,
            pos: (delimitations[i] + delimitations[i + 1]) / 2
        }));

        // Rótulos dos anos
        svg.selectAll('.year-label')
            .data(anos)
            .enter()
            .append('text')
            .attr('class', 'year-label')
            .attr('x', margin.left - 25)
            .attr('y', d => y(d))
            .attr('dy', '0.35em')
            .attr('text-anchor', 'end')
            .style('opacity', 0)
            .transition()
            .delay((d, i) => i * 50)
            .duration(500)
            .style('opacity', 1)
            .text(d => d);

        // Linhas horizontais
        svg.selectAll('.year-line')
            .data(anos)
            .enter()
            .append('line')
            .attr('class', 'year-line')
            .attr('x1', margin.left - 10)
            .attr('x2', width - margin.right)
            .attr('y1', d => y(d))
            .attr('y2', d => y(d))
            .attr('stroke', colors.accent)
            .attr('stroke-width', 0.5)
            .style('opacity', 0)
            .transition()
            .delay((d, i) => i * 50)
            .duration(100)
            .style('opacity', 0.3);

        // Posições x de cada filósofo
        const xPosFilos = filosofos.map(() =>
            margin.left + Math.random() * (width - margin.left - margin.right)
        );

        // Adição do filósofo na timeline
        svg.selectAll('.filosofo-line')
            .data(filosofos)
            .enter()
            .append('line')
            .attr('class', 'filosofo-line')
            .attr('data-filosofo', d => d.nome)
            .attr('x1', (_, i) => xPosFilos[i])
            .attr('x2', (_, i) => xPosFilos[i])
            .attr('y1', d => y(d.nascimento))
            .attr('y2', d => y(d.morte))
            .attr('stroke', colors.timeline)
            .attr('stroke-width', 2.5)
            .attr('stroke-linecap', 'round');

        // Conexão categorias aos filósofos
        filosofos.forEach((filosofo, i) => {
            const xFilosofo = xPosFilos[i];
            const yNascimento = y(filosofo.nascimento);
            
            filosofo.categorias.forEach(categoriaNome => {
                const categoria = categoriaPositions.find(c => c.nome === categoriaNome);
                if (categoria) {
                    svg.append('line')
                        .attr('class', 'category-connection')
                        .attr('x1', categoria.pos)
                        .attr('y1', margin.top - 20) 
                        .attr('x2', xFilosofo)
                        .attr('y2', yNascimento)
                        .attr('stroke', colors.highlight)
                        .attr('stroke-width', 1)
                        .attr('stroke-dasharray', '4 2')
                        .style('opacity', 1);
                }
            });
        });

        // Label do filósofo
        filosofos.forEach((filosofo, i) => {
            const x = xPosFilos[i];
            const yLabel = y(filosofo.nascimento) - 10;
            const padding = 3;
            const fontSize = 14;
            const nome = filosofo.nome;

            const text = svg.append('text')
                .attr('x', x)
                .attr('y', yLabel)
                .attr('text-anchor', 'middle')
                .style('font-family', 'Cinzel, serif')
                .style('font-size', `${fontSize}px`)
                .style('fill', colors.text)
                .text(nome);

            const bbox = text.node().getBBox();

            svg.insert('rect', 'text')  
                .attr('x', bbox.x - padding)
                .attr('y', bbox.y - padding)
                .attr('width', bbox.width + padding * 2)
                .attr('height', bbox.height + padding * 2)
                .attr('fill', '#fff')
                .attr('stroke', colors.timeline)
                .attr('stroke-width', 1.2)
                .attr('rx', 4)
                .attr('ry', 4);
        });

        // Marcador de morte do filósofo
        let sizeSkull = 20;
        svg.selectAll('.filosofo-end')
            .data(filosofos)
            .enter()
            .append('image')
            .attr('class', 'filosofo-end')
            .attr('x', (_, i) => xPosFilos[i] - sizeSkull / 2) 
            .attr('y', d => y(d.morte) - sizeSkull / 2)        
            .attr('width', sizeSkull)                     
            .attr('height', sizeSkull)
            .attr('href', d => '/images/skull_icon.png'); 
        
        // Atualização da ligação de categoria-filósofo ao scrollar
        let ticking = false;
        window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                const viewportHeight = window.innerHeight;

                d3.selectAll('.category-connection').style('opacity', 0); // reset

                filosofos.forEach((filosofo, i) => {
                    const yStart = y(filosofo.nascimento);
                    const yEnd = y(filosofo.morte);

                    const isVisible = (
                        (yStart >= scrollY && yStart <= scrollY + viewportHeight) ||  // topo visível
                        (yEnd >= scrollY && yEnd <= scrollY + viewportHeight) ||      // base visível
                        (yStart < scrollY && yEnd > scrollY + viewportHeight)         // cobre a viewport
                    );

                    if (isVisible) {
                        svg.selectAll('.category-connection')
                            .filter(function () {
                                const x2 = d3.select(this).attr('x2');
                                return x2 == xPosFilos[i];  
                            })
                            .style('opacity', 0.6)
                            .attr('y1', scrollY + 60);  
                    }
                });
                ticking = false;
            });
            ticking = true;
        }
    });

    });

</script>

<!-- Header -->
<header class="fixed-header">
    <div class="header-content">
        Philosophers' Timeline
    </div>
</header>

<!-- Categorias -->
<div class="fixed-categories">
    {#each categoriaPositions as cat}
        <div class="category-label" style="left: {cat.pos}px">
            {cat.nome}
            <div class="tooltip">{cat.descricao}</div>
        </div>
    {/each}
</div>

<!-- Timeline -->
<div class="container">
    <svg id="timeline" class="w-full shadow-xl rounded-lg"></svg>
</div>
