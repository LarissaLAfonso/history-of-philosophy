<script>
  export let philosopher;

  function renderNode(node) {
    switch (node.type) {
      case 'h1':
        return `<h1>${node.value}</h1>`;
      case 'h3':
        return `<h3>${node.value}</h3>`;
      case 'lifetime':
        return `<p class=\"lifetime\">${node.value}</p>`;
      case 'figure':
        return `<img src=\"${node.value}\" alt=\"${philosopher.value[0].value}\" />`;
      case 'p':
        return `<div>${node.value.map(n => n.value).join('')}</div>`;
      default:
        return '';
    }
  }
</script>

<div class="container">
  <div class="image">
    {#if philosopher.value.find(n => n.type === 'figure') as fig}
      <img src={fig.value} alt="Philosopher portrait" />
    {/if}
  </div>
  <div class="content">
    {#each philosopher.value as node}
      {@html renderNode(node)}
    {/each}
  </div>
</div>

<style>
  .container {
    display: flex;
    height: 100%;
    width: 100%;
  }
  .image {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }
  .image img {
    max-width: 100%;
    height: auto;
    object-fit: contain;
  }
  .content {
    flex: 2;
    padding: 2rem;
    overflow-y: auto;
  }
  h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }
  h3 {
    font-size: 1.75rem;
    margin: 0;
    margin-bottom: 1rem;
    font-style: italic;
  }
  .lifetime {
    font-weight: bold;
    margin-bottom: 1rem;
  }
  .branch {
    text-transform: uppercase;
    color: #777;
    margin-bottom: 1rem;
  }
  .content div {
    margin-bottom: 1rem;
    line-height: 1.6;
  }
  @media (max-width: 768px) {
    .container {
      flex-direction: column;
    }
    .image,
    .content {
      width: 100%;
      flex: none;
    }
    .content {
      padding: 1rem;
    }
  }
</style>
