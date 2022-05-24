const mongoose = require("mongoose");

//5가지의 key(Property)를 가진 스키마 생성
const goodsSchema = mongoose.Schema({
    goodsId: {
        type: Number,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },
    thumbnailUrl: {
        type: String,
    },
    category: {
        type: String,
    },
    price: {
        type: String,
    },
});

// const model = mongoose.model("Goods", goodsSchema);
module.exports = mongoose.model("Goods", goodsSchema);