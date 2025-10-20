const { Router } = require("express");
const { prestadorControllers} = require("../controllers");
const prestadorRoutes = Router();

prestadorRoutes.get('/', prestadorControllers.getPrestadores);
prestadorRoutes.get('/:id', prestadorControllers.getPrestadorByPk);
prestadorRoutes.post('/', prestadorControllers.createPrestador);
prestadorRoutes.delete('/:id', prestadorControllers.deletePrestador);


module.exports = prestadorRoutes;