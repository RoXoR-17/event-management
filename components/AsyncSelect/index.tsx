import { Button, Divider, Select, SelectProps } from "antd";
import { useEffect, useState } from "react";

import { MaybePromiseReturnType } from "@/types/common.type";
import useDebounce from "@/utils/hooks/Common/useDebounce";

interface AsyncSelectProps extends SelectProps {
  onSearch: (value: string) => MaybePromiseReturnType<void>;
  extraButton?: { label: string; onClick: () => void };
}

function AsyncSelect({ extraButton, loading, onSearch, ...props }: AsyncSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebounce(searchValue);

  useEffect(() => {
    if (onSearch && open) onSearch(debouncedSearchValue);
  }, [debouncedSearchValue]);

  return (
    <Select
      disabled={loading}
      popupRender={
        !extraButton
          ? undefined
          : (menu) => (
              <>
                {menu}
                <Divider style={{ margin: "8px 0" }} />
                <Button
                  block
                  color="link"
                  variant="solid"
                  onClick={() => {
                    setOpen(false);
                    setTimeout(() => extraButton.onClick(), 200);
                  }}
                >
                  {extraButton.label}
                </Button>
              </>
            )
      }
      showSearch={{
        onSearch: setSearchValue,
        filterOption: false,
      }}
      {...props}
      open={open}
      onOpenChange={setOpen}
    />
  );
}

export default AsyncSelect;
