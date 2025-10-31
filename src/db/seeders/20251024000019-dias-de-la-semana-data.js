'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Primero elimina todo el contenido existente
    await queryInterface.bulkDelete('DiaDeSemanas', null, {});

    // Luego inserta los días de la semana
    await queryInterface.bulkInsert('DiaDeSemanas', [
      { descripcion: 'Lunes' },
      { descripcion: 'Martes' },
      { descripcion: 'Miércoles' },
      { descripcion: 'Jueves' },
      { descripcion: 'Viernes' },
      { descripcion: 'Sábado' },
      { descripcion: 'Domingo' },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    // Si revertís el seed, elimina todo nuevamente
    await queryInterface.bulkDelete('DiaDeSemanas', null, {});
  }
};
