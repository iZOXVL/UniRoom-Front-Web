import animations from '@/icons/animations.js';

// Actualización de servicios con los IDs obtenidos de la BD
export const servicios = [
    { id: 3, label: 'WiFi incluido', animation: animations.wifi },  // feature_id 3
    { id: 4, label: 'Agua', animation: animations.agua },            // feature_id 4
    { id: 5, label: 'Gas', animation: animations.gas },              // feature_id 5
    { id: 6, label: 'Calentador solar', animation: animations.solar }, // feature_id 6
    { id: 7, label: 'Aire acondicionado', animation: animations.aire }, // feature_id 7
    { id: 8, label: 'Sala de estar', animation: animations.sala },   // feature_id 8
    { id: 9, label: 'Comedor', animation: animations.comedor },      // feature_id 9
    { id: 10, label: 'Cocina compartida', animation: animations.cocina }, // feature_id 10
    { id: 11, label: 'Jardín', animation: animations.jardin },       // feature_id 11
    { id: 12, label: 'Cámaras de seguridad', animation: animations.camara }, // feature_id 12
    { id: 13, label: 'Acceso controlado', animation: animations.acceso }, // feature_id 13
    { id: 14, label: 'Portero', animation: animations.portero },     // feature_id 14
    { id: 15, label: 'Baño privado', animation: animations.baño },   // feature_id 15
    { id: 16, label: 'Baño compartido', animation: animations.bañoc }, // feature_id 16
    { id: 20, label: 'Disponibilidad de estacionamiento', animation: animations.parking }, // feature_id 20
    { id: 19, label: 'Acceso a lavadora/secadora', animation: animations.lavadora }, // feature_id 19
    { id: 17, label: 'Escritorio para estudiar', animation: animations.desk }, // feature_id 17
    { id: 18, label: 'Armario', animation: animations.closet },      // feature_id 18
];

// Actualización de reglas con los IDs obtenidos de la BD
export const reglas = [
    { id: 1, label: 'No se permiten fiestas', animation: animations.fiestas },  // rule_id 1
    { id: 2, label: 'Silencio después de las 10 pm', animation: animations.silencio }, // rule_id 2
    { id: 3, label: 'No se permiten visitas nocturnas', animation: animations.visitas }, // rule_id 3
    { id: 4, label: 'No fumar dentro de la propiedad', animation: animations.smoke }, // rule_id 4
    { id: 5, label: 'Mantener la limpieza en áreas comunes', animation: animations.clean }, // rule_id 5
    { id: 6, label: 'Respetar las pertenencias ajenas', animation: animations.respect }, // rule_id 6
    { id: 7, label: 'No se permiten mascotas sin autorización', animation: animations.pet }, // rule_id 7
    { id: 8, label: 'Respetar el horario de llegada establecido', animation: animations.horario }, // rule_id 8
    { id: 9, label: 'Informar al propietario sobre cualquier daño en la propiedad', animation: animations.broke }, // rule_id 9
    { id: 10, label: 'Prohibido mover muebles sin autorización', animation: animations.furniture }, // rule_id 10
    { id: 11, label: 'No bloquear salidas de emergencia', animation: animations.exit }, // rule_id 11
    { id: 12, label: 'Lavar los utensilios de cocina después de usarlos', animation: animations.dishes }, // rule_id 12
    { id: 13, label: 'Prohibido alterar el WiFi o la electricidad', animation: animations.alter }, // rule_id 13
];
