import React, { useState } from 'react';
import { Eye, Pencil, Trash2, Upload, AlertCircle, FileImage, CheckCircle2, X } from 'lucide-react';
import ImageDropdownItem from '../ui/ImageDropdownItem';
import { showSuccess, showError } from "../../utils/alert";

// Added onClose prop so you can wire it to hide the component entirely if needed
export default function MedicalImageUploader({ onClose }) {
  const [images, setImages] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState('');

  const MIN_IMAGES = 4;
  const MAX_IMAGES = 7;

  // Handle File Selection
  const handleFileChange = (e) => {
    setError('');
    const files = Array.from(e.target.files);
    
    if (images.length + files.length > MAX_IMAGES) {
      setError(`You can only upload a maximum of ${MAX_IMAGES} images.`);
      return;
    }

    const validImages = files.map(file => {
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
      return {
        id: crypto.randomUUID(),
        name: file.name,
        size: `${sizeInMB} MB`,
        type: file.type.split('/')[1].toUpperCase(),
        url: URL.createObjectURL(file),
        file: file
      };
    });

    setImages(prev => [...prev, ...validImages]);
  };

  // Delete an Image
  const handleDelete = (id, url) => {
    setError('');
    setImages(prev => prev.filter(img => img.id !== id));
    URL.revokeObjectURL(url);
    if (previewImage?.id === id) setPreviewImage(null);
  };

  // Trigger file hidden file input click when "editing"
  const handleEditTrigger = (id) => {
    const input = document.getElementById(`replace-input-${id}`);
    if (input) input.click();
  };

  // Replace an existing image
  const handleReplaceImage = (id, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
    
    setImages(prev => prev.map(img => {
      if (img.id === id) {
        URL.revokeObjectURL(img.url);
        return {
          id: img.id,
          name: file.name,
          size: `${sizeInMB} MB`,
          type: file.type.split('/')[1].toUpperCase(),
          url: URL.createObjectURL(file),
          file: file
        };
      }
      return img;
    }));
  };

  // Final validation logic for submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (images.length < MIN_IMAGES) {
      setError(`Minimum required images is ${MIN_IMAGES}. Please add ${MIN_IMAGES - images.length} more.`);
      return;
    }
    
    setError('');
    alert(`Success! Submitting ${images.length} images to the Doctor's Portal.`);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto p-6 bg-white border border-slate-200/80 rounded-3xl shadow-xl space-y-6">
      
      {/* Main Close Button (Top Right) */}
      <button
        type="button"
        onClick={onClose || (() => console.log('Close clicked'))}
        className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-slate-200"
        aria-label="Close uploader"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Header Info Banner for MRs */}
      <div className="border-b border-slate-100 pb-4 pr-8">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <FileImage className="w-5 h-5 text-indigo-600" />
          Doctor's Image Upload Portal
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Please upload relevant prescription, diagnosis, or camp images. 
          <span className="font-semibold text-indigo-600"> Requires between 4 to 7 images.</span>
        </p>
      </div>

      {/* Progress & Validation Status Widget */}
      <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
        <div className="flex items-center gap-3">
          <div className={`w-2.5 h-2.5 rounded-full transition-colors ${images.length >= MIN_IMAGES ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500 animate-pulse'}`} />
          <div>
            <p className="text-sm font-semibold text-slate-800">
              Uploaded: <span className="text-indigo-600">{images.length}</span> / {MAX_IMAGES}
            </p>
            <p className="text-xs text-slate-400">
              {images.length < MIN_IMAGES ? `Need ${MIN_IMAGES - images.length} more to meet minimum criteria.` : "Minimum criteria fulfilled."}
            </p>
          </div>
        </div>
        {images.length >= MIN_IMAGES && (
          <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5" /> Ready
          </span>
        )}
      </div>

      {/* Error Messaging Banner */}
      {error && (
        <div className="flex items-center gap-2.5 p-3.5 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-sm font-medium">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Dropzone Area */}
      {images.length < MAX_IMAGES && (
        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-slate-50/50 hover:bg-indigo-50/20 rounded-2xl cursor-pointer transition-all duration-200 group">
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
            <div className="p-3 bg-white shadow-sm group-hover:bg-indigo-50 rounded-full transition-colors mb-3">
              <Upload className="w-6 h-6 text-slate-400 group-hover:text-indigo-600" />
            </div>
            <p className="text-sm font-semibold text-slate-700">Click to upload doctor documents</p>
            <p className="text-xs text-slate-400 mt-1">PNG, JPEG, or JPG (Max {MAX_IMAGES} items)</p>
          </div>
          <input 
            type="file" 
            className="hidden" 
            multiple 
            accept="image/*" 
            onChange={handleFileChange} 
          />
        </label>
      )}

      {/* List Container for Uploaded Items */}
      {images.length > 0 && (
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {images.map((img) => (
            <div key={img.id} className="relative">
              <ImageDropdownItem
                name={img.name}
                type={img.type}
                size={img.size}
                imageUrl={img.url}
                onView={() => setPreviewImage(img)}
                onEdit={() => handleEditTrigger(img.id)}
              />
              
              {/* Extra Danger Button */}
              <button
                type="button"
                onClick={() => handleDelete(img.id, img.url)}
                className="absolute pr-3 mr-4 right-14 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors duration-150"
                title="Delete image"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              {/* Hidden file replacer input */}
              <input 
                id={`replace-input-${img.id}`}
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={(e) => handleReplaceImage(img.id, e)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Submit Button Block */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={images.length < MIN_IMAGES}
        className={`w-full py-3.5 font-semibold rounded-xl text-center shadow-md transition-all duration-200 ${
          images.length >= MIN_IMAGES 
            ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer active:scale-[0.99]' 
            : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
        }`}
      >
        Submit Files to Doctor Portal
      </button>

      {/* --- USER FRIENDLY PREVIEW MODAL --- */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          onClick={() => setPreviewImage(null)}
        >
          <div 
            className="relative max-w-3xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
              <div className="truncate pr-4">
                <p className="text-sm font-bold text-slate-800 truncate">{previewImage.name}</p>
                <p className="text-xs text-slate-400 font-medium">{previewImage.type} • {previewImage.size}</p>
              </div>
              <button 
                onClick={() => setPreviewImage(null)}
                className="text-sm px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition-colors duration-150"
              >
                Close View
              </button>
            </div>
            {/* Image Body wrapper */}
            <div className="bg-slate-900 flex items-center justify-center p-2 overflow-auto flex-1">
              <img 
                src={previewImage.url} 
                alt="Document Verification Preview" 
                className="max-w-full max-h-[60vh] object-contain rounded shadow"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}