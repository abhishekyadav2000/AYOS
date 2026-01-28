'use client';

import React, { useState } from 'react';
import { ShoppingBag, ExternalLink, Star } from 'lucide-react';
import { storeConfig } from '@/config/content';

export function StoreApp() {
  const [selectedProduct, setSelectedProduct] = useState<typeof storeConfig[0] | null>(
    storeConfig[0] || null
  );

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-xl rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-b border-white/10 p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-white">🛍️ Store</h1>
          <p className="text-xs text-gray-400">Digital products & services</p>
        </div>
        <button className="px-3 py-1 text-xs rounded bg-white/10 hover:bg-white/20 text-white">
          ✕
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        {/* Products grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto pr-2">
          {storeConfig.map((product) => (
            <div
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className={`border border-white/10 rounded-lg p-4 cursor-pointer hover:bg-white/10 transition ${
                selectedProduct?.id === product.id
                  ? 'bg-white/20 ring-2 ring-purple-400'
                  : 'bg-black/20'
              }`}
            >
              {/* Category tag */}
              <div className="text-xs font-semibold text-purple-300 mb-2">
                {product.category}
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-white mb-2">{product.title}</h3>

              {/* Description */}
              <p className="text-sm text-gray-300 mb-4">{product.description}</p>

              {/* Price & Rating */}
              <div className="flex justify-between items-center">
                <div className="text-lg font-bold text-cyan-400">${product.price}</div>
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-xs text-gray-400">4.8</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Product details panel */}
        {selectedProduct && (
          <div className="w-80 border border-white/10 rounded-lg bg-black/30 flex flex-col overflow-hidden">
            {/* Product image area */}
            <div className="h-40 bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border-b border-white/10">
              <div className="text-5xl">📦</div>
            </div>

            {/* Product info */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div>
                <div className="text-xs font-semibold text-purple-300 uppercase tracking-wide">
                  {selectedProduct.category}
                </div>
                <h2 className="text-2xl font-bold text-white mt-1">
                  {selectedProduct.title}
                </h2>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2">
                <div className="text-3xl font-bold text-cyan-400">
                  ${selectedProduct.price}
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={
                        i < 4
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-600'
                      }
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-400">
                  4.8 (24 reviews)
                </span>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold text-white/80 mb-2">
                  Description
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {selectedProduct.description}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="border-t border-white/10 p-4 space-y-2">
              <button className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold text-sm transition">
                Add to Cart
              </button>
              <button className="w-full px-4 py-2 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold text-sm transition flex items-center justify-center gap-2">
                <ExternalLink size={14} />
                Learn More
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
