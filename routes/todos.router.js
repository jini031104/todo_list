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

// 해야할 일 순서 변경, 완료/해제 API
router.patch('/todos/:todoId', async(req, res) => {
    // 1. 변경해야 할 id 가져오기
    const {todoId} = req.params;
    // 2. 몇 번째 order로 변경할 것인지
    const {order, done} = req.body;

    // 3. 현재 나의 order가 무언인지 알아야 한다.
    // Todo 모델을 바탕으로 id를 찾는다.
    const currenTodo = await Todo.findById(todoId).exec();
    // 3-1. 만약 가져오려는 id가 없다면 에러
    if(!currenTodo) {
        // 클라이언트가 발생시킨 에러는 400.
        // 이중 404는 클라이언트가 전달한 데이터는 존재하지 않음을 의미
        return res.status(404).json({errorMessage: "존재하지 않는 해야할 일 입니다."});
    }

    // 4. order라는 값이 있을 때만 순서를 변경한다.
    if(order) {
        // 5. 변경하려는 order 값을 찾는다.
        // find는 목록 조회. findOne은 하나의 데이터만 조회
        const targetTodo = await Todo.findOne({order}).exec();
        // 6. order가 있다면 비즈니스 로직을 수행한다.
        if(targetTodo) {
            // 6-1. 내가 가지고 있는 것(바꿔야 하는 순서)과
            // order로 찾은 것(내가 바꾸고 싶은 것)의 순서를 바꾼다.
            targetTodo.order = currenTodo.order;
            // 7. 변경된 값을 DB에 저장한다.
            await targetTodo.save();
        }
        // 8. 나의 order를 내가 바꾸고 싶은 order로 변경한다.
        currenTodo.order = order;
    }

    // done이라는 값을 전달받지만, done이 있기만하면 진행된다.
    // 이는 단순히 done라고만 하면 해야할 일을 해제하는 false일 때는 들어오지 않는 문제가 있다.
    if(done !== undefined) {
        currenTodo.doneAt = done ? new Date() : null;
    }

    await currenTodo.save();

    return res.status(200).json({});
});

// 할 일 삭제 API
router.delete('/todos/:todoId', async(req, res) => {
    // 1. todoId 값을 가져온다.
    const {todoId} = req.params;
    // 2. 해야 할 일을 찾는다.
    const todo = await Todo.findById(todoId).exec();

    // 3. 찾는 todoId가 없을 경우
    if(!todo) {
        return res.status(404).json({errorMessage: '존재하지 않는 toto 데이터입니다.'});
    }

    // 4. 실제로 삭제하는 작업
    // 기본 키를 삭제할 것이기 때문에 _id를 사용한다.
    await Todo.deleteOne({_id: todoId}).exec();

    return res.status(200).json({});
});

export default router;