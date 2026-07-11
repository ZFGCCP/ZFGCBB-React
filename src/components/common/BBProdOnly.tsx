export default function BBProdOnly({
  children,
}: {
  children: React.ReactNode;
}) {
  return import.meta.env.PROD ? children : null;
}
