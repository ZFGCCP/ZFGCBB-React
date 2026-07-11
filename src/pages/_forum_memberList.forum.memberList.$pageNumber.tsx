import type { BBTableColumn } from "@/components/common/layout/BBTable";
import type { User } from "../types/user";
import type { Route } from "./+types/_forum_memberList.forum.memberList.$pageNumber";
import { getQueryClient } from "@/providers/query/queryProvider";

const MEMBER_LIST_PAGE_SIZE = 10;

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  await getQueryClient().prefetchQuery(
    bbQueryOptions(`/user/memberList?page=${params.pageNumber}`, {
      schema: UserListSchema,
    }),
  );
}

export default function MemberListContainer() {
  const navigate = useNavigate();
  const { pageNumber } = useParams();
  const query = useBBQuery(`/user/memberList?page=${pageNumber}`, {
    schema: UserListSchema,
  });

  const loadNewPage = (pageNumber: number) => {
    navigate(`/forum/memberList/${pageNumber}`);
  };

  const columns: BBTableColumn<User>[] = [
    {
      key: "avatar",
      label: "",
      className: "shrink-0 w-8",
      render: () => <div className="w-8 h-8 bg-muted rounded-full"></div>,
    },
    {
      key: "username",
      label: "Username",
      className: "grow",
      render: (_, user: User) => (
        <span className="font-medium">{user.displayName}</span>
      ),
    },
  ];

  return (
    <BBWidget widgetTitle="Member List">
      <BBQueryBoundary
        query={query}
        isEmpty={(members) => !members.length}
        empty={
          <BBEmpty message="Sure looks like a ghost town hahahahaha! 👻" />
        }
      >
        {(memberList) => {
          const currentPage = Number(pageNumber);
          const currentPageIsFull = memberList.length === MEMBER_LIST_PAGE_SIZE;
          const lastReachablePage = currentPageIsFull
            ? currentPage + 1
            : currentPage;

          return (
            <>
              <BBTable
                columns={columns}
                data={memberList}
                getRowKey={(member) => member.id!}
                emptyMessage="Sure looks like a ghost town hahahahaha! 👻"
                rowOuterFlexOptions={{ gap: "gap-4" }}
              />

              <div className="bg-accented p-4 scrollbar-thin">
                <BBPaginator
                  numPages={lastReachablePage}
                  currentPage={currentPage}
                  onPageChange={loadNewPage}
                />
              </div>
            </>
          );
        }}
      </BBQueryBoundary>
    </BBWidget>
  );
}
