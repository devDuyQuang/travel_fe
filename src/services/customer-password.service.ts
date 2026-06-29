import { apiFetch } from "@/lib/apiClient";

type ApiEnvelope = {
  success?: boolean;
  code?: string;
  message?: string;
  errors?: Record<string, string[]>;
};

export type CustomerPasswordResetPayload = {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export class CustomerPasswordError extends Error {
  errors?: Record<string, string[]>;
  code?: string;

  constructor(message: string, code?: string, errors?: Record<string, string[]>) {
    super(message);
    this.name = "CustomerPasswordError";
    this.code = code;
    this.errors = errors;
  }
}

function firstValidationMessage(errors?: Record<string, string[]>) {
  return Object.values(errors || {})[0]?.[0] || null;
}

export async function resetCustomerPassword(
  payload: CustomerPasswordResetPayload,
): Promise<ApiEnvelope> {
  const response = await apiFetch("/customer/password/reset", {
    method: "POST",
    body: payload,
  });

  const json = (await response.json().catch(() => ({}))) as ApiEnvelope;

  if (!response.ok || json.success === false) {
    const code = response.status === 429 ? "TOO_MANY_REQUESTS" : json.code;
    const message =
      code === "TOO_MANY_REQUESTS"
        ? "Bạn đã gửi quá nhiều yêu cầu. Vui lòng chờ một chút rồi thử lại."
        : firstValidationMessage(json.errors) || json.message || "Không thể thiết lập mật khẩu.";

    throw new CustomerPasswordError(message, code, json.errors);
  }

  return json;
}
