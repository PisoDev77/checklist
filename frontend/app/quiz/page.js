'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Quiz() {
	const [tab, setTab] = useState(1);
	const [editMode, setEditMode] = useState(false);
	const [quiz, setQuiz] = useState('');
	const [answer, setAnswer] = useState('');
	const [category, setCategory] = useState('일반');
	const [quizs, setQuizs] = useState([]);
	const [currentQuizIndex, setCurrentQuizIndex] = useState(0);

	const handleAddQuiz = async (e) => {
		e.preventDefault();
		try {
			const now = new Date().toISOString();
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quizs`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					quiz,
					answer,
					category,
					addDate: now,
					updateDateLog: [],
					recentUpdateDate: now,
				}),
			});

			console.log('퀴즈 추가 성공:', response.data);
			// 폼 초기화
			setQuiz('');
			setAnswer('');
			setCategory('일반');
		} catch (error) {
			console.error('퀴즈 추가 실패:', error);
		}
	};

	const fetchQuizs = async () => {
		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quizs/category/일반`);
			const data = await response.json();
			setQuizs(data);
		} catch (error) {
			console.error('퀴즈 조회 실패:', error);
		}
	};

	useEffect(() => {
		if (tab === 0) {
			fetchQuizs();
		}
	}, [tab]);

	const handleEditQuiz = async (e) => {
		e.preventDefault();
		try {
			const updatedItem = quizs[currentQuizIndex];

			const currentDate = new Date().toISOString();
			const itemToUpdate = {
				...updatedItem,
				answer,
				quiz,
				category,
				updateDateLog: [...(updatedItem.updateDateLog || []), currentDate],
				recentUpdateDate: currentDate,
			};

			await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/quizs/${updatedItem._id}`, itemToUpdate);
			fetchQuizs();
		} catch (error) {
			console.error('체크리스트 아이템 수정 실패:', error);
		}
	};

	const handleNextQuiz = () => {
		if (currentQuizIndex < quizs.length - 1) {
			setCurrentQuizIndex(currentQuizIndex + 1);
		}
	};

	const handlePrevQuiz = () => {
		if (currentQuizIndex > 0) {
			setCurrentQuizIndex(currentQuizIndex - 1);
		}
	};

	const Tabs = [
		() => (
			<article>
				<h2 className='text-xl font-bold text-black'>일반 카테고리 퀴즈</h2>
				{quizs.length > 0 ? (
					<div className='mt-4'>
						<p className='font-semibold text-black'>{quizs[currentQuizIndex].quiz}</p>
						<p className='text-gray-800'>정답: {quizs[currentQuizIndex].answer}</p>
						<div className='flex justify-between mt-4'>
							<button onClick={handlePrevQuiz} disabled={currentQuizIndex === 0} className='px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300'>
								이전
							</button>
							<button onClick={handleNextQuiz} disabled={currentQuizIndex === quizs.length - 1} className='px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300'>
								다음
							</button>
							<button
								onClick={() => {
									setEditMode(true);
									setTab(1);
									setQuiz(quizs[currentQuizIndex].quiz);
									setAnswer(quizs[currentQuizIndex].answer);
									setCategory(quizs[currentQuizIndex].category);
									setTab(1);
								}}
								className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300'
							>
								수정
							</button>
						</div>
					</div>
				) : (
					<p>퀴즈가 없습니다.</p>
				)}
			</article>
		),
		() => (
			<article>
				<form onSubmit={editMode ? handleEditQuiz : handleAddQuiz} className='flex flex-col gap-4'>
					<textarea
						placeholder='퀴즈 질문을 입력하세요'
						className='p-2 border border-green-500 rounded-lg bg-white text-black'
						value={quiz}
						onChange={(e) => setQuiz(e.target.value)}
						required
						rows={4}
					/>
					<input
						type='text'
						placeholder='정답을 입력하세요'
						className='p-2 border border-green-500 rounded-lg bg-white text-black'
						value={answer}
						onChange={(e) => setAnswer(e.target.value)}
						required
					/>
					<input
						type='text'
						placeholder='카테고리를 입력하세요 (기본값: 일반)'
						className='p-2 border border-green-500 rounded-lg bg-white text-black'
						value={category}
						onChange={(e) => setCategory(e.target.value)}
					/>
					<button type='submit' className='px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300'>
						{editMode ? '퀴즈 수정' : '퀴즈 추가'}
					</button>
				</form>
			</article>
		),
	];

	return (
		<main className='min-h-screen bg-green-100 p-8'>
			<header className='w-full'>
				<nav className='flex justify-center p-4 rounded-lg gap-8'>
					<button className={`px-4 py-2 text-green-800 rounded-lg transition duration-300 ${tab === 0 ? 'bg-green-500' : 'bg-green-300 hover:bg-green-500'}`} onClick={() => setTab(0)}>
						조회
					</button>
					<button className={`px-4 py-2 text-green-800 rounded-lg transition duration-300 ${tab === 1 ? 'bg-green-500' : 'bg-green-300 hover:bg-green-500'}`} onClick={() => setTab(1)}>
						생성
					</button>
				</nav>
			</header>
			<div className='mt-4'>{Tabs[tab]()}</div>
		</main>
	);
}
