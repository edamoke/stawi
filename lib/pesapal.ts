import { getSiteSettings } from "./actions/settings";

const PESAPAL_SANDBOX_URL = "https://cybqa.pesapal.com/pesapalv3";
const PESAPAL_LIVE_URL = "https://pay.pesapal.com/v3";

const FALLBACK_KEY = "b22u1Q5eb85fPMuBB03NB+0bMdLjCRJp";
const FALLBACK_SECRET = "tneOsZvEwnCaOH2deEenKSEWDlI=";

export async function getPesapalAuthToken() {
  console.log("Starting getPesapalAuthToken...");
  const settings = await getSiteSettings("pesapal_settings");
  
  const consumer_key = process.env.PESAPAL_CONSUMER_KEY || settings?.consumer_key || FALLBACK_KEY;
  const consumer_secret = process.env.PESAPAL_CONSUMER_SECRET || settings?.consumer_secret || FALLBACK_SECRET;
  const is_sandbox = settings ? settings.is_sandbox : false;

  const baseUrl = is_sandbox ? PESAPAL_SANDBOX_URL : PESAPAL_LIVE_URL;
  
  console.log("Auth Base URL:", baseUrl);
  console.log("Using Key:", consumer_key.substring(0, 5) + "...");
  
  const response = await fetch(`${baseUrl}/api/Auth/RequestToken`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      consumer_key,
      consumer_secret,
    }),
  });

  const text = await response.text();
  console.log("Auth Raw Response:", text);

  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    throw new Error(`Pesapal Auth returned invalid JSON: ${text.substring(0, 100)}`);
  }
  
  if (!response.ok) {
    throw new Error(data.error?.message || data.message || "Failed to authenticate with Pesapal");
  }

  return data.token;
}

export async function registerPesapalIPN(token: string, callbackUrl: string) {
  console.log("Starting registerPesapalIPN...");
  const settings = await getSiteSettings("pesapal_settings");
  const is_sandbox = settings ? settings.is_sandbox : false;
  const baseUrl = is_sandbox ? PESAPAL_SANDBOX_URL : PESAPAL_LIVE_URL;

  const response = await fetch(`${baseUrl}/api/URLSetup/RegisterIPN`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({
      url: callbackUrl,
      ipn_notification_type: "GET",
    }),
  });

  const text = await response.text();
  console.log("IPN Raw Response:", text);

  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    throw new Error(`Pesapal IPN returned invalid JSON: ${text.substring(0, 100)}`);
  }

  if (!response.ok) {
    throw new Error(data.error?.message || data.message || "Failed to register Pesapal IPN");
  }

  return data.ipn_id;
}

export async function submitPesapalOrder(token: string, orderData: any) {
  console.log("Starting submitPesapalOrder...");
  const settings = await getSiteSettings("pesapal_settings");
  const is_sandbox = settings ? settings.is_sandbox : false;
  const baseUrl = is_sandbox ? PESAPAL_SANDBOX_URL : PESAPAL_LIVE_URL;

  console.log("Order Data being sent:", JSON.stringify(orderData, null, 2));

  const response = await fetch(`${baseUrl}/api/Transactions/SubmitOrderRequest`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });

  const text = await response.text();
  console.log("Order Submission Raw Response:", text);

  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    throw new Error(`Pesapal Order returned invalid JSON: ${text.substring(0, 100)}`);
  }

  if (!response.ok) {
    throw new Error(data.error?.message || data.message || "Failed to submit Pesapal order");
  }

  return data;
}

export async function getPesapalTransactionStatus(token: string, orderTrackingId: string) {
  const settings = await getSiteSettings("pesapal_settings");
  const is_sandbox = settings ? settings.is_sandbox : false;
  const baseUrl = is_sandbox ? PESAPAL_SANDBOX_URL : PESAPAL_LIVE_URL;

  const response = await fetch(`${baseUrl}/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`, {
    method: "GET",
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || "Failed to get transaction status");
  }

  return data;
}
