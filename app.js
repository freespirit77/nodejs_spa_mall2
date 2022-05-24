// ---------------------Express.js로 웹서버 만들기---------------------
// JavaScript라는 코드로 언어를 짜고, node.js로 실행했지만, express.js라는 도구로 웹서버를 만듬 

const express = require("express");
// express라는 package를 require(불러오겠다)하고 이를 express변수에 넣겠다
const connect = require("./schemas");
//mongoose관련 폴더인 schemas 불러옴 
connect();

const app = express();
// app이 서버객체를 받아옴 (꼭 이렇게만 써야함 : why? framework이기 때문에)
const port = 3000;

const goodsRouter = require ("./routes/goods");
// const cartsRouter = require ("./routes/carts"); // 통합함


// use : 미들웨어를 사용할 수 있도록 도와주겠다. 코드 배치 위치 중요(이아래부분만 미들웨어 사용)
// next() : 다음에 있는 middle ware로 넘어감
// send는 이걸 보내고 끝냄
// app.use ((req,res,next)=> {
//     // console.log("미들웨어가 구현됬나?");
//     // console.log("주소는?", req.path);
//     // next();
//     if (req.path==="/test") {
//         res.send("테스트 주소로 왔구나!");   
//     } else{
//         next();
//     }
// });


const requestMiddleware = (req, res, next)=> {
    console.log("Request URL:", req.originalUrl, " - ", new Date());
    next();
}

app.use(express.static("static"));  //static이라는 폴더이름을 찾아서  
//미들웨어. json으로 들어오는 데이터를 parsing
app.use(express.json()); 
app.use(express.urlencoded());
app.use(requestMiddleware);

// '/api'가 맞으면 뒤에있는 middleware를 실행함 (goodsRouter를 먼저)
// app.use("/api", [goodsRouter, cartsRouter]);

app.use("/api", [goodsRouter]);

// // 위와 동일
// app.use((req, res, next)=> {
//     console.log("Request URL:", req.originalUrl, " - ", new Date());
//     next();
// });



//라우터 : 이것도 미들웨어 기반으로 구현된것임 (use와 형태 비슷)
app.get('/', (req, res) => {
    res.send("Hello World@@@");
});


// 첫번째 port, 두번째는 제대로 켜졌다면 이것 실행
app.listen(port, () => {
    console.log(port, "포트로 서버가 켜졌어요!");
});

//라우팅 : 클라우드 요청

