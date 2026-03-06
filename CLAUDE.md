# TripCraft Design System & Operational Guidelines

## 1. CORE BEHAVIOR & LOGIC PRESERVATION (CRITICAL)
* **Never Break Working Logic:** When asked to fix a bug, update a component's style, or add a minor feature, you MUST NOT alter, rewrite, or interfere with existing, working functional logic (e.g., API calls, state management, Prisma queries, or data fetching hooks). 
* **Surgical Edits Only:** Only modify the exact lines of code necessary to fulfill the request. If you are changing a UI layout, keep all existing `onClick`, `onChange`, and `href` behaviors perfectly intact.
* **Ask Before Refactoring:** If an aesthetic or UI change absolutely requires fundamentally rewriting how the data flows, you must explicitly explain why and ask for permission before writing the code.

## 2. THE MILLION-DOLLAR AESTHETIC
I am designing this Next.js/Tailwind application to look like a high-end luxury print magazine (think Kinfolk, Condé Nast Traveler, or a vintage concierge dossier). I have completely moved away from the default "SaaS" look. For all future code generation, component updates, or UI fixes, you MUST strictly adhere to the following Design System:

## 3. COLOR PALETTE
* **Primary Dark:** `#1A1A1A` (Off-black). Use this for main text, primary buttons, and heavy borders.
* **Backgrounds:** `#FDFCFB` (Main background) or `#FAF7F2` (Secondary/accent sections). Never use stark `#F3F4F6` gray.
* **Accents:** `orange-800` (for text accents) and `orange-950` (for hover states on dark buttons).
* **Borders:** `gray-200` for structural lines.
* **Forbidden Colors:** NEVER use `blue-*`, `purple-*`, or bright primary gradients.

## 4. GEOMETRY & SHAPES
* **Corners:** Everything must be sharp. ALWAYS use `rounded-none`. Absolutely no `rounded-md`, `rounded-lg`, or `rounded-full` (except for literal circles/dots).
* **Shadows:** Avoid soft, blurry SaaS shadows. Use `shadow-none` for flat editorial looks, or harsh `shadow-2xl` for floating modals.
* **Borders:** Use thin, structural borders (`border border-gray-200`) to separate content like a newspaper grid.

## 5. TYPOGRAPHY
* **Headings:** Use `font-serif`. Make them large, elegant, and often `italic`. Use `tracking-tight` or `tracking-tighter`.
* **Labels, Tags, & Metadata:** Use `font-sans`, heavily tracked (`tracking-widest` or `tracking-[0.2em]`), `uppercase`, `font-bold`, and extremely small (`text-[9px]` or `text-[10px]`).
* **Paragraphs:** `font-serif` or clean `font-sans`, always with `leading-relaxed`.

## 6. IMAGES & EFFECTS
* **Photography:** Treat images like editorial spreads. Default to `grayscale` and transition to `grayscale-0` on hover. Use slow transitions (`duration-700` or `duration-1000`).

## 7. UI COMPONENTS (Buttons, Inputs, Badges)
* **Primary Buttons:** `bg-[#1A1A1A] text-white rounded-none hover:bg-orange-950 transition-all uppercase text-[10px] tracking-widest font-bold h-14`
* **Secondary Buttons:** `variant="outline" rounded-none border-gray-300 uppercase text-[10px] tracking-widest hover:bg-[#1A1A1A] hover:text-white h-14`
* **Inputs:** `rounded-none border-gray-300 focus-visible:ring-1 focus-visible:ring-orange-800 shadow-none h-14`
* **Badges/Tags:** `border border-gray-200 bg-[#FAF7F2] text-gray-500 uppercase tracking-widest text-[9px] px-3 py-1 font-bold`