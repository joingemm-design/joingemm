import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export default function ThemeDock() {
  const { currentTheme, setCurrentTheme, themes } = useTheme();

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] p-2 glass-effect rounded-full shadow-2xl flex items-center gap-2">
      <span className="text-[8px] font-black uppercase tracking-widest px-4 opacity-30 text-[var(--text-primary)]">Themes</span>
      <div className="flex items-center gap-2 pr-2">
        {themes.map((t: any) => (
          <motion.button
            key={t.name}
            onClick={() => setCurrentTheme(t)}
            whileHover={{ scale: 1.2, y: -4 }}
            className={`w-8 h-8 rounded-full border border-black/5 cursor-pointer shadow-inner relative group ${
              currentTheme.name === t.name ? 'ring-2 ring-offset-2 ring-emerald-500' : ''
            }`}
            style={{ backgroundColor: t.bg }}
          >
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-[8px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity uppercase">
              {t.name}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}