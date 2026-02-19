import { MainNav } from "@/components/navigation/main-nav"
import { Footer } from "@/components/navigation/footer"

export default function SizeGuidePage() {
  return (
    <div className="min-h-screen">
      <MainNav variant="solid" />
      <main className="max-w-4xl mx-auto px-4 py-20 sm:py-32 text-[#2C2420]">
        <h1 className="text-4xl font-serif mb-12">Size Guide</h1>
        
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-serif mb-6">Our Bag Categories</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E8E4DE]">
                    <th className="py-4 font-serif font-bold">Category</th>
                    <th className="py-4 font-serif font-bold">Typical Dimensions</th>
                    <th className="py-4 font-serif font-bold">Best For</th>
                  </tr>
                </thead>
                <tbody className="text-[#6B6560]">
                  <tr className="border-b border-[#E8E4DE]/50">
                    <td className="py-4 font-medium text-[#2C2420]">Mini Bags</td>
                    <td className="py-4">15cm x 12cm x 5cm</td>
                    <td className="py-4">Essentials: Phone, keys, lipstick</td>
                  </tr>
                  <tr className="border-b border-[#E8E4DE]/50">
                    <td className="py-4 font-medium text-[#2C2420]">Sling Bags</td>
                    <td className="py-4">22cm x 18cm x 7cm</td>
                    <td className="py-4">Daily use: Wallet, phone, small notebook</td>
                  </tr>
                  <tr className="border-b border-[#E8E4DE]/50">
                    <td className="py-4 font-medium text-[#2C2420]">Side Bags (Maxi)</td>
                    <td className="py-4">32cm x 26cm x 10cm</td>
                    <td className="py-4">Work/Travel: iPad, water bottle, makeup bag</td>
                  </tr>
                  <tr className="border-b border-[#E8E4DE]/50">
                    <td className="py-4 font-medium text-[#2C2420]">Cross Body</td>
                    <td className="py-4">25cm x 20cm x 8cm</td>
                    <td className="py-4">Versatile: All day comfort and space</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-serif mb-4">Finding Your Fit</h2>
            <div className="prose prose-stone text-[#6B6560]">
              <p>When selecting a bag, consider your daily carry and how you prefer to wear it. Most of our bags feature adjustable straps to ensure a perfect fit for any body type.</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong>Strap Length:</strong> Our standard adjustable straps range from 100cm to 130cm.</li>
                <li><strong>Weight:</strong> Being genuine leather, our bags have a premium feel but are designed to be comfortable for all-day wear.</li>
              </ul>
            </div>
          </section>

          <section className="border-t border-[#E8E4DE] pt-8">
            <p className="text-sm text-[#6B6560]">Still unsure? Contact us for more detailed measurements of a specific piece.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
