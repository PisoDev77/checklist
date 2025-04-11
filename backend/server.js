const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
	.connect(process.env.MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log('MongoDB에 성공적으로 연결되었습니다.'))
	.catch((err) => {
		console.error('MongoDB 연결 실패:', err.message);
		console.error('MongoDB URI:', process.env.MONGODB_URI);
		process.exit(1); // 연결 실패시 프로세스 종료
	});

const checkItemRoutes = require('./routes/checkItems');
const quizRoutes = require('./routes/quizs');
app.use('/api/checkItems', checkItemRoutes);
app.use('/api/checkItems', quizRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`서버가 포트 ${PORT}에서 실행중입니다`);
	console.log(`API 엔드포인트: http://localhost:${PORT}/api/checkItems`);
});
