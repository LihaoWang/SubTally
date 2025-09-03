/**
 * Theme detection script that runs before page renders to prevent FOUC
 * This script injects into <head> and applies theme class immediately
 */
export function ThemeScript() {
  const codeToRunOnClient = `
(function() {
  function getTheme() {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark' || saved === 'light') {
        return saved;
      }
    }
    
    // Check system preference
    if (typeof window !== 'undefined' && window.matchMedia) {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    
    return 'light';
  }

  function setTheme() {
    const theme = getTheme();
    
    // Apply theme class immediately
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Store in localStorage for future visits
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('theme', theme);
    }
    
    // Set cookie for SSR on next visit
    document.cookie = 'theme=' + theme + '; path=/; max-age=31536000; SameSite=Lax';
  }
  
  setTheme();
})()`.replace(/\n/g, '')

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: codeToRunOnClient,
      }}
    />
  )
}