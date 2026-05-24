import { useState, useEffect } from 'react';
import { PageConfig, HandwritingStyle } from '../types';
import { PAGE_HEIGHT, PAGE_WIDTH, parseLaTeXFormula, RenderedPage } from '../utils/handwritingEngine';
import { Download, FileDown, Eye, FileText, ChevronLeft, ChevronRight, Sparkles, Printer } from 'lucide-react';

interface A4PaperProps {
  pages: RenderedPage[];
  config: PageConfig;
  fontSize: number;
  style?: HandwritingStyle;
}

export default function A4Paper({ pages, config, fontSize, style }: A4PaperProps) {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [animationSpeed, setAnimationSpeed] = useState<number>(1.5); // seconds to draw
  const [renderTrigger, setRenderTrigger] = useState<number>(0);
  const [isExportingPDF, setIsExportingPDF] = useState<boolean>(false);
  const [pdfProgress, setPdfProgress] = useState<number>(0);

  useEffect(() => {
    // Triggers render reset for animations
    setRenderTrigger(prev => prev + 1);
  }, [pages, currentPage, config.inkColor, config.penStyle]);

  const inkColorHex = {
    blue: '#1d3f94',
    black: '#1f1f21',
    red: '#b82121',
    purple: '#65239a',
    green: '#1b633d'
  }[config.inkColor];

  const handlePrint = () => {
    window.print();
  };

  const downloadSVG = () => {
    const svgElement = document.getElementById(`a4-svg-page-${currentPage}`);
    if (!svgElement) return;

    const svgString = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `handwritten-page-${currentPage + 1}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const downloadPNG = () => {
    const svgElement = document.getElementById(`a4-svg-page-${currentPage}`);
    if (!svgElement) return;

    // Serialize SVG with XMLSerializer
    const svgString = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      // Render with 2x scale for higher resolution print quality!
      const scale = 2.0; 
      canvas.width = PAGE_WIDTH * scale;
      canvas.height = PAGE_HEIGHT * scale;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Soft creamy background fill matching SVG's #FCFCFA
        ctx.fillStyle = '#FCFCFA';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0);
        
        try {
          const pngUrl = canvas.toDataURL('image/png');
          const downloadLink = document.createElement('a');
          downloadLink.href = pngUrl;
          downloadLink.download = `handwritten-page-${currentPage + 1}.png`;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        } catch (err) {
          console.error("PNG conversion failed", err);
        }
      }
      URL.revokeObjectURL(svgUrl);
    };
    img.crossOrigin = 'anonymous';
    img.src = svgUrl;
  };

  const downloadPDF = async () => {
    if (isExportingPDF) return;
    setIsExportingPDF(true);
    setPdfProgress(5);
    const originalPage = currentPage;
    
    try {
      const { jsPDF } = await import('jspdf');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [PAGE_WIDTH, PAGE_HEIGHT]
      });
      
      for (let i = 0; i < pages.length; i++) {
        setCurrentPage(i);
        setPdfProgress(Math.round(((i + 0.1) / pages.length) * 100));
        
        // Wait briefly for state & DOM transition
        await new Promise(resolve => setTimeout(resolve, i === 0 ? 150 : 80));
        
        const svgElement = document.getElementById(`a4-svg-page-${i}`);
        if (!svgElement) continue;
        
        // Parse and inject Google Fonts inside the serialized SVG definitions
        const parsedDoc = new DOMParser().parseFromString(
          new XMLSerializer().serializeToString(svgElement),
          'image/svg+xml'
        );
        const svgDocElement = parsedDoc.documentElement;
        
        // Find or create defs
        const defsElement = svgDocElement.getElementsByTagName('defs')[0] || svgDocElement.insertBefore(parsedDoc.createElementNS('http://www.w3.org/2000/svg', 'defs'), svgDocElement.firstChild);
        const styleElement = parsedDoc.createElementNS('http://www.w3.org/2000/svg', 'style');
        styleElement.textContent = `
          @import url('https://fonts.googleapis.com/css2?family=Bad+Script&family=Caveat:wght@400;700&family=Indie+Flower&family=Kalam:wght@400;700&family=Marck+Script&family=Neucha&family=Playpen+Sans:wght@400;600&display=swap');
        `;
        defsElement.appendChild(styleElement);
        
        const svgString = new XMLSerializer().serializeToString(svgDocElement);
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);
        
        const img = await new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = svgUrl;
        });
        
        const canvas = document.createElement('canvas');
        const scale = 1.35;
        canvas.width = PAGE_WIDTH * scale;
        canvas.height = PAGE_HEIGHT * scale;
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = getPaperBgFill();
          // Support solid vintage tea-dye fallback
          if (config.paperTexture === 'vintage') {
            ctx.fillStyle = '#edd4af';
          }
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          ctx.scale(scale, scale);
          ctx.drawImage(img, 0, 0);
          
          const pngData = canvas.toDataURL('image/png');
          if (i > 0) {
            pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT], 'portrait');
          }
          pdf.addImage(pngData, 'PNG', 0, 0, PAGE_WIDTH, PAGE_HEIGHT);
        }
        
        URL.revokeObjectURL(svgUrl);
        setPdfProgress(Math.round(((i + 1) / pages.length) * 100));
      }
      
      pdf.save(`handwritten-document-${Date.now()}.pdf`);
    } catch (err) {
      console.error("Failed to generate PDF:", err);
    } finally {
      setCurrentPage(originalPage);
      setIsExportingPDF(false);
      setPdfProgress(0);
    }
  };
   
  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const getPaperBgFill = () => {
    switch (config.paperTexture) {
      case 'fiber': return '#faf7f0';
      case 'copy': return '#e6e6e4';
      case 'vintage': return 'url(#vintage-tea-dye)';
      default: return '#FCFCFA';
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Settings Action Row */}
      <div className="w-full flex flex-wrap gap-2 justify-between items-center bg-gray-50 border border-gray-100 p-3 rounded-xl mb-4 text-xs font-medium">
        <div className="flex items-center gap-2">
          <span className="text-gray-500">Страница {currentPage + 1} из {pages.length}</span>
          <div className="flex gap-1">
            <button
              onClick={prevPage}
              disabled={currentPage === 0}
              className="p-1.5 rounded bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={nextPage}
              disabled={currentPage === pages.length - 1}
              className="p-1.5 rounded bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-40 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-gray-500">Анимация письма:</span>
            <button
              onClick={() => setIsAnimating(!isAnimating)}
              className={`px-3 py-1 rounded-md text-[11px] transition-colors ${
                isAnimating 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {isAnimating ? 'Выключить' : 'Начать письмо'}
            </button>
          </div>

          <div className="h-4 w-px bg-gray-300"></div>

          <button
            onClick={downloadSVG}
            className="flex items-center gap-1 bg-white border border-gray-300 hover:border-blue-500 px-3 py-1.5 rounded-lg text-gray-700 hover:text-blue-600 transition-all cursor-pointer"
          >
            <FileDown size={14} />
            <span>Скачать SVG</span>
          </button>

          <button
            onClick={downloadPNG}
            className="flex items-center gap-1 bg-white border border-gray-300 hover:border-blue-500 px-3 py-1.5 rounded-lg text-gray-700 hover:text-blue-600 transition-all cursor-pointer"
          >
            <Download size={14} />
            <span>Скачать PNG</span>
          </button>
          
          <button
            onClick={downloadPDF}
            disabled={isExportingPDF}
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-sm disabled:opacity-50"
          >
            <Printer size={14} />
            <span>{isExportingPDF ? `Экспорт PDF (${pdfProgress}%)` : 'Скачать PDF'}</span>
          </button>
        </div>
      </div>

      {/* A4 Sheet Container */}
      <div 
        id="a4-sheet-container"
        className="relative bg-white shadow-2xl rounded-sm border border-gray-200/50 overflow-hidden select-none print:shadow-none print:border-0 print:m-0 print:p-0"
        style={{
          width: '100%',
          maxWidth: `${PAGE_WIDTH}px`,
          aspectRatio: `${PAGE_WIDTH} / ${PAGE_HEIGHT}`,
        }}
      >
        <svg
          key={renderTrigger}
          id={`a4-svg-page-${currentPage}`}
          className="w-full h-full"
          viewBox={`0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* DEFINITIONS FOR SHEET DESIGN GRIDS & FILTERS */}
          <defs>
            {/* Margins */}
            {config.showMargins && (
              <pattern id="margins" width={PAGE_WIDTH} height={PAGE_HEIGHT} patternUnits="userSpaceOnUse">
                <line x1={config.margins.left} y1="0" x2={config.margins.left} y2={PAGE_HEIGHT} stroke="#ec7c7c" strokeWidth="1.2" strokeDasharray="4 2" />
                <line x1={PAGE_WIDTH - config.margins.right} y1="0" x2={PAGE_WIDTH - config.margins.right} y2={PAGE_HEIGHT} stroke="#ec7c7c" strokeWidth="1" strokeDasharray="4 2" />
              </pattern>
            )}

            {/* Lined notebook grid paper layout */}
            {config.paperType === 'lined' && (
              <pattern id="lined-grid" width={PAGE_WIDTH} height={config.lineSpacing} patternUnits="userSpaceOnUse">
                <line x1="0" y1={config.lineSpacing} x2={PAGE_WIDTH} y2={config.lineSpacing} stroke="#cce6ff" strokeWidth="0.8" />
              </pattern>
            )}

            {/* Squared paper grid pattern */}
            {config.paperType === 'squared' && (
              <pattern id="squared-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect width="20" height="20" fill="none" stroke="#e1f0fe" strokeWidth="0.7" />
              </pattern>
            )}

            {/* Vintage tea dye layout gradient */}
            <linearGradient id="vintage-tea-dye" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f4ebdb" />
              <stop offset="40%" stopColor="#edd4af" />
              <stop offset="80%" stopColor="#dfbe8c" />
              <stop offset="100%" stopColor="#d5aa70" />
            </linearGradient>

            {/* Organic fiber texture pattern */}
            <pattern id="fiber-texture" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M10,25 Q13,27 18,24 M45,65 Q48,60 52,63 M75,15 Q78,13 83,16 M90,85 Q85,88 81,83" stroke="#e1d7bb" strokeWidth="0.5" fill="none" opacity="0.4" />
              <path d="M30,90 Q33,93 37,89 M65,115 Q68,110 72,113 M110,40 Q105,43 101,38 M5,50 Q10,48 7,54" stroke="#d5c8a4" strokeWidth="0.4" fill="none" opacity="0.3" />
            </pattern>

            {/* Scanner Vignette Effect */}
            <linearGradient id="scanner-vignette" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#222222" stopOpacity="0.12" />
              <stop offset="5%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="95%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="100%" stopColor="#222222" stopOpacity="0.12" />
            </linearGradient>

            <linearGradient id="scanner-vignette-vertical" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#222222" stopOpacity="0.14" />
              <stop offset="5%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="95%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="100%" stopColor="#222222" stopOpacity="0.14" />
            </linearGradient>

            {/* SVGs Realism Warping Displacement filters */}
            <filter id="vintage-warp-filter">
              <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="3.0" xChannelSelector="R" yChannelSelector="G" />
            </filter>

            <filter id="copy-scan-filter">
              <feGaussianBlur stdDeviation="0.4" result="blur" />
              <feColorMatrix type="matrix" values="
                1.3 0 0 0 -0.15
                0 1.3 0 0 -0.15
                0 0 1.3 0 -0.15
                0 0 0 1.1 0" />
            </filter>

            {/* Dynamic Crumpled relief filter using fractal noise & diffuse lighting */}
            <filter id="crumpled-diffuse-filter">
              <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="4" result="noise" />
              <feDiffuseLighting in="noise" lightingColor="#ffffff" surfaceScale="2.2" result="light">
                <feDistantLight azimuth="45" elevation="60" />
              </feDiffuseLighting>
              <feBlend mode="multiply" in="SourceGraphic" in2="light" result="blend" />
            </filter>

            {/* High-Contrast Document Scanner Filter */}
            <filter id="scanner-contrast-multiplier">
              <feGaussianBlur stdDeviation="0.3" result="blur" />
              <feColorMatrix type="matrix" values="
                1.4 0 0 0 -0.08
                0 1.4 0 0 -0.08
                0 0 1.4 0 -0.08
                0 0 0 1.15 0" />
            </filter>

            {/* Soft shadow gradients for hand/smartphone photography overlay */}
            <linearGradient id="phone-body-shadow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e2230" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#1e2230" stopOpacity="0.0" />
            </linearGradient>
            
            <radialGradient id="person-shoulder-shadow" cx="65%" cy="30%" r="80%">
              <stop offset="0%" stopColor="#10131e" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#10131e" stopOpacity="0.0" />
            </radialGradient>
          </defs>

          {/* BACKGROUND FILLS & TEXTURE LAYERS */}
          <rect width="100%" height="100%" fill={getPaperBgFill()} />
          
          {config.paperTexture === 'fiber' && (
            <rect width="100%" height="100%" fill="url(#fiber-texture)" />
          )}

          {config.paperTexture === 'copy' && (
            <>
              <rect width="100%" height="100%" fill="url(#scanner-vignette)" />
              <rect width="100%" height="100%" fill="url(#scanner-vignette-vertical)" />
              <rect width="100%" height="100%" fill="url(#fiber-texture)" opacity="0.3" />
            </>
          )}

          {/* FILTER WRAPPER GROUP FOR REALISTIC ORGANIC TEXT AND LINES DISTORTION */}
          <g filter={
            config.paperEffect === 'crumpled'
              ? 'url(#crumpled-diffuse-filter)'
              : config.paperEffect === 'scanner'
              ? 'url(#scanner-contrast-multiplier)'
              : config.paperTexture === 'vintage'
              ? 'url(#vintage-warp-filter)'
              : config.paperTexture === 'copy'
              ? 'url(#copy-scan-filter)'
              : undefined
          }>
            {config.paperType === 'squared' && (
              <rect width="100%" height="100%" fill="url(#squared-grid)" />
            )}

            {config.paperType === 'lined' && (
              <rect width="100%" height="100%" fill="url(#lined-grid)" y={config.margins.top - config.lineSpacing/2} />
            )}

            {config.showMargins && (
              <rect width="100%" height="100%" fill="url(#margins)" />
            )}

            {/* COOPERATIVE STROKE RENDERING WORKLOAD */}
            {pages[currentPage]?.lines.map((line, lineIdx) => {
            return (
              <g key={lineIdx}>
                {line.elements.map((el, elIdx) => {
                  if (el.type === 'latex' && el.latexExpression) {
                    // Custom parsed mathematical symbols rendering logic
                    const parsed = parseLaTeXFormula(el.latexExpression, el.x, el.y, fontSize, config, style);
                    return (
                      <g key={elIdx} stroke={inkColorHex} strokeWidth={config.strokeThickness} strokeLinecap="round" strokeLinejoin="round" fill="none">
                        {parsed.paths.map((p, pIdx) => (
                          <path
                            key={`p-${pIdx}`}
                            d={p.d}
                            className={isAnimating ? 'animate-drawn-stroke' : ''}
                            style={isAnimating ? {
                              strokeDasharray: '150',
                              strokeDashoffset: '150',
                              animationName: 'handwritingDraw',
                              animationDuration: `${animationSpeed}s`,
                              animationTimingFunction: 'ease-in-out',
                              animationFillMode: 'forwards',
                              animationDelay: `${(lineIdx * 0.1) + (pIdx * 0.05)}s`
                            } : {}}
                          />
                        ))}
                        {parsed.horizontalLines.map((lineDef, lIdx) => (
                          <line
                            key={`h-${lIdx}`}
                            x1={lineDef.x1}
                            y1={lineDef.y1}
                            x2={lineDef.x2}
                            y2={lineDef.y2}
                            stroke={inkColorHex}
                            strokeWidth={config.strokeThickness * 1.2}
                          />
                        ))}
                      </g>
                    );
                  }

                  // Normal text letter characters SVG/Font output
                  if (el.useFont) {
                    return (
                      <g key={elIdx}>
                        <text
                          x={el.x}
                          y={el.y}
                          fill={inkColorHex}
                          fontSize={fontSize}
                          fontFamily={el.fontFamily || 'sans-serif'}
                          transform={`rotate(${el.rotation || 0}, ${el.x}, ${el.y})`}
                          style={isAnimating ? {
                            opacity: config.penStyle === 'ballpoint' ? 0.88 : 1,
                            animationName: 'handwritingFade',
                            animationDuration: `${animationSpeed * 0.4}s`,
                            animationTimingFunction: 'ease-out',
                            animationFillMode: 'both',
                            animationDelay: `${(lineIdx * 0.08) + (elIdx * 0.005)}s`
                          } : {
                            opacity: config.penStyle === 'ballpoint' ? 0.88 : 1
                          }}
                        >
                          {el.char}
                        </text>
                      </g>
                    );
                  }

                  return (
                    <g key={elIdx}>
                      <path
                        d={el.pathData}
                        fill="none"
                        stroke={inkColorHex}
                        strokeWidth={
                          config.penStyle === 'fountain'
                            ? config.strokeThickness * 1.3
                            : config.penStyle === 'gel'
                            ? config.strokeThickness * 1.15
                            : config.strokeThickness
                        }
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={isAnimating ? 'animate-drawn-stroke' : ''}
                        style={isAnimating ? {
                          opacity: config.penStyle === 'ballpoint' ? 0.92 : 1,
                          strokeDasharray: '200',
                          strokeDashoffset: '200',
                          animationName: 'handwritingDraw',
                          animationDuration: `${animationSpeed}s`,
                          animationTimingFunction: 'ease-in-out',
                          animationFillMode: 'forwards',
                          animationDelay: `${(lineIdx * 0.08) + (elIdx * 0.005)}s`
                        } : {
                          opacity: config.penStyle === 'ballpoint' ? 0.92 : 1
                        }}
                      />
                    </g>
                  );
                })}
              </g>
            );
          })}
          </g>

          {/* REALISTIC SCANNER COVERS & CAMERA SHADOWS DEPENDING ON EFFECT */}
          {config.paperEffect === 'shadow' && (
            <g style={{ mixBlendMode: 'multiply', pointerEvents: 'none' }}>
              {/* Main phone screen rectangular shadow silhouette */}
              <rect x="-150" y="-120" width="370" height="520" rx="35" fill="url(#phone-body-shadow)" transform="rotate(18) translate(50, -60)" filter="blur(20px)" />
              {/* Arm/hand silhouette shadow */}
              <path d="M-180,-100 Q 180,180 -20,1050 L-180,1050 Z" fill="#141829" opacity="0.22" filter="blur(35px)" />
              {/* Person/head soft shoulder shadow */}
              <circle cx={PAGE_WIDTH} cy="20" r="480" fill="url(#person-shoulder-shadow)" filter="blur(45px)" />
            </g>
          )}

          {config.paperEffect === 'crumpled' && (
            <g style={{ mixBlendMode: 'multiply', opacity: 0.18, strokeWidth: '0.9', pointerEvents: 'none' }}>
              {/* Realistic crinkled folding lines with bright/dark relief pair */}
              <g stroke="#ffffff" strokeWidth="1.3" opacity="0.7">
                <path d="M 0,220 L 280,310 L 480,240 L 800,520" fill="none" />
                <path d="M 310,0 L 260,350 L 510,510 L 640,1120" fill="none" />
                <path d="M 0,780 L 420,680 L 800,940" fill="none" />
              </g>
              <g stroke="#1a1c22" strokeWidth="0.8" opacity="0.45">
                <path d="M 3,221 L 283,311 L 483,241 L 803,521" fill="none" />
                <path d="M 313,1 L 263,351 L 513,511 L 643,1121" fill="none" />
                <path d="M 3,781 L 423,681 L 803,941" fill="none" />
              </g>
            </g>
          )}

          {config.paperEffect === 'scanner' && (
            <g style={{ mixBlendMode: 'overlay', opacity: 0.45, pointerEvents: 'none' }}>
              <rect width="100%" height="100%" fill="url(#scanner-vignette)" />
              <rect width="100%" height="100%" fill="url(#scanner-vignette-vertical)" />
            </g>
          )}
        </svg>
      </div>

      {/* Dedicated Visual Quick-Jump Pagination Component */}
      {pages.length > 1 && (
        <div className="w-full mt-5 bg-slate-50 border border-gray-150 rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <FileText size={13} className="text-blue-500" />
              Быстрый навигатор по страницам
            </span>
            <span className="text-[10px] font-bold text-gray-400 bg-gray-200/50 px-2 py-0.5 rounded-full uppercase">
              Синтезировано страниц: {pages.length}
            </span>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
            {pages.map((page, idx) => {
              const isActive = idx === currentPage;
              const totalGlyphs = page.lines.reduce((acc, l) => acc + l.elements.length, 0);
              const isLined = config.paperType === 'lined';
              const isSquared = config.paperType === 'squared';
              
              // Custom background coloring matching chosen texture
              const miniBgColor = {
                fiber: 'bg-[#faf7f0]',
                copy: 'bg-[#e6e6e4]',
                vintage: 'bg-[#f4ebdb]',
                plain: 'bg-[#fbfcfa]'
              }[config.paperTexture] || 'bg-[#fbfcfa]';

              return (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx)}
                  className={`flex-shrink-0 flex items-center gap-3 p-2.5 rounded-xl transition-all border text-left cursor-pointer ${
                    isActive
                      ? 'bg-white border-blue-500 shadow-md shadow-blue-500/5 ring-1 ring-blue-500 scale-98'
                      : 'bg-white border-gray-150 hover:border-gray-200 hover:shadow-xs active:scale-95'
                  }`}
                  style={{ width: '135px' }}
                >
                  {/* Miniature Sheet Visualizer */}
                  <div 
                    className={`w-9 h-12 rounded border flex flex-col justify-between p-1 shadow-2xs relative overflow-hidden transition-all flex-shrink-0 ${miniBgColor} ${
                      isActive ? 'border-blue-400' : 'border-gray-250'
                    }`}
                  >
                    {/* Simulated Lines or Squares in Thumbnail */}
                    <div className="flex flex-col gap-1 w-full h-full relative">
                      {isLined && (
                        <div className="flex flex-col gap-[3px] w-full mt-1.5 opacity-60">
                          {Array.from({ length: 5 }).map((_, l) => (
                            <div key={l} className="h-[0.5px] w-full bg-blue-200/90" />
                          ))}
                        </div>
                      )}
                      
                      {isSquared && (
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e1f0fe_1px,transparent_1px),linear-gradient(to_bottom,#e1f0fe_1px,transparent_1px)] bg-[size:3px_3px] opacity-70" />
                      )}
                      
                      {/* Fake tiny handwritten scribbles */}
                      <div className="absolute inset-0 flex flex-col gap-[2px] mt-2 px-0.5 z-10 opacity-75">
                        {Array.from({ length: Math.min(page.lines.length, 3) }).map((_, lIdx) => (
                          <div 
                            key={lIdx} 
                            className="h-[1.2px] bg-slate-700/65 rounded-full" 
                            style={{ width: `${35 + Math.random() * 45}%` }} 
                          />
                        ))}
                      </div>

                      {/* Absolute watermark page number */}
                      <span className={`absolute bottom-0 right-0 text-[8px] font-extrabold px-0.5 rounded select-none ${isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-400'}`}>
                        #{idx + 1}
                      </span>
                    </div>
                  </div>

                  {/* Page specifications */}
                  <div className="flex flex-col justify-center min-w-0">
                    <span className={`text-xs font-bold leading-tight ${isActive ? 'text-blue-600' : 'text-slate-800'}`}>
                      Страница {idx + 1}
                    </span>
                    <span className="text-[10px] text-gray-400 font-semibold truncate leading-none mt-1">
                      Строк: {page.lines.length}
                    </span>
                    <span className="text-[9px] text-gray-400 font-bold whitespace-nowrap leading-none mt-0.5">
                      Символов: {totalGlyphs}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <style>{`
        @keyframes handwritingDraw {
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes handwritingFade {
          from {
            opacity: 0;
            transform: scale(0.96);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @page {
          size: A4;
          margin: 0px !important;
        }
        @media print {
          html, body {
            margin: 0px !important;
            padding: 0px !important;
            width: 210mm !important;
            height: 297mm !important;
            overflow: hidden !important;
            background-color: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body * {
            visibility: hidden !important;
          }
          #a4-sheet-container, #a4-sheet-container * {
            visibility: visible !important;
          }
          #a4-sheet-container {
            position: fixed !important;
            left: 0 !important;
            top: 2mm !important;
            width: 210mm !important;
            height: 285mm !important; /* Safe height to prevent spilling over to page 2 */
            max-width: none !important;
            max-height: none !important;
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            padding: 0 !important;
            z-index: 9999999 !important;
            background-color: #FCFCFA !important;
            page-break-inside: avoid !important;
            page-break-after: avoid !important;
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}
