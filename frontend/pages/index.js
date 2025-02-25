import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  const [numbers, setNumbers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNumbers();
  }, []);

  const fetchNumbers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/numbers');
      setNumbers(response.data);
    } catch (error) {
      console.error('숫자를 불러오는데 실패했습니다:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNumber = async () => {
    try {
      await axios.post('http://localhost:5000/api/numbers');
      fetchNumbers();
    } catch (error) {
      console.error('숫자 생성에 실패했습니다:', error);
    }
  };

  const deleteNumber = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/numbers/${id}`);
      fetchNumbers();
    } catch (error) {
      console.error('숫자 삭제에 실패했습니다:', error);
    }
  };

  if (loading) return <div>로딩중...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">숫자 11 CRUD</h1>
      <button
        onClick={createNumber}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        숫자 11 생성
      </button>
      <div className="mt-4">
        {numbers.map((number) => (
          <div key={number._id} className="flex items-center gap-4 mb-2">
            <span>값: {number.value}</span>
            <button
              onClick={() => deleteNumber(number._id)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              삭제
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
