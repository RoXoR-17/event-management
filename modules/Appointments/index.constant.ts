import { ChipOptionsMapType } from "@/components/ChipView";
import { AppointmentSourceType, AppointmentStatusType } from "@/utils/actions/appointment";

export const appointmentSoruceOptionsMap: ChipOptionsMapType<AppointmentSourceType> = {
  in_person: { label: "Walk-In", color: "purple" },
  via_communication: { label: "Call-In", color: "orange" },
} as const;

export const APPOINTMENT_SOURCE_OPTIONS = Object.entries(appointmentSoruceOptionsMap).map(
  ([source, { label }]) => ({ label, value: source }),
);

export const appointmentStatusOptionsMap: ChipOptionsMapType<AppointmentStatusType> = {
  requested: { label: "Requested", color: "processing" },
  confirmed: { label: "Confirmed", color: "success" },
  cancelled: { label: "Cancelled", color: "error" },
} as const;

export const APPOINTMENT_STATUS_OPTIONS = Object.entries(appointmentStatusOptionsMap).map(
  ([status, { label }]) => ({ label, value: status }),
);
