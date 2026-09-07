import TimelineView from "@/components/TimelineView";
import { TimelineItemViewEnum, TimelineItemViewType } from "@/components/TimelineView/index.type";
import TimelineItemView from "@/components/TimelineView/TimelineItemView";
import {
  AppointmentDataType,
  PatientAppointmentQueryParamsType,
  getAppointmentsByPatientId,
} from "@/utils/actions/appointment";
import { useQuery } from "@/utils/hooks/ApiCall";
import { Flex, Typography } from "antd";
import { appointmentSoruceOptionsMap, appointmentStatusOptionsMap } from "./index.constant";

const ITEMS: TimelineItemViewType<AppointmentDataType>[] = [
  {
    mapKey: "slot",
    render: (slotDateTimeText) => (
      <div style={{ flexGrow: 1 }}>
        <Typography.Text type="secondary">Slot: </Typography.Text>
        <TimelineItemView<{ slot: string }>
          mapKey={"slot"}
          data={{ slot: String(slotDateTimeText) }}
          type={TimelineItemViewEnum.DATE}
          text={String(slotDateTimeText)}
        />
      </div>
    ),
  },
  {
    mapKey: "source",
    timelineItemViewData: {
      type: TimelineItemViewEnum.CHIP,
      optionsMap: appointmentSoruceOptionsMap,
    },
  },
  {
    mapKey: "status",
    timelineItemViewData: {
      type: TimelineItemViewEnum.CHIP,
      optionsMap: appointmentStatusOptionsMap,
    },
  },
] as const;

interface PatientAppointmentsTimelineProps {
  patientId: string;
  onAction?: (appointmentData: AppointmentDataType) => void;
}

function PatientAppointmentsTimeline({ patientId, onAction }: PatientAppointmentsTimelineProps) {
  const {
    fetching,
    params,
    data: patientAppointments,
    total,
    fetchData: fetchHandler,
  } = useQuery<AppointmentDataType, PatientAppointmentQueryParamsType>({
    keepPreviousData: true,
    promiseFn: (params = {}) => getAppointmentsByPatientId({ patientId, ...params }),
    initialParams: { patientId, page: 1 },
  });

  return (
    <>
      <Typography.Title level={5} style={{ margin: "1rem 0 0.5rem" }}>
        Appointments History
      </Typography.Title>
      <TimelineView
        loading={fetching}
        data={patientAppointments}
        total={total}
        titleItemData={{
          mapKey: "id",
          render: (id) => (
            <Flex justify="space-between" gap={1}>
              <Typography.Text strong>Appointment Details</Typography.Text>
              <TimelineItemView<{ id: string }>
                mapKey="id"
                data={{ id: String(id) }}
                type={TimelineItemViewEnum.LINK}
                text="View Details"
                onAction={() =>
                  onAction?.(
                    patientAppointments.find((a) => a.id === id) ?? ({} as AppointmentDataType),
                  )
                }
                underline
              />
            </Flex>
          ),
        }}
        items={ITEMS}
        emptyText="Currently there is no previous appointment record for this patient."
        onLoadNext={() => fetchHandler({ ...params, page: (params?.page ?? 1) + 1 })}
      />
    </>
  );
}

export default PatientAppointmentsTimeline;
