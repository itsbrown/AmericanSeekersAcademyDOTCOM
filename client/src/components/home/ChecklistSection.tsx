import { CheckSquare } from "lucide-react";

const checklistItems = [
  { id: 1, text: "Drop Off Co-op" },
  { id: 2, text: "Trained Teachers" },
  { id: 3, text: "Half Day or Full-Day" },
  { id: 4, text: "Progress Tracking" },
  { id: 5, text: "Dress Code" },
  { id: 6, text: "Parent Approved" },
  { id: 7, text: "Armed Security" },
  { id: 8, text: "Pledge of Allegiance" },
  { id: 9, text: "No Masks Ever" },
  { id: 10, text: "Medical Info NOT required" },
];

const ChecklistSection = () => {
  return (
    <section className="py-12 bg-[#1e3a5f] relative overflow-hidden" aria-label="Academy Features Checklist">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4">
          {checklistItems.map((item) => (
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
    </section>
  );
};

export default ChecklistSection;
