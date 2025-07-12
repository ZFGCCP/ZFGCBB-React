import Widget from "../components/common/widgets/widget.component";
import BBImage from "@/components/common/bbImage.component";
import BBLink from "@/components/common/bbLink.component";

export default () => {
  return (
    <article>
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4   ">
        <div className="my-2">
          <Widget widgetTitle="Featured Project">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
              <div className="flex justify-center w-full ">
                <BBImage
                  className="max-w-full h-auto object-cover"
                  src="images/potm/triforceSaga.png"
                  alt="Triforce Saga project screenshot"
                />
              </div>
              <div className="border-l-0 lg:border-l-2 lg:border-default lg:pl-4">
                <h5 className="text-highlighted">Triforce Saga</h5>
                <h6 className="text-muted">Developer: chaoazul1</h6>
              </div>
            </div>
          </Widget>
        </div>

        <div className="my-2">
          <Widget widgetTitle="Recent Activity">
            <div className="p-4">
              <div>
                <h6 className="text-highlighted">7/23/2024 - blah blah blah</h6>
                <div>Test content</div>
              </div>
            </div>
          </Widget>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4">
        <div className="my-2">
          <Widget widgetTitle="Announcements">
            <article className="p-4">
              <header>
                <h1 className="text-4xl text-highlighted">
                  It's dangerous to go alone!
                </h1>
                <h2 className="text-base italic text-muted">
                  Date: 04/05/2025
                </h2>
              </header>
              <main className="mt-4">
                <p className="">
                  Slowly the site is coming back together. We could use your
                  help! If you're interested, check out the repo on GitHub and
                  join the ZFGC Community Project (ZFGCCP) effort in rewriting
                  the site!
                  <br />
                  <BBLink
                    to="https://github.com/ZFGCCP/ZFGCBB-React"
                    target="_blank"
                    className="text-highlighted"
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

export function meta() {
  return [{ title: "Home" }];
}
