const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://api.localhost:8000";

type ApiEnvelope<T> = {
  success?: boolean;
  code?: string;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
};

export type BookingPayload = {
  service_product_id: number;
  booking_type?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  start_date: string;
  end_date?: string;
  start_time?: string;
  adults?: number;
  children?: number;
  quantity?: number;
  booking_details?: Record<string, string | number | boolean | null | undefined>;
  extras?: Array<{
    name: string;
    pricing_type: "per_booking" | "per_person";
    price: string | number;
  }>;
  customer_note?: string;
  payment_method?: "cash" | "bank_transfer";
  idempotency_key: string;
};

export type OrderPayload = {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address_line: string;
  shipping_ward?: string;
  shipping_district?: string;
  shipping_province: string;
  customer_note?: string;
  payment_method?: "cash" | "bank_transfer";
  idempotency_key: string;
  items: Array<{
    product_id: number;
    quantity: number;
  }>;
};

export type BookingResponseData = {
  booking_code: string;
  public_id: string;
};

export type OrderResponseData = {
  order_code: string;
  public_id: string;
};

export function createIdempotencyKey(prefix: string) {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  return `${prefix}-${random}`;
}

export class ApiError extends Error {
  code?: string;
  errors?: Record<string, string[]>;

  constructor(message: string, code?: string, errors?: Record<string, string[]>) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.errors = errors;
  }
}

function validationMessage(errors?: Record<string, string[]>) {
  const first = Object.values(errors || {})[0]?.[0];
  return first || null;
}

async function postJson<T>(path: string, payload: unknown): Promise<ApiEnvelope<T>> {
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const json = (await response.json().catch(() => ({}))) as ApiEnvelope<T>;

  if (!response.ok || json.success === false) {
    const code = response.status === 429 ? "TOO_MANY_REQUESTS" : json.code;
    const friendlyRateLimit =
      "Bạn đã gửi quá nhiều yêu cầu. Vui lòng chờ một chút rồi thử lại.";
    throw new ApiError(
      code === "TOO_MANY_REQUESTS"
        ? friendlyRateLimit
        : validationMessage(json.errors) || json.message || "Có lỗi xảy ra, vui lòng thử lại.",
      code,
      json.errors,
    );
  }

  return json;
}

export async function createBooking(payload: BookingPayload) {
  return postJson<BookingResponseData>("/bookings", payload);
}

export async function createOrder(payload: OrderPayload) {
  return postJson<OrderResponseData>("/orders", payload);
}
