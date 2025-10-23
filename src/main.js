const { app } = require('./app.js');
//Importaciones de rutas
const {dataFormRoutes, personaRoutes, grupoRoutes, tipoDocRoutes, planMedicoRoutes, telefonoRoutes, emailRoutes, direccionRoutes, situacionRoutes, prestadorRoutes, agendaRoutes } = require('./routes') 

//Uso de las rutas
app.use('/persona', personaRoutes);
app.use('/grupo', grupoRoutes);
app.use('/tipoDocumento', tipoDocRoutes)
app.use('/planMedico', planMedicoRoutes)
app.use('/telefonos', telefonoRoutes)
app.use('/emails', emailRoutes)
app.use('/direcciones', direccionRoutes)
app.use('/situaciones', situacionRoutes)
app.use('/data-form', dataFormRoutes)
app.use('/prestador', prestadorRoutes)
app.use('/agenda', agendaRoutes)