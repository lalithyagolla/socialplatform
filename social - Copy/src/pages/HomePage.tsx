import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, BookText, Award, Users } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Discover, Learn, and Grow Together
          </h1>
          <p className="text-xl mb-8">
            Join our community of lifelong learners to discover curated educational content,
            earn rewards for your engagement, and connect with like-minded individuals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-3 bg-white text-orange-600 font-medium rounded-lg hover:bg-gray-100 transition-colors duration-300"
            >
              Join the Community
            </Link>
            <Link
              to="/feed"
              className="px-8 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors duration-300"
            >
              Explore Content
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">How LearnHub Works</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our platform connects you with valuable content while rewarding your participation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow duration-300">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Discover Content</h3>
            <p className="text-gray-600">
              Access curated content from Twitter, Reddit, and LinkedIn, all in one place.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow duration-300">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Earn Points</h3>
            <p className="text-gray-600">
              Get rewarded with credit points for engaging with content and contributing to the community.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow duration-300">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookText className="h-8 w-8 text-yellow-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Premium Access</h3>
            <p className="text-gray-600">
              Use your earned points to unlock premium resources, courses, and exclusive events.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow duration-300">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Join Community</h3>
            <p className="text-gray-600">
              Connect with like-minded learners, share insights, and grow together.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 bg-gray-50 rounded-2xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">What Our Users Say</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of satisfied learners on our platform
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-orange-200 flex items-center justify-center text-orange-600 font-bold text-xl">
                JS
              </div>
              <div className="ml-4">
                <h4 className="font-semibold">Jessica Smith</h4>
                <p className="text-sm text-gray-500">Software Developer</p>
              </div>
            </div>
            <p className="text-gray-600">
              "LearnHub has transformed how I stay updated with the latest tech trends. The curated content saves me hours of browsing, and I love earning points while learning!"
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-green-200 flex items-center justify-center text-green-600 font-bold text-xl">
                MJ
              </div>
              <div className="ml-4">
                <h4 className="font-semibold">Michael Johnson</h4>
                <p className="text-sm text-gray-500">Digital Marketer</p>
              </div>
            </div>
            <p className="text-gray-600">
              "The variety of content from different platforms all in one place is incredible. I've discovered so many valuable resources I would have missed otherwise."
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-yellow-200 flex items-center justify-center text-yellow-600 font-bold text-xl">
                AT
              </div>
              <div className="ml-4">
                <h4 className="font-semibold">Aisha Thompson</h4>
                <p className="text-sm text-gray-500">UX Designer</p>
              </div>
            </div>
            <p className="text-gray-600">
              "I love how the points system rewards engagement. It motivates me to interact more with the content and community, creating a truly unique learning experience."
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl text-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to join our learning community?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Sign up today and start earning points while discovering valuable educational content.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/register"
            className="px-8 py-3 bg-white text-green-600 font-medium rounded-lg hover:bg-gray-100 transition-colors duration-300"
          >
            Get Started for Free
          </Link>
          <Link
            to="/feed"
            className="px-8 py-3 border border-white text-white font-medium rounded-lg hover:bg-green-600 transition-colors duration-300"
          >
            Explore Content
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;