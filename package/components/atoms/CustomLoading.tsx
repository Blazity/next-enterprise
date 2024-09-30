'use client';
import { CircularProgress } from '@mui/material';
import * as RadixTooltip from '@radix-ui/react-tooltip';
import React from 'react';

const CustomLoading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      <CircularProgress
        size={60}
        thickness={4}
        className="text-blue-600 animate-spin"
      />

      <RadixTooltip.Provider>
        <RadixTooltip.Root>
          <RadixTooltip.Trigger asChild>
            <div className="text-gray-600 font-semibold text-lg cursor-pointer">
              Loading, please wait...
            </div>
          </RadixTooltip.Trigger>
          <RadixTooltip.Portal>
            <RadixTooltip.Content
              side="top"
              sideOffset={5}
              className="bg-gray-800 text-white rounded-md p-2 shadow-md text-sm"
            >
              Fetching data from the server. This may take a moment.
              <RadixTooltip.Arrow className="fill-gray-800" />
            </RadixTooltip.Content>
          </RadixTooltip.Portal>
        </RadixTooltip.Root>
      </RadixTooltip.Provider>

      {/* Tailwind CSS animation for visual effect */}
      <div className="relative mt-2">
        <div className="size-16 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
      </div>
    </div>
  );
};

export default CustomLoading;
