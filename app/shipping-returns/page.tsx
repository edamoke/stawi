import { MainNav } from "@/components/navigation/main-nav"
import { Footer } from "@/components/navigation/footer"

export default function ShippingReturnsPage() {
  return (
    <div className="min-h-screen">
      <MainNav variant="solid" />
      <main className="max-w-4xl mx-auto px-4 py-20 sm:py-32 text-[#2C2420]">
        <h1 className="text-4xl font-serif mb-12">Shipping & Returns</h1>
        
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-serif mb-4">Shipping Information</h2>
            <div className="prose prose-stone text-[#6B6560]">
              <p>All Stawi AFRIKA products are handcrafted with care and shipped from our workshop in Nairobi, Kenya. We partner with reliable independent courier services to ensure your items reach you safely.</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong>Local Delivery (Nairobi):</strong> 1-2 business days</li>
                <li><strong>Regional Delivery (Kenya):</strong> 3-5 business days</li>
                <li><strong>International Shipping:</strong> 7-14 business days depending on destination</li>
              </ul>
              <p className="mt-4 italic">Please note: Stawi Afrika shall bear no responsibility for delivery delays, misdeliveries, or losses once goods have been dispatched to the courier service.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-serif mb-4">Returns Policy</h2>
            <div className="prose prose-stone text-[#6B6560]">
              <p>We take great pride in the quality of our craftsmanship. Please review our return conditions below:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong>Defective Items:</strong> Returns are only entertained where a manufacturing defect exists and is duly reported within forty-eight (48) hours of receipt.</li>
                <li><strong>Supporting Evidence:</strong> Any damages or defects must be reported with supporting photographic evidence within 48 hours of delivery.</li>
                <li><strong>Change of Mind:</strong> Products shall not be returned on the basis of change of mind.</li>
                <li><strong>Final Sale:</strong> Event tickets are final sale and non-refundable.</li>
              </ul>
            </div>
          </section>

          <section className="border-t border-[#E8E4DE] pt-8">
            <p className="text-sm text-[#6B6560]">For any inquiries regarding your order, please contact us at <a href="mailto:info@Stawiafrika.com" className="underline hover:text-[#C9A86C]">info@Stawiafrika.com</a></p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
