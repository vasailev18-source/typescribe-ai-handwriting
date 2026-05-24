import { useState, useEffect } from 'react';
import { PageConfig, HandwritingStyle } from './types';
import { wrapTextIntoPages, RenderedPage } from './utils/handwritingEngine';
import A4Paper from './components/A4Paper';
import StyleStudio from './components/StyleStudio';
import TelegramSimulator from './components/TelegramSimulator';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Settings2, 
  Share2, 
  Eye, 
  Trash2, 
  BookOpen, 
  Bot, 
  Smile, 
  Edit3, 
  Compass, 
  FileText, 
  Sigma, 
  Fingerprint, 
  HelpCircle,
  Minimize2,
  Maximize2
} from 'lucide-react';

// Default preloaded handwriting presets (containing beautiful parameters)
const DEFAULT_PRESETS: HandwritingStyle[] = [
  {
    id: 'elegant-cursive',
    name: 'Изящный Курсив (Людмила С.)',
    creator: 'Людмила С.',
    description: 'Красивые наклонные прописные буквы, высокая разборчивость с классическими плавными линиями.',
    slant: 12,
    letterSpacing: 1.5,
    baselineOffset: 0,
    glyphs: {} // procedural rendering captures default paths
  },
  {
    id: 'caveat-font',
    name: 'Школьный Кавеат (Ольга К.)',
    creator: 'Ольга К.',
    description: 'Повседневный, аккуратный русско-английский почерк на базе классического шрифта Caveat.',
    slant: 3,
    letterSpacing: 2.5,
    baselineOffset: 1,
    glyphs: {},
    useFont: true,
    fontFamily: 'Caveat'
  },
  {
    id: 'marck-font',
    name: 'Каллиграфия Марк (Елена В.)',
    creator: 'Елена В.',
    description: 'Очень плавное и изящное традиционное русско-английское письмо.',
    slant: 8,
    letterSpacing: 1.0,
    baselineOffset: 3,
    glyphs: {},
    useFont: true,
    fontFamily: 'Marck Script'
  },
  {
    id: 'badscript-font',
    name: 'Повседневный БедСкрипт (Николай П.)',
    creator: 'Николай П.',
    description: 'Красивый неравномерный почерк гелиевой ручкой с реалистичными колебаниями.',
    slant: 4,
    letterSpacing: 1.8,
    baselineOffset: 2,
    glyphs: {},
    useFont: true,
    fontFamily: 'Bad Script'
  },
  {
    id: 'neucha-font',
    name: 'Студенческий Конспект (Павел С.)',
    creator: 'Павел С.',
    description: 'Отличный полупечатный почерк, идеально подходящий для лекций и списков.',
    slant: 0,
    letterSpacing: 3.5,
    baselineOffset: 1,
    glyphs: {},
    useFont: true,
    fontFamily: 'Neucha'
  },
  {
    id: 'compact-rounded',
    name: 'Компактный Округлый (Артем Д.)',
    creator: 'Артем Д.',
    description: 'Более плотные, уютные буквы с округлыми элементами и близким расположением строк.',
    slant: -3,
    letterSpacing: -1,
    baselineOffset: 2,
    glyphs: {}
  },
  {
    id: 'minimalist-print',
    name: 'Печатный Минимализм (Анна К.)',
    creator: 'Анна К.',
    description: 'Современные печатные формы букв, идеальны для структурированных научных записей.',
    slant: 4,
    letterSpacing: 2.2,
    baselineOffset: -1,
    glyphs: {}
  },
  {
    id: 'neat-school',
    name: 'Каллиграфическая Школа (Виктор П.)',
    creator: 'Виктор П.',
    description: 'Идеальное академическое школьное письмо, сбалансированный наклон и округлости.',
    slant: 15,
    letterSpacing: 2.5,
    baselineOffset: 0,
    glyphs: {}
  },
  {
    id: 'messy-student',
    name: 'Студенческая Спешка (Дмитрий К.)',
    creator: 'Дмитрий К.',
    description: 'Спешные студенческие конспекты с сильным волнообразным смещением строк.',
    slant: 22,
    letterSpacing: 0.5,
    baselineOffset: -2,
    glyphs: {}
  },
  {
    id: 'bumpy-road',
    name: 'Трясущийся Автобус (Рита М.)',
    creator: 'Рита М.',
    description: 'Дрожащие волнообразные буквы, имитирующие письмо от руки в трясущемся транспорте.',
    slant: -5,
    letterSpacing: -1.5,
    baselineOffset: 4,
    glyphs: {}
  },
  {
    id: 'architect-draft',
    name: 'Чертеж Архитектора (Олег Г.)',
    creator: 'Олег Г.',
    description: 'Чистый чертежный шрифт с преобладанием заглавных букв и широкими пробелами.',
    slant: 0,
    letterSpacing: 3.0,
    baselineOffset: -1,
    glyphs: {}
  },
  {
    id: 'child-play',
    name: 'Детский Почерк (Кира С.)',
    creator: 'Кира С.',
    description: 'Крупные, неровные округлые буквы с гигантскими интервалами и лёгким наклоном.',
    slant: -2,
    letterSpacing: 4.5,
    baselineOffset: 3,
    glyphs: {}
  },
  {
    id: 'left-handed',
    name: 'Леворукий Наклон (Катя В.)',
    creator: 'Катя В.',
    description: 'Особый наклон влево (почерк левши) с аккуратным плотным выравниванием букв.',
    slant: -14,
    letterSpacing: 1.2,
    baselineOffset: 1,
    glyphs: {}
  },
  {
    id: 'vintage-letter',
    name: 'Винтажное Письмо (Михаил Т.)',
    creator: 'Михаил Т.',
    description: 'Изысканный каллиграфический стиль переписки XIX века с высоким наклоном.',
    slant: 18,
    letterSpacing: 3.5,
    baselineOffset: -2,
    glyphs: {}
  },
  {
    id: 'medical-scribble',
    name: 'Врачебный Рецепт (Др. Петров)',
    creator: 'Др. Петров',
    description: 'Сверхбыстрые наброски врача с высокой хаотичностью и крошечными интервалами.',
    slant: 25,
    letterSpacing: -2.5,
    baselineOffset: -4,
    glyphs: {}
  },
  {
    id: 'sharp-geometric',
    name: 'Острая Угловатость (Вадим Ф.)',
    creator: 'Вадим Ф.',
    description: 'Футуристичные угловатые штрихи с низкой скруглённостью букв.',
    slant: 5,
    letterSpacing: 2.0,
    baselineOffset: 2,
    glyphs: {}
  }
];

// Presets mapping that updates sliders and config details dynamically to match style personalities
const STYLE_CONFIG_PRESETS: Record<string, Partial<PageConfig>> = {
  'elegant-cursive': {
    tiltVariance: 2,
    spacingVariance: 0.4,
    baselineVariance: 0.2,
    noiseLevel: 0.2,
    fontFamily: 'serif',
    strokeThickness: 1.2,
    lineSpacing: 28,
  },
  'caveat-font': {
    tiltVariance: 3.5,
    spacingVariance: 0.8,
    baselineVariance: 0.6,
    noiseLevel: 0.3,
    fontFamily: 'sans',
    strokeThickness: 1.5,
    lineSpacing: 28,
  },
  'marck-font': {
    tiltVariance: 2.0,
    spacingVariance: 0.5,
    baselineVariance: 0.4,
    noiseLevel: 0.2,
    fontFamily: 'serif',
    strokeThickness: 1.3,
    lineSpacing: 30,
  },
  'badscript-font': {
    tiltVariance: 5.0,
    spacingVariance: 1.2,
    baselineVariance: 0.9,
    noiseLevel: 0.5,
    fontFamily: 'serif',
    strokeThickness: 1.4,
    lineSpacing: 28,
  },
  'neucha-font': {
    tiltVariance: 1.5,
    spacingVariance: 0.4,
    baselineVariance: 0.3,
    noiseLevel: 0.15,
    fontFamily: 'sans',
    strokeThickness: 1.6,
    lineSpacing: 28,
  },
  'compact-rounded': {
    tiltVariance: 3,
    spacingVariance: 0.5,
    baselineVariance: 0.3,
    noiseLevel: 0.3,
    fontFamily: 'sans',
    strokeThickness: 1.6,
    lineSpacing: 24,
  },
  'minimalist-print': {
    tiltVariance: 1,
    spacingVariance: 0.2,
    baselineVariance: 0.1,
    noiseLevel: 0.1,
    fontFamily: 'sans',
    strokeThickness: 1.0,
    lineSpacing: 30,
  },
  'neat-school': {
    tiltVariance: 1.5,
    spacingVariance: 0.3,
    baselineVariance: 0.15,
    noiseLevel: 0.15,
    fontFamily: 'serif',
    strokeThickness: 1.3,
    lineSpacing: 28,
  },
  'messy-student': {
    tiltVariance: 7,
    spacingVariance: 1.5,
    baselineVariance: 1.2,
    noiseLevel: 1.1,
    fontFamily: 'sans',
    strokeThickness: 1.5,
    lineSpacing: 26,
  },
  'bumpy-road': {
    tiltVariance: 10,
    spacingVariance: 2.2,
    baselineVariance: 1.8,
    noiseLevel: 1.6,
    fontFamily: 'sans',
    strokeThickness: 1.7,
    lineSpacing: 25,
  },
  'architect-draft': {
    tiltVariance: 0.5,
    spacingVariance: 0.1,
    baselineVariance: 0.05,
    noiseLevel: 0.05,
    fontFamily: 'sans',
    strokeThickness: 1.1,
    lineSpacing: 32,
  },
  'child-play': {
    tiltVariance: 8,
    spacingVariance: 2.0,
    baselineVariance: 1.5,
    noiseLevel: 1.3,
    fontFamily: 'sans',
    strokeThickness: 2.0,
    lineSpacing: 32,
  },
  'left-handed': {
    tiltVariance: 4,
    spacingVariance: 0.7,
    baselineVariance: 0.5,
    noiseLevel: 0.4,
    fontFamily: 'serif',
    strokeThickness: 1.3,
    lineSpacing: 28,
  },
  'vintage-letter': {
    tiltVariance: 3,
    spacingVariance: 0.8,
    baselineVariance: 0.6,
    noiseLevel: 0.5,
    fontFamily: 'serif',
    strokeThickness: 1.5,
    lineSpacing: 34,
  },
  'medical-scribble': {
    tiltVariance: 12,
    spacingVariance: 2.5,
    baselineVariance: 2.0,
    noiseLevel: 2.0,
    fontFamily: 'sans',
    strokeThickness: 1.4,
    lineSpacing: 22,
  },
  'sharp-geometric': {
    tiltVariance: 2,
    spacingVariance: 0.4,
    baselineVariance: 0.3,
    noiseLevel: 0.25,
    fontFamily: 'sans',
    strokeThickness: 1.2,
    lineSpacing: 28,
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'generate' | 'studio' | 'telegram'>('generate');
  
  // Custom Styles state
  const [styles, setStyles] = useState<HandwritingStyle[]>(DEFAULT_PRESETS);
  const [selectedStyleId, setSelectedStyleId] = useState<string>('elegant-cursive');
  const activeStyle = styles.find(s => s.id === selectedStyleId) || styles[0];

  // Sheet configuration state
  const [config, setConfig] = useState<PageConfig>({
    paperType: 'lined',
    fontFamily: 'sans',
    inkColor: 'blue',
    penStyle: 'gel',
    lineSpacing: 28,
    letterSpacing: 1,
    wordSpacing: 16,
    tiltVariance: 3,
    spacingVariance: 0.8,
    baselineVariance: 0.4,
    strokeThickness: 1.4,
    noiseLevel: 0.3,
    margins: { top: 45, bottom: 45, left: 50, right: 50 },
    showMargins: true,
    curvedLines: true,
    paperTexture: 'clean',
    paperEffect: 'none'
  });

  // Source text inputs
  const [textInput, setTextInput] = useState<string>(
    `Дорогой друг! Добро пожаловать.\nЭто MVP система синтеза рукописного текста.\n\nПочерк реалистично варьирует наклон и высоту каждой буквы!\nSupport for uppercase & lowercase English: Happy Handwriting!\n\nВы можете вставлять формулы LaTeX прямо на лист:\n$$ \\frac{\\alpha + \\beta}{x^2} $$\n\nЖелаем успехов в учебе и работе!\n- Команда TypeScribe`
  );

  const [fontSize, setFontSize] = useState<number>(24);
  const [signatureName, setSignatureName] = useState<string>('А. Климов');
  const [showSignature, setShowSignature] = useState<boolean>(true);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);

  // Generate layouts
  const renderedPages = wrapTextIntoPages(
    textInput + (showSignature ? `\n\n\n\n\n\n\n\n\n                                                   ${signatureName}` : ''),
    config,
    activeStyle,
    fontSize
  );

  // Apply simulated Telegram Theme variables
  const handleApplyTelegramTheme = (tgTheme: any) => {
    if (!tgTheme) return;
    document.documentElement.style.setProperty('--tg-theme-bg-color', tgTheme.bg_color || '#ffffff');
    document.documentElement.style.setProperty('--tg-theme-text-color', tgTheme.text_color || '#333');
    document.documentElement.style.setProperty('--tg-theme-button-color', tgTheme.button_color || '#2481cc');
  };

  const insertLaTeXTemplate = (template: string) => {
    setTextInput(prev => prev + `\n$$ ${template} $$`);
  };

  const handleAISummarize = async () => {
    setIsTranslating(true);
    try {
      const response = await fetch('/api/gemini/optimize-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textInput })
      });
      const data = await response.json();
      if (data.result) {
        setTextInput(data.result);
      }
    } catch {
      alert('Не удалось оптимизировать структуру текста без настроенного ключа Gemini.');
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased overflow-x-hidden pb-10">
      {/* Brand Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold shadow-lg shadow-blue-200">
              <Edit3 size={20} />
            </div>
            <div>
              <h1 id="app-title" className="text-sm font-bold tracking-tight text-gray-950 flex items-center gap-2">
                TypeScribe AI Handwriting
                <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] px-2 py-0.5 rounded-full font-bold">MVP 2.0</span>
              </h1>
              <p className="text-[10.5px] text-gray-400 font-semibold tracking-wide">
                ЦИФРОВАЯ СИСТЕМА ИМИТАЦИИ ПОЧЕРКА И ФОРМУЛ LaTeX
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
            <button
              onClick={() => setActiveTab('generate')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase rounded-lg cursor-pointer transition-all ${
                activeTab === 'generate' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <FileText size={14} />
              <span>Генератор листов</span>
            </button>
            <button
              onClick={() => setActiveTab('studio')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase rounded-lg cursor-pointer transition-all ${
                activeTab === 'studio' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Compass size={14} />
              <span>Студия стилей</span>
            </button>
            <button
              onClick={() => setActiveTab('telegram')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase rounded-lg cursor-pointer transition-all ${
                activeTab === 'telegram' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Bot size={14} />
              <span>Фид Telegram-бота</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-8">
        <AnimatePresence mode="wait">
          {activeTab === 'generate' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              {/* Left Column Controls */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                
                {/* Handwriting Selection Panel */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">
                    Выберите стиль почерка
                  </span>
                  
                  <div className="flex flex-col gap-2 mt-3">
                    {styles.map(style => (
                      <button
                        key={style.id}
                        onClick={() => {
                          setSelectedStyleId(style.id);
                          const preset = STYLE_CONFIG_PRESETS[style.id];
                          if (preset) {
                            setConfig(prev => ({ ...prev, ...preset }));
                          }
                        }}
                        className={`w-full flex items-start gap-3 p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                          selectedStyleId === style.id
                            ? 'bg-blue-50/50 border-blue-500 text-blue-900'
                            : 'bg-white border-gray-100 hover:border-gray-200 text-gray-700'
                        }`}
                      >
                        <div className="w-5 h-5 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                          ✍️
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-0.5">
                            <span className="text-xs font-bold">{style.name}</span>
                            <span className="text-[9.5px] font-semibold text-gray-400">от {style.creator}</span>
                          </div>
                          <p className="text-[11px] text-gray-500 leading-normal font-medium">{style.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Text & LaTeX input panel */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block">
                      Текст для конвертации
                    </span>
                    <button
                      onClick={handleAISummarize}
                      disabled={isTranslating}
                      className="flex items-center gap-1 text-[11px] font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-md hover:bg-purple-100 border border-purple-100 transition-all cursor-pointer"
                    >
                      <Sparkles size={11} />
                      <span>{isTranslating ? 'Улучшение...' : 'Улучшить с AI'}</span>
                    </button>
                  </div>

                  <textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    rows={8}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-blue-500 outline-none rounded-xl p-4 text-xs font-medium leading-relaxed font-sans shadow-inner placeholder-gray-400"
                    placeholder="Введите ваши конспекты, абзацы или LaTeX формулы..."
                  />

                  {/* Math Injection Templates */}
                  <div className="mt-3">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block mb-2 tracking-wider flex items-center gap-1">
                      <Sigma size={11} className="text-blue-500" />
                      Вставить математический шаблон
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        onClick={() => insertLaTeXTemplate('\\frac{\\alpha + \\beta}{x^2}')}
                        className="bg-gray-50 border border-gray-200 hover:border-blue-500 text-[10.5px] font-semibold px-2.5 py-1 rounded-md transition-all cursor-pointer"
                      >
                        Дробь
                      </button>
                      <button
                        onClick={() => insertLaTeXTemplate('\\int_{a}^{b} x^2 dx')}
                        className="bg-gray-50 border border-gray-200 hover:border-blue-500 text-[10.5px] font-semibold px-2.5 py-1 rounded-md transition-all cursor-pointer"
                      >
                        Интеграл с пределами
                      </button>
                      <button
                        onClick={() => insertLaTeXTemplate('\\sqrt{a^2 + b^2}')}
                        className="bg-gray-50 border border-gray-200 hover:border-blue-500 text-[10.5px] font-semibold px-2.5 py-1 rounded-md transition-all cursor-pointer"
                      >
                        Квадратный корень
                      </button>
                      <button
                        onClick={() => insertLaTeXTemplate('\\sum_{k=1}^{n} k')}
                        className="bg-gray-50 border border-gray-200 hover:border-blue-500 text-[10.5px] font-semibold px-2.5 py-1 rounded-md transition-all cursor-pointer"
                      >
                        Сумма
                      </button>
                    </div>
                  </div>
                </div>

                {/* Margins & Sizing Adjusters */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <Settings2 className="text-blue-600" size={16} />
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block">
                      Параметры разметки
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] sm:text-[11px] font-bold text-gray-400 block mb-1">ТИП БУМАГИ</label>
                      <select
                        value={config.paperType}
                        onChange={(e) => setConfig({ ...config, paperType: e.target.value as any })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs font-bold"
                      >
                        <option value="lined">Линейка</option>
                        <option value="squared">Клетка</option>
                        <option value="blank">Чистый лист</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] sm:text-[11px] font-bold text-gray-400 block mb-1">ЦВЕТ ЧЕРНИЛ</label>
                      <select
                        value={config.inkColor}
                        onChange={(e) => setConfig({ ...config, inkColor: e.target.value as any })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs font-bold"
                      >
                        <option value="blue">Синий</option>
                        <option value="black">Черный</option>
                        <option value="red">Красный</option>
                        <option value="purple">Фиолетовый</option>
                        <option value="green">Зеленый</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] sm:text-[11px] font-bold text-gray-400 block mb-1">СТИЛЬ ТЕКСТА</label>
                      <select
                        value={config.fontFamily}
                        onChange={(e) => setConfig({ ...config, fontFamily: e.target.value as any })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs font-bold"
                      >
                        <option value="sans">Без засечек</option>
                        <option value="serif">С засечками</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] sm:text-[11px] font-bold text-gray-400 block mb-1">ТЕКСТУРА БУМАГИ</label>
                      <select
                        value={config.paperTexture || 'clean'}
                        onChange={(e) => setConfig({ ...config, paperTexture: e.target.value as any })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs font-bold text-blue-600 border-blue-100"
                      >
                        <option value="clean">Чистый цифровой лист</option>
                        <option value="fiber">Волокнистая бумага</option>
                        <option value="copy">Скан / Ксерокопия</option>
                        <option value="vintage">Винтажная бумага (Под чай)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] sm:text-[11px] font-bold text-gray-400 block mb-1">ОСВЕЩЕНИЕ И СКАН-ЭФФЕКТЫ</label>
                      <select
                        value={config.paperEffect || 'none'}
                        onChange={(e) => setConfig({ ...config, paperEffect: e.target.value as any })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs font-bold text-purple-600 border-purple-100"
                      >
                        <option value="none">Без эффектов</option>
                        <option value="shadow">Тень от телефона / камеры</option>
                        <option value="crumpled">Мятый лист</option>
                        <option value="scanner">Фильтр CamScanner (Контрастный)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="text-[10px] sm:text-[11px] font-bold text-gray-400 block mb-1">КРАСНЫЕ ПОЛЯ</label>
                      <button
                        onClick={() => setConfig({ ...config, showMargins: !config.showMargins })}
                        className={`w-full py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                          config.showMargins
                            ? 'bg-blue-50 border-blue-200 text-blue-600'
                            : 'bg-white border-gray-200 text-gray-650'
                        }`}
                      >
                        {config.showMargins ? 'Показать поля' : 'Без полей'}
                      </button>
                    </div>
                  </div>

                  {/* Range inputs for physics simulation */}
                  <div className="flex flex-col gap-3 mt-1">
                    <div>
                      <div className="flex justify-between items-center text-[11px] font-semibold text-gray-400 mb-1">
                        <span>РАЗБРОС НАКЛОНА БУКВ</span>
                        <span className="text-gray-700">{config.tiltVariance}°</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="8"
                        step="0.5"
                        value={config.tiltVariance}
                        onChange={(e) => setConfig({ ...config, tiltVariance: parseFloat(e.target.value) })}
                        className="w-full h-1 bg-gray-100 rounded-lg appearance-none accent-blue-600 cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-[11px] font-semibold text-gray-400 mb-1">
                        <span>РАЗБРОС ИНТЕРВАЛОВ (ХАОС)</span>
                        <span className="text-gray-700">{config.spacingVariance}px</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="2"
                        step="0.1"
                        value={config.spacingVariance}
                        onChange={(e) => setConfig({ ...config, spacingVariance: parseFloat(e.target.value) })}
                        className="w-full h-1 bg-gray-100 rounded-lg appearance-none accent-blue-600 cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-[11px] font-semibold text-gray-400 mb-1">
                        <span>ВОЛНИСТОСТЬ СТРОКИ</span>
                        <span className="text-gray-700">{config.baselineVariance}px</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="2"
                        step="0.1"
                        value={config.baselineVariance}
                        onChange={(e) => setConfig({ ...config, baselineVariance: parseFloat(e.target.value) })}
                        className="w-full h-1 bg-gray-100 rounded-lg appearance-none accent-blue-600 cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-[11px] font-semibold text-gray-400 mb-1">
                        <span>МЕЖСТРОЧНЫЙ ИНТЕРВАЛ</span>
                        <span className="text-gray-700">{config.lineSpacing}px</span>
                      </div>
                      <input
                        type="range"
                        min="22"
                        max="38"
                        step="1"
                        value={config.lineSpacing}
                        onChange={(e) => setConfig({ ...config, lineSpacing: parseInt(e.target.value) })}
                        className="w-full h-1 bg-gray-100 rounded-lg appearance-none accent-blue-600 cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-[11px] font-semibold text-gray-400 mb-1">
                        <span>РАЗМЕР ШРИФТА (ПОЧЕРКА)</span>
                        <span className="text-gray-700">{fontSize}px</span>
                      </div>
                      <input
                        type="range"
                        min="16"
                        max="36"
                        step="1"
                        value={fontSize}
                        onChange={(e) => setFontSize(parseInt(e.target.value))}
                        className="w-full h-1 bg-gray-100 rounded-lg appearance-none accent-blue-600 cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-[11px] font-semibold text-gray-400 mb-1">
                        <span>ТОЛЩИНА ПЕРА (ЛИНИИ)</span>
                        <span className="text-gray-700">{config.strokeThickness}px</span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="3.0"
                        step="0.1"
                        value={config.strokeThickness}
                        onChange={(e) => setConfig({ ...config, strokeThickness: parseFloat(e.target.value) })}
                        className="w-full h-1 bg-gray-100 rounded-lg appearance-none accent-blue-600 cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-[11px] font-semibold text-gray-400 mb-1">
                        <span>АККУРАТНОСТЬ И ПОСТОЯНСТВО</span>
                        <span className="text-gray-700">{((1 - Math.min(config.noiseLevel / 2.0, 1)) * 100).toFixed(0)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="2"
                        step="0.1"
                        value={config.noiseLevel}
                        onChange={(e) => setConfig({ ...config, noiseLevel: parseFloat(e.target.value) })}
                        className="w-full h-1 bg-gray-100 rounded-lg appearance-none accent-blue-600 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Signature builder */}
                  <div className="border-t border-gray-100 pt-3.5 mt-1">
                    <span className="text-[11px] font-bold text-gray-400 block mb-2 tracking-wider flex items-center gap-1">
                      <Fingerprint size={12} className="text-blue-500" />
                      Генератор чернильной подписи
                    </span>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={signatureName}
                        onChange={(e) => setSignatureName(e.target.value)}
                        placeholder="Имя подписи"
                        className="flex-1 bg-gray-50 border border-gray-200 outline-none rounded-lg p-2 text-xs font-semibold"
                      />
                      <button
                        onClick={() => setShowSignature(!showSignature)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                          showSignature 
                            ? 'bg-blue-50 border-blue-200 text-blue-600' 
                            : 'bg-white border-gray-200 text-gray-600'
                        }`}
                      >
                        {showSignature ? 'Выключить' : 'Включить'}
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column Canvas Preview */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-4">
                    Реалистичный предпросмотр документа
                  </span>
                  <A4Paper pages={renderedPages} config={config} fontSize={fontSize} style={activeStyle} />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'studio' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <StyleStudio 
                currentStyle={activeStyle} 
                onSaveStyle={(newStyle) => {
                  setStyles(prev => {
                    const idx = prev.findIndex(s => s.id === newStyle.id);
                    if (idx >= 0) {
                      const updated = [...prev];
                      updated[idx] = newStyle;
                      return updated;
                    }
                    return [...prev, newStyle];
                  });
                  setSelectedStyleId(newStyle.id);
                }} 
                availableStyles={styles}
                onDeleteStyle={(id) => {
                  setStyles(prev => prev.filter(s => s.id !== id));
                  if (selectedStyleId === id) {
                    setSelectedStyleId('elegant-cursive');
                  }
                }}
              />
            </motion.div>
          )}

          {activeTab === 'telegram' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <TelegramSimulator 
                onApplyTelegramTheme={handleApplyTelegramTheme}
                mockUser={{
                  id: 10492850,
                  first_name: 'Александр',
                  last_name: 'Климов',
                  username: 'alex_klim'
                }}
                textInput={textInput}
                setTextInput={setTextInput}
                selectedStyleId={selectedStyleId}
                setSelectedStyleId={setSelectedStyleId}
                config={config}
                setConfig={setConfig}
                fontSize={fontSize}
                setFontSize={setFontSize}
                activeStyle={activeStyle}
                availableStyles={styles}
                onOpenGeneratorWithText={(text) => {
                  setTextInput(text);
                  setActiveTab('generate');
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
