import type { BBTableColumn } from "@/components/common/layout/BBTable";
import type { User } from "@/types/user";
import type { Route } from "./+types/route";
import { getQueryClient } from "@/providers/query/queryProvider";

const MEMBER_LIST_PAGE_SIZE = 10;
const MEMBER_LIST_EMPTY_STATE = (
  <BBEmpty message="Sure looks like a ghost town hahahahaha! 👻" />
);
const MEMBER_ROW_FLEX_OPTIONS = { gap: "gap-4" } as const;
const isMemberListEmpty = (members: User[]) => members.length === 0;
const getMemberRowKey = (member: User) => member.id ?? member.displayName;
const renderAvatar = () => (
  <div className="w-8 h-8 bg-muted rounded-full"></div>
);
const renderUsername = (_: unknown, user: User) => (
  <span className="font-medium">{user.displayName}</span>
);
const MEMBER_COLUMNS: BBTableColumn<User>[] = [
  {
    key: "avatar",
    label: "",
    className: "shrink-0 w-8",
    render: renderAvatar,
  },
  {
    key: "username",
    label: "Username",
    className: "grow",
    render: renderUsername,
  },
];

function MemberListResults({
  members,
  page,
  onPageChange,
}: {
  members: User[];
  page: number;
  onPageChange: (page: number) => void;
}) {
  const currentPageIsFull = members.length === MEMBER_LIST_PAGE_SIZE;
  const lastReachablePage = currentPageIsFull ? page + 1 : page;

  return (
    <>
      <BBTable
        columns={MEMBER_COLUMNS}
        data={members}
        getRowKey={getMemberRowKey}
        emptyMessage="Sure looks like a ghost town hahahahaha! 👻"
        rowOuterFlexOptions={MEMBER_ROW_FLEX_OPTIONS}
      />
      <div className="bg-accented p-4 scrollbar-thin">
        <BBPaginator
          numPages={lastReachablePage}
          currentPage={page}
          onPageChange={onPageChange}
        />
      </div>
    </>
  );
}

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

  const loadNewPage = useCallback(
    (nextPage: number) => {
      void navigate(`/forum/memberList/${nextPage}`);
    },
    [navigate],
  );
  const renderMembers = useCallback(
    (members: User[]) => (
      <MemberListResults
        members={members}
        page={Number(pageNumber)}
        onPageChange={loadNewPage}
      />
    ),
    [loadNewPage, pageNumber],
  );

  return (
    <BBWidget widgetTitle="Member List">
      <BBQueryBoundary
        query={query}
        isEmpty={isMemberListEmpty}
        empty={MEMBER_LIST_EMPTY_STATE}
      >
        {renderMembers}
      </BBQueryBoundary>
    </BBWidget>
  );
}
