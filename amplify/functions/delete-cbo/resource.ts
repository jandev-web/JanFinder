import { defineFunction } from "@aws-amplify/backend";

export const deleteCboFn = defineFunction({
  name: "delete-cbo",
  entry: "./handler.ts",
  resourceGroupName: 'data',
});
