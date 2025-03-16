import type React from "react";
import { useContext, useMemo, useState } from "react";
import { useParams } from "react-router";
import { styled } from "@pigment-css/react";
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
  forumDesc: styled("div")({
    fontSize: "0.8rem",
  }),
  boardFooter: styled("div")<{ theme: Theme }>({
    backgroundColor: (props) => props.theme.footerColor,
  }),
  row: styled("tr")<{ theme: Theme }>({
    "&.subRow": {
      th: {
        backgroundColor: (props) => props.theme.black,
        color: (props) => props.theme.textColor,
        fontSize: "0.75rem",
        border: "0",
      },
    },
    ".tableRow": {
      borderBottom: (props) =>
        props.theme.borderWidth + " solid " + props.theme.black,
    },
  }),
  FooterButton: styled(Button)<{ theme: Theme }>({
    borderTopLeftRadius: "0",
    borderTopRightRadius: "0",
    backgroundColor: (props) => props.theme.black,
    border: (props) => props.theme.borderWidth + " solid " + props.theme.black,
    borderTop: "0",
    borderBottomRightRadius: "0",
    borderBottomLeftRadius: "0",
    borderRight: "0",
    "&:first-child": {
      borderBottomLeftRadius: "0.5rem",
    },
    "&:last-child": {
      borderBottomRightRadius: "0.5rem",
      borderRight: "0.2rem solid black",
    },
  }),
  pagination: styled(Pagination)<{ theme: Theme }>({
    marginBottom: "0",
    "&.pagination": {
      li: {
        "&.page-item": {
          "&:hover": {
            backgroundColor: (props) => props.theme.backgroundColor,
          },
          a: {
            border: "0",
          },
        },
      },
      "li.page-item": {
        ":hover": {
          backgroundColor: (props) => props.theme.backgroundColor,
        },
        a: {
          border: "0",
        },
      },
    },
  }),

  //     &:last-child {
  //       border-bottom-right-radius: 0.5rem;
  //       border-right: 0.2rem solid black;
  //     }
  //   }
  // `,

  // pagination: styled(Pagination)<{ theme: Theme }>`
  //   &.pagination {
  //     margin-bottom: 0;

  //     li.page-item {
  //       &:hover {
  //         background-color: ${(props) => props.theme.backgroundColor};
  //       }

  //       a {
  //         border: 0;
  //       }
  //     }
  //   }
  // `,
};

const MemberListContainer: React.FC = () => {
  const { currentTheme } = useContext(ThemeContext);
  const { currentPage: initialCurrentPage } = useParams();
  const [currentPage, setCurrentPage] = useState(initialCurrentPage ?? 1);
  const { data: memberList } = useBBQuery<User[]>(
    `user/memberList?pageNo=${currentPage}`,
  );

  const loadNewPage = (pageNo: number) => {
    setCurrentPage(pageNo);
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
                })) || (
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
