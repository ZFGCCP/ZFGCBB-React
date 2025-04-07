import type React from "react";
import { useContext } from "react";
import Widget from "../components/common/widgets/widget.component";
import { ThemeContext } from "../providers/theme/themeProvider";

const UserRegistration: React.FC = () => {
  const { currentTheme } = useContext(ThemeContext);
  return (
    <Widget widgetTitle={"Registration"}>
      <div className="flex flex-col md:flex-row p-8">
        <p className="text-base text-gray-700">
          Please fill out the form below to register your account.
        </p>
      </div>
    </Widget>
  );
};

export default UserRegistration;
