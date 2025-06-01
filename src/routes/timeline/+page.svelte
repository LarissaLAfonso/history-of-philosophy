<script>
    import { onMount, afterUpdate } from 'svelte';
    import * as d3 from 'd3';
    import './timeline.css';
    import './infos.js';
    import categorias from './tooltip_categories.json';
    import { filosofos } from './infos.js';

    let selectedFilosofo = null;
    let isSplitView = false;
    let containerWidth = 0;

    let initialYear = -600;
    let finalYear = 2000;
    let stepYears = 100; 

    const anos = d3.range(initialYear, finalYear + 1, stepYears);

    const colors = {
        background: '#f5efe6',
        timeline: '#6b4f3a',
        accent: '#8c7a6d',
        text: '#3e2d23',
        highlight: '#c5a173'
    };

    // Posição das x categorias para serem usadas no template  
    let categoriaPositions = [];

    function randUniform(a, b) {
        return a + Math.random() * (b - a);
    }

    // Posições dos elementos dos objetos filósofos na timeline
    const randomValues = Array.from({ length: filosofos.length }, () => randUniform(0.1, 0.9));

    function selectFilosofo(filosofo) {
        /*Função para selecionar filósofo e ativar split view*/

        // Se o filósofo já está selecionado, fecha a view
        if (isSplitView && selectedFilosofo === filosofo) {
            closeDetailView();
        } 
        // Se é um filósofo diferente, atualiza
        else {
            selectedFilosofo = filosofo;
            isSplitView = true;
        }
    }

    function closeDetailView() {
        /*Função para fechar a view*/
        selectedFilosofo = null;
        isSplitView = false;
    }

    function handleResize() {
        drawTimeLine();
    }

    function drawTimeLine() {

        const svg = d3.select('#timeline');
        svg.selectAll("*").remove();

        const timelineContainer = document.getElementById('timeline-container');
        if (!timelineContainer) return;
        
        containerWidth = timelineContainer.clientWidth;
        const height = 6000;
        const margin = { top: 80, right: containerWidth / 12, bottom: 80, left: containerWidth / 12 };
        
        svg.attr('width', containerWidth)
            .attr('height', height)
            .style('background', colors.background);

        const y = d3.scaleLinear()
            .domain([initialYear, finalYear])
            .range([margin.top, height - margin.bottom]);

        // Largura de cada coluna com base no número de categorias
        const columnWidth = (containerWidth - margin.left - margin.right) / categorias.length;

        // Delimitações verticais entre as colunas 
        const delimitations = d3.range(0, categorias.length + 1).map(i => margin.left + i * columnWidth);

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
            .attr('x', margin.left - margin.left / 3)
            .attr('y', d => y(d))
            .attr('dy', '0.35em')
            .attr('text-anchor', 'end')
            .style('opacity', 0)
            // .transition()
            // .delay((d, i) => i * 50)
            // .duration(500)
            .style('opacity', 1)
            .text(d => d);

        // Linhas horizontais
        svg.selectAll('.year-line')
            .data(anos)
            .enter()
            .append('line')
            .attr('class', 'year-line')
            .attr('x1', margin.left )
            .attr('x2', containerWidth - margin.right / 3)
            .attr('y1', d => y(d))
            .attr('y2', d => y(d))
            .attr('stroke', colors.accent)
            .attr('stroke-width', 0.5)
            // .style('opacity', 0)
            // .transition()
            // .delay((d, i) => i * 50)
            // .duration(100)
            .style('opacity', 0.4);

        // Posições x de cada filósofo (aleatórias mas consistentes)
        const xPosFilos = randomValues.map(val =>
            margin.left + val * (containerWidth - margin.left - margin.right)
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
            .attr('stroke-linecap', 'round')
            .style('cursor', 'pointer') 
            .on('click', (event, d) => selectFilosofo(d))
            .attr('class', d => `filosofo-line ${selectedFilosofo?.nome === d.nome ? 'selected' : ''}`);

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
                        .attr('y1', margin.top - margin.top / 4) 
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

            const labelGroup = svg.append('g')
                .attr('class', 'filosofo-label')
                .attr('transform', `translate(${x},${yLabel})`)
                .style('cursor', 'pointer')
                .on('click', () => selectFilosofo(filosofo))
                .attr('class', `filosofo-label ${selectedFilosofo?.nome === filosofo.nome ? 'selected' : ''}`);

            labelGroup.append('rect')
                .attr('x', -bbox.width/2 - padding)
                .attr('y', -bbox.height/2 - padding)
                .attr('width', bbox.width + padding * 2)
                .attr('height', bbox.height + padding * 2)
                .attr('fill', '#fff')
                .attr('stroke', colors.timeline)
                .attr('stroke-width', 1.2)
                .attr('rx', 4)
                .attr('ry', 4);

            labelGroup.append('text')
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'middle')
                .style('font-family', 'Cinzel, serif')
                .style('font-size', `${fontSize}px`)
                .style('fill', colors.text)
                .text(nome);
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
            .attr('href', d => '/images/skull_icon.png')
            .style('cursor', 'pointer')
            .on('click', (event, d) => selectFilosofo(d))
            .attr('class', d => `filosofo-end ${selectedFilosofo?.nome === d.nome ? 'selected' : ''}`);
        
        // Atualização da ligação de categoria-filósofo ao scrollar
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    const viewportHeight = window.innerHeight;

                    d3.selectAll('.category-connection').style('opacity', 0);

                    filosofos.forEach((filosofo, i) => {
                        const yStart = y(filosofo.nascimento);
                        const yEnd = y(filosofo.morte);

                        const isVisible = (
                            (yStart >= scrollY && yStart <= scrollY + viewportHeight) || 
                            (yEnd >= scrollY && yEnd <= scrollY + viewportHeight) || 
                            (yStart < scrollY && yEnd > scrollY + viewportHeight)         
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
    }

    onMount(() => {
        drawTimeLine();
        window.addEventListener('resize', handleResize);
    });

    afterUpdate(() => {
        drawTimeLine();
    });
</script>

<div class="full-page">
    <div class="viz {isSplitView ? 'split-view' : ''}">
        <!-- Header -->
        <div class="fixed-header">
            <div class="header-content">
                Philosophers' Timeline
            </div>
        </div>

        <!-- Categorias -->
        <div class="fixed-categories">
            {#each categoriaPositions as cat}
                <div class="category-label" style="left: {cat.pos}px">
                    {cat.nome}
                    <div class="tooltip">{cat.descricao}</div>
                </div>
            {/each}
        </div>

        <!-- Timeline Container -->
        <div class="container" id="timeline-container">
            <svg id="timeline" class="grafico"></svg>
        </div>
    </div>

    <!-- Submódulo das Informações fos Filósofos -->
    {#if isSplitView}
        <div class="info-filosofos">
            <button on:click={closeDetailView}>Fechar</button>
            <h2>{selectedFilosofo.nome}</h2>
            <p>Nascimento: {selectedFilosofo.nascimento}</p>
            <p>Morte: {selectedFilosofo.morte}</p>
        </div>
    {/if}
</div>