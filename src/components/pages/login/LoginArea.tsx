"use client";

import { FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { CustomerAuthError } from "@/services/customer-auth.service";
import { useCustomerAuth } from "@/hooks/useCustomerAuth";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function safeReturnUrl(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }

  return value;
}

const LoginArea = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useCustomerAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (!emailPattern.test(normalizedEmail)) {
      setMessage("Email không đúng định dạng.");
      return;
    }

    if (!password) {
      setMessage("Vui lòng nhập mật khẩu.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await login({ email: normalizedEmail, password });
      setPassword("");
      router.replace(safeReturnUrl(searchParams.get("returnUrl")));
    } catch (error) {
      setMessage(
        error instanceof CustomerAuthError
          ? error.message
          : "Không thể đăng nhập. Vui lòng thử lại.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tg-login-area pt-130 pb-130">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-6 col-lg-8 col-md-10">
            <div className="tg-login-wrapper">
              <div className="tg-login-top text-center mb-30">
                <h2>Đăng nhập tài khoản</h2>
                <p>Đăng nhập để quản lý thông tin và lịch booking của bạn.</p>
              </div>
              <div className="tg-login-form">
                <div className="tg-tour-about-review-form">
                  <form onSubmit={submit}>
                    <div className="row">
                      <div className="col-12 mb-25">
                        <input
                          className="input golfnity-form-control"
                          type="email"
                          placeholder="Email"
                          autoComplete="email"
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
                        />
                      </div>
                      <div className="col-12 mb-25">
                        <input
                          className="input golfnity-form-control"
                          type="password"
                          placeholder="Mật khẩu"
                          autoComplete="current-password"
                          value={password}
                          onChange={(event) => setPassword(event.target.value)}
                        />
                      </div>
                      {message ? (
                        <div className="col-12 mb-25">
                          <p className="text-danger">{message}</p>
                        </div>
                      ) : null}
                      <div className="col-12">
                        <div className="review-checkbox d-flex align-items-center mb-25">
                          <input className="tg-checkbox" type="checkbox" id="remember-login" />
                          <label htmlFor="remember-login" className="tg-label">Ghi nhớ đăng nhập</label>
                        </div>
                        <button
                          type="submit"
                          className="tg-btn w-100 golfnity-form-button"
                          disabled={loading}
                        >
                          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginArea;
