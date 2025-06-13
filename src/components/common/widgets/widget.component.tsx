import type React from "react";

const Widget: React.FC<{
  widgetTitle?: string;
  className?: string;
  children: React.ReactNode;
}> = ({ widgetTitle, className = "", children }) => {
  return (
    <section className={`bg-background border border-black ${className}`}>
      {widgetTitle && (
        <h6 className="p-1 m-0 border-b border-black font-bold">
          {widgetTitle}
        </h6>
      )}
      <div>{children}</div>
    </section>
  );
};

export default Widget;
