import { CalculatedThresholdResult } from "./calculator";

export const InventoryThresholdView = ({
  data,
}: {
  data: CalculatedThresholdResult;
}) => {
  return <div>{JSON.stringify(data)}</div>;
};
