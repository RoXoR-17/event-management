"use server";

import { Database } from "@/utils/db/db.type";
import { createClient } from "@/utils/db/server";
import { parseSensitiveData } from "@/utils/helpers/encryption";
import { calculatePaginationRange } from "@/utils/helpers/pagination";
import { QueryParamsType, QueryResponseType } from "@/utils/hooks/ApiCall";
import { teamMemberSensitiveKeys } from "./constant";
import { getEncryptionKey } from "./encryptionKey";

export type TeamMemberDataType = Database["public"]["Tables"]["team_members"]["Row"];

export type TeamMemberPayloadType = Pick<TeamMemberDataType, "full_name" | "designation">;

export type TeamMemberQueryParamsType = QueryParamsType<TeamMemberDataType>;

export async function getTeamMembers({
  page,
  pageSize,
  searchValue,
  filters,
  sorts = { created_at: "descend" },
}: TeamMemberQueryParamsType = {}): QueryResponseType<TeamMemberDataType> {
  const supabase = await createClient();

  let supabaseQuery = supabase
    .from("team_members")
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

  if (!teamMemberSensitiveKeys.length) return { total: count, data };

  const encryptionKey = await getEncryptionKey();
  const encryptedData = data.map((teamMemberData) =>
    parseSensitiveData("encrypt", teamMemberData, teamMemberSensitiveKeys, encryptionKey),
  );

  return { total: count, data: encryptedData };
}

export async function getTeamMemberById(id: string): Promise<TeamMemberDataType> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .eq("id", id)
    .eq("is_deleted", false)
    .single();

  if (error) throw new Error(error.message);

  if (!teamMemberSensitiveKeys.length) return data;

  const encryptionKey = await getEncryptionKey();
  return parseSensitiveData("encrypt", data, teamMemberSensitiveKeys, encryptionKey);
}

export async function addTeamMember(payload: TeamMemberPayloadType) {
  const supabase = await createClient();

  const encryptionKey = await getEncryptionKey();
  payload = parseSensitiveData("decrypt", payload, teamMemberSensitiveKeys, encryptionKey);

  const { error } = await supabase.from("team_members").insert([payload]);

  if (error) throw new Error(error.message);
}

export async function updateTeamMember(id: string, payload: TeamMemberPayloadType) {
  const supabase = await createClient();

  const encryptionKey = await getEncryptionKey();
  payload = parseSensitiveData("decrypt", payload, teamMemberSensitiveKeys, encryptionKey);

  const { error } = await supabase.from("team_members").update(payload).eq("id", id);

  if (error) throw new Error(error.message);
}

export async function deleteTeamMember(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("team_members").update({ is_deleted: true }).eq("id", id);

  if (error) throw new Error(error.message);
}
