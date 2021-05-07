import { expect, haveResource } from "@aws-cdk/assert";
import * as sst from "@serverless-stack/resources";
import MyStack from "../lib/MyStack";

test("Test Stack", () => {
  const app = new sst.App();
  // WHEN
  const stack = new MyStack(app, "test-stack");
  // THEN
  expect(stack).to(haveResource("AWS::Lambda::Function"));
});

//make user1
//login1
//make user2
//login2

//u1 gets themself
//u2 gets themself

//u1 edits their email
//u1 edits phone
//u2 edits username

//(u1)make util
//(u2)make util

//(u1) likes (u2)'s util
//(u2) dislikes (u1)'s util

//u1 gets their liked utils
//u2 gets their utils

//(u1) removes like on (u2)'s util
//(u2) removes dislike on (u1)'s util

//(u1) search for (u2)'s util
//(u2) search for (u1)'s util

//(u2) reports (u1)'s util

//u1 remixes u2's utility
//u1 posts(saves) remix

//u2 edits their utility(load)
//u2 saves their utility(save)

//u1 asks to delete themself
//u1 checks their token
//u1 deletes themself

//u2 deletes their utility


//u2 asks for reset password
//u2 checks token
//u2 resets password