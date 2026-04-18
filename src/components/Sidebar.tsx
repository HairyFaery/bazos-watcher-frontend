'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from './ThemeProvider';

const navItems = [
  { 
    href: '/', 
    label: 'Produkty', 
    icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' 
  },
  { 
    href: '/searches', 
    label: 'Vyhľadávania', 
    icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' 
  },
  { 
    href: '/watched', 
    label: 'Sledované URL', 
    icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' 
  },
];

function SunIcon() {
  return (
    <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  );
}

function LogoIcon() {
  return (
    <svg className="w-7 h-7 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="w-60 bg-white dark:bg-slate-800 border-r border-zinc-200 dark:border-slate-700 fixed h-screen flex flex-col">
      <div className="p-4 border-b border-zinc-100 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LogoIcon />
            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">Bazos</span>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-slate-700 transition-colors"
            title={theme === 'dark' ? 'Prepnúť na svetlý mód' : 'Prepnúť na tmavý mód'}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </div>
      
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150
                ${isActive 
                  ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-medium border-l-2 border-emerald-500 -ml-0.5 pl-[14px]' 
                  : 'text-zinc-600 dark:text-slate-300 hover:bg-zinc-50 dark:hover:bg-slate-700/50'
                }
              `}
            >
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-zinc-100 dark:border-slate-700">
        <p className="text-xs text-zinc-400 dark:text-slate-500">
          BazosWatcher v1.0
        </p>
      </div>
    </aside>
  );
}