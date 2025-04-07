import type React from "react";
import { useContext } from "react";
import { useNavigate, useParams } from "react-router";
import BBTable from "../components/common/tables/bbTable.component";
import { useBBQuery } from "../hooks/useBBQuery";
import { ThemeContext } from "../providers/theme/themeProvider";
import type { User } from "../types/user";
import BBPaginator from "@/components/common/paginator/bbPaginator.component";

const MemberListContainer: React.FC = () => {
  const navigate = useNavigate();
  const { currentTheme } = useContext(ThemeContext);
  const { currentPage } = useParams();
  const { data: memberList } = useBBQuery<User[]>(
    `/user/memberList?pageNo=${currentPage}`,
  );

  const loadNewPage = (pageNo: number) => {
    navigate(`/forum/member-list/${pageNo}`);
  };

  return (
    <>
      <BBTable>
        <thead>
          <tr className="table-row">
            <th></th>
            <th></th>
            <th>Username</th>
            <th>Email</th>
            <th>Joined</th>
            <th>Last Seen</th>
          </tr>
          <tr className="sub-row">
            <th colSpan={7}></th>
          </tr>
        </thead>
        <tbody>
          {(memberList &&
            memberList.length > 0 &&
            memberList.map((user) => {
              return (
                <tr className="table-row body" key={`${user.id}`}>
                  <td></td>
                  <td></td>
                  <td>{user.displayName}</td>
                  <td>email</td>
                  <td>joined</td>
                  <td>last seen</td>
                </tr>
              );
            })) || (
            <tr className="table-row body">
              <td colSpan={7}>
                <div className="text-center text-xl">
                  Sure looks like a ghost town hahahahaha! 👻
                </div>
              </td>
            </tr>
          )}
          {memberList && memberList.length > 0 && (
            <tr className="table-row">
              <td
                colSpan={7}
                className="bg-gray-800 border-t-2 border-gray-600"
              >
                <BBPaginator
                  numPages={memberList.length / 10}
                  currentPage={Number(currentPage)}
                  onPageChange={loadNewPage}
                />
              </td>
            </tr>
          )}
        </tbody>
      </BBTable>
    </>
  );
};

export default MemberListContainer;
