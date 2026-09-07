import { notification } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect } from "react";

import FormView from "@/components/FormView";
import { FieldType, FieldTypeEnum } from "@/components/FormView/index.type";
import PopupModal from "@/components/PopupModal";
import { patientSensitiveKeys } from "@/utils/actions/constant";
import { addPatient, PatientDataType, updatePatient } from "@/utils/actions/patient";
import { useMutuation } from "@/utils/hooks/ApiCall";

const FIELDS: FieldType<PatientDataType>[] = [
  {
    label: "Name",
    mapKey: "full_name",
    rules: [{ required: true, message: "Name field is required" }],
  },
  {
    label: "Mobile Number",
    mapKey: "mobile_number",
    fieldData: { type: FieldTypeEnum.NUMBER_INPUT },
    rules: [
      { required: true, message: "Mobile number field is required" },
      {
        pattern: /^[6-9][0-9]{9}$/,
        message: "Please enter valid mobile number",
      },
    ],
  },
] as const;

interface PatientFormProps {
  show: boolean;
  onClose: (success: boolean) => void;
  selectedData?: PatientDataType | null;
}

function PatientForm({ show, onClose, selectedData }: PatientFormProps) {
  const [form] = useForm<PatientDataType>();

  useEffect(() => {
    if (show) {
      if (selectedData) form.setFieldsValue(selectedData);
      else form.resetFields();
    }
  }, [form, show, selectedData]);

  const { mutuating: creating, mutuateData: createHandler } = useMutuation<PatientDataType>({
    keysToEncrypt: patientSensitiveKeys,
    promiseFn: ({ full_name, mobile_number }) => addPatient({ full_name, mobile_number }),
    onSuccess: () => {
      notification.success({ message: "Patient added successfully" });
      onClose(true);
    },
    onError: () => {
      notification.error({ message: "Failed to add patient" });
    },
  });

  const { mutuating: updating, mutuateData: updateHandler } = useMutuation<PatientDataType>({
    keysToEncrypt: patientSensitiveKeys,
    promiseFn: ({ id, full_name, mobile_number }) =>
      updatePatient(id, { full_name, mobile_number }),
    onSuccess: () => {
      notification.success({ message: "Patient updated successfully" });
      onClose(true);
    },
    onError: () => {
      notification.error({ message: "Failed to update patient" });
    },
  });

  const formSubmitHandler = (formSubmittedData: PatientDataType) => {
    if (!selectedData?.id) return createHandler(formSubmittedData);
    return updateHandler({ ...formSubmittedData, id: selectedData.id });
  };

  return (
    <PopupModal
      title={`${!selectedData ? "Add New" : "Edit"} Patient`}
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

export default PatientForm;
