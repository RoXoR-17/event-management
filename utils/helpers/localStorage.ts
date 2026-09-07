export const storeData = (type: string, value: unknown) => {
  localStorage.setItem(type, JSON.stringify(value));
};

export const fetchData = (type: string) => {
  if (!localStorage.getItem(type)) return "";
  return JSON.parse(localStorage.getItem(type) ?? "{}");
};

export const removeData = (type: string) => {
  localStorage.removeItem(type);
};
