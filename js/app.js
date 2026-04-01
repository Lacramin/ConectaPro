// js/app.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Referencias DOM
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
        btnPublishOffer: document.getElementById('btnPublishOffer'),
        btnOfferService: document.getElementById('btnOfferService'),
        btnCloseModal: document.getElementById('btnCloseModal')
    };

    function init() {
        renderAuthUI();
        populateCategories();
        renderFilters();
        renderData();
        setupEventListeners();
    }

    // ==========================================
    // ROUTER Y NAVEGACIÓN
    // ==========================================
    function navigateTo(route) {
        state.currentView = route;
        
        DOM.views.forEach(view => {
            view.classList.remove('active');
            // Reiniciar la animación forzando un reflow
            void view.offsetWidth; 
            if (view.id === `view-${route}`) {
                view.classList.add('active');
            }
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.toggle('active-link', link.dataset.route === route);
        });

        state.activeFilters.clear();
        renderFilters();
        renderData();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // ==========================================
    // AUTENTICACIÓN
    // ==========================================
    function renderAuthUI() {
        if (state.currentUser) {
            DOM.authSection.innerHTML = `
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <span style="font-size: 0.9rem; color: var(--text-muted);">@${state.currentUser}</span>
                    <button id="btnLogout" class="btn btn-glass" style="padding: 0.4rem 1rem; font-size: 0.8rem;">Salir</button>
                </div>
            `;
            // Re-asignamos el evento porque reescribimos el innerHTML
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

    // ==========================================
    // RENDERIZADO (TARJETAS Y FILTROS)
    // ==========================================
    function renderData() {
        const filtered = state.posts.filter(post => 
            state.activeFilters.size === 0 || state.activeFilters.has(post.category)
        );

        if (state.currentView === 'offers') {
            const offers = filtered.filter(p => p.type === 'offer');
            DOM.offersContainer.innerHTML = offers.length ? offers.map(generateCard).join('') : '<p class="text-muted">No hay vacantes en esta categoría.</p>';
        } else if (state.currentView === 'professionals') {
            const services = filtered.filter(p => p.type === 'service');
            DOM.servicesContainer.innerHTML = services.length ? services.map(generateCard).join('') : '<p class="text-muted">No hay perfiles en esta categoría.</p>';
        }
    }

    function generateCard(post) {
        const date = new Date(post.date).toLocaleDateString('es-CL');
        return `
            <article class="glass-card card" style="padding: 1.5rem;">
                <div class="card-header">
                    <span class="badge">${post.category}</span>
                </div>
                <h3 class="card-title">${post.title}</h3>
                <p class="card-desc">${post.description}</p>
                <div class="card-footer">
                    <span style="color: var(--text-main);">@${post.user}</span>
                    <span>${date}</span>
                </div>
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

    // ==========================================
    // EVENT DELEGATION CLAVE (Corrige el bug de clics)
    // ==========================================
    function setupEventListeners() {
        // Interceptar navegación general usando .closest()
        document.addEventListener('click', (e) => {
            // Busca si el elemento clickeado (o su padre) tiene el atributo data-route
            const routeBtn = e.target.closest('[data-route]');
            if (routeBtn) {
                e.preventDefault();
                navigateTo(routeBtn.dataset.route);
            }
        });

        // Interceptar filtros
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
            const newPost = {
                id: Date.now(),
                type: DOM.postType.value,
                title: document.getElementById('postTitle').value,
                category: document.getElementById('postCategory').value,
                user: state.currentUser,
                description: document.getElementById('postDesc').value,
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