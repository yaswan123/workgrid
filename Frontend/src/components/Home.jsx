import { Link } from 'react-router-dom'
import { CheckCircle, Users, Shield, Zap } from 'lucide-react'
import landing from '../assets/landing.png'
import { useEffect, useRef } from 'react'
import ScrollTrigger from 'gsap/ScrollTrigger'
import gsap from 'gsap'
gsap.registerPlugin(ScrollTrigger)
function Home() {
  let scrollink = useRef(null)
  useEffect(() => {
    let items = scrollink.current.querySelectorAll('.scroll')
    gsap.fromTo(items,
      {x:-200, opacity:0},
      {x:0, opacity:1, duration:1.5, ease: 'power2.out', stagger: 0.5, scrollTrigger:{
        trigger: scrollink.current,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }}
    )
  },[])
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
      
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Manage Tasks with
            <span className="text-indigo-600"> Efficiency</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            WorkGrid helps you organize your work and life. Create tasks, manage projects,
            and collaborate with your team - all in one place.
          </p>
          <div className="flex justify-center flex-wrap gap-4">
            <Link
              to="/register"
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors text-lg font-medium"
            >
              Start for Free
            </Link>
            <a
              href="#features"
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors text-lg font-medium"
            >
              Learn More
            </a>
          </div>
          <div className="mt-16">
            <img
              src={landing}
              alt="WorkGrid Dashboard"
              className="rounded-lg shadow-2xl border border-gray-200"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need to stay organized
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              WorkGrid comes with all the features you need to manage your tasks effectively
              and boost your productivity.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8" ref={scrollink}>
            <div className="bg-gray-50 p-8 rounded-xl scroll">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                <CheckCircle className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Task Management
              </h3>
              <p className="text-gray-600">
                Create, organize, and track your tasks with ease. Set priorities, due dates,
                and never miss a deadline.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl scroll">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Project Groups
              </h3>
              <p className="text-gray-600">
                Organize tasks into groups for better project management. Keep everything
                structured and accessible.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl scroll">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                <Shield className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Secure & Reliable
              </h3>
              <p className="text-gray-600">
                Your data is always safe with us. We use industry-standard security
                measures to protect your information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text- mb-4">
            Ready to get started?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already managing their tasks more effectively
            with WorkGrid.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-black text-white hover:text-indigo-600 px-8 py-3 rounded-lg hover:bg-indigo-50 transition-colors text-lg font-medium"
          >
            Get Started Now
            <Zap className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home