import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/common/components/shadcn/accordion'; //
import DraggableTechStackItem from './DraggableTechStackItem'; // 기존 아이템 컴포넌트
import { TECH_STACK_GROUPS } from '../../constant/techStackInfo'; //

export function TechStackAccordionList() {
  return (
    <Accordion type="multiple" className="w-full">
      {TECH_STACK_GROUPS.map((group) => (
        <AccordionItem key={group.title} value={group.title}>
          <AccordionTrigger className="text-foreground text-xl font-bold">
            {group.title}
          </AccordionTrigger>
          <AccordionContent>
            <Accordion type="multiple" className="pl-4">
              {Object.entries(group.categoryMap).map(([catKey, catName]) => {
                const filteredItems = group.items.filter(
                  (item) => item.category === catKey,
                );

                if (filteredItems.length === 0) return null;

                return (
                  <AccordionItem
                    key={catKey}
                    value={catKey}
                    className="border-none"
                  >
                    <AccordionTrigger className="text-foreground py-2 text-sm font-semibold">
                      {catName}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {filteredItems.map((item) => (
                          <DraggableTechStackItem key={item.id} {...item} />
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
