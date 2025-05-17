<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';

    // Define as categorias que serão exibidas na linha do tempo,
    // cada uma com nome e descrição para tooltip
    const categorias = [
        { 
            nome: 'Ética', 
            descricao: 'Ramo da filosofia que estuda os princípios morais que governam o comportamento humano.' 
        },
        { 
            nome: 'Metafísica', 
            descricao: 'Investigação sobre a natureza da realidade, existência e o ser.' 
        },
        { 
            nome: 'Lógica', 
            descricao: 'Estudo das regras do pensamento válido, inferência e argumentação.' 
        },
        { 
            nome: 'Epistemologia', 
            descricao: 'Ramo que investiga a natureza, origem e limites do conhecimento.' 
        },
        { 
            nome: 'Política', 
            descricao: 'Reflexão filosófica sobre o poder, governo, justiça e a organização da sociedade.' 
        },
        { 
            nome: 'Estética', 
            descricao: 'Explora a natureza do belo, da arte e da experiência estética.' 
        }
    ];

    const anos = d3.range(-600, 2001, 100);

    const colors = {
        background: '#f5efe6',
        timeline: '#6b4f3a',
        accent: '#8c7a6d',
        text: '#3e2d23',
        highlight: '#c5a173'
    };

    // Posição das categorias para serem usadas no template  
    export let categoriaPositions = [];

    let y;

    onMount(() => {
        // Cores definidas como variáveis CSS globais para uso no CSS
        for (const [key, value] of Object.entries(colors)) {
            document.documentElement.style.setProperty(`--${key}`, value);
        }

        const svgElement = document.getElementById('timeline');
        const width = svgElement.getBoundingClientRect().width;
        const height = 4000;
        const margin = { top: 80, right: 80, bottom: 80, left: 80 };

        const svg = d3.select('#timeline')
            .attr('width', width)
            .attr('height', height)
            .style('background', colors.background)
            .style('border-radius', '8px');
 
        y = d3.scaleLinear()
            .domain([-600, 2000])
            .range([margin.top, height - margin.bottom]);

        // Largura de cada coluna com base no número de categorias
        const columnWidth = (width - margin.left - margin.right) / categorias.length;

        // Delimitações verticais entre as colunas (para linhas guia)
        const delimitations = d3.range(0, categorias.length + 1).map(i => margin.left + i * columnWidth);

        svg.selectAll('.category-line')
            .data(delimitations)
            .enter()
            .append('line')
            .attr('x1', d => d)
            .attr('x2', d => d)
            .attr('y1', margin.top)
            .attr('y2', height - margin.bottom)
            .attr('stroke', colors.accent)
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', '5,3');

        // Posição central de cada categoria para exibir os rótulos fixos no topo
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
    });

</script>

<!-- Header -->
<header class="fixed-header">
    <div class="header-content">
        Linha do Tempo Filosófica
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

<style global>
    @import url('https://fonts.googleapis.com/css2?family=Marcellus&family=MedievalSharp&family=Cinzel:wght@600&family=Crimson+Text:wght@400;600&display=swap');
    
    /* Variáveis CSS para cores usadas */
    :root {
        --background: #f5efe6;
        --timeline: #6b4f3a;
        --accent: #8c7a6d;
        --text: #3e2d23;
        --highlight: #c5a173;
        --accent-rgb: 140, 122, 109;
        --text-rgb: 62, 45, 35;
        --highlight-rgb: 197, 161, 115;
    }
    
    /* Header */
    .fixed-header {
        position: fixed;
        top: 0; left: 0;
        width: 100%; height: 60px;
        background-color: #7b6038;
        color: #dfdddd;
        font-family: "Cinzel", serif;
        font-size: 32px;
        text-align: center;
        line-height: 60px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        z-index: 1000;
    }
    
    .header-content {
        position: relative;
        letter-spacing: 2px;
        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
    }
    
    /* Barra das categorias */
    .fixed-categories {
        position: fixed;
        top: 60px; left: 0; right: 0;
        height: 50px;
        background: linear-gradient(to bottom, rgba(var(--accent-rgb), 0.9) 60%, rgba(var(--accent-rgb), 0.7));
        z-index: 999;
        backdrop-filter: blur(3px);
    }
    
    .category-label {
        position: absolute;
        top: 8px;
        transform: translateX(-50%);
        font-family: "Cinzel", serif;
        font-size: 18px;
        color: #ffffff;
        text-shadow: 1px 1px 2px rgba(var(--text-rgb), 0.5);
        cursor: default; 
        transition: all 0.3s ease;
        padding: 4px 12px;
        border-radius: 20px;
        background: rgba(255,255,255,0.1);
        border: 1px solid rgba(255,255,255,0.3);
    }
    
    .category-label:hover {
        transform: translateY(-2px) scale(1.05) translateX(-50%);
        background: rgba(255,255,255,0.2);
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    }
    
    .category-label:hover .tooltip {
        visibility: visible;
        opacity: 1;
    }
    
    /* tooltip das categorias */ 
    .tooltip {
        visibility: hidden;
        background-color: #333;
        color: #fff;
        text-align: center;
        border-radius: 6px;
        padding: 5px;
        position: absolute;
        top: 125%; 
        left: 50%;
        transform: translateX(-50%);
        z-index: 1;
        width: max-content;
        max-width: 200px;
        opacity: 0;
        transition: opacity 0.3s;
        font-size: 0.85em;
        white-space: normal;
    }


    .tooltip::after {
        content: "";
        position: absolute;
        top: 0; 
        left: 50%;
        transform: translate(-50%, -100%); 
        border-width: 6px;
        border-style: solid;
        border-color: transparent transparent #333 transparent; 
    }
    
    .container {
        margin-top: 50px;
        padding: 0;
    }
    
    svg#timeline {
        width: 100%;
        height: 4000px; /* tamanho da timeline */
        display: block;
    }

</style>    