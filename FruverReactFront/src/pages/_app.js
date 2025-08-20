import SaleContextWrap from "@/contexts/saleContext";
import "@/styles/globals.css";
import "@/styles/datepicker.css";

export default function App({ Component, pageProps }) {
  return (
    <SaleContextWrap>
      <Component {...pageProps} />
    </SaleContextWrap>
  );
}
