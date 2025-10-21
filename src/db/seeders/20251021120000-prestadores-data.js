'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('PrestadorEspecialidads', null, { truncate: true, restartIdentity: true, cascade: true });
    await queryInterface.bulkDelete('EmailPrestadors', null, { truncate: true, restartIdentity: true, cascade: true });
    await queryInterface.bulkDelete('TelefonoPrestadors', null, { truncate: true, restartIdentity: true, cascade: true });
    await queryInterface.bulkDelete('DireccionPrestadors', null, { truncate: true, restartIdentity: true, cascade: true });
    await queryInterface.bulkDelete('Prestadors', null, { truncate: true, restartIdentity: true, cascade: true });
    await queryInterface.bulkDelete('Especialidads', null, { truncate: true, restartIdentity: true, cascade: true });

    // Especialidades
    await queryInterface.bulkInsert('Especialidads', [
      { especialidadId: 1, descripcion: 'Clínico' },
      { especialidadId: 2, descripcion: 'Cardiólogo' },
      { especialidadId: 3, descripcion: 'Traumatólogo' }
    ]);

    // Prestadores
    await queryInterface.bulkInsert('Prestadors', [
      {
        prestadorId: 1,
        nombre: 'Dra. Laura',
        apellido: 'Soria',
        tipoPrestador: 'Independiente',
        cuilCuit: '27-12345678-9',
        fechaAlta: new Date(),
      },
      {
        prestadorId: 2,
        nombre: 'Clínica del Sur',
        apellido: '',
        tipoPrestador: 'Centro Médico',
        cuilCuit: '30-98765432-1',
        fechaAlta: new Date(),
      },
      {
        prestadorId: 3,
        nombre: 'Dr. Mauro',
        apellido: 'Pérez',
        tipoPrestador: 'Independiente',
        cuilCuit: '20-11223344-5',
        fechaAlta: new Date(),
      }
    ]);

    // Direcciones
    await queryInterface.bulkInsert('DireccionPrestadors', [
      {
        direccionId: 1,
        calle: 'Av. Siempre Viva',
        nro: 742,
        codigoPostal: '1000',
        prestadorId: 1
      },
      {
        direccionId: 2,
        calle: 'San Martín',
        nro: 1200,
        codigoPostal: '5000',
        prestadorId: 2
      },
      {
        direccionId: 3,
        calle: 'Mitre',
        nro: 450,
        codigoPostal: '2000',
        prestadorId: 3
      }
    ]);

    // Telefonos
    await queryInterface.bulkInsert('TelefonoPrestadors', [
      {
        telefonoId: 1,
        nroTelefono: '1134567890',
        prestadorId: 1
      },
      {
        telefonoId: 2,
        nroTelefono: '3514456677',
        prestadorId: 2
      },
      {
        telefonoId: 3,
        nroTelefono: '3416677889',
        prestadorId: 3
      }
    ]);

    // Email
    await queryInterface.bulkInsert('EmailPrestadors', [
      {
        emailPrestadorId: 1,
        descripcion: 'maria.gonzalez@example.com',
        prestadorId: 1
      },
      {
        emailPrestadorId: 2,
        descripcion: 'contacto@clinicasanmartin.com',
        prestadorId: 2
      },
      {
        emailPrestadorId: 3,
        descripcion: 'carlos.perez@example.com',
        prestadorId: 3
      }
    ]);

    // Relacion muchos a muchos de especialidades
    await queryInterface.bulkInsert('PrestadorEspecialidads', [
      { prestadorId: 1, especialidadId: 1 },
      { prestadorId: 2, especialidadId: 2 },
      { prestadorId: 3, especialidadId: 1 },
      { prestadorId: 3, especialidadId: 3 }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('PrestadorEspecialidads', null, {});
    await queryInterface.bulkDelete('EmailPrestadors', null, {});
    await queryInterface.bulkDelete('TelefonoPrestadors', null, {});
    await queryInterface.bulkDelete('DireccionPrestadors', null, {});
    await queryInterface.bulkDelete('Prestadors', null, {});
  }
};
