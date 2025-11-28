const { Especialidad } = require("../db/models");
const redis = require("../db/config/redis.js");
const dotenv = require("dotenv");
dotenv.config();

const getEspecialidades = async (_, res) => {
  try {
    const key = "especialidad:list:";
    
    const especialidades = await Especialidad.findAll({
      attributes: ['especialidadId', 'descripcion'],
      order: [['descripcion', 'ASC']]
    });

    redis.set(key, JSON.stringify(especialidades), {
      EX: Number(process.env.CACHE_TTL),
    });

    res.status(200).json(especialidades);
  } catch (error) {
    console.error(`Error al obtener las especialidades: ${error}`);
    res.status(500).json({ error: "Error al obtener las especialidades" });
  }
};

const getEspecialidadByPk = async (req, res) => {
  try {
    const { id } = req.params;
    const key = `especialidad:${id}`;

    const especialidad = await Especialidad.findByPk(id, {
      attributes: ['especialidadId', 'descripcion']
    });

    if (!especialidad) {
      return res.status(404).json({ error: "Especialidad no encontrada" });
    }

    redis.set(key, JSON.stringify(especialidad.toJSON()), {
      EX: Number(process.env.CACHE_TTL),
    });

    res.status(200).json(especialidad.toJSON());
  } catch (error) {
    console.error(`Error al obtener la especialidad: ${error}`);
    res.status(500).json({ error: "Error al obtener la especialidad" });
  }
};

module.exports = {
  getEspecialidades,
  getEspecialidadByPk,
};
