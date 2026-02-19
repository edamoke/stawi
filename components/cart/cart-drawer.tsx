"use client"

import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalItems, totalPrice } = useCart()

  const formatPrice = (price: number) => {
    return `KSh ${price.toLocaleString()}`
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50 transition-opacity" onClick={closeCart} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E8E4DE]">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-[#C9A86C]" />
            <h2 className="text-lg font-serif text-[#2C2420]">Your Bag ({totalItems})</h2>
          </div>
          <button onClick={closeCart} className="p-2 hover:bg-[#FAF8F5] rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 rounded-full bg-[#FAF8F5] flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8 text-[#C9A86C]" />
              </div>
              <h3 className="font-serif text-lg text-[#2C2420] mb-2">Your bag is empty</h3>
              <p className="text-sm text-[#6B6560] mb-6">Discover our beautiful collection and add items to your bag</p>
              <Button onClick={closeCart} className="bg-[#C9A86C] hover:bg-[#B8975B] text-white" asChild>
                <Link href="/our-collection">Shop Now</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative w-24 h-32 rounded-lg overflow-hidden bg-[#FAF8F5] flex-shrink-0">
                    <Image src={item.image_url || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-[#2C2420] truncate">{item.name}</h4>
                    <p className="text-sm text-[#C9A86C] font-medium mt-1">{formatPrice(item.price)}</p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center border border-[#E8E4DE] rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 hover:bg-[#FAF8F5] transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-[#FAF8F5] transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[#E8E4DE] p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[#6B6560]">Subtotal</span>
              <span className="font-serif text-lg text-[#2C2420]">{formatPrice(totalPrice)}</span>
            </div>
            <p className="text-xs text-[#8B8178]">Shipping and taxes calculated at checkout</p>
            <Button className="w-full py-6 bg-[#C9A86C] hover:bg-[#B8975B] text-white text-sm tracking-wider" asChild>
              <Link href="/checkout" onClick={closeCart}>
                PROCEED TO CHECKOUT
              </Link>
            </Button>
            <Button variant="outline" className="w-full py-5 bg-transparent" onClick={closeCart}>
              Continue Shopping
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
