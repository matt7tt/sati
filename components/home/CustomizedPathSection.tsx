export default function CustomizedPathSection() {
  return (
    <div className="bg-[#f8f5f2] py-16">
      <div className="container max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Customized path
        </h2>
        <p className="text-gray-700 mb-10 text-sm">
          It's your custom treatment plan, at your pace.
        </p>
        
        {/* Step 1 */}
        <div className="border-t border-gray-300 py-5 grid grid-cols-12 gap-6">
          <div className="col-span-1">
            <div className="text-3xl font-bold text-gray-800">01</div>
          </div>
          <div className="col-span-11 md:col-span-8">
            <p className="text-gray-700 text-sm leading-relaxed">
              Sign up for your BioRenewal™ Renewal Plan to receive unlimited provider consultations, lab sample kits, shipping on treatments, and self-guided coaching.
            </p>
          </div>
        </div>
        
        {/* Step 2 */}
        <div className="border-t border-gray-300 py-5 grid grid-cols-12 gap-6">
          <div className="col-span-1">
            <div className="text-3xl font-bold text-gray-800">02</div>
          </div>
          <div className="col-span-11 md:col-span-8">
            <p className="text-gray-700 text-sm leading-relaxed">
              Plot your longevity journey and talk about your health factors, history and goals.
            </p>
          </div>
        </div>
        
        {/* Step 3 */}
        <div className="border-t border-gray-300 py-5 grid grid-cols-12 gap-6">
          <div className="col-span-1">
            <div className="text-3xl font-bold text-gray-800">03</div>
          </div>
          <div className="col-span-11 md:col-span-8">
            <p className="text-gray-700 text-sm leading-relaxed">
              A Kwilt™ doctor will review your profile and prescribe treatment if it's a good match for you. Support starts on your first visit—no delay.
            </p>
          </div>
        </div>
        
        {/* Step 4 */}
        <div className="border-t border-gray-300 py-5 grid grid-cols-12 gap-6">
          <div className="col-span-1">
            <div className="text-3xl font-bold text-gray-800">04</div>
          </div>
          <div className="col-span-11 md:col-span-8">
            <p className="text-gray-700 text-sm leading-relaxed">
              Track your progress over time on your own with monthly check-ins and no paperwork.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 