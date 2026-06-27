import BreadCrumb from '@/components/common/BreadCrumb'
import HeaderThree from '@/layouts/headers/HeaderThree'
import React from 'react'
import ShopArea from './ShopArea'
import FooterSix from "@/layouts/footers/FooterSix";
import type { Product, ProductCategory } from "@/types/product";
import type { ProductListMeta } from "@/services/product.service";

const Shop = ({ products = [], categories = [], meta }: { products?: Product[]; categories?: ProductCategory[]; meta?: ProductListMeta }) => {
   return (
      <>
         <HeaderThree />
         <main>
            <BreadCrumb title="Cửa hàng golf" sub_title="Cửa hàng" />
            <ShopArea products={products} categories={categories} meta={meta} />
         </main>
         <FooterSix />
      </>
   )
}

export default Shop
