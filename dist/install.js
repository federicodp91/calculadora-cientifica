if (location.protocol === 'https:' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(error => {
    console.warn('No se pudo preparar el uso sin conexión.', error);
  });
}
