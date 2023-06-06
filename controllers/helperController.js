
const checkForDuplicate = (array)=>{
             //are hints unique
             var result = [];
             array?.forEach(function(item) {
             if(result.indexOf(item) < 0) {
                 result.push(item);
             }
        });

        
        return result;
        
}



module.exports={checkForDuplicate}