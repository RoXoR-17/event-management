import { DeleteOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { notification } from "antd";
import { Fragment, useEffect, useState } from "react";

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
import {
  AppointmentDataType,
  AppointmentQueryParamsType,
  AppointmentSourceType,
  AppointmentStatusType,
  deleteAppointment,
  getAppointments,
} from "@/utils/actions/appointment";
import { appointmentSensitiveKeys } from "@/utils/actions/constant";
import { useMainContext } from "@/utils/helpers/context";
import { CsvHeaderDataType, downloadCsv } from "@/utils/helpers/csv";
import { dateFormat, DateFormatType } from "@/utils/helpers/date";
import { DeleteQueryParamsType, useMutuation, useQuery } from "@/utils/hooks/ApiCall";
import AppointmentForm from "./AppointmentForm";
import AppointmentView from "./AppointmentView";
import {
  APPOINTMENT_SOURCE_OPTIONS,
  APPOINTMENT_STATUS_OPTIONS,
  appointmentSoruceOptionsMap,
  appointmentStatusOptionsMap,
} from "./index.constant";

const BUTTON_LIST: TableButtonType[] = [
  {
    type: ButtonActionTypeEnum.EXPORT,
    label: "Export",
    icon: <UploadOutlined />,
  },
  {
    type: ButtonActionTypeEnum.ADD,
    label: "Create Appointment",
    icon: <PlusOutlined />,
  },
] as const;

const COLUMNS: TableCardColumnType<AppointmentDataType>[] = [
  paginatedIndexColumnData,
  {
    title: "Patient Name",
    dataIndex: "full_name",
    key: "full_name",
    sorter: {
      compare: (a, b) => (a.full_name && b.full_name ? a.full_name.localeCompare(b.full_name) : 0),
      multiple: 1,
    },
  },
  {
    title: "Source",
    dataIndex: "source",
    key: "source",
    cellViewData: {
      type: CellViewEnum.CHIP,
      optionsMap: appointmentSoruceOptionsMap,
    },
    filters: APPOINTMENT_SOURCE_OPTIONS.map(({ label, value }) => ({ text: label, value })),
    onFilter: (value, record) => record.source === value,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    cellViewData: {
      type: CellViewEnum.CHIP,
      optionsMap: appointmentStatusOptionsMap,
    },
    filters: APPOINTMENT_STATUS_OPTIONS.map(({ label, value }) => ({ text: label, value })),
    onFilter: (value, record) => record.status === value,
  },
  {
    title: "Slot",
    dataIndex: "slot",
    key: "slot",
    cellViewData: { type: CellViewEnum.DATE },
    sorter: {
      compare: (a, b) =>
        a.slot && b.slot ? new Date(a.slot).getTime() - new Date(b.slot).getTime() : 0,
      multiple: 2,
    },
  },
  {
    title: "Last Updated On",
    dataIndex: "updated_at",
    key: "updated_at",
    cellViewData: { type: CellViewEnum.DATE },
  },
  actionsColumnData,
] as const;

const EXPORT_HEADERS: CsvHeaderDataType<AppointmentDataType>[] = [
  { mapKey: "full_name", label: "Patient Name" },
  { mapKey: "mobile_number", label: "Patient Mobile Number" },
  {
    mapKey: "source",
    label: "Source",
    transform: (value) => appointmentSoruceOptionsMap[value as AppointmentSourceType]?.label,
  },
  {
    mapKey: "status",
    label: "Status",
    transform: (value) => appointmentStatusOptionsMap[value as AppointmentStatusType]?.label,
  },
  {
    mapKey: "slot",
    label: "Slot",
    transform: (value) => dateFormat(String(value), DateFormatType.DAY_MON_YYYY_H_M_A),
  },
] as const;

function Appointments() {
  const { refetchAppointments, setRefetchAppointments } = useMainContext();
  const [selectedData, setSelectedData] = useState<AppointmentDataType | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDetailsView, setShowDetailsView] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const {
    fetching,
    params,
    data: appointments,
    total,
    fetchData: fetchHandler,
  } = useQuery<AppointmentDataType, AppointmentQueryParamsType>({
    keysToDecrypt: appointmentSensitiveKeys,
    promiseFn: getAppointments,
  });

  useEffect(() => {
    if (refetchAppointments) {
      setRefetchAppointments(false);
      if (!fetching) fetchHandler();
    }
  }, [refetchAppointments]);

  const { mutuating: deleting, mutuateData: deleteHandler } = useMutuation<DeleteQueryParamsType>({
    promiseFn: ({ id }) => deleteAppointment(id),
    onSuccess: () => {
      notification.success({ message: "Appointment deleted successfully" });
      setShowDeleteConfirmation(false);
      fetchHandler();
    },
    onError: () => {
      notification.error({ message: "Failed to delete appointment" });
    },
  });

  const {
    fetching: exporting,
    data: exportAppointments,
    fetchData: exportHandler,
  } = useQuery<AppointmentDataType, AppointmentQueryParamsType>({
    skipOnInit: true,
    keysToDecrypt: appointmentSensitiveKeys,
    promiseFn: getAppointments,
  });

  useEffect(() => {
    if (!exporting && exportAppointments.length) {
      downloadCsv(exportAppointments, EXPORT_HEADERS, `appointments_${Date.now()}`);
    }
  }, [exporting]);

  const onButtonActionHandler = async (type: ButtonActionTypeEnum) => {
    switch (type) {
      case ButtonActionTypeEnum.ADD:
        setSelectedData(null);
        setShowForm(true);
        break;
      case ButtonActionTypeEnum.EXPORT:
        if (!exporting && total) await exportHandler({ ...params, pageSize: total, page: 1 });
        break;
      default:
        break;
    }
  };

  // const onTableActionHandler = (
  //   type: TableActionTypeEnum,
  //   updatedParams: AppointmentQueryParamsType,
  // ) => {
  // switch (type) {
  //   case TableActionTypeEnum.PAGINATE:
  //     break;
  //   case TableActionTypeEnum.SEARCH:
  //     break;
  //   case TableActionTypeEnum.FILTER:
  //     break;
  //   case TableActionTypeEnum.SORT:
  //     break;
  //   default:
  //     break;
  // }
  // };

  const onCellActionHandler = (
    type: CellActionTypeEnum,
    record: AppointmentDataType,
    // index: number
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
        title="Appointments"
        buttonList={BUTTON_LIST}
        onButtonAction={onButtonActionHandler}
        columns={COLUMNS}
        loading={fetching}
        data={appointments}
        total={total}
        searchPlaceholder="Search by patient name, mobile number"
        params={params}
        onTableAction={(_, updatedParams) => fetchHandler({ ...params, ...updatedParams })}
        onCellAction={onCellActionHandler}
      />
      <AppointmentForm
        show={showForm}
        onClose={(success) => {
          if (success) fetchHandler();
          setShowForm(false);
        }}
        selectedData={selectedData}
      />
      <AppointmentView
        show={showDetailsView}
        onClose={() => setShowDetailsView(false)}
        selectedData={selectedData}
        allowPatientDetailsView
      />
      <ConfirmationPopup
        title="Delete Appointment"
        subTitle="Once deleted, this can't be restored. Do you want to continue?"
        icon={<DeleteOutlined style={{ fontSize: "2rem", color: "var(--rs-color-error)" }} />}
        show={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        okButtonProps={{ danger: true }}
        okText="Yes, Delete"
        onOk={() => deleteHandler({ id: selectedData?.id ?? "" })}
        confirmLoading={deleting}
      />
    </Fragment>
  );
}

export default Appointments;
