import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Provider } from "./provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	metadataBase: new URL('https://x.sammi.ac'),
	title: 'Twitter X',
	description: 'Twitter X is a Twitter clone built by Sammi.ac',
	authors: [{ name: 'Samar Badriddinov', url: 'https://x.sammi.ac' }],
	 icons: { icon: "/images/x.svg" },
	openGraph: {
		title: 'Twitter X',
		description: "Twitter X is a Twitter clone built by Sammi.ac",
		type: 'website',
		url: 'https://x.sammi.ac',
		locale: 'uz_UZ',
		images: 'https://media.graphassets.com/3XlUA3OBSjaQcMNFYnVv',
		countryName: 'Uzbekistan',
		siteName: 'Sammi',
		emails: 'info@sammi.ac',
	},
	keywords: "Twitter, Twitter web, twitter clone, twitter web application, Ilon, Ilon Mask, samar badriddinov"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </Provider>
      </body>
    </html>
  );
}
