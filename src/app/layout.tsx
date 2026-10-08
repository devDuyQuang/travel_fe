import "../styles/index.css";
import "../../public/assets/css/main.css";
import "../../public/assets/css/golfnity.css";
import type { Metadata, Viewport } from "next";
import ClientProviders from "./ClientProviders";
import { metadataBase, siteDescription } from "@/lib/seoMetadata";

export const metadata: Metadata = {
  metadataBase,
  title: "GOLFNITY | Dịch vụ golf và trải nghiệm",
  description: siteDescription,
  applicationName: "GOLFNITY",
  icons: { icon: { url: "/favicon.png", sizes: "any" } },
  openGraph: { title: "GOLFNITY | Dịch vụ golf và trải nghiệm", description: siteDescription, siteName: "GOLFNITY", locale: "vi_VN", type: "website" },
  twitter: { card: "summary", title: "GOLFNITY | Dịch vụ golf và trải nghiệm", description: siteDescription },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isDev = process.env.NODE_ENV === "development";

  return (
    <html lang="vi" suppressHydrationWarning={isDev}>
      <head>
        {/* For IE  */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Outfit:wght@100..900&display=swap"
        />
      </head>
      <body suppressHydrationWarning={true}>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
