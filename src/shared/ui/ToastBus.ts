export type ToastMessage = { id: number; text: string };

const listeners: Array<(msg: ToastMessage) => void> = [];
let counter = 0;

export function pushToast(text: string) {
  const message: ToastMessage = { id: ++counter, text };
  listeners.forEach((fn) => fn(message));
}

export function subscribeToast(listener: (msg: ToastMessage) => void) {
  listeners.push(listener);
  return () => {
    const idx = listeners.indexOf(listener);
    if (idx >= 0) listeners.splice(idx, 1);
  };
}
