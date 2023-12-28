"use client"
import { Button, Header } from "../../components"
import iconPersonalized from "../../images/iconPersonalized.png";
import groupImage from "../../images/groupImage.png"; 
import twentyFourSeven from "../../images/twentyfourseven.png";
import thumbsUp from "../../images/thumbsup.png";
import scholarImage from "../../images/scholarImage.png";
import dataDriven from "../../images/dataDriven.png";
import { TypeAnimation } from 'react-type-animation';



export default function Web() {
  return (
    <div>
      <Header />
      <main className="bg-[#E8EFFF]">
        <div className="border flex flex-col items-start justify-center overflow-hidden p-8 w-full">
          <h1 className="font-roboto text-4xl font-bold leading-tight tracking-tighter text-left my-4 w-full">AI-Powered Learning Tailored for You</h1>
          <h5 className="font-roboto text-xl font-normal leading-tight tracking-tighter text-left my-4 w-full text-gray-500">Meet SkillTensor, Your Personal Learning Sidekick! Smarter Studies Made Fun, Tailored Just for You.</h5>
          
          <div className="w-full">
            <input
              type="search"
              placeholder="Ask a question to start learning"
              aria-label="Search"
              className="w-full mt-2 px-4 py-2 border rounded-md"/>
            
            <button
              className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded-md">
              Begin Learning
            </button>

          </div>
        </div>
      </main>
            <div className="border flex flex-col items-start justify-center overflow-hidden p-8 w-full">
            <h2 className="text-4xl font-bold my-4 text-blue-600 py-8 w-full text-center">
              Not just a chatbot but a        
              <span style={{ fontSize: '.9em'}}>
                <TypeAnimation
                  sequence={[
                    ' Teacher',
                    2000,
                    ' Tutor',
                    2000,
                    ' Study Partner',
                    2000,
                    ' Wizard',
                    2000
                  ]}
                  wrapper="span"
                  speed={15}
                  repeat={Infinity}
                />
              </span>
            </h2>
          <h5 className="font-roboto text-l font-normal leading-tight tracking-tighter text-left my-4 w-full text-gray-500">Discover an interactive, personalized learning experience - more than just a chatbot, a dedicated AI tutor tailors lessons, solves problems, and guides you to subject mastery.</h5>

          <div className="flex flex-wrap justify-start gap-10"></div>
      </div>
      <div className="border flex flex-col items-start justify-center overflow-hidden p-8 w-full bg-[#E8EFFF]">
      <div className="w-full">
            <h2 className="text-4xl font-bold my-4 text-blue-600 py-8 w-full text-center">Why Skilltensor</h2>
            <div className="flex flex-wrap justify-start gap-10">
              {/* First Card */}
              <div className="w-[392px] h-auto bg-white p-6 border rounded-lg">
                <img src={iconPersonalized} alt="Personalized Learning" className="w-full" />
                <h1 className="text-blue-500 font-bold text-xl py-2">Personalized Learning</h1>
                <p>SkillTensor provides personalized learning, adapting to individual styles. Its AI tailors lessons to strengths, weaknesses, ensuring an engaging journey for each student's progress and success.</p>
              </div>
              {/* Second Card */}
              <div className="w-[392px] h-auto bg-white p-6 border rounded-lg">
              <img src={groupImage} alt="Engaging Learning" className="w-full" />
              <h1 className="text-blue-500 font-bold text-xl py-2">Engaging Learning Resources</h1>
                <p>SkillTensor sparks learning joy with interactive quizzes, engaging videos, and diverse exercises, crafting vibrant and effective learning journeys for every student's delight and growth.</p>
              </div>
              {/* Third Card */}
              <div className="w-[392px] h-auto bg-white p-6 border rounded-lg">
              <img src={scholarImage} alt="Empowering Education" className="w-full" />
              <h1 className="text-blue-500 font-bold text-xl py-2">Empowering Education</h1>
                <p>SkillTensor fosters confidence & independence in learning. Its interactive interface encourages curiosity, critical thinking, and problem-solving, helping students excel academically with joy.</p>
              </div>
              {/* Fourth Card */}
              <div className="w-[392px] h-auto bg-white p-6 border rounded-lg">
              <img src={thumbsUp} alt="Adaptive Feedback" className="w-full" />
              <h1 className="text-blue-500 font-bold text-xl py-2">Adaptive Feedback</h1>
                <p> SkillTensor tailors feedback to pinpoint improvement areas, ensuring targeted guidance for effective learning and skill enhancement.</p>
              </div>
              {/* Fifth Card */}
              <div className="w-[392px] h-auto bg-white p-6 border rounded-lg">
              <img src={twentyFourSeven} alt="24/7 Accessibility" className="w-full" />
              <h1 className="text-blue-500 font-bold text-xl py-2">24/7 Accessibility</h1>
                <p>With round-the-clock availability, SkillTensor enables flexible learning, accommodating diverse schedules and learning preferences for students.</p>
              </div>
              {/* Sixth Card */}
              <div className="w-[392px] h-auto bg-white p-6 border rounded-lg">
              <img src="/src/images/dataDriven.png" alt="Data-Driven Insights" className="w-full" />
              <h1 className="text-blue-500 font-bold text-xl py-2">Data-Driven Insights</h1>
                <p>SkillTensor provides detailed progress reports, aiding students and educators in tracking performance and optimizing learning strategies effectively</p>
              </div>
              </div>
              </div>
            </div>      
      <div className="border flex flex-col items-start justify-center overflow-hidden p-8 w-full">
          <h2 className="text-4xl font-bold my-4 text-blue-600 py-8 w-full text-center">FAQ</h2>
          <div className="flex flex-wrap justify-start gap-10"></div>
          <h5 className="font-roboto text-xl font-normal leading-tight tracking-tighter text-left w-full">Is SkillTensor Free?</h5>
          <h5 className="font-roboto text-l font-normal leading-tight tracking-tighter text-left my-4 w-full text-gray-500">SkillTensor is 100% Free</h5>
          <hr className="w-full bg-gray-500 my-4" />
          <h5 className="font-roboto text-xl font-normal leading-tight tracking-tighter text-left w-full">How does SkillTensor work?</h5>
          <h5 className="font-roboto text-l font-normal leading-tight tracking-tighter text-left my-4 w-full text-gray-500">SkillTensor is built on the Bittensor network, accessing decentralized LLMs to harness knowledge for everyone</h5>
          <hr className="w-full bg-gray-500 my-4" />
          <h5 className="font-roboto text-xl font-normal leading-tight tracking-tighter text-left w-full">What is Bittensor?</h5>
          <h5 className="font-roboto text-l font-normal leading-tight tracking-tighter text-left my-4 w-full text-gray-500">Bittensor is a decentralized AI platform that connects contributors globally to build AI applications.</h5>
      </div>
      <footer className="bg-blue-500 text-white w-full">
        <div className="container mx-auto text-center p-4">
          <div className="mb-4">
            <div className="text-4xl font-bold mb-2">S</div>
            <div className="text-2xl font-semibold mb-4">SKILLTENSOR</div>
            <div className="text-lg mb-4"><a href="/classes">Classes</a></div>
            <div className="text-lg mb-4"><a href="/faq">FAQ</a></div>
            <div className="text-lg mb-4"><a href="/about">About Us</a></div>
            <div className="text-lg mb-4"><a href="/contact">Contact Us</a></div>
          </div>
          <div className="flex justify-center space-x-4 mb-4">
          </div>
          <div className="text-sm mb-4">
            SkillTensor © {new Date().getFullYear()} ALL RIGHTS RESERVED
          </div>
          <div className="text-sm">
            <a href="/terms" className="hover:text-blue-200">TERMS & CONDITIONS</a> · <a href="/privacy" className="hover:text-blue-200">PRIVACY POLICY</a>
          </div>
        </div>
      </footer>
    </div>
  );
}