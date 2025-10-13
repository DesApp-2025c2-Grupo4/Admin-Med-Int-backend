const { app } = require('./app.js')

//Importaciones de rutas
const { personaRoutes, grupoRoutes, tipoDocRoutes } = require('./routes') 

//Uso de las rutas
app.use('/persona', personaRoutes);
app.use('/grupo', grupoRoutes);
app.use('/tipoDocumento', tipoDocRoutes)