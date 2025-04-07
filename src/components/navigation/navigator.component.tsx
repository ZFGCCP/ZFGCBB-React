import type React from "react";
import BBLink, { type BBLinkProps } from "../common/bbLink.component";

/**
 * The tab link component (NavTab) that uses Tailwind for styling.
 */
const NavTab: React.FC<Omit<BBLinkProps, "relative">> = ({
  title,
  ...props
}) => {
  return (
    <div className="flex px-4 mx-1 items-center border-[0.2rem] border-black bg-[#1e2b44] border-b-0 rounded-t-lg">
      <BBLink {...props} relative="path">
        {title}
      </BBLink>
    </div>
  );
};

/**
 * The main navigator component.
 */
const Navigator: React.FC = () => {
  return (
    <nav className="hidden md:flex items-end">
      <NavTab title="Home" to="/" />
      <NavTab title="Forum" to="/forum" prefetch="intent" />
      <div className="flex px-4 mx-1 items-center border-[0.2rem] border-black bg-[#1e2b44] border-b-0 rounded-t-lg">
        <BBLink
          to={"https://discord.gg/NP2nNKjun6"}
          relative="path"
          target="_blank"
        >
          Chat
        </BBLink>
      </div>
      <div className="flex px-4 mx-1 items-center border-[0.2rem] border-black bg-[#1e2b44] border-b-0 rounded-t-lg">
        <BBLink to={"http://wiki.zfgc.com"} relative="path" target="_blank">
          Wiki
        </BBLink>
      </div>
      <NavTab title="Projects" to="/projects" />
      <NavTab title="Resources" to="/resources" />
    </nav>
  );
};

export default Navigator;
