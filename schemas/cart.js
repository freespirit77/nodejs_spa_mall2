// schemas 안에 있는 파일은 단수형, routes에 있는것은 복수형으로

const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    goodsId: {
        type: Number,
        required : true,
        unique : true,
    },
    quantity: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model("Cart", schema);
