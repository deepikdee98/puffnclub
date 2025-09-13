import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.scss";
// import '@/styles/components.scss';
// import '@/app/website/styles/website.scss';
import { ToastContainer } from "react-toastify";
import NextTopLoader from "nextjs-toploader";
import LayoutWrapper from "./LayoutWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PuffnClub - Fashion E-commerce Store",
  description:
    "Discover the latest trends in fashion at PuffnClub. Shop premium clothing, accessories, and more.",
  keywords: "fashion, clothing, e-commerce, shopping, style, trends",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/react-toastify@9.1.3/dist/ReactToastify.css"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        <NextTopLoader
          color="#007bff"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={true}
          easing="ease"
          speed={200}
        />

        <LayoutWrapper>{children}</LayoutWrapper>

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" />
      </body>
    </html>
  );
}
