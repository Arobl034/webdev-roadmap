/**
 * topics.js
 * All roadmap content lives here.
 * Add, remove, or edit topics without touching the UI code.
 */

export const TOPICS = {
  html_css: {
    label: "HTML & CSS Fundamentals",
    icon: "⬡",
    accent: "#f97316",
    items: [
      {
        id: "h1",
        title: "Document Structure & Semantic HTML",
        desc: "HTML5 elements, semantic tags (header, main, section, article, aside, footer), accessibility roles, and document outlines.",
        difficulty: "Beginner",
      },
      {
        id: "h2",
        title: "CSS Box Model & Layout",
        desc: "Margin, padding, border, content box vs border-box, display types (block, inline, inline-block), and overflow.",
        difficulty: "Beginner",
      },
      {
        id: "h3",
        title: "Flexbox",
        desc: "flex-direction, justify-content, align-items, flex-wrap, flex-grow/shrink/basis, and building common layouts.",
        difficulty: "Beginner",
      },
      {
        id: "h4",
        title: "CSS Grid",
        desc: "grid-template-columns/rows, grid-area, auto-fill vs auto-fit, minmax(), and complex two-dimensional layouts.",
        difficulty: "Intermediate",
      },
      {
        id: "h5",
        title: "Responsive Design & Media Queries",
        desc: "Mobile-first approach, breakpoints, fluid typography, viewport units, and responsive images.",
        difficulty: "Intermediate",
      },
      {
        id: "h6",
        title: "CSS Variables & Custom Properties",
        desc: "Declaring --variables, var() usage, scoping, theming, and dynamic updates via JavaScript.",
        difficulty: "Intermediate",
      },
    ],
  },

  javascript: {
    label: "JavaScript Basics",
    icon: "◈",
    accent: "#eab308",
    items: [
      {
        id: "j1",
        title: "Variables, Types & Scope",
        desc: "var vs let vs const, primitive types, type coercion, hoisting, block scope vs function scope.",
        difficulty: "Beginner",
      },
      {
        id: "j2",
        title: "Functions & Closures",
        desc: "Function declarations vs expressions, arrow functions, IIFE, closures, and the scope chain.",
        difficulty: "Beginner",
      },
      {
        id: "j3",
        title: "Arrays & Objects",
        desc: "Array methods (map, filter, reduce, find, some, every), object destructuring, spread/rest, and Object methods.",
        difficulty: "Beginner",
      },
      {
        id: "j4",
        title: "Asynchronous JavaScript",
        desc: "Event loop, callbacks, Promises, async/await, error handling with try/catch, and Promise.all.",
        difficulty: "Intermediate",
      },
      {
        id: "j5",
        title: "DOM Manipulation",
        desc: "querySelector, event listeners, event delegation, creating/removing elements, classList API.",
        difficulty: "Intermediate",
      },
      {
        id: "j6",
        title: "ES6+ Modern Features",
        desc: "Template literals, optional chaining, nullish coalescing, modules (import/export), Symbol, Map, Set.",
        difficulty: "Intermediate",
      },
    ],
  },

  react: {
    label: "React.js",
    icon: "◎",
    accent: "#22d3ee",
    items: [
      {
        id: "r1",
        title: "JSX & Component Basics",
        desc: "JSX syntax, functional components, rendering, component composition, and returning fragments.",
        difficulty: "Beginner",
      },
      {
        id: "r2",
        title: "Props & Data Flow",
        desc: "Passing props, prop types, default props, children prop, and unidirectional data flow.",
        difficulty: "Beginner",
      },
      {
        id: "r3",
        title: "useState Hook",
        desc: "Local component state, state updates, batching, using arrays/objects in state, and derived state.",
        difficulty: "Beginner",
      },
      {
        id: "r4",
        title: "useEffect Hook",
        desc: "Side effects, dependency arrays, cleanup functions, fetching data, and avoiding common pitfalls.",
        difficulty: "Intermediate",
      },
      {
        id: "r5",
        title: "useRef & useMemo",
        desc: "Refs for DOM access, persisting values across renders, memoizing expensive computations.",
        difficulty: "Intermediate",
      },
      {
        id: "r6",
        title: "Context API & useReducer",
        desc: "Creating context, Provider/Consumer pattern, useReducer for complex state, and combining with Context.",
        difficulty: "Advanced",
      },
    ],
  },
};

export const STATUS_CONFIG = {
  not_started: {
    label: "Not Started",
    color: "#475569",
    bg: "rgba(71,85,105,0.15)",
    border: "rgba(71,85,105,0.3)",
  },
  in_progress: {
    label: "In Progress",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.12)",
    border: "rgba(245,158,11,0.35)",
  },
  complete: {
    label: "Complete",
    color: "#22c55e",
    bg: "rgba(34,197,94,0.12)",
    border: "rgba(34,197,94,0.35)",
  },
};

export const DIFFICULTIES = {
  Beginner:     "#22c55e",
  Intermediate: "#f59e0b",
  Advanced:     "#ef4444",
};

export const STORAGE_KEY = "wd-roadmap-progress";
