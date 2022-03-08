const { json } = require("express/lib/response");

class ApiFeatures {
    constructor(query,queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    search(){
        const keyword =this.queryStr.keyword
        ? {
            name:{
                $regex:this.queryStr.keyword,
                $options:"i",
            }
        } 
        : {};


        this.query = this.query.find({...keyword});
        
        return this;
    }

    // filter for Price and rating

    filter(){
        const queryCopy = {...this.queryStr};

        // removing some field form catagory 

         const removeField = ["keyword","page","limit"]
         removeField.forEach((key)=> delete queryCopy[key])

         //filter for pricing and rating

        //  console.log(queryCopy);
         let queryStr = JSON.stringify(queryCopy)
         queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key)=> `$${key}`);
          
         this.query = this.query.find(JSON.parse(queryStr))

         console.log(queryStr);

         return this;  

    }

    pagenation(resultPerPage){

        const currentPage = Number(this.queryStr.page) || 1;  // 50-10
        const skip = resultPerPage * (currentPage-1)

        this.query = this.query.limit(resultPerPage).skip(skip)

        return this;
    }
}

module.exports = ApiFeatures ;