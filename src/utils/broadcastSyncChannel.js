const channel = new BroadcastChannel("sync_channel");

// Función para enviar datos entre pestañas
export const syncDataAcrossTabs = (type, payload) => {
  channel.postMessage({ type, payload });
};

// Función para recibir los datos en otras pestañas
export const listenForSync = (callback) => {
  channel.onmessage = (event) => {
    callback(event.data);
  };
};

// Cierra el canal cuando ya no es necesario
export const closeSyncChannel = () => {
  channel.close();
};
