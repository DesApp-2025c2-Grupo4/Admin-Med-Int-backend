const { SituacionesTerapeuticas,PlanMedico,TipoDocumento, Especialidad, Prestador } = require('../db/models') 
const getDatosParaFormulario = async (_,res)=>{
  try {
    //TIPOSD DE DOCUMENTS
    const tipoDocs = await TipoDocumento.findAll()
    const tiposDeDocumentos = tipoDocs.map(d=>{
      return {
        id: d.tipoDocId,
        descripcion: d.descripcion
      }
    })

    //PLANES MEDICOS
    const planMedico = await PlanMedico.findAll()
    const planesMedicos = planMedico.map(p=>{
      return{
        id:p.planId,
        descripcion: p.descripcion
      }
    })

    //SITUACIONES
    const situacionTerapeutica = await SituacionesTerapeuticas.findAll()
    const situacionesTerapeuticas = situacionTerapeutica.map(s=>{
      return{
        id:s.situacionId,
        descripcion:s.descripcion
      }
    })

    //RESPUESTA
    res.json({
      tiposDeDocumentos,
      planesMedicos,
      situacionesTerapeuticas
    })

  } catch (error) {
    console.log('Error al obtener datos para el formulario')
    res.status(500).json('Error en el servidor')
  }
}


const getDatosParaPrestadores = async (_, res) => {
  try {
    const especialidades = await Especialidad.findAll()
    const centrosMedicos = await Prestador.findAll({ where: {tipoPrestador: 'Centro Médico'}})
    res.json({especialidades, centrosMedicos})
  } catch (error) {
    console.log('Error al obtener datos para el formulario')
    res.status(500).json('Error en el servidor')
  }
}

module.exports = {
  getDatosParaFormulario,
  getDatosParaPrestadores
}