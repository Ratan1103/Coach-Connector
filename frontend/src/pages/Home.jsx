// src/pages/Homepage.jsx
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Search, Users, CheckCircle2, MessageCircle } from "lucide-react";
import HeroSlider from "../components/Image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-900">
      {/* Navbar */}
      <header className="flex items-center justify-between px-10 py-4 shadow-sm bg-white sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 text-white px-3 py-1 rounded-full font-bold">
            🎯
          </div>
          <h1 className="text-xl font-bold text-gray-900">CoachConnect</h1>
        </div>
        <nav className="hidden md:flex gap-6 font-medium">
          <a href="#features" className="hover:text-blue-600">Features</a>
          <a href="#how" className="hover:text-blue-600">How It Works</a>
          <a href="#about" className="hover:text-blue-600">About</a>
        </nav>
        <div className="flex gap-3">
          <Button variant="ghost" to='/login'>Login</Button>
          <Button className="bg-blue-600 hover:bg-blue-700">Get Started →</Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-center px-6 py-16 max-w-4xl mx-auto">
        <motion.span 
          className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          ⭐ India’s Premier Coaching Platform
        </motion.span>
        <h2 className="text-4xl md:text-5xl font-bold mt-6">
          Bridge the Gap Between <span className="text-blue-600">Coaches</span> & <span className="text-orange-500">Athletes</span>
        </h2>
        <br></br>
        <HeroSlider />
        <p className="text-lg text-gray-600 mt-4">
          Connect with skilled coaches across India or find dedicated athletes ready to train. 
          Your journey to excellence starts here.
        </p>
        <div className="flex justify-center gap-4 mt-8">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-lg" to="/register/coach">Join as Coach</Button>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 text-lg" to="/register/athlete">Find a Coach</Button>
        </div>
        <div className="flex justify-center gap-10 mt-10 text-gray-700">
          <p>🏆 <span className="font-semibold">500+</span> Expert Coaches</p>
          <p>👟 <span className="font-semibold">2000+</span> Active Athletes</p>
        </div>
      </section>
      {/* How It Works Section */}
      <section id="how" className="py-20 bg-white">
        <h3 className="text-3xl font-bold text-center mb-12">
          How <span className="text-blue-600">CoachConnect</span> Works
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 px-6 max-w-6xl mx-auto">
          {[
            { step: "Sign Up", desc: "Create your profile as a coach or athlete with relevant details", icon: Users },
            { step: "Discover & Connect", desc: "Athletes browse coaches by sport and location", icon: Search },
            { step: "Send Request", desc: "Athletes send connection requests to their preferred coaches", icon: MessageCircle },
            { step: "Get Matched", desc: "Coaches accept requests from suitable athletes", icon: CheckCircle2 },
            { step: "Start Training", desc: "Once matched, both parties can communicate & begin training", icon: MessageCircle },
          ].map((item, i) => (
            <motion.div 
              key={i}
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
            >
              <Card className="p-6 shadow-md rounded-2xl hover:shadow-lg transition">
                <item.icon className="w-10 h-10 text-blue-600 mx-auto mb-4" />
                <CardContent>
                  <h4 className="font-semibold text-lg">{item.step}</h4>
                  <p className="text-gray-600 text-sm mt-2">{item.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-gray-50 text-center">
        <h3 className="text-3xl font-bold mb-6">Ready to Get Started?</h3>
        <p className="text-lg text-gray-600 mb-8">
          Join thousands of coaches and athletes already using <span className="text-blue-600 font-semibold">CoachConnect</span> to achieve their goals.
        </p>
        <div className="flex justify-center gap-6">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-lg">Join as Coach</Button>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 text-lg">Find Your Coach</Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 text-center py-6">
        <p>© {new Date().getFullYear()} CoachConnect. All rights reserved.</p>
      </footer>
    </div>
  );
}
