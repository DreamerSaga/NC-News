exports.handleCustomErrors = (err,req, res, next) => {
    if (err.status && err.msg){
        res.status(err.status).send({msg: err.msg})
    } else{
        next(err)
    }
}
 //which error codes??? 
exports.handlePsqlErrors = (err, req, res, next) => {
    console.log(err)
    if (err.code === '22P02') {
        res.status(400).send({ message: 'Bad Request' });
    } else if (err.code === '23503') {
        res.status(404).send({ message: ' not found' });
    }
    else (next(err));
};


exports.handleServerErrors = (err, req, res, next) => {
    //console.log(err);
    res.status(500).send('Server Error!');
};
