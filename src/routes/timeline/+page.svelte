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
    import { getAlivePhilosophersIdx, getPhilosopherDesc } from './philosophers_manipulation';
    import {base} from '$app/paths';
    import glossary from '../../components/data/glossary.json';
    import eras from '../../components/data/eras.json';
    import { fly } from 'svelte/transition';

    const activeCategories = {};

    categorias.forEach(cat => {
        activeCategories[cat.nome] = true;
    });

    function handleCategoryClick(nome) {
        // Recebe o contrário de atividade
        activeCategories[nome] = !activeCategories[nome];
        console.log(activeCategories);
    }

    let searchQuery = '';
    let searchResults = [];

    function categoriesAreActive(philosopherCategories, activeCategories) {
        return philosopherCategories.every(cat => activeCategories[cat] === true);
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


    // glossary processing function
    // and exclusion of terms already wrapped in <b> or <em> tags
    function processTextWithGlossary(text, glossaryData) {
        if (!text || !glossaryData) return text;
        
        let processedText = text;
        
        // Sort glossary terms by length (longest first) to avoid partial matches
        // This is crucial for compound terms like "modal logic" vs "logic"
        const sortedTerms = Object.keys(glossaryData).sort((a, b) => b.length - a.length);
        
        sortedTerms.forEach(term => {
            // Escape special regex characters
            const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            
            // For compound words, we want to match the exact phrase
            // Use word boundaries for both single and multi-word terms
            const regex = new RegExp(`\\b${escapedTerm}\\b`, 'gi');
            
            // Only replace if not already wrapped in a glossary-term span, <b>, or <em> tags
            processedText = processedText.replace(regex, (match, offset, string) => {
                // Check if this match is already inside a glossary-term span
                const beforeMatch = string.substring(0, offset);
                const afterMatch = string.substring(offset + match.length);
                
                // Count opening and closing spans before this match
                const openSpans = (beforeMatch.match(/<span[^>]*class="[^"]*glossary-term[^"]*"/g) || []).length;
                const closeSpans = (beforeMatch.match(/<\/span>/g) || []).length;
                
                // If we're inside a span, don't replace
                if (openSpans > closeSpans) {
                    return match;
                }
                
                // Check if the term is inside <b> or <em> tags
                // Look for the closest opening tag before our match
                const tagsBefore = beforeMatch.match(/<\/?(?:b|em|strong|i)\b[^>]*>/gi) || [];
                const tagsAfter = afterMatch.match(/<\/?(?:b|em|strong|i)\b[^>]*>/gi) || [];
                
                // Track which tags are currently open
                let openTags = [];
                tagsBefore.forEach(tag => {
                    const isClosing = tag.startsWith('</');
                    const tagName = tag.match(/<\/?(\w+)/)[1].toLowerCase();
                    
                    if (isClosing) {
                        // Remove the tag from openTags if it's being closed
                        openTags = openTags.filter(t => t !== tagName);
                    } else {
                        // Add the tag to openTags if it's being opened
                        openTags.push(tagName);
                    }
                });
                
                // Check if we're currently inside b, em, strong, or i tags
                const isInsideFormattingTag = openTags.some(tag => 
                    ['b', 'em', 'strong', 'i'].includes(tag)
                );
                
                // If we're inside formatting tags, don't create a glossary tooltip
                if (isInsideFormattingTag) {
                    return match;
                }
                
                return `<span class="glossary-term" data-definition="${glossaryData[term].replace(/"/g, '&quot;')}">${match}</span>`;
            });
        });
        
        return processedText;
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
    let finalYear = 2020;   
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

    // tooltip functions
    function showTooltip(event) {
            const target = event.target;
            if (target.classList.contains('glossary-term')) {
                tooltipContent = target.dataset.definition;
                tooltipVisible = true;
                
                // Use setTimeout to ensure the tooltip is rendered before positioning
                setTimeout(() => {
                    positionTooltip(event);
                }, 0);
            }
        }

        function hideTooltip(event) {
            // Only hide if we're not moving to another glossary term
            if (!event.relatedTarget || !event.relatedTarget.classList.contains('glossary-term')) {
                tooltipVisible = false;
            }
        }

        function moveTooltip(event) {
            if (tooltipVisible) {
                positionTooltip(event);
            }
        }

        function positionTooltip(event) {
        const tooltipElement = document.querySelector('.glossary-tooltip');
        if (!tooltipElement) return;

        const mouseX = event.clientX;
        const mouseY = event.clientY;
        const offset = 10; // Distance from cursor
        
        // Get viewport dimensions
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Get tooltip dimensions
        const tooltipRect = tooltipElement.getBoundingClientRect();
        const tooltipWidth = tooltipRect.width;
        const tooltipHeight = tooltipRect.height;
        
        // Calculate available space in each direction
        const spaceRight = viewportWidth - mouseX;
        const spaceLeft = mouseX;
        const spaceBottom = viewportHeight - mouseY;
        const spaceTop = mouseY;
        
        // Determine horizontal position
        let x;
        if (spaceRight >= tooltipWidth + offset) {
            // Enough space on the right
            x = mouseX + offset;
        } else if (spaceLeft >= tooltipWidth + offset) {
            // Not enough space on right, but enough on left
            x = mouseX - tooltipWidth - offset;
        } else {
            // Not enough space on either side, choose the side with more space
            if (spaceRight > spaceLeft) {
                x = mouseX + offset;
            } else {
                x = mouseX - tooltipWidth - offset;
            }
            
            // Ensure tooltip doesn't go off-screen
            x = Math.max(5, Math.min(x, viewportWidth - tooltipWidth - 5));
        }
        
        // Determine vertical position
        let y;
        if (spaceBottom >= tooltipHeight + offset) {
            // Enough space below
            y = mouseY + offset;
        } else if (spaceTop >= tooltipHeight + offset) {
            // Not enough space below, but enough above
            y = mouseY - tooltipHeight - offset;
        } else {
            // Not enough space above or below, choose the side with more space
            if (spaceBottom > spaceTop) {
                y = mouseY + offset;
            } else {
                y = mouseY - tooltipHeight - offset;
            }
            
            // Ensure tooltip doesn't go off-screen
            y = Math.max(5, Math.min(y, viewportHeight - tooltipHeight - 5));
        }
        
        // Apply the calculated position
        tooltipX = x;
        tooltipY = y;
    }

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
    svg.selectAll('*').remove();

    /* ---- 1. container sizes ---- */
    const timelineContainer = document.getElementById('timeline-container');
    if (!timelineContainer) return;

    containerWidth = timelineContainer.clientWidth;
    const height   = 6000;
    const margin   = { top: 80, right: containerWidth / 12, bottom: 80, left: containerWidth / 12 };

    /* ---- 2. scales ---- */
    const y = d3.scaleLinear()
        .domain([initialYear, finalYear])
        .range([margin.top, height - margin.bottom]);

    /* ---- 3. background gradient (eras) ---- */
    const lg = svg.append('linearGradient')
        .attr('id', 'bg-gradient')
        .attr('x1', '0%').attr('y1', '0%')
        .attr('x2', '0%').attr('y2', '100%');

    const fade = 0.1;          

    eras.forEach((era, i) => {
        const start = (y(era.start) - margin.top) / (height - margin.top - margin.bottom);
        const end   = (y(era.end)   - margin.top) / (height - margin.top - margin.bottom);
        const nextColor = eras[(i + 1) % eras.length].backgroundColor;

        // solid fill for the era
        lg.append('stop').attr('offset',  start).attr('stop-color', era.backgroundColor);
        lg.append('stop').attr('offset',  end - fade).attr('stop-color', era.backgroundColor);

        // razor-thin blend into the next era
        lg.append('stop').attr('offset', end).attr('stop-color', nextColor);
            

        /* paint full-page background with that gradient */
        svg.append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', containerWidth)
            .attr('height', height)
            .attr('fill', 'url(#bg-gradient)');

    });


    if (!timelineContainer) return;

    containerWidth = timelineContainer.clientWidth;

    /* ---------- 2. CATEGORY X LOOKUP ---------- */
    const columnWidth = (containerWidth - margin.left - margin.right) / categorias.length;
    const delimitations = d3.range(0, categorias.length + 1).map(i => margin.left + i * columnWidth);
    categoriaPositions = categorias.map((cat, i) => ({
        ...cat,
        pos: (delimitations[i] + delimitations[i + 1]) / 2
    }));
    const catX = Object.fromEntries(categoriaPositions.map(c => [c.nome, c.pos]));

    /* ---------- 3. PRE-COMPUTE LAYOUT PER PHILOSOPHER ---------- */
    const filosLayout = filosofos.map(f => {
        const xs = f.categorias.map(c => catX[c]);
        const minX = Math.min(...xs) - 10;
        const maxX = Math.max(...xs) + 10;
        return { fil: f, minX, maxX, centerX: (minX + maxX) / 2 };
    });

    const groups = d3.group(filosLayout, d => d.centerX);

    groups.forEach(group => {
        if (group.length === 1) return;

        const step = 14;                     // horizontal gap between neighbours
        const offset0 = -step * (group.length - 4);

        group.forEach((d, i) => {
            const dx = offset0 + i * step;   // <-- shift value for THIS philosopher

            // apply to the whole span
            d.minX   += dx;
            d.maxX   += dx;
            d.centerX += dx;
        });
    });

    /* ---------- 3-ter.  GLOBAL vertical de-overlap ---------- */
    const lineH = 20;   // box height  (≈ font-size 14 + padding*2)
    const gapY  = 1;    // extra vertical gap

    // place philosophers chronologically
    filosLayout.sort((a, b) => a.fil.nascimento - b.fil.nascimento);

    const placed = [];  // boxes already fixed

    filosLayout.forEach(d => {
        d.dy = 0;                       // start with zero shift

        while (placed.some(p =>
            // horizontal overlap?
            !(d.maxX < p.minX || d.minX > p.maxX) &&
            // vertical overlap?
            Math.abs((y(d.fil.nascimento)+d.dy) - (y(p.fil.nascimento)+p.dy))
                < lineH + gapY
        )) {
            d.dy += lineH + gapY;       // push one “line” lower
        }

        placed.push({ minX: d.minX, maxX: d.maxX, fil: d.fil, dy: d.dy });
    });


    /* ---------- 4. BACKGROUND + GRID ---------- */

    svg.selectAll('.year-line')
        .data(anos)
        .enter()
        .append('line')
        .attr('x1', margin.left)
        .attr('x2', containerWidth - margin.right / 3)
        .attr('y1', d => y(d))
        .attr('y2', d => y(d))
        .attr('stroke', colors.accent)
        .attr('stroke-width', 0.5)
        .style('opacity', 0.7);

    svg.selectAll('.year-label')
        .data(anos)
        .enter()
        .append('text')
        .attr('x', margin.left - margin.left / 10)
        .attr('y', d => y(d))
        .attr('dy', '0.35em')
        .attr('text-anchor', 'end')
        .text(d => d < 0 ? `${Math.abs(d)} BC` : `${d} AD`);

    /* ---------- 5. LIFESPAN LINES ---------- */
    svg.selectAll('.filosofo-line')
        .data(filosLayout)
        .enter()
        .append('line')
        .attr('class', d => `filosofo-line ${d.fil.nome.replace(/\s+/g, '-')}`)
        .attr('x1', d => d.centerX)
        .attr('x2', d => d.centerX)
        .attr('y1', d => y(d.fil.nascimento) + (d.dy || 0))
        .attr('y2', d => y(d.fil.morte)       + (d.dy || 0))
        .attr('stroke', colors.timeline)
        .attr('stroke-width', 2.5)
        .attr('stroke-linecap', 'round')
        .style('cursor', 'pointer')
        .style('opacity', d =>
            categoriesAreActive(d.fil.categorias, activeCategories) ? 1 : 0.3
        )
        .on('click', (e, d) => selectFilosofo(d.fil));

    /* ---------- 6. NAME BOXES ---------- */
    filosLayout.forEach(d => {
        const padding  = 3;
        const fontSize = 14;
        const yLabel   = y(d.fil.nascimento) + (d.dy || 0);
        const boxW     = d.maxX - d.minX;

        /* measure text once */
        const tmp   = svg.append('text')
                        .style('visibility', 'hidden')
                        .style('font-family', 'Cinzel, serif')
                        .style('font-size', `${fontSize}px`)
                        .text(d.fil.nome);
        const textW = tmp.node().getBBox().width;
        tmp.remove();

        const spanW   = d.maxX - d.minX;                 // interest span
        const labelW  = Math.max(spanW, textW + 2*padding);

        /* if the text is wider than the span, centre it on the span */
        const labelX  = spanW >= labelW
                        ? d.minX                          // full-span case
                        : d.centerX - labelW / 2;        // text-wider case

        // label-group anchored at the left edge of the span
        const g = svg.append('g')
            .attr('transform', `translate(${labelX},${yLabel})`)
            .style('cursor', 'pointer')
            .on('click', () => selectFilosofo(d.fil));

        /* background */
        g.append('rect')
        .attr('x', 0)
        .attr('y', -fontSize/2 - padding)
        .attr('width', labelW)
        .attr('height', fontSize + 2*padding)
        .attr('fill', '#fff')
        .attr('stroke', colors.timeline)
        .attr('stroke-width', selectedFilosofo?.nome === d.fil.nome ? 2.5 : 1.2)
        .attr('rx', 6).attr('ry', 6)
        .style('opacity',
            categoriesAreActive(d.fil.categorias, activeCategories) ? 1 : 0.3);

        /* centred text */
        g.append('text')
        .attr('x', labelW/ 2)
        .attr('dominant-baseline', 'middle')
        .attr('text-anchor', 'middle')
        .style('font-family', 'Cinzel, serif')
        .style('font-size', `${fontSize}px`)
        .style('fill', colors.text)
        .text(d.fil.nome)
        .style('opacity',
            categoriesAreActive(d.fil.categorias, activeCategories) ? 1 : 0.3);

        /* hover / click area – same width as the box */
        svg.append('rect')
        .attr('class', `interaction-area ${d.fil.nome.replace(/\s+/g, '-')}`)
        .attr('x', labelX)
        .attr('y', y(d.fil.nascimento) + (d.dy || 0) - 20)
        .attr('width', labelW)
        .attr('height', y(d.fil.morte)  + (d.dy || 0) - y(d.fil.nascimento) + (d.dy || 0) + 40)
        .attr('fill', 'transparent')
        .on('mouseover', () => showCategoryConnections(d.fil.nome))
        .on('mouseout',  () => hideCategoryConnections(d.fil.nome))
        .on('click',     () => selectFilosofo(d.fil));

        /* --- skull marker --- */
        svg.append('image')
            .attr('x', d.centerX - 10)
            .attr('y', y(d.fil.morte) + (d.dy || 0) - 10)
            .attr('width', 20).attr('height', 20)
            .attr('href', 'images/skull_icon.png')
            .style('cursor', 'pointer')
            .style('opacity',
                categoriesAreActive(d.fil.categorias, activeCategories) ? 1 : 0.3
            )
            .on('click', () => selectFilosofo(d.fil));
    });

    /* ---------- 7. CATEGORY → PHILOSOPHER LINES ---------- */
    filosLayout.forEach(d => {
        d.fil.categorias.forEach(cat => {
            svg.append('line')
                .attr('class', `category-connection ${d.fil.nome.replace(/\s+/g, '-')}`)
                .attr('x1', catX[cat])
                .attr('y1', y(d.fil.nascimento) + (d.dy || 0))
                .attr('x2', d.centerX)
                .attr('y2', y(d.fil.nascimento) + (d.dy || 0))
                .attr('stroke', colors.highlight)
                .attr('stroke-width', 1.3)
                .attr('stroke-dasharray', '4 2')
                .style('opacity', selectedFilosofo?.nome === d.fil.nome ? 0.6 : 0);
        });
    });
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