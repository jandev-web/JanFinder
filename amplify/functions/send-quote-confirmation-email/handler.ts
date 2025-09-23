// lambda/sendQuoteConfirmationEmail.ts
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import {
  SESClient,
  CreateTemplateCommand,
  UpdateTemplateCommand,
  SendTemplatedEmailCommand,
} from "@aws-sdk/client-ses";
import type { Schema } from "../../data/resource";

const ddbDoc = DynamoDBDocumentClient.from(new DynamoDBClient(), {
  marshallOptions: { removeUndefinedValues: true },
});
const ses = new SESClient({ region: process.env.AWS_REGION || "us-east-1" });

const QUOTES = process.env.CUSTOMER_QUOTES_TABLE || "CustomerQuotes";
const SENDER = process.env.SENDER_EMAIL || "no-reply@example.com";
const SITE_URL = process.env.SITE_URL || "https://bid2clean.com";
const TEMPLATE_NAME = process.env.SES_TEMPLATE_NAME || "Bid2CleanQuoteConfirmation_v1";

type AnyObj = Record<string, any>;

const currency = (n: number | string | undefined) => {
  const val = typeof n === "string" ? Number(n) : n;
  if (typeof val !== "number" || Number.isNaN(val)) return "";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(val);
};
const displayFreq = (f?: string) => {
  const m = String(f || "").trim();
  if (!m) return "";
  if (/^daily-?1$/i.test(m)) return "Daily";
  if (/^bi-?weekly$/i.test(m)) return "Bi-Weekly";
  return m.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};
const titleCase = (s: string) =>
  s.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const SUBJECT = "Quote Confirmation";

/** STRICT brand colors + mobile-safe + small button + neutral shadow */
const HTML_PART = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>Quote Confirmation</title>
<style>
  html,body{margin:0!important;padding:0!important;height:100%!important;width:100%!important;background:#ffffff!important;min-width:320px;}
  *{-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}
  table{border-collapse:collapse!important}
  img{border:0;outline:0;-ms-interpolation-mode:bicubic;display:block}
  a{text-decoration:none}
  a[x-apple-data-detectors],#x-apple-data-detectors a,.unstyle-auto-detected-links a{color:inherit!important;text-decoration:none!important;border-bottom:0!important;cursor:default!important}
  div[style*="margin: 16px 0"]{margin:0!important}

  /* Tokens */
  .brandBlue{color:#001F54!important}
  .brandBlueBg{background:#001F54!important}
  .brandYBg{background:#F5C542!important}
  .text{color:#111827!important}
  .muted{color:#4b5563!important}

  /* Card: white + neutral shadow (no blue tint) */
  .card{background:#ffffff!important;border:1px solid #e5e7eb!important;border-radius:16px;overflow:hidden;
        box-shadow:0 8px 24px rgba(0,0,0,0.08);}

  .divider{border-top:1px solid #e5e7eb}
  .pill{display:inline-block;margin-top:8px;padding:6px 10px;border:1px solid #F5C542;border-radius:999px;
        font:12px/1 Inter,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#001F54;background:#ffffff}

  .container{width:100%!important;max-width:600px!important;margin:0 auto!important}
  .outerPad{padding:24px}
  .innerPad{padding:24px}

  .h1{font:700 20px/1.3 Inter,Segoe UI,Roboto,Helvetica,Arial,sans-serif;margin:0 0 6px}
  .h2{font:700 15px/1.3 Inter,Segoe UI,Roboto,Helvetica,Arial,sans-serif;margin:0 0 8px;text-align:center}
  .label{font:12px/1.3 Inter,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#4b5563}
  .value{font:600 14px/1.3 Inter,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#111827}

  /* Columns that drop padding on mobile */
  .colL{padding-right:8px}
  .colR{padding-left:8px}

  /* Compact CTA button (small on all screens) */
  .btnLink{
    display:inline-block;
    background:#F5C542;
    color:#001F54;
    border-radius:10px;
    padding:10px 14px;
    font:700 13px/1.1 Inter,Segoe UI,Roboto,Helvetica,Arial,sans-serif;
    text-align:center;
    max-width:260px;
    width:auto;
    border:1px solid #F5C542;
  }

  /* Mobile */
  @media screen and (max-width:600px){
    .outerPad{padding-left:16px!important;padding-right:16px!important}
    .innerPad{padding:16px!important}
    .stack{display:block!important;width:100%!important}
    .center{text-align:center!important}
    .colL,.colR{padding-left:0!important;padding-right:0!important}
    .price{font-size:22px!important}
    .h1{font-size:18px!important}
    .footerRow .stack{padding-top:8px!important}
    /* Add spacing between stacked columns so Hard Floor Care sits nicely under Carpet Care */
    .stack + .stack{margin-top:12px!important}
  }

  /* Force white canvas in dark-mode clients; keep brand colors exact */
  @media (prefers-color-scheme: dark){
    html,body,.card{background:#ffffff!important}
    .text{color:#111827!important}
    .muted{color:#4b5563!important}
  }
</style>
</head>
<body style="background:#ffffff;margin:0;padding:0;">
  <span style="display:none!important;visibility:hidden;opacity:0;height:0;width:0;overflow:hidden;">Your quote is confirmed. View details inside.</span>

  <!-- Full-width safe outer -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;">
    <tr>
      <td align="center" style="padding:0;margin:0;">

        <!-- Header -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;border-bottom:1px solid #e5e7eb;">
          <tr>
            <td align="center" class="outerPad" style="padding:0;">
              <table role="presentation" width="100%" class="container" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:18px 0;">
                    <table role="presentation" width="100%">
                      <tr>
                        <td class="stack" valign="middle">
                          <table role="presentation">
                            <tr>
                              <td class="brandBlueBg" style="width:40px;height:40px;border-radius:12px;text-align:center;background:#001F54;">
                                <span style="display:inline-block;line-height:40px;font:700 16px Inter,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#ffffff;">B2C</span>
                              </td>
                              <td width="12"></td>
                              <td valign="middle">
                                <div class="brandBlue" style="font:700 22px/1 Inter,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#001F54;">Bid2Clean</div>
                                <div class="brandYBg" style="margin-top:8px;width:64px;height:6px;background:#F5C542;border-radius:999px;"></div>
                              </td>
                            </tr>
                          </table>
                        </td>
                        <td class="stack center" valign="middle" align="right" style="padding-top:8px;">
                          <div class="muted" style="font:13px/1.4 Inter,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">Confirmation #{{confirmationNumber}}</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Body -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="center" class="outerPad" style="padding:24px;">
              <!--[if mso]>
              <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;border:1px solid #e5e7eb;border-radius:16px;">
                <tr><td><![endif]-->
              <table role="presentation" width="100%" class="container card" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;box-shadow:0 8px 24px rgba(0,0,0,0.08);">
                <!-- Title -->
                <tr>
                  <td class="innerPad">
                    <div class="h1 text">Your {{packageType}} Cleaning Quote</div>
                    <div class="muted" style="font:14px/1.6 Inter,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">Hi {{firstName}}, thanks for considering us. Here's a summary of your quote and next steps.</div>
                  </td>
                </tr>

                <!-- Key facts -->
                <tr>
                  <td class="innerPad" style="padding-top:0;">
                    <table role="presentation" width="100%">
                      <tr>
                        <td class="stack colL" valign="top" style="width:50%;padding:12px;border:1px solid #e5e7eb;border-radius:12px;">
                          <div class="label">Facility</div><div class="value">{{facility}}</div>
                        </td>
                        <td width="16" class="stack" style="display:none"></td>
                        <td class="stack colR" valign="top" style="width:50%;padding:12px;border:1px solid #e5e7eb;border-radius:12px;">
                          <div class="label">Frequency</div><div class="value">{{frequency}}</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Price + CTA -->
                <tr>
                  <td class="innerPad" style="padding-top:8px;">
                    <table role="presentation" width="100%">
                      <tr>
                        <td class="stack colL" valign="top" style="width:50%;padding:12px;">
                          <div class="label">Package Price</div>
                          <div class="value price" style="font:800 28px/1.2 Inter,Segoe UI,Roboto,Helvetica,Arial,sans-serif">{{packageCost}}</div>
                          <span class="pill">{{packageType}} Package</span>
                        </td>
                        <td class="stack center colR" valign="middle" align="center" style="width:50%;padding:12px;">
                          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td align="center">
                                <a href="{{statusUrl}}" class="btnLink">View Quote Status</a>
                              </td>
                            </tr>
                          </table>
                          <div class="muted" style="font:12px/1.6 Inter,Segoe UI,Roboto,Helvetica,Arial,sans-serif;margin-top:10px;">Confirmation #{{confirmationNumber}}</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr><td class="divider"></td></tr>

                <!-- Contact + blurb -->
                <tr>
                  <td class="innerPad">
                    <table role="presentation" width="100%">
                      <tr>
                        <td class="stack colL" valign="top" style="width:50%;">
                          <div class="label">Contact</div>
                          <div class="value">{{firstName}} {{lastName}}</div>
                          <div class="muted" style="font:13px/1.6 Inter,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
                            {{email}}<br>{{phone}}<br>{{company}}<br>{{address}}
                          </div>
                        </td>
                        <td class="stack colR" valign="top" style="width:50%;">
                          <div class="label">What’s Included</div>
                          <div class="text" style="font:13px/1.7 Inter,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
                            We’ve summarized your core room tasks and any floor care below. Need adjustments? Reply to this email and we’ll tune the package.
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Rooms -->
                <tr>
                  <td class="innerPad" style="padding-top:0;">
                    <div class="h2 text">Room Tasks</div>
                    <table role="presentation" width="100%" style="border:1px solid #e5e7eb;border-radius:12px;">
                      {{#if hasRooms}}
                        {{#each rooms}}
                        <tr>
                          <td style="padding:14px 16px;border-bottom:1px solid #e5e7eb;">
                            <div class="value" style="margin:0 0 6px">{{roomName}}</div>
                            <table role="presentation" width="100%">
                              {{#if roomTasks}}
                                {{#each roomTasks}}
                                <tr>
                                  <td class="muted" style="font:12px/1.4 Inter,Segoe UI,Roboto,Helvetica,Arial,sans-serif;padding:4px 0;width:60%">{{taskName}}</td>
                                  <td class="text" align="right" style="font:12px/1.4 Inter,Segoe UI,Roboto,Helvetica,Arial,sans-serif;padding:4px 0;width:40%">{{taskFrequency}}</td>
                                </tr>
                                {{/each}}
                              {{else}}
                                <tr><td class="muted" style="font:12px/1.4 Inter,Segoe UI,Roboto,Helvetica,Arial,sans-serif;padding:4px 0">No tasks</td></tr>
                              {{/if}}
                            </table>
                          </td>
                        </tr>
                        {{/each}}
                      {{else}}
                        <tr><td style="padding:14px 16px"><div class="muted" style="font:13px/1.4 Inter,Segoe UI,Roboto,Helvetica,Arial,sans-serif">No room tasks included.</div></td></tr>
                      {{/if}}
                    </table>
                  </td>
                </tr>

                <!-- Floors -->
                <tr>
                  <td class="innerPad" style="padding-top:0;">
                    <table role="presentation" width="100%">
                      <tr>
                        <td class="stack colL" valign="top" style="width:50%;">
                          <div class="h2 text">Carpet Care</div>
                          <table role="presentation" width="100%" style="border:1px solid #e5e7eb;border-radius:12px;">
                            {{#if hasCarpetTasks}}
                              {{#each carpetTasks}}
                              <tr>
                                <td class="muted" style="font:12px/1.4 Inter,Segoe UI,Roboto,Helvetica,Arial,sans-serif;padding:10px 12px">{{taskName}}</td>
                                <td class="text" align="right" style="font:12px/1.4 Inter,Segoe UI,Roboto,Helvetica,Arial,sans-serif;padding:10px 12px">{{taskFrequency}}</td>
                              </tr>
                              {{/each}}
                            {{else}}
                              <tr><td class="muted" style="padding:10px 12px;font:12px/1.4 Inter,Segoe UI,Roboto,Helvetica,Arial,sans-serif">No carpet tasks.</td></tr>
                            {{/if}}
                          </table>
                        </td>
                        <td class="stack colR" valign="top" style="width:50%;">
                          <div class="h2 text">Hard Floor Care</div>
                          <table role="presentation" width="100%" style="border:1px solid #e5e7eb;border-radius:12px;">
                            {{#if hasHardfloorTasks}}
                              {{#each hardfloorTasks}}
                              <tr>
                                <td class="muted" style="font:12px/1.4 Inter,Segoe UI,Roboto,Helvetica,Arial,sans-serif;padding:10px 12px">{{taskName}}</td>
                                <td class="text" align="right" style="font:12px/1.4 Inter,Segoe UI,Roboto,Helvetica,Arial,sans-serif;padding:10px 12px">{{taskFrequency}}</td>
                              </tr>
                              {{/each}}
                            {{else}}
                              <tr><td class="muted" style="padding:10px 12px;font:12px/1.4 Inter,Segoe UI,Roboto,Helvetica,Arial,sans-serif">No hard floor tasks.</td></tr>
                            {{/if}}
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

              </table>
              <!--[if mso]></td></tr></table><![endif]-->
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" class="outerPad" style="padding:0 24px 24px 24px;">
              <table role="presentation" width="100%" class="container" cellpadding="0" cellspacing="0" border="0">
                <tr class="footerRow">
                  <td class="stack" align="left" style="padding:8px 0;">
                    <div class="muted" style="font:12px/1.6 Inter,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
                      You’re receiving this because you requested a quote. © {{year}} {{company}}. All rights reserved.
                    </div>
                  </td>
                  <td class="stack" align="right" style="padding:8px 0;">
                    <a href="{{statusUrl}}" class="brandBlue" style="font:12px/1.6 Inter,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#001F54;">Manage preferences</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

const TEXT_PART = `Quote Confirmation
Hi {{firstName}},

Confirmation #{{confirmationNumber}}
Package: {{packageType}}
Price: {{packageCost}}

Facility: {{facility}}
Frequency: {{frequency}}

View status: {{statusUrl}}
© {{year}} {{company}}`;

async function ensureTemplate() {
  try {
    await ses.send(new CreateTemplateCommand({
      Template: { TemplateName: TEMPLATE_NAME, SubjectPart: SUBJECT, HtmlPart: HTML_PART, TextPart: TEXT_PART },
    }));
  } catch (e: any) {
    if (e?.name === "AlreadyExistsException" || e?.message?.includes("already exists")) {
      await ses.send(new UpdateTemplateCommand({
        Template: { TemplateName: TEMPLATE_NAME, SubjectPart: SUBJECT, HtmlPart: HTML_PART, TextPart: TEXT_PART },
      }));
    } else {
      throw e;
    }
  }
}

export const handler: Schema["sendQuoteConfirmationEmail"]["functionHandler"] = async (event) => {
  await ensureTemplate();

  // Load quote
  const quoteID = event.arguments?.quoteID as string | undefined;
  if (!quoteID) throw new Error("Missing 'quoteID'");

  const res = await ddbDoc.send(new GetCommand({ TableName: QUOTES, Key: { QuoteID: String(quoteID) } }));
  const item = res.Item as AnyObj | undefined;
  if (!item) throw new Error("No quote found for QuoteID: " + quoteID);

  // Customer
  const customer = item.customerData ?? {};
  const firstName = customer.firstName ?? "";
  const lastName  = customer.lastName ?? "";
  const email     = customer.email ?? "";
  const phone     = customer.phone ?? "";
  const company   = customer.company ?? "";
  const addr      = customer.address ?? {};
  const addressStr = [addr.street, addr.city, addr.state, addr.postalCode, addr.country].filter(Boolean).join(", ");

  // Quote info
  const qi = item.quoteInfo ?? {};
  const facility  = qi.facilityType ?? "";
  const frequency = displayFreq(qi.frequency ?? "");
  const confirmationNumber = item.ConfirmationNumber ?? "";

  // Resolve chosen package from options
  const pkgRoot   = (item?.package ?? item?.Package ?? {}) as AnyObj;
  const choice    = pkgRoot.packageChoice; // string or object
  const options   = Array.isArray(pkgRoot.packageOptions) ? (pkgRoot.packageOptions as AnyObj[]) : [];

  const normType = (x: any) => String(x ?? "").trim().toLowerCase();
  const getType  = (p?: AnyObj) => normType(p?.packageType ?? p?.type ?? p?.name ?? p?.tier);

  let chosen: AnyObj | null = null;
  if (options.length) {
    const choiceType = typeof choice === "string" ? normType(choice) : getType(choice);
    if (choiceType) chosen = options.find(opt => getType(opt) === choiceType) ?? null;
  }
  if (!chosen) chosen = (choice && typeof choice === "object") ? (choice as AnyObj) : (pkgRoot as AnyObj);

  const packageTypeRaw = (chosen.packageType ?? chosen.type ?? chosen.name ?? chosen.tier ?? "").toString();
  const packageName = (chosen.packageName || chosen.label || titleCase(packageTypeRaw));
  const cost = (chosen.packageCost ?? chosen.cost) as number | string | undefined;

  // Tasks + rooms
  const carpetTasksRaw    = (chosen.carpet?.tasks ?? chosen.carpetTasks ?? []) as AnyObj[];
  const hardfloorTasksRaw = (chosen.hardfloor?.tasks ?? chosen.hardfloorTasks ?? []) as AnyObj[];
  const packageRoomsRaw   = (chosen.rooms ?? chosen.packageRooms ?? []) as AnyObj[];

  const carpetTasks = carpetTasksRaw.map(t => ({
    taskName: t.taskName ?? t.name ?? "Task",
    taskFrequency: displayFreq(t.taskFrequency ?? t.frequency ?? ""),
  }));
  const hardfloorTasks = hardfloorTasksRaw.map(t => ({
    taskName: t.taskName ?? t.name ?? "Task",
    taskFrequency: displayFreq(t.taskFrequency ?? t.frequency ?? ""),
  }));
  const rooms = packageRoomsRaw
    .filter(r => (r && (r.totalMonthTime ?? 0) >= 0 && (r.roomSize ?? 0) >= 0))
    .sort((a, b) => String(a.roomName ?? a.roomType ?? "").localeCompare(String(b.roomName ?? b.roomType ?? "")))
    .map(r => {
      const roomTasks = Array.isArray(r.roomTasks) ? r.roomTasks : (Array.isArray(r.tasks) ? r.tasks : []);
      return {
        roomName: r.roomName ?? r.roomType ?? "Room",
        roomTasks: roomTasks.map((t: AnyObj) => ({
          taskName: t.taskName ?? t.name ?? "Task",
          taskFrequency: displayFreq(t.taskFrequency ?? t.frequency ?? ""),
        })),
      };
    });

  if (!email) throw new Error("Quote " + quoteID + " does not have an email field");

  const templateData = {
    firstName,
    lastName,
    confirmationNumber,
    packageType: packageName,
    packageCost: currency(cost) || "",
    company,
    email,
    phone: String(phone || ""),
    address: addressStr,
    facility,
    frequency,
    statusUrl: SITE_URL + "/quote-status",
    year: new Date().getFullYear(),
    carpetTasks,
    hardfloorTasks,
    rooms,
    hasCarpetTasks: carpetTasks.length > 0,
    hasHardfloorTasks: hardfloorTasks.length > 0,
    hasRooms: rooms.length > 0,
  };

  await ses.send(new SendTemplatedEmailCommand({
    Source: SENDER,
    Destination: { ToAddresses: [email] },
    Template: TEMPLATE_NAME,
    TemplateData: JSON.stringify(templateData),
  }));

  return { message: "Confirmation email sent successfully." };
};
