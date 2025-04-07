import type React from "react";
import Widget from "../components/common/widgets/widget.component";
import BBImage from "@/components/common/bbImage.component";
import BBLink from "@/components/common/bbLink.component";

const Home: React.FC = () => {
  return (
    <article className="container-xxl">
      <section className="row">
        {/* Featured Project Section */}
        <div className="col-lg-6 my-2">
          <Widget widgetTitle="Featured Project">
            <div className="flex flex-wrap">
              <div className="w-full lg:w-1/2">
                <BBImage
                  className="mx-auto block w-full object-cover"
                  src="images/potm/triforceSaga.png"
                  alt="FIXME: add proper alt text"
                />
              </div>
              <div className="border-l-0 lg:border-l-2 lg:border-black border-black w-full lg:w-1/2 p-4">
                <h5>Triforce Saga</h5>
                <h6>Developer: chaoazul1</h6>
              </div>
            </div>
          </Widget>
        </div>

        {/* Recent Activity Section */}
        <div className="col-lg-6 my-2">
          <Widget widgetTitle="Recent Activity">
            <div>
              <h6>7/23/2024 - blah blah blah</h6>
              <div>Test content</div>
            </div>
          </Widget>
        </div>
      </section>

      {/* Announcements Section */}
      <div className="row">
        <div className="col-12 my-2">
          <Widget widgetTitle="Announcements">
            <article>
              <header>
                <h1 className="text-4xl">It's dangerous to go alone!</h1>
                <h2 className="text-lg italic">Date: 04/05/2025</h2>
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
