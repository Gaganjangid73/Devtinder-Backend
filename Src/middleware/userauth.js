const userAuth =(req,res,next)=>{
    const userlogin = true;
    if(userlogin){
        next();
    }else{
        res.status(401).send("you are not a user");
    }
}

module.exports = {userAuth};