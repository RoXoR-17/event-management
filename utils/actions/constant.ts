import { AppointmentDataType } from "./appointment";
import { PatientDataType } from "./patient";
import { TeamMemberDataType } from "./teamMember";

export const patientSensitiveKeys = ["mobile_number"] as const satisfies (keyof PatientDataType)[];

export const appointmentSensitiveKeys = [
  "mobile_number",
] as const satisfies (keyof AppointmentDataType)[];

export const teamMemberSensitiveKeys = [] as const satisfies (keyof TeamMemberDataType)[];
