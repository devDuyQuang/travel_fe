"use client"
import { toast } from 'react-toastify';
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';

interface FormData {
   user_name: string;
   user_email: string;
   phone: string;
   message: string;
}

const API_URL =
   `${(process.env.NEXT_PUBLIC_API_URL || "http://api.localhost:8000").replace(/\/$/, "")}/api`;

const schema = yup
   .object({
      user_name: yup.string().trim().required("Vui lòng nhập họ và tên."),
      user_email: yup
         .string()
         .trim()
         .required("Vui lòng nhập email.")
         .email("Email không đúng định dạng."),
      phone: yup
         .string()
         .trim()
         .required("Vui lòng nhập số điện thoại.")
         .matches(/^[0-9+\-\s().]{8,20}$/, "Số điện thoại không đúng định dạng."),
      message: yup.string().trim().required("Vui lòng nhập nội dung cần tư vấn."),
   })
   .required();

const ContactForm = () => {

   const { register, handleSubmit, reset, formState: { errors }, } = useForm<FormData>({ resolver: yupResolver(schema), });
   const [isSubmitting, setIsSubmitting] = useState(false);

   const submitContact = async (data: FormData) => {
      setIsSubmitting(true);
      try {
         const [firstName, ...restName] = data.user_name.trim().split(/\s+/);
         const response = await fetch(`${API_URL}/contact`, {
            method: "POST",
            headers: {
               Accept: "application/json",
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               first_name: firstName || data.user_name.trim(),
               last_name: restName.join(" "),
               email: data.user_email.trim(),
               phone: data.phone.trim(),
               message: data.message.trim(),
            }),
         });
         const payload = await response.json().catch(() => null) as { success?: boolean; message?: string } | null;

         if (!response.ok || payload?.success === false) {
            throw new Error(payload?.message || "Không thể gửi yêu cầu. Vui lòng thử lại.");
         }

         toast.success('Yêu cầu của bạn đã được gửi. WAYLUNE sẽ liên hệ lại trong thời gian sớm nhất.', { position: 'top-center' });
         reset();
      } catch (error) {
         toast.error(error instanceof Error ? error.message : 'Không thể gửi yêu cầu. Vui lòng thử lại.', { position: 'top-center' });
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <form onSubmit={handleSubmit(submitContact)} id="contact-form">
         <div className="row">
            <div className="col-lg-6 mb-25">
               <input className="input" type="text" {...register("user_name")} placeholder="Nhập họ và tên" autoComplete="name" />
               <p className="form_error">{errors.user_name?.message}</p>
            </div>
            <div className="col-lg-6 mb-25">
               <input className="input" type="email" {...register("user_email")} placeholder="Nhập email" autoComplete="email" />
               <p className="form_error">{errors.user_email?.message}</p>
            </div>
            <div className="col-lg-12 mb-25">
               <input className="input" type="tel" {...register("phone")} placeholder="Nhập số điện thoại" autoComplete="tel" />
               <p className="form_error">{errors.phone?.message}</p>
            </div>
            <div className="col-lg-12">
               <textarea className="textarea mb-5" {...register("message")} placeholder="Hãy cho WAYLUNE biết dịch vụ hoặc hành trình bạn đang quan tâm"></textarea>
               <p className="form_error">{errors.message?.message}</p>
               <button type="submit" className="tg-btn" name="message" disabled={isSubmitting}>
                  {isSubmitting ? "Đang gửi..." : "GỬI YÊU CẦU"}
               </button>
               <p className="ajax-response mb-0 pt-10"></p>
            </div>
         </div>
      </form>
   )
}

export default ContactForm
