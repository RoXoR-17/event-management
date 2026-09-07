"use server";

import { Database } from "@/utils/db/db.type";
import { createClient } from "@/utils/db/server";
import { parseSensitiveData } from "@/utils/helpers/encryption";
import { calculatePaginationRange, PaginationParamsType } from "@/utils/helpers/pagination";
import { QueryParamsType, QueryResponseType } from "@/utils/hooks/ApiCall";
import { appointmentSensitiveKeys } from "./constant";
import { getEncryptionKey } from "./encryptionKey";
import { PatientDataType } from "./patient";

export type AppointmentSourceType = Database["public"]["Enums"]["Appointment Source"];

export type AppointmentStatusType = Database["public"]["Enums"]["Appointment Status"];

export type AppointmentMainDataType = Database["public"]["Tables"]["appointments"]["Row"];

export type AppointmentDataType = AppointmentMainDataType &
  Pick<PatientDataType, "full_name" | "mobile_number">;

export type AppointmentPayloadType = Pick<AppointmentDataType, "patient_id" | "source" | "slot">;

export type AppointmentPayloadWithStatusType = AppointmentPayloadType &
  Pick<AppointmentDataType, "status">;

export type AppointmentQueryParamsType = QueryParamsType<AppointmentDataType>;

export async function getAppointments({
  page,
  pageSize,
  searchValue,
  filters,
  sorts = { created_at: "descend" },
}: AppointmentQueryParamsType = {}): QueryResponseType<AppointmentDataType> {
  const supabase = await createClient();

  let supabaseQuery = supabase
    .from("appointments")
    .select("*, patientData:patients!inner (full_name, mobile_number)", {
      count: "exact",
      head: false,
    })
    .eq("is_deleted", false)
    .range(...calculatePaginationRange(page, pageSize));

  if (searchValue) {
    const searchPattern = `%${searchValue}%`;
    supabaseQuery = supabaseQuery.or(
      `full_name.ilike.${searchPattern},mobile_number.ilike.${searchPattern}`,
      { foreignTable: "patients" },
    );
  }

  if (filters) {
    Object.entries(filters).forEach(([key, values]) => {
      supabaseQuery =
        values.length === 1 ? supabaseQuery.eq(key, values[0]) : supabaseQuery.in(key, values);
    });
  }

  if (sorts) {
    Object.entries(sorts).forEach(([key, direction]) => {
      supabaseQuery = supabaseQuery.order(key, {
        ascending: direction === "ascend",
        referencedTable: key === "full_name" ? "patients" : undefined,
      });
    });
  }

  const { data, error, count } = await supabaseQuery;
  if (error) throw new Error(error.message);

  const encryptionKey = await getEncryptionKey();
  const mergedAndEncryptedData = data.map(({ patientData, ...appointmentData }) => ({
    ...appointmentData,
    ...parseSensitiveData("encrypt", patientData, appointmentSensitiveKeys, encryptionKey),
  }));

  return { total: count, data: mergedAndEncryptedData };
}

export type PatientAppointmentQueryParamsType = PaginationParamsType & {
  patientId: string;
};

export async function getAppointmentsByPatientId({
  patientId,
  page,
  pageSize = 6,
}: PatientAppointmentQueryParamsType): QueryResponseType<AppointmentDataType> {
  if (!patientId) return { total: 0, data: [] };

  const supabase = await createClient();

  const { data, error, count } = await supabase
    .from("appointments")
    .select("*, patientData:patients!inner (full_name, mobile_number)", {
      count: "exact",
      head: false,
    })
    .eq("patient_id", patientId)
    .eq("is_deleted", false)
    .order("created_at", { ascending: false })
    .range(...calculatePaginationRange(page, pageSize));

  if (error) throw new Error(error.message);

  const encryptionKey = await getEncryptionKey();
  const mergedAndEncryptedData = data.map(({ patientData, ...appointmentData }) => ({
    ...appointmentData,
    ...parseSensitiveData("encrypt", patientData, appointmentSensitiveKeys, encryptionKey),
  }));

  return { total: count, data: mergedAndEncryptedData };
}

export async function addAppointment(payload: AppointmentPayloadType) {
  const supabase = await createClient();

  const payloadWithStatus: AppointmentPayloadWithStatusType = {
    ...payload,
    status: payload.slot ? "confirmed" : "requested",
  };

  const { error } = await supabase.from("appointments").insert([payloadWithStatus]);

  if (error) throw new Error(error.message);
}

export async function updateAppointment(id: string, payload: AppointmentPayloadType) {
  const supabase = await createClient();

  const payloadWithStatus: AppointmentPayloadWithStatusType = {
    ...payload,
    status: payload.slot ? "confirmed" : "requested",
  };

  const { error } = await supabase.from("appointments").update(payloadWithStatus).eq("id", id);

  if (error) throw new Error(error.message);
}

export async function deleteAppointment(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("appointments").update({ is_deleted: true }).eq("id", id);

  if (error) throw new Error(error.message);
}
