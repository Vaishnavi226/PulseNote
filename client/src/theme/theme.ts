import { createTheme, ThemeOptions } from '@mui/material/styles';
import { tokens } from './tokens';

export const createAppTheme = (mode: 'light' | 'dark') => {
  const paletteTokens = tokens.colors[mode];

  const themeOptions: ThemeOptions = {
    palette: {
      mode,
      background: {
        default: paletteTokens.bg,
        paper: paletteTokens.surface,
      },
      text: {
        primary: paletteTokens.text,
        secondary: paletteTokens.textSecondary,
        disabled: paletteTokens.textMuted,
      },
      primary: {
        main: paletteTokens.text,
        contrastText: mode === 'light' ? '#FFFFFF' : '#0B0C0D',
      },
      secondary: {
        main: paletteTokens.accent,
        light: paletteTokens.accentSoft,
        dark: paletteTokens.accentDark,
      },
      divider: paletteTokens.border,
      error: {
        main: paletteTokens.danger,
      },
      warning: {
        main: paletteTokens.warning,
      },
      success: {
        main: paletteTokens.success,
      },
    },
    typography: {
      fontFamily: tokens.fonts.ui,
      h1: {
        fontFamily: tokens.fonts.display,
        fontWeight: 700,
        fontSize: '3.5rem',
        lineHeight: 1.1,
        letterSpacing: '-0.03em',
      },
      h2: {
        fontFamily: tokens.fonts.display,
        fontWeight: 700,
        fontSize: '2.5rem',
        lineHeight: 1.2,
        letterSpacing: '-0.02em',
      },
      h3: {
        fontFamily: tokens.fonts.display,
        fontWeight: 600,
        fontSize: '1.75rem',
        lineHeight: 1.3,
        letterSpacing: '-0.01em',
      },
      h4: {
        fontFamily: tokens.fonts.display,
        fontWeight: 600,
        fontSize: '1.25rem',
        lineHeight: 1.4,
      },
      body1: {
        fontFamily: tokens.fonts.ui,
        fontSize: '1.0625rem', // 17px
        lineHeight: 1.6,
      },
      body2: {
        fontFamily: tokens.fonts.ui,
        fontSize: '0.9375rem', // 15px
        lineHeight: 1.5,
      },
      button: {
        fontFamily: tokens.fonts.ui,
        fontWeight: 600,
        textTransform: 'none',
      },
      caption: {
        fontFamily: tokens.fonts.ui,
        fontSize: '0.8125rem',
        color: paletteTokens.textMuted,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: paletteTokens.bg,
            color: paletteTokens.text,
            margin: 0,
            padding: 0,
            fontFamily: tokens.fonts.ui,
            WebkitFontSmoothing: 'antialiased',
          },
          a: {
            color: paletteTokens.accent,
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: tokens.radii.button,
            padding: '10px 22px',
            fontSize: '0.9375rem',
            boxShadow: 'none',
            transition: 'all 200ms cubic-bezier(0.22, 1, 0.36, 1)',
            '&:hover': {
              boxShadow: tokens.shadows.soft,
              transform: 'translateY(-1px)',
            },
          },
          containedPrimary: {
            backgroundColor: paletteTokens.text,
            color: mode === 'light' ? '#FFFFFF' : '#0B0C0D',
            '&:hover': {
              backgroundColor: mode === 'light' ? '#22252A' : '#E0E0DC',
            },
          },
          outlined: {
            borderColor: paletteTokens.borderStrong,
            color: paletteTokens.text,
            '&:hover': {
              borderColor: paletteTokens.text,
              backgroundColor: paletteTokens.surfaceSoft,
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: tokens.radii.card,
            backgroundColor: paletteTokens.surface,
            borderColor: paletteTokens.border,
            boxShadow: tokens.shadows.soft,
            backgroundImage: 'none',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: tokens.radii.pill,
            fontWeight: 500,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
    },
  };

  return createTheme(themeOptions);
};
