// /src/api/horario-de-autobuses/content-types/horario-de-autobuses/lifecycles.js
module.exports = {
  async afterCreate(event) {
    const { result } = event;
    const { id, bus } = result;
    
    // Obtener el número de asientos del bus o usar 48 por defecto
    const totalAsientos = bus?.totalAsientos || 48;

    console.log(`🏗 Creando ${totalAsientos} asientos para horario ${id}...`);

    try {
      const asientosData = Array.from({ length: totalAsientos }, (_, i) => ({
        numeroAsiento: i + 1,
        estado: 'libre',
        horario_de_autobus: id,
        publishedAt: new Date()
      }));

      // Creación en lote (más eficiente para SQLite)
      await strapi.db.query('api::asiento.asiento').createMany({
        data: asientosData
      });

      console.log(`✅ ${totalAsientos} asientos creados exitosamente`);
    } catch (error) {
      console.error('❌ Error al crear asientos:', error.message);
    }
  }
};