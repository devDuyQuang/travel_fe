"use client";

import { FormEvent } from "react";

const LoginArea = () => {
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
                        <input className="input" type="email" placeholder="Email" autoComplete="email" />
                      </div>
                      <div className="col-12 mb-25">
                        <input className="input" type="password" placeholder="Mật khẩu" autoComplete="current-password" />
                      </div>
                      <div className="col-12">
                        <div className="review-checkbox d-flex align-items-center mb-25">
                          <input className="tg-checkbox" type="checkbox" id="remember-login" />
                          <label htmlFor="remember-login" className="tg-label">Ghi nhớ đăng nhập</label>
                        </div>
                        <button type="submit" className="tg-btn w-100">Đăng nhập</button>
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
