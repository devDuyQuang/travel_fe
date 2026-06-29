"use client";
import "../styles/index.css";
import "../../public/assets/css/main.css";
import "../../public/assets/css/golfnity.css";
import { Provider } from "react-redux";
import store from "@/redux/store";
import { CustomerAuthProvider } from "@/contexts/CustomerAuthContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isDev = process.env.NODE_ENV === "development";

  return (
    <html lang="vi" suppressHydrationWarning={isDev}>
      <head>
        {/* <meta
          name="keywords"
          content="Golfnity - Dịch vụ golf và trải nghiệm"
        />
        <meta
          name="description"
          content="Golfnity cung cấp dịch vụ golf, lưu trú, đưa đón và trải nghiệm dành cho golfer."
        /> */}
        <meta
          name="keywords"
          content="Golf, Teetime, Golf Tour, Golf Booking, WAYLUNE"
        />

        <meta
          name="description"
          content="WAYLUNE cung cấp dịch vụ đặt tee time, tour golf và các giải pháp golf chuyên nghiệp."
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        {/* For IE  */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <link rel="icon" href="/favicon.png" sizes="any" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Outfit:wght@100..900&display=swap"
        />
      </head>
      <body suppressHydrationWarning={true}>
        <Provider store={store}>
          <CustomerAuthProvider>{children}</CustomerAuthProvider>
        </Provider>
      </body>
    </html>
  );
}
