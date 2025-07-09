import React from "react";
import {
  Accordion,
  AccordionContent as Content,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const AccordionContent = ({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: React.ReactNode;
}) => {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value={value}>
        <AccordionTrigger>{title}</AccordionTrigger>
        <Content className='whitespace-pre-line text-sm text-zinc-700 leading-relaxed'>{description}</Content>
      </AccordionItem>
    </Accordion>
  );
};

export default AccordionContent;
