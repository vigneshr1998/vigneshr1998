const fs=require('fs');
const express=require('express');
const app=express();
app.use(express.json());//middleware
const tours=JSON.parse(fs.readFileSync("./tours-simple.json"));
app.get('/',(req,res)=>{
    res.status(200).json({
        status:'success',
        results:tours.length,
        data:{tours
        }
    });
});
app.get('/app/:id',(req,res)=>{
    console.log(req.params)
    //here id is string we convert string to number by multiply with number
    const id=req.params.id*1;
    //iteration done
    const tour=tours.find(el=>el.id === id);

    //if (id> tours.length)
    if (!tour){
        return res.status(404).json({
            status:"fail",
            message:"Invalid Id"
        });
    }
    res.status(200).json({
        status:'success',
        results:tours.length,
        data:{
            tour
        }
    });
});

app.post('/',(req,res)=>{
    //console.log(req.body);
    const newId=tours[tours.length-1].id+1;
    const newTour=Object.assign({id:newId},req.body);
    tours.push(newTour);
    const content=JSON.stringify(tours)
    fs.writeFile(`./tours-simple.json`,content,err=>{
        res.status(201).json({
            status:"success",
            data:{
                tour:newTour
            }
        });
    });
   //  res.send('Done');//not send two responds
});
// app.patch('/app/:id',(req,res)=>{
//     if (req.params.id*1 > tours.length){
//         return res.status(404).json({
//             status:"fail",
//             message:"Invalid Id"
//         });
//     }
//     res.status(200).json({
//         status:'success',
//         data:{
//             tour:'<updated tour here ...>'
//         }
// });
// });
app.delete('/app/:id',(req,res)=>{
    if (req.params.id*1 > tours.length){
        return res.status(404).json({
            status:"fail",
            message:"Invalid Id"
        });
    }
    res.status(204).json({
        status:'success',
        data:null
});
});

