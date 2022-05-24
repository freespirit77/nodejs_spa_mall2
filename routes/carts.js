// 이 파일은 goods.js로 통합하여 삭제해도 무방

const express = require("express");     //step1
const Carts = require("../schemas/cart"); // step2. 본격만들기. // 웹서버가 db접속위함. db모델
const Goods = require("../schemas/goods"); // goods data를 사용하기 위함 (goodsId로 goods 정보 가져오기)
const router = express.Router();    //step1

router.get("/carts", async (req, res) => {
    const carts = await Carts.find();   // carts db접속
    // const goodsIds = carts.map((cart)=> {
    //     return cart.goodsId;
    // });
    const goodsIds = carts.map((cart)=> cart.goodsId);  //goods id만 리턴
    const goods = await Goods.find({goodsId: goodsIds});    //goods id에 해당하는 goods 리턴

    // console.log(goods); // 확인용
    
    //1. carts 기본값으로 확인
    // res.json({  
    //     carts,
    // })

    // 확인용
    console.log(carts.map((cart)=> {
        return {
            quantity: cart.quantity,
            goodsId : cart.goodsId,
        }
    }));

    res.json({
        carts: carts.map((cart)=>{
            return {
                quantity: cart.quantity,
                goods: goods.find((item)=>{
                    return item.goodsId === cart.goodsId;
                })
            };
        }),
    })
    


    // res.json({
    //     carts,
    // })
    

    // res.send("carts!!"); // step1 잘동작하나 확인
});


module.exports = router;
