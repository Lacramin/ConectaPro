// public/js/app.js

// Todos los usuarios registrados (Fundadores + Nuevos)
const USERS = [
    'benjamin', 'jeremias', 'marcelo', 'julyan', 
    'maryon', 'sebastian', 'nicolas', 'rodrigo',
    'laura', 'carlos', 'ana', 'diego', 'valentina', 'camila'
];

// Categorías ampliadas
const CATEGORIES = [
    'Informática', 'Telecomunicaciones', 'Salud', 'Veterinaria', 
    'Derecho', 'Arquitectura', 'Contabilidad', 'Psicología', 
    'Kinesiología', 'Nutrición', 'Electricidad', 'Traducción'
];

const state = {
    posts: [], 
    searchQuery: '',
    activeFilters: new Set(),
    currentUser: null,
    currentView: 'home'
};

document.addEventListener('DOMContentLoaded', () => {
    const DOM = {
        views: document.querySelectorAll('.view'),
        authSection: document.getElementById('authSection'),
        offersContainer: document.getElementById('offersContainer'),
        servicesContainer: document.getElementById('servicesContainer'),
        filtersOffers: document.getElementById('filtersOffers'),
        filtersProfessionals: document.getElementById('filtersProfessionals'),
        loginForm: document.getElementById('loginForm'),
        loginError: document.getElementById('loginError'),
        modal: document.getElementById('postModal'),
        postForm: document.getElementById('postForm'),
        modalTitle: document.getElementById('modalTitle'),
        postType: document.getElementById('postType'),
        postCategory: document.getElementById('postCategory'),
        searchInput: document.getElementById('searchInput'), // Buscador
        btnPublishOffer: document.getElementById('btnPublishOffer'),
        btnOfferService: document.getElementById('btnOfferService'),
        btnCloseModal: document.getElementById('btnCloseModal')
    };

    async function init() {
        renderAuthUI();
        populateCategories();
        renderFilters();
        setupEventListeners();
        await fetchPostsFromAPI(); 
    }

    async function fetchPostsFromAPI() {
        try {
            const response = await fetch('/api/posts'); 
            const data = await response.json();
            state.posts = data; 
            renderData(); 
        } catch (error) {
            console.error("Error al cargar los datos:", error);
            DOM.offersContainer.innerHTML = '<p class="error-msg">Error al conectar con el servidor.</p>';
            DOM.servicesContainer.innerHTML = '<p class="error-msg">Error al conectar con el servidor.</p>';
        }
    }

    function navigateTo(route) {
        state.currentView = route;
        
        DOM.views.forEach(view => {
            view.classList.remove('active');
            void view.offsetWidth; 
            if (view.id === `view-${route}`) {
                view.classList.add('active');
            }
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.toggle('active-link', link.dataset.route === route);
        });

        state.activeFilters.clear();
        state.searchQuery = ''; // Limpiar búsqueda al cambiar de página
        DOM.searchInput.value = '';
        
        renderFilters();
        renderData();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function renderAuthUI() {
        if (state.currentUser) {
            DOM.authSection.innerHTML = `
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <span style="font-size: 0.9rem; color: var(--text-muted);">@${state.currentUser}</span>
                    <button id="btnLogout" class="btn btn-glass" style="padding: 0.4rem 1rem; font-size: 0.8rem;">Salir</button>
                </div>
            `;
            document.getElementById('btnLogout').addEventListener('click', logout);
            
            DOM.btnPublishOffer.style.display = 'inline-flex';
            DOM.btnOfferService.style.display = 'inline-flex';
        } else {
            DOM.authSection.innerHTML = `<button class="btn btn-primary" data-route="login">Acceso Interno</button>`;
            DOM.btnPublishOffer.style.display = 'none';
            DOM.btnOfferService.style.display = 'none';
        }
    }

    function handleLogin(e) {
        e.preventDefault();
        const username = document.getElementById('username').value.trim().toLowerCase();
        
        if (USERS.includes(username)) {
            state.currentUser = username;
            DOM.loginError.style.display = 'none';
            DOM.loginForm.reset();
            renderAuthUI();
            navigateTo('home');
        } else {
            DOM.loginError.style.display = 'block';
        }
    }

    function logout() {
        state.currentUser = null;
        renderAuthUI();
        navigateTo('home');
    }

    function renderData() {
        // Doble filtro: Categorías + Texto (Buscador)
        const filtered = state.posts.filter(post => {
            const matchCategory = state.activeFilters.size === 0 || state.activeFilters.has(post.category);
            
            const searchLower = state.searchQuery.toLowerCase();
            const matchSearch = post.title.toLowerCase().includes(searchLower) || 
                                post.description.toLowerCase().includes(searchLower) ||
                                post.category.toLowerCase().includes(searchLower) ||
                                post.user.toLowerCase().includes(searchLower);

            return matchCategory && matchSearch;
        });

        if (state.currentView === 'offers') {
            const offers = filtered.filter(p => p.type === 'offer');
            DOM.offersContainer.innerHTML = offers.length ? offers.map(generateCard).join('') : '<p class="text-muted">No hay vacantes que coincidan con tu búsqueda.</p>';
        } else if (state.currentView === 'professionals') {
            const services = filtered.filter(p => p.type === 'service');
            DOM.servicesContainer.innerHTML = services.length ? services.map(generateCard).join('') : '<p class="text-muted">No hay perfiles que coincidan con tu búsqueda.</p>';
        }
    }

    function generateCard(post) {
        const date = new Date(post.date).toLocaleDateString('es-CL');
        
        // Formatear precio: Si existe, formato $CLP, si no, "Conversable"
        const priceText = post.price ? `$${post.price.toLocaleString('es-CL')}` : 'Conversable';
        
        // Generar Estrellas (Lógica visual simple de 1 a 5)
        const rating = post.rating || 5; // Por defecto 5 si no tiene
        const starsHTML = '★'.repeat(rating) + '☆'.repeat(5 - rating);

        return `
            <article class="glass-card card">
                <div class="card-header">
                    <span class="badge">${post.category}</span>
                    <span class="price-tag">${priceText}</span>
                </div>
                
                <h3 class="card-title">${post.title}</h3>
                <p class="card-desc">${post.description}</p>
                
                <div class="card-rating">
                    ${starsHTML} <span class="rating-number">(${rating}.0)</span>
                </div>

                <div class="card-footer">
                    <span style="color: var(--text-main); font-weight: 500;">@${post.user}</span>
                    <span>${date}</span>
                </div>
                
                <button class="btn btn-primary btn-block" onclick="alert('Iniciando chat seguro con @${post.user}...')">Contactar</button>
            </article>
        `;
    }

    function renderFilters() {
        const createTags = () => CATEGORIES.map(cat => 
            `<button class="filter-tag ${state.activeFilters.has(cat) ? 'active' : ''}" data-cat="${cat}">${cat}</button>`
        ).join('');

        DOM.filtersOffers.innerHTML = createTags();
        DOM.filtersProfessionals.innerHTML = createTags();
    }

    function populateCategories() {
        DOM.postCategory.innerHTML = CATEGORIES.map(c => `<option value="${c}">${c}</option>`).join('');
    }

    function openModal(type) {
        DOM.postType.value = type;
        DOM.modalTitle.textContent = type === 'offer' ? 'Nueva Oferta' : 'Nuevo Servicio';
        DOM.modal.showModal();
    }

    function setupEventListeners() {
        // BUSCADOR EN TIEMPO REAL
        DOM.searchInput.addEventListener('input', (e) => {
            state.searchQuery = e.target.value;
            renderData(); // Filtra instantáneamente mientras escribes
        });

        document.addEventListener('click', (e) => {
            const routeBtn = e.target.closest('[data-route]');
            if (routeBtn) {
                e.preventDefault();
                navigateTo(routeBtn.dataset.route);
            }
        });

        document.addEventListener('click', (e) => {
            const filterBtn = e.target.closest('.filter-tag');
            if (filterBtn) {
                const cat = filterBtn.dataset.cat;
                state.activeFilters.has(cat) ? state.activeFilters.delete(cat) : state.activeFilters.add(cat);
                renderFilters();
                renderData();
            }
        });

        DOM.loginForm.addEventListener('submit', handleLogin);
        DOM.btnPublishOffer.addEventListener('click', () => openModal('offer'));
        DOM.btnOfferService.addEventListener('click', () => openModal('service'));
        DOM.btnCloseModal.addEventListener('click', () => DOM.modal.close());

        DOM.postForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const priceInputValue = document.getElementById('postPrice').value;
            
            const newPost = {
                id: Date.now(),
                type: DOM.postType.value,
                title: document.getElementById('postTitle').value,
                category: document.getElementById('postCategory').value,
                user: state.currentUser,
                description: document.getElementById('postDesc').value,
                price: priceInputValue ? parseInt(priceInputValue) : null,
                rating: 5, // Usuarios nuevos empiezan con 5 estrellas por defecto
                date: new Date().toISOString()
            };

            state.posts.unshift(newPost);
            
            DOM.modal.close();
            DOM.postForm.reset();
            renderData();
        });
    }

    init();
});