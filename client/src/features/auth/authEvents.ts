const AUTH_INVALID_EVENT = 'pn:auth:invalid';

export const authEvents = {
  emitInvalid(): void {
    window.dispatchEvent(new CustomEvent(AUTH_INVALID_EVENT));
  },

  onInvalid(callback: () => void): () => void {
    const handler = () => callback();
    window.addEventListener(AUTH_INVALID_EVENT, handler);
    return () => window.removeEventListener(AUTH_INVALID_EVENT, handler);
  },
};
