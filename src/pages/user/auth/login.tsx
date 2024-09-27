import React, { useContext } from "react";
import Widget from "../../../components/common/widgets/widget.component";

const UserLogin: React.FC = () => {
  return (
    <div className="row">
      <div className="col-12 my-2">
        <Widget widgetTitle={"Login"}>
          <div className="d-flex flex-column flex-md-row"></div>
        </Widget>
      </div>
    </div>
  );
};

export default UserLogin;
