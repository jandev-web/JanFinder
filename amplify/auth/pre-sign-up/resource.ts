import { defineFunction } from "@aws-amplify/backend";

export const preSignUp = defineFunction({
  name: "pre-sign-up",
  resourceGroupName: "auth",
  environment: {
    INVITES_TABLE: "InviteCodes", // set your real table name
  },
});
