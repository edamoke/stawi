import { MainNav } from "@/components/navigation/main-nav"
import { Footer } from "@/components/navigation/footer"

export default function CareGuidePage() {
  return (
    <div className="min-h-screen">
      <MainNav variant="solid" />
      <main className="max-w-4xl mx-auto px-4 py-20 sm:py-32 text-[#2C2420]">
        <h1 className="text-4xl font-serif mb-12">Product Care Guide</h1>
        
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-serif mb-4">Leather Care</h2>
            <div className="prose prose-stone text-[#6B6560]">
              <p>Our Ngozi Collection is made from premium African leather that develops a beautiful patina over time. To ensure your piece lasts for generations, follow these care instructions:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong>Cleaning:</strong> Wipe with a soft, dry cloth to remove dust and surface dirt. For deeper cleaning, use a damp cloth with mild leather cleaner.</li>
                <li><strong>Conditioning:</strong> Apply a high-quality leather conditioner every 6-12 months to keep the leather supple and prevent cracking.</li>
                <li><strong>Moisture:</strong> Keep your bag away from water and extreme humidity. If it gets wet, pat dry immediately and let it air dry naturally (away from direct heat).</li>
                <li><strong>Storage:</strong> Store your bag in its original dust bag when not in use. Stuff it lightly with tissue paper to maintain its shape.</li>
                <li><strong>Sunlight:</strong> Avoid prolonged exposure to direct sunlight, which can cause the leather to fade or dry out.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-serif mb-4">Metal Hardware</h2>
            <div className="prose prose-stone text-[#6B6560]">
              <p>Our hardware is selected for its durability and aesthetic. To keep it looking its best:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Avoid contact with perfumes, lotions, and harsh chemicals.</li>
                <li>Buff occasionally with a dry microfiber cloth to maintain shine.</li>
              </ul>
            </div>
          </section>

          <section className="border-t border-[#E8E4DE] pt-8">
            <p className="text-sm text-[#6B6560]">With proper care, your SULHA AFRIKA piece will tell your story for many years to come.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
