
const adminAuth = (req, res, next) => {
    const adminToken = "xyz";
    const isAdminAuthorized = adminToken === "xyz";
    if(!isAdminAuthorized){
        res.status(401).send("Unauthorized");
    }else{
        next();
    }
}

const userAuth = (req, res, next) => {
    const userToken = "xyz";
    const isUserAuthorized = userToken === "xyz";
    if(!isUserAuthorized){
        res.status(401).send("Unauthorized");
    }else{
        next();
    }
}

module.exports = {adminAuth, userAuth};