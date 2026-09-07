import { notification } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect } from "react";

import FormView from "@/components/FormView";
import { FieldType } from "@/components/FormView/index.type";
import PopupModal from "@/components/PopupModal";
import { teamMemberSensitiveKeys } from "@/utils/actions/constant";
import {
  addTeamMember,
  TeamMemberDataType,
  TeamMemberPayloadType,
  updateTeamMember,
} from "@/utils/actions/teamMember";
import { useMutuation } from "@/utils/hooks/ApiCall";

const FIELDS: FieldType<TeamMemberPayloadType>[] = [
  {
    label: "Name",
    mapKey: "full_name",
    rules: [{ required: true, message: "Name field is required" }],
  },
  {
    label: "Designation",
    mapKey: "designation",
    rules: [{ required: true, message: "Designation field is required" }],
  },
] as const;

interface TeamMemberFormProps {
  show: boolean;
  onClose: (success: boolean) => void;
  selectedData?: TeamMemberDataType | null;
}

function TeamMemberForm({ show, onClose, selectedData }: TeamMemberFormProps) {
  const [form] = useForm<TeamMemberPayloadType>();

  useEffect(() => {
    if (show) {
      if (selectedData) form.setFieldsValue(selectedData);
      else form.resetFields();
    }
  }, [form, show, selectedData]);

  const { mutuating: creating, mutuateData: createHandler } = useMutuation<TeamMemberDataType>({
    keysToEncrypt: teamMemberSensitiveKeys,
    promiseFn: ({ full_name, designation }) => addTeamMember({ full_name, designation }),
    onSuccess: () => {
      notification.success({ message: "Team member added successfully" });
      onClose(true);
    },
    onError: () => {
      notification.error({ message: "Failed to add team member" });
    },
  });

  const { mutuating: updating, mutuateData: updateHandler } = useMutuation<TeamMemberDataType>({
    keysToEncrypt: teamMemberSensitiveKeys,
    promiseFn: ({ id, full_name, designation }) => updateTeamMember(id, { full_name, designation }),
    onSuccess: () => {
      notification.success({ message: "Team member updated successfully" });
      onClose(true);
    },
    onError: () => {
      notification.error({ message: "Failed to update team member" });
    },
  });

  const formSubmitHandler = (formSubmittedData: TeamMemberDataType) => {
    if (!selectedData?.id) return createHandler(formSubmittedData);
    return updateHandler({ ...formSubmittedData, id: selectedData.id });
  };

  return (
    <PopupModal
      title={`${!selectedData ? "Add" : "Edit"} Team Member`}
      onOk={() => form.submit()}
      confirmLoading={creating || updating}
      okText="Save"
      show={show}
      onClose={() => onClose(false)}
    >
      <FormView form={form} fields={FIELDS} onFinish={formSubmitHandler} />
    </PopupModal>
  );
}

export default TeamMemberForm;
