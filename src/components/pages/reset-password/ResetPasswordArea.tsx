"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CustomerPasswordError,
  resetCustomerPassword,
} from "@/services/customer-password.service";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ResetPasswordArea = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const emailFromQuery = searchParams.get("email") || "";
  const [email, setEmail] = useState(emailFromQuery);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setEmail(emailFromQuery);
  }, [emailFromQuery]);

  const validate = () => {
    if (!token) return "Link thiết lập mật khẩu không hợp lệ.";
    if (!emailPattern.test(email.trim())) return "Email không đúng định dạng.";
    if (password.length < 8) return "Mật khẩu cần có ít nhất 8 ký tự.";
    if (password !== passwordConfirmation) return "Mật khẩu xác nhận không khớp.";
    return "";
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationError = validate();
    if (validationError) {
      setSuccess(false);
      setMessage(validationError);
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await resetCustomerPassword({
        token,
        email: email.trim(),
        password,
        password_confirmation: passwordConfirmation,
      });

      setSuccess(true);
      setPassword("");
      setPasswordConfirmation("");
      setMessage(response.message || "Tài khoản của bạn đã sẵn sàng.");
    } catch (error) {
      setSuccess(false);
      setMessage(
        error instanceof CustomerPasswordError
          ? error.message
          : "Không thể thiết lập mật khẩu. Vui lòng thử lại.",
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
                <h2>Thiết lập mật khẩu</h2>
                <p>Thiết lập mật khẩu để quản lý tài khoản booking của bạn.</p>
              </div>
              <div className="tg-login-form">
                <div className="tg-tour-about-review-form">
                  <form onSubmit={submit}>
                    <div className="row">
                      <div className="col-12 mb-25">
                        <input
                          className="input"
                          type="email"
                          placeholder="Email"
                          autoComplete="email"
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
                        />
                      </div>
                      <div className="col-12 mb-25">
                        <input
                          className="input"
                          type="password"
                          placeholder="Mật khẩu mới"
                          autoComplete="new-password"
                          value={password}
                          onChange={(event) => setPassword(event.target.value)}
                        />
                      </div>
                      <div className="col-12 mb-25">
                        <input
                          className="input"
                          type="password"
                          placeholder="Xác nhận mật khẩu"
                          autoComplete="new-password"
                          value={passwordConfirmation}
                          onChange={(event) => setPasswordConfirmation(event.target.value)}
                        />
                      </div>
                      {message ? (
                        <div className="col-12 mb-25">
                          <p className={success ? "text-success" : "text-danger"}>
                            {message}
                          </p>
                          {success ? (
                            <p>
                              <Link href="/dang-nhap">Đăng nhập tài khoản</Link>
                            </p>
                          ) : null}
                        </div>
                      ) : null}
                      <div className="col-12">
                        <button type="submit" className="tg-btn w-100" disabled={loading || success}>
                          {loading ? "Đang xử lý..." : "Thiết lập mật khẩu"}
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

export default ResetPasswordArea;
