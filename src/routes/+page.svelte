<svelte:head>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>History of Philosophy</title>
</svelte:head>
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

  p {
  margin: 0 auto 1rem;       /* center block with bottom spacing */
  padding: 0;
  max-width: 800px;          /* restrict width for large side margins */
  font-size: 1.125rem;
  line-height: 1.6;
  color: #333;
  font-style: italic;        /* italic text */
  text-align: center;        /* center text inside */
  }
  :global(body){
    background:#2d1a0f; 
  }

  /* Full‐viewport container with background image */
  .container {
    position: relative;
    width: 100%;
    min-height: 100vh;
    background: 
      linear-gradient(rgba(45,26,15,0.75), rgba(122,74,40,0.75)),
      url(background.png) center/cover no-repeat fixed;
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
  .timeline-btn {
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

  .fade-line {
  margin: 2rem auto;                        /* space above/below, centered */
  width: 40%;                                /* adjust length as needed */
  height: 3px;                               /* thickness of the line */
  background: 
      linear-gradient(
      to right,
      transparent 0%,
      #D4AF37 50%,
      transparent 100%
      );
  }



  .subtitle {
  text-align: left;
  margin-top: 1rem;
  font-size: 1.2rem;
  color: #D4AF37;
  }

  /* Override the global centered <p> for subtitles */
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


  .timeline-btn img {
    width: 28px;
    filter: drop-shadow(0 0 2px rgba(0,0,0,0.3));
  }
  .new-text .timeline-btn {
  margin-top: 2rem;
  }

  .timeline-btn::after {
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

  /* Scroll‐down indicator */
  .scroll-indicator {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 2;
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
    /* Reduced margin so arrows sit closer */
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

  .new-text {
    opacity: 0;
    padding: 4rem 5%;
    min-height: 100vh;
    background: #f5f5f5;
    color: #333;
    font-family: 'Poppins', sans-serif;
    font-size: 1.25rem;
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
    .timeline-btn {
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
</style>

<body>
  <div class="container">
    <nav>
      <div class="nav-right">
        <ul>
          <li><a href="https://github.com/FGV-VIS-2025/final-project-history-of-philosophy" target="_blank">Contact Us</a></li>
        </ul>
        <button class="btn">
          <img src="images/home.png" alt="Home Icon" /> Home
        </button>
      </div>
    </nav>

    <div class="content">
      <h1>The History of<br />Philosophy</h1>

      <div class="subtitle">
        <p>Wisdom begins in wonder.</p>
        </div>
    </div>

    <div class="scroll-indicator">
      <div class="arrows">
        <svg class="arrow-icon" viewBox="0 0 24 24" fill="none">
          <path d="M6 9l6 6 6-6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="text">Scroll Down</div>
    </div>
  </div>

  <div class="new-text">
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
    
    <div class="fade-line"></div>

    <button class="btn timeline-btn" onclick="location.href='./timeline'">
        <img src="images/timeline_icon.png" alt="Timeline Icon" /> Philosophers' Timeline
      </button>
  </div>

</body>

  <script>
    import { afterUpdate, onMount } from 'svelte';
    function makepage(){
      (function () {
        const container = document.querySelector('.container');
        const newText = document.querySelector('.new-text');
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
    onMount(() => {
      makepage();
    });
    afterUpdate(() => {
      makepage();
    }); 
  </script>