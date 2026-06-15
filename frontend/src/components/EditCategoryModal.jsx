import React, { useState, useEffect } from 'react';
import { X, Code, Palette, Megaphone, User } from 'lucide-react';
import { useTodos } from '../context/TodoContext';

export default function EditCategoryModal() {
  const {
    updateCategory,
    editCategoryData,
    isEditCategoryOpen,
    setIsEditCategoryOpen,
    setEditCategoryData
  } = useTodos();

  const [categoryName, setCategoryName] = useState('');
  const [categoryColor, setCategoryColor] = useState('primary');
  const [categoryIcon, setCategoryIcon] = useState('Code');

  // Pre-fill form when editCategoryData changes and modal opens
  useEffect(() => {
    if (isEditCategoryOpen && editCategoryData) {
      setCategoryName(editCategoryData.name || '');
      setCategoryColor(editCategoryData.color || 'primary');
      setCategoryIcon(editCategoryData.icon || 'Code');
    }
  }, [isEditCategoryOpen, editCategoryData]);

  if (!isEditCategoryOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      alert('Please specify a Category name!');
      return;
    }

    updateCategory(editCategoryData.id, {
      name: categoryName,
      color: categoryColor,
      icon: categoryIcon,
      description: editCategoryData.description || 'Custom category workspace',
    });

    setCategoryName('');
  };

  const handleClose = () => {
    setIsEditCategoryOpen(false);
    setEditCategoryData(null);
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl w-full max-w-[420px] flex flex-col shadow-2xl overflow-hidden">

        {/* Modal Header */}
        <div className="flex justify-between items-center p-5 border-b border-[#2A2A2A]">
          <h2 className="text-base font-bold text-white">Edit Category</h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-[#bccac1] hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit}>
          <div className="p-5 flex flex-col gap-4">

            {/* Category Name */}
            <div>
              <label className="block text-xs font-semibold text-[#bccac1] mb-1.5" htmlFor="edit-modal-cat-name">
                Category Name <span className="text-[#ef4444] font-bold">*</span>
              </label>
              <input
                type="text"
                id="edit-modal-cat-name"
                required
                autoFocus
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="e.g. Personal, Design, Marketing"
                className="w-full bg-[#111] border border-[#2A2A2A] rounded-lg py-2 px-3 text-sm text-[#e5e2e1] focus:outline-none focus:border-[#1D9E75] placeholder-gray-600 transition-colors"
              />
            </div>

            {/* Color Scheme Picker */}
            <div>
              <label className="block text-xs font-semibold text-[#bccac1] mb-1.5">Color System</label>
              <div className="flex gap-3">
                {['primary', 'secondary', 'tertiary', 'outline'].map((color) => {
                  let bgColor = 'bg-[#1D9E75]';
                  if (color === 'secondary') bgColor = 'bg-purple-500';
                  if (color === 'tertiary') bgColor = 'bg-amber-500';
                  if (color === 'outline') bgColor = 'bg-blue-500';

                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setCategoryColor(color)}
                      className={`w-6 h-6 rounded-full ${bgColor} transition-transform ${
                        categoryColor === color ? 'scale-125 ring-2 ring-white/50' : 'opacity-80'
                      }`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Icon Picker options */}
            <div>
              <label className="block text-xs font-semibold text-[#bccac1] mb-1.5">Select Icon Representation</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { name: 'Code', icon: <Code className="w-4 h-4" /> },
                  { name: 'Palette', icon: <Palette className="w-4 h-4" /> },
                  { name: 'Megaphone', icon: <Megaphone className="w-4 h-4" /> },
                  { name: 'User', icon: <User className="w-4 h-4" /> }
                ].map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setCategoryIcon(item.name)}
                    className={`py-2 rounded-lg border text-xs flex justify-center items-center gap-1.5 ${
                      categoryIcon === item.name
                        ? 'border-[#1D9E75] bg-[#1D9E75]/10 text-[#68dbae]'
                        : 'border-[#2A2A2A] text-[#bccac1] hover:bg-[#2A2A2A]'
                    }`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Modal Footer */}
          <div className="p-5 border-t border-[#2A2A2A] flex justify-end gap-3 bg-[#131313]">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2 rounded-full border border-[#2A2A2A] text-xs font-semibold text-[#e5e2e1] hover:bg-[#2A2A2A] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-full bg-[#1D9E75] hover:bg-[#15825F] text-white font-semibold text-xs transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}