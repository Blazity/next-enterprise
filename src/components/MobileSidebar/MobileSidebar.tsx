import { Button, IconButton } from "../"
import {
  XMarkIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  LightBulbIcon,
  RocketLaunchIcon,
  QuestionMarkCircleIcon,
  ChatBubbleLeftIcon,
} from "@heroicons/react/24/outline"

export const MobileSidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => (
  <div
    className={`fixed inset-0 z-50 bg-gray-600 bg-opacity-75 transition-opacity ${
      isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
    }`}
    onClick={onClose}
  >
    <div
      className={`transform transition-transform ease-in-out ${
        isOpen ? "translate-x-0 duration-500" : "-translate-x-full duration-500"
      }`}
    >
      {/* Add your sidebar content here */}
      <div className="h-screen w-64 flex-col bg-blue-500 p-4">
        {/* Sidebar content goes here */}
        <div className="flex items-center justify-between">
          <h1 className="test-lg font-['Bienetresocial'] font-normal uppercase leading-5 text-white">SKILLTENSOR</h1>
          <IconButton onClick={onClose} variant="light">
            <XMarkIcon className="h-8 w-8" />
          </IconButton>
        </div>
        <div className="mt-12 flex flex-col gap-8">
          <Button variant="ghost" className="flex justify-start text-white">
            <HomeIcon className="mr-2 h-4 w-4" />
            <p>Home</p>
          </Button>
          <Button variant="ghost" className="flex hidden justify-start text-white">
            <MagnifyingGlassIcon className="mr-2 h-4 w-4" />
            <p>Topics</p>
          </Button>
          <Button variant="ghost" className="flex hidden justify-start text-white">
            <LightBulbIcon className="mr-2 h-4 w-4" />
            <p>Why Us</p>
          </Button>
          <Button variant="ghost" className="flex hidden justify-start text-white">
            <RocketLaunchIcon className="mr-2 h-4 w-4" />
            <p>Features</p>
          </Button>
          <Button variant="ghost" className="flex hidden justify-start text-white">
            <QuestionMarkCircleIcon className="mr-2 h-4 w-4" />
            <p>FAQs</p>
          </Button>
          <Button variant="ghost" className="flex justify-start text-white">
            <ChatBubbleLeftIcon className="mr-2 h-4 w-4" />
            <p>ChatBot</p>
          </Button>
        </div>
      </div>
    </div>
  </div>
)

export default MobileSidebar
