const fs=require('fs');
const express=require('express');
const morgan=require('morgan')
const app=express();

//1)Middle Ware


app.use(morgan('dev'));
app.use(express.json());
const tours=JSON.parse(fs.readFileSync(`./tours-simple.json`));

app.use((req,res,next)=>{
    console.log("hello from the middle ware 😊");
    next()
    });
    
    app.use((req,res,next)=>{
        req.requestTime=new Date().toISOString();//toISOString is method
        next();
    })


    //2)Route Handlers

    const getallTours=(req,res)=>{
        console.log(req.requestTime);//own middleware function
        res.status(200).json({
            status:'success',
            requestedAt:req.requestTime,//own middleware
            results:tours.length,
            data:{
                tours
            }
        });
    }
    const createTour=(req,res)=>{
        const newId=tours[tours.length-1].id+1;
        const newTour=Object.assign({id:newId},req.body);
        tours.push(newTour);
        const content=JSON.stringify(tours)
        fs.writeFile(`./tourssimple.json`,content,err=>{
            res.status(201).json({
                status:"success",
                data:{
                    tour:newTour
                }
            });
        });
       //  res.send('Done');//not send two responds
    
    }
    //get id=23
    const getTour=(req,res)=>{
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
        
        res.status(200).json({
            status:'success',
            results:tours.length,
            data:{
                tour
            }
        });
    }
    }
    const deleteTour=(req,res)=>{
        if (req.params.id*1 > tours.length){
                     return res.status(404).json({
                        status:"fail",
                        message:"Invalid Id"
                    });
                }
                res.status(200).json({
                    status:'success',
                    data:{
                        tour:'<updated tour here ...>'
                    }
            });
    }
    const updateTour=(req,res)=>{
        if (req.params.id*1 > tours.length){
            return res.status(404).json({
               status:"fail",
               message:"Invalid Id"
           });
       }
       res.status(200).json({
           status:'success',
           data:{
               tour:'<updated tour here ...>'
           }
    });
    
    }

    //USER ROUTES(1)

    const getallUsers=(req,res)=>{
        res.status(500).json({
            status:'error',
            message:'This route Not Defined'
        });
    };
    const createUser=(req,res)=>{
        res.status(500).json({
            status:'error',
            message:'This route Not Defined'
        });
    };
    const getUser=(req,res)=>{
        res.status(500).json({
            status:'error',
            message:'This route Not Defined'
        });
    };
    const updateUser=(req,res)=>{
        res.status(500).json({
            status:'error',
            message:'This route Not Defined'
        });
    };
    const deleteUser=(req,res)=>{
        res.status(500).json({
            status:'error',
            message:'This route Not Defined'
        });
    };
    //3)Routes
//instead of app to use router middleware
    const tourRoute=express.Router();
    const tourUser=express.Router();

    tourRoute.route('/').get(getallTours).post(createTour);
    tourRoute.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);


    //Uer Routes(2)

    tourUser.route('/').get(getallUsers).post(createUser);
    tourUser.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

    // multiple routers
    app.use('/api/v1/tours',tourRoute);//parent url for tours//middleware
    app.use('api/v1/users',tourUser);// parent url for users//middleware

    //4)Start Server

    app.listen(8080);
    console.log("server is run");