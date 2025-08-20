import type { Schema } from "../../data/resource";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

const ddbDoc = DynamoDBDocumentClient.from(
  new DynamoDBClient({}),
  { marshallOptions: { removeUndefinedValues: true } }
);

// prefer env; falls back to literal for local
const CUSTOMER_QUOTES_TABLE = process.env.CUSTOMER_QUOTES_TABLE || "CustomerQuotes";


// ✅ Use the Amplify Data handler type and return your payload directly
export const handler: Schema["createCustomerQuote"]["functionHandler"] = async (_event) => {
  const timestamp = new Date().toISOString();
  const quoteId = uuidv4();

  const item = {
    QuoteID: quoteId,
    ConfirmationNumber: "None",
    Franchise: "None",
    OwnerID: "None",
    IsAccepted: false,
    email: "None",
    memberMade: false,
    customerData: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      address: { street: "", city: "", state: "", postalCode: "", country: "" },
    },
    quoteInfo: {
      budget: 0,
      facilityType: "",
      roomTypes: [],
      sqft: 0,
      floorTypes: { hardfloor: 0, carpet: 0 },
      frequency: "",
      stairwells: { carpet: 0, hardfloor: 0 },
      floors: 0,
    },
    costCalculations: { salary: 0, payrollTax: 0, overhead: 0, profitPercent: 0 },
    Package: { packageOptions: { packageOne: null, packageTwo: null, packageThree: null }, packageChoice: null },
    costInfo: { finalCost: 0, customCost: null, baseCost: 0 },
    Timestamp: timestamp,
    AcceptedTimestamp: "None",
    Confirmed: false,
    QuotePDF: null,
    ContractPDF: null,
    ConfirmationTimestamp: "None",
    isAvailable: "False",
    isSold: "False",
    siteVerified: { verificationStatus: "False", verificationTimestamp: "None", verifiedBy: "None" },
    customerMeasurements: { roomTypes: [], floorTypes: { hardfloor: 0, carpet: 0 }, sqft: 0, stairwells: { carpet: 0, hardfloor: 0 }, floors: 0 },
    ownerMeasurements: { roomTypes: [], floorTypes: { hardfloor: 0, carpet: 0 }, sqft: 0, stairwells: { carpet: 0, hardfloor: 0 }, floors: 0 },
    latestRequest: null,
  };

  await ddbDoc.send(
    new PutCommand({
      TableName: CUSTOMER_QUOTES_TABLE,
      Item: item,
    })
  );

  // 👇 return the payload, NOT {statusCode, body}
  return { message: "Quote added successfully", quoteID: quoteId };
};
