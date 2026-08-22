import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, Building2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '../../utils/cn';

export const CompanyLogoUpload = ({
  value,
  onChange,
  error,
  className = '',
  label = 'Company Logo',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      toast.error('Only PNG, JPG, and JPEG image files are accepted.');
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Logo file size must be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      onChange(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={cn('flex flex-col gap-1.5 w-full', className)}>
      {label && (
        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
          {label}
        </label>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative cursor-pointer border-2 border-dashed rounded-xl p-4 transition-all flex flex-col items-center justify-center gap-2 bg-slate-50/50 hover:bg-slate-50',
          isDragging ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-300 hover:border-slate-400',
          error ? 'border-rose-500 bg-rose-50/30' : '',
          value ? 'p-3 border-solid border-indigo-200 bg-indigo-50/20' : ''
        )}
      >
        {value ? (
          <div className="flex items-center justify-between w-full gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg border border-slate-200 bg-white p-1 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                <img src={value} alt="Company Logo Preview" className="max-w-full max-h-full object-contain" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  Company Logo Uploaded
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                </p>
                <p className="text-[11px] text-slate-500">Click or drag new image to replace</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title="Remove logo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="text-center py-2 space-y-1.5">
            <div className="w-10 h-10 mx-auto rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-700">
                <span className="text-indigo-600 font-semibold">Click to upload</span> or drag and drop logo
              </p>
              <p className="text-[11px] text-slate-400">Supports PNG, JPG, or JPEG (Max 5MB)</p>
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-rose-600 mt-0.5">{error}</p>}
    </div>
  );
};
