import type React from "react";
import { useContext, useState } from "react";
import { ThemeContext } from "../../../providers/theme/themeProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusSquare, faMinusSquare } from "@fortawesome/free-solid-svg-icons";

const Accordion: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => {
  const { currentTheme } = useContext(ThemeContext);
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="m-8">
      <div
        className="p-3"
        style={{
          backgroundColor: currentTheme.backgroundColor,
          border: `${currentTheme.borderWidth} solid ${currentTheme.black}`,
        }}
      >
        <h5
          className="cursor-pointer"
          onClick={() => setExpanded((prev) => !prev)}
        >
          <FontAwesomeIcon
            icon={expanded ? faMinusSquare : faPlusSquare}
            className="mr-2"
          />
          {title}
        </h5>
      </div>
      {expanded && <div className="m-2">{children}</div>}
    </div>
  );
};

export default Accordion;
