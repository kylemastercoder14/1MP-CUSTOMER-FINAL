import { useQueryState, parseAsString } from "nuqs";

export const useContactSeller = () => {
  const [sellerId, setSellerId] = useQueryState(
    "contact-seller",
    parseAsString
  );

  const open = (id: string) => setSellerId(id);
  const close = () => setSellerId(null);

  return {
    sellerId,
    open,
    close,
    setSellerId,
  };
};
