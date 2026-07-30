import type { Route } from "./+types/_user_profile.user.profile.$userId";
import { getQueryClient } from "@/providers/query/queryProvider";
import megadethThemeUrl from "../../public/music/megadeth - washington is next.mp3?url";

const PROFILE_ADMIN_PERMISSIONS = [
  "ZFGC_SITE_ADMIN",
  "ZFGC_PROFILE_ADMIN",
] as const;

export const loader = ({ request, params }: Route.LoaderArgs) =>
  prefetchQueryDehydrated(
    request,
    `/user-profile/${params.userId}`,
    UserSchema,
  );

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  await getQueryClient().prefetchQuery(
    bbQueryOptions(`/user-profile/${params.userId}`, {
      schema: UserSchema,
      meta: { userScoped: true },
    }),
  );
}

function MgZeroEasterEgg() {
  const audioRef = useEasterEggAudio();

  return (
    <audio
      ref={audioRef}
      src={megadethThemeUrl}
      loop
      preload="auto"
      className="hidden"
    >
      <track kind="captions" />
    </audio>
  );
}

function UserProfileContent() {
  const { userId } = useParams();
  const query = useBBQuery(`/user-profile/${userId}`, {
    schema: UserSchema,
    meta: { userScoped: true },
  });

  return (
    <BBQueryBoundary query={query}>
      {(user) => (
        <div className="flex flex-col md:flex-row">
          {user?.displayName?.toLowerCase() === "mg-zero" && (
            <MgZeroEasterEgg />
          )}
          <span className="w-full  md:w-1/4">
            <UserLeftPane user={user} />
          </span>

          <div className="col-span-12 md:col-span-9 w-full grow">
            <BBAccordionWidget title="BIO INFORMATION" startExpanded>
              <form className="space-y-4">
                <BBFlex
                  direction="col"
                  align="start"
                  className="sm:flex-row sm:items-center"
                >
                  <label
                    htmlFor="profile-display-name"
                    className="block text-md font-medium mb-1 flex-auto md:flex-1/2"
                  >
                    Display Name
                  </label>
                  <span className="flex-1/2">
                    <BBInput
                      name="profile-display-name"
                      value={user?.displayName || ""}
                      disabled={true}
                    />
                  </span>
                </BBFlex>

                <BBFlex
                  direction="col"
                  align="start"
                  className="sm:flex-row sm:items-center"
                >
                  <label
                    htmlFor="profile-personal-text"
                    className="block text-md font-medium mb-1 flex-auto md:flex-1/2"
                  >
                    Personal Text
                  </label>
                  <span className="flex-1/2">
                    <BBInput
                      name="profile-personal-text"
                      value={user?.bioInfo?.personalText || ""}
                      disabled={true}
                    />
                  </span>
                </BBFlex>

                <BBFlex
                  direction="col"
                  align="start"
                  className="sm:flex-row sm:items-center"
                >
                  <label
                    htmlFor="profile-custom-title"
                    className="block text-md font-medium mb-1 flex-auto md:flex-1/2"
                  >
                    Custom Title
                  </label>
                  <span className="flex-1/2">
                    <BBInput
                      name="profile-custom-title"
                      value={user?.bioInfo?.customTitle || ""}
                      disabled={true}
                    />
                  </span>
                </BBFlex>

                <BBFlex
                  direction="col"
                  align="start"
                  className="sm:flex-row sm:items-center"
                >
                  <label
                    htmlFor="profile-date-of-birth"
                    className="block text-md font-medium mb-1 flex-auto md:flex-1/2"
                  >
                    Date of Birth
                  </label>
                  <span className="flex-1/2">
                    <BBInput
                      name="profile-date-of-birth"
                      type="date"
                      placeholder="MM/dd/YYYY"
                      disabled={true}
                      value={user?.bioInfo?.birthDate || ""}
                    />
                  </span>
                </BBFlex>

                <BBFlex
                  direction="col"
                  align="start"
                  className="sm:flex-row sm:items-center"
                >
                  <label
                    htmlFor="profile-gender"
                    className="block text-md font-medium mb-1 flex-auto md:flex-1/2"
                  >
                    Gender
                  </label>
                  <select
                    id="profile-gender"
                    className="w-full p-2 bg-default border border-default flex-1/2"
                    value={String(user?.bioInfo?.genderId ?? "")}
                    disabled={true}
                  >
                    <option value="1">Male</option>
                    <option value="2">Female</option>
                    <option value="3">Non-binary/Other</option>
                    <option value="4">Prefer not to say</option>
                  </select>
                </BBFlex>

                <div className="flex flex-col">
                  <span className="block text-md font-medium mb-1 flex-auto md:flex-1/2">
                    Signature
                  </span>
                  <UserSignature user={user} />
                </div>
              </form>
            </BBAccordionWidget>

            <BBAccordionWidget title="Contact Information">
              <form className="space-y-4">
                {user?.bioInfo?.hideEmailFlag !== true && (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center">
                    <label
                      htmlFor="profile-email-address"
                      className="block text-md font-medium mb-1 flex-auto md:flex-1/2"
                    >
                      Email Address
                    </label>
                    <span className="flex-1/2">
                      <BBInput
                        name="profile-email-address"
                        value={
                          user?.contactInfo?.emailAddress?.emailAddress || ""
                        }
                        disabled={true}
                      />
                    </span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-start sm:items-center">
                  <label
                    htmlFor="profile-discord"
                    className="block text-md font-medium mb-1 flex-auto md:flex-1/2"
                  >
                    Discord
                  </label>
                  <span className="flex-1/2">
                    <BBInput
                      name="profile-discord"
                      value={""}
                      disabled={true}
                    />
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center">
                  <label
                    htmlFor="profile-facebook"
                    className="block text-md font-medium mb-1 flex-auto md:flex-1/2"
                  >
                    Facebook
                  </label>
                  <span className="flex-1/2">
                    <BBInput
                      name="profile-facebook"
                      value={""}
                      disabled={true}
                    />
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center">
                  <label
                    htmlFor="profile-instagram"
                    className="block text-md font-medium mb-1 flex-auto md:flex-1/2"
                  >
                    Instagram
                  </label>
                  <span className="flex-1/2">
                    <BBInput
                      name="profile-instagram"
                      value={""}
                      disabled={true}
                    />
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center">
                  <label
                    htmlFor="profile-threads"
                    className="block text-md font-medium mb-1 flex-auto md:flex-1/2"
                  >
                    Threads
                  </label>
                  <span className="flex-1/2">
                    <BBInput
                      name="profile-threads"
                      value={""}
                      disabled={true}
                    />
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center">
                  <label
                    htmlFor="profile-twitter"
                    className="block text-md font-medium mb-1 flex-auto md:flex-1/2"
                  >
                    Twitter
                  </label>
                  <span className="flex-1/2">
                    <BBInput
                      name="profile-twitter"
                      value={""}
                      disabled={true}
                    />
                  </span>
                </div>
              </form>
            </BBAccordionWidget>

            <BBHasPermission requiredPermissions={PROFILE_ADMIN_PERMISSIONS}>
              <UserAwardGrantPanel userId={Number(userId)} />
            </BBHasPermission>
          </div>
        </div>
      )}
    </BBQueryBoundary>
  );
}

export default function UserProfileRoute() {
  return <UserProfileContent />;
}
