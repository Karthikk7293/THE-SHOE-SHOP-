const serviceSid = "VA56c35df3a92e706995460a970e5c0b9d";
  const Accountsid = "AC9d2c06a8ca68d3aaeed46bf25a8eddf6";
  const authtoken = "ddd1b1220b4de6dbd157a4cc54ede8ac";
  const CLIENT = require("twilio")(Accountsid, authtoken);


exports.generateAndSendOtp = (user, statusCode, res) => {
  
  try {
    CLIENT.verify
      .services(serviceSid)
      .verifications.create({
        to: `+91${user.phone}`,
        channel: "sms",
      })
      .then((response) => {
        res.status(statusCode).json({
          success: true,
          message: "message ayachittind tta !",
        });
      });
  } catch (error) {
    res.status(500).json({
        success:false,
        message:error
    })
  }
};
exports.validateOtp = (user,code,statusCode,res)=>{
    try {
        CLIENT.verify
          .services(serviceSid)
          .verificationChecks.create({
            to: `+91${user.phone}`,
            code: code,
          })
          .then((response) => {
            //   console.log(response);
            res.status(statusCode).json({
              success: true,
              user,
              message: "matte number correct aanuh tta !",
            });
          });
      } catch (error) {
        res.status(500).json({
            success:false,
            message:error
        })
      }

}
