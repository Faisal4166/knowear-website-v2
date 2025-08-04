"use client";
import React from "react";
import Bannerimage from "../../public/lowerVideoBanner.png";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PlayIcon from "../../public/icons/play.svg";

type Props = {
  widgetDetails: any;
};

const VideoBanner = ({ widgetDetails }: Props) => {
  return (
    <>
      <section className="relative mt-[30px] md:mt-10 py-[145px] lg:py-[161px]">
        <Image
          src={widgetDetails?.videoCover || Bannerimage}
          alt="Video Banner"
          width={1920}
          height={1080}
          quality={100}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full object-cover"
        />
        <div className="container max-w-full relative z-10 h-full text-white ">
          <h5 className="md:font-normal font-medium text-[13px] lg:text-[15px] lg:leading-[15px] uppercase">
            {widgetDetails?.caption}
          </h5>
          <h3 className="text-[30px] lg:text-[65px] h-[88px] font-semibold md:mt-0 mt-2">
            {widgetDetails?.title}
          </h3>
          <p className="text-sm lg:text-xl font-medium uppercase md:leading-[20px] lg:mt-[10px] -mt-12">
            {widgetDetails?.description}
          </p>
          <Dialog>
            <DialogTrigger className="flex justify-center items-center gap-2 md:text-[18px] text[15px] font-normal text-black bg-white md:px-[21px] md:py-[18px] px-[18px] py-[15px] uppercase mt-[45px] lg:mt-10 hover:rounded-lg transition-all">
              <Image
                src={PlayIcon}
                alt="Play Icon"
                width={20}
                height={20}
                className="w-[20px] h-[20px] md:w-[24px] md:h-[24px]"
              />

              {widgetDetails?.button?.text}
            </DialogTrigger>
            <DialogContent className="p-3 sm:max-w-xl">
              <DialogHeader>
                <DialogDescription>
                  <iframe
                    className="w-full"
                    height="315"
                    src={widgetDetails?.video}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  ></iframe>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </section>
    </>
  );
};

export default VideoBanner;
