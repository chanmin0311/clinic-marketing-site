# Design Philosophy & UI Specification (`design.ui`)

This document defines the core visual strategy, layout architecture, spacing guidelines, user flows, and interactive behavioral specifications for the **Aesthetic Dermatology Clinic Marketing Website**.

---

## 1. Design Core Concept & Philosophy

### 1.1 Brand Mission & Vision
* **Core Triad**: **Minimal**, **Cozy**, **Hopeful**.
* **Clinical Trust meets Warmth**: Medical websites often feel sterile, cold, and intimidating. This project redefines clinical aesthetic care into a soft, welcoming, and reassuring journey.
* **Warm Minimalism**: High whitespace ratio (breathability) paired with warm skin-like tones (warm cream, soft sage, earthy terracotta rose) instead of harsh stark white or clinical cold cyan.

### 1.2 Design Pillars
1. **Reassurance over Urgency**: No loud countdown banners or aggressive popups. Focus on clinical expertise, modern equipment, natural results, and patient comfort.
2. **Tactile Elegance**: Soft borders (`border-border/60`), large rounded radii (`rounded-2xl` / `2rem`), subtle glassmorphism (`backdrop-blur-md`), and high contrast readable typography.
3. **Seamless Discovery**: Frictionless transition from learning about skin treatments to booking or consulting via persistent, non-intrusive CTAs.

---

## 2. Benchmark Analysis (Awwwards Dermatology/Aesthetic Sites)

*Referenced Awwwards sites: Likha Aesthetic Clinic, Beauty In Stem, Rafaela Salvato Clínica Dermatológica.*

### Key Insights & Patterns
* **Hero Layout**: Large high-resolution visual/video loop on the right or background with a stacked, left-aligned typography hero, accompanied by a floating "Credentials/Stats Pill Badge".
* **Padding Rhythm**: Very generous vertical padding (`py-20` to `py-32` on desktop) creating a luxury editorial magazine feel.
* **Section Transitions**: Smooth, subtle background shade shifts between sections (e.g., transitioning from Warm Cream `#fbf9f6` to Pure White `#ffffff` to Soft Sage Tint `#f2f6f3`).
* **Visual Cards**: Overlapping image/content cards with floating play buttons for video testimonials, and soft ambient glows in the background.

---

## 3. Page Architecture & User Flow

### 3.1 Marketing Page Hierarchy (Top to Bottom)
1. **Global Header & Navigation**:
   * Brand logo (Left)
   * Essential navigation links: Direct Treatments, Before & After, Clinic Doctor, Location/Contact (Center)
   * Quick Booking / KakaoTalk Consultation Pill CTA (Right)
2. **Hero Section**:
   * Headline + Subheading focused on personalized skin health.
   * Trust Indicators Pill: "Over 15,000+ Treatments", "Board Certified Dermatologists".
   * Primary Action: "1:1 Skin Diagnosis Booking", Secondary: "Explore Signature Treatments".
3. **Philosophy & Medical Edge Banner**:
   * Large bold statement ("본연의 건강하고 빛나는 피부를 위한 진정성 있는 접근").
   * Interactive stat boxes showing treatment safety and satisfaction.
4. **Interactive Treatment Categories (Grid/Tabs)**:
   * Categorized into Lifting/Anti-aging, Tone/Pigmentation, Acne/Barrier Care, Body Aesthetic.
   * Interactive hover card lifting effect with clear summary tags.
5. **Real Patient Journey & Before/After Showcase**:
   * High-contrast slider with medical notes on exact procedures used.
6. **Doctor & Medical Team Profile**:
   * High-quality warm portrait images showcasing credentials and philosophy.
7. **Interactive FAQ Accordion + Floating Contact Sidebar**:
   * 2-Column layout: Accordion on left, quick contact card on right.
8. **Video Testimonials Grid**:
   * Video thumbnail cards with play overlay and patient summary chips.
9. **Location, Map & Booking Footer**:
   * Direct map embed, subway/parking access details, operating hours, and consultation form.
10. **Mobile Persistent Floating Bar**:
    * Bottom sticky bar containing "Phone Call" and "Kakao Booking" for maximum conversion.

---

## 4. UI Layout & Spacing Specification

### 4.1 Grid & Container Rules
* **Max Container Width**: `max-w-7xl` (1280px) for standard sections, `max-w-5xl` for text/FAQ focus sections.
* **Horizontal Padding**:
  * Mobile: `px-4` (16px)
  * Tablet: `px-6` (24px)
  * Desktop: `px-8` (32px)
* **Vertical Section Spacing**:
  * Default Sections: `py-16 md:py-24 lg:py-32`
  * Compact Sections: `py-10 md:py-16`

### 4.2 Card & Container Dimensions Scale
* **Standard Grid Gaps**: `gap-6` (24px) for cards, `gap-12 lg:gap-16` for main 2-column split sections.
* **Card Padding**:
  * Small Badges/Chips: `px-3 py-1.5`
  * Standard Cards: `p-6 md:p-8`
  * Hero Banner Containers: `p-8 md:p-12`
* **Border Radii Hierarchy**:
  * Buttons & Badges: `rounded-full`
  * Cards & Image Containers: `rounded-2xl` (32px)
  * Dialogs / Modals: `rounded-3xl` (40px)

---

## 5. Interaction & Behavioral Guidelines

### 5.1 Hover & Micro-interactions
* **Cards**: Gentle upward translation (`hover:-translate-y-1`) with soft shadow expansion (`hover:shadow-md`) over `duration-300 ease-in-out`.
* **Buttons**: Subtle background saturation change or light border glow. Avoid harsh color flashing.
* **Accordions**: Smooth open/close accordion expansion using `transition-all duration-300`.

### 5.2 Motion Reduction & Accessibility Behavior
* All hover transforms and floating animations **must** respect `prefers-reduced-motion`.
* Color contrast for text against background must exceed WCAG AA standards (minimum 4.5:1 ratio).

