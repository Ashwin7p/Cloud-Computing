const uploaderService = require("../services/uploaderServ");
const requestIp = require('request-ip');
const fs = require('fs');
require('dotenv').config()

async function _getData(clientIp){
  let jsonObject = {};
      if(process.env[clientIp] != undefined ){
        let myarray = process.env[clientIp].split(',');
        for(let i =0 ;i< myarray.length-1;i++){
          let myarray2 = myarray[i].split('#$@$#'); 
          jsonObject[myarray2[0]]=myarray2[1];
        }
        
        return jsonObject;
        // await new Promise((resolve) => setTimeout(resolve, 5000));
        // res.redirect('/');
      }
      else{
        return {"OOPS!":"No Results for client made requests found!! Please make an upload!!"};
        
      }

}


module.exports = {
    postImage:  async(req, res, next) => {
    try {
        
          // Reset the dictionary when user uploads new images.
          // dataDict = {};
          
          console.log("Calling Controller service");
          console.log(req.files);
          process.env.CLIENT_ID = requestIp.getClientIp(req);
          for (const index in req.files) {  
            console.log(req.files[index]);
            console.log("Calling upload to AWS");
            await uploaderService.postImage(requestIp.getClientIp(req), req.files[index].filename);      
          }
          console.log("Processed requests successfully!!");
          console.log(process.env.CLIENT_ID);
          await uploaderService.getImages(requestIp.getClientIp(req),1); 
          const result = await _getData(requestIp.getClientIp(req));
          console.log(result)
	 // const result={"ss":"uploaded"}; 
          res.status(200).json(result);

    } catch (error) {
      console.log(error);
      next();
    }
  },
  
  getResults: async (req, res, next) => {
    try {
      console.log("Receiving messages..");
      let resString = await uploaderService.getImages(requestIp.getClientIp(req),10); 
      // return resString;
      const clientIp = requestIp.getClientIp(req);
      //ashwin_test_15.JPEG#$@#$hanky18
      //::2$#@$#ashwin_test_15.JPEG#$@#$hanky18
      const result = await _getData(clientIp);
      console.log(result); 
      res.status(200).json(result);
      // res.redirect('/');
    } catch (error) {
    next(error);
  }
  },
  
};
