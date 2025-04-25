import type React from "react";
import Widget from "../components/common/widgets/widget.component";

const Sonic: React.FC = () => {
  return (
    <div className="row">
      <div className="col-12 my-2">
        <Widget widgetTitle="Sonic">
          <div className="d-flex flex-column flex-md-row justify-content-center">
            <img src="https://pa1.aminoapps.com/7508/074c64ca038d1e4a61d03fede5555ef1fbc047c5r1-640-640_hq.gif" />
          </div>
        </Widget>
      </div>
    </div>
  );
};

export default Sonic;
