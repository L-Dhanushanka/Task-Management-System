const router = require("express").Router();
const user = require("../../models/User/User");
let User = require("../../models/User/User");
const jwt = require("jsonwebtoken");
// let verifyUser = require("../../utills/verifyToken");
const { verifyToken, verifyUser } = require('../../utills/verifyToken');



//User SignUp
router.route("/addUser").post(async(req,res)=>{

    const customername = req.body.customername;
    const company = req.body.company;
    const contact = req.body.contact;
    const email = req.body.email;
    const country = req.body.country;
    const password = req.body.password;
    const address2 = req.body.address2;
    const address3 = req.body.address3;

 try{

   const usernameExist = await User.findOne({ customername: customername});

   if(usernameExist){

    return res.status(422).json({ error: "Customer Already Exist"});
  }

    const newUser = new User({
        customername,
        company,
        contact,
        email,
        country,
        password,
        address2,
        address3,
    })


    await newUser.save();


        res.status(201).json({ message: "User Added Successfully!"});

    } catch(err){

        console.log(err);
    }

}); 

//Get all users
// router.route("/getAllUsers").get((req ,res)=> {
//     User.find().then((user)=>{
//         res.json(user)
        
//     }).catch((err) =>{
//         console.log(err)
//     })
// });



router.route("/getAllUsers").get(verifyUser, (req, res) => {
    console.log("kkkkkkkkkkkkkkkk");
    User.find()
      .then((User) => {
        console.log("ffffffuuuuuucccckkkkk");
        res.json(User);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
      });
  });



//login
router.post('/login', async(req,res) => {

    try{
            const {customername, password} = req.body;

            if(!customername || !password){

                return res.status(400).json({error: "Please filled the all data"})
            }

            const userLogin = await User.findOne({customername: customername});
    
            if(!userLogin){

                res.status(400).json({error: "Admin does not exists"});

            }

            else if (password == userLogin.password){

                const token =jwt.sign(
                    {id: userLogin._id}, 
                    process.env.JWT_SECRET
                );
                res.cookie("access_token", token, {httpOnly: true})
                .status(200)
                .json({
                    status: 200,
                    message: "Login Success",
                    data: userLogin
                })

                
            }else{ 

                res.status(400).json({error: "Invalid Credientials"});
               
            }
          

    }catch(err){

        console.log(err);
    }


});

// router.route("/get/:id").get(async (req,res) =>{
    

//     let userID = req.params.id;

//     const user = await User.findById(userID).then((User) =>{

//         res.json(User);

//     }).catch((err) =>{
        
//         console.log(err.message);
//     })
// })    


router.route("/get/:id").get(verifyUser, async (req, res) => {
    try {
        let userID = req.params.id;

        console.log('Received request for user ID:', userID);

        const user = await User.findById(userID);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.route('/logout').get(verifyUser, async (req, res) => {
    try {
        const cookies = req.cookies;

        for (const cookieName in cookies) {
            res.clearCookie(cookieName);
        }

        // Respond with a success message
        res.status(200).json({ message: 'All cookies cleared' });
    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.get('/getCookie', (req, res) => {
    try {
        // Retrieve the "access_token" cookie from the request
        const token = req.cookies.access_token;
 
        if (!token) {
            return res.status(401).json({ error: "Unauthorized - Token not found" });
        }
 
        // Verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
 
        // You can use the decoded information as needed
        const userId = decoded.id;
 
        // Include "access_token=" in the response
        res.status(200).json({
            status: 200,
            message: "Cookie value retrieved successfully",
            data: {
                userId: userId,
                token: "access_token=" + token
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
  


module.exports = router;