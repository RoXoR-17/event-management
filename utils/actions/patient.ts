"use server";

import { Database } from "@/utils/db/db.type";
import { createClient } from "@/utils/db/server";
import { parseSensitiveData } from "@/utils/helpers/encryption";
import { calculatePaginationRange } from "@/utils/helpers/pagination";
import { QueryParamsType, QueryResponseType } from "@/utils/hooks/ApiCall";
import { patientSensitiveKeys } from "./constant";
import { getEncryptionKey } from "./encryptionKey";

export type PatientDataType = Database["public"]["Tables"]["patients"]["Row"];

export type PatientPayloadType = Pick<PatientDataType, "full_name" | "mobile_number">;

export type PatientQueryParamsType = QueryParamsType<PatientDataType>;

export async function getPatients({
  page,
  pageSize,
  searchValue,
  filters,
  sorts = { created_at: "descend" },
}: PatientQueryParamsType = {}): QueryResponseType<PatientDataType> {
  const supabase = await createClient();

  let supabaseQuery = supabase
    .from("patients")
    .select("*", { count: "exact", head: false })
    .eq("is_deleted", false)
    .range(...calculatePaginationRange(page, pageSize));

  if (searchValue) {
    const searchPattern = `%${searchValue}%`;
    supabaseQuery.or(`full_name.ilike.${searchPattern},mobile_number.ilike.${searchPattern}`);
  }

  if (filters) {
    Object.entries(filters).forEach(([key, values]) => {
      supabaseQuery =
        values.length === 1 ? supabaseQuery.eq(key, values[0]) : supabaseQuery.in(key, values);
    });
  }

  if (sorts) {
    Object.entries(sorts).forEach(([key, direction]) => {
      supabaseQuery = supabaseQuery.order(key, { ascending: direction === "ascend" });
    });
  }

  const { data, error, count } = await supabaseQuery;
  if (error) throw new Error(error.message);

  const encryptionKey = await getEncryptionKey();
  const encryptedData = data.map((patientData) =>
    parseSensitiveData("encrypt", patientData, patientSensitiveKeys, encryptionKey),
  );

  return { total: count, data: encryptedData };
}

export async function getPatientById(id: string): Promise<PatientDataType> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("patients")
    .select("*")
    .eq("id", id)
    .eq("is_deleted", false)
    .single();

  if (error) throw new Error(error.message);

  const encryptionKey = await getEncryptionKey();
  return parseSensitiveData("encrypt", data, patientSensitiveKeys, encryptionKey);
}

export async function addPatient(payload: PatientPayloadType) {
  const supabase = await createClient();

  const encryptionKey = await getEncryptionKey();
  payload = parseSensitiveData("decrypt", payload, patientSensitiveKeys, encryptionKey);

  const { error } = await supabase.from("patients").insert([payload]);

  if (error) throw new Error(error.message);
}

export async function updatePatient(id: string, payload: PatientPayloadType) {
  const supabase = await createClient();

  const encryptionKey = await getEncryptionKey();
  payload = parseSensitiveData("decrypt", payload, patientSensitiveKeys, encryptionKey);

  const { error } = await supabase.from("patients").update(payload).eq("id", id);

  if (error) throw new Error(error.message);
}

export async function deletePatient(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("patients").update({ is_deleted: true }).eq("id", id);

  if (error) throw new Error(error.message);
}
