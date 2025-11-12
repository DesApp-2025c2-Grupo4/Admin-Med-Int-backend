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
      { descripcion: 'Traumatología' },
      { descripcion: 'Psicología' },
      { descripcion: 'Psiquiatría' },
      { descripcion: 'Ginecología' },
      { descripcion: 'Pediatría' },
      { descripcion: 'Oftalmología' },
      { descripcion: 'Odontología' },
      { descripcion: 'Dermatología' },
    ], { returning: true });

    //prestadores
    const prestadores = await queryInterface.bulkInsert('Prestadors', [
      {
        nombre: 'Laura',
        tipoPrestador:'Independiente',
        apellido: 'Soria',
        cuilCuit: '27-12345678-9',
        // fechaAlta: new Date(),
        fechaAlta: "2024-12-01",
      },
      {
        nombre: 'Clínica del Sur',
        apellido: '',
        tipoPrestador: 'Centro Médico',
        cuilCuit: '30-98765432-1',
        fechaAlta: "2025-03-01",
      },
      {
        nombre: 'Mauro',
        tipoPrestador: 'Independiente',
        apellido: 'Pérez',
        cuilCuit: '20-11223344-5',
        fechaAlta: "2023-06-18",
      },
      {
        nombre: 'Alexis',
        tipoPrestador: 'Independiente',
        apellido: 'Giorda',
        cuilCuit: '20-43666331-3',
        fechaAlta: "2024-09-07",
      },
      {
        nombre: 'Pedro',
        tipoPrestador: 'Independiente',
        apellido: 'Gonzalez',
        cuilCuit: '20-27669310-3',
        fechaAlta: new Date(),
      },
      {
        nombre: 'Clínica del Norte',
        apellido: '',
        tipoPrestador: 'Centro Médico',
        cuilCuit: '30-14765432-3',
        fechaAlta: "2022-11-10",
      },
      {
        nombre: 'Álvaro',
        tipoPrestador: 'Independiente',
        apellido: 'Bravo',
        cuilCuit: '20-10340941-3',
        fechaAlta: "2000-08-27",
      },
      {
        nombre: 'Clínica Cayetano Valdez',
        apellido: '',
        tipoPrestador: 'Centro Médico',
        cuilCuit: '30-78907753-3',
        fechaAlta: new Date(),
      },
    ], { returning: true });

    //direcciones
    await queryInterface.bulkInsert('DireccionPrestadors', [
      { calle: 'Av. Siempre Viva', nro: 742, codigoPostal: '1000', prestadorId: prestadores[0].prestadorId },
      { calle: 'San Martín', nro: 1200, codigoPostal: '5000', prestadorId: prestadores[1].prestadorId },
      { calle: 'Mitre', nro: 450, codigoPostal: '2000', prestadorId: prestadores[2].prestadorId },
      { calle: 'Santo domingo', nro: 2330, codigoPostal: '1716', prestadorId: prestadores[3].prestadorId },
      { calle: 'Origone', nro: 830, codigoPostal: '1001', prestadorId: prestadores[4].prestadorId },
      { calle: 'Córdoba', nro: 3240, codigoPostal: '1002', prestadorId: prestadores[5].prestadorId },
      { calle: 'Santiago del Estero', nro: 6666, codigoPostal: '1234', prestadorId: prestadores[6].prestadorId },
      { calle: 'Paraguay', nro: 3240, codigoPostal: '1002', prestadorId: prestadores[7].prestadorId },
      { calle: 'Belgrano', nro: 1440, codigoPostal: '1003', prestadorId: prestadores[7].prestadorId },
    ]);

    //telefonos
    await queryInterface.bulkInsert('TelefonoPrestadors', [
      { nroTelefono: '1134567890', prestadorId: prestadores[0].prestadorId },
      { nroTelefono: '3514456677', prestadorId: prestadores[1].prestadorId },
      { nroTelefono: '3416677889', prestadorId: prestadores[2].prestadorId },
      { nroTelefono: '1167246880', prestadorId: prestadores[3].prestadorId },
      { nroTelefono: '1167247890', prestadorId: prestadores[3].prestadorId },
      { nroTelefono: '1134725993', prestadorId: prestadores[4].prestadorId },
      { nroTelefono: '1199722356', prestadorId: prestadores[5].prestadorId },
      { nroTelefono: '1199722357', prestadorId: prestadores[5].prestadorId },
      { nroTelefono: '1199722358', prestadorId: prestadores[5].prestadorId },
      { nroTelefono: '1145637464', prestadorId: prestadores[6].prestadorId },
      { nroTelefono: '1145637465', prestadorId: prestadores[6].prestadorId },
      { nroTelefono: '1145637466', prestadorId: prestadores[6].prestadorId },
      { nroTelefono: '1106952680', prestadorId: prestadores[7].prestadorId },
      { nroTelefono: '1106952681', prestadorId: prestadores[7].prestadorId },
    ]);

    //emails
    await queryInterface.bulkInsert('EmailPrestadors', [
      { descripcion: 'maria.gonzalez@example.com', prestadorId: prestadores[0].prestadorId },
      { descripcion: 'contacto@clinicasanmartin.com', prestadorId: prestadores[1].prestadorId },
      { descripcion: 'carlos.perez@example.com', prestadorId: prestadores[2].prestadorId },
      { descripcion: 'alexis@gmail.com', prestadorId: prestadores[3].prestadorId },
      { descripcion: 'alexis2@gmail.com', prestadorId: prestadores[3].prestadorId },
      { descripcion: 'alexis3@gmail.com', prestadorId: prestadores[3].prestadorId },
      { descripcion: 'pedro@gmail.com', prestadorId: prestadores[4].prestadorId },
      { descripcion: 'contacto@clinicanorte.com', prestadorId: prestadores[5].prestadorId },
      { descripcion: 'contacto2@clinicanorte.com', prestadorId: prestadores[5].prestadorId },
      { descripcion: 'alvaro@gmail.com', prestadorId: prestadores[6].prestadorId },
      { descripcion: 'contacto@clinicacayetano.com', prestadorId: prestadores[7].prestadorId },
      { descripcion: 'contacto2@clinicacayetano.com', prestadorId: prestadores[7].prestadorId },
      { descripcion: 'contacto3@clinicacayetano.com', prestadorId: prestadores[7].prestadorId },
      { descripcion: 'contacto4@clinicacayetano.com', prestadorId: prestadores[7].prestadorId },
    ]);

    //relacion muchos a muchos
    await queryInterface.bulkInsert('PrestadorEspecialidads', [
      { prestadorId: prestadores[0].prestadorId, especialidadId: especialidades[0].especialidadId },
      { prestadorId: prestadores[1].prestadorId, especialidadId: especialidades[1].especialidadId },
      { prestadorId: prestadores[2].prestadorId, especialidadId: especialidades[0].especialidadId },
      { prestadorId: prestadores[2].prestadorId, especialidadId: especialidades[2].especialidadId },
      { prestadorId: prestadores[3].prestadorId, especialidadId: especialidades[3].especialidadId },
      { prestadorId: prestadores[3].prestadorId, especialidadId: especialidades[2].especialidadId },
      { prestadorId: prestadores[3].prestadorId, especialidadId: especialidades[1].especialidadId },
      { prestadorId: prestadores[4].prestadorId, especialidadId: especialidades[4].especialidadId },
      { prestadorId: prestadores[5].prestadorId, especialidadId: especialidades[5].especialidadId },
      { prestadorId: prestadores[6].prestadorId, especialidadId: especialidades[6].especialidadId },
      { prestadorId: prestadores[7].prestadorId, especialidadId: especialidades[7].especialidadId },
      { prestadorId: prestadores[7].prestadorId, especialidadId: especialidades[8].especialidadId },
      { prestadorId: prestadores[7].prestadorId, especialidadId: especialidades[9].especialidadId },
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
