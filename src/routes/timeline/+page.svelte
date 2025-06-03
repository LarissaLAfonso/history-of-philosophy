<script>
    import { onMount, afterUpdate } from 'svelte';
    import * as d3 from 'd3';
    import './timeline.css';
    import './infos.js';
    import categorias from './tooltip_categories.json';
    // import { filosofos } from './infos.js';
    import filosofos from '../../components/data/philosophers2.json';
    import { philosophers } from '../../components/data/philosophers.json';
    import { getAlivePhilosophersIdx, getPhilosopherDesc } from './philosophers_manipulation';
    filosofos.sort((a, b) => a.nascimento - b.nascimento);
    let selectedFilosofo = null;
    let selectedFilosofoInfo = null;
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

        if (isSplitView && selectedFilosofo === filosofo) {
            closeDetailView();
        } else {
            selectedFilosofo = filosofo;
            isSplitView = true;
            selectedFilosofoInfo = getPhilosopherDesc(selectedFilosofo.nome);
            console.log(selectedFilosofoInfo);
        }
    }

    function closeDetailView() {
        selectedFilosofo = null;
        isSplitView = false;
        selectedFilosofoInfo = null;
    }

    function handleResize() {
        drawTimeLine();
    }

    function showCategoryConnections(filosofoNome) {
    d3.selectAll(`.category-connection.${filosofoNome.replace(/\s+/g, '-')}`)
        .style('opacity', 0.6);
}

    function hideCategoryConnections(filosofoNome) {
        d3.selectAll(`.category-connection.${filosofoNome.replace(/\s+/g, '-')}`)
            .style('opacity', 0);
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


            // Posições x de cada filósofo
        function getXForPosition(position){
            return margin.left + position/12 * (containerWidth - margin.left - margin.right)
        }
        let filosofosProcessados = []
        let xPosFilos = [];
        filosofos.forEach(filosofo => {
            const alive = getAlivePhilosophersIdx(filosofosProcessados, filosofo.nascimento);
            console.log(alive);
            // const alivePositions = alive.map(index => xPosFilos[index]).sort((a, b) => a - b);
            const alivePositions = xPosFilos.filter((_, index) => alive.includes(index)).sort((a, b) => a - b);
            console.log(alivePositions);
            let val = alive.length
            for(let i = 0; i < alivePositions.length; i++){
                const possiblePosition = getXForPosition(i)
                if(possiblePosition < alivePositions[i]){
                    val = i;
                    break;
                }
            }
            xPosFilos.push(getXForPosition(val));
            filosofosProcessados.push(filosofo);
        });

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
                        .attr('class', `category-connection ${filosofo.nome.replace(/\s+/g, '-')}`)
                        .attr('x1', categoria.pos)
                        // .attr('y1', window.scrollY + 50)
                        .attr('x2', xFilosofo)
                        .attr('y2', yNascimento)
                        .attr('stroke', colors.highlight)
                        .attr('stroke-width', 1)
                        .attr('stroke-dasharray', '4 2')
                        .style('opacity', 0); 
                }
            });
        });

        // Label do filósofo
        filosofos.forEach((filosofo, i) => {
            const padding = 3;
            const fontSize = 14;
            const nome = filosofo.nome;
            const areaHeight = y(filosofo.morte) - y(filosofo.nascimento) + 40;
            const x = xPosFilos[i];
            const yLabel = y(filosofo.nascimento)+fontSize/2 + padding;

            
            const text = svg.append('text')
            .attr('x', x)
            .attr('y', yLabel)
            .attr('text-anchor', 'middle')
            .style('font-family', 'Cinzel, serif')
            .style('font-size', `${fontSize}px`)
            .style('fill', colors.text)
            .text(nome)
            .style("user-select", "none");
            
            // Nome do filósofo
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

            // Retângulo de interação
            svg.append('rect')
                .attr('class', `interaction-area ${filosofo.nome.replace(/\s+/g, '-')}`)
                .attr('x', xPosFilos[i] - 25) 
                .attr('y', y(filosofo.nascimento) - 20)
                .attr('width', 50)
                .attr('height', areaHeight)
                .attr('fill', 'transparent')
                .style('cursor', 'pointer')
                .on('mouseover', () => showCategoryConnections(filosofo.nome))
                .on('mouseout', () => hideCategoryConnections(filosofo.nome))
                .on('click', () => selectFilosofo(filosofo));
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
        
    }

    onMount(() => {
        drawTimeLine();
        window.addEventListener('resize', handleResize);

        window.addEventListener('scroll', () => {
            d3.selectAll('.category-connection')
                .attr('y1', window.scrollY + 50);
    });

    });

    afterUpdate(() => {
        drawTimeLine();

        // Arruma a posição y das conexões ao scrollar
        const scrollY = window.scrollY;
        d3.selectAll('.category-connection')
            .attr('y1', scrollY + 50);
    });

</script>

<div class="full-page">
    <div class="viz {isSplitView ? 'split-view' : ''}">
        <!-- Header -->
        <div class="fixed-header">
            <div class="header-content">
                <a href="/" class="home-icon">
                    <!-- Home -->
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                    </svg>
                </a>
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
            <button on:click={closeDetailView}>Close</button>

            <h1>{selectedFilosofo.nome}</h1>

            <div class="sub-infos">
                <img src={selectedFilosofoInfo.image} alt="{selectedFilosofo.nome}">

                <div>
                    <p><strong>Lifetime: </strong>{selectedFilosofoInfo.lifetime}</p>
                    <p><strong>Branch: </strong>{selectedFilosofoInfo.branch}</p>
                    <p><strong>Fields: </strong>{selectedFilosofoInfo.fields}</p>
                </div>
            </div>

            <div class="paragraphs">
                {#if selectedFilosofoInfo.description.length > 0}
                    {#each selectedFilosofoInfo.description as paragraph}
                        <p>{@html paragraph.value}</p>
                    {/each}
                {:else}
                    <p>No information available.</p>
                {/if}
            </div>
        </div>
    {/if}
</div>