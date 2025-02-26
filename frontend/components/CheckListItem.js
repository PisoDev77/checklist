import { useState } from 'react';
import { BsFlagFill } from 'react-icons/bs';
import { BiCategory } from 'react-icons/bi';

const CheckListItem = ({ item, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(item.title);

  const handleCheck = async () => {
    onUpdate(item._id, { checked: !item.checked });
  };

  const handleEdit = async () => {
    if (isEditing) {
      await onUpdate(item._id, { title: editedTitle });
    }
    setIsEditing(!isEditing);
  };

  const priorityConfig = {
    high: {
      color: 'text-red-600',
      bg: 'bg-red-50',
      label: '높음',
    },
    medium: {
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
      label: '중간',
    },
    low: {
      color: 'text-green-600',
      bg: 'bg-green-50',
      label: '낮음',
    },
  };

  return (
    <div className="flex flex-col p-4 border rounded-lg mb-2 hover:bg-green-50">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={item.checked}
          onChange={handleCheck}
          className="h-5 w-5 accent-green-600 rounded border-green-300"
        />
        <span
          className={`ml-3 flex-1 ${
            item.checked ? 'line-through text-green-400' : 'text-green-800'
          }`}
        >
          {isEditing ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="border border-green-300 p-1 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          ) : (
            item.title
          )}
        </span>
        <div className="flex gap-2">
          <button
            onClick={handleEdit}
            className="text-green-600 hover:text-green-800 px-3 py-1 rounded-md hover:bg-green-100"
          >
            {isEditing ? '저장' : '수정'}
          </button>
          <button
            onClick={() => onDelete(item._id)}
            className="text-green-600 hover:text-green-800 px-3 py-1 rounded-md hover:bg-green-100"
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
          className={`flex items-center gap-1 px-2 py-1 rounded-full ${
            priorityConfig[item.priority].bg
          }`}
        >
          <BsFlagFill className={`${priorityConfig[item.priority].color}`} />
          <span className={`${priorityConfig[item.priority].color}`}>
            {priorityConfig[item.priority].label}
          </span>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 text-green-600">
          <BiCategory />
          <span>{item.category}</span>
        </div>
      </div>
    </div>
  );
};

export default CheckListItem;
