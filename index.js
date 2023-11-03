const express=require("express");
const app=express();
const mysql = require('mysql')
const cors=require("cors")
app.use(express.json());
app.use(cors())
const PORT=4000
const connection = mysql.createConnection({
    host: 'sql12.freemysqlhosting.net',
    port: '3306',
    user: 'sql12659088',
    password: '4tctRCVem2',
    database: 'sql12659088'
  })
connection.connect(err=>{
    console.log("my sql database connected");
    console.log(err);
})

app.post('/search-by-id',(req,res)=>{
    let sql='SELECT * FROM bus WHERE bus.bus_id=?';
    let id=req.body.id
    connection.query(sql,[id],(err,reslut)=>{
        console.log(reslut);
        res.send(reslut);
    })
})
app.post('/search-by-location',(req,res)=>{
    let sql='SELECT * FROM bus WHERE bus.from_location=? and bus.to_location=?';
    let from=req.body.from;
    let to=req.body.to;
    connection.query(sql,[from,to],(err,result)=>{
        res.send(result);
    })
})
app.post('/login',(req,res)=>{
    let sql="SELECT * FROM users WHERE email=? AND password=?";

    let email=req.body.email;
    let password=req.body.password;
    console.log("hello "+email+" "+password);
    connection.query(sql,[email,password],(err,result)=>{
        if( result.length>=1)
            res.send("success");
        else    
            res.send("failure");
    }) 
})
app.post('/register',async (req,res)=>{
    let sql="INSERT INTO users(name,email,password,phone) values(?,?,?,?)";
    let sql1="SELECT * FROM users";
    let sql2="SELECT * FROM users WHERE email=?";
    let id=0;
    let body=req.body;
    let name=body.name,email=body.email,password=body.password,phone=body.phone;
    connection.query(sql2,[email],(err,result)=>{
        if(result.length==0)
        {
            
            connection.query(sql,[name,email,password,phone],(err,result)=>{
                res.send("success")
            });  
        }
        else    
            res.send("user exist")
    })
})
app.post("/more-info",(req,res)=>{
    let bus_id=req.body.bus_id;
    let sql="SELECT from_location as location,start_time as time1 from bus where bus_id=?"+ 
    " UNION SELECT to_location as location,end_time as time1 from bus WHERE bus_id=? ORDER by time1"
    let out={};
    let sql1="SELECT * from driver where bus_id=?"
    let sql2="SELECT phone from driver_phone where driver_id=?"
    try{
    connection.query(sql,[bus_id,bus_id],(err,result)=>{
        out={...out,bus:result};
        connection.query(sql1,[bus_id],(err,result1)=>{
            out={...out,driver:result1[0]};
            if(result1.length!=0 )
            {
            let driver_id=result1[0].driver_id;
            connection.query(sql2,[driver_id],(err,result)=>{
                out={...out,phone:result}
                res.send(out);
            })
            }
            else
                res.send("error")
        })
     })
    }
    catch(err)
    {
        res.send("error");
    }
     
})
app.post("/more-info-driver",(req,res)=>{
    let sql="SELECT phone from driver_phone where driver_id=?"
    let driver_id=req.body.driver_id;
    try{
    connection.query(sql,[driver_id],(err,result)=>{
        res.send(result);
    })
    }
    catch(err)
    {
        res.send("error");
    }
} )
app.listen(PORT,()=>{
    console.log("server started ");
})
