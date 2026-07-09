export function useTheme(userTheme: string) {
  const [theme, setTheme] = useState(userTheme);
  return { theme, setTheme };
}
