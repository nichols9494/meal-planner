// Tiny localStorage-backed helper. It mimics a simple get/set shape so
// the rest of the app's code barely has to change. Everything (your
// custom meals and each week's plan) is saved right in your browser.

export const storage = {
  async get(key) {
    const value = localStorage.getItem(key);
    return value === null ? null : { key, value };
  },
  async set(key, value) {
    localStorage.setItem(key, value);
    return { key, value };
  },
};
