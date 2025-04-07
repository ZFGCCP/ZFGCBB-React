import type React from "react";
import { useContext } from "react";
import { useBBQuery } from "../hooks/useBBQuery";
import type { User } from "../types/user";
import { ThemeContext } from "../providers/theme/themeProvider";
import Accordion from "../components/common/accordion/Accordion.component";
import { useParams } from "react-router";
import UserLeftPane from "../components/user/userLeftPane.component";

const UserProfileMaster: React.FC<{ userId: string }> = () => {
  const { userId } = useParams();
  const { data: user } = useBBQuery<User>(`/user-profile/${userId}`);
  const { currentTheme } = useContext(ThemeContext);

  return (
    <div className="flex flex-col md:flex-row">
      {user && <UserLeftPane user={user} />}
      <div className="right-pane w-full md:w-9/12">
        <Accordion title="Bio Information">
          <form>
            <div className="mb-4">
              <label
                htmlFor="displayname"
                className="block text-sm font-medium text-gray-700"
              >
                Displayname
              </label>
              <input
                type="text"
                id="displayname"
                value={user?.displayName}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="personalText"
                className="block text-sm font-medium text-gray-700"
              >
                Personal Text
              </label>
              <input
                type="text"
                id="personalText"
                value={user?.bioInfo?.personalText}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="dob"
                className="block text-sm font-medium text-gray-700"
              >
                Date of Birth
              </label>
              <input
                type="text"
                id="dob"
                placeholder="MM/dd/YYYY"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-700"
              >
                Gender
              </label>
              <select
                id="gender"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              >
                <option value="1">Male</option>
                <option value="2">Female</option>
                <option value="3">Non-binary/Other</option>
                <option value="4">Prefer not to say</option>
              </select>
            </div>
          </form>
        </Accordion>

        <Accordion title="Contact Information">
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="discord"
              className="block text-sm font-medium text-gray-700"
            >
              Discord
            </label>
            <input
              type="text"
              id="discord"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="facebook"
              className="block text-sm font-medium text-gray-700"
            >
              Facebook
            </label>
            <input
              type="text"
              id="facebook"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="instagram"
              className="block text-sm font-medium text-gray-700"
            >
              Instagram
            </label>
            <input
              type="text"
              id="instagram"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="threads"
              className="block text-sm font-medium text-gray-700"
            >
              Threads
            </label>
            <input
              type="text"
              id="threads"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="twitter"
              className="block text-sm font-medium text-gray-700"
            >
              Twitter
            </label>
            <input
              type="text"
              id="twitter"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>
        </Accordion>
      </div>
    </div>
  );
};

export default UserProfileMaster;
