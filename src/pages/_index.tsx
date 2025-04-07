import type React from "react";
import { styled } from "styled-components";
import Widget from "../components/common/widgets/widget.component";
import BBImage from "@/components/common/bbImage.component";
import BBLink from "@/components/common/bbLink.component";

const Style = {
  FeaturedProjectImg: styled.img`
    height: 100%;
    width: max-content;
    object-fit: cover;
    flex-shrink: 0;
  `,
};

const Home: React.FC = () => {
  return (
    <article className="container-xxl">
      <section className="row">
        <div className="col-lg-6 my-2">
          <Widget widgetTitle="Featured Project">
            <div className="row">
              <div className="col-12 col-lg-6">
                <BBImage
                  className="img-fluid mx-auto d-block"
                  src="images/potm/triforceSaga.png"
                  as={Style.FeaturedProjectImg}
                  alt="FIXME: add proper alt text"
                />
              </div>
              <div className="border-start-0 border-lg-start border-lg-2 border-lg-black border-black col-12 col-lg-6 ">
                <h5>Triforce Saga</h5>
                <h6>Developer: chaoazul1</h6>
              </div>
            </div>
          </Widget>
        </div>

        <div className="col-lg-6 my-2">
          <Widget widgetTitle="Recent Activity">
            <>
              <div>
                <h6>7/23/2024 - blah blah blah</h6>
                <div>Test content</div>
              </div>
            </>
          </Widget>
        </div>
      </section>

      <div className="row">
        <div className="col-12 my-2">
          <Widget widgetTitle="Announcements">
            <article>
              <header>
                <h1 className="fs-1">It's dangerous to go alone!</h1>
                <h2 className="fs-6 fst-italic">Date: 04/05/2025</h2>
              </header>
              <main>
                <p>
                  Slowly the site is coming back together. We could use your
                  help! If you're interested, check out the repo on GitHub and
                  join the ZFGC Community Project (ZFGCCP) effort in rewriting
                  the site!
                  <br />
                  <BBLink
                    to="https://github.com/ZFGCCP/ZFGCBB-React"
                    target="_blank"
                  >
                    Come join the effort!
                  </BBLink>
                  <br />
                </p>
              </main>
            </article>
          </Widget>
        </div>
      </div>
    </article>
  );
};

export default Home;

export function meta() {
  return [{ title: "Home" }];
}
