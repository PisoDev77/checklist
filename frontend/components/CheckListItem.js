import { useState } from 'react';
import { BsFlagFill } from 'react-icons/bs';
import { BiCategory } from 'react-icons/bi';

const CheckListItem = ({ item, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(item.text);
  const [category, setCategory] = useState(item.category || '');
  const [priority, setPriority] = useState(item.priority || 'medium');

  const handleUpdate = () => {
    onUpdate({
      ...item,
      text: editedText,
      category: category,
      priority: priority,
    });
    setIsEditing(false);
  };

  const priorityConfig = {
    high: {
      color: 'text-green-800',
      bg: 'bg-green-100',
      label: '높음',
    },
    medium: {
      color: 'text-green-700',
      bg: 'bg-green-50',
      label: '중간',
    },
    low: {
      color: 'text-green-600',
      bg: 'bg-green-50',
      label: '낮음',
    },
  };

  return (
    <div className="flex flex-col p-3 border-b border-gray-200 w-full">
      <div className="flex items-start w-full">
        <input
          type="checkbox"
          checked={item.isCompleted}
          onChange={() => onUpdate({ ...item, isCompleted: !item.isCompleted })}
          className="mr-3 flex-shrink-0 mt-1"
        />
        <div className="flex-1 min-w-0 space-y-2">
          {isEditing ? (
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className="w-full border border-green-200 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="border border-green-200 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="general">일반</option>
                  <option value="others">기타</option>
                </select>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="border border-green-200 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="high">높음</option>
                  <option value="medium">중간</option>
                  <option value="low">낮음</option>
                </select>
                <button
                  onClick={handleUpdate}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
                >
                  저장
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <span
                className={`break-all ${
                  item.isCompleted
                    ? 'line-through text-green-600'
                    : 'text-green-900'
                }`}
              >
                {item.text}
              </span>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <span className="inline-flex text-sm bg-green-50 text-green-800 px-3 py-1 rounded-full border border-green-200">
                  {category || '카테고리 없음'}
                </span>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-green-700 hover:text-green-800 hover:bg-green-100 px-3 py-1 rounded-md transition-colors"
                >
                  수정
                </button>
                <button
                  onClick={() => onDelete(item._id)}
                  className="text-red-500 hover:text-red-700 px-3 py-1 rounded-md"
                >
                  삭제
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <div
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border border-green-200 ${priorityConfig[priority].bg}`}
            >
              <BsFlagFill className={`${priorityConfig[priority].color}`} />
              <span className={`${priorityConfig[priority].color} font-medium`}>
                {priorityConfig[priority].label}
              </span>
            </div>
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-50 text-green-800 border border-green-200">
              <BiCategory className="text-green-700" />
              <span className="font-medium">{category || '카테고리 없음'}</span>
            </div>
          </div>
        </div>
      </div>

      {item.description && (
        <p className="mt-2 ml-8 text-gray-600">{item.description}</p>
      )}
    </div>
  );
};

export default CheckListItem;
