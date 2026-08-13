import React, { useEffect, useState } from 'react';
import { Eye, Pencil, Trash2, Upload, AlertCircle, FileImage, CheckCircle2, X } from 'lucide-react';
import ImageDropdownItem from '../ui/ImageDropdownItem';
import axios from 'axios';
import { showSuccess, showError } from "../../utils/alert";

export default function MedicalImageUploader({ onClose, doctorId }) {
  const [images, setImages] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const MIN_IMAGES = 1;
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

  // Trigger hidden file input click when "editing"
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

  // Submit logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    
    if (images.length < MIN_IMAGES) {
      setError(`Minimum required images is ${MIN_IMAGES}. Please add ${MIN_IMAGES - images.length} more.`);
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      images.forEach((image) => formData.append("images", image.file));

      const response = await axios.post(`/api/mr/doctorDetailsUpload/${doctorId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (response.status === 200) {
        setImages([]);
        showSuccess(`Success! Submitting ${images.length} images to the Doctor's Portal.`);
        if (onClose) onClose();
      }
      setError('');
    } catch (error) {
      showError(error.message || "Something went wrong uploading files.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup object URLs to avoid memory leaks if component unmounts
      images.forEach(img => URL.revokeObjectURL(img.url));
    };
  }, []);

  return (
    <div className="relative w-full max-w-2xl mx-auto bg-white border border-slate-200/80 rounded-2xl md:rounded-3xl shadow-xl p-4 sm:p-6 md:p-8 space-y-5 md:space-y-6">
      
      {/* 1. HEADER SECTION */}
      <div className="relative border-b border-slate-100 pb-4 pr-10">
        <div className="flex items-start gap-2.5">
          <FileImage className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" />
          <div>
            <h2 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">
              Doctor's Image Upload Portal
            </h2>
            <p className="text-xs md:text-sm text-slate-500 mt-1 leading-relaxed">
              Please upload relevant prescription, diagnosis, or camp images. 
              <span className="font-semibold text-indigo-600 block sm:inline sm:ml-1">
                Requires between {MIN_IMAGES} to {MAX_IMAGES} images.
              </span>
            </p>
          </div>
        </div>

        {/* Global Close Button */}
        <button
          type="button"
          onClick={onClose || (() => console.log('Close clicked'))}
          className="absolute -top-1 -right-2 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-slate-200"
          aria-label="Close uploader"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 2. PROGRESS & METRICS WIDGET */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
        <div className="flex items-center gap-3">
          <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 transition-colors ${images.length >= MIN_IMAGES ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500 animate-pulse'}`} />
          <div>
            <p className="text-xs md:text-sm font-semibold text-slate-800">
              Uploaded: <span className="text-indigo-600">{images.length}</span> / {MAX_IMAGES}
            </p>
            <p className="text-xxs sm:text-xs text-slate-400 mt-0.5">
              {images.length < MIN_IMAGES 
                ? `Need ${MIN_IMAGES - images.length} more to meet minimum criteria.` 
                : "Minimum criteria fulfilled."
              }
            </p>
          </div>
        </div>
        
        {images.length >= MIN_IMAGES && (
          <span className="self-start sm:self-center flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5" /> Ready
          </span>
        )}
      </div>

      {/* 3. ERROR NOTIFICATION AREA */}
      {error && (
        <div className="flex items-start gap-2.5 p-3.5 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-xs md:text-sm font-medium transition-all animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* 4. DROPZONE AREA */}
      {images.length < MAX_IMAGES && (
        <label className="flex flex-col items-center justify-center w-full h-36 md:h-40 border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-slate-50/50 hover:bg-indigo-50/20 rounded-xl md:rounded-2xl cursor-pointer transition-all duration-200 group">
          <div className="flex flex-col items-center justify-center text-center p-4">
            <div className="p-2.5 bg-white shadow-sm group-hover:bg-indigo-50 rounded-full transition-colors mb-2.5">
              <Upload className="w-5 h-5 md:w-6 h-6 text-slate-400 group-hover:text-indigo-600" />
            </div>
            <p className="text-xs md:text-sm font-semibold text-slate-700">Click to upload doctor documents</p>
            <p className="text-xxs md:text-xs text-slate-400 mt-1">PNG, JPEG, or JPG (Max {MAX_IMAGES} items)</p>
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

      {/* 5. UPLOADED ITEMS SCROLL LIST */}
      {images.length > 0 && (
        <div className="space-y-2.5 max-h-64 sm:max-h-72 md:max-h-80 overflow-y-auto pr-1 custom-scrollbar">
          {images.map((img) => (
            <div key={img.id} className="relative group/item border border-slate-100 rounded-xl bg-white hover:border-slate-200 transition-all">
              <div className="pr-14">
                <ImageDropdownItem
                  name={img.name}
                  type={img.type}
                  size={img.size}
                  imageUrl={img.url}
                  onView={() => setPreviewImage(img)}
                  onEdit={() => handleEditTrigger(img.id)}
                />
              </div>
              
              {/* Context Action: Delete Overlay Trigger */}
              <button
                type="button"
                onClick={() => handleDelete(img.id, img.url)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors duration-150"
                title="Delete image"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              {/* Hidden file replacer input node */}
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

      {/* 6. FORM ACTIONS ACTION BLOCK */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={images.length < MIN_IMAGES || isLoading}
          className={`w-full py-3 md:py-3.5 font-semibold text-sm md:text-base rounded-xl text-center shadow-sm transition-all duration-200 ${
            images.length >= MIN_IMAGES && !isLoading
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer active:scale-[0.99]' 
              : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
          }`}
        >
          {isLoading ? 'Uploading Files...' : 'Submit Files to Doctor Portal'}
        </button>
      </div>

      {/* 7. MODAL PREVIEW OVERLAY */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-200"
          onClick={() => setPreviewImage(null)}
        >
          <div 
            className="relative max-w-3xl w-full bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Sub-Header */}
            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-slate-100 bg-slate-50">
              <div className="truncate pr-4">
                <p className="text-xs sm:text-sm font-bold text-slate-800 truncate">{previewImage.name}</p>
                <p className="text-xxs sm:text-xs text-slate-400 font-medium">{previewImage.type} • {previewImage.size}</p>
              </div>
              <button 
                onClick={() => setPreviewImage(null)}
                className="text-xs px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition-colors duration-150 whitespace-nowrap"
              >
                Close View
              </button>
            </div>
            {/* Modal Image Frame Container */}
            <div className="bg-slate-900 flex items-center justify-center p-2 sm:p-4 overflow-auto flex-1 architecture-canvas">
              <img 
                src={previewImage.url} 
                alt="Document Verification Preview" 
                className="max-w-full max-h-[55vh] md:max-h-[60vh] object-contain rounded shadow-lg"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}