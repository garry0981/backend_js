const asyncHandlar = (requestHandlar) =>{
    return (req,res,next) =>{
        Promise.resolve(requestHandlar(req,res,next)).catch((err) => next(err))
    }
}


export {asyncHandlar}


// const asyncHandlar=() =>{}
// const asyncHandlar=(func) =>() =>{}
// const asyncHandlar = (func) =>async() =>{}

// const asyncHandlar =(fn) => async(req,res,next) =>{
//     try {
//         await fn(req,res,next)
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success:false,
//             massage:err.massage
//         })
//     }
// }