import { cn } from '@/lib/utils';
import React from 'react'

type ContentContainerProps = {
    children: React.ReactNode;
    className?: string;
};

const ContentContainer = ({ children, className }: ContentContainerProps) => {
    return (
       <div
          className={cn(
             "container flex flex-col gap-4 w-full mx-auto font-onest py-4 md:py-8 px-4",
             // Using Tailwind's container class which handles responsive padding
             className
          )}
       >
          {children}
       </div>
    );
};

export default ContentContainer