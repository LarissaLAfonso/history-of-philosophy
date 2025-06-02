<script>
  import { createEventDispatcher } from 'svelte';

  export let philosopher; // expects an object { type: "philosopher", value: [ ... ] }

  const dispatch = createEventDispatcher();

  function handleClose() {
    dispatch('close');
  }

  // Helper: dado um node.type, retorna o .value ou null
  function findNodeValue(type) {
    const node = philosopher.value.find((n) => n.type === type);
    return node ? node.value : null;
  }

  // Extrair valores individuais
  const name      = findNodeValue('h1');
  const lifetime  = findNodeValue('lifetime');
  const branch    = findNodeValue('branch');
  const subtitle  = findNodeValue('h3');
  const imageSrc  = findNodeValue('figure');

  // Cada nó de tipo "p" contém um array de { type:"text", value:"..." }. Unimos tudo
  const paragraphNodes = philosopher.value.filter((n) => n.type === 'p');
  const paragraphs = paragraphNodes.map((pNode) =>
    pNode.value.map((textNode) => textNode.value).join('')
  );
</script>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Marcellus&family=MedievalSharp&family=Cinzel:wght@600&family=Crimson+Text:wght@400;600&display=swap');

  .info-filosofos {
    text-align: center;
    box-sizing: border-box;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    position: fixed;
    top: 0;
    right: 0;
    width: 50%;
    height: 100vh;
    background: linear-gradient(135deg, #5c4c03, #1a1a2e);
    box-shadow:
      -5px 0 25px rgba(0, 0, 0, 0.4),
      0 0 50px rgba(255, 215, 0, 0.1) inset;
    overflow-y: auto;
    z-index: 1000;
    border-left: 3px solid #000000;
    padding: 20px;
  }

  .info-filosofos:hover {
    box-shadow:
      -5px 0 35px rgba(0, 0, 0, 0.6),
      0 0 60px rgba(255, 215, 0, 0.15) inset;
  }

  .close-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    background: linear-gradient(to bottom, #e74c3c, #c0392b);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 50px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .close-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
    background: linear-gradient(to bottom, #ff6b6b, #e74c3c);
  }

  .info-filosofos h1 {
    font-size: 2.5rem;
    margin-top: 20px;
    margin-bottom: 30px;
    color: #d3ac0f;
    text-shadow: 0 2px 4px rgba(0,0,0,0.4);
    border-bottom: 2px solid #b2972c;
    padding-bottom: 15px;
    font-weight: 700;
    letter-spacing: 1px;
  }

  .subtitle {
    font-family: "Cinzel", serif;
    font-size: 1.5rem;
    font-style: italic;
    color: #f0e6cc;
    margin-bottom: 15px;
  }

  .lifetime {
    color: #e9e7de;
    font-size: 1.1rem;
    font-style: italic;
    margin-bottom: 15px;
  }

  .branch {
    color: #e9e7de;
    font-size: 1.1rem;
    margin-bottom: 30px;
    text-transform: capitalize;
  }

  .sub-infos {
    display: flex;
    align-items: center;
    margin-bottom: 35px;
    gap: 30px;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    padding: 25px;
    transition: all 0.3s ease;
  }

  .sub-infos:hover {
    background: rgba(255, 255, 255, 0.12);
    transform: translateY(-3px);
  }

  .sub-infos img {
    width: 180px;
    height: 180px;
    object-fit: cover;
    border-radius: 50%;
    border: 4px solid #b2972c;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
  }

  .sub-infos img:hover {
    transform: scale(1.05);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4);
  }

  .sub-infos p {
    color: #e9e7de;
    margin: 12px 0;
    font-size: 1.1rem;
    padding: 10px 15px;
    background: rgba(52, 152, 219, 0.15);
    border-radius: 8px;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
  }

  .sub-infos p:hover {
    background: rgba(52, 152, 219, 0.25);
    transform: translateX(5px);
  }

  .sub-infos strong {
    color: #cba81c;
    min-width: 100px;
    display: inline-block;
    font-weight: 600;
  }

  .paragraphs p {
    color: #e9e7de;
    line-height: 1.8;
    font-size: 1.1rem;
    text-align: justify;
    position: relative;
    padding: 20px;
  }

  .info-filosofos::-webkit-scrollbar {
    width: 8px;
  }

  .info-filosofos::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }
</style>

<div class="info-filosofos">
  <button class="close-btn" on:click={handleClose}>× Close</button>

  {#if name}
    <h1>{name}</h1>
  {/if}

  {#if subtitle}
    <div class="subtitle">{subtitle}</div>
  {/if}

  {#if lifetime}
    <div class="lifetime">({lifetime})</div>
  {/if}

  {#if branch}
    <div class="branch">Branch: {branch}</div>
  {/if}

  {#if imageSrc || branch}
    <div class="sub-infos">
      {#if imageSrc}
        <img src={imageSrc} alt={name} />
      {/if}
      <!-- Aqui poderíamos adicionar mais detalhes compactos, 
           mas no JSON já temos nome/lifetime/branch exibidos acima. -->
    </div>
  {/if}

  {#if paragraphs.length}
    <div class="paragraphs">
      {#each paragraphs as paragraphHTML}
        <p>{@html paragraphHTML}</p>
      {/each}
    </div>
  {/if}
</div>
git