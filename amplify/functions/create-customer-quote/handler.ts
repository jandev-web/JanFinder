// amplify/functions/create-customer-quote/handler.ts
import type { Schema } from "../../data/resource";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuid } from "uuid";

const ddbDoc = DynamoDBDocumentClient.from(new DynamoDBClient(), {
  marshallOptions: { removeUndefinedValues: true }, // leaves out undefined props
});
const TABLE = process.env.CUSTOMER_QUOTES_TABLE || "CustomerQuotes";

export const handler: Schema["createCustomerQuote"]["functionHandler"] = async () => {
  const now = new Date().toISOString();
  const QuoteID = uuid();

  const item = {
    QuoteID,                 // PK
    isAvailable: "FALSE" as const,
    isAccepted:  "FALSE" as const,
    isSold:      "FALSE" as const,

    createdAt: now,
    updatedAt: now,
    memberMade: false,

    // OMIT owner/franchise/email/confirmation until you have real values
    // ownerID: undefined,
    // franchiseID: undefined,
    // email: undefined,
    // confirmationNumber: undefined,
    // latestRequestID: undefined,

    customerData: { firstName: "", lastName: "", phone: "", company: "", email: "", address: { street: "", city: "", state: "", postalCode: "", country: "" }},
    customerMeasurements: {
      sqft: 0, floors: 0,
      stairwells: { carpet: 0, hardfloor: 0 },
      floorTypes: { hardfloor: 0, carpet: 0 },
      roomTypes: [],
    },
    ownerMeasurements: {
      sqft: 0, floors: 0,
      stairwells: { carpet: 0, hardfloor: 0 },
      floorTypes: { hardfloor: 0, carpet: 0 },
      roomTypes: [],
    },
    quoteInfo: {
      budget: 0,
      facilityType: "",
      floorTypes: { hardfloor: 0, carpet: 0 },
      floors: 0,
      frequency: "",
      roomTypes: [],
      sqft: 0,
      stairwells: { carpet: 0, hardfloor: 0 },
    },
    costCalculations: { salary: 0, payrollTax: 0, profitPercent: 0, overhead: 0 },
    costInfo: { baseCost: 0, finalCost: 0, customCost: null },
    package: { packageOptions: [], packageChoice: null },
    siteVerified: { verificationStatus: false, verifiedBy: null, verificationTimestamp: null },
    quotePDF: null,
    contractPDF: null,
    confirmationTimestamp: null,
    acceptedTimestamp: null,
  };

  await ddbDoc.send(new PutCommand({
    TableName: TABLE,
    Item: item,
    ConditionExpression: "attribute_not_exists(QuoteID)",
  }));

  return { message: "Quote added successfully", QuoteID };
};
