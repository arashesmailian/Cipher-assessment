# Recipe Explorer - Angular 20 SSR Application

A modern, responsive recipe search application built with Angular 20, featuring Server-Side Rendering (SSR), TypeScript, TailwindCSS, and SCSS. The application allows users to search for recipes and view detailed cooking instructions using the MealDB API.

## 🚀 Features

- **Search Functionality**: Real-time recipe search with debounced input
- **Recipe Details**: Comprehensive view of ingredients, instructions, and cooking videos
- **Server-Side Rendering (SSR)**: Optimized for SEO and initial load performance
- **Responsive Design**: Beautiful, mobile-first UI using TailwindCSS
- **TypeScript**: Strongly typed interfaces for better code maintainability
- **SCSS Mixins**: Reusable styling patterns for consistent design
- **Loading States**: User-friendly loading indicators during data fetching
- **Error Handling**: Graceful error handling with fallback UI

## 📋 Prerequisites

- Node.js v22.19.0+ (required for Angular 20)
- npm v10.9.3+

## 🛠️ Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd recipe-app
```

2. Install dependencies:

```bash
npm install
```

## 🏃‍♂️ Running the Application

### Development Mode (Client-Side Only)

```bash
ng serve
# or
npm start
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any source files.

### Development Mode with SSR

```bash
npm run dev:ssr
```

This runs the application with server-side rendering enabled at `http://localhost:4200/`.

### Production Build

```bash
npm run build
```

This builds the application for production with SSR support.

### Serve Production Build

```bash
npm run serve:ssr:recipe-app
```

This serves the production build with SSR.

## 🧪 Running Tests

### Unit Tests

```bash
ng test
# or
npm test
```

This executes unit tests via [Karma](https://karma-runner.github.io).

### Test Coverage

```bash
ng test --code-coverage
```

Generates a coverage report in the `coverage/` directory.

## 📁 Project Structure

```
recipe-app/
├── src/
│   ├── app/
│   │   ├── home/                  # Home component with search
│   │   │   ├── home.ts
│   │   │   ├── home.html
│   │   │   ├── home.scss
│   │   │   └── home.spec.ts
│   │   ├── recipe-detail/         # Recipe detail component
│   │   │   ├── recipe-detail.ts
│   │   │   ├── recipe-detail.html
│   │   │   ├── recipe-detail.scss
│   │   │   └── recipe-detail.spec.ts
│   │   ├── models/                # TypeScript interfaces
│   │   │   └── meal.interface.ts
│   │   ├── services/              # API services
│   │   │   ├── recipe.service.ts
│   │   │   └── recipe.service.spec.ts
│   │   ├── app.config.ts          # App configuration
│   │   ├── app.config.server.ts   # SSR configuration
│   │   ├── app.routes.ts          # Routing configuration
│   │   └── app.ts                 # Root component
│   ├── styles/
│   │   ├── styles.scss            # Global styles with Tailwind
│   │   └── _mixins.scss           # SCSS mixins
│   ├── index.html                 # Main HTML file
│   ├── main.ts                    # Client bootstrap
│   ├── main.server.ts             # Server bootstrap
│   └── server.ts                  # Express server for SSR
├── tailwind.config.js             # Tailwind configuration
├── postcss.config.js              # PostCSS configuration
├── angular.json                   # Angular workspace config
├── tsconfig.json                  # TypeScript config
└── package.json                   # Dependencies
```

## 🎨 Key Technologies

- **Angular 20**: Latest Angular framework with standalone components
- **Angular Universal**: Server-side rendering for better SEO and performance
- **TypeScript 5.9**: Strong typing and modern JavaScript features
- **TailwindCSS 4.1**: Utility-first CSS framework
- **SCSS**: Advanced CSS preprocessing with mixins
- **RxJS**: Reactive programming for handling asynchronous operations
- **Express**: Node.js server for SSR

## 🔧 Architecture Decisions

### Component Structure

- **Standalone Components**: Using Angular's new standalone component API
- **Smart/Dumb Pattern**: HomeComponent handles logic, templates focus on presentation
- **Service Layer**: RecipeService encapsulates all API interactions

### State Management

- **RxJS Observables**: For handling asynchronous data flow
- **Debounced Search**: Prevents excessive API calls during typing

### Styling Approach

- **TailwindCSS**: For rapid UI development with utility classes
- **SCSS Mixins**: For reusable styling patterns (shadows, grids, spinners)
- **Component-Scoped Styles**: Encapsulated styling per component

### Type Safety

- **Strict TypeScript**: No `any` types, proper interfaces for all data models
- **Null Safety**: Proper handling of nullable API responses

## 🌐 API Integration

The application integrates with [TheMealDB API](https://www.themealdb.com/api.php):

- **Search Endpoint**: `www.themealdb.com/api/json/v1/1/search.php?s={query}`
- **Detail Endpoint**: `www.themealdb.com/api/json/v1/1/lookup.php?i={id}`

## 🧪 Testing Strategy

### Unit Tests Coverage

1. **Search Logic**: Testing debounced search functionality
2. **Component Rendering**: Ensuring components render correctly
3. **Service Methods**: Testing API calls and data transformation
4. **Error Handling**: Verifying graceful error handling

### Test Files

- `recipe.service.spec.ts`: Service layer tests
- `home.spec.ts`: Home component tests with search functionality
- `app.spec.ts`: Root component tests

## 🚀 Performance Optimizations

- **Server-Side Rendering**: Faster initial page load and better SEO
- **Lazy Loading Images**: Images load only when visible
- **Debounced Search**: Reduces API calls during typing
- **HTTP Caching**: Browser caching for API responses

## 📝 Code Quality

- **ESLint/TSLint**: Code linting for consistency
- **Prettier**: Code formatting configuration included
- **Strong Typing**: TypeScript interfaces for all data models
- **Component Tests**: Unit tests for critical functionality

---

**Note**: This application was built as per the assessment requirements, focusing on clean, maintainable code over feature completeness.
