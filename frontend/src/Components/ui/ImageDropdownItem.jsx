import React from 'react';
import { Eye, Pencil, Edit2 } from 'lucide-react';

// Ensure your ../ui/ImageDropdownItem component accepts these beautifully:
export default function ImageDropdownItem({ name, imageUrl, size, onView, onEdit }) {
  return (
    <div className="flex items-center justify-between p-2 gap-3 text-left">
      <div className="flex items-center gap-2.5 min-w-0">
        {/* Miniature Image Preview */}
        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 border border-gray-100 shrink-0">
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = "/placeholder-image.png"; }}
          />
        </div>
        
        {/* Meta Info */}
        <div className="min-w-0 flex flex-col">
          <p className="text-xs font-semibold text-gray-800 truncate max-w-[140px]">
            {name}
          </p>
          {size && (
            <p className="text-[10px] text-gray-400">
              {(size / 1024).toFixed(1)} KB
            </p>
          )}
        </div>
      </div>

      {/* Action Subgroup Buttons */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={onView}
          className="p-1.5 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition"
          title="View Image"
        >
          <Eye size={13} />
        </button>
        <button
          onClick={onEdit}
          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
          title="Edit Details"
        >
          <Edit2 size={13} />
        </button>
      </div>
    </div>
  );
}