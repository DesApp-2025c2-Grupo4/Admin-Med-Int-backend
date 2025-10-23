'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('PrestadorEspecialidads', null, { truncate: true, restartIdentity: true, cascade: true });
    await queryInterface.bulkDelete('EmailPrestadors', null, { truncate: true, restartIdentity: true, cascade: true });
    await queryInterface.bulkDelete('TelefonoPrestadors', null, { truncate: true, restartIdentity: true, cascade: true });
    await queryInterface.bulkDelete('DireccionPrestadors', null, { truncate: true, restartIdentity: true, cascade: true });
    await queryInterface.bulkDelete('Prestadors', null, { truncate: true, restartIdentity: true, cascade: true });
    await queryInterface.bulkDelete('Especialidads', null, { truncate: true, restartIdentity: true, cascade: true });

    //especialidades
    const especialidades = await queryInterface.bulkInsert('Especialidads', [
      { descripcion: 'Medicina General' },
      { descripcion: 'Cardiología' },
      { descripcion: 'Traumatología' }
    ], { returning: true });

    //prestadores
    const prestadores = await queryInterface.bulkInsert('Prestadors', [
      {
        nombre: 'Laura',
        apellido: 'Soria',
        tipoPrestador: 'Independiente',
        lugarIndependiente: 'Consultorio Propio',
        cuilCuit: '27-12345678-9',
        fechaAlta: new Date(),
      },
      {
        nombre: 'Clínica del Sur',
        apellido: '',
        tipoPrestador: 'Centro Médico',
        lugarCentro: 'Clinica',
        cuilCuit: '30-98765432-1',
        fechaAlta: new Date(),
      },
      {
        nombre: 'Mauro',
        apellido: 'Pérez',
        tipoPrestador: 'Independiente',
        lugarIndependiente: 'Consultorio Propio',
        cuilCuit: '20-11223344-5',
        fechaAlta: new Date(),
      }
    ], { returning: true });

    //direcciones
    await queryInterface.bulkInsert('DireccionPrestadors', [
      { calle: 'Av. Siempre Viva', nro: 742, codigoPostal: '1000', prestadorId: prestadores[0].prestadorId },
      { calle: 'San Martín', nro: 1200, codigoPostal: '5000', prestadorId: prestadores[1].prestadorId },
      { calle: 'Mitre', nro: 450, codigoPostal: '2000', prestadorId: prestadores[2].prestadorId },
    ]);

    //telefonos
    await queryInterface.bulkInsert('TelefonoPrestadors', [
      { nroTelefono: '1134567890', prestadorId: prestadores[0].prestadorId },
      { nroTelefono: '3514456677', prestadorId: prestadores[1].prestadorId },
      { nroTelefono: '3416677889', prestadorId: prestadores[2].prestadorId },
    ]);

    //emails
    await queryInterface.bulkInsert('EmailPrestadors', [
      { descripcion: 'maria.gonzalez@example.com', prestadorId: prestadores[0].prestadorId },
      { descripcion: 'contacto@clinicasanmartin.com', prestadorId: prestadores[1].prestadorId },
      { descripcion: 'carlos.perez@example.com', prestadorId: prestadores[2].prestadorId },
    ]);

    //relacion muchos a muchos
    await queryInterface.bulkInsert('PrestadorEspecialidads', [
      { prestadorId: prestadores[0].prestadorId, especialidadId: especialidades[0].especialidadId },
      { prestadorId: prestadores[1].prestadorId, especialidadId: especialidades[1].especialidadId },
      { prestadorId: prestadores[2].prestadorId, especialidadId: especialidades[0].especialidadId },
      { prestadorId: prestadores[2].prestadorId, especialidadId: especialidades[2].especialidadId },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('PrestadorEspecialidads', null, {});
    await queryInterface.bulkDelete('EmailPrestadors', null, {});
    await queryInterface.bulkDelete('TelefonoPrestadors', null, {});
    await queryInterface.bulkDelete('DireccionPrestadors', null, {});
    await queryInterface.bulkDelete('Prestadors', null, {});
    await queryInterface.bulkDelete('Especialidads', null, {});
  }
};
