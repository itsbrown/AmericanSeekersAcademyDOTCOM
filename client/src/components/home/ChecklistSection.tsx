import { CheckSquare } from "lucide-react";

const column1Items = [
  { id: 1, text: "Drop Off Co-op" },
  { id: 2, text: "Dress Code" },
  { id: 3, text: "No Masks Ever" },
  { id: 4, text: "Parent Approved" },
];

const column2Items = [
  { id: 5, text: "Half Day or Full-Day" },
  { id: 6, text: "Armed Security" },
  { id: 7, text: "Trained Teachers" },
  { id: 8, text: "Pledge of Allegiance" },
];

const column3Items = [
  { id: 9, text: "Progress Tracking" },
  { id: 10, text: "Medical Info NOT required" },
];

const ChecklistSection = () => {
  return (
    <section className="py-12 bg-[#1e3a5f] relative overflow-hidden" aria-label="Academy Features Checklist">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-16">
          <div className="flex flex-col gap-5">
            {column1Items.map((item) => (
              <div 
                key={item.id}
                className="flex items-center gap-3"
                data-testid={`checklist-item-${item.id}`}
              >
                <CheckSquare className="h-7 w-7 text-[hsl(38,75%,55%)] flex-shrink-0" strokeWidth={2.5} />
                <span className="text-white text-xl md:text-2xl font-semibold">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-5">
            {column2Items.map((item) => (
              <div 
                key={item.id}
                className="flex items-center gap-3"
                data-testid={`checklist-item-${item.id}`}
              >
                <CheckSquare className="h-7 w-7 text-[hsl(38,75%,55%)] flex-shrink-0" strokeWidth={2.5} />
                <span className="text-white text-xl md:text-2xl font-semibold">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-5">
            {column3Items.map((item) => (
              <div 
                key={item.id}
                className="flex items-center gap-3"
                data-testid={`checklist-item-${item.id}`}
              >
                <CheckSquare className="h-7 w-7 text-[hsl(38,75%,55%)] flex-shrink-0" strokeWidth={2.5} />
                <span className="text-white text-xl md:text-2xl font-semibold">
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
