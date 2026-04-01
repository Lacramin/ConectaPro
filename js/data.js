// js/data.js

// Usuarios permitidos en el sistema (Fundadores)
const USERS = ['benjamin', 'jeremias', 'marcelo', 'julyan'];

// Categorías disponibles para los filtros
const CATEGORIES = ['Ingeniería', 'Informática', 'Mecánica', 'Medicina', 'Electricidad', 'Diseño'];

// Datos iniciales simulados (Mock Data)
// type: 'offer' (Oferta de trabajo) | 'service' (Ofrece un servicio)
const initialData = [
    {
        id: 1,
        type: 'offer',
        title: 'Desarrollador Frontend Junior',
        description: 'Buscamos talento para maquetación de interfaces de alto rendimiento.',
        category: 'Informática',
        user: 'benjamin',
        date: new Date().toISOString()
    },
    {
        id: 2,
        type: 'service',
        title: 'Reparación de Motores Industriales',
        description: 'Tengo 10 años de experiencia ajustando y reparando motores pesados.',
        category: 'Mecánica',
        user: 'marcelo',
        date: new Date().toISOString()
    },
    {
        id: 3,
        type: 'offer',
        title: 'Médico General para Turnos',
        description: 'Clínica privada busca médico para turnos de fin de semana.',
        category: 'Medicina',
        user: 'julyan',
        date: new Date().toISOString()
    },
    {
        id: 4,
        type: 'service',
        title: 'Instalaciones Eléctricas Domiciliarias',
        description: 'Realizo recableado, instalación de tableros y certificación.',
        category: 'Electricidad',
        user: 'jeremias',
        date: new Date().toISOString()
    }
];

// Estado global de la aplicación
// Centralizamos los datos aquí para que la UI reaccione a este estado
const state = {
    posts: [...initialData],
    searchQuery: '',
    activeFilters: new Set(), // Usamos Set para evitar etiquetas duplicadas y tener búsquedas O(1)
    
    // VARIABLES NUEVAS NECESARIAS PARA LA SPA Y EL LOGIN:
    currentUser: null,  // null = no hay nadie logueado al inicio
    currentView: 'home' // define la vista inicial que se muestra
};