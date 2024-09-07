import express from 'express';
import connect from './schemas/index.js';
import TodosRouter from './routes/todos.router.js';

const app = express();
const PORT = 3000;

connect();

// Express에서 req.body에 접근하여 body 데이터를 사용할 수 있도록 설정합니다.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// assets 폴더에 있는 모든 파일들을 서빙할 것이다.
// 즉, 정적인 파일을 assets 폴더에 있는 파일들을 바탕으로 서빙을 할 거다.
app.use(express.static('./assets'));

// app.use((req, res, next) => {
//   console.log('Request URL:', req.originalUrl, ' - ', new Date());
//   next();
// });

// 라우터 생성 -> 해당 라우터에다 API 구현
const router = express.Router();

// 이 라우터를 전역 middleware로 등록
// '/' 경로에다 GET 요청을 처리한다.
// 즉, 이 라우터가 사용되는 위치에서 '/'로 요청이 들어올 때 응답을 보낸다.
router.get('/', (req, res) => {
  return res.json({ message: 'Hi!' });
});
// 앞에 /api가 붙은 경우에만 해당하는 API로 접근 가능
// 즉, 라우터를 /api 경로에 연결한 것.
// 따라서 라우터에 정의된 모든 경로는 /api 가 앞에 붙어서 동작하게 된다.
// /api 주소로 접근하였을 때, router와 TodosRouter로 클라이언트의 요청이 전달됩니다.
app.use('/api', [router, TodosRouter]);

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});