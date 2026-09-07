export interface CsvHeaderDataType<T extends object> {
  mapKey: keyof T;
  label: string;
  transform?: (value: T[keyof T]) => typeof value;
}

export function downloadCsv<T extends object>(
  data: T[],
  headers: CsvHeaderDataType<T>[],
  fileName?: string,
) {
  const headerLabels = headers.map(({ label }) => label);
  const csvData = data.map((eachData) =>
    headers.map(({ mapKey, transform }) =>
      eachData[mapKey] && transform ? transform(eachData[mapKey]) : eachData[mapKey] || "-",
    ),
  );
  const csvString = [headerLabels, ...csvData].map((row) => row.join(",")).join("\n");

  const blob = new Blob([csvString], { type: "text/csv" });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `${fileName || "download"}.csv`;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
