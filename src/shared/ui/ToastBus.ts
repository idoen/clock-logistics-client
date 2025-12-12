export interface ToastMessage {
  id: number;
  message: string;
}

type Listener = (messages: ToastMessage[]) => void;

class ToastBus {
  private listeners: Set<Listener> = new Set();
  private messages: ToastMessage[] = [];

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    listener(this.messages);
    return () => this.listeners.delete(listener);
  }

  push(message: ToastMessage) {
    this.messages = [...this.messages, message];
    this.emit();
    setTimeout(() => {
      this.messages = this.messages.filter((m) => m.id !== message.id);
      this.emit();
    }, 3000);
  }

  private emit() {
    for (const listener of this.listeners) {
      listener(this.messages);
    }
  }
}

export const toastBus = new ToastBus();
