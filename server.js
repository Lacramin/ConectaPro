// server.js
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 3. BASE DE DATOS SIMULADA (Con precios, ratings y nuevos usuarios)
let postsDb = [
    { id: 1, type: 'offer', title: 'Desarrollador Frontend React', description: 'Buscamos talento para maquetación de interfaces. Se requiere portafolio.', category: 'Informática', user: 'benjamin', price: 850000, rating: 5, date: new Date().toISOString() },
    { id: 2, type: 'service', title: 'Auditoría de Redes (UDP)', description: 'Diseño y mejora de topologías de red empresariales.', category: 'Telecomunicaciones', user: 'marcelo', price: null, rating: 5, date: new Date().toISOString() },
    { id: 3, type: 'service', title: 'Exámenes de Laboratorio a Domicilio', description: 'Toma de muestras de sangre y análisis clínico rápido y seguro.', category: 'Salud', user: 'maryon', price: 25000, rating: 5, date: new Date().toISOString() },
    { id: 4, type: 'service', title: 'Imagenología y Resonancias', description: 'Evaluación y apoyo en diagnóstico por imágenes. Experiencia clínica.', category: 'Salud', user: 'sebastian', price: 45000, rating: 4, date: new Date().toISOString() },
    { id: 5, type: 'service', title: 'Consulta Veterinaria Virtual/Presencial', description: 'Chequeo general de mascotas, planes de vacunación y asesoría nutricional.', category: 'Veterinaria', user: 'nicolas', price: 15000, rating: 5, date: new Date().toISOString() },
    { id: 6, type: 'offer', title: 'Asesoría Legal para Startups', description: 'Se busca abogado para redactar términos y condiciones de nueva app.', category: 'Derecho', user: 'julyan', price: 120000, rating: 4, date: new Date().toISOString() },
    { id: 7, type: 'service', title: 'Redacción de Contratos y Defensas', description: 'Abogado especialista en derecho civil y corporativo.', category: 'Derecho', user: 'rodrigo', price: null, rating: 5, date: new Date().toISOString() },
    { id: 8, type: 'service', title: 'Diseño Arquitectónico y Planos 3D', description: 'Modelado en AutoCAD y renders realistas para tu casa soñada.', category: 'Arquitectura', user: 'laura', price: 200000, rating: 5, date: new Date().toISOString() },
    { id: 9, type: 'service', title: 'Declaración de Renta y Contabilidad', description: 'Ordeno los números de tu Pyme para que evites multas del SII.', category: 'Contabilidad', user: 'carlos', price: 35000, rating: 4, date: new Date().toISOString() },
    { id: 10, type: 'service', title: 'Terapia Psicológica Online', description: 'Acompañamiento clínico para ansiedad y estrés. Enfoque cognitivo conductual.', category: 'Psicología', user: 'ana', price: 30000, rating: 5, date: new Date().toISOString() },
    { id: 11, type: 'service', title: 'Rehabilitación Kinesiológica', description: 'Tratamiento de lesiones deportivas y post-operatorias a domicilio.', category: 'Kinesiología', user: 'diego', price: 22000, rating: 5, date: new Date().toISOString() },
    { id: 12, type: 'service', title: 'Planes Nutricionales Personalizados', description: 'Dieta adaptada a tus objetivos (baja de peso, hipertrofia o veganismo).', category: 'Nutrición', user: 'valentina', price: 20000, rating: 4, date: new Date().toISOString() },
    { id: 13, type: 'service', title: 'Instalaciones Eléctricas Certificadas SEC', description: 'Recableado, tableros y emergencias 24/7.', category: 'Electricidad', user: 'jeremias', price: null, rating: 5, date: new Date().toISOString() },
    { id: 14, type: 'service', title: 'Traducción de Documentos (ENG-ESP)', description: 'Traducción técnica, médica y legal con certificación.', category: 'Traducción', user: 'camila', price: 10000, rating: 5, date: new Date().toISOString() }
];

app.get('/api/posts', (req, res) => {
    res.json(postsDb);
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor de ConectaPRO corriendo en http://localhost:${PORT}`);
});