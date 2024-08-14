// ----------------------------------------------------------------------

function pxToRem(value) {
  return `${value / 16}rem`;
}

function responsiveFontSizes({ sm, md, lg }) {
  return {
    '@media (min-width:600px)': {
      fontSize: pxToRem(sm),
    },
    '@media (min-width:900px)': {
      fontSize: pxToRem(md),
    },
    '@media (min-width:1200px)': {
      fontSize: pxToRem(lg),
    },
  };
}

const FONT_PRIMARY = 'Inter Public Sans, sans-serif';

const typography = {
  fontFamily: FONT_PRIMARY,
  fontWeightRegular: 400,
  fontWeightMedium: 600,
  fontWeightBold: 700,
  h1: {
    fontWeight: 700,
    lineHeight: 80 / 64,
    fontSize: pxToRem(40),
    ...responsiveFontSizes({ sm: 52, md: 58, lg: 64 }),
  },
  h2: {
    fontWeight: 700,
    lineHeight: 64 / 48,
    fontSize: pxToRem(32),
    ...responsiveFontSizes({ sm: 40, md: 44, lg: 48 }),
  },
  h3: {
    fontWeight: 600,
    lineHeight: "29.05px",
    fontSize: pxToRem(24),
    ...responsiveFontSizes({ sm: 18, md: 22, lg: 24 }),  //used
  },
  h4: {
    fontWeight: 700,
    lineHeight: 1.5,
    fontSize: pxToRem(20),
    ...responsiveFontSizes({ sm: 20, md: 24, lg: 24 }),
  },
  h5: {
    fontWeight: 600,
    lineHeight: 1.25,
    fontSize: pxToRem(16),
    ...responsiveFontSizes({ sm: 14, md: 15, lg: 16 }),   //used
  },
  h6: {
    fontWeight: 400,
    lineHeight: 0.9,
    fontSize: pxToRem(12),
    ...responsiveFontSizes({ sm: 12, md: 12, lg: 12 }),
  },
  subtitle1: {
    fontWeight: 500,
    lineHeight: 1.5,
    fontSize: pxToRem(14),   //used
  },
  subtitle2: {
    fontWeight: 700,
    lineHeight: "16.94px",
    fontSize: pxToRem(14),  //used
  },
  body1: {
    lineHeight: 1.5,
    fontSize: pxToRem(16),
  },
  body2: {
    fontWeight: 400,
    lineHeight: "16.8px",
    fontSize: pxToRem(14),  //used
  },
  caption: {
    lineHeight: 1.5,
    fontSize: pxToRem(12),
  },
  overline: {
    fontWeight: 700,
    lineHeight: 1.5,
    fontSize: pxToRem(12),
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  button: {
    fontWeight: 700,
    lineHeight: 24 / 14,
    fontSize: pxToRem(14),
    textTransform: 'capitalize',
  },
};

export default typography;
