import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function QuantityInput({quantity, setQuantity}: {quantity: number; setQuantity: React.Dispatch<React.SetStateAction<number>>}) {

  const increment = () => {
    setQuantity(prev => prev + 1);
  };

  const decrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleInputChange = (e: { target: { value: string; }; }) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1) {
      setQuantity(value);
    }
  };

  return (
    <div className="flex items-center border mt-3 border-gray-200 rounded-sm w-fit bg-white">
      <Button
        onClick={decrement}
        disabled={quantity <= 1}
		variant="outline"
        className="flex items-center justify-center rounded-sm w-10 h-10 hover:bg-transparent hover:text-gray-600 transition-colors"
      >
        <Minus className="h-4 w-4" />
      </Button>

      <Input
        type="number"
        value={quantity}
        onChange={handleInputChange}
        min="1"
        className="w-12 h-10 text-center border-0 outline-none text-sm font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />

      <Button
        onClick={increment}
        className="flex items-center justify-center rounded-sm w-10 h-10 hover:bg-transparent hover:text-gray-600 transition-colors"
		variant="outline"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
