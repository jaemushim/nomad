"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import Autoplay from "embla-carousel-autoplay"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const HeroBanner = () => {
  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }))

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full"
      opts={{
        loop: true,
      }}
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="relative h-[280px] w-full rounded-3xl bg-red-200 p-1">
              <Image
                src="https://hola-post-image.s3.ap-northeast-2.amazonaws.com/ad/hola-event_2024-01-27_02-28-34.png"
                fill
                alt=""
              ></Image>
              <div className="absolute bottom-5 right-5 flex rounded-full bg-[rgba(255,255,255,0.8)]">
                <CarouselPrevious />
                <CarouselNext />
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}

export default HeroBanner
