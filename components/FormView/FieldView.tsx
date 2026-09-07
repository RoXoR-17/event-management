import { DatePicker, Divider, Form, Input, InputNumber, Select } from "antd";

import { DateFormatType } from "@/utils/helpers/date";
import { FieldTypeEnum, FieldViewProps } from "./index.type";

function FieldView<T extends object>({
  mapKey,
  rules,
  render,
  ...fieldData
}: FieldViewProps<T>): React.ReactNode {
  const name = typeof mapKey === "string" ? mapKey : String(mapKey);
  const label = `${fieldData.label}${fieldData.optional ? " (Optional)" : ""}`;

  switch (fieldData.type) {
    case FieldTypeEnum.TEXT_INPUT:
      return (
        <Form.Item name={name} label={label} rules={rules}>
          {fieldData.multiline ? (
            <Input.TextArea placeholder={fieldData.placeholder || `Enter ${label} here`} />
          ) : (
            <Input placeholder={fieldData.placeholder || `Enter ${label} here`} />
          )}
        </Form.Item>
      );
    case FieldTypeEnum.NUMBER_INPUT:
      return (
        <Form.Item name={name} label={label} rules={rules}>
          <InputNumber
            placeholder={fieldData.placeholder || `Enter ${label} here`}
            style={{ width: "100%" }}
          />
        </Form.Item>
      );
    case FieldTypeEnum.SELECT:
      return (
        <Form.Item name={name} label={label} rules={rules}>
          <Select
            options={fieldData.options}
            placeholder={fieldData.placeholder || `Select ${label}`}
            {...(fieldData.extraOption
              ? {
                  popupRender: (menu) => (
                    <>
                      {menu}
                      <Divider style={{ margin: "8px 0" }} />
                      {fieldData.extraOption}
                    </>
                  ),
                }
              : {})}
          />
        </Form.Item>
      );
    case FieldTypeEnum.DATE:
      return (
        <Form.Item name={name} label={label} rules={rules}>
          <DatePicker
            format={fieldData.format ?? DateFormatType.DAY_MON_YYYY_H_M_A}
            placeholder={fieldData.placeholder || `Select ${label}`}
            style={{ width: "100%" }}
            showTime={fieldData.showTime}
            use12Hours={!!fieldData.showTime}
            needConfirm={false}
            showSecond={false}
          />
        </Form.Item>
      );
    default: {
      return (
        <Form.Item name={name} label={label} rules={rules}>
          {render ? render(mapKey) : <Input placeholder={`Enter ${label} here`} />}
        </Form.Item>
      );
    }
  }
}

export default FieldView;
