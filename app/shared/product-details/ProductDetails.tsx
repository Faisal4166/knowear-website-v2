"use client";
import React, { useContext, useEffect, useRef } from "react";
import AddToCartButton from "../buttons/add-to-cart/AddToCartButton";
import SnapShots from "./SnapShots";
import ColorVarients from "./ColorVarients";
import SizeChart from "./SizeChart";
import ProductSheet from "./ProductSheet";
import ProductSlider from "../product-slider/ProductSlider";
import WishlistButton from "../buttons/wishlist/WishlistButton";
import ProductPrivacySheet from "./ProductPrivacySheet";
import QuantitySelector from "../quantity-selector/QuantitySelector";
import { Product } from "@/types/productDetails.types";
import { StateContext } from "@/providers/state/StateContext";
import api from "@/config/api.interceptor";
import { endpoints } from "@/app/_constants/endpoints/endpoints";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import MiniCartProvider from "../mini-cart/MiniCart";
import Carousel from "@/components/home/ProductDetailsCarousel";
import BuyNow from "../buynow-sheet/buynow-sheet";
import BuyNowSheet from "../buynow-sheet/buynow-sheet";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { trackProductView } from "@/config/fpixel";

type Props = {
  productDetails: Product;
  relatedProducts: { likedProducts: Product[]; relatedProducts: Product[] };
};

const ProductDetails = (props: Props) => {
  const token = Cookies.get("access_token");
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const attributeItems = props?.productDetails?.attributeItems || [];
  const { wishlistDetails, cartDetails, getCartDetails } =
    useContext(StateContext);
  const [isRendered, setIsRendered] = React.useState(false);
  const [isWishlisted, setIsWishlisted] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [quantity, setQuantity] = React.useState("1");
  const [selectedColor, setSelectedColor] = React.useState("");
  const [selectedSize, setSelectedSize] = React.useState("");
  const initialized = useRef(false);
  useEffect(() => {
    if (!props.productDetails?.params?.slug) {
      router.push("/404"); // Redirect to 404 page if product details are not available
    }
  }, []);
// Track product view when component mounts
useEffect(() => {
  // console.log(props.productDetails, "product details");
  if (props.productDetails) { 
    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
      trackProductView({
        content_ids: [props.productDetails.params.slug],
        content_name: props.productDetails.name.text,
        content_type: 'product',
        // content_category: props.productDetails.category?.text,
        value: parseFloat(props.productDetails.price.text.replace(/[^0-9.-]+/g,"")),
        currency: 'AED' // Adjust currency as needed
      })
    }
  }
}, [pathname, props.productDetails]);
  useEffect(() => {
    if (props.productDetails) {
      if (cartDetails.products && cartDetails.products.length > 0) {
        const productItem = cartDetails.products.find(
          (cartItem: any) =>
            cartItem.params.slug === props.productDetails.params.slug
        );
        productItem
          ? setQuantity(String(productItem?.quantity))
          : setQuantity("1");
      }
    }
  }, [cartDetails]);

  useEffect(() => {
    props.productDetails?.attributes.map((attribute: any) => {
      switch (attribute.title) {
        case "Color":
          setSelectedColor(attribute.value);
          break;
        case "Size":
          setSelectedSize(attribute.value);
          break;
        default:
          break;
      }
    });
  }, []);

  useEffect(() => {
    if (props.productDetails) {
      const wishlistIds =
        (wishlistDetails &&
          wishlistDetails?.map((wishlistItem: any) => {
            return wishlistItem.params.slug;
          })) ||
        [];
      const isWishlisted =
        wishlistIds?.includes(props.productDetails.params.slug) || false;
      setIsWishlisted(isWishlisted);
    }
  }, [wishlistDetails]);

  const addToCart = () => {
    api
      .post(endpoints.addToCart, {
        product: props.productDetails.params.slug,
        quantity: quantity,
      })
      .then((response: any) => {
        if (response.data.errorCode == 0) {
          if (open) {
            const params = new URLSearchParams(searchParams.toString());
            params.set("view", "cart");
            router.replace(`?${params.toString()}`, { scroll: false });
          } else {
            router.replace(pathname, { scroll: false });
          }
          setOpen(true);
          getCartDetails();
        } else {
          toast({ description: response.data.message, variant: "destructive" });
          getCartDetails();
        }
      })
      .catch((error: any) => {});
  };
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
    if (selectedColor && selectedSize && isRendered) {
      api
        .post(endpoints.productDetails, {
          parentId: props.productDetails.parentId,
          attributes: [
            { type: "color", title: "Color", value: selectedColor },
            { type: "text", title: "Size", value: selectedSize },
          ],
        })
        .then((response: any) => {
          if (response.data.errorCode == 0) {
            if (response.data.result) {
              router.push(
                "/p/" + response.data.result.productDetails.params.slug
              );
            } else {
              toast({
                description: "No valid combination available",
                variant: "default",
              });
            }
          } else {
            toast({
              description: "Something went wrong",
              variant: "destructive",
            });
          }
        })
        .catch((error: any) => {
          toast({
            description: "Something went wrong",
            variant: "destructive",
          });
        });
    }
    if (!isRendered && selectedColor && selectedSize) {
      setIsRendered(true);
    }
    // eslint-disable-next-line
  }, [selectedColor, selectedSize]);

  return (
    <>
      {props.productDetails && (
        <section className="md:pt-7 lg:pt-[57px]">
          <div className="md:container max-w-full z-[1] relative ">
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-5 lg:gap-[34px]">
              <div className="col-span-4 md:col-span-3 lg:col-span-6">
                <SnapShots medias={props.productDetails.medias} />
              </div>
              <div className="col-span-4 md:col-span-3 lg:col-span-6 max-md:container max-md:max-w-full">
                <div className=" sticky top-0 w-full lg:pt-[29px]">
                  <div className="grid grid-cols-4 gap-3">
                    <div className="col-span-3 md:col-span-4">
                      <div className="bg-[#D4D4D4] w-max font-normal text-xs text-center text-black px-[9px] py-[3px] h-6">
                        {props.productDetails.donationPercentage.text}
                      </div>
                    </div>
                    <div className="col-span-1 md:hidden">
                      <div className="flex justify-end items-center">
                        <WishlistButton
                          productSlug={props.productDetails.params.slug}
                          isWishlisted={isWishlisted}
                        />
                      </div>
                    </div>
                  </div>
                  <h1 className="text-[25px] lg:text-[35px] font-semibold text-black leading-[36.13px] md:leading-[50.58px]">
                    {props.productDetails.name.text}
                  </h1>
                  <p className="text-[#808080] text-[13px] leading-[18px] max-md:mt-[7px]">
                    {props.productDetails.overview.text}
                  </p>
                  {props.productDetails?.actualPrice?.text && (
                    <div className="text-[13px] text-black font-normal mt-3 md:mt-3.5 ">
                      <span className="md:leading-[19.5px]">Was :</span>
                      <span className="line-through text-sm lg:text-lg text-[#9A9AB0] ml-[6px] lg:ml-[9px] md:leading-[28.8px]">
                        {props.productDetails.actualPrice.text}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center text-[13px] text-black font-normal mt-1 md:mt-[8px]">
                    <span className="md:leading-[19.5px]">Now :</span>
                    <span className="text-lg lg:text-2xl font-medium ml-[6px] lg:ml-[4px] mr-[6px] lg:mr-2 md:leading-[28.8px]">
                      {props.productDetails.price.text}
                    </span>
                    <span className="text-[#808080] text-sm">
                      Inclusive of all taxes
                    </span>
                  </div>
                  <div className="text-[13px] text-black font-normal mt-1 md:mt-[12px] flex justify-start items-center">
                    {props.productDetails?.save?.text && (
                      <>
                        <span>Saving : </span>
                        <span className="font-semibold ml-[6px] mr-[6px]">
                          {props.productDetails?.save?.text}
                        </span>
                      </>
                    )}
                    {props.productDetails?.percentageOff?.text && (
                      <>
                        <span className="text-black font-medium text-xs px-1 bg-[#D4D4D4] h-[23px] md:h-6 grid place-items-center w-max">
                          {props?.productDetails?.percentageOff?.text}
                        </span>
                      </>
                    )}
                  </div>
                  <ColorVarients
                    selectedColor={selectedColor}
                    setSelectedColor={setSelectedColor}
                    attributeItems={attributeItems}
                  />
                  <SizeChart
                    selectedSize={selectedSize}
                    setSelectedSize={setSelectedSize}
                    attributeItems={attributeItems}
                    description={props.productDetails.sizeChart.text}
                  />
                  <div className="max-md:hidden flex justify-start lg:flex-nowrap md:flex-wrap items-center gap-5 bg-white md:bg-transparent px-4 md:px-0 py-3 md:py-0 fixed md:relative left-0 md:left-[unset] right-0 md:right-[unset] bottom-[60px] md:bottom-[unset] z-50 md:z-[unset] md:pb-5 lg:pb-[30px]">
                    <div className="w-[66px]">
                      <QuantitySelector
                        quantity={quantity}
                        setQuantity={setQuantity}
                      />
                    </div>
                    {props.productDetails?.inStock ? (
                      <div className="w-[calc(100%_-_86px)]">
                        <MiniCartProvider
                          open={open}
                          setOpen={setOpen}
                          addToCart={addToCart}
                          cartDetails={cartDetails}
                          wishlistDetails={wishlistDetails}
                          getCartDetails={getCartDetails}
                        />
                      </div>
                    ) : (
                      <div className="flex-1 w-[calc(100%_-_70px)]">
                        <Link
                          href={`/product-enquiry/${props.productDetails.params.slug}`}
                          className="block bg-black hover:bg-black font-medium text-base text-white h-[50px] py-[14px] w-full text-center transition-all"
                        >
                          Enquire Now
                        </Link>
                      </div>
                    )}
                    {token?  <button
                      onClick={handleBuyNow}
                      className="block bg-black hover:bg-black font-medium text-base text-white h-[50px] py-[14px] w-full text-center transition-all"
                    >
                      Buy Now
                    </button>:  <BuyNowSheet
                      triggerButton={
                        <Button className="block bg-black  rounded-none hover:bg-black border-radius-none font-medium text-base text-white h-[50px] py-[14px] w-full text-center transition-all">
                          Buy Now
                        </Button>
                      }
                      productDetails={props.productDetails}
                      quantity={Number(quantity)}
                      getCartDetails={() => {
                        return getCartDetails()
                          .then(() => {})
                          .catch(() => {});
                      }}
                      isAuthenticated={false}
                    />}
                  

                  

                    <div className="hidden md:block flex-none">
                      <WishlistButton
                        productSlug={props.productDetails.params.slug}
                        isWishlisted={isWishlisted}
                        isPdp={true}
                      />
                    </div>
                  </div>

                  <div className="w-full">
                    <ProductSheet
                      description={props.productDetails.description.text}
                    />
                    <ProductPrivacySheet
                      description={props.productDetails.returnPolicy.text}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-[50px]">
              <div className="relative pb-[100px] max-md:container max-md:max-w-full">
                {
                  // props.relatedProducts.likedProducts && props.relatedProducts.likedProducts.length > 0 && (
                  //   <div>
                  //     <div className="flex justify-between items-center ">
                  //       <div className="text-lg lg:text-[35px] font-bold  md:mb-[31px] leading-[50.58px]">You May Also Like</div>
                  //       <Link href={"/products"} className="underline">
                  //        View All
                  //       </Link>
                  //     </div>
                  //     <Carousel products={props.relatedProducts.likedProducts} />
                  //   </div>
                  // )
                }

                {props?.relatedProducts?.relatedProducts &&
                  props.relatedProducts.relatedProducts.length > 0 && (
                    <div className="mt-6 lg:mt-12">
                      <div className="text-2xl lg:text-4xl font-semibold mb-6">
                        You May Also Like
                      </div>
                      <Carousel
                        products={props.relatedProducts.relatedProducts}
                      />
                    </div>
                  )}
              </div>
            </div>
          </div>
          <div className="flex justify-start items-center gap-5 bg-white md:bg-transparent px-4 md:px-0 py-3 md:py-0 fixed md:relative left-0 md:left-[unset] right-0 md:right-[unset] bottom-[60px] md:bottom-[unset] z-50 md:z-[unset] md:pb-5 lg:pb-[30px] md:hidden">
            <div className="w-[66px]">
              <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
            </div>
            {props.productDetails?.inStock ? (
              <div className="w-[calc(100%_-_86px)]  max-sm:w-[calc(100%_-_-200px)]">
                <MiniCartProvider
                  open={open}
                  setOpen={setOpen}
                  addToCart={addToCart}
                  cartDetails={cartDetails}
                  wishlistDetails={wishlistDetails}
                  getCartDetails={getCartDetails}
                />
              </div>
            ) : (
              <div className="flex-1 w-[calc(100%_-_70px)]">
                <Link
                  href={`/product-enquiry/${props.productDetails.params.slug}`}
                  className="block bg-black hover:bg-black font-medium text-base text-white h-[50px] py-[14px] w-full text-center transition-all"
                >
                  Enquire Now
                </Link>
              </div>
            )}
            {/* <button
              onClick={handleBuyNow}
              className="block bg-black hover:bg-black font-medium text-base text-white h-[50px] py-[14px] w-full text-center transition-all"
            >
              Buy Now
            </button> */}
            {token?  <button
                      onClick={handleBuyNow}
                      className="block bg-black hover:bg-black font-medium text-base text-white h-[50px] py-[14px] w-full text-center transition-all"
                    >
                      Buy Now
                    </button>:  <BuyNowSheet
                      triggerButton={
                        <Button className="block bg-black  rounded-none hover:bg-black border-radius-none font-medium text-base text-white h-[50px] py-[14px] w-full text-center transition-all">
                          Buy Now
                        </Button>
                      }
                      productDetails={props.productDetails}
                      quantity={Number(quantity)}
                      getCartDetails={() => {
                        return getCartDetails()
                          .then(() => {})
                          .catch(() => {});
                      }}
                      isAuthenticated={false}
                    />}
                  

            <div className="hidden md:block flex-none">
              <WishlistButton
                productSlug={props.productDetails.params.slug}
                isWishlisted={isWishlisted}
                isPdp={true}
              />
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default ProductDetails;
