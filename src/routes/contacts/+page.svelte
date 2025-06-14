<script>
    import './contacts.css';
    import people from '../../components/data/people.json';
    import {base} from '$app/paths';
</script>

<div class="page">
    <div class="fixed-header"> 
        <a href="{base}/" class="home-icon" aria-label="Back to Home">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
        </a>

        <div class="title">
            <h1>Who are we?</h1>
        </div>
    </div>

    <div class="content">
        <div class="people">
            {#each people as person}
            <div class="person-card">
                <h2>{person.name}</h2>
                <div class="sub-infos">
                    <img src={person.img} alt={person.alt}>
                    <div>
                        <p><strong>Age:</strong> {person.age} years old</p>
                        <p><strong>GitHub:</strong> <a href={person.github} target="_blank" rel="noopener noreferrer">link</a></p>
                        <p><strong>Linkedin:</strong> <a href={person.linkedin} target="_blank" rel="noopener noreferrer">link</a></p>
                    </div>
                </div>
            </div>
            {/each}
        </div>
    </div>

    <div class="paragraph">
        <p>Hello! It’s a pleasure to meet you! We are Data Science students, and this project was developed as part of our Data Visualization course, taken in 2025.1.  
        Take a look above to learn more about us!</p>
    </div>
</div>
