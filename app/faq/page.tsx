import { MainNav } from "@/components/navigation/main-nav"
import { Footer } from "@/components/navigation/footer"

export default function FAQPage() {
  return (
    <div className="min-h-screen">
      <MainNav variant="solid" />
      <main className="max-w-4xl mx-auto px-4 py-20 sm:py-32">
        <div className="prose prose-stone max-w-none">
          <h1 className="text-4xl font-serif mb-8 text-[#2C2420]">SULHA AFRIKA</h1>
          <h2 id="terms" className="text-2xl font-serif mb-12 text-[#2C2420] scroll-mt-24">TERMS AND CONDITIONS OF SALE AND PARTICIPATION</h2>
          <p className="text-sm text-[#6B6560] mb-8">Effective Date: 29th -July-2025</p>

          <section className="mb-12">
            <h3 className="text-xl font-serif font-bold text-[#2C2420] mb-4">1. DEFINITIONS AND INTERPRETATION</h3>
            <p className="text-[#6B6560]">1.1. In these Terms and Conditions (“Terms”), unless the context otherwise requires:</p>
            <ul className="list-disc pl-6 space-y-2 text-[#6B6560]">
              <li>“Sulha Afrika”, “we”, “us”, or “our” refers to the entity offering goods and/or services under this agreement;</li>
              <li>“Customer”, “you”, or “your” refers to the purchaser or participant in any of our products or events;</li>
              <li>“Products” refers to goods available for sale through Sulha Afrika;</li>
              <li>“Events” refers to organized experiences, sessions, or activities hosted or facilitated by Sulha Afrika.</li>
            </ul>
          </section>

          <section className="mb-12">
            <h3 className="text-xl font-serif font-bold text-[#2C2420] mb-4">2. ACCEPTANCE OF TERMS</h3>
            <p className="text-[#6B6560]">2.1. By purchasing any Products, Event tickets, or engaging with our services, the Customer expressly agrees to be bound by these Terms.</p>
            <p className="text-[#6B6560]">2.2. Failure or refusal to accept these Terms shall render any transaction or participation void.</p>
          </section>

          <section className="mb-12">
            <h3 className="text-xl font-serif font-bold text-[#2C2420] mb-4">3. PRODUCT SALES AND SHIPPING</h3>
            <p className="text-[#6B6560]">3.1. All Products are shipped via independent third-party courier services.</p>
            <p className="text-[#6B6560]">3.2. Sulha Afrika shall bear no responsibility for delivery delays, misdeliveries, or losses once goods have been dispatched.</p>
            <p className="text-[#6B6560]">3.3. Any damages must be reported, with supporting evidence, within forty-eight (48) hours of delivery.</p>
            <p className="text-[#6B6560]">3.4. Products shall not be returned on the basis of change of mind. Returns shall only be entertained where a defect exists and is duly reported within forty-eight (48) hours of receipt.</p>
          </section>

          <section className="mb-12">
            <h3 className="text-xl font-serif font-bold text-[#2C2420] mb-4">4. EVENT PARTICIPATION TERMS</h3>
            <p className="text-[#6B6560]">4.1. All ticket purchases for Events are final. No refunds shall be issued for non-attendance, conflicting personal schedules, or force majeure events including but not limited to adverse weather conditions.</p>
            <p className="text-[#6B6560]">4.2. Event activities shall be confined strictly to what is advertised. Unauthorized or unsafe behavior (including swimming, climbing, or similar) is prohibited and may result in removal without compensation.</p>
            <p className="text-[#6B6560]">4.3. Sulha Afrika accepts no liability for personal belongings lost, misplaced, or stolen during any Event.</p>
          </section>

          <section className="mb-12">
            <h3 className="text-xl font-serif font-bold text-[#2C2420] mb-4">5. THIRD-PARTY LIABILITY</h3>
            <p className="text-[#6B6560]">5.1. Vendors participating in Events, including but not limited to food providers, operate independently and are solely responsible for their products and services. Sulha Afrika disclaims liability for food allergies, food poisoning, or dissatisfaction with vendor services.</p>
            <p className="text-[#6B6560]">5.2. Any complaints or claims related to courier services must be addressed directly to the relevant shipping provider.</p>
          </section>

          <section className="mb-12">
            <h3 className="text-xl font-serif font-bold text-[#2C2420] mb-4">6. LIMITATION OF LIABILITY</h3>
            <p className="text-[#6B6560]">6.1. To the fullest extent permitted by law, Sulha Afrika shall not be liable for:</p>
            <ul className="list-alpha pl-6 space-y-2 text-[#6B6560]">
              <li>(a) Any injury or loss arising from breach of event rules or Customer misconduct;</li>
              <li>(b) Any act or omission of third-party vendors or shippers;</li>
              <li>(c) Any consequential, indirect, or special damages, including loss of profit.</li>
            </ul>
            <p className="text-[#6B6560]">6.2. This clause shall not apply to liability arising from our gross negligence or willful misconduct.</p>
          </section>

          <section className="mb-12">
            <h3 className="text-xl font-serif font-bold text-[#2C2420] mb-4">7. DATA PROTECTION AND MEDIA RELEASE</h3>
            <p className="text-[#6B6560]">7.1. Sulha Afrika complies with the Data Protection Act of Kenya (2019) and any applicable data privacy laws. Personal data collected shall be used solely for internal administrative purposes and shall not be shared or sold without express consent.</p>
            <p className="text-[#6B6560]">7.2. By participating in our Events, you grant Sulha Afrika an irrevocable, worldwide, royalty-free license to capture, use, and disseminate your image in any media for promotional or commercial purposes, unless you provide written notice of objection at least seven (7) days prior to the Event date.</p>
          </section>

          <section className="mb-12">
            <h3 className="text-xl font-serif font-bold text-[#2C2420] mb-4">8. MISCELLANEOUS</h3>
            <p className="text-[#6B6560]">8.1. These Terms may be amended from time to time without prior notice. It is the responsibility of the Customer to review the most current version available at www.sulhaafrika.com/terms.</p>
            <p className="text-[#6B6560]">8.2. These Terms and any disputes arising hereunder shall be governed and construed in accordance with the laws of the Republic of Kenya. The courts of Nairobi shall have exclusive jurisdiction over any disputes.</p>
            <p className="text-[#6B6560]">8.3. For all legal or operational correspondence, please contact:</p>
            <ul className="list-none pl-0 space-y-2 text-[#6B6560]">
              <li>Email: info@sulhaafrika.com</li>
              <li>Phone: +254794015756</li>
            </ul>
          </section>

          <section className="mb-12 border-t border-[#E8E4DE] pt-8">
            <h3 className="text-xl font-serif font-bold text-[#2C2420] mb-4">9. ACKNOWLEDGMENT</h3>
            <p className="text-[#6B6560]">By completing a transaction or attending an Event, the Customer acknowledges and affirms that they have read, understood, and accepted these Terms and Conditions in full.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
