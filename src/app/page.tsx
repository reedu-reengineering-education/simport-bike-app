'use client'
import ConnectionSelection from '@/components/Wizard/ConnectionSelection'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import Welcome from '@/components/Wizard/Welcome'
import OpenSenseMapLogin from '@/components/Wizard/OpenSenseMapLogin'
import SelectDevice from '@/components/Wizard/SelectDevice'

export default function Home() {
  return (
    <Swiper
      spaceBetween={50}
      modules={[Navigation]}
      slidesPerView={1}
      onSlideChange={() => console.log('slide change')}
      onSwiper={swiper => console.log(swiper)}
      className="flex h-full justify-center text-center"
    >
      <SwiperSlide>
        <Welcome />
      </SwiperSlide>
      <SwiperSlide>
        <OpenSenseMapLogin />
      </SwiperSlide>
      <SwiperSlide>
        <SelectDevice />
      </SwiperSlide>
      <SwiperSlide>
        <ConnectionSelection />
      </SwiperSlide>
    </Swiper>
  )
}
