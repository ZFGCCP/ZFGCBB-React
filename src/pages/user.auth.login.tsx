import type React from "react";
import Widget from "../components/common/widgets/widget.component";

const UserLogin: React.FC = () => {
  return (
    <Widget widgetTitle={"Login"}>
      <div className="flex flex-col md:flex-row"></div>
    </Widget>
  );
};

export default UserLogin;
