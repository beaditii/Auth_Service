const UserRepository=require('../repository/user-repository');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const { JWT_KEY } = require('../config/serverConfig');
class UserService{
    constructor(){
        this.userRepository=new UserRepository();
    }
    async create(data){
       try{
      const user=await this.userRepository.create(data);
      return user;
       }
       catch(error){
        console.log("something went wrong in the service layer");
        throw error;
       }
    }
    async signIn(email,plainPassword){
        try{
            //step -1 -fetch the user using the email
       const user=await this.userRepository.getByEmail(email);
       
       //step-2 = compare incoming password with stores encrypted password 

       const passwordMatch=this.checkPassword(plainPassword,user.password);
       if(!passwordMatch)
       {
        console.log("Password doesn't match");
        throw{ error:"Incorrect password"};
       }

       // step 3 - if passwords match then create a token and send it to the user
       const newJWT=this.createToken({email:user.email,id:user.id});

       return newJWT;
       
        }
        catch(error){
         console.log("something went wrong in the sign in process");
         throw error;
        }
     }

     createToken(user){
        try{
          const result=jwt.sign(user,JWT_KEY,{expiresIn:'1d'});
          return result;
        }
        catch(error){
            console.log("something went wrong in token creation");
        throw error;
        }
    }

    verifyToken(token){
        try{
         const response=jwt.verify(token,JWT_KEY);
         return response;
        }
        catch(error){
            console.log("something went wrong in token validation");
        throw error;
        }

    }
    checkPassword(userTnputPlainPassword,encryptPassword){
        try{
            return bcrypt.compareSync(userTnputPlainPassword,encryptPassword);
        }

        catch(error){
            console.log("Something went wrong in password computation");
            throw error;
        }
    }
}

module.exports=UserService;