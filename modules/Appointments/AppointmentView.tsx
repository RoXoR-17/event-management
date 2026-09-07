import DrawerSlideout from "@/components/DrawerSlideout";
import SummaryDetailsView from "@/components/SummaryDetailsView";
import { SummaryViewEnum, SummaryViewType } from "@/components/SummaryDetailsView/index.type";
import PatientView from "@/modules/Patients/PatientView";
import { AppointmentDataType } from "@/utils/actions/appointment";
import { useState } from "react";
import { appointmentSoruceOptionsMap, appointmentStatusOptionsMap } from "./index.constant";

const ITEMS: SummaryViewType<AppointmentDataType>[] = [
  {
    label: "Patient Name",
    mapKey: "full_name",
    summaryViewData: {
      type: SummaryViewEnum.LINK,
    },
  },
  {
    label: "Source",
    mapKey: "source",
    summaryViewData: {
      type: SummaryViewEnum.CHIP,
      optionsMap: appointmentSoruceOptionsMap,
    },
  },
  {
    label: "Status",
    mapKey: "status",
    summaryViewData: {
      type: SummaryViewEnum.CHIP,
      optionsMap: appointmentStatusOptionsMap,
    },
  },
  {
    label: "Slot",
    mapKey: "slot",
    summaryViewData: { type: SummaryViewEnum.DATE },
  },
  {
    label: "Last Updated On",
    mapKey: "updated_at",
    summaryViewData: { type: SummaryViewEnum.DATE },
  },
  {
    label: "First Added On",
    mapKey: "created_at",
    summaryViewData: { type: SummaryViewEnum.DATE },
  },
];

interface AppointmentViewProps {
  show: boolean;
  onClose: (success: boolean) => void;
  selectedData?: AppointmentDataType | null;
  allowPatientDetailsView?: boolean;
}

function AppointmentView({
  show,
  onClose,
  selectedData,
  allowPatientDetailsView,
}: AppointmentViewProps) {
  const [showPatientDetailsView, setShowPatientDetailsView] = useState(false);

  return (
    <DrawerSlideout
      title="Appointment Details"
      show={show}
      onClose={() => onClose(false)}
      size={500}
    >
      <SummaryDetailsView
        data={selectedData!}
        items={ITEMS}
        onAction={allowPatientDetailsView ? () => setShowPatientDetailsView(true) : undefined}
      />
      <PatientView
        show={showPatientDetailsView}
        onClose={() => setShowPatientDetailsView(false)}
        selectedId={selectedData?.patient_id}
      />
    </DrawerSlideout>
  );
}

export default AppointmentView;
