"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  sendUserAttributeVerificationCode,
  confirmUserAttribute,
  fetchAuthSession,
} from "aws-amplify/auth";

export default function VerifyEmail() {
  const router = useRouter();
  const [sent, setSent] = useState(false);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const sendCode = async () => {
    setBusy(true);
    setErr(null);
    try {
      await sendUserAttributeVerificationCode({ userAttributeKey: "email" });
      setSent(true);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to send code");
    } finally {
      setBusy(false);
    }
  };

  const confirm = async () => {
    setBusy(true);
    setErr(null);
    try {
      await confirmUserAttribute({
        userAttributeKey: "email",
        confirmationCode: code,
      });
      await fetchAuthSession({ forceRefresh: true }); // pick up email_verified=true
      router.replace("/members/sign-in"); // or wherever you want to land
    } catch (e: any) {
      setErr(e?.message ?? "Verification failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-semibold mb-3">Verify your email</h1>
      {!sent ? (
        <>
          <p className="mb-4">We need to verify your email before you continue.</p>
          <button onClick={sendCode} disabled={busy} className="px-4 py-2 rounded bg-black text-white">
            {busy ? "Sending…" : "Send verification code"}
          </button>
        </>
      ) : (
        <>
          <label className="block mb-2">Enter the code we emailed you</label>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            inputMode="numeric"
            className="border rounded px-3 py-2 w-full mb-3"
          />
          <div className="flex gap-2">
            <button onClick={confirm} disabled={busy} className="px-4 py-2 rounded bg-black text-white">
              {busy ? "Verifying…" : "Verify & continue"}
            </button>
            <button onClick={sendCode} disabled={busy} className="px-4 py-2 rounded border">
              Resend code
            </button>
          </div>
        </>
      )}
      {err && <p className="text-red-600 mt-3">{err}</p>}
    </div>
  );
}
