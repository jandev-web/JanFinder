import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const ses = new SESClient({});

export const handler = async (event: any) => {
  const { quoteID, recipients, bucket, pdf_key } = event || {};
  const from = process.env.FROM_EMAIL!;
  const link = `https://${bucket}.s3.amazonaws.com/${pdf_key}`; // or use getUrl presign if you prefer

  const to = [recipients?.ownerEmail, recipients?.memberEmail, recipients?.customerEmail]
    .filter(Boolean) as string[];
  if (!to.length) return { ok: true }; // nothing to send

  const subject = `Contract created for Quote ${quoteID}`;
  const text = `A contract PDF has been generated.\n\nQuote: ${quoteID}\nLink: ${link}\n\nThank you.`;

  await ses.send(new SendEmailCommand({
    Destination: { ToAddresses: to },
    Message: {
      Subject: { Data: subject },
      Body: { Text: { Data: text } },
    },
    Source: from,
  }));

  return { ok: true };
};
