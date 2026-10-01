import { ArrowRight, ShieldCheck, Building2 } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Trust Banner - Anti Fraud Compliance */}
      <div className="bg-red-600 text-white text-sm font-semibold py-2 px-4 text-center flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4" />
        <span>100% Free for Candidates. We do NOT charge for interviews or visas. Beware of fake agents.</span>
      </div>

      {/* Navigation */}
      <nav className="border-b bg-white py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50">
        <div className="font-black text-2xl tracking-tighter text-slate-900">
          AVC<span className="text-blue-600">.</span>
        </div>
        <div className="hidden md:flex gap-8 font-semibold text-sm text-slate-600">
          <a href="#" className="hover:text-blue-600 transition-colors">For Candidates</a>
          <a href="#" className="hover:text-blue-600 transition-colors">For Employers</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Our Facility</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Trust Center</a>
        </div>
        <div className="flex gap-4">
          <button className="hidden sm:block text-slate-900 font-semibold text-sm px-4 py-2 hover:bg-slate-100 rounded-lg transition-colors">
            Employer Login
          </button>
          <button className="bg-blue-600 text-white font-semibold text-sm px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
            Register Free
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 md:py-32 bg-white relative overflow-hidden">
        
        {/* Background Decoration */}
        <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-blue-50 to-transparent -z-10" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 font-bold text-xs uppercase tracking-wide mb-8 border border-blue-100 shadow-sm">
          <Building2 className="w-4 h-4" />
          Govt. Registered MSME (UDYAM-BR-10-0047094)
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 max-w-5xl leading-tight">
          100% Free Trade Screening & <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Interview Coordination</span>
        </h1>
        
        <p className="mt-6 text-lg md:text-xl text-slate-600 max-w-2xl font-medium">
          Register once. Get trade-tested at our state-of-the-art Darbhanga facility. Connect with verified global employers safely and ethically.
        </p>
        
        {/* Primary CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button className="flex items-center justify-center gap-2 bg-blue-600 text-white font-bold text-lg px-8 py-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40">
            Register as Candidate <ArrowRight className="w-5 h-5" />
          </button>
          <button className="flex items-center justify-center gap-2 bg-white text-slate-800 border-2 border-slate-200 font-bold text-lg px-8 py-4 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all">
            Book Interview Venue
          </button>
        </div>

        {/* Quick Trust Statistics */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 border-t border-slate-100 pt-12 w-full max-w-4xl">
          <div className="flex flex-col items-center gap-1">
            <div className="text-4xl font-black text-slate-900">₹0</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2">Candidate Fees</div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="text-4xl font-black text-slate-900">5k+</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2">Pre-Screened</div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="text-4xl font-black text-slate-900">50+</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2">Trade Categories</div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="text-4xl font-black text-slate-900">100%</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2">Verified Clients</div>
          </div>
        </div>
      </section>
    </main>
  );
}
