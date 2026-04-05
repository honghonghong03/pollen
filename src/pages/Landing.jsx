import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Repeat, BarChart3, Shield, Gift, Trophy, Users } from 'lucide-react';

function FeatureCard({ icon: Icon, title, description, color }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      <h3 className="font-semibold text-soil text-sm mb-1">{title}</h3>
      <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}

function Step({ number, title, description, emoji }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="w-10 h-10 rounded-full bg-honey/15 border-2 border-honey flex items-center justify-center text-lg shrink-0">
        {emoji}
      </div>
      <div>
        <h3 className="font-semibold text-soil text-sm">{title}</h3>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
    </div>
  );
}

function StatCard({ value, label }) {
  return (
    <div className="text-center">
      <p className="text-2xl font-bold text-honey">{value}</p>
      <p className="text-xs text-gray-400">{label}</p>
    </div>
  );
}

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh bg-petal">
      {/* Nav */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-3xl mx-auto flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <svg width="28" height="28" viewBox="0 0 32 32" className="shrink-0">
              <circle cx="16" cy="16" r="4" fill="#F2A623"/>
              <circle cx="16" cy="6" r="2.5" fill="#E8C44A"/>
              <circle cx="24.5" cy="11" r="2.5" fill="#E8C44A"/>
              <circle cx="24.5" cy="21" r="2.5" fill="#E8C44A"/>
              <circle cx="16" cy="26" r="2.5" fill="#E8C44A"/>
              <circle cx="7.5" cy="21" r="2.5" fill="#E8C44A"/>
              <circle cx="7.5" cy="11" r="2.5" fill="#E8C44A"/>
            </svg>
            <span className="font-bold text-soil text-lg">Pollen</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/login')} className="text-sm font-medium text-gray-500 hover:text-soil px-3 py-1.5">
              Log in
            </button>
            <button onClick={() => navigate('/signup')} className="bg-honey text-white text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-honey-light transition-colors">
              Sign up free
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4">
        {/* Hero */}
        <section className="py-16 text-center">
          <div className="inline-flex items-center gap-1.5 bg-stem/10 text-stem text-xs font-semibold px-3 py-1 rounded-full mb-6">
            <CheckCircle2 size={12} /> Free to use &middot; No credit card needed
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-soil leading-tight mb-4">
            Give answers.<br />
            <span className="text-honey">Get answers.</span>
          </h1>

          <p className="text-base text-gray-500 max-w-md mx-auto mb-8 leading-relaxed">
            Pollen is a survey exchange platform. Earn credits by answering surveys, then use them to get your own surveys answered. No cost, no spam.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-8">
            <button
              onClick={() => navigate('/signup')}
              className="bg-honey text-white font-semibold px-8 py-3 rounded-xl text-base hover:bg-honey-light transition-colors flex items-center gap-2 shadow-lg shadow-honey/20"
            >
              Get started free <ArrowRight size={18} />
            </button>
            <button
              onClick={() => navigate('/feed')}
              className="text-gray-500 font-medium px-6 py-3 text-sm hover:text-soil transition-colors"
            >
              Browse surveys first
            </button>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-8 pt-4">
            <StatCard value="15" label="Free credits on signup" />
            <div className="w-px h-8 bg-gray-200" />
            <StatCard value="5" label="Question types" />
            <div className="w-px h-8 bg-gray-200" />
            <StatCard value="$0" label="Forever free" />
          </div>
        </section>

        {/* Preview mockup */}
        <section className="pb-16">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-stem flex items-center justify-center text-white text-xs font-bold">P</div>
                <div>
                  <p className="text-xs font-semibold text-soil">Consumer Trust in AI Products</p>
                  <p className="text-[10px] text-gray-400">10 min &middot; 75 responses needed</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-stem/10 text-stem text-[10px] font-semibold">10 cr</span>
            </div>
            <p className="text-[11px] text-gray-500 mb-3">How do consumers feel about AI-powered products? Exploring trust, adoption, and expectations.</p>
            <div className="flex gap-1.5 mb-3">
              <span className="px-1.5 py-0.5 rounded bg-petal-dark text-soil-light text-[9px]">Technology</span>
              <span className="px-1.5 py-0.5 rounded bg-petal-dark text-soil-light text-[9px]">Business</span>
              <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 text-[9px] font-semibold">Profile match</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="w-full bg-gray-100 rounded-full h-1">
                  <div className="bg-stem rounded-full h-1 w-[16%]" />
                </div>
                <p className="text-[9px] text-gray-400 mt-0.5">12/75 responses</p>
              </div>
              <div className="bg-honey text-white text-[10px] font-semibold px-3 py-1.5 rounded-lg">Take survey</div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="pb-16">
          <h2 className="text-2xl font-bold text-soil text-center mb-2">How it works</h2>
          <p className="text-sm text-gray-400 text-center mb-8">Three simple steps to start exchanging surveys</p>

          <div className="max-w-sm mx-auto space-y-6">
            <Step emoji="📝" title="Answer surveys" description="Browse the feed and answer surveys that interest you. Each one earns you credits based on the time it takes." />
            <div className="flex justify-center">
              <Repeat size={16} className="text-honey" />
            </div>
            <Step emoji="📊" title="Create your own survey" description="Build surveys with 5 question types right in the app. Set your target audience and hit publish." />
            <div className="flex justify-center">
              <Repeat size={16} className="text-honey" />
            </div>
            <Step emoji="🎁" title="Earn rewards" description="Climb the leaderboard, unlock achievements, and redeem your credits for gift cards and rewards." />
          </div>
        </section>

        {/* Features */}
        <section className="pb-16">
          <h2 className="text-2xl font-bold text-soil text-center mb-2">Why Pollen?</h2>
          <p className="text-sm text-gray-400 text-center mb-8">Built for students, founders, and researchers</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <FeatureCard icon={Shield} title="Built-in surveys" description="Create questions directly in Pollen. No external links needed. Verified completions only." color="bg-stem" />
            <FeatureCard icon={BarChart3} title="Real-time analytics" description="See responses as they come in with charts, ratings, and text analysis." color="bg-honey" />
            <FeatureCard icon={Users} title="Smart targeting" description="Reach the right audience with demographic filters. Age, country, education, and more." color="bg-purple-500" />
            <FeatureCard icon={Trophy} title="Leaderboards" description="Compete with other respondents. Climb from Seedling to Honeycomb level." color="bg-terracotta" />
            <FeatureCard icon={Gift} title="Real rewards" description="Redeem credits for gift cards, stickers, and donations to student research." color="bg-honey" />
            <FeatureCard icon={CheckCircle2} title="Quality control" description="Trust scores ensure high-quality responses. No more throwaway answers." color="bg-stem" />
          </div>
        </section>

        {/* CTA */}
        <section className="pb-20">
          <div className="bg-soil rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Ready to start?</h2>
            <p className="text-sm text-gray-400 mb-6">Join Pollen and get 15 free credits instantly.</p>
            <button
              onClick={() => navigate('/signup')}
              className="bg-honey text-white font-semibold px-8 py-3 rounded-xl text-base hover:bg-honey-light transition-colors shadow-lg shadow-honey/20"
            >
              Create free account
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-200 py-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <svg width="20" height="20" viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="4" fill="#F2A623"/>
              <circle cx="16" cy="6" r="2.5" fill="#E8C44A"/>
              <circle cx="24.5" cy="11" r="2.5" fill="#E8C44A"/>
              <circle cx="24.5" cy="21" r="2.5" fill="#E8C44A"/>
              <circle cx="16" cy="26" r="2.5" fill="#E8C44A"/>
              <circle cx="7.5" cy="21" r="2.5" fill="#E8C44A"/>
              <circle cx="7.5" cy="11" r="2.5" fill="#E8C44A"/>
            </svg>
            <span className="font-bold text-soil text-sm">Pollen</span>
          </div>
          <p className="text-xs text-gray-400">Give answers. Get answers.</p>
        </footer>
      </div>
    </div>
  );
}
