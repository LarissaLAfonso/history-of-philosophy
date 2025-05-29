<html lang="en">
<div class="container">
    <nav>
        <!--
        <img src="/images/fgv.png" class="logo" alt="Logo FGV">
        -->
        <div class="nav-right">
            <ul>
                <li><a href="#">Contact Us</a></li>
            </ul>
            <button class="btn">
                <img src="/images/home.png" alt="Home Icon"> Home
            </button>
        </div>
    </nav>

    <div class="content">
        <h1>The History of<br>Philosophy</h1>
        <p><em>Wisdom begins in wonder.</em></p>
        
        <!--Botão para ir para a timeline-->
        <button class="btn timeline-btn" onclick="location.href='/timeline'">
            <img src="/images/timeline_icon.png" alt="Timeline Icon">Philosophers' Timeline
        </button>
    </div>
</div>
</html>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400..900&family=EB+Garamond:ital,wght@0,400..800;1,400..800&family=Poppins:wght@400;600&display=swap');
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }


    :global(body) {
        margin: 0;
        height: 100%;
        overflow: hidden;
        background-image:
            linear-gradient(rgba(45,26,15,0.75), rgba(122,74,40,0.75)),
            url(../images/background.avif);
        background-size: cover;
        background-attachment: fixed;
        background-position: center;
        font-family: 'EB Garamond', serif;
        }

    /* Container Principal */
    .container {
        width: 100%;
        min-height: 100vh;
        background-image: linear-gradient(rgba(45, 26, 15, 0.75), rgba(122, 74, 40, 0.75)), url(../images/background.avif);
        background-size: cover;
        background-attachment: fixed;
        background-position: center;
        padding: 2rem 5%;
        position: relative;
        overflow: hidden;
    }

    .container::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.3);
        z-index: 0;
    }

    /* Navegação */
    nav {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem 0;
        position: relative;
        z-index: 2;
    }

    .logo {
        width: 160px;
        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
        transition: transform 0.3s ease;
    }

    .logo:hover {
        transform: scale(1.05);
    }

    .nav-right {
        display: flex;
        align-items: center;
        gap: 1.5rem;
    }

    nav ul {
        list-style: none;
        text-align: right;
        padding-right: 0;
        margin: 0;
    }

    nav ul li {
        display: inline-block;
        margin: 0 0.5rem;
        position: relative;
    }

    nav ul li a {
        color: #fff;
        text-decoration: none;
        font-family: 'Poppins', sans-serif;
        font-weight: 500;
        padding: 0.5rem 0;
        position: relative;
        transition: color 0.3s ease;
    }

    nav ul li a::after {
        content: '';
        position: absolute;
        bottom: -5px;
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


    /* Botões */
    .btn {
        background: linear-gradient(45deg, #8B4513, #BA6F3D);
        box-shadow: 0 6px 12px rgba(90, 45, 10, 0.7);
        color: #fff;
        font-family: 'Poppins', sans-serif;
        font-weight: 600;
        border-radius: 30px;
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
        border: none;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        position: relative;
        overflow: hidden;
        z-index: 1;
    }

    .btn img {
        width: 22px;
        margin-right: 0.75rem;
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

    /* Conteúdo Principal */
    .content {
        margin-top: 10%;
        color: #fff;
        max-width: 620px;
        position: relative;
        z-index: 2;
        opacity: 0;
        transform: translateY(30px);
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
        position: relative;
        letter-spacing: 1px;
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

    /* Botão da Timeline */
    .timeline-btn {
        background: linear-gradient(45deg, #c16a2a, #7f4b1c);
        padding: 1rem 2rem;
        border-radius: 40px;
        font-size: 1.1rem;
        font-family: 'Cinzel', serif;
        box-shadow: 0 6px 12px rgba(193, 106, 42, 0.5);
    }

    .timeline-btn img {
        width: 28px;
        filter: drop-shadow(0 0 2px rgba(0,0,0,0.3));
    }

    .timeline-btn::after {
        content: '';
        position: absolute;
        top: -50%;
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

    /* Responsividade */
    @media (max-width: 1200px) {
        .content h1 {
            font-size: 3.5rem;
        }
    }

    @media (max-width: 768px) {
        .container {
            padding: 1.5rem;
        }

        nav {
            flex-wrap: wrap;
            gap: 1rem;
        }

        nav ul {
            padding-right: 0;
            text-align: center;
            order: 3;
            width: 100%;
            margin-top: 1rem;
        }

        .content {
            margin-top: 5rem;
            text-align: center;
        }

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
    }

    /* Acessibilidade */
    @media (prefers-reduced-motion: reduce) {
        * {
            animation: none !important;
            transition: none !important;
        }
    }
</style>