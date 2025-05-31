export default function RootLayout({ children }) {
  return (
    <html lang="sv">
      <body style={{ margin: 0, fontFamily: 'Arial, sans-serif', background: '#f2f2f2' }}>
        {children}
      </body>
    </html>
  );
}