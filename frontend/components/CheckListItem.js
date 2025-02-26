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
    <div className="flex flex-col p-4 border border-green-200 rounded-lg mb-2 hover:bg-green-50">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={item.isCompleted}
          onChange={() => onUpdate({ ...item, isCompleted: !item.isCompleted })}
          className="h-5 w-5 accent-green-600 rounded border-green-300"
        />
        <span
          className={`ml-3 flex-1 ${
            item.isCompleted ? 'line-through text-green-400' : 'text-green-800'
          }`}
        >
          {isEditing ? (
            <div className="flex items-center gap-2 flex-grow">
              <input
                type="text"
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className="flex-grow border border-green-200 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-24 border border-green-200 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="general">일반</option>
                <option value="others">기타</option>
              </select>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-20 border border-green-200 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
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
          ) : (
            <div className="flex flex-grow items-center gap-4">
              <span
                className={`text-green-900 ${
                  item.isCompleted ? 'line-through text-green-600' : ''
                }`}
              >
                {item.text}
              </span>
              <span className="text-sm bg-green-50 text-green-800 px-3 py-1 rounded-full border border-green-200">
                {category || '카테고리 없음'}
              </span>
              <button
                onClick={() => setIsEditing(true)}
                className="text-green-700 hover:text-green-800 hover:bg-green-100 px-3 py-1 rounded-md transition-colors"
              >
                수정
              </button>
            </div>
          )}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => onDelete(item._id)}
            className="ml-auto text-green-700 hover:text-green-800 hover:bg-green-100 px-3 py-1 rounded-md transition-colors"
          >
            삭제
          </button>
        </div>
      </div>

      {item.description && (
        <p className="mt-2 ml-8 text-gray-600">{item.description}</p>
      )}

      <div className="mt-3 ml-8 flex items-center gap-4 text-sm">
        <div
          className={`flex items-center gap-1 px-3 py-1 rounded-full border border-green-200 ${priorityConfig[priority].bg}`}
        >
          <BsFlagFill className={`${priorityConfig[priority].color}`} />
          <span className={`${priorityConfig[priority].color} font-medium`}>
            {priorityConfig[priority].label}
          </span>
        </div>
        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-50 text-green-800 border border-green-200">
          <BiCategory className="text-green-700" />
          <span className="font-medium">{category || '카테고리 없음'}</span>
        </div>
      </div>
    </div>
  );
};

export default CheckListItem;
