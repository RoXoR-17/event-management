import { Button, notification } from "antd";
import { useForm } from "antd/es/form/Form";
import { Fragment, useEffect, useState } from "react";

import AsyncSelect from "@/components/AsyncSelect";
import DrawerSlideout from "@/components/DrawerSlideout";
import FormView from "@/components/FormView";
import { FieldType, FieldTypeEnum } from "@/components/FormView/index.type";
import PatientForm from "@/modules/Patients/PatientForm";
import {
  addAppointment,
  AppointmentDataType,
  updateAppointment,
} from "@/utils/actions/appointment";
import { getPatients, PatientDataType, PatientQueryParamsType } from "@/utils/actions/patient";
import { parseDate, WithDateType } from "@/utils/helpers/date";
import { useMutuation, useQuery } from "@/utils/hooks/ApiCall";
import { APPOINTMENT_SOURCE_OPTIONS } from "./index.constant";

const patientFieldDefaultData: FieldType<AppointmentDataType> = {
  label: "Patient",
  mapKey: "patient_id",
  rules: [{ required: true, message: "Patient is required" }],
} as const;

const FIELDS: FieldType<AppointmentDataType>[] = [
  {
    label: "Source",
    mapKey: "source",
    fieldData: {
      type: FieldTypeEnum.SELECT,
      options: APPOINTMENT_SOURCE_OPTIONS,
    },
    rules: [{ required: true, message: "Source is required" }],
  },
  {
    label: "Slot",
    mapKey: "slot",
    optional: true,
    fieldData: { type: FieldTypeEnum.DATE, showTime: { minuteStep: 15 } },
  },
  {
    label: "Notes",
    mapKey: "notes",
    fieldData: { type: FieldTypeEnum.TEXT_INPUT, multiline: true },
  },
] as const;

interface AppointmentFormProps {
  show: boolean;
  onClose: (success: boolean) => void;
  selectedData?: AppointmentDataType | null;
}

function AppointmentForm({ show, onClose, selectedData }: AppointmentFormProps) {
  const [form] = useForm<WithDateType<AppointmentDataType, "slot">>();

  useEffect(() => {
    if (show) {
      if (selectedData) {
        if (selectedData.slot) {
          form.setFieldsValue({
            ...selectedData,
            slot: parseDate(selectedData.slot),
          });
        } else form.setFieldsValue(selectedData);
      } else form.resetFields();
    }
  }, [form, show, selectedData]);

  const [showPatientForm, setShowPatientForm] = useState(false);
  const {
    fetching: fetchingPatients,
    data: patients,
    // params: patientQueryParams,
    fetchData: fetchPatients,
  } = useQuery<PatientDataType, PatientQueryParamsType>({ promiseFn: getPatients });

  const [formFields, setFormFields] = useState(FIELDS);

  useEffect(() => {
    const setPatientFields = () => {
      setFormFields([
        {
          ...patientFieldDefaultData,
          render: () => (
            <AsyncSelect
              options={patients.map(({ id, full_name }) => ({ label: full_name, value: id }))}
              onSearch={(searchValue) => fetchPatients({ searchValue, pageSize: 20 })}
              loading={fetchingPatients}
              placeholder={`Select ${patientFieldDefaultData.label}`}
              extraButton={{
                label: "Add New Patient",
                onClick: () => setShowPatientForm(true),
              }}
            />
          ),
        },
        ...FIELDS,
      ]);
    };

    setPatientFields();
  }, [fetchingPatients]);

  const { mutuating: creating, mutuateData: createHandler } = useMutuation<AppointmentDataType>({
    promiseFn: ({ patient_id, source, slot }) => addAppointment({ patient_id, source, slot }),
    onSuccess: () => {
      notification.success({ message: "Appointment created successfully" });
      onClose(true);
    },
    onError: () => {
      notification.error({ message: "Failed to create appointment" });
    },
  });

  const { mutuating: updating, mutuateData: updateHandler } = useMutuation<AppointmentDataType>({
    promiseFn: ({ id, patient_id, source, slot }) =>
      updateAppointment(id, { patient_id, source, slot }),
    onSuccess: () => {
      notification.success({ message: "Appointment updated successfully" });
      onClose(true);
    },
    onError: () => {
      notification.error({ message: "Failed to update appointment" });
    },
  });

  const formSubmitHandler = (formSubmittedData: AppointmentDataType) => {
    if (!selectedData?.id) return createHandler(formSubmittedData);
    return updateHandler({ ...formSubmittedData, id: selectedData.id });
  };

  return (
    <Fragment>
      <DrawerSlideout
        title={`${!selectedData ? "Add New" : "Edit"} Appointment`}
        show={show}
        onClose={() => onClose(false)}
        extra={
          <Button type="primary" onClick={() => form.submit()} loading={creating || updating}>
            Save
          </Button>
        }
        mask={{ closable: false }}
        size={500}
      >
        <FormView form={form} fields={formFields} onFinish={formSubmitHandler} />
      </DrawerSlideout>
      <PatientForm
        show={showPatientForm}
        onClose={(success) => {
          if (success) fetchPatients();
          setShowPatientForm(false);
        }}
      />
    </Fragment>
  );
}

export default AppointmentForm;
