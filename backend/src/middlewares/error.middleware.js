const errorHandler = (err,req,res,next) =>{
    console.error(err.stack)
    if(err.name === "Validation Error"){
        return res.status(400)
        .json({message : "Validation Error",
            errors : Object.values(err.errors).map(error=>error.message)
        })

    }
    if(err.name === "Cast Error"){
        return res.status(400).json({
            message : "Inavlid ID Format"
        })
    }
    res.status(500).json({
        message: "Internal Server Error"
    })
}

export {errorHandler}