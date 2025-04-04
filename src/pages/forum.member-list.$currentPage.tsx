import type React from "react";
import { useContext, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { styled } from "styled-components";
import { Button, Pagination } from "react-bootstrap";
import BBTable from "../components/common/tables/bbTable.component";
import { useBBQuery } from "../hooks/useBBQuery";
import { ThemeContext } from "../providers/theme/themeProvider";
import type { Theme } from "../types/theme";
import type { User } from "../types/user";
import BBPaginator from "@/components/common/paginator/bbPaginator.component";

const Style = {
  forumDesc: styled.div`
    font-size: 0.8rem;
  `,

  boardFooter: styled.div<{ theme: Theme }>`
    background-color: ${(props) => props.theme.footerColor};
  `,

  row: styled.tr<{ theme: Theme }>`
    &.subRow {
      th {
        background-color: ${(props) => props.theme.black};
        color: ${(props) => props.theme.textColor};
        font-size: 0.75rem;
        border: 0;
      }
    }
  `,

  FooterButton: styled(Button)<{ theme: Theme }>`
    &.footer-btn {
      border-top-left-radius: 0;
      border-top-right-radius: 0;
      background-color: #25334e;
      border-top: 0;
      border: ${(props) => props.theme.borderWidth} solid
        ${(props) => props.theme.black};
      padding-right: 0.2rem;
      border-bottom-right-radius: 0;
      border-bottom-left-radius: 0;
      border-right: 0;

      &:first-child {
        border-bottom-left-radius: 0.5rem;
      }

      &:last-child {
        border-bottom-right-radius: 0.5rem;
        border-right: 0.2rem solid black;
      }
    }
  `,

  pagination: styled(Pagination)<{ theme: Theme }>`
    &.pagination {
      margin-bottom: 0;

      li.page-item {
        &:hover {
          background-color: ${(props) => props.theme.backgroundColor};
        }

        a {
          border: 0;
        }
      }
    }
  `,
};

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
      <div className="row">
        <div className="col-12 my-2">
          <BBTable>
            <thead>
              <Style.row className="tableRow" theme={currentTheme}>
                <th></th>
                <th></th>
                <th>Username</th>
                <th>Email</th>
                <th>Joined</th>
                <th>Last Seen</th>
              </Style.row>
              <Style.row className="subRow" theme={currentTheme}>
                <th colSpan={7}></th>
              </Style.row>
            </thead>
            <tbody>
              {(memberList &&
                memberList.length > 0 &&
                memberList?.map((user) => {
                  return (
                    <Style.row
                      className="tableRow body"
                      theme={currentTheme}
                      key={`${user.id}`}
                    >
                      <td></td>
                      <td></td>
                      <td>{user.displayName}</td>
                      <td>email</td>
                      <td>joined</td>
                      <td>last seen</td>
                    </Style.row>
                  );
                }) && (
                  <Style.row className="tableRow" theme={currentTheme}>
                    <td>
                      <Style.boardFooter theme={currentTheme}>
                        {memberList && (
                          <BBPaginator
                            numPages={memberList.length / 10}
                            currentPage={Number(currentPage)}
                            onPageChange={loadNewPage}
                          />
                        )}
                      </Style.boardFooter>
                    </td>
                  </Style.row>
                )) || (
                <Style.row className="tableRow body" theme={currentTheme}>
                  <td colSpan={7}>
                    <div>Sure looks like a ghost town hahahahaha! 👻</div>
                  </td>
                </Style.row>
              )}
            </tbody>
          </BBTable>
        </div>
      </div>
    </>
  );
};

export default MemberListContainer;
