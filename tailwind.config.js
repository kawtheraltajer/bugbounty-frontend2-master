// import { guessProductionMode } from "@ngneat/tailwind";

// process.env.TAILWIND_MODE = guessProductionMode() ? 'build' : 'watch';

module.exports = {
  prefix: '',
  mode: 'jit',
  corePlugins: {
    // ringColor: true,
  },
  purge: {
    content: [
      './src/**/*.{html,ts,css,scss,sass,less,styl}',
    ]
  },
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        orange: {
          50: "#FFF7ED",
          100: "#FFEDD5",
          200: "#FED7AA",
          300: "#FDBA74",
          400: "#FB923C",
          500: "#F97316",
          600: "#EA580C",
          700: "#C2410C",
          800: "#9A3412",
          900: "#7C2D12"
        },
        transparent: 'transparent',
        primary: {
          default: 'var(--ion-color-primary)',
          shade: 'var(--ion-color-primary-shade)',
          tint: 'var(--ion-color-primary-tint)',
        },
        secondary: {
          default: 'var(--ion-color-secondary)',
          shade: 'var(--ion-color-secondary-shade)',
          tint: 'var(--ion-color-secondary-tint)',
        },
        tertiary: {
          default: 'var(--ion-color-tertiary)',
          shade: 'var(--ion-color-tertiary-shade)',
          tint: 'var(--ion-color-tertiary-tint)',
        },
        light: {
          default: 'var(--ion-color-light)',
          shade: 'var(--ion-color-light-shade)',
          tint: 'var(--ion-color-light-tint)',
        },
        medium: {
          default: 'var(--ion-color-medium)',
          shade: 'var(--ion-color-medium-shade)',
          tint: 'var(--ion-color-medium-tint)',
        },
        dark: {
          default: 'var(--ion-color-dark)',
          shade: 'var(--ion-color-dark-shade)',
          tint: 'var(--ion-color-dark-tint)',
        },
        success: {
          default: 'var(--ion-color-success)',
          shade: 'var(--ion-color-success-shade)',
          tint: 'var(--ion-color-success-tint)',
        },
        warning: {
          default: 'var(--ion-color-warning)',
          shade: 'var(--ion-color-warning-shade)',
          tint: 'var(--ion-color-warning-tint)',
        },
        danger: {
          default: 'var(--ion-color-danger)',
          shade: 'var(--ion-color-danger-shade)',
          tint: 'var(--ion-color-danger-tint)',
        },
        backeground: 'var(--ion-background-color)',
        'toolbar-backeground': 'var(--ion-toolbar-background)',
        text: 'var(--ion-text-color)',
        step: {
          '50': 'var(--ion-color-step-50)',
          '100': 'var(--ion-color-step-100)',
          '200': 'var(--ion-color-step-200)',
          '300': 'var(--ion-color-step-300)',
          '400': 'var(--ion-color-step-400)',
          '500': 'var(--ion-color-step-500)',
          '600': 'var(--ion-color-step-600)',
          '700': 'var(--ion-color-step-700)',
          '800': 'var(--ion-color-step-800)',
          '900': 'var(--ion-color-step-900)',
          '950': 'var(--ion-color-step-950)',
        },
      },
      'animation': {
        'gradient-x': 'gradient-x 15s ease infinite',
        'gradient-y': 'gradient-y 15s ease infinite',
        'gradient-xy': 'gradient-xy 15s ease infinite',
      },
      'keyframes': {
        'gradient-y': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'center top'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'center center'
          }
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        'gradient-xy': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        }
      }
    },
  },
  variants: {
    logical: ['responsive', 'hover'],
    zIndex: ['hover', 'active'],
    borderWidth: ['hover', 'focus'],
    ringColor: ['hover', 'active'],
  },
  plugins: [
    // require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
    require('@tailwindcss/line-clamp'),
    // require('@tailwindcss/typography'),
    require('tailwindcss-logical')],
};
