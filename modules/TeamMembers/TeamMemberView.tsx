import { useEffect, useState } from "react";

import DrawerSlideout from "@/components/DrawerSlideout";
import SummaryDetailsView from "@/components/SummaryDetailsView";
import { SummaryViewEnum, SummaryViewType } from "@/components/SummaryDetailsView/index.type";
import { teamMemberSensitiveKeys } from "@/utils/actions/constant";
import { getEncryptionKey } from "@/utils/actions/encryptionKey";
import { getTeamMemberById, TeamMemberDataType } from "@/utils/actions/teamMember";
import { parseSensitiveData } from "@/utils/helpers/encryption";

const ITEMS: SummaryViewType<TeamMemberDataType>[] = [
  { label: "Name", mapKey: "full_name" },
  { label: "Designation", mapKey: "designation" },
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

interface TeamMemberViewProps {
  show: boolean;
  onClose: (success: boolean) => void;
  selectedId?: string;
  selectedData?: TeamMemberDataType | null;
}

function TeamMemberView({ show, onClose, selectedId, selectedData }: TeamMemberViewProps) {
  const [viewData, setViewData] = useState<TeamMemberDataType>({} as TeamMemberDataType);

  useEffect(() => {
    const getDataByIdHandler = async () => {
      if (selectedData) {
        setViewData(selectedData);
        return;
      } else if (!selectedId) return;

      try {
        const data = await getTeamMemberById(selectedId);
        if (!teamMemberSensitiveKeys.length) setViewData(data);

        const encryptionKey = await getEncryptionKey();
        setViewData(parseSensitiveData("decrypt", data, teamMemberSensitiveKeys, encryptionKey));
      } catch (error) {
        console.error("Error fetching team member data: ", error);
      }
    };

    getDataByIdHandler();
  }, [selectedId, selectedData]);

  return (
    <DrawerSlideout
      title="Team Member Details"
      show={show}
      onClose={() => onClose(false)}
      size={500}
    >
      <SummaryDetailsView data={viewData} items={ITEMS} />
    </DrawerSlideout>
  );
}

export default TeamMemberView;
