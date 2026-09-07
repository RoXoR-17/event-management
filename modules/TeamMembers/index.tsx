import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { notification } from "antd";
import { Fragment, useState } from "react";

import ConfirmationPopup from "@/components/ConfirmationPopup";
import TableCard from "@/components/TableCard";
import { actionsColumnData, paginatedIndexColumnData } from "@/components/TableCard/index.constant";
import {
  ButtonActionTypeEnum,
  CellActionTypeEnum,
  CellViewEnum,
  TableButtonType,
  TableCardColumnType,
} from "@/components/TableCard/index.type";
import { teamMemberSensitiveKeys } from "@/utils/actions/constant";
import {
  deleteTeamMember,
  getTeamMembers,
  TeamMemberDataType,
  TeamMemberQueryParamsType,
} from "@/utils/actions/teamMember";
import { DeleteQueryParamsType, useMutuation, useQuery } from "@/utils/hooks/ApiCall";
import TeamMemberForm from "./TeamMemberForm";
import TeamMemberView from "./TeamMemberView";

const BUTTON_LIST: TableButtonType[] = [
  {
    type: ButtonActionTypeEnum.ADD,
    label: "Add Team Member",
    icon: <PlusOutlined />,
  },
] as const;

const COLUMNS: TableCardColumnType<TeamMemberDataType>[] = [
  paginatedIndexColumnData,
  {
    title: "Name",
    dataIndex: "full_name",
    key: "full_name",
    sorter: true,
  },
  {
    title: "Designation",
    dataIndex: "designation",
    key: "designation",
    // TODO maybe add filter/sort here
  },
  {
    title: "Last Updated On",
    dataIndex: "updated_at",
    key: "updated_at",
    cellViewData: { type: CellViewEnum.DATE },
  },
  actionsColumnData,
] as const;

function TeamMembers() {
  const [selectedData, setSelectedData] = useState<TeamMemberDataType | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDetailsView, setShowDetailsView] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const {
    fetching,
    params,
    data: teamMembers,
    total,
    fetchData: fetchHandler,
  } = useQuery<TeamMemberDataType, TeamMemberQueryParamsType>({
    keysToDecrypt: teamMemberSensitiveKeys,
    promiseFn: getTeamMembers,
  });

  const { mutuating: deleting, mutuateData: deleteHandler } = useMutuation<DeleteQueryParamsType>({
    promiseFn: ({ id }) => deleteTeamMember(id),
    onSuccess: () => {
      notification.success({ message: "Team member deleted successfully" });
      setShowDeleteConfirmation(false);
      fetchHandler();
    },
    onError: () => {
      notification.error({ message: "Failed to delete team member" });
    },
  });

  const onButtonActionHandler = (type: ButtonActionTypeEnum) => {
    switch (type) {
      case ButtonActionTypeEnum.ADD:
        setSelectedData(null);
        setShowForm(true);
        break;
      default:
        break;
    }
  };

  const onCellActionHandler = (
    type: CellActionTypeEnum,
    record: TeamMemberDataType,
    // index: number | undefined
  ) => {
    setSelectedData(record);

    switch (type) {
      case CellActionTypeEnum.VIEW:
        setShowDetailsView(true);
        break;
      case CellActionTypeEnum.EDIT:
        setShowForm(true);
        break;
      case CellActionTypeEnum.DELETE:
        setShowDeleteConfirmation(true);
      default:
        break;
    }
  };

  return (
    <Fragment>
      <TableCard
        title="Team Members"
        buttonList={BUTTON_LIST}
        onButtonAction={onButtonActionHandler}
        columns={COLUMNS}
        loading={fetching}
        data={teamMembers}
        total={total}
        params={params}
        onTableAction={(_, updatedParams) => fetchHandler({ ...params, ...updatedParams })}
        onCellAction={onCellActionHandler}
      />
      <TeamMemberForm
        show={showForm}
        onClose={(success) => {
          if (success) fetchHandler();
          setShowForm(false);
        }}
        selectedData={selectedData}
      />
      <TeamMemberView
        show={showDetailsView}
        onClose={() => setShowDetailsView(false)}
        selectedData={selectedData}
      />
      <ConfirmationPopup
        title="Delete Team Member"
        subTitle="Once deleted, this can't be restored. Do you want to continue?"
        icon={<DeleteOutlined style={{ fontSize: "2rem", color: "var(--rs-color-error)" }} />}
        show={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        okButtonProps={{ danger: true }}
        okText="Yes, Delete"
        onOk={() => deleteHandler({ id: selectedData?.id || "" })}
        confirmLoading={deleting}
      />
    </Fragment>
  );
}

export default TeamMembers;
