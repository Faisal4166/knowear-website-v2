// import { CartDetails } from "@/types/providers";
// import Link from "next/link";
// import React from "react";
// import ApplyCoupon from "../cartList/ApplyCoupon";
// type Props = {
//   cartDetails: CartDetails;
//   availableCoupons: any[];
//   getCartDetails: () => void;
//   hasGiftWrap: boolean;
// };

// export default async function CartInfo({
//   cartDetails,
//   availableCoupons,
//   getCartDetails,
// }: Props) {

//   return (
//     <div className="w-full h-auto lg:px-[90px] lg:pb-[70px] lg:pt-8">
//       {/* <ApplyNote /> */}
//       <div className="w-full">
//         <ApplyCoupon
//           availableCoupons={availableCoupons}
//           cartDetails={cartDetails}
//           getCartDetails={getCartDetails}
//         />
//       </div>
//       <div className="mt-6 mb-8">
//         <hr className="border-[#D8D8D8] border-[1px]" />
//       </div>
//       <div className="text-lg">
//         <div className="flex items-center justify-between">
//           <div>Subtotal ( {cartDetails.products.length} items )</div>
//           <div>{cartDetails.summary.total.text}</div>
//         </div>
//         <div className="flex items-center justify-between my-3">
//           <div>Savings</div>
//           <div>- {cartDetails.summary.discount.text}</div>
//         </div>
//         {cartDetails.summary.giftWrap.enabled && (
//           <div className="flex items-center justify-between my-3">
//             <div>Gift Wrap</div>
//             <div>{cartDetails.summary.giftWrap.text}</div>
//           </div>
//         )}
//         {/* <div className="flex items-center justify-between">
//           <div>Shipping</div>
//           <div>{cartDetails.summary.deliveryFee.text}</div>
//         </div> */}
//         <div className="mt-4 mb-5">
//           <hr className="border-[#D8D8D8] border-[1px]" />{" "}
//         </div>
//         <div className="flex items-center justify-between font-semibold">
//           <div>Total</div>
//           <div>{cartDetails.summary.wholeTotal.text}</div>
//         </div>
//       </div>
//       <div className="max-md:mb-[29px]">
//         <Link href="/checkout">
//           <div className="w-full md:mt-12 mt-10 bg-[var(--primary)] text-white text-center py-4 text-[15px] md:text-lg font-medium max-md:uppercase">
//             Check Out
//           </div>
//         </Link>
//         <Link href="/products">
//           <div className="w-full mt-5 md:mt-8 border border-[var(--primary)] text-[var(--primary)] text-center py-4 text-[15px] md:text-lg font-medium max-md:uppercase">
//             Continue Shopping
//           </div>
//         </Link>
//       </div>
//     </div>
//   );
// }
import { CartDetails } from "@/types/providers";
import Link from "next/link";
import React, { useEffect } from "react";
import ApplyCoupon from "../cartList/ApplyCoupon";
import Cookies from "js-cookie";
import api from "@/config/api.interceptor";
import { endpoints } from "@/app/_constants/endpoints/endpoints";
import { toast } from "@/hooks/use-toast";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import BuyNowSheet from "../buynow-sheet/buynow-sheet";
import { Button } from "@/components/ui/button";

type Props = {
  cartDetails: CartDetails;
  availableCoupons: any[];
  getCartDetails: () => void;
  props?: any;
  // hasGiftWrap: boolean;
  // deliveryInstructions: string;
};

export default function CartInfo({
  cartDetails,
  availableCoupons,
  getCartDetails,
  props,
}: // hasGiftWrap,
// deliveryInstructions,
Props) {
  const token = Cookies.get("access_token");
  const [quantity, setQuantity] = React.useState("1");
  const searchParams = useSearchParams();
  const router = useRouter();

  console.log("cartDetails---------------", cartDetails);

  const handleBuyNow = async () => {
    try {
      const response = await api.post(endpoints.BuyNow, {
        product: props?.productDetails?.params?.slug,
        quantity: quantity,
        buynow: true, // Ensures it's a buy now action
      });

      if (response.data.errorCode === 0) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("buynow", "true");
        await getCartDetails();
        await router.replace(`/checkout?${params.toString()}`, {
          scroll: false,
        });
      } else {
        toast({ description: response.data.message, variant: "destructive" });
        await getCartDetails();
      }
    } catch (error) {
      console.error("Error in buy now:", error);
      toast({ title: "Error processing buy now", variant: "destructive" });
    }
  };

  useEffect(() => {
    if (props?.productDetails) {
      if (cartDetails.products && cartDetails.products.length > 0) {
        const productItem = cartDetails.products.find(
          (cartItem: any) =>
            cartItem.params.slug === props?.productDetails.params.slug
        );
        productItem
          ? setQuantity(String(productItem?.quantity))
          : setQuantity("1");
      }
    }
  }, [cartDetails]);

  return (
    <div className="w-full h-auto lg:px-[90px] lg:pb-[70px] lg:pt-8">
      {/* <ApplyNote /> */}
      <div className="w-full">
        <ApplyCoupon
          availableCoupons={availableCoupons}
          cartDetails={cartDetails}
          getCartDetails={getCartDetails}
        />
      </div>
      <div className="mt-6 mb-8">
        <hr className="border-[#D8D8D8] border-[1px]" />
      </div>
      {/* {deliveryInstructions && (
          <div className="flex flex-col my-3">
            <div className="font-medium mb-1">Delivery Instructions</div>
            <div className="text-sm bg-gray-50 p-3 rounded">{deliveryInstructions}</div>
          </div>
        )} */}
      <div className="text-lg">
        <div className="flex items-center justify-between">
          <div>Subtotal ( {cartDetails.products.length} items )</div>
          <div>{cartDetails.summary.total.text}</div>
        </div>
        <div className="flex items-center justify-between my-3">
          <div>Savings</div>
          <div>- {cartDetails.summary.discount.text}</div>
        </div>
        {/* {cartDetails.summary.giftWrap.enabled && (
          <div className="flex items-center justify-between my-3">
            <div>Gift Wrap</div>
            <div>{cartDetails.summary.giftWrap.text}</div>
          </div>
        )} */}
        <div className="flex items-center justify-between">
          <div>VAT(inclusive)</div>
          <div>{cartDetails.summary.tax.text}</div>
        </div>
        <div className="mt-4 mb-5">
          <hr className="border-[#D8D8D8] border-[1px]" />{" "}
        </div>
        <div className="flex items-center justify-between font-semibold">
          <div>Total</div>
          {cartDetails.summary.giftWrap.enabled ? (
            <div>
              {typeof cartDetails.summary.wholeTotal.value === "number" &&
              typeof cartDetails.summary.giftWrap.value === "number"
                ? `$${(
                    cartDetails.summary.wholeTotal.value -
                    cartDetails.summary.giftWrap.value
                  ).toFixed(2)}`
                : cartDetails.summary.wholeTotal.text}
            </div>
          ) : (
            <div>{cartDetails.summary.wholeTotal.text}</div>
          )}
        </div>
      </div>
      <div className="max-md:mb-[29px]">
        {/* {token ? (
          <button
            onClick={handleBuyNow}
            className="block bg-black hover:bg-black font-medium text-base text-white h-[50px] py-[14px] w-full text-center transition-all"
          >
            Check Out{" "}
          </button>
        ) : (
          <BuyNowSheet
            triggerButton={
              <Button className="w-full md:mt-12 mt-10 bg-[var(--primary)] rounded-[0] text-white text-center py-7 text-[15px] md:text-lg font-medium max-md:uppercase">
                Check Out{" "}
              </Button>
            }
            productDetails={props?.productDetails}
            quantity={Number(quantity)}
            getCartDetails={() => {
              return getCartDetails()
                .then(() => {})
                .catch(() => {});
            }}
            isAuthenticated={false}
          />
        )} */}

        <Link href="/checkout">
          <div className="w-full md:mt-12 mt-10 bg-[var(--primary)] text-white text-center py-4 text-[15px] md:text-lg font-medium max-md:uppercase">
            Check Out
          </div>
        </Link>
        <Link href="/products">
          <div className="w-full mt-5 md:mt-8 border border-[var(--primary)] text-[var(--primary)] text-center py-4 text-[15px] md:text-lg font-medium max-md:uppercase">
            Continue Shopping
          </div>
        </Link>
      </div>
    </div>
  );
}
