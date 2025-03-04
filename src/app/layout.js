import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';

export const metadata = {
  title: 'Clothing Store Management',
  description: 'Hệ thống quản lý đại lý phân phối quần áo',
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning className="bg-light">
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
          <div className="container">
            <Link className="navbar-brand" href="/">Clothing Store</Link>
          </div>
        </nav>
        <div className="container">{children}</div>
      </body>
    </html>
  );
} 