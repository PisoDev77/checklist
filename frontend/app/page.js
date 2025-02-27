'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import CheckListItem from '../components/CheckListItem';

export default function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newItemText, setNewItemText] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('general');
  const [newItemPriority, setNewItemPriority] = useState('medium');
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0],
  );

  useEffect(() => {
    fetchItems();
  }, [selectedDate]);

  const fetchItems = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/checkItems?date=${selectedDate}`,
      );
      setItems(response.data);
    } catch (error) {
      console.warn('체크리스트 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const now = new Date().toISOString();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/checkItems`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: newItemText,
            category: newItemCategory,
            priority: newItemPriority,
            addDate: now,
            updateDateLog: [],
            recentUpdateDate: now,
          }),
        },
      );

      if (!response.ok) {
        throw new Error('아이템 생성에 실패했습니다');
      }

      const createdItem = await response.json();
      setItems([...items, createdItem]);
      setNewItemText('');
      setNewItemCategory('general');
      setNewItemPriority('medium');
      fetchItems();
    } catch (error) {
      console.error('Error adding item:', error);
      alert('아이템 생성에 실패했습니다');
    }
  };

  const handleUpdateItem = async (updatedItem) => {
    try {
      const currentDate = new Date().toISOString();
      const itemToUpdate = {
        ...updatedItem,
        updateDateLog: [...(updatedItem.updateDateLog || []), currentDate],
        recentUpdateDate: currentDate,
      };

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/checkItems/${updatedItem._id}`,
        itemToUpdate,
      );
      fetchItems();
    } catch (error) {
      console.error('체크리스트 아이템 수정 실패:', error);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/checkItems/${id}`);
      fetchItems();
    } catch (error) {
      console.error('체크리스트 아이템 삭제 실패:', error);
    }
  };

  // 날짜별로 아이템을 그룹화하는 함수
  const groupItemsByDate = (items) => {
    const groups = {};
    items.forEach((item) => {
      const date = new Date(item.addDate).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(item);
    });
    return groups;
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-gray-600">체크리스트를 불러오는 중...</p>
        </div>
      </div>
    );

  return (
    <main className="min-h-screen bg-green-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between mb-8">
          <h1 className="text-3xl font-bold text-green-800">체크리스트</h1>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                console.log('Date changed to:', e.target.value);
                setSelectedDate(e.target.value);
              }}
              className="p-2 border border-green-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-green-800"
            />
            <button
              onClick={() =>
                setSelectedDate(new Date().toISOString().split('T')[0])
              }
              className="px-4 py-2 bg-green-300 text-green-800 rounded-lg hover:bg-green-500 transition duration-300"
            >
              오늘
            </button>
          </div>
        </div>

        <form onSubmit={handleAddItem} className="mb-8">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              placeholder="새로운 할 일을 입력하세요"
              className="flex-grow p-3 border border-green-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-green-800 font-bold shadow-sm"
            />
            <select
              value={newItemCategory}
              onChange={(e) => setNewItemCategory(e.target.value)}
              className="w-32 p-3 border border-green-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-green-800 font-bold shadow-sm"
            >
              <option value="general">일반</option>
              <option value="others">기타</option>
            </select>
            <select
              value={newItemPriority}
              onChange={(e) => setNewItemPriority(e.target.value)}
              className="w-28 p-3 border border-green-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-green-800 font-bold shadow-sm"
            >
              <option value="high">높음</option>
              <option value="medium">중간</option>
              <option value="low">낮음</option>
            </select>
            <button
              type="submit"
              className="px-6 py-3 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition duration-300"
            >
              추가
            </button>
          </div>
        </form>

        <div>
          {items.length === 0 ? (
            <div className="text-center py-10 bg-primary-50 rounded-lg text-green-800">
              <p className="text-primary-800 text-lg mb-4">
                {selectedDate === new Date().toISOString().split('T')[0]
                  ? '오늘의 체크리스트가 없습니다'
                  : '선택한 날짜의 체크리스트가 없습니다'}
              </p>
              <p className="text-primary-600">
                위 폼을 통해 새로운 할 일을 추가해보세요!
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item._id} className="flex flex-col gap-1">
                  <CheckListItem
                    key={item._id}
                    item={item}
                    onUpdate={handleUpdateItem}
                    onDelete={handleDeleteItem}
                  />
                  <div className="text-xs text-gray-500 ml-2">
                    <span>
                      등록:{' '}
                      {item.addDate
                        ? new Date(item.addDate).toLocaleString('ko-KR')
                        : '날짜 정보 없음'}
                    </span>
                    {item.recentUpdateDate &&
                      new Date(item.recentUpdateDate).toLocaleString(
                        'ko-KR',
                      ) !== new Date(item.addDate).toLocaleString('ko-KR') && (
                        <span className="ml-4">
                          최근 수정:{' '}
                          {new Date(item.recentUpdateDate).toLocaleString(
                            'ko-KR',
                          )}
                        </span>
                      )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
