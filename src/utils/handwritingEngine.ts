import { PageConfig, HandwritingStyle } from '../types';

// Let's create a procedural representation of strokes for characters.
// Each character is defined as a series of strokes (array of coordinate points [x, y] on a 0-100 grid).
// We use a normalized grid of [0, 100] for clean relative scaling.
export type HandStroke = Array<[number, number]>;
export type GlyphStrokes = HandStroke[];

// English & Russian vector glyphs
export const BASE_GLYPHS: Record<string, GlyphStrokes> = {
  // English Lowercase
  'a': [
    [[20, 50], [10, 30], [25, 15], [40, 30], [35, 60], [20, 75], [10, 60], [20, 50], [40, 50], [50, 75], [55, 80]],
  ],
  'b': [
    [[15, 80], [15, 10], [12, 10], [18, 10], [35, 45], [45, 60], [35, 80], [15, 80]],
  ],
  'c': [
    [[45, 30], [40, 15], [20, 15], [10, 45], [15, 75], [35, 80], [45, 65]],
  ],
  'd': [
    [[45, 80], [45, 10], [45, 50], [30, 40], [15, 55], [20, 75], [35, 80], [45, 80], [52, 80]],
  ],
  'e': [
    [[10, 60], [45, 50], [40, 25], [25, 20], [10, 40], [12, 70], [35, 80], [48, 70]],
  ],
  'f': [
    [[20, 80], [30, 15], [35, 5], [40, 15], [22, 95], [18, 95], [25, 50], [45, 50]],
  ],
  'g': [
    [[40, 50], [25, 40], [12, 55], [20, 75], [40, 75], [40, 50], [40, 90], [30, 100], [12, 95], [10, 85], [45, 75]],
  ],
  'h': [
    [[15, 80], [15, 10], [15, 45], [25, 35], [40, 45], [40, 80], [45, 80]],
  ],
  'i': [
    [[20, 45], [20, 80], [28, 80]],
    [[20, 15], [22, 15]], // Dot
  ],
  'j': [
    [[35, 45], [35, 90], [20, 100], [10, 92], [8, 80], [42, 65]],
    [[35, 15], [37, 15]], // Dot
  ],
  'k': [
    [[15, 80], [15, 10], [15, 50], [35, 30], [40, 30], [25, 52], [42, 80], [48, 80]],
  ],
  'l': [
    [[15, 10], [15, 75], [25, 80], [30, 80]],
  ],
  'm': [
    [[10, 80], [10, 40], [10, 45], [20, 35], [28, 55], [28, 80]],
    [[28, 45], [38, 35], [45, 55], [45, 80], [50, 80]],
  ],
  'n': [
    [[10, 80], [10, 40], [12, 45], [22, 35], [35, 55], [35, 80], [42, 80]],
  ],
  'o': [
    [[25, 45], [12, 60], [20, 80], [35, 75], [40, 55], [28, 45], [25, 45], [45, 40]],
  ],
  'p': [
    [[10, 95], [10, 40], [12, 45], [30, 35], [40, 50], [35, 75], [12, 75]],
  ],
  'q': [
    [[35, 50], [25, 40], [12, 55], [20, 75], [35, 75], [35, 50], [35, 95], [45, 100], [45, 80]],
  ],
  'r': [
    [[10, 80], [10, 40], [10, 45], [25, 35], [35, 40], [40, 45]],
  ],
  's': [
    [[10, 75], [25, 80], [40, 70], [25, 60], [15, 50], [30, 35], [40, 45]],
  ],
  't': [
    [[20, 15], [20, 75], [32, 80]],
    [[5, 35], [35, 35]],
  ],
  'u': [
    [[10, 45], [10, 70], [20, 80], [35, 70], [35, 45], [35, 80], [42, 80]],
  ],
  'v': [
    [[10, 45], [18, 75], [30, 80], [40, 45], [46, 42]],
  ],
  'w': [
    [[10, 45], [12, 72], [22, 80], [30, 55], [35, 72], [45, 80], [52, 45], [58, 45]],
  ],
  'x': [
    [[10, 45], [40, 80]],
    [[40, 45], [10, 80]],
  ],
  'y': [
    [[10, 45], [10, 70], [22, 80], [35, 70], [35, 45], [35, 90], [22, 100], [10, 95]],
  ],
  'z': [
    [[10, 45], [40, 45], [15, 75], [40, 75], [42, 75]],
  ],

  // English Uppercase (Basic representations mapped directly)
  'A': [
    [[20, 80], [40, 10], [60, 80]],
    [[30, 50], [50, 50]],
  ],
  'B': [
    [[15, 80], [15, 10]],
    [[15, 10], [45, 15], [40, 45], [15, 45]],
    [[15, 45], [48, 50], [40, 80], [15, 80]],
  ],
  'C': [
    [[50, 20], [25, 15], [15, 45], [22, 75], [45, 80]],
  ],
  'D': [
    [[15, 80], [15, 10]],
    [[15, 10], [45, 20], [45, 70], [15, 80]],
  ],
  'E': [
    [[40, 15], [15, 15], [15, 80], [45, 80]],
    [[15, 48], [35, 48]],
  ],
  'F': [
    [[40, 15], [15, 15], [15, 80]],
    [[15, 45], [35, 45]],
  ],
  'G': [
    [[50, 25], [25, 15], [15, 45], [20, 75], [45, 80], [45, 55], [32, 55]],
  ],
  'H': [
    [[15, 10], [15, 80]],
    [[45, 10], [45, 80]],
    [[15, 45], [45, 45]],
  ],
  'I': [
    [[15, 15], [45, 15]],
    [[30, 15], [30, 75]],
    [[15, 75], [45, 75]],
  ],
  'J': [
    [[15, 15], [45, 15]],
    [[30, 15], [30, 70], [20, 80], [10, 70]],
  ],
  'K': [
    [[15, 10], [15, 80]],
    [[45, 15], [15, 48], [45, 80]],
  ],
  'L': [
    [[15, 10], [15, 80], [45, 80]],
  ],
  'M': [
    [[10, 80], [10, 10], [30, 55], [50, 10], [50, 80]],
  ],
  'N': [
    [[15, 80], [15, 10], [45, 80], [45, 10]],
  ],
  'O': [
    [[30, 10], [12, 35], [15, 65], [30, 80], [48, 65], [45, 35], [30, 10]],
  ],
  'P': [
    [[15, 80], [15, 10], [40, 15], [40, 45], [15, 45]],
  ],
  'Q': [
    [[30, 10], [12, 35], [15, 65], [30, 80], [48, 65], [45, 35], [30, 10]],
    [[35, 60], [50, 82]],
  ],
  'R': [
    [[15, 80], [15, 10], [40, 15], [40, 45], [15, 45]],
    [[15, 45], [35, 55], [45, 80]],
  ],
  'S': [
    [[45, 20], [25, 10], [15, 28], [25, 45], [45, 60], [35, 80], [15, 75]],
  ],
  'T': [
    [[10, 15], [50, 15]],
    [[30, 15], [30, 80]],
  ],
  'U': [
    [[15, 15], [15, 65], [28, 80], [45, 65], [45, 15]],
  ],
  'V': [
    [[15, 15], [30, 80], [45, 15]],
  ],
  'W': [
    [[10, 15], [18, 80], [30, 40], [42, 80], [50, 15]],
  ],
  'X': [
    [[15, 15], [45, 80]],
    [[45, 15], [15, 80]],
  ],
  'Y': [
    [[15, 15], [30, 45], [45, 15]],
    [[30, 45], [30, 80]],
  ],
  'Z': [
    [[15, 15], [45, 15], [15, 80], [45, 80]],
  ],

  // Cyrillic (Russian) Uppercase (Support beautiful cursive Russian shapes)
  'А': [
    [[15, 80], [30, 10], [45, 80]],
    [[20, 50], [40, 50]],
  ],
  'Б': [
    [[15, 80], [15, 10], [45, 10]],
    [[15, 45], [35, 45], [42, 60], [32, 80], [15, 80]],
  ],
  'В': [
    [[15, 80], [15, 10]],
    [[15, 10], [40, 12], [35, 42], [15, 42]],
    [[15, 42], [42, 45], [38, 80], [15, 80]],
  ],
  'Г': [
    [[15, 80], [15, 10], [40, 10]],
  ],
  'Д': [
    [[10, 70], [10, 80], [45, 80], [45, 70]],
    [[15, 70], [25, 10], [35, 70]],
  ],
  'Е': [
    [[40, 15], [15, 15], [15, 80], [40, 80]],
    [[15, 45], [35, 45]],
  ],
  'Ё': [
    [[40, 15], [15, 15], [15, 80], [40, 80]],
    [[15, 45], [35, 45]],
    [[20, 3], [22, 3]], [[30, 3], [32, 3]], // dots
  ],
  'Ж': [
    [[10, 15], [25, 45], [10, 80]],
    [[40, 15], [25, 45], [40, 80]],
    [[25, 10], [25, 80]],
  ],
  'З': [
    [[20, 15], [40, 15], [35, 45], [15, 45]],
    [[15, 45], [42, 48], [35, 80], [15, 80]],
  ],
  'И': [
    [[15, 10], [15, 80], [45, 10], [45, 80]],
  ],
  'Й': [
    [[15, 10], [15, 80], [45, 10], [45, 80]],
    [[20, 3], [32, 5], [40, 3]], // curl
  ],
  'К': [
    [[15, 10], [15, 80]],
    [[40, 15], [15, 45], [42, 80]],
  ],
  'Л': [
    [[10, 80], [25, 10], [40, 80]],
  ],
  'М': [
    [[10, 80], [15, 10], [30, 50], [45, 10], [50, 80]],
  ],
  'Н': [
    [[15, 10], [15, 80]],
    [[45, 10], [45, 80]],
    [[15, 45], [45, 45]],
  ],
  'О': [
    [[30, 10], [15, 35], [15, 65], [30, 80], [45, 65], [45, 35], [30, 10]],
  ],
  'П': [
    [[15, 10], [15, 80]],
    [[40, 10], [40, 80]],
    [[12, 10], [43, 10]],
  ],
  'Р': [
    [[15, 80], [15, 10], [40, 12], [40, 45], [15, 45]],
  ],
  'С': [
    [[45, 20], [20, 15], [15, 45], [20, 75], [45, 80]],
  ],
  'Т': [
    [[10, 10], [45, 10]],
    [[27, 10], [27, 80]],
  ],
  'У': [
    [[15, 10], [25, 45], [40, 10]],
    [[25, 45], [10, 80]],
  ],
  'Ф': [
    [[25, 10], [25, 80]],
    [[25, 20], [10, 25], [10, 50], [25, 55]],
    [[25, 20], [40, 25], [40, 50], [25, 55]],
  ],
  'Х': [
    [[15, 15], [40, 80]],
    [[40, 15], [15, 80]],
  ],
  'Ц': [
    [[15, 10], [15, 75], [40, 75], [40, 10]],
    [[38, 75], [42, 90], [35, 90]],
  ],
  'Ч': [
    [[15, 10], [15, 45], [40, 45], [40, 10]],
    [[40, 45], [40, 80]],
  ],
  'Ш': [
    [[15, 10], [15, 75], [45, 75]],
    [[30, 10], [30, 75]],
    [[45, 10], [45, 75]],
  ],
  'Щ': [
    [[15, 10], [15, 75], [45, 75]],
    [[30, 10], [30, 75]],
    [[45, 10], [45, 75]],
    [[43, 75], [47, 90], [40, 90]],
  ],
  'Ъ': [
    [[10, 15], [22, 15]],
    [[20, 15], [20, 75], [35, 75], [40, 60], [35, 45], [20, 45]],
  ],
  'Ы': [
    [[15, 10], [15, 80]],
    [[15, 45], [30, 45], [35, 60], [30, 75], [15, 75]],
    [[42, 10], [42, 80]],
  ],
  'Ь': [
    [[15, 10], [15, 80]],
    [[15, 45], [30, 45], [35, 60], [30, 75], [15, 75]],
  ],
  'Э': [
    [[15, 20], [38, 15], [40, 45], [15, 45], [40, 45], [38, 75], [15, 80]],
  ],
  'Ю': [
    [[15, 10], [15, 80]],
    [[15, 45], [30, 45]],
    [[40, 15], [30, 35], [32, 65], [40, 80], [52, 65], [50, 35], [40, 15]],
  ],
  'Я': [
    [[40, 80], [40, 10]],
    [[40, 10], [25, 12], [22, 38], [40, 40]],
    [[23, 38], [15, 80]],
  ],

  // Cyrillic Lowercase (Mapped procedurally or key strokes)
  'а': [
    [[20, 50], [10, 30], [25, 15], [40, 30], [35, 60], [20, 75], [10, 60], [20, 50], [40, 50], [50, 80]],
  ],
  'б': [
    [[35, 15], [20, 15], [15, 45], [20, 75], [38, 75], [38, 45], [15, 45]],
  ],
  'в': [
    [[15, 80], [15, 20], [35, 20], [35, 50], [15, 50], [38, 52], [32, 80], [15, 80]],
  ],
  'г': [
    [[15, 45], [35, 45], [35, 80]],
  ],
  'д': [
    [[35, 50], [22, 42], [12, 55], [20, 75], [35, 75], [35, 50], [35, 95], [20, 100]],
  ],
  'е': [
    [[10, 60], [35, 50], [35, 30], [20, 25], [10, 42], [12, 70], [32, 80]],
  ],
  'ё': [
    [[10, 60], [35, 50], [35, 30], [20, 25], [10, 42], [12, 70], [32, 80]],
    [[18, 5], [20, 5]], [[28, 5], [30, 5]],
  ],
  'ж': [
    [[10, 30], [22, 55], [10, 80]],
    [[35, 30], [22, 55], [35, 80]],
    [[22, 25], [22, 80]],
  ],
  'з': [
    [[12, 35], [32, 35], [28, 55], [15, 58], [15, 60], [32, 62], [25, 95], [10, 95]],
  ],
  'и': [
    [[12, 35], [12, 75], [32, 35], [32, 75]],
  ],
  'й': [
    [[12, 35], [12, 75], [32, 35], [32, 75]],
    [[15, 15], [22, 22], [30, 15]],
  ],
  'к': [
    [[12, 30], [12, 80]],
    [[28, 32], [12, 55], [30, 80]],
  ],
  'л': [
    [[10, 75], [20, 35], [32, 80]],
  ],
  'м': [
    [[10, 75], [15, 35], [25, 60], [35, 35], [40, 75]],
  ],
  'н': [
    [[12, 30], [12, 80]],
    [[12, 55], [28, 55]],
    [[28, 30], [28, 80]],
  ],
  'о': [
    [[25, 35], [12, 55], [20, 78], [35, 72], [32, 40], [25, 35]],
  ],
  'п': [
    [[12, 35], [12, 80]],
    [[12, 35], [28, 35]],
    [[28, 35], [28, 80]],
  ],
  'р': [
    [[12, 35], [12, 100]],
    [[12, 35], [28, 35], [28, 70], [12, 70]],
  ],
  'с': [
    [[32, 42], [18, 35], [12, 55], [18, 75], [32, 80]],
  ],
  'т': [
    [[12, 35], [12, 80]],
    [[22, 35], [22, 80]],
    [[32, 35], [32, 80]],
    [[10, 35], [35, 35]],
  ],
  'у': [
    [[12, 35], [20, 65], [32, 35]],
    [[20, 65], [8, 100]],
  ],
  'ф': [
    [[20, 30], [20, 90]],
    [[20, 40], [10, 45], [10, 65], [20, 70]],
    [[20, 40], [30, 45], [30, 65], [20, 70]],
  ],
  'х': [
    [[12, 35], [28, 80]],
    [[28, 35], [12, 80]],
  ],
  'ц': [
    [[12, 35], [12, 75], [28, 75], [28, 35]],
    [[26, 75], [30, 92], [22, 92]],
  ],
  'ч': [
    [[12, 35], [12, 55], [28, 55]],
    [[28, 55], [28, 80]],
  ],
  'ш': [
    [[12, 35], [12, 75], [32, 75]],
    [[22, 35], [22, 75]],
    [[32, 35], [32, 75]],
  ],
  'щ': [
    [[12, 35], [12, 75], [32, 75]],
    [[22, 35], [22, 75]],
    [[32, 35], [32, 75]],
    [[30, 75], [34, 92], [26, 92]],
  ],
  'ъ': [
    [[10, 40], [20, 40]],
    [[18, 40], [18, 75], [30, 75], [35, 62], [30, 52], [18, 52]],
  ],
  'ы': [
    [[12, 35], [12, 80]],
    [[12, 55], [25, 55], [28, 65], [25, 75], [12, 75]],
    [[35, 35], [35, 80]],
  ],
  'ь': [
    [[12, 35], [12, 80]],
    [[12, 50], [25, 50], [28, 65], [25, 75], [12, 75]],
  ],
  'э': [
    [[12, 42], [28, 35], [30, 55], [15, 55], [30, 55], [28, 75], [12, 80]],
  ],
  'ю': [
    [[12, 35], [12, 80]],
    [[12, 55], [22, 55]],
    [[28, 35], [22, 55], [22, 65], [28, 78], [35, 65], [35, 55], [28, 35]],
  ],
  'я': [
    [[28, 80], [28, 35]],
    [[28, 35], [15, 38], [15, 55], [28, 58]],
    [[18, 55], [10, 80]],
  ],

  // Digit characters [0-9]
  '0': [
    [[25, 15], [12, 45], [25, 80], [38, 45], [25, 15]],
  ],
  '1': [
    [[12, 28], [25, 15], [25, 80]],
    [[12, 80], [38, 80]],
  ],
  '2': [
    [[12, 25], [25, 15], [38, 25], [12, 80], [40, 80]],
  ],
  '3': [
    [[12, 20], [35, 20], [20, 45], [38, 52], [32, 80], [12, 75]],
  ],
  '4': [
    [[30, 15], [12, 55], [40, 55]],
    [[30, 15], [30, 80]],
  ],
  '5': [
    [[35, 15], [15, 15], [15, 45], [35, 50], [32, 80], [12, 75]],
  ],
  '6': [
    [[35, 15], [18, 35], [15, 60], [25, 80], [38, 70], [32, 50], [15, 60]],
  ],
  '7': [
    [[12, 18], [38, 18], [18, 80]],
    [[20, 48], [32, 48]],
  ],
  '8': [
    [[25, 45], [12, 30], [25, 15], [38, 30], [25, 45], [12, 65], [25, 80], [38, 65], [25, 45]],
  ],
  '9': [
    [[25, 50], [12, 40], [22, 15], [35, 28], [35, 50], [25, 50], [35, 50], [25, 80]],
  ],

  // Ukrainian uppercase
  'І': [
    [[15, 15], [45, 15]],
    [[30, 15], [30, 75]],
    [[15, 75], [45, 75]],
  ],
  'Ї': [
    [[15, 15], [45, 15]],
    [[30, 15], [30, 75]],
    [[15, 75], [45, 75]],
    [[20, 3], [22, 3]], [[40, 3], [42, 3]],
  ],
  'Є': [
    [[40, 20], [25, 23], [18, 50], [25, 77], [40, 80]],
    [[18, 50], [35, 50]],
  ],
  'Ґ': [
    [[15, 80], [15, 10], [40, 10], [45, 2]],
  ],

  // Ukrainian lowercase
  'і': [
    [[20, 45], [20, 80], [28, 80]],
    [[20, 15], [22, 15]],
  ],
  'ї': [
    [[20, 45], [20, 80], [28, 80]],
    [[14, 15], [16, 15]], [[26, 15], [28, 15]],
  ],
  'є': [
    [[30, 30], [20, 35], [14, 50], [20, 65], [30, 70]],
    [[14, 50], [26, 50]],
  ],
  'ґ': [
    [[15, 30], [22, 18], [24, 30], [35, 30], [35, 80]],
  ],

  // Greek Lowercase & Uppercase & Math/Physics Symbols
  '\\alpha': [
    [[40, 25], [15, 75], [12, 50], [30, 25], [45, 80]],
  ],
  '\\beta': [
    [[15, 95], [15, 15], [35, 25], [25, 50], [15, 50], [38, 60], [28, 85], [15, 85]],
  ],
  '\\gamma': [
    [[15, 15], [25, 85], [35, 98], [40, 85], [15, 45]],
  ],
  '\\delta': [
    [[35, 15], [25, 15], [15, 45], [15, 75], [35, 75], [35, 45], [20, 35]],
  ],
  '\\Delta': [
    [[25, 15], [10, 75], [40, 75], [25, 15]],
  ],
  '\\theta': [
    [[25, 15], [12, 45], [25, 75], [38, 45], [25, 15]],
    [[15, 45], [35, 45]],
  ],
  '\\lambda': [
    [[35, 15], [15, 80]],
    [[25, 45], [40, 80]],
  ],
  '\\mu': [
    [[10, 95], [10, 40], [10, 65], [18, 75], [30, 65], [30, 40], [30, 75]],
  ],
  '\\rho': [
    [[12, 95], [12, 45], [28, 40], [35, 58], [25, 75], [12, 70]],
  ],
  '\\sigma': [
    [[40, 25], [25, 25], [15, 50], [25, 75], [38, 55], [25, 45]],
  ],
  '\\phi': [
    [[25, 15], [12, 45], [25, 75], [38, 45], [25, 15]],
    [[32, 10], [18, 85]],
  ],
  '\\psi': [
    [[12, 25], [14, 65], [25, 80], [36, 65], [38, 25]],
    [[25, 15], [25, 85]],
  ],
  '\\omega': [
    [[10, 45], [12, 72], [20, 80], [26, 55], [32, 80], [40, 72], [42, 45]],
  ],
  '\\Omega': [
    [[10, 75], [20, 75], [20, 45], [25, 20], [35, 20], [40, 45], [40, 75], [50, 75]],
  ],
  '\\degree': [
    [[20, 20], [15, 25], [20, 30], [25, 25], [20, 20]],
  ],
  '\\pm': [
    [[15, 35], [35, 35]],
    [[25, 15], [25, 55]],
    [[15, 75], [35, 75]],
  ],
  '\\times': [
    [[15, 25], [35, 75]],
    [[35, 25], [15, 75]],
  ],
  '\\div': [
    [[15, 50], [35, 50]],
    [[25, 30], [25, 33]],
    [[25, 70], [25, 73]],
  ],
  '\\approx': [
    [[10, 35], [25, 45], [40, 35]],
    [[10, 55], [25, 65], [40, 55]],
  ],
  '\\ne': [
    [[10, 38], [40, 38]],
    [[10, 62], [40, 62]],
    [[35, 15], [15, 85]],
  ],
  '\\neq': [
    [[10, 38], [40, 38]],
    [[10, 62], [40, 62]],
    [[35, 15], [15, 85]],
  ],
  '\\le': [
    [[35, 25], [12, 45], [35, 65]],
    [[12, 78], [35, 78]],
  ],
  '\\ge': [
    [[12, 25], [35, 45], [12, 65]],
    [[12, 78], [35, 78]],
  ],
  '\\partial': [
    [[35, 25], [25, 20], [15, 45], [25, 70], [38, 50], [35, 25], [22, 22]],
  ],
  '\\nabla': [
    [[10, 20], [40, 20], [25, 80], [10, 20]],
  ],
  '\\infty': [
    [[25, 50], [15, 35], [12, 50], [25, 65], [38, 35], [40, 50], [25, 50]],
  ],
  '\\hbar': [
    [[15, 80], [15, 10], [15, 45], [25, 35], [40, 45], [40, 80], [45, 80]],
    [[8, 25], [22, 25]],
  ],
  '[': [
    [[30, 10], [15, 10], [15, 90], [30, 90]],
  ],
  ']': [
    [[15, 10], [30, 10], [30, 90], [15, 90]],
  ],
  '{': [
    [[35, 10], [25, 10], [25, 35], [15, 45], [25, 55], [25, 80], [35, 80]],
  ],
  '}': [
    [[15, 10], [25, 10], [25, 35], [35, 45], [25, 55], [25, 80], [15, 80]],
  ],
  '<': [
    [[35, 20], [15, 50], [35, 80]],
  ],
  '>': [
    [[15, 20], [35, 50], [15, 80]],
  ],

  // Common math symbols
  '+': [
    [[10, 50], [40, 50]],
    [[25, 20], [25, 80]],
  ],
  '-': [
    [[10, 50], [40, 50]],
  ],
  '=': [
    [[10, 38], [40, 38]],
    [[10, 62], [40, 62]],
  ],
  '/': [
    [[10, 85], [40, 15]],
  ],
  '*': [
    [[12, 30], [38, 70]],
    [[38, 30], [12, 70]],
    [[10, 50], [40, 50]],
  ],
  '(': [
    [[35, 10], [20, 25], [15, 50], [20, 75], [35, 90]],
  ],
  ')': [
    [[15, 10], [30, 25], [35, 50], [30, 75], [15, 90]],
  ],
  ',': [
    [[22, 70], [25, 70], [20, 85]],
  ],
  '.': [
    [[22, 73], [24, 73]],
  ],
  '?': [
    [[15, 25], [25, 15], [35, 25], [25, 45], [25, 62]],
    [[25, 80], [27, 80]],
  ],
  '!': [
    [[25, 15], [25, 62]],
    [[25, 80], [27, 80]],
  ],
  ':': [
    [[25, 30], [27, 30]],
    [[25, 70], [27, 70]],
  ],
  ';': [
    [[25, 30], [27, 30]],
    [[25, 65], [27, 65], [22, 80]],
  ],
  '\'': [
    [[28, 15], [30, 15], [26, 30]],
  ],
  '"': [
    [[18, 15], [20, 15], [17, 30]],
    [[28, 15], [30, 15], [27, 30]],
  ],
  '%': [
    [[35, 20], [15, 80]],
    [[18, 25], [19, 25]],
    [[32, 70], [33, 70]],
  ],
  '&': [
    [[38, 30], [28, 15], [18, 30], [28, 50], [14, 75], [30, 80], [42, 65]],
  ],
  '_': [
    [[5, 85], [45, 85]],
  ],
  '#': [
    [[18, 20], [18, 80]],
    [[32, 20], [32, 80]],
    [[10, 35], [40, 35]],
    [[10, 60], [40, 60]],
  ],
  '@': [
    [[35, 50], [25, 40], [15, 55], [25, 70], [35, 60], [35, 50], [35, 80], [20, 85], [10, 65], [15, 45], [30, 30], [42, 55], [38, 75]],
  ],
  '$': [
    [[25, 10], [25, 90]],
    [[35, 25], [20, 20], [15, 35], [25, 48], [35, 60], [30, 75], [15, 70]],
  ],

  // LaTeX integral, summation, root signs
  '\\int': [
    [[35, 10], [28, 12], [24, 25], [24, 75], [20, 88], [12, 90]],
  ],
  '\\sum': [
    [[40, 15], [15, 15], [28, 48], [15, 80], [40, 80]],
  ],
  '\\sqrt': [
    [[10, 55], [14, 55], [18, 90], [24, 15], [50, 15]],
  ],
  '\\pi': [
    [[10, 25], [40, 25]],
    [[18, 25], [16, 80]],
    [[32, 25], [34, 75], [38, 80]],
  ],
};

export function parseSVGPathToStrokes(pathData: string): Array<Array<[number, number]>> {
  const strokes: Array<Array<[number, number]>> = [];
  const segments = pathData.trim().split('M').filter(Boolean);
  
  segments.forEach(segment => {
    const stroke: Array<[number, number]> = [];
    const points = segment.trim().split('L').filter(Boolean);
    
    points.forEach(point => {
      const coords = point.trim().split(/\s+/).map(Number);
      if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
        stroke.push([coords[0], coords[1]]);
      }
    });
    
    if (stroke.length > 0) {
      strokes.push(stroke);
    }
  });
  
  return strokes;
}

// Generates an SVG path data string from glyph strokes
// Applies random slant, spacing variance, baseline wave, and jitter noise
export function renderGlyphToSVGPath(
  char: string,
  startX: number,
  startY: number,
  size: number,
  config: PageConfig,
  charIndex: number,
  lineIndex: number,
  style?: HandwritingStyle,
  prevLastPoint?: [number, number] | null
): { pathData: string; width: number; firstPoint: [number, number]; lastPoint: [number, number]; useFont?: boolean; rotation?: number } {
  // If style uses a real font-family instead of procedural SVG strokes
  if (style?.useFont) {
    const isWide = char === 'm' || char === 'w' || char === 'М' || char === 'Ш' || char === 'W' || char === 'M';
    const isNarrow = char === 'i' || char === 'l' || char === '!' || char === ';' || char === '.' || char === ',' || char === '1';
    const baseWidth = isWide ? 44 : isNarrow ? 15 : 28;
    const baseLetterSpacing = style ? style.letterSpacing : 0;
    const localSpacingOffset = config.spacingVariance * Math.cos(charIndex * 2.1 + lineIndex * 0.7);
    const targetCharWidth = (baseWidth * (size / 100)) + localSpacingOffset + config.letterSpacing + baseLetterSpacing;
    
    const baseBaselineOffset = style ? style.baselineOffset : 0;
    const localBaselineOffset = (baseBaselineOffset * (size / 100)) + config.baselineVariance * Math.sin(charIndex * 0.9 + lineIndex * 1.4);
    
    const baseSlant = style ? style.slant : 0;
    const slantAngleDeg = (baseSlant + config.tiltVariance * (Math.sin(charIndex * 1.5 + lineIndex * 2.3)));

    const defaultCoords: [number, number] = [startX, startY + localBaselineOffset];
    return {
      pathData: '',
      width: targetCharWidth,
      firstPoint: defaultCoords,
      lastPoint: [startX + targetCharWidth, startY + localBaselineOffset],
      useFont: true,
      rotation: slantAngleDeg
    };
  }

  // Check if character is in style's custom glyph library
  const aliasMap: Record<string, string> = {
    'α': '\\alpha', 'β': '\\beta', 'γ': '\\gamma', 'δ': '\\delta', 'Δ': '\\Delta',
    'ε': 'e',
    'θ': '\\theta', 'λ': '\\lambda', 'μ': '\\mu', 'ρ': '\\rho', 'σ': '\\sigma',
    'φ': '\\phi', 'ψ': '\\psi', 'ω': '\\omega', 'Ω': '\\Omega',
    '°': '\\degree', '±': '\\pm', '×': '\\times', '÷': '\\div',
    '≈': '\\approx', '≠': '\\ne', '≤': '\\le', '≥': '\\ge',
    '∂': '\\partial', '∇': '\\nabla', '∞': '\\infty', 'ħ': '\\hbar',
    'π': '\\pi'
  };
  const lookupChar = aliasMap[char] || char;

  let strokes: GlyphStrokes | null = null;
  
  if (style?.glyphs?.[lookupChar]) {
    const customPath = style.glyphs[lookupChar];
    if (typeof customPath === 'string' && customPath.trim().length > 0) {
      strokes = parseSVGPathToStrokes(customPath);
    }
  }
  
  // Fallback to BASE_GLYPHS
  if (!strokes || strokes.length === 0) {
    strokes = BASE_GLYPHS[lookupChar];
  }
  
  // Try case insensitivity if full glyph is missing
  if (!strokes) {
    let fallbackChar = '';
    if (lookupChar.toLowerCase() !== lookupChar && BASE_GLYPHS[lookupChar.toLowerCase()]) {
      fallbackChar = lookupChar.toLowerCase();
    } else if (lookupChar.toUpperCase() !== lookupChar && BASE_GLYPHS[lookupChar.toUpperCase()]) {
      fallbackChar = lookupChar.toUpperCase();
    }
    
    if (fallbackChar && style?.glyphs?.[fallbackChar]) {
      const customPath = style.glyphs[fallbackChar];
      if (typeof customPath === 'string' && customPath.trim().length > 0) {
        strokes = parseSVGPathToStrokes(customPath);
      }
    }
    
    if (!strokes && fallbackChar) {
      strokes = BASE_GLYPHS[fallbackChar];
    }
  }

  // Final fallback
  if (!strokes) {
    const defaultCoords: [number, number] = [startX, startY];
    if (char === ' ') {
      return { pathData: '', width: config.wordSpacing, firstPoint: defaultCoords, lastPoint: defaultCoords };
    }
    strokes = [
      [[10, 20], [40, 20], [40, 80], [10, 80], [10, 20]]
    ];
  }

  // Clone strokes so we can safely add dynamic serif decorations if needed
  let finalStrokes: GlyphStrokes = strokes.map(stroke => stroke.map(pt => [...pt] as [number, number]));

  // Standard serif generation logic
  if (config.fontFamily === 'serif' && char !== ' ') {
    const isAlphanumeric = /^[a-zA-Zа-яА-Я0-9ёЁ]$/.test(char);
    if (isAlphanumeric) {
      const serifStrokes: GlyphStrokes = [];
      finalStrokes.forEach((stroke) => {
        if (stroke.length >= 2) {
          const startPoint = stroke[0];
          const endPoint = stroke[stroke.length - 1];
          const distStartEnd = Math.hypot(startPoint[0] - endPoint[0], startPoint[1] - endPoint[1]);
          if (distStartEnd < 8) return; // Closed loop (e.g., 'o', '0', 'O')

          let totalLength = 0;
          for (let i = 0; i < stroke.length - 1; i++) {
            totalLength += Math.hypot(stroke[i + 1][0] - stroke[i][0], stroke[i + 1][1] - stroke[i][1]);
          }
          if (totalLength < 15) return; // Mini accent or dot (e.g., 'i' dots)

          // Start point serif
          const dxStart = stroke[1][0] - stroke[0][0];
          const dyStart = stroke[1][1] - stroke[0][1];
          const lenStart = Math.hypot(dxStart, dyStart);
          if (lenStart > 0.1) {
            const ux = dxStart / lenStart;
            const uy = dyStart / lenStart;
            const px = -uy;
            const py = ux;
            const serifLen = 5.5;
            serifStrokes.push([
              [stroke[0][0] - px * serifLen, stroke[0][1] - py * serifLen],
              [stroke[0][0] + px * serifLen, stroke[0][1] + py * serifLen]
            ]);
          }

          // End point serif
          const n = stroke.length - 1;
          const dxEnd = stroke[n][0] - stroke[n - 1][0];
          const dyEnd = stroke[n][1] - stroke[n - 1][1];
          const lenEnd = Math.hypot(dxEnd, dyEnd);
          if (lenEnd > 0.1) {
            const ux = dxEnd / lenEnd;
            const uy = dyEnd / lenEnd;
            const px = -uy;
            const py = ux;
            const serifLen = 5.5;
            serifStrokes.push([
              [stroke[n][0] - px * serifLen, stroke[n][1] - py * serifLen],
              [stroke[n][0] + px * serifLen, stroke[n][1] + py * serifLen]
            ]);
          }
        }
      });
      finalStrokes = [...finalStrokes, ...serifStrokes];
    }
  }

  // Calculate dynamic slant factor based on average slant of cursive
  // Plus minor tilt variance per character
  const baseSlant = style ? style.slant : 0;
  const slantAngleDeg = (baseSlant + config.tiltVariance * (Math.sin(charIndex * 1.5 + lineIndex * 2.3)));
  const slantRad = (slantAngleDeg * Math.PI) / 180;
  const slantFactor = Math.tan(slantRad);

  // Spacing variance per character
  const localSpacingOffset = config.spacingVariance * Math.cos(charIndex * 2.1 + lineIndex * 0.7);
  
  // Baseline wave (baseline offset variance)
  const baseBaselineOffset = style ? style.baselineOffset : 0;
  const localBaselineOffset = (baseBaselineOffset * (size / 100)) + config.baselineVariance * Math.sin(charIndex * 0.9 + lineIndex * 1.4);

  let pathString = '';
  
  // Determine actual width to allocate for this character
  // Default cell size on grid is 50, standard characters are scaled
  const baseWidth = char === 'm' || char === 'w' || char === 'М' || char === 'Ш' ? 55 : 40;
  const baseLetterSpacing = style ? style.letterSpacing : 0;
  const targetCharWidth = (baseWidth * (size / 100)) + localSpacingOffset + config.letterSpacing + baseLetterSpacing;

  // Let's calculate absolute first & last connection coordinates of this glyph
  let firstPoint: [number, number] = [startX, startY + localBaselineOffset + (50 * (size / 100))];
  let lastPoint: [number, number] = [startX + targetCharWidth, startY + localBaselineOffset + (50 * (size / 100))];

  // Set the precise coordinates based on actual character baseline shape
  if (finalStrokes.length > 0 && finalStrokes[0].length > 0) {
    const [px, py] = finalStrokes[0][0];
    const scaledX = (px * (size / 100));
    const scaledY = (py * (size / 100));
    const skewedX = scaledX + (scaledY * slantFactor);
    firstPoint = [startX + skewedX, startY + scaledY + localBaselineOffset];
  }
  if (finalStrokes.length > 0) {
    const lastSt = finalStrokes[finalStrokes.length - 1];
    if (lastSt.length > 0) {
      const [px, py] = lastSt[lastSt.length - 1];
      const scaledX = (px * (size / 100));
      const scaledY = (py * (size / 100));
      const skewedX = scaledX + (scaledY * slantFactor);
      lastPoint = [startX + skewedX, startY + scaledY + localBaselineOffset];
    }
  }

  // Draw natural letter connection in cursive mode (if config is not purely mechanical/sans printing)
  const isCursive = style && style.id !== 'minimalist-print' && style.id !== 'architect-draft' && (style.slant > 3 || style.letterSpacing < 4);
  let connectorPath = '';
  if (isCursive && prevLastPoint && char !== ' ') {
    const cpX = (prevLastPoint[0] + firstPoint[0]) / 2;
    // Connective dip matching speed and style line heights
    const cpY = Math.max(prevLastPoint[1], firstPoint[1]) + 2 + (config.noiseLevel * 0.5);
    connectorPath = `M ${prevLastPoint[0].toFixed(1)} ${prevLastPoint[1].toFixed(1)} Q ${cpX.toFixed(1)} ${cpY.toFixed(1)} ${firstPoint[0].toFixed(1)} ${firstPoint[1].toFixed(1)}`;
  }

  // Deterministic seed mapping for unique letter variations (so no two 'e' or 'a' are identical)
  const charSeed = charIndex * 13.9 + lineIndex * 31.7 + (char.charCodeAt(0) || 0) * 7.3;

  if (connectorPath) {
    pathString += connectorPath + ' ';
  }

  finalStrokes.forEach((stroke, strokeIdx) => {
    let strokeString = '';
    stroke.forEach(([px, py], pointIdx) => {
      // Calculate individual control points perturbations based on specific coordinate seeds
      const ptSeed = charSeed + strokeIdx * 23.3 + pointIdx * 11.9;
      
      // Dynamic coordinate shake based on the selected noise/neatness level
      const coordJitterX = config.noiseLevel > 0 
        ? Math.sin(ptSeed * 1.5) * config.noiseLevel * 0.45
        : 0;
      const coordJitterY = config.noiseLevel > 0 
        ? Math.cos(ptSeed * 1.8) * config.noiseLevel * 0.45
        : 0;

      // Scale coordinates from normalized 0..100 grid to target size
      const scaledX = (px * (size / 100));
      const scaledY = (py * (size / 100));

      // Global random micro-shake per rendering
      const globalJitterX = config.noiseLevel > 0 
        ? (Math.sin(charIndex * 4.1) * 0.1 * config.noiseLevel)
        : 0;
      const globalJitterY = config.noiseLevel > 0 
        ? (Math.cos(charIndex * 4.1) * 0.1 * config.noiseLevel)
        : 0;

      // Apply tilt (skew) modification
      const skewedX = scaledX + (scaledY * slantFactor);

      // Final dynamic placement position
      const finalX = startX + skewedX + coordJitterX + globalJitterX;
      const finalY = startY + scaledY + localBaselineOffset + coordJitterY + globalJitterY;

      if (pointIdx === 0) {
        strokeString += `M ${finalX.toFixed(1)} ${finalY.toFixed(1)}`;
      } else {
        strokeString += ` L ${finalX.toFixed(1)} ${finalY.toFixed(1)}`;
      }
    });
    pathString += strokeString + ' ';
  });

  return {
    pathData: pathString.trim(),
    width: targetCharWidth,
    firstPoint,
    lastPoint
  };
}

// Splits clean text into formatted lines for multipage wrapping
export interface WrappedLine {
  text: string;
  isLaTeX?: boolean;
}

export interface RenderedPage {
  lines: Array<{
    y: number;
    elements: Array<{
      type: 'text' | 'latex';
      pathData?: string;
      char?: string;
      x: number;
      y: number;
      width: number;
      latexExpression?: string; // for rendering formulas in SVG
      useFont?: boolean;
      fontFamily?: string;
      rotation?: number;
    }>;
  }>;
}

// Computes wrapped lines based on width margins of A4
// Standard A4 dimensions in pixels at 72 PPI are 595 x 842.
// We use A4 standard 794 x 1123 pixels (matching high quality print aspect ratio)
export const PAGE_WIDTH = 794;
export const PAGE_HEIGHT = 1123;

export function wrapTextIntoPages(
  text: string,
  config: PageConfig,
  style?: HandwritingStyle,
  fontSize: number = 24
): Array<RenderedPage> {
  const pages: Array<RenderedPage> = [];
  const lines = text.split('\n');
  const maxLineWidth = PAGE_WIDTH - config.margins.left - config.margins.right;
  const maxLinesPerPage = Math.floor(
    (PAGE_HEIGHT - config.margins.top - config.margins.bottom) / config.lineSpacing
  );

  let currentPageLines: RenderedPage['lines'] = [];
  let currentY = config.margins.top;
  let lineIndex = 0;

  // Render text word-by-word into wrapped line models
  lines.forEach((originalLine) => {
    // Check if line is LaTeX formula
    if (originalLine.trim().startsWith('$$') && originalLine.trim().endsWith('$$')) {
      const formula = originalLine.trim().slice(2, -2).trim();
      
      // Page break check
      if (currentY + config.lineSpacing * 1.8 > PAGE_HEIGHT - config.margins.bottom) {
        pages.push({ lines: currentPageLines });
        currentPageLines = [];
        currentY = config.margins.top;
      }

      currentPageLines.push({
        y: currentY,
        elements: [{
          type: 'latex',
          x: config.margins.left + (maxLineWidth / 2) - 80, // center-aligned LaTeX
          y: currentY,
          width: 160,
          latexExpression: formula
        }]
      });
      currentY += Math.max(config.lineSpacing * 1.8, 55);
      lineIndex++;
      return;
    }

    // Standard text wrapping
    const words = originalLine.split(' ');
    let currentX = config.margins.left;
    let currentLineElements: RenderedPage['lines'][0]['elements'] = [];

    const styleLetterSpacing = style ? style.letterSpacing : 0;

    words.forEach((word) => {
      if (word === '') {
        currentX += config.wordSpacing;
        return;
      }

      // Calculate word layout width
      let wordWidth = 0;
      const charElements: Array<{ char: string; width: number; localOffset: number }> = [];
      
      for (let i = 0; i < word.length; i++) {
        const char = word[i];
        const baseWidth = char === 'm' || char === 'w' || char === 'М' || char === 'Ш' ? 55 : 40;
        const widthVal = (baseWidth * (fontSize / 100)) + config.letterSpacing + styleLetterSpacing;
        charElements.push({ char, width: widthVal, localOffset: wordWidth });
        wordWidth += widthVal;
      }

      // If word exceeds margin, snap to new line
      if (currentX + wordWidth > PAGE_WIDTH - config.margins.right) {
        if (currentLineElements.length > 0) {
          currentPageLines.push({
            y: currentY,
            elements: currentLineElements
          });
          currentLineElements = [];
          
          currentY += config.lineSpacing;
          lineIndex++;

          // Page break check
          if (currentY + config.lineSpacing > PAGE_HEIGHT - config.margins.bottom) {
            pages.push({ lines: currentPageLines });
            currentPageLines = [];
            currentY = config.margins.top;
          }
        }
        currentX = config.margins.left;
      }

      // Generate paths for each letter in the word
      let lastCharEndPoint: [number, number] | null = null;
      charElements.forEach((el, index) => {
        const rendering = renderGlyphToSVGPath(
          el.char,
          currentX,
          currentY,
          fontSize,
          config,
          index + currentLineElements.length,
          lineIndex,
          style,
          lastCharEndPoint
        );

        if (rendering.useFont) {
          currentLineElements.push({
            type: 'text',
            char: el.char,
            x: currentX,
            y: rendering.lastPoint[1], // apply dynamic wobbly baseline
            width: rendering.width,
            useFont: true,
            fontFamily: style?.fontFamily,
            rotation: rendering.rotation
          });
          lastCharEndPoint = rendering.lastPoint;
        } else if (rendering.pathData) {
          currentLineElements.push({
            type: 'text',
            pathData: rendering.pathData,
            char: el.char,
            x: currentX,
            y: currentY,
            width: rendering.width
          });
          lastCharEndPoint = rendering.lastPoint;
        } else {
          lastCharEndPoint = null;
        }
        currentX += rendering.width;
      });

      // Add word separator
      currentX += config.wordSpacing;
    });

    // Push trailing leftover line
    if (currentLineElements.length > 0) {
      currentPageLines.push({
        y: currentY,
        elements: currentLineElements
      });
      currentY += config.lineSpacing;
      lineIndex++;

      // Page break check
      if (currentY + config.lineSpacing > PAGE_HEIGHT - config.margins.bottom) {
        pages.push({ lines: currentPageLines });
        currentPageLines = [];
        currentY = config.margins.top;
      }
    }
  });

  // Push final page
  if (currentPageLines.length > 0 || pages.length === 0) {
    pages.push({ lines: currentPageLines });
  }

  return pages;
}

// Procedural LaTeX mathematical renderer returning customized SVG elements representing
// mathematical layouts (Greek variables, fractions, summation bounds, roots)
export interface MatchedFormulaItem {
  type: string;
  char?: string;
  raw?: string;
  xOffset: number;
  yOffset: number;
  scale: number;
}

export function parseLaTeXFormula(
  expression: string,
  startX: number,
  startY: number,
  size: number,
  config?: PageConfig,
  style?: HandwritingStyle
): { paths: Array<{ d: string; scale?: number }>; horizontalLines: Array<{ x1: number; y1: number; x2: number; y2: number }> } {
  const paths: Array<{ d: string; scale?: number }> = [];
  const horizontalLines: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];

  // Let's create a beautiful custom handwritten layout based on expressions
  // e.g. "f(x) = \int_{a}^{b} x^2 dx", "\frac{\alpha + \beta}{\gamma}" etc.
  
  let currentX = startX;
  const configPlaceholder: PageConfig = {
    paperType: 'blank',
    fontFamily: 'sans',
    inkColor: 'blue',
    penStyle: 'gel',
    lineSpacing: 28,
    letterSpacing: 0,
    wordSpacing: 10,
    tiltVariance: 2,
    spacingVariance: 0.5,
    baselineVariance: 0.3,
    strokeThickness: 1.5,
    noiseLevel: 0.2,
    margins: { top: 40, bottom: 40, left: 40, right: 40 },
    showMargins: false,
    curvedLines: false
  };

  const actualConfig = config ? { ...config, paperType: 'blank' as const, showMargins: false } : configPlaceholder;

  // Simplistic Math parser
  if (expression.includes('\\frac')) {
    // Render fraction (numerator on top, line in middle, denominator below)
    // Matches \frac{num}{den}
    const match = expression.match(/\\frac\s*\{([^}]+)\}\s*\{([^}]+)\}/);
    if (match) {
      const num = match[1];
      const den = match[2];

      const numWidth = num.length * 15;
      const denWidth = den.length * 15;
      const fracWidth = Math.max(numWidth, denWidth) + 16;
      const middleY = startY + size / 2;

      // Draw horizontal dividing bar
      horizontalLines.push({
        x1: currentX,
        y1: middleY,
        x2: currentX + fracWidth,
        y2: middleY
      });

      // Render numerator (top)
      for (let i = 0; i < num.length; i++) {
        const glyphRes = renderGlyphToSVGPath(
          num[i],
          currentX + (fracWidth - numWidth) / 2 + (i * 14),
          startY - 5,
          size * 0.85,
          actualConfig,
          i,
          1,
          style
        );
        if (glyphRes.pathData) {
          paths.push({ d: glyphRes.pathData });
        }
      }

      // Render denominator (bottom)
      for (let i = 0; i < den.length; i++) {
        const glyphRes = renderGlyphToSVGPath(
          den[i],
          currentX + (fracWidth - denWidth) / 2 + (i * 14),
          startY + size * 0.72,
          size * 0.85,
          actualConfig,
          i,
          2,
          style
        );
        if (glyphRes.pathData) {
          paths.push({ d: glyphRes.pathData });
        }
      }
      currentX += fracWidth;
    }
  } else if (expression.includes('\\int')) {
    // Integrals! \int_{a}^{b} x dx
    const glyphRes = renderGlyphToSVGPath('\\int', currentX, startY - 10, size * 1.5, actualConfig, 0, 1, style);
    paths.push({ d: glyphRes.pathData });
    currentX += 28;

    // Integral bounds match can be captured
    const subMatch = expression.match(/_\{?([^}]+)\}?\^\{?([^}]+)\}?/);
    if (subMatch) {
      const lower = subMatch[1];
      const upper = subMatch[2];

      // Lower bound
      const lowGlyph = renderGlyphToSVGPath(lower, currentX - 10, startY + size * 1.1, size * 0.65, actualConfig, 0, 1, style);
      paths.push({ d: lowGlyph.pathData });

      // Upper bound
      const upGlyph = renderGlyphToSVGPath(upper, currentX, startY - 20, size * 0.65, actualConfig, 0, 1, style);
      paths.push({ d: upGlyph.pathData });
    }

    // Rest of formula (e.g. x^2 dx or standard expression)
    const rest = expression.replace(/\\int(_\{[^}]+\})?(\^\{[^}]+\})?/, '').trim();
    for (let i = 0; i < rest.length; i++) {
      const char = rest[i];
      if (char === '^') {
        const powerChar = rest[i+1];
        if (powerChar) {
          const powerGlyph = renderGlyphToSVGPath(powerChar, currentX, startY - 12, size * 0.65, actualConfig, i, 1, style);
          paths.push({ d: powerGlyph.pathData });
          currentX += 14;
          i++; // skip next char
        }
        continue;
      }
      const glyphRes = renderGlyphToSVGPath(char, currentX, startY + 10, size, actualConfig, i, 1, style);
      if (glyphRes.pathData) {
        paths.push({ d: glyphRes.pathData });
      }
      currentX += glyphRes.width;
    }
  } else {
    // Ordinary horizontal text expression / LaTeX characters with subscripts and superscripts
    for (let i = 0; i < expression.length; i++) {
      const char = expression[i];
      if (char === ' ') {
        currentX += 10;
        continue;
      }

      // Handle simple script tokens
      if (char === '^' && expression[i+1]) {
        const pGlyph = renderGlyphToSVGPath(expression[i+1], currentX, startY - 10, size * 0.65, actualConfig, i, 1, style);
        paths.push({ d: pGlyph.pathData });
        currentX += 15;
        i++;
        continue;
      }
      if (char === '_' && expression[i+1]) {
        const sGlyph = renderGlyphToSVGPath(expression[i+1], currentX, startY + size * 0.65, size * 0.65, actualConfig, i, 1, style);
        paths.push({ d: sGlyph.pathData });
        currentX += 15;
        i++;
        continue;
      }

      const glyphRes = renderGlyphToSVGPath(char, currentX, startY + 5, size, actualConfig, i, 1, style);
      if (glyphRes.pathData) {
        paths.push({ d: glyphRes.pathData });
      }
      currentX += glyphRes.width;
    }
  }

  return { paths, horizontalLines };
}
