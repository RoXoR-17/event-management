import { useEffect, useState } from "react";

import DrawerSlideout from "@/components/DrawerSlideout";
import SummaryDetailsView from "@/components/SummaryDetailsView";
import { SummaryViewEnum, SummaryViewType } from "@/components/SummaryDetailsView/index.type";
import { AppointmentDataType } from "@/utils/actions/appointment";
import { patientSensitiveKeys } from "@/utils/actions/constant";
import { getEncryptionKey } from "@/utils/actions/encryptionKey";
import { getPatientById, PatientDataType } from "@/utils/actions/patient";
import { parseSensitiveData } from "@/utils/helpers/encryption";
import AppointmentView from "../Appointments/AppointmentView";
import PatientAppointmentsTimeline from "../Appointments/PatientAppointmentsTimeline";

const ITEMS: SummaryViewType<PatientDataType>[] = [
  { label: "Name", mapKey: "full_name" },
  {
    label: "Mobile Number",
    mapKey: "mobile_number",
    // summaryViewData: {
    //   type: SummaryViewEnum.MASK,
    //   maskPattern: MaskPatternType.MOBILE_NUMBER,
    // },
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
] as const;

interface PatientViewProps {
  show: boolean;
  onClose: (success: boolean) => void;
  selectedId?: string;
  selectedData?: PatientDataType | null;
}

function PatientView({ show, onClose, selectedId, selectedData }: PatientViewProps) {
  const [patientData, setPatientData] = useState<PatientDataType>({} as PatientDataType);
  const [selectedAppointmentData, setSelectedAppointmentData] = useState({} as AppointmentDataType);

  useEffect(() => {
    const getDataByIdHandler = async () => {
      if (selectedData) {
        setPatientData(selectedData);
        return;
      } else if (!selectedId) return;

      try {
        const data = await getPatientById(selectedId);
        const encryptionKey = await getEncryptionKey();
        setPatientData(parseSensitiveData("decrypt", data, patientSensitiveKeys, encryptionKey));
      } catch (error) {
        console.error("Error fetching patient data: ", error);
      }
    };

    getDataByIdHandler();
  }, [selectedId, selectedData]);

  return (
    <DrawerSlideout title="Patient Details" show={show} onClose={() => onClose(false)} size={500}>
      <SummaryDetailsView data={patientData} items={ITEMS} />
      {patientData.id && (
        <PatientAppointmentsTimeline
          patientId={patientData.id}
          onAction={(appointmentData: AppointmentDataType) =>
            setSelectedAppointmentData(appointmentData)
          }
        />
      )}
      <AppointmentView
        show={!!selectedAppointmentData.id}
        onClose={() => setSelectedAppointmentData({} as AppointmentDataType)}
        selectedData={selectedAppointmentData}
      />
    </DrawerSlideout>
  );
}

export default PatientView;
