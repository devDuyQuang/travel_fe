"use client"
import "../styles/index.css";
import "../../public/assets/scss/main.scss";
import { Provider } from "react-redux";
import store from "@/redux/store";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const isDev = process.env.NODE_ENV === 'development'

  return (
    <html lang="en" suppressHydrationWarning={isDev}>
      <head>
        <meta name="keywords" content="Tourex - Tour & Travel Booking React Next js Template" />
        <meta name="description" content="Tourex is a Modern Tour & Travel Booking React Next js Template. It is perfect for travel businesses of all kinds. Tourex boasts a unique and intuitive search function that is ideal for tour operators, adventure companies, and holiday booking websites alike, as well as hotel booking, plane ticket booking, car rental, and property rental. It’s easy and quick to launch a professional and cost-effective travel website." />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        {/* For IE  */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <link rel="icon" href="/favicon.png" sizes="any" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Outfit:wght@100..900&display=swap" />
      </head>
      <body suppressHydrationWarning={true}>
        <Provider store={store}>
          {children}
        </Provider>
      </body>
    </html>
  )
}
