exports.processAxiosError = function(error){
    if (error.response){
        var ret = error.response.data;
        ret.statusCode = error.response.status;
        return(ret);
    } else if (error.request){
        return(error.request);
    } else {
        return(error.message);
    }
}

