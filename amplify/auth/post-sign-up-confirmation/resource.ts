import { defineFunction } from "@aws-amplify/backend";

export const postConfirmation = defineFunction({
  name: "post-confirmation",
  resourceGroupName: "auth",
  environment: {
    OWNER_TABLE: "Owner_DB",        // set your real table name
    S3_BUCKET: "cbo-pic-storage",   // default profile pic bucket
  },
});
