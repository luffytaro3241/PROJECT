# GuardVault Enterprise Style Guide & Animation Documentation

## 1. Animation System Specifications

### Timing Functions
- **Entrance/Exit**: `cubic-bezier(0.65, 0, 0.35, 1)` (Ease-In-Out-Cubic)
- **UI Feedback**: `cubic-bezier(0.34, 1.56, 0.64, 1)` (Ease-Out-Back)
- **Spring Physics**: `linear(0, 0.45, 0.74, 0.9, 1, 1.05, 1.08, 1.09, 1.09, 1.08, 1.06, 1.04, 1.02, 1, 0.99, 0.98, 0.98, 0.98, 0.99, 1)`

### Duration Scales
- **Micro-interactions**: `100ms`
- **UI Transitions**: `300ms`
- **Page Transitions**: `600ms`

### Transform Matrices & 3D
- **Perspective**: `1500px`
- **Card Hover**: `translateY(-8px) rotateX(4deg) rotateY(4deg)`
- **Layer Depth**: `translateZ(50px)`

---

## 2. Theme Configuration

### Primary Palette (Blue)
- `50`: #eff6ff
- `100`: #dbeafe
- `200`: #bfdbfe
- `300`: #93c5fd
- `400`: #60a5fa
- `500`: #3b82f6
- `600`: #2563eb
- `700`: #1d4ed8
- `800`: #1e40af
- `900`: #1e3a8a

### Typography (Fluid Scale)
- **Base**: `clamp(1rem, 0.95rem + 0.25vw, 1.125rem)`
- **Large**: `clamp(1.25rem, 1.15rem + 0.5vw, 1.5rem)`
- **Heading 1**: `clamp(2rem, 1.75rem + 1.25vw, 3rem)`

---

## 3. Responsive Framework

### Breakpoints
- **Mobile S**: `320px`
- **Mobile L**: `480px`
- **Tablet**: `768px`
- **Desktop**: `1024px`
- **Desktop L**: `1440px`
- **Ultra-Wide**: `1920px`

### Grid System
Utilizes CSS Grid with `auto-fit` and `minmax(min(100%, 300px), 1fr)` for intrinsic responsiveness without media query soup.

---

## 4. Performance Optimization Pipeline
- **GPU Acceleration**: Applied via `translateZ(0)` and `backface-visibility: hidden` on all animating components.
- **Lazy Loading**: All route-level components use `React.lazy` and `Suspense`.
- **PWA Caching**: 
    - `NetworkFirst` for API interactions.
    - `CacheFirst` for static assets (images, fonts).
