

function checkValidIncVotes (inc_votes){
    if (typeof inc_votes !== "number") {
      return Promise.reject({
        status: 400,
        msg: "Invalid request - must include inc_votes which must be an integer value",
      });
    }
  };

  module.exports = {checkValidIncVotes}