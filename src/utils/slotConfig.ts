export const baseColors = [
	"green", "red", "black", "red", "black", "red", "black", "red", "black", 
	"red", "black", "red", "black", "red", "black"
  ];
  
export const baseNumbers = Array.from({ length: 15 }, (_, i) => i);
  
export const slotWidth = 80;
export const visibleSlots = 11;
export const centerSlot = Math.floor(visibleSlots / 2);
export const repeatCount = 15;
export const safeLoopZone = baseNumbers.length * 2;
  
export const buildSlotArray = () => {
	const result: number[] = [];
	for (let i = 0; i < repeatCount; i++) {
	  result.push(...baseNumbers);
	}
	return result;
};
