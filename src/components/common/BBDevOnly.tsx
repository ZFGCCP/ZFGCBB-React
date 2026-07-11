export default function BBDevOnly({ children }: { children: React.ReactNode }) {
  return import.meta.env.DEV ? children : null;
}
