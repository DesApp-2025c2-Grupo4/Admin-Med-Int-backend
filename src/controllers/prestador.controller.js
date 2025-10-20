const { Prestador, DireccionPrestador, TelefonoPrestador, EmailPrestador, Especialidad, PrestadorEspecialidad, sequelize} = require('../db/models');


const createPrestador = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const newPrestador = req.body;

    
    const prestador = await Prestador.create(
      {
        nombre: newPrestador.nombre,
        apellido: newPrestador.apellido,
        tipoPrestador: newPrestador.tipoPrestador,
        cuilCuit: newPrestador.cuilCuit,
        fechaAlta: newPrestador.fechaAlta
      },
      { transaction }
    );

    const prestadorId = prestador.prestadorId;

   
    await transaction.commit();
    res.status(201).json(prestador);
  } catch (error) {
    await transaction.rollback();
    console.error(`Error al crear el prestador: ${error}`);
    res.status(500).json({ error: 'Error al crear el prestador' });
  }
};


// traer todos
const getPrestadores = async (_, res) => {
  try {
    const prestadores = await Prestador.findAll({
      include: [
        { model: DireccionPrestador, as: 'direccion' },
        { model: TelefonoPrestador, as: 'telefonos' },
        { model: EmailPrestador, as: 'email' },
        {
          model: Especialidad,
          as: 'especialidad',
          through: { attributes: [] } 
        }
      ]
    });

    res.status(200).json(prestadores);
  } catch (error) {
    console.error(`Error al obtener los prestadores: ${error}`);
    res.status(500).json({ error: 'Error al obtener los prestadores' });
  }
};


const getPrestadorByPk = async (req, res) => {
  try {
    const { id } = req.params;

    const prestador = await Prestador.findByPk(id, {
      include: [
        { model: DireccionPrestador, as: 'direccion' },
        { model: TelefonoPrestador, as: 'telefonos' },
        { model: EmailPrestador, as: 'email' },
        {
          model: Especialidad,
          as: 'especialidad',
          through: { attributes: [] }
        }
      ]
    });

    //eliminar cuando se implemente el middleware

    if (!prestador) {
      return res.status(404).json({ error: 'Prestador no encontrado' });
    }

    res.status(200).json(prestador);
  } catch (error) {
    console.error(`Error al obtener el prestador: ${error}`);
    res.status(500).json({ error: 'Error al obtener el prestador' });
  }
};



const deletePrestador = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Prestador.destroy({
      where: { prestadorId: id }
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Prestador no encontrado' });
    }

    res.status(200).json({ message: 'Prestador eliminado correctamente' });
  } catch (error) {
    console.error(`Error al eliminar el prestador: ${error}`);
    res.status(500).json({ error: 'Error al eliminar el prestador' });
  }
};

module.exports = {
  getPrestadores,
  getPrestadorByPk,
  createPrestador,
  deletePrestador
};
