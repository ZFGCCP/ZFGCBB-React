import type React from "react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusSquare, faMinusSquare } from "@fortawesome/free-solid-svg-icons";
import type { Theme } from "../../../types/theme";

// const Style = {
//   accordionWrapper: styled.div`
//     margin: 2rem;
//   `,

//   accordionHeader: styled.div<{ theme: Theme }>`
//     background-color: ${(props) => props.theme.backgroundColor};
//     border: ${(props) => props.theme.borderWidth} solid
//       ${(props) => props.theme.black};
//   `,

//   headerText: styled.h5`
//     cursor: pointer;
//   `,
// };

const Accordion: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="m-8">
      <div className="p-3 border">
        <h5 onClick={() => setExpanded((prev) => !prev)}>
          <FontAwesomeIcon
            icon={expanded ? faMinusSquare : faPlusSquare}
            className="me-2"
          />
          {title}
        </h5>
      </div>
      {expanded && <div className="m-2">{children}</div>}
    </div>
  );
};

export default Accordion;
