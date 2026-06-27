"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import type { ProductCategory } from "@/types/product";

const ShopSidebar = ({ categories = [] }: { categories?: ProductCategory[] }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");

  const buildHref = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    params.delete("page");
    return params.toString() ? `/cua-hang?${params.toString()}` : "/cua-hang";
  };

  return (
    <div className="col-xl-3 col-lg-4">
      <div className="tg-shop-sidebar top-sticky mb-50">
        <div className="tg-blog-sidebar-search tg-blog-sidebar-box mb-40">
          <h5 className="tg-blog-sidebar-title mb-15">Tìm kiếm</h5>
          <div className="tg-blog-sidebar-form">
            <form onSubmit={(e) => {
              e.preventDefault();
              router.push(buildHref({ search: searchQuery.trim() || null }));
            }} className="p-relative">
              <input
                className="input"
                type="text"
                placeholder="Nhập từ khóa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" aria-label="Tìm kiếm sản phẩm">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_497_1336_shop)">
                    <path d="M17 17L13.5247 13.5247M15.681 8.3405C15.681 12.3945 12.3945 15.681 8.3405 15.681C4.28645 15.681 1 12.3945 1 8.3405C1 4.28645 4.28645 1 8.3405 1C12.3945 1 15.681 4.28645 15.681 8.3405Z" stroke="#e6c770" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                  <defs><clipPath id="clip0_497_1336_shop"><rect width="18" height="18" fill="white" /></clipPath></defs>
                </svg>
              </button>
            </form>
          </div>
        </div>
        {categories.length > 0 && (
          <div className="tg-blog-categories tg-blog-sidebar-box mb-40">
            <h5 className="tg-blog-sidebar-title mb-5">Danh mục</h5>
            <div className="tg-blog-categories-list">
              <ul>
                <li><Link href={buildHref({ category: null })}><span>Tất cả danh mục</span></Link></li>
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link href={buildHref({ category: category.slug })}><span>{category.name}</span></Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopSidebar;
