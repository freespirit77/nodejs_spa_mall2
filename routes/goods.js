const express = require("express");
const Goods = require("../schemas/goods")   // 웹서버가 db접속위함. db모델
const Cart = require("../schemas/cart")   // 웹서버가 db접속위함. db모델
const router = express.Router();


router.get("/", (req, res) => {
    res.send("this is root page");
});



// db값을 조회하면 삭제하면됨
const goods = [
    {
      goodsId: 4,
      name: "상품 4",
      thumbnailUrl:
        "https://cdn.pixabay.com/photo/2016/09/07/02/11/frogs-1650657_1280.jpg",
      category: "drink",
      price: 0.1,
    },
    {
      goodsId: 3,
      name: "상품 3",
      thumbnailUrl:
        "https://cdn.pixabay.com/photo/2016/09/07/02/12/frogs-1650658_1280.jpg",
      category: "drink",
      price: 2.2,
    },
    {
      goodsId: 2,
      name: "상품 2",
      thumbnailUrl:
        "https://cdn.pixabay.com/photo/2014/08/26/19/19/wine-428316_1280.jpg",
      category: "drink",
      price: 0.11,
    },
    {
      goodsId: 1,
      name: "상품 1",
      thumbnailUrl:
        "https://cdn.pixabay.com/photo/2016/09/07/19/54/wines-1652455_1280.jpg",
      category: "drink",
      price: 6.2,
    },
  ];

// 1번
// router.get("/goods", (req, res) => {
//     // res.send("this is goods page");
//     res.json({
//         // goods : goods //key, value값이 같은 경우 약식으로 할수있음 :  javascript shorthand property(객체 초기자)
//         goods
//     })
// });

// 2번. db에서 가져오는 것으로 만듬
// router.get("/goods", async (req, res)=> {
//   const goods = await Goods.find();   // Goods에서 나오는 객체는 Promise로 모두 내보내짐. 그러면 await를 써서 받아야함-> async를 써야함 
//   res.json(
//     goods,
//   );
// });

//3번. db에서 값을 가져오면서 Query string 적용
router.get("/goods", async (req, res)=> {
  const {category} = req.query;
  // console.log("category?", category); // thunder client로 동작확인
  const goods = await Goods.find({category});   // Goods에서 나오는 객체는 Promise로 모두 내보내짐. 그러면 await를 써서 받아야함-> async를 써야함 
  res.json(
    goods,
  );
});


// *Cart 조회 API : /goods/:goodsID보다 앞에 작성해야함 (goods/cart가될수 있어서)
router.get("/goods/cart", async (req, res) => {
  const carts = await Cart.find();   // carts db접속
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
      cart: carts.map((cart)=>{
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






//':' goods 뒤에 붙는것을 goodsId로 부르겠다
// router.get("/goods/:goodsId", (req, res) => {
//   //그 아래랑 같은거임  
//   // const goodsId = req.params.goodsId;
//   const {goodsId} = req.params;

//     // console.log(goodsId);
//     // res.send('goods id 확인용');

//     // res.json({
//     //  //   detail : goods.filter((item) => item.goodsId === goodsId) 안됨
//     //     detail : goods.filter((item) => {
//     //         return item.goodsId === Number(goodsId);
//     //     }),
//     // });

//     // 1안
//     // const filteredItems =  goods.filter((item) => item.goodsId === Number(goodsId));
//     // res.json({
//     //     detail : filteredItems[0]
//     // })

//     // 2안 - [] 배열의 첫번째 값
//     const [detail] =  goods.filter((item) => item.goodsId === Number(goodsId));
//     res.json({
//         // detail : detail
//         detail,
//     });
//   });

  // * 상품 상세조회 - DB에서 가져오는 API로 
  router.get("/goods/:goodsId", async (req, res)=> {
    const {goodsId} = req.params;

    const [goods] = await Goods.find({goodsId: Number(goodsId)});
    // find는 항상 promise를 반환하므로 await, asysnc 로
    // 배열이니까 defactoring으로 [goods]
    // detail로 바꾸고 아래 약식으로 detail로 

    res.json({
      goods,
    });

  });

  // * 장바구니에 추가하는 API 
  // router.post("/goods/:goodsId/cart", async (req, res) => {
  //   // 필요한 2개의 값 : goodsId, quantity
  //   const {goodsId} = req.params; // req.params 값은 string (숫자로 바꿔줘야함)
  //   const {quantity} = req.body;
    
  //   //find는 array로 반환이 되고, promise로 반환되서 
  //   const existsCarts = await Cart.find({goodsId: Number(goodsId)});
  //   if(existsCarts.length){
  //     return res.status(400).json({success: false, errorMessage: "이미 장바구니에 들어있는 상품입니다."});
  //   }

  //   await Cart.create({goodsId: Number(goodsId), quantity});
  //   res.json({success:true}); //response는 항상있어야함

  // });

  // *장바구니 삭제 API (추가하는 API 활용)
  router.delete("/goods/:goodsId/cart", async (req, res)=> {
    const {goodsId} = req.params; // req.params 값은 string (숫자로 바꿔줘야함)
    
    //find는 array로 반환이 되고, promise로 반환되서 
    const existsCarts = await Cart.find({goodsId: Number(goodsId)});
    if(existsCarts.length){
      await Cart.deleteOne({goodsId: Number(goodsId)});
    }

    res.json({success: true});

  });

  // *장바구니 수정 API (장바구니 추가 API 활용)
  router.put("/goods/:goodsId/cart", async (req, res)=>{
    const {goodsId} = req.params; // req.params 값은 string (숫자로 바꿔줘야함)
    const {quantity} = req.body; // 수정할 값 입력받음. body는 json값을 그대로 넘겨받아서 type까지 넘겨받음

    const existsCarts = await Cart.find({goodsId: Number(goodsId)});
    
    // if(quantity<1){
    //   return res.status(400).json({success: false, errorMessage: "수량을 1 이상으로 입력해주세요"});
    // }
    
    if(!existsCarts.length){
      // 수정API만 할때는 return했으나, 장바구니 추가 기능까지 넣어서 바꿈
      // return res.status(400).json({success: false, errorMessage: "장바구니에 해당 상품이 없습니다."});
      await Cart.create({goodsId: Number(goodsId), quantity});
    } else{
      await Cart.updateOne({goodsId: Number(goodsId)}, { $set: {quantity} });
    }

    // 기존에 수정API만 할때 코드
    // await Cart.updateOne({goodsId: Number(goodsId)}, { $set: {quantity} });

    res.json({success: true});

  });

  router.post("/goods", async (req,res)=> {
    // const goodsId = req.body.goodsId;   // 보통은 서버에서 만들어줌. 이건 테스트용도
    const {goodsId, name, thumbnailUrl, category, price} = req.body; // 위랑 같은 표현식 대신, 여러개를 입력하기위해 이런 패턴으로. destructing. 비할당구조화

    // db에서 조회
    const goods = await Goods.find({goodsId}); // find라는 함수는 Promise를 반환함. 위에 async로 해야 await 사용 가능
    
    if(goods.length){
      return res.status(400).json({success: false, errorMessage: "이미 있는 데이터입니다."});
    } 

    //이것이 끝나고 응답이 되도록 await
    const createdGoods = await Goods.create({
      goodsId, 
      name, 
      thumbnailUrl, 
      category, 
      price,
    });

    res.json({goods : createdGoods});
  });

//router라는 값을 module로서 내보내겠다 (app.js에서 호출하기 위해서 필요함)
module.exports = router;