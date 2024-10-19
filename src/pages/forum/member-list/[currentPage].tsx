import type React from "react";
import { useContext, useMemo, useState } from "react";
import { useParams } from "react-router";
import { styled } from "@linaria/react";
import { Button } from "react-bootstrap";

import Widget from "../../../components/common/widgets/widget.component";
import { useBBQuery } from "../../../hooks/useBBQuery";
import type { Board } from "../../../types/forum";
import type { Theme } from "../../../types/theme";
import { ThemeContext } from "../../../providers/theme/themeProvider";
import BBLink from "../../../components/common/bbLink";
import { Pagination } from "react-bootstrap";
import BBPaginator from "../../../components/common/paginator/bbPaginator.component";
import BBTable from "../../../components/common/tables/bbTable.component";
import type { User } from "../../../types/user";

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
  const { currentTheme } = useContext(ThemeContext);
  const { currentPage: initialCurrentPage } = useParams();
  const [currentPage, setCurrentPage] = useState(initialCurrentPage ?? 1);
  const memberList = useBBQuery<User[]>(
    `user/memberList?pageNo=${currentPage}`,
  );

  const loadNewPage = (pageNo: number) => {
    setCurrentPage(pageNo);
  };

  return (
    <>
      <div className="row">
        <div className="col-12 my-2">
          {memberList && memberList.length > 0 && (
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
                {memberList?.map((user) => {
                  return (
                    <Style.row
                      className="tableRow body"
                      theme={currentTheme}
                    ></Style.row>
                  );
                })}
              </tbody>
            </BBTable>
          )}
        </div>
      </div>
    </>
  );
};
