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
import { patientSensitiveKeys } from "@/utils/actions/constant";
import {
  deletePatient,
  getPatients,
  PatientDataType,
  PatientQueryParamsType,
} from "@/utils/actions/patient";
import { DeleteQueryParamsType, useMutuation, useQuery } from "@/utils/hooks/ApiCall";
import PatientForm from "./PatientForm";
import PatientView from "./PatientView";

const BUTTON_LIST: TableButtonType[] = [
  {
    type: ButtonActionTypeEnum.ADD,
    label: "Add New Patient",
    icon: <PlusOutlined />,
  },
] as const;

const COLUMNS: TableCardColumnType<PatientDataType>[] = [
  paginatedIndexColumnData,
  {
    title: "Name",
    dataIndex: "full_name",
    key: "full_name",
    sorter: true,
  },
  {
    title: "Mobile Number",
    dataIndex: "mobile_number",
    key: "mobile_number",
  },
  {
    title: "Last Updated On",
    dataIndex: "updated_at",
    key: "updated_at",
    cellViewData: { type: CellViewEnum.DATE },
  },
  actionsColumnData,
] as const;

function Patients() {
  const [selectedData, setSelectedData] = useState<PatientDataType | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDetailsView, setShowDetailsView] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const {
    fetching,
    params,
    data: patients,
    total,
    fetchData: fetchHandler,
  } = useQuery<PatientDataType, PatientQueryParamsType>({
    keysToDecrypt: patientSensitiveKeys,
    promiseFn: getPatients,
  });

  const { mutuating: deleting, mutuateData: deleteHandler } = useMutuation<DeleteQueryParamsType>({
    promiseFn: ({ id }) => deletePatient(id),
    onSuccess: () => {
      notification.success({ message: "Patient deleted successfully" });
      setShowDeleteConfirmation(false);
      fetchHandler();
    },
    onError: () => {
      notification.error({ message: "Failed to delete patient" });
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
    record: PatientDataType,
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
        title="Patients"
        buttonList={BUTTON_LIST}
        onButtonAction={onButtonActionHandler}
        columns={COLUMNS}
        loading={fetching}
        data={patients}
        total={total}
        params={params}
        onTableAction={(_, updatedParams) => fetchHandler({ ...params, ...updatedParams })}
        onCellAction={onCellActionHandler}
      />
      <PatientForm
        show={showForm}
        onClose={(success) => {
          if (success) fetchHandler();
          setShowForm(false);
        }}
        selectedData={selectedData}
      />
      <PatientView
        show={showDetailsView}
        onClose={() => setShowDetailsView(false)}
        selectedData={selectedData}
      />
      <ConfirmationPopup
        title="Delete Paitent"
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

export default Patients;
