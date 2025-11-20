// Small JS to reveal elements and add interactive tilt
(function(){
    // Reveal on scroll with stagger
    const items = Array.from(document.querySelectorAll('.reveal-item'));
    if(items.length){
        const io = new IntersectionObserver((entries, obs)=>{
            entries.forEach(entry=>{
                if(entry.isIntersecting){
                    const el = entry.target;
                    // add small stagger depending on index
                    const i = items.indexOf(el);
                    el.style.transitionDelay = (i * 70) + 'ms';
                    el.classList.add('revealed');
                    obs.unobserve(el);
                }
            })
        },{threshold:0.12});
        items.forEach(it=>io.observe(it));
    }

    // subtle tilt on pointer move for cards
    document.querySelectorAll('.ebook-card').forEach(card=>{
        card.addEventListener('pointermove', (e)=>{
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            const rx = -y * 6; // rotateX
            const ry = x * 8;  // rotateY
            card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px) scale(1.02)`;
        });
        card.addEventListener('pointerleave', ()=>{
            card.style.transform = '';
        });
    });

    // add floating class to profile image after DOM ready
    const p = document.querySelector('.profile-image');
    if(p){
        // small delayed start so it doesn't feel immediate
        setTimeout(()=>p.classList.add('floating'), 800);
    }

    // Theme toggle logic
    const THEME_KEY = 'site-theme';
    const body = document.body;
    function applyTheme(t){
        if(t === 'light'){
            body.classList.add('light-theme');
        } else {
            body.classList.remove('light-theme');
        }
    }

    // initialize from localStorage (or prefers-color-scheme)
    const saved = localStorage.getItem(THEME_KEY);
    if(saved){
        applyTheme(saved);
    } else {
        const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
        applyTheme(prefersLight ? 'light' : 'dark');
    }

    // wire up toggle button if present
    const toggle = document.getElementById('theme-toggle');
    if(toggle){
        function updateToggleLabel(){
            toggle.textContent = body.classList.contains('light-theme') ? '🌙 Dark' : '☀️ Light';
        }
        toggle.addEventListener('click', ()=>{
            const isLight = body.classList.toggle('light-theme');
            localStorage.setItem(THEME_KEY, isLight ? 'light' : 'dark');
            updateToggleLabel();
        });
        updateToggleLabel();
    }
})();
