import './globals.css';

export const metadata = {
  title: 'Clothing Store Management',
  description: 'Hệ thống quản lý đại lý phân phối quần áo',
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
} 