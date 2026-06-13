import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Code, Palette, Megaphone, User, Plus } from 'lucide-react';
import { useTodos } from '../context/TodoContext';

export default function CategoriesPage() {
  const { todos, categories, setIsAddCategoryOpen } = useTodos();
  const [searchCategoriesQuery, setSearchCategoriesQuery] = useState('');

  const renderCategoryIcon = (iconStr, colorClass) => {
    const defaultStyle = "w-5 h-5";
    let iconColor = "text-[#68dbae]";
    if (colorClass === 'secondary') iconColor = "text-purple-400";
    if (colorClass === 'tertiary') iconColor = "text-amber-400";
    if (colorClass === 'outline') iconColor = "text-blue-400";

    switch (iconStr) {
      case 'Code':
        return <Code className={`${defaultStyle} ${iconColor}`} />;
      case 'Palette':
        return <Palette className={`${defaultStyle} ${iconColor}`} />;
      case 'Megaphone':
        return <Megaphone className={`${defaultStyle} ${iconColor}`} />;
      case 'User':
      default:
        return <User className={`${defaultStyle} ${iconColor}`} />;
    }
  };

  const getCategoryMetrics = (catId) => {
    const catTasks = todos.filter((t) => t.category === catId);
    const completed = catTasks.filter((t) => t.completed).length;
    const highPriority = catTasks.filter((t) => t.priority === 'high' && !t.completed).length;
    const progressPercent = catTasks.length === 0 ? 0 : Math.round((completed / catTasks.length) * 100);

    return {
      total: catTasks.length,
      completed,
      highPriority,
      percent: progressPercent
    };
  };

  // Filter Categories Grid
  const filteredCategories = categories.filter((cat) => {
    if (searchCategoriesQuery.trim() !== '') {
      return cat.name.toLowerCase().includes(searchCategoriesQuery.toLowerCase());
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Row */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Categories</h2>
        <p className="text-xs md:text-sm text-[#bccac1]">Organize your productivity workflows</p>
      </div>

      {/* Categories search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
        <input 
          type="text" 
          placeholder="Search categories..."
          value={searchCategoriesQuery}
          onChange={(e) => setSearchCategoriesQuery(e.target.value)}
          className="w-full bg-[#1A1A1A] border border-[#2A2A2A] text-sm text-[#e5e2e1] rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:border-[#1D9E75] transition-colors placeholder-gray-500"
        />
      </div>

      {/* Grid Layout of Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredCategories.map((cat) => {
          const metrics = getCategoryMetrics(cat.id);
          return (
            <Link 
              key={cat.id}
              to={`/categories/${cat.id}`}
              className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-5 flex flex-col justify-between hover:border-[#1D9E75]/40 transition-all cursor-pointer group"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#2a2a2a] flex items-center justify-center">
                      {renderCategoryIcon(cat.icon, cat.color)}
                    </div>
                    <div>
                      <h3 className="font-bold text-[#e5e2e1] text-base group-hover:text-[#68dbae] transition-colors">
                        {cat.name}
                      </h3>
                      <span className="text-xs text-[#bccac1]">{metrics.total} Tasks</span>
                    </div>
                  </div>

                  {/* Priority Status tag */}
                  {cat.status && (
                    <span className="bg-[#bccac1]/10 text-[#bccac1] px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider">
                      {cat.status}
                    </span>
                  )}
                </div>
              </div>

              {/* Progress Bar inside categories */}
              <div className="mt-4">
                <div className="flex justify-between items-center text-[11px] text-[#bccac1]/80 mb-1.5">
                  <span>Workspace Progress</span>
                  <span className="font-semibold text-[#68dbae]">{metrics.percent}%</span>
                </div>
                <div className="w-full bg-[#2A2A2A] rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-[#1D9E75] h-full rounded-full transition-all duration-500" 
                    style={{ width: `${metrics.percent}%` }}
                  />
                </div>
              </div>
            </Link>
          );
        })}

        {/* Create Category button card */}
        <button 
          type="button"
          onClick={() => setIsAddCategoryOpen(true)}
          className="bg-transparent border-2 border-dashed border-[#2A2A2A] rounded-xl p-5 flex flex-col justify-center items-center gap-3 hover:border-[#1D9E75] hover:bg-[#1A1A1A]/40 transition-all group min-h-[148px] cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center group-hover:bg-[#1D9E75] group-hover:border-[#1D9E75] transition-all">
            <Plus className="text-gray-400 group-hover:text-white w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-[#bccac1] group-hover:text-white transition-all">
            Create Custom Category
          </span>
        </button>
      </div>
    </div>
  );
}
