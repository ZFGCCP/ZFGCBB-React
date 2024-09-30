import type React from "react";
import { useBBQuery } from "../../hooks/useBBQuery";
import Widget from "../../components/common/widgets/widget.component";
import { styled } from "@linaria/react";
import type { BBPaginationPage } from "../../types/api";
import { User } from "../../types/user";

const Style = {
  FeaturedProjectImg: styled.img`
    border-right: 0.1rem solid black;
  `,
};

const Home: React.FC = () => {
  const currentUsersPage = useBBQuery<BBPaginationPage<User>>("users");
  return (
    <div className="row">
      <div className="col-12 col-lg-6 my-2">
        <Widget widgetTitle="Featured Project">
          <div className="d-flex">
            <Style.FeaturedProjectImg
              src="http://zfgc.com/files/potms/triforceSaga.png"
              className="col-12 col-lg-6"
            />
            <div className="ms-2 mt-2 col-12 col-lg-6">
              <h5>Triforce Saga</h5>
              <h6>Developer: chaoazul1</h6>
            </div>
          </div>
        </Widget>
      </div>

      <div className="col-12 col-lg-6 my-2">
        <Widget widgetTitle="Announcements">
          <>
            <div>
              <h6>7/23/2024 - blah blah blah</h6>
              <div>Test content</div>
            </div>
          </>
        </Widget>
      </div>

      <div className="col-12 my-2">
        <Widget widgetTitle="Announcements">
          <>
            <div>Test content</div>
          </>
        </Widget>
      </div>
    </div>
  );
};

export default Home;
