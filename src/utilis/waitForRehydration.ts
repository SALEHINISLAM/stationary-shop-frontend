import { store } from "../redux/store";

type AuthStateWithPersist = ReturnType<typeof store.getState>['auth'] & {
    _persist?: {
      version: number;
      rehydrated: boolean;
    };
  };

export async function waitForRehydration(): Promise<void> {
  return new Promise((resolve) => {
    const check = () => {
      const state = store.getState()
      const authState=state.auth as AuthStateWithPersist
      if (authState._persist?.rehydrated) {
        resolve();
      } else {
        setTimeout(check, 50); // Poll every 50ms
      }
    };
    check();
  });
}
