export default function debounce(func, delay=200) {
    let timeout;
    console.log('debouncing');
    return (...args) => {
      if (timeout) { clearTimeout(timeout) }
      timeout = setTimeout(() => func.apply(null, args), delay);
    };
  };
