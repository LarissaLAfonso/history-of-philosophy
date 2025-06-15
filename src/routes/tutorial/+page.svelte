<script>
  import './tutorial.css';
  import { base } from '$app/paths';
  import explanations from '../../components/data/tutorial_explanations.json';

  let currentSlide = 0;

  const nextSlide = () => {
    currentSlide = (currentSlide + 1) % explanations.length;
  };

  const prevSlide = () => {
    currentSlide = (currentSlide - 1 + explanations.length) % explanations.length;
  };
</script>

<div class="page">
  <div class="fixed-header"> 
    <a href="{base}/" class="home-icon" aria-label="Back to Home">
      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 24 24">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
      </svg>
    </a>

    <div class="title">
      <h1>Tutorial</h1>
    </div>
  </div>

  <div class="full-explanation-slider">

    <!-- SLIDES -->
    <div class="slider-window">
      {#each explanations as exp, i}
        <div class="content-slide {i === currentSlide ? 'active' : ''}">
          <!-- Coluna da Imagem -->
          <div class="slide-image">
            <img src={exp.gif} alt="explicação visual" />
          </div>

          <!-- Coluna do Título + Texto -->
          <div class="slide-text">
            <h2 class="slide-title">{exp.title}</h2>
            <div class="text-explanation">
              {exp.text}
            </div>
          </div>
        </div>
      {/each}
    </div>

    <div class="slider-footer">
      <!-- DOTS -->
      <div class="slider-dots">
        {#each explanations as exp, i}
          <div
            class="dot {i === currentSlide ? 'active' : ''}"
            title={exp.title}
            on:click={() => currentSlide = i}>
          </div>
        {/each}
      </div>

      <!-- CONTROLS -->
      <div class="slider-controls">
        <button on:click={prevSlide}>&lt;</button>
        <span>{currentSlide + 1} / {explanations.length}</span>
        <button on:click={nextSlide}>&gt;</button>
      </div>
    </div>
  </div>
</div>
