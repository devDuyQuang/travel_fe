import { apiFetch } from "@/lib/apiClient";

export type Customer = {
  id: number;
  name: string;
  email: string;
  role: "customer";
};

export type CustomerLoginPayload = {
  email: string;
  password: string;
};

type ApiEnvelope<T> = {
  success?: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
};

export class CustomerAuthError extends Error {
  status?: number;
  errors?: Record<string, string[]>;

  constructor(message: string, status?: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = "CustomerAuthError";
    this.status = status;
    this.errors = errors;
  }
}

function firstValidationMessage(errors?: Record<string, string[]>): string | null {
  return Object.values(errors || {})[0]?.[0] || null;
}

async function readEnvelope<T>(response: Response): Promise<ApiEnvelope<T>> {
  return (await response.json().catch(() => ({}))) as ApiEnvelope<T>;
}

function assertCustomerResponse(
  response: Response,
  envelope: ApiEnvelope<Customer>,
): Customer {
  if (!response.ok || envelope.success === false || !envelope.data) {
    const message =
      firstValidationMessage(envelope.errors) ||
      envelope.message ||
      "Không thể xử lý yêu cầu đăng nhập.";

    throw new CustomerAuthError(message, response.status, envelope.errors);
  }

  return envelope.data;
}

export async function loginCustomer(payload: CustomerLoginPayload): Promise<Customer> {
  const response = await apiFetch("/customer/login", {
    method: "POST",
    body: {
      email: payload.email.trim().toLowerCase(),
      password: payload.password,
    },
  });

  assertCustomerResponse(response, await readEnvelope<Customer>(response));

  const currentCustomer = await getCurrentCustomer();

  if (!currentCustomer) {
    throw new CustomerAuthError("Không thể xác nhận phiên đăng nhập.", 401);
  }

  return currentCustomer;
}

export async function getCurrentCustomer(): Promise<Customer | null> {
  const response = await apiFetch("/customer/me");

  if (response.status === 401) {
    return null;
  }

  return assertCustomerResponse(response, await readEnvelope<Customer>(response));
}

export async function logoutCustomer(): Promise<void> {
  const response = await apiFetch("/customer/logout", {
    method: "POST",
  });

  if (!response.ok) {
    const envelope = await readEnvelope<null>(response);
    throw new CustomerAuthError(
      envelope.message || "Không thể đăng xuất. Vui lòng thử lại.",
      response.status,
      envelope.errors,
    );
  }
}
