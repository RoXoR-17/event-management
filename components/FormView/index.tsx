import { Form } from "antd";

import FieldView from "./FieldView";
import { FieldTypeEnum, FormViewProps } from "./index.type";

function FormView<T extends object>({ fields, ...props }: FormViewProps<T>) {
  return (
    <Form layout="vertical" requiredMark={false} size="middle" {...props}>
      {fields.map(({ fieldData, ...field }) => (
        <FieldView
          key={String(field.mapKey)}
          type={FieldTypeEnum.TEXT_INPUT}
          {...field}
          {...fieldData}
        />
      ))}
    </Form>
  );
}

export default FormView;
