'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import CheckListItem from '../components/CheckListItem';

export default function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'general',
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/checkItems`,
      );
      setItems(response.data);
    } catch (error) {
      console.warn('체크리스트 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const createItem = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/checkItems`,
        newItem,
      );
      setNewItem({
        title: '',
        description: '',
        priority: 'medium',
        category: 'general',
      });
      fetchItems();
    } catch (error) {
      console.error('체크리스트 아이템 생성 실패:', error);
    }
  };

  const updateItem = async (id, updates) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/checkItems/${id}`,
        updates,
      );
      fetchItems();
    } catch (error) {
      console.error('체크리스트 아이템 수정 실패:', error);
    }
  };

  const deleteItem = async (id) => {
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
    <main className="min-h-screen bg-green-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-green-800">체크리스트</h1>

        <form onSubmit={createItem} className="mb-8">
          <input
            type="text"
            value={newItem.title}
            onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
            className="w-full p-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="새로운 항목 추가"
          />
        </form>

        <div>
          {items.length === 0 ? (
            <div className="text-center py-10 bg-primary-50 rounded-lg">
              <p className="text-primary-800 text-lg mb-4">
                아직 체크리스트가 없습니다
              </p>
              <p className="text-primary-600">
                위 폼을 통해 새로운 할 일을 추가해보세요!
              </p>
            </div>
          ) : (
            Object.entries(groupItemsByDate(items))
              .sort((a, b) => new Date(b[0]) - new Date(a[0]))
              .map(([date, dateItems]) => (
                <div key={date} className="mb-8">
                  <h2 className="text-lg font-semibold mb-4 text-primary-800 border-b border-primary-200 pb-2">
                    {new Date(date).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      weekday: 'long',
                    })}
                  </h2>
                  <div className="space-y-2">
                    {dateItems.map((item) => (
                      <CheckListItem
                        key={item._id}
                        item={item}
                        onUpdate={updateItem}
                        onDelete={deleteItem}
                      />
                    ))}
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </main>
  );
}
