import { CheckSquare } from "lucide-react";

const leftColumnItems = [
  { id: 1, text: "Drop Off Co-op" },
  { id: 2, text: "Half Day or Full-Day" },
  { id: 3, text: "Dress Code" },
  { id: 4, text: "Armed Security" },
  { id: 5, text: "No Masks Ever" },
];

const rightColumnItems = [
  { id: 6, text: "Trained Teachers" },
  { id: 7, text: "Progress Tracking" },
  { id: 8, text: "Parent Approved" },
  { id: 9, text: "Pledge of Allegiance" },
  { id: 10, text: "Medical Info NOT required" },
];

const ChecklistSection = () => {
  return (
    <section className="py-12 bg-[#1e3a5f] relative overflow-hidden" aria-label="Academy Features Checklist">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-24">
          <div className="flex flex-col gap-4">
            {leftColumnItems.map((item) => (
              <div 
                key={item.id}
                className="flex items-center gap-3"
                data-testid={`checklist-item-${item.id}`}
              >
                <CheckSquare className="h-6 w-6 text-white flex-shrink-0" strokeWidth={2.5} />
                <span className="text-white text-lg md:text-xl font-medium">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-4">
            {rightColumnItems.map((item) => (
              <div 
                key={item.id}
                className="flex items-center gap-3"
                data-testid={`checklist-item-${item.id}`}
              >
                <CheckSquare className="h-6 w-6 text-white flex-shrink-0" strokeWidth={2.5} />
                <span className="text-white text-lg md:text-xl font-medium">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChecklistSection;
