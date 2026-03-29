// 1. Load Header & Footer FIRST
async function loadHeaderFooter() {
    try {
        // Load Header
        const headerResponse = await fetch('fragments/header.html');
        const headerHTML = await headerResponse.text();
        document.body.insertAdjacentHTML('afterbegin', headerHTML);

        // Load Footer
        const footerResponse = await fetch('fragments/footer.html');
        const footerHTML = await footerResponse.text();
        document.body.insertAdjacentHTML('beforeend', footerHTML);

        // NOW initialize everything AFTER elements exist
        await initAllScripts();

    } catch (error) {
        console.error('Failed to load header/footer:', error);
    }
}

// 2. ALL YOUR SCRIPTS - Only run AFTER header/footer loaded
async function initAllScripts() {
    // Navigation elements (now they exist!)
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const navItems = document.querySelectorAll(".nav-item");
    const desktopNav = document.getElementById('desktopNav');

    function toggleMobileMenu() {
        hamburgerBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        mobileMenuOverlay.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : 'auto';
    }

    if (hamburgerBtn) hamburgerBtn.onclick = toggleMobileMenu;
    if (mobileMenuOverlay) mobileMenuOverlay.onclick = toggleMobileMenu;
    if (mobileMenuClose) mobileMenuClose.onclick = toggleMobileMenu;

    // Close mobile menu when clicking nav links
    navItems.forEach(link => {
        link.onclick = () => {
            if (window.innerWidth <= 1024) {
                hamburgerBtn.classList.remove('active');
                mobileMenu.classList.remove('active');
                mobileMenuOverlay.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        };
    });

    // Back to top & scroll effects
    const btt = document.getElementById('backToTop');
    const sections = document.querySelectorAll("section");

    window.onscroll = () => {
        if (window.scrollY > 400) btt.style.display = "flex";
        else btt.style.display = "none";

        document.querySelectorAll(".reveal").forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight - 100) {
                el.classList.add("active");
            }
        });

        let current = "";
        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 120) {
                current = section.getAttribute("id");
            }
        });

        navItems.forEach((li) => {
            li.classList.remove("active-link");
            if (li.getAttribute("href") && li.getAttribute("href").includes(current)) {
                li.classList.add("active-link");
            }
        });
    };

    if (btt) btt.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    // Gallery modal functions
    window.openGallery = function(cat) {
        const galleryData = {
            'Birthday': [
                                'images/b1.jpg','images/b2.jpg','images/b3.jpg','images/b4.jpg','images/b5.jpg','images/b6.jpg'

            ],
            'Wedding': [
                                'images/w1.jpg','images/w2.jpg','images/w3.jpg','images/w4.jpg','images/w5.jpg','images/w6.jpg'

            ],
            'Special Occasion': [
                                'images/c7.jpg','images/c8.jpg','images/hero5.jpg','images/hh.jpg','images/h3.jpg','images/c5.jpg'

            ],
            'Corporate': [
                'images/c1.jpg','images/c2.jpg','images/c3.jpg','images/c4.jpg','images/a2.jpg','images/c6.jpg'
            ]
        };

        document.getElementById('modalTitle').innerText = cat + " Gallery";
        const grid = document.getElementById('modalGrid');
        grid.innerHTML = '';
        galleryData[cat].forEach(src => {
            const img = document.createElement('img');
            img.src = src;
            grid.appendChild(img);
        });
        document.getElementById('galleryModal').classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.closeGallery = function() {
        document.getElementById('galleryModal').classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    // Form handler
    window.handleForm = function(e) {
        e.preventDefault();
        document.getElementById('contact-form').style.display = 'none';
        document.getElementById('success-msg').style.display = 'block';
    };
    const currentPage = window.location.pathname.split("/").pop();

    document.querySelectorAll(".nav-item").forEach(link => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active-link");
        }
    });
}

// 3. Start everything when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadHeaderFooter);
} else {
    loadHeaderFooter();
}
