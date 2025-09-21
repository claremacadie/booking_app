export default function debouncePromise(func, delay = 200) {
  let timer = null;
  let rejectPrev = null;

  return (...args) => {
    if (timer) clearTimeout(timer);
    if (rejectPrev) {
      const error = new Error('Aborted');
      error.name = 'AbortError';
      rejectPrev(error);
    }
    return new Promise((resolve, reject) => {
      rejectPrev = reject;
      timer = setTimeout(async () => {
        timer = null;
        rejectPrev = null;
        try { 
          resolve(await func(...args));
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
  };
}
