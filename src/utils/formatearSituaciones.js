const formatearSituaciones = (situaciones) => {
  if (!situaciones) return [];

  return situaciones.map(situacion => {
    return {
      descripcion: situacion.descripcion,
      situacionId: situacion.situacionId,
      fechaInicio: situacion.SituacionPersona.fechaInicio,
      fechaFin: situacion.SituacionPersona.fechaFin,
      esCronica: situacion.SituacionPersona.esCronica
    };
  });
};


module.exports = {
  formatearSituaciones
}