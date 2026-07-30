export default function UnknownSpecialPage({ name }: { name: string }) {
  return (
    <BBWidget widgetTitle={name}>
      <p className="p-4 text-sm text-dimmed">
        This special page isn&apos;t available. Try{" "}
        <BBLink to="/wiki/special/allpages" className="text-highlighted">
          All pages
        </BBLink>
        ,{" "}
        <BBLink to="/wiki/special/categories" className="text-highlighted">
          Categories
        </BBLink>{" "}
        or{" "}
        <BBLink to="/wiki/special/statistics" className="text-highlighted">
          Statistics
        </BBLink>
        .
      </p>
    </BBWidget>
  );
}
