import mongoose from 'mongoose';

const TodoSchema = new mongoose.Schema({
    value: {
        type: String,
        required: true  // value 필드는 필수 요소입니다.
    },
    order: {
        type: Number,
        required: true
    },
    doneAt: {
        type: Date,
        required: false // doneAt 필드는 필수 요소가 아니다.
    }
});

// 프론트엔드 서빙을 위한 코드. 자세히 몰라도 된다.
TodoSchema.virtual('todoId').get(function () {
    return this._id.toHexString();
});
TodoSchema.set('toJSON', {
    virtuals: true,
});

// TodoSchema를 바탕으로 Todo모델을 생성하여, 외부로 내보낸다.
export default mongoose.model('Todo', TodoSchema);