const { SituacionesTerapeuticas,PlanMedico,TipoDocumento, Especialidad, Prestador } = require('../db/models') 
const redis = require('../db/config/redis.js')
const dotenv = require("dotenv");
dotenv.config();

const getDatosParaFormulario = async (_,res)=>{
  try {
    //TIPOSD DE DOCUMENTS
    const key = 'dataform:general';
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
    
    //Datos a devolver
    const dataForm = {
      tiposDeDocumentos,
      planesMedicos,
      situacionesTerapeuticas
    }

    //Lo pongo en la caché
    await redis.set(key, JSON.stringify(dataForm), {
      EX: Number(process.env.CACHE_TTL),
    });

    //RESPUESTA
    res.json(dataForm)

  } catch (error) {
    console.log('Error al obtener datos para el formulario')
    res.status(500).json('Error en el servidor')
  }
}


const getDatosParaPrestadores = async (_, res) => {
  try {
    const key = 'dataform:prestador';
    const especialidades = await Especialidad.findAll()
    const centrosMedicos = await Prestador.findAll({ where: {tipoPrestador: 'Centro Médico'}})

    //Datos a devolver
    const dataForm = {
      especialidades,
      centrosMedicos
    }

    await redis.set(key, JSON.stringify(dataForm), {
      EX: Number(process.env.CACHE_TTL),
    });
    res.json(dataForm)
  } catch (error) {
    console.log('Error al obtener datos para el formulario')
    res.status(500).json('Error en el servidor')
  }
}

module.exports = {
  getDatosParaFormulario,
  getDatosParaPrestadores
}