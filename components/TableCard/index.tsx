import { Flex, Input, Table, TableColumnType, Typography } from "antd";

import BasicCard from "@/components/BasicCard";
import { defaultPageSize } from "@/utils/helpers/pagination";
import { FilterParamsType, SortParamsType } from "@/utils/hooks/ApiCall";
import CellView from "./CellView";
import { emptyData } from "./index.constant";
import styles from "./index.module.css";
import {
  CellActionTypeEnum,
  CellViewEnum,
  TableActionTypeEnum,
  TableCardProps,
} from "./index.type";
import TableButton from "./TableButton";

function TableCard<T extends { id?: string | number }>({
  title,
  buttonList = [],
  onButtonAction,
  columns,
  loading,
  data,
  total,
  params,
  searchPlaceholder = "Search by name, mobile number",
  onTableAction,
  onCellAction,
}: TableCardProps<T>) {
  const paginationParams = {
    page: params.page ?? 1,
    pageSize: params.pageSize ?? defaultPageSize,
  };
  const COLUMNS: TableColumnType<T>[] = columns.map(({ cellViewData, ...column }) => ({
    ...column,
    ...(column.onFilter && loading ? { onFilter: () => true } : {}),
    render: (text, record, index) => (
      <CellView
        type={CellViewEnum.TEXT}
        loading={loading}
        onAction={onCellAction}
        {...cellViewData}
        {...{ text, record, index }}
        {...(cellViewData?.type === CellViewEnum.PAGINATED_INDEX ? { paginationParams } : {})}
      />
    ),
  }));

  return (
    <BasicCard
      title={
        <Flex gap="1rem" align="center" className={styles.card_header}>
          <Typography.Title level={4} className={styles.card_title}>
            {title}
          </Typography.Title>
          <Input.Search
            placeholder={searchPlaceholder}
            className={styles.search_input}
            onSearch={(searchValue) =>
              onTableAction?.(TableActionTypeEnum.SEARCH, { searchValue, page: 1 })
            }
            loading={loading}
            disabled={loading}
            allowClear
          />
          {buttonList.map((buttonData) => (
            <TableButton
              {...buttonData}
              key={buttonData.type}
              onAction={onButtonAction}
              disabled={loading || buttonData.disabled}
            />
          ))}
        </Flex>
      }
    >
      <div className={styles.table_container}>
        <Table
          columns={COLUMNS}
          dataSource={loading ? (emptyData as T[]) : data}
          // scroll={{ x: "auto" }}
          size="small"
          sticky
          rootClassName={styles.table}
          tableLayout="auto"
          rowKey="id"
          onRow={(record, index = 0) => ({
            onClick: (e) => {
              e.preventDefault();
              e.stopPropagation();
              if (loading) return;
              if (onCellAction) onCellAction(CellActionTypeEnum.VIEW, record, index);
            },
            style: loading ? {} : { cursor: "pointer", userSelect: "none" },
          })}
          pagination={{
            style: loading ? { display: "none" } : {},
            current: paginationParams.page,
            pageSize: paginationParams.pageSize,
            total: total ?? 0,
            showTotal: (total, range) => `Showing ${range[0]}-${range[1]} of ${total} items`,
          }}
          onChange={(pagination, filter, sort, { action }) => {
            if (!onTableAction) return;

            switch (action) {
              case "paginate": {
                const { current: page = 1, pageSize = defaultPageSize } = pagination;
                onTableAction(TableActionTypeEnum.PAGINATE, { page, pageSize });
                break;
              }
              case "filter": {
                const filters = Object.entries(filter ?? {}).reduce((filters, [key, values]) => {
                  if (values && values.length > 0) filters[key as keyof T] = values as string[];
                  return filters;
                }, {} as FilterParamsType<T>);
                onTableAction(TableActionTypeEnum.FILTER, { filters, page: 1 });
                break;
              }
              case "sort": {
                const sorts = (Array.isArray(sort) ? sort : [sort ?? {}]).reduce(
                  (sorts, { field: key, order }) => {
                    if (key && order) sorts[key as keyof T] = order;
                    return sorts;
                  },
                  {} as SortParamsType<T>,
                );
                onTableAction(TableActionTypeEnum.SORT, { sorts });
                break;
              }
              default:
                console.warn(action, "table action not implemented");
                break;
            }
          }}
        />
      </div>
    </BasicCard>
  );
}

export default TableCard;
