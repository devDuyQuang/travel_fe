import BreadCrumb from '@/components/common/BreadCrumb'
import HeaderThree from '@/layouts/headers/HeaderThree'
import React from 'react'
import ShopArea from './ShopArea'
import FooterThree from "@/layouts/footers/FooterThree";

const Shop = () => {
   return (
      <>
         <HeaderThree />
         <main>
            <BreadCrumb title="Shop Page" sub_title="Shop Archive Page" />
            <ShopArea />
         </main>
         <FooterThree />
      </>
   )
}

export default Shop
