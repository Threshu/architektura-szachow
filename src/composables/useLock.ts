import { ref } from 'vue';

const LOCK_KEY='architektura_unlocked';
const PASSWORD=import.meta.env.VITE_APP_PASSWORD||'';

const isUnlocked=ref(sessionStorage.getItem(LOCK_KEY)==='true');

export function useLock () {
  function unlock (password: string): boolean {
    if(password===PASSWORD) {
      isUnlocked.value=true;
      sessionStorage.setItem(LOCK_KEY, 'true');
      return true;
    }
    return false;
  }

  function lock () {
    isUnlocked.value=false;
    sessionStorage.removeItem(LOCK_KEY);
  }

  return { isUnlocked, unlock, lock };
}
