import { createTheme, ThemeOptions } from '@mui/material/styles';
import { tokens } from './tokens';

export const createAppTheme = (mode: 'light' | 'dark') => {
  const paletteTokens = tokens.colors[mode];
  const isLight = mode === 'light';

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
        contrastText: isLight ? '#FFFFFF' : '#0B0C0D',
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
        fontWeight: 600,
        fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
        lineHeight: 1.08,
        letterSpacing: '-0.02em',
      },
      h2: {
        fontFamily: tokens.fonts.display,
        fontWeight: 600,
        fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
        lineHeight: 1.15,
        letterSpacing: '-0.015em',
      },
      h3: {
        fontFamily: tokens.fonts.display,
        fontWeight: 600,
        fontSize: '1.375rem',
        lineHeight: 1.25,
        letterSpacing: '-0.01em',
      },
      h4: {
        fontFamily: tokens.fonts.display,
        fontWeight: 600,
        fontSize: '1.125rem',
        lineHeight: 1.35,
      },
      h5: {
        fontFamily: tokens.fonts.ui,
        fontWeight: 600,
        fontSize: '1rem',
        lineHeight: 1.4,
      },
      body1: {
        fontFamily: tokens.fonts.ui,
        fontSize: '1rem',
        lineHeight: 1.65,
      },
      body2: {
        fontFamily: tokens.fonts.ui,
        fontSize: '0.875rem',
        lineHeight: 1.55,
      },
      caption: {
        fontFamily: tokens.fonts.ui,
        fontSize: '0.8125rem',
        lineHeight: 1.45,
        color: paletteTokens.textMuted,
      },
      overline: {
        fontFamily: tokens.fonts.ui,
        fontSize: '0.6875rem',
        fontWeight: 700,
        lineHeight: 1.6,
        letterSpacing: '0.09em',
        textTransform: 'uppercase',
      },
      button: {
        fontFamily: tokens.fonts.ui,
        fontWeight: 600,
        textTransform: 'none',
      },
    },
    shape: {
      borderRadius: 8,
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
            color: 'inherit',
            textDecoration: 'none',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: tokens.radii.pill,
            padding: '10px 22px',
            fontSize: '0.9375rem',
            boxShadow: 'none',
            transition:
              'background-color 180ms ease, border-color 180ms ease, color 180ms ease',
            '&:hover': {
              boxShadow: 'none',
              transform: 'none',
            },
          },
          sizeLarge: {
            padding: '12px 26px',
          },
          containedPrimary: {
            backgroundColor: paletteTokens.text,
            color: isLight ? '#FFFFFF' : '#0B0C0D',
            '&:hover': {
              backgroundColor: isLight ? '#26282C' : '#DADAD6',
            },
          },
          outlined: {
            borderColor: paletteTokens.borderStrong,
            color: paletteTokens.text,
            '&:hover': {
              borderColor: paletteTokens.text,
              backgroundColor: 'transparent',
            },
          },
          text: {
            color: paletteTokens.text,
            '&:hover': {
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
            border: '1px solid',
            borderColor: paletteTokens.border,
            boxShadow: 'none',
            backgroundImage: 'none',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: tokens.radii.pill,
            fontWeight: 600,
            fontSize: '0.8125rem',
            boxShadow: 'none',
          },
          outlined: {
            borderColor: paletteTokens.borderStrong,
            color: paletteTokens.textSecondary,
            '&:hover': {
              borderColor: paletteTokens.textMuted,
              backgroundColor: 'transparent',
              color: paletteTokens.text,
            },
          },
          filled: {
            backgroundColor: paletteTokens.text,
            color: isLight ? '#FFFFFF' : '#0B0C0D',
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: tokens.radii.control,
            backgroundColor: paletteTokens.surface,
          },
        },
      },
      MuiPaginationItem: {
        styleOverrides: {
          root: {
            borderRadius: tokens.radii.control,
            fontWeight: 600,
          },
          outlined: {
            borderColor: 'transparent',
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            borderRadius: tokens.radii.control,
            border: '1px solid',
            borderColor: paletteTokens.border,
            boxShadow: tokens.shadows.overlay,
            backgroundImage: 'none',
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
