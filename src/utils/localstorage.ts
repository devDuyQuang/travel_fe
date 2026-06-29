export const setLocalStorage = <T>(name: string, items: T[]): void => {
   if (typeof window === 'undefined' || !window.localStorage) {
      return;
   }

   localStorage.setItem(name, JSON.stringify(items));
};

export const getLocalStorage = <T>(name: string): T[] => {
   if (typeof window !== 'undefined' && window.localStorage) {
      const data = localStorage.getItem(name);
      if (data) {
         try {
            return JSON.parse(data) as T[];
         } catch {
            return [];
         }
      }
   }
   return [];
};
