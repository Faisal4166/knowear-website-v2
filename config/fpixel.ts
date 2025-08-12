// types/facebook-pixel.d.ts
interface FacebookPixelEvents {
  (...args: any[]): void;
  callMethod?: Function;
  queue?: any[];
}

declare global {
  interface Window {
    fbq?: FacebookPixelEvents;
    _fbq?: FacebookPixelEvents;
  }
}

type FacebookEventName =
  | "PageView"
  | "AddToCart"
  | "Purchase"
  | "InitiateCheckout"
  | "AddPaymentInfo"
  | "ViewContent"
  | "Search"
  | "Contact"
  | "CustomizeProduct"
  | "Lead";

// Define base event parameters interface
interface FacebookEventOptions {
  currency?: string;
  value?: number;
  content_ids?: string[];
  content_name?: string;
  content_type?: string;
  content_category?: string;
  contents?: Array<{
    id: string;
    quantity: number;
    price?: number;
  }>;
  [key: string]: any; // Allow other custom parameters
}

// Track pageview
export const pageview = () => {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", "PageView");
  }
};

// export const event = (name: FacebookEventName, options: FacebookEventOptions = {}) => {
//   if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
//     window.fbq('track', name, options);
//   }
// };

export const event = (
  name: FacebookEventName,
  options: FacebookEventOptions = {}
) => {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    console.log(`📡 FB Pixel Event Sent: ${name}`, options); // Debug log
    window.fbq("track", name, options);
  }
};

export const trackProductView = (productDetails: any) => {
  event("ViewContent", productDetails);
  console.log(
    "--FB------product details--------EVENT TRIGGER--------------------"
  );
};
export const trackAddToCart = (productDetails: any) => {
  event("AddToCart", productDetails);
  console.log("--FB------add to cart--------EVENT TRIGGER--------------------");
};

export const trackCheckout = (checkoutDetails: any) => {
  event('InitiateCheckout', checkoutDetails);
  console.log(
    "--FB-----checkout--------EVENT TRIGGER--------------------"
  );
}

export const trackPaymentInfo = (purchaseDetails: any) => {
  event("AddPaymentInfo", purchaseDetails);
  console.log(
    "--FB------add payment info--------EVENT TRIGGER--------------------"
  );
};
export const trackPurchase = (purchaseDetails: any) => {
  event("Purchase", purchaseDetails);
  console.log("--FB------Purchase--------EVENT TRIGGER--------------------");
};
