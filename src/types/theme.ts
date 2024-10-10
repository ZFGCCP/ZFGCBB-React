export type Theme = {
  borderWidth: string;

  backgroundColor: string;
  footerColor: string;
  headerColor: string;
  widgetColor: string;
  tableRow: string;
  tableRowAlt: string;
  textColor: string;
  black: string;
  white: string;
  linkColor: string;
  linkColorVisited: string;
};

export type ThemeWrapper = {
  currentTheme: Theme;
};
