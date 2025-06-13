<svelte:head>
    <title>Philosophy Timeline</title>
</svelte:head>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Overlock:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900&display=swap" rel="stylesheet">

<script>
    import { onMount, afterUpdate } from 'svelte';
    import * as d3 from 'd3';
    import './timeline.css';
    import './infos.js';
    import categorias from './tooltip_categories.json';
    // import { filosofos } from './infos.js';
    import filosofos from '../../components/data/philosophers2.json';
    import { philosophers } from '../../components/data/philosophers.json';
    import { getAlivePhilosophersIdx, getPhilosopherDesc } from '../../scripts/philosophers_manipulation';
    import {base} from '$app/paths';
    import glossary from '../../components/data/glossary.json';
    import { fly } from 'svelte/transition';
    import { processTextWithGlossary } from '../../scripts/textProcessing.js';
    import eras from '../../components/data/eras.json';
    import { showTooltip, hideTooltip, moveTooltip } from '../../scripts/tooltip_functions'
    
    const activeCategories = {};

    categorias.forEach(cat => {
        activeCategories[cat.nome] = false;
    });

    function handleCategoryClick(nome) {
        // Recebe o contrário de atividade
        activeCategories[nome] = !activeCategories[nome];
        console.log(activeCategories);
    }

    let searchQuery = '';
    let searchResults = [];

    function categoriesAreActive(philosopherCategories, activeCategories) {
        let result = philosopherCategories.every(cat => activeCategories[cat] === true);
        for(const cat of Object.keys(activeCategories)) {
            if (activeCategories[cat] === true) return result;
        }
        return true;
    }

    $: searchResults = searchQuery.trim().length > 1
        ? filosofos
              .map(f => {
                  const info = getPhilosopherDesc(f.nome);
                  const text = info.description.map(p => p.value).join(' ').toLowerCase();
                  const re = new RegExp(searchQuery, 'gi');
                  const matches = [...text.matchAll(re)];
                  const count = matches.length;
                  return count > 0 ? { fil: f, count } : null;
              })
              .filter(Boolean)
              .sort((a, b) => b.count - a.count)
        : [];

    function performSelect(name) {
        const fil = filosofos.find(f => f.nome === name);
        if (fil) selectFilosofo(fil);
        //searchQuery = '';
    }

        
    function highlightSearch(text) {
        if (!searchQuery.trim()) return text;
        const escaped = searchQuery.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${escaped})`, 'gi');
        return text.replace(regex, '<span class="search-highlight">$1</span>');
    }



    filosofos.sort((a, b) => a.nascimento - b.nascimento);
    let selectedFilosofo = null;
    let selectedFilosofoInfo = null;
    let isSplitView = false;    
    let containerWidth = 0;  
    
    
    // tooltip state variables
    let tooltipVisible = false;
    let tooltipContent = '';
    let tooltipX = 0;
    let tooltipY = 0;
                            
    let initialYear = -600; 
    let finalYear = 2000;   
    let stepYears = 100;    

    const anos = d3.range(initialYear, finalYear + 1, stepYears);

    const colors = {
        background: '#f5efe6',
        timeline: '#6b4f3a',
        accent: '#8c7a6d',
        text: '#3e2d23',
        highlight: '#8C7351'
    };


    // Posição das x categorias para serem usadas no template  
    let categoriaPositions = [];

    function selectFilosofo(filosofo) {
        /*Função para selecionar filósofo e ativar split view*/
        d3.selectAll(`.category-connection.${selectedFilosofo?.nome.replace(/\s+/g, '-')}`)
            .style('opacity', 0);
        if (isSplitView && selectedFilosofo === filosofo) {
            closeDetailView();
        } else {
            selectedFilosofo = filosofo;
            isSplitView = true;
            selectedFilosofoInfo = getPhilosopherDesc(selectedFilosofo.nome);
            updateCategoryConnections(selectedFilosofo.nome); // Atualiza conexões
            d3.selectAll(`.category-connection.${selectedFilosofo.nome.replace(/\s+/g, '-')}`)
                .style('opacity', 0.6);
        }
    }

    function closeDetailView() {
        if (selectedFilosofo) {
            updateCategoryConnections(selectedFilosofo.nome); // Esconde conexões
        }
        selectedFilosofo = null;
        isSplitView = false;
        selectedFilosofoInfo = null;
        tooltipVisible = false; // Hide tooltip when closing detail view
    }


    function handleResize() {
        drawTimeLine();
    }

    function updateCategoryConnections(filosofoNome) {
        const shouldShow = selectedFilosofo?.nome === filosofoNome;
        d3.selectAll(`.category-connection.${filosofoNome.replace(/\s+/g, '-')}`)
            .style('opacity', shouldShow ? 0.6 : 0);
    }

    function showCategoryConnections(filosofoNome) {
        if (selectedFilosofo?.nome !== filosofoNome) {
            d3.selectAll(`.category-connection.${filosofoNome.replace(/\s+/g, '-')}`)
                .style('opacity', 0.6);
        }
    }

    function hideCategoryConnections(filosofoNome) {
        if (selectedFilosofo?.nome !== filosofoNome) {
            d3.selectAll(`.category-connection.${filosofoNome.replace(/\s+/g, '-')}`)
                .style('opacity', 0);
        }
    }

    function drawTimeLine() {
        const svg = d3.select('#timeline');
        svg.selectAll("*").remove();
        
        const timelineContainer = document.getElementById('timeline-container');
        if (!timelineContainer) return;

        containerWidth = timelineContainer.clientWidth;
        const height = 6000;
        const margin = { top: 80, right: containerWidth / 12, bottom: 80, left: containerWidth / 12 };

        const y = d3.scaleLinear()
            .domain([initialYear, finalYear])
            .range([margin.top, height - margin.bottom]);

            const linearGradient = svg.append('linearGradient')
            .attr('id', 'bg-gradient')
            .attr('x1', '0%')
            .attr('y1', '0%')
            .attr('x2', '0%')  
            .attr('y2', '100%');

        // Transition width in years
        const transitionWidth = 70;  
        
        // First stop at the top
        linearGradient.append('stop')
            .attr('offset', 0)
            .attr('stop-color', eras[0].backgroundColor);

        eras.forEach((era, i) => {
            const currentColor = era.backgroundColor;
            const nextColor = eras[(i + 1) % eras.length].backgroundColor;

            const eraStart = y(era.start) / height;
            const eraEnd = y(era.end) / height;
            const transitionStart = y(era.end - transitionWidth) / height;
            const transitionEnd = eraEnd;

            // Stops for the current era
            linearGradient.append('stop')
                .attr('offset', eraStart)
                .attr('stop-color', currentColor);

            linearGradient.append('stop')
                .attr('offset', transitionStart)
                .attr('stop-color', currentColor);

            // Stops for the transition gradient
            linearGradient.append('stop')
                .attr('offset', transitionStart)
                .attr('stop-color', currentColor);

            linearGradient.append('stop')
                .attr('offset', transitionEnd)
                .attr('stop-color', nextColor);
        });

        // Last stop at the end
        linearGradient.append('stop')
            .attr('offset', 1)
            .attr('stop-color', eras[eras.length - 1].backgroundColor);

        // Background
        svg.append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', containerWidth)
            .attr('height', height)
            .attr('fill', 'url(#bg-gradient)');

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
            .attr('x', margin.left - margin.left / 10)
            .attr('y', d => y(d))
            .attr('dy', '0.35em')
            .attr('text-anchor', 'end')
            .style('opacity', 1)
            .text(d => {
                if (d < 0) {
                    return `${Math.abs(d)} BC`;
                } else {
                    return `${d} AD`;
                }
            });

        // Rótulos das eras
        svg.selectAll('.eras-label')
            .data(eras)
            .enter()
            .append('text')
            .attr('class', 'eras-label')  
            .attr('x', margin.left - margin.left / 10)
            .attr('y', d => y(d.start))  
            .attr('dy', '0.35em')
            .attr('text-anchor', 'end')
            .style('opacity', 1)
            .style('font-family', '"Cinzel", serif') 
            .style('fill', d => d.textColor) 
            .attr('transform', d => `rotate(-90, ${margin.left - margin.left / 10}, ${y(d.start) + 15})`)
            .text(d => d.name); 

        

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
            .style('opacity', 0.7);

        // Posições x de cada filósofo
        function getXForPosition(position){
            return margin.left + position/12 * (containerWidth - margin.left - margin.right)
        }
        let filosofosProcessados = []
        let xPosFilos = [];
        filosofos.forEach(filosofo => {
            const alive = getAlivePhilosophersIdx(filosofosProcessados, filosofo.nascimento);
            // const alivePositions = alive.map(index => xPosFilos[index]).sort((a, b) => a - b);
            const alivePositions = xPosFilos.filter((_, index) => alive.includes(index)).sort((a, b) => a - b);
            let val = alive.length + 1
            for(let i = 0; i < alivePositions.length; i++){
                const possiblePosition = getXForPosition(i + 1);
                if(possiblePosition < alivePositions[i]){
                    val = i + 1;
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
            .attr('class', d => `filosofo-line ${selectedFilosofo?.nome === d.nome ? 'selected' : ''}`)
            .style('opacity', d => categoriesAreActive(d.categorias, activeCategories) ? 1 : 0.3);

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
                        .attr('x2', xFilosofo)
                        .attr('y2', yNascimento)
                        .attr('stroke', colors.highlight)
                        .attr('stroke-width', 1.3)
                        .attr('stroke-dasharray', '4 2')
                        .style('opacity', selectedFilosofo?.nome === filosofo.nome ? 0.6 : 0); 

                    svg.append('line')
                        .attr('class', `selected-connection ${filosofo.nome.replace(/\s+/g, '-')}`)
                        .attr('x1', categoria.pos)
                        .attr('x2', xFilosofo)
                        .attr('y2', yNascimento)
                        .attr('stroke', colors.highlight)
                        .attr('stroke-width', 1)
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
            const yLabel = y(filosofo.nascimento) + padding;

            // Área de interação
            svg.append('rect')
                .attr('class', `interaction-area ${filosofo.nome.replace(/\s+/g, '-')}`)
                .attr('x', x - 25)
                .attr('y', y(filosofo.nascimento) - 20)
                .attr('width', 50)
                .attr('height', areaHeight)
                .attr('fill', 'transparent')
                .style('cursor', 'pointer')
                .on('mouseover', () => showCategoryConnections(filosofo.nome))
                .on('mouseout', () => hideCategoryConnections(filosofo.nome))
                .on('click', () => selectFilosofo(filosofo));

            // Grupo principal do rótulo
            const labelGroup = svg.append('g')
                .attr('class', `filosofo-label ${selectedFilosofo?.nome === filosofo.nome ? 'selected' : ''}`)
                .attr('transform', `translate(${x},${yLabel})`)
                .style('cursor', 'pointer')
                .on('click', () => selectFilosofo(filosofo));

            // Texto temporário para cálculo de dimensões
            const tempText = labelGroup.append('text')
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'middle')
                .style('font-family', 'Cinzel, serif')
                .style('font-size', `${fontSize}px`)
                .style('fill', 'transparent') // Invisível
                .text(nome);

            const bbox = tempText.node().getBBox();
            tempText.remove();

            const algumSelecionado = !!selectedFilosofo;
            const isSelected = selectedFilosofo?.nome === filosofo.nome;

            // Fatores de escala
            const shrinkFactor = 0.6;
            const widthFactor = !algumSelecionado || isSelected ? 1 : 0.65;
            const fontScale = !algumSelecionado || isSelected ? 1 : shrinkFactor;
            const paddingFactor = !algumSelecionado || isSelected ? 1 : shrinkFactor;

            // Retângulo de fundo
            labelGroup.append('rect')
                .attr('x', -bbox.width * widthFactor / 2 - padding * paddingFactor)
                .attr('y', -bbox.height / 2 - padding * paddingFactor)
                .attr('width', bbox.width * widthFactor + padding * 2 * paddingFactor)
                .attr('height', bbox.height + padding * 2 * paddingFactor)
                .attr('fill', '#fff')
                .attr('stroke', isSelected ? colors.highlight : colors.timeline)
                .attr('stroke-width', isSelected ? 2.5 : 1.2)
                .attr('rx', 6)
                .attr('ry', 6)
                .style('opacity', categoriesAreActive(filosofo.categorias, activeCategories) ? 1 : 0.3);

            // Texto visível
            labelGroup.append('text')
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'middle')
                .style('font-family', 'Cinzel, serif')
                .style('font-size', `${fontSize * fontScale}px`)
                .style('fill', colors.text)
                .text(nome)
                .style('opacity', categoriesAreActive(filosofo.categorias, activeCategories) ? 1 : 0.3);
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
            .attr('href', d => 'images/skull_icon.png')
            .style('cursor', 'pointer')
            .on('click', (event, d) => selectFilosofo(d))
            .attr('class', d => `filosofo-end ${selectedFilosofo?.nome === d.nome ? 'selected' : ''}`)
            .style('opacity', d => categoriesAreActive(d.categorias, activeCategories) ? 1 : 0.3);
    }

    onMount(() => {
        drawTimeLine();
        window.addEventListener('resize', handleResize);

        window.addEventListener('scroll', () => {
            d3.selectAll('.category-connection')
                .attr('y1', window.scrollY + 50);
            d3.selectAll('.selected-connection')
                .attr('y1', window.scrollY + 50);
    });
    });

    afterUpdate(() => {
        drawTimeLine();

        // Arruma a posição y das conexões ao scrollar
        const scrollY = window.scrollY;
        d3.selectAll('.category-connection')
            .attr('y1', scrollY + 50);
        d3.selectAll('.selected-connection')
            .attr('y1', scrollY + 50);
    });

</script>


<div class="full-page">
    <div class="viz {isSplitView ? 'split-view' : ''}">
        <!-- Header -->
        <div class="fixed-header">
            <div class="header-content">
                <a href='{base}/' class="home-icon">
                    <!-- Home -->
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                    </svg>
                </a>
                <span>Philosophers' Timeline</span>
            </div>
        </div>

        <div class="search-wrapper">
        <div class="search-input-container">
            <!-- magnifying glass icon on the right -->
            <svg class="search-icon" viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zM10 14a4 4 0 110-8 4 4 0 010 8z" />
            </svg>
            <input class="search-input" type="text" placeholder="Search a term..." bind:value={searchQuery} />
        </div>
        {#if searchResults.length}
            <div class="search-results">
                {#each searchResults as item}
                    <div class="result-item" on:click={() => performSelect(item.fil.nome)}>
                        <span>{item.fil.nome}</span><span class="result-count">({item.count})</span>
                    </div>
                {/each}
            </div>
        {/if}
    </div>

        <!-- Categorias -->
        <div class="fixed-categories">
            <div class="interests-label">Interests:</div>
            {#each categoriaPositions as cat}
            <div
                class="category-label {activeCategories[cat.nome] ? 'active' : ''}"
                on:click={() => handleCategoryClick(cat.nome)}
                style="left: {cat.pos}px"
                role="button"
                tabindex="0"
                on:keypress={(e) => e.key === 'Enter' && handleCategoryClick(cat.nome)}
            >
                {cat.nome}
                <div class="tooltip">{cat.descricao}</div>
            </div>
            {/each}
        </div>

        <!-- Timeline Container -->
        <div class="container" id="timeline-container">
            <div class="fixed-year">YEAR</div>
            <svg id="timeline" class="grafico"></svg>
        </div>
    </div>

    <!-- Submódulo das Informações fos Filósofos -->
    {#if isSplitView}
        <div class="info-filosofos" transition:fly="{{ x: 300, duration: 300 }}">
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

            <div class="paragraphs" on:mouseover={showTooltip} on:mouseout={hideTooltip} on:mousemove={moveTooltip}>
                {#if selectedFilosofoInfo.description.length > 0}
                    {#each selectedFilosofoInfo.description as paragraph}
                        <p>{@html highlightSearch(processTextWithGlossary(paragraph.value, glossary))}</p>
                    {/each}
                {:else}
                    <p>No information available.</p>
                {/if}
            </div>
        </div>
    {/if}

    <!-- Glossary tooltip -->
    {#if tooltipVisible}
        <div class="glossary-tooltip" 
             style="left: {tooltipX}px; top: {tooltipY}px;">
            {tooltipContent}
        </div>
    {/if}
</div>