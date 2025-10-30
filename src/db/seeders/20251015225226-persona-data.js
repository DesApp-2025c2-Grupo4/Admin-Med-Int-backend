'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // -------------------------------------- REINICI BD ------------------------
    await queryInterface.bulkDelete('SituacionPersonas', null, {
      truncate: true, restartIdentity: true, cascade: true
    });
    await queryInterface.bulkDelete('SituacionesTerapeuticas', null, {
      truncate: true, restartIdentity: true, cascade: true
    });
    await queryInterface.bulkDelete('Telefonos', null, {
      truncate: true, restartIdentity: true, cascade: true
    });
    await queryInterface.bulkDelete('Emails', null, {
      truncate: true, restartIdentity: true, cascade: true
    });
    await queryInterface.bulkDelete('Direccions', null, {
      truncate: true, restartIdentity: true, cascade: true
    });
    await queryInterface.bulkDelete('Personas', null, {
      truncate: true, restartIdentity: true, cascade: true
    });
    await queryInterface.bulkDelete('Grupos', null, {
      truncate: true, restartIdentity: true, cascade: true
    });
    await queryInterface.bulkDelete('PlanMedicos', null, {
      truncate: true, restartIdentity: true, cascade: true
    });
    await queryInterface.bulkDelete('TipoDocumentos', null, {
      truncate: true, restartIdentity: true, cascade: true
    });

    //-----------------------------INSERTO DATOS -------------------------------

    // --- TIPOS DE DOCUMENTOS ---
    await queryInterface.bulkInsert('TipoDocumentos', [
      { descripcion: 'DNI' },
      { descripcion: 'Pasaporte' }
    ], {});

    // --- PLANES MÉDICOS ---
    await queryInterface.bulkInsert('PlanMedicos', [
      { descripcion: 'Plata' },
      { descripcion: 'Bronce' },
      { descripcion: 'Oro' },
      { descripcion: 'Diamante' }
    ], {});

    // --- GRUPOS ---
    await queryInterface.bulkInsert('Grupos', [
      { nroGrupo: '0000001', fechaAlta: new Date(), planId: 1 },
      { nroGrupo: '0000002', fechaAlta: new Date(), planId: 2 },
      { nroGrupo: '0000003', fechaAlta: new Date(), planId: 3 }
    ], {});

    // --- SITUACIONES TERAPÉUTICAS ---
    await queryInterface.bulkInsert('SituacionesTerapeuticas', [
      { descripcion: 'Fisioterapia' },
      { descripcion: 'Rehabilitación motora' },
      { descripcion: 'Terapia psicológica' }
    ], {});

    // ------------------------------ PERSONAS DEL GRUPO 1 ---------------------------------
    await queryInterface.bulkInsert('Personas', [
      {
        nombre: 'Pedro',
        apellido: 'Carrizo',
        dni: '12345678',
        esTitular: true,
        parentesco: 'Titular',
        fechaNacimiento: '1980-05-10',
        fechaAlta: new Date(),
        fechaBaja: null,
        credencial: '0000001-01',
        idGrupo: 1,
        tipoDocId: 1
      },
      {
        nombre: 'Lucía',
        apellido: 'Gómez',
        dni: '87654321',
        esTitular: false,
        parentesco: 'Familiar',
        fechaNacimiento: '1995-09-12',
        fechaAlta: new Date(),
        fechaBaja: null,
        credencial: '0000001-02',
        idGrupo: 1,
        tipoDocId: 1
      },
      {
        nombre: 'Juan',
        apellido: 'Pérez',
        dni: '22334455',
        esTitular: false,
        parentesco: 'Familiar',
        fechaNacimiento: '1978-11-20',
        fechaAlta: new Date(),
        fechaBaja: null,
        credencial: '0000001-03',
        idGrupo: 1,
        tipoDocId: 2
      }
    ], {});

    // --- DIRECCIONES ---
    await queryInterface.bulkInsert('Direccions', [
      { calle: 'Av. Siempre Viva', nro: '742', personaId: 1 },
      { calle: 'Belgrano', nro: '1234', personaId: 1 },
      { calle: 'San Martín', nro: '500', personaId: 2 },
      { calle: 'Av. Siempre Viva', nro: '742', personaId: 2 },
      { calle: 'Belgrano', nro: '1234', personaId: 3 },
      { calle: 'San Martín', nro: '500', personaId: 3 }
    ], {});

    // --- EMAILS ---
    await queryInterface.bulkInsert('Emails', [
      { descripcion: 'pedro.carrizo@example.com', personaId: 1 },
      { descripcion: 'pedro.carrizo2@example.com', personaId: 1 },
      { descripcion: 'lucia.gomez@example.com', personaId: 2 },
      { descripcion: 'lucia.gomez2@example.com', personaId: 2 },
      { descripcion: 'juan.perez@example.com', personaId: 3 },
      { descripcion: 'juan.perez2@example.com', personaId: 3 }
    ], {});

    // --- TELÉFONOS ---
    await queryInterface.bulkInsert('Telefonos', [
      { nroTelefono: '1122334455', personaId: 1 },
      { nroTelefono: '1199887766', personaId: 1 },
      { nroTelefono: '1133221100', personaId: 2 },
      { nroTelefono: '1122334455', personaId: 2 },
      { nroTelefono: '1199887766', personaId: 3 },
      { nroTelefono: '1133221100', personaId: 3 }
    ], {});

    // --- RELACIÓN MUCHOS A MUCHOS (SituacionPersonas) ---
    await queryInterface.bulkInsert('SituacionPersonas', [
      { personaId: 1, situacionId: 1, esCronica: false, fechaInici: '2025-01-10', fechaFin: '2025-02-10' },
      { personaId: 2, situacionId: 2, esCronica: true, fechaInici: '2024-03-01', fechaFin: null },
      { personaId: 3, situacionId: 3, esCronica: false, fechaInici: '2025-09-01', fechaFin: null }
    ], {});

    // ------------------------------ PERSONAS DEL GRUPO 2 ---------------------------------
    await queryInterface.bulkInsert('Personas', [
      {
        nombre: 'Pedro',
        apellido: 'Carrizo',
        dni: '12345678',
        esTitular: true,
        parentesco: 'Titular',
        fechaNacimiento: '1980-05-10',
        fechaAlta: new Date(),
        fechaBaja: null,
        credencial: '0000002-01',
        idGrupo: 2,
        tipoDocId: 1
      },
      {
        nombre: 'Luciano',
        apellido: 'Gómez',
        dni: '87654321',
        esTitular: false,
        parentesco: 'Familiar',
        fechaNacimiento: '1995-09-12',
        fechaAlta: new Date(),
        fechaBaja: null,
        credencial: '0000002-02',
        idGrupo: 2,
        tipoDocId: 1
      },
      {
        nombre: 'Milagros',
        apellido: 'Pérez',
        dni: '22334455',
        esTitular: false,
        parentesco: 'Familiar',
        fechaNacimiento: '1978-11-20',
        fechaAlta: new Date(),
        fechaBaja: null,
        credencial: '0000002-03',
        idGrupo: 2,
        tipoDocId: 2
      }
    ], {});

    // --- DIRECCIONES ---
    await queryInterface.bulkInsert('Direccions', [
      { calle: 'Av. Siempre Viva', nro: '742', personaId: 4 },
      { calle: 'Belgrano', nro: '1234', personaId: 4 },
      { calle: 'San Martín', nro: '500', personaId: 5 },
      { calle: 'Av. Siempre Viva', nro: '742', personaId: 5 },
      { calle: 'Belgrano', nro: '1234', personaId: 6 },
      { calle: 'San Martín', nro: '500', personaId: 6 }
    ], {});

    // --- EMAILS ---
    await queryInterface.bulkInsert('Emails', [
      { descripcion: 'pedro.carrizo@example.com', personaId: 4 },
      { descripcion: 'pedro.carrizo2@example.com', personaId: 4 },
      { descripcion: 'luciano.gomez@example.com', personaId: 5 },
      { descripcion: 'luciano2.gomez2@example.com', personaId: 5 },
      { descripcion: 'milagros.perez@example.com', personaId: 6 },
      { descripcion: 'milagros2.perez2@example.com', personaId: 6 }
    ], {});

    // --- TELÉFONOS ---
    await queryInterface.bulkInsert('Telefonos', [
      { nroTelefono: '1122334455', personaId: 4 },
      { nroTelefono: '1199887766', personaId: 4 },
      { nroTelefono: '1133221100', personaId: 5 },
      { nroTelefono: '1122334455', personaId: 5 },
      { nroTelefono: '1199887766', personaId: 6 },
      { nroTelefono: '1133221100', personaId: 6 }
    ], {});

    // --- RELACIÓN MUCHOS A MUCHOS (SituacionPersonas) ---
    await queryInterface.bulkInsert('SituacionPersonas', [
      { personaId: 4, situacionId: 1, esCronica: false, fechaInici: '2025-01-10', fechaFin: '2025-02-10' },
      { personaId: 4, situacionId: 2, esCronica: true, fechaInici: '2024-03-01', fechaFin: null },
      { personaId: 5, situacionId: 3, esCronica: false, fechaInici: '2025-09-01', fechaFin: null }
    ], {});

    // ------------------------------ PERSONAS DEL GRUPO 3 ---------------------------------
    await queryInterface.bulkInsert('Personas', [
      {
        nombre: 'Ernesto',
        apellido: 'Carrizo',
        dni: '12345678',
        esTitular: true,
        parentesco: 'Titular',
        fechaNacimiento: '1980-05-10',
        fechaAlta: new Date(),
        fechaBaja: null,
        credencial: '0000003-01',
        idGrupo: 3,
        tipoDocId: 1
      },
      {
        nombre: 'Federico',
        apellido: 'Gómez',
        dni: '87654321',
        esTitular: false,
        parentesco: 'Familiar',
        fechaNacimiento: '1995-09-12',
        fechaAlta: new Date(),
        fechaBaja: null,
        credencial: '0000003-02',
        idGrupo: 3,
        tipoDocId: 1
      },
      {
        nombre: 'Viviana',
        apellido: 'Pérez',
        dni: '22334455',
        esTitular: false,
        parentesco: 'Familiar',
        fechaNacimiento: '1978-11-20',
        fechaAlta: new Date(),
        fechaBaja: null,
        credencial: '0000003-03',
        idGrupo: 3,
        tipoDocId: 2
      }
    ], {});

    // --- DIRECCIONES ---
    await queryInterface.bulkInsert('Direccions', [
      { calle: 'Av. Siempre Viva', nro: '742', personaId: 7 },
      { calle: 'Belgrano', nro: '1234', personaId: 7 },
      { calle: 'San Martín', nro: '500', personaId: 8 },
      { calle: 'Av. Siempre Viva', nro: '742', personaId: 8 },
      { calle: 'Belgrano', nro: '1234', personaId: 9 },
      { calle: 'San Martín', nro: '500', personaId: 9 }
    ], {});

    // --- EMAILS ---
    await queryInterface.bulkInsert('Emails', [
      { descripcion: 'ernesto.carrizo@example.com', personaId: 7 },
      { descripcion: 'ernesto2.carrizo2@example.com', personaId: 7 },
      { descripcion: 'federico.gomez@example.com', personaId: 8 },
      { descripcion: 'federico2.gomez2@example.com', personaId: 8 },
      { descripcion: 'viviana.perez@example.com', personaId: 9 },
      { descripcion: 'viviana2.perez2@example.com', personaId: 9 }
    ], {});

    // --- TELÉFONOS ---
    await queryInterface.bulkInsert('Telefonos', [
      { nroTelefono: '1122334455', personaId: 7 },
      { nroTelefono: '1199887766', personaId: 7 },
      { nroTelefono: '1133221100', personaId: 8 },
      { nroTelefono: '1122334455', personaId: 8 },
      { nroTelefono: '1199887766', personaId: 9 },
      { nroTelefono: '1133221100', personaId: 9 }
    ], {});

    // --- RELACIÓN MUCHOS A MUCHOS (SituacionPersonas) ---
    await queryInterface.bulkInsert('SituacionPersonas', [
      { personaId: 7, situacionId: 1, esCronica: false, fechaInici: '2025-01-10', fechaFin: '2025-02-10' },
      { personaId: 8, situacionId: 2, esCronica: true, fechaInici: '2024-03-01', fechaFin: null },
      { personaId: 9, situacionId: 3, esCronica: false, fechaInici: '2025-09-01', fechaFin: null }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('SituacionPersonas', null, {});
    await queryInterface.bulkDelete('SituacionesTerapeuticas', null, {});
    await queryInterface.bulkDelete('Telefonos', null, {});
    await queryInterface.bulkDelete('Emails', null, {});
    await queryInterface.bulkDelete('Direccions', null, {});
    await queryInterface.bulkDelete('Personas', null, {});
    await queryInterface.bulkDelete('Grupos', null, {});
    await queryInterface.bulkDelete('PlanMedicos', null, {});
    await queryInterface.bulkDelete('TipoDocumentos', null, {});
  }
};
