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
  | 'PageView'
  | 'AddToCart'
  | 'Purchase'
  | 'InitiateCheckout'
  | 'AddPaymentInfo'
  | 'ViewContent'
  | 'Search'
  | 'Contact'
  | 'CustomizeProduct'
  | 'Lead';

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
    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', 'PageView');
    }
  };

  export const event = (name: FacebookEventName, options: FacebookEventOptions = {}) => {
    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
      window.fbq('track', name, options);
    }
  };

  export const trackProductView = (productDetails: any) => {
      event('ViewContent', productDetails);
  };
  export const trackAddToCart = (productDetails: any) => {
    console.log(productDetails, "product details");
    event('AddToCart', productDetails);
  };

  export const trackCheckout = (checkoutDetails: any) => {
    // Trigger 'InitiateCheckout' event when checkout page is opened
    
    event('InitiateCheckout', checkoutDetails);
  } 
  export const  trackPaymentInfo = (purchaseDetails: any) => {
    // Trigger 'Purchase' event when the order is completed
    event('AddPaymentInfo', purchaseDetails);
  };
  export const trackPurchase = (purchaseDetails: any) => {
    // Trigger 'Purchase' event when the order is completed
    event('Purchase', purchaseDetails);
  };
// Generic event tracking function