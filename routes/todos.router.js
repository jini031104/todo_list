import express from 'express';
import Todo from '../schemas/todo.schema.js'

const router = express.Router();

// 할 일 등록 API
router.post('/todos', async(req, res) => {
    // 1. 클라이언트로부터 받아온 value 데이터를 가져온다.
    const {value} = req.body;

    // 1.5. 만약, 클라이언트가 value 데이터를 전달하지 않았을 때,
    // 클라이언트한데 에러 메시지를 전달한다.
    if(!value) {
        return res.status(400).json({errorMessage: "해야할 일(value) 데이터가 존재하지 않습니다."});
    }

    // 2. 해당하는 마지막 order 데이터를 조회한다.
    // 맨 마지막에 있는 1개만 가져온다.
    // todo.schema.js에서 만든 Todo 모델을 사용할 수 있도록...
    // sort = 정렬하다, 'order' 라는 컬럼을..(앞에 -를 붙여 내림차순으로 정렬)
    // exec가 없으면 await를 붙이나 안 붙이나 결과가 똑같다.
    const todoMaxOrder = await Todo.findOne().sort('-order').exec();

    // 3. 만약 존재한다면 현재 해야 할 일을 +1하고, 존재하지 않으면 1로 할당한다.
    const order = todoMaxOrder ? todoMaxOrder.order + 1 : 1;

    // 4. 해야할 일 등록
    const todo = new Todo({value, order});
    await todo.save(); // <= 얘가 있어야만 실제로 DB에 저장 & _id 자동생성

    // 5. 해야할 일을 클라이언트에게 반환
    return res.status(201).json({todo: todo});
});

// 해야할 일 목록 조회 API
router.get('/todos', async(req, res) => {
     // 1. 해야할 일 목록 조회
     const todos = await Todo.find().sort('-order').exec();

     // 2. 해야할 일 목록 조회 결과를 클라이언트한테 반환
     return res.status(200).json({todos: todos});
});

export default router;