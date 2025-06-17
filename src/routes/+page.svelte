<svelte:head>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>History of Philosophy</title>
</svelte:head>

<script>
  import { afterUpdate, onMount } from 'svelte';
  import InterestsPlot from './home/plots/interestsPlot.svelte';
  import ErasPlot from './home/plots/erasPlot.svelte';

  function makepage(){
    window.scrollTo({ top: 0, behavior: 'instant' });
    (function () {
      const container = document.querySelector('.container');
      const newText = document.querySelector('.second-page');
      const viewportHeight = window.innerHeight;

      window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        // Fade‐out container over first viewport
        const fadeOutRatio = Math.min(scrollY / viewportHeight, 1);
        container.style.opacity = String(1 - fadeOutRatio);

        // Fade‐in newText starting halfway down
        const fadeInStart = viewportHeight * 0.5;
        const fadeInRange = viewportHeight * 0.5;
        const fadeInRatio = Math.max(0, Math.min((scrollY - fadeInStart) / fadeInRange, 1));
        newText.style.opacity = String(fadeInRatio);
      });
    })();
  }

  function scrollClick(){
    window.scrollTo({
      top: document.querySelector('.second-page').offsetTop,
      behavior: 'smooth'
    });
  }

  onMount(() => {
    makepage();
  });
  
  afterUpdate(() => {
    makepage();
  }); 
</script>

<body>
  <div class="container">
    <nav>
      <div class="nav-right">
          <!-- BUTTONS -->
          <ul>
            <li><a href="./contacts">Contact Us</a></li>
          </ul>

          <button class="btn" onclick="javascript:window.open('https://github.com/FGV-VIS-2025/final-project-history-of-philosophy', '_blank');">
            <svg height="32" aria-hidden="true" viewBox="0 0 24 24" version="1.1" width="32" data-view-component="true" class="octicon octicon-mark-github v-align-middle">
            <path fill="white" d="M12 1C5.9225 1 1 5.9225 1 12C1 16.8675 4.14875 20.9787 8.52125 22.4362C9.07125 22.5325 9.2775 22.2025 9.2775 21.9137C9.2775 21.6525 9.26375 20.7862 9.26375 19.865C6.5 20.3737 5.785 19.1912 5.565 18.5725C5.44125 18.2562 4.905 17.28 4.4375 17.0187C4.0525 16.8125 3.5025 16.3037 4.42375 16.29C5.29 16.2762 5.90875 17.0875 6.115 17.4175C7.105 19.0812 8.68625 18.6137 9.31875 18.325C9.415 17.61 9.70375 17.1287 10.02 16.8537C7.5725 16.5787 5.015 15.63 5.015 11.4225C5.015 10.2262 5.44125 9.23625 6.1425 8.46625C6.0325 8.19125 5.6475 7.06375 6.2525 5.55125C6.2525 5.55125 7.17375 5.2625 9.2775 6.67875C10.1575 6.43125 11.0925 6.3075 12.0275 6.3075C12.9625 6.3075 13.8975 6.43125 14.7775 6.67875C16.8813 5.24875 17.8025 5.55125 17.8025 5.55125C18.4075 7.06375 18.0225 8.19125 17.9125 8.46625C18.6138 9.23625 19.04 10.2125 19.04 11.4225C19.04 15.6437 16.4688 16.5787 14.0213 16.8537C14.42 17.1975 14.7638 17.8575 14.7638 18.8887C14.7638 20.36 14.75 21.5425 14.75 21.9137C14.75 22.2025 14.9563 22.5462 15.5063 22.4362C19.8513 20.9787 23 16.8537 23 12C23 5.9225 18.0775 1 12 1Z"></path>
            </svg>
            GitHub
          </button>
      </div>
    </nav>

    <div class="content">
      <h1>The History of<br />Philosophy</h1>

      <div class="subtitle">
        <p>Wisdom begins in wonder.</p>
        </div>
    </div>

    <div class="scroll-indicator" on:click ={scrollClick}>
      <div class="arrows">
        <svg class="arrow-icon" viewBox="0 0 24 24" fill="none">
          <path d="M6 9l6 6 6-6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="text">Scroll Down</div>
    </div>
  </div>

  <!-- SECOND PAGE -->
  <div class="second-page">
    <div class="above">
      <div class="text-column">
        <p>
          <b>Philosophy</b> is humanity's longest conversation. It's the discipline that dares to ask the questions that have no easy answers:
            What does it mean to live a <b>good life</b>? How do we <b>know</b> what we know? What is <b>justice</b>? What is <b>reality</b> itself? For over two
            and a half millennia, brilliant minds have grappled with these eternal questions, each building upon, challenging, or
              revolutionizing the thoughts of those who came before.
        </p>
        <p>
          This timeline traces that remarkable intellectual journey. Philosophy isn't just ancient
            history — it's a <b>living tradition</b> that speaks directly to our modern challenges, offering wisdom for resilience, meaning-making,
              and navigating complex ethical questions.
        </p>

        <p>
            As you explore this timeline, you're not just learning about ideas from the past.
            You're encountering a vibrant community of thinkers separated by centuries but united by their
              commitment to understanding the deepest questions of human existence. Welcome to philosophy's grand
              conversation — <b>your</b> voice belongs here too.
        </p>
      </div>

      <!-- BUTTONS TIMELINE/TUTORIAL -->
      <div class="buttons-column">
        <button class="btn second-page-btn" onclick="location.href='./timeline'">
            <img src="images/timeline_icon.png" alt="Timeline Icon" /> Philosophers' Timeline
          </button>

        <button id="tutorial-btn" class="btn second-page-btn" onclick="location.href='./tutorial'">
          <img src="images/tutorial_icon.png" alt="Tutorial Icon" /> Tutorial
        </button>
      </div>
    </div>

    <div class="below">
        <p><strong>Some statistics of our timeline:</strong></p>
        <div class="plots">
          <!-- BARPLOT -->
          <div class="plot">
              <h1>Occurrence of philosophical interests</h1>
              <InterestsPlot/>
          </div>

          <!-- METADATA -->
          <div class="record">
            <div class="record-box">
              <span class="record-title">64</span>
              <span class="record-label">philosophers</span>
            </div>
            <div class="record-box">
              <span class="record-title">33</span>
              <span class="record-label">historical events</span>
            </div>
          </div> 

          <!-- BARPLOT -->
          <div class="plot">
            <h1>Number of Philosophers per Historical Period</h1>
            <ErasPlot/>
          </div>
        </div>
    </div>
  </div>
</body>

<!-- CSS -->
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400..900&family=EB+Garamond:ital,wght@0,400..800;1,400..800&family=Poppins:wght@400;600&display=swap');
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body {
    font-family: 'EB Garamond', serif;
    overflow-x: hidden;
  }

  #tutorial-btn{                     
    position:relative;
    overflow: visible;
  }

  #tutorial-btn::before{          /* use ::before, not ::after   */
    content:'';
    position:absolute;
    width:40px;                   /* tweak size if you like      */
    height:40px;
    bottom:-0.6rem;                   /* lower-right corner           */
    right:-0.8rem;
    background:url('/images/click_icon.png') no-repeat center/contain;
    pointer-events:none;          /* clicks go through to button */
    z-index:3;                    /* above button surface        */
    animation:pulse 3s ease-in-out infinite;
  }

  @keyframes pulse{
    0%,100%{ transform:translate(50%,50%) scale(1); }
    50%   { transform:translate(50%,50%) scale(1.25); }
  }

  p {
    margin: 0 auto 1rem;      
    padding: 0;
    max-width: 800px;         
    font-size: 1.125rem;
    line-height: 1.6;
    color: #333;
    font-style: italic;       
    text-align: center;      
  }
  .container {
    position: relative;
    width: 100%;
    min-height: 100vh;
    background: 
      linear-gradient(rgba(45,26,15,0.75), rgba(122,74,40,0.75)),
      url(/images/background.png) center/cover no-repeat fixed;
    padding: 2rem 5%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    color: #fff;
    opacity: 1;
    transition: opacity 0.6s ease-out;
  }
  .container::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 0;
  }

  nav {
    position: relative;
    z-index: 2;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 1rem 0;
  }

  .nav-right {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  nav ul {
    list-style: none;
    display: flex;
    gap: 1rem;
    z-index: 2;
  }

  nav ul li a {
    color: #fff;
    text-decoration: none;
    font-family: 'Poppins', sans-serif;
    font-weight: 500;
    position: relative;
    padding-bottom: 0.2rem;
    transition: color 0.3s ease;
  }

  nav ul li a::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: #D4AF37;
    transition: width 0.3s ease;
  }

  nav ul li a:hover {
    color: #D4AF37;
  }

  nav ul li a:hover::after {
    width: 100%;
  }

  .btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: linear-gradient(45deg, #8B4513, #BA6F3D);
    box-shadow: 0 6px 12px rgba(90, 45, 10, 0.7);
    color: #fff;
    font-family: 'Poppins', sans-serif;
    font-weight: 600;
    border: none;
    border-radius: 30px;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
    z-index: 2;
  }
  .btn img {
    width: 22px;
    transition: transform 0.3s ease;
  }
  .btn:hover {
    background: linear-gradient(45deg, #6b3f16, #a05a2b);
    box-shadow: 0 8px 16px rgba(107, 63, 22, 0.6);
    transform: translateY(-2px);
  }
  .btn:hover img {
    transform: scale(1.1);
  }

  /* Move title higher */
  .content {
    position: relative;
    z-index: 2;
    max-width: 620px;
    margin-top: 6rem;
    opacity: 1;
    transform: translateY(0);
    animation: fadeIn 1s ease forwards 0.3s;
  }
  @keyframes fadeIn {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .content h1 {
    font-family: 'Cinzel', serif;
    font-size: 4.5rem;
    font-weight: 600;
    line-height: 1.1;
    color: #F0E6DC;
    text-shadow: 2px 2px 4px rgba(58, 54, 51, 0.5);
    margin-bottom: 2rem;
    letter-spacing: 1px;
    position: relative;
  }
  .content h1::after {
    content: '';
    position: absolute;
    bottom: -1rem;
    left: 0;
    width: 70%;
    height: 3px;
    background: linear-gradient(90deg, #D4AF37, transparent);
  }
  .content p {
    font-size: 1.25rem;
    line-height: 1.8;
    color: #FFF5EE;
    margin-bottom: 3rem;
    max-width: 580px;
    font-style: italic;
  }
  .second-page-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    background: linear-gradient(45deg, #c16a2a, #7f4b1c);
    padding: 1rem 2rem;
    border-radius: 40px;
    font-size: 1.1rem;
    font-family: 'Cinzel', serif;
    box-shadow: 0 6px 12px rgba(193, 106, 42, 0.5);
    position: relative;
    overflow: hidden;
    text-align: center;
  }

  .subtitle {
    text-align: left;
    margin-top: 1rem;
    font-size: 1.2rem;
    color: #D4AF37;
  }

  .subtitle p {
    text-align: left;
    margin: 0 auto 1rem;
    padding: 0;
    max-width: 800px;
    font-size: 1.2rem;
    line-height: 1.6;
    color: white;
    font-style: italic;
  }
  .second-page-btn img {
    width: 28px;
    filter: drop-shadow(0 0 2px rgba(0,0,0,0.3));
  }

  .second-page {
    display: flex; 
    flex-direction: column; 
    justify-content: space-between;
    height: 100vh; 
    overflow: hidden;
  }

  .second-page-btn::after {
    content: '';
    position: absolute;
    top: -30%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg,
      transparent 20%,
      rgba(255,255,255,0.1) 50%,
      transparent 80%);
    animation: shine 5s infinite;
  }
  @keyframes shine {
    0% { transform: translateX(-100%) rotate(45deg); }
    100% { transform: translateX(100%) rotate(45deg); }
  }

  .scroll-indicator {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 2;
    cursor: pointer;
  }
  .arrows {
    display: flex;
    flex-direction: column;
    align-items: center;
    animation: arrow-bounce 2s infinite ease-in-out;
  }
  @keyframes arrow-bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(8px);
    }
  }
  .arrow-icon {
    margin: 1px 0;
    width: 60px;
    height: 60px;
  }
  .text {
    margin-top: 8px;
    font-family: 'Poppins', sans-serif;
    font-size: 1rem;
    font-weight: 400;
    color: white;
  }

  .second-page {
    opacity: 0;
    padding: 4rem 5%;
    min-height: 100vh;
    background: #f5f5f5;
    color: #333;
    font-family: 'Poppins', sans-serif;
    transition: opacity 0.6s ease-out;
  }

  @media (max-width: 768px) {
    .content h1 {
      font-size: 2.8rem;
      line-height: 1.2;
    }
    .content h1::after {
      left: 50%;
      transform: translateX(-50%);
    }
    .btn {
      margin: 0 auto;
    }
    .arrow-icon {
      margin: 0.5px 0;
      width: 60px;
      height: 60px;
    }
  }

  @media (max-width: 480px) {
    .content h1 {
      font-size: 2.2rem;
    }
    .content p {
      font-size: 1rem;
    }
    .second-page-btn {
      padding: 0.8rem 1.5rem;
      font-size: 1rem;
    }
    .scroll-indicator {
      bottom: 15px;
    }
    .arrow-icon {
      margin: 0.5px 0;
      width: 40px;
      height: 40px;
    }
    .text {
      font-size: 0.8rem;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    * {
      animation: none !important;
      transition: none !important;
    }
  }

  .below {
    flex: 1;
    padding: 0rem;
    display: flex;
    flex-direction: column;
    justify-content: center; 
    background-color: #f3f3f3; 
  }

  .below p {
    font-size: 1.2em;
    font-style: normal;
    color: black;
    font-weight: 700;
  }

  .above {
    display: flex;
    justify-content: space-between; 
    align-items: center;            
    gap: 2rem;
    padding: 1rem;
  }

  .above p {
    font-size: 0.8rem;          
  }

  .buttons-column {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-end; 
    gap: 1rem;
  }

  .record {
    display: flex;
    gap: 2rem;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .record-box {
    background-color: #ffffff;
    border: 2px solid #ccc;
    border-radius: 5px;
    padding: 1rem 1rem;
    text-align: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    width: 160px;
    transition: transform 0.2s ease;
  }

  .record-title {
    display: block;
    font-size: 1rem;
    font-weight: bold;
    color: #333;
  }

  .record-label {
    display: block;
    font-size: 1rem;
    color: #777;
    margin-top: 0.5rem;
  }

  .plots {
    display: flex;
    justify-content: space-between; 
    align-items: center;  
    gap: 2rem; 
    padding: 1rem;
  }

  .plot {
    flex: 1 1 45%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #fafafa;
    padding: 0.5rem;
    border-radius: 16px;
    border: 2px solid #ccc;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .plot h1 {
    text-align: center;
    font-family: 'Cinzel', serif;
    font-size: 1rem;
    color: #3e2b23;
    border-bottom: 2px solid #e0e0e0;
    padding-bottom: 0.5rem;
    width: 100%;
  }
</style>
