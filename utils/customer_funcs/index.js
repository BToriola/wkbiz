import { getIdToken } from "firebase/auth";
import { BASE_URL } from "../constants"; 
import { FBauth } from "../../configs/firebase-config";
export const getIDtoken = async () => {
  const { currentUser } = FBauth;
  if (!currentUser) return;
  const token = await getIdToken(currentUser, true);
  return token;
};
export const postNote = async (noteText, customer_id) => {
 
  let idToken = await getIDtoken()
  const uid =  FBauth.currentUser?.uid; 
  if (!uid) {
    alert("cant send a note now, pls try again later"); 
    return;
  } 
  try {
    const r = await fetch(BASE_URL + "/customer", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "addNote",
        messageData: { text: noteText },
        customerID: customer_id,
        organizationID: "i0OAsUwlAPnbV5JvnDJX" ,
        myUID: uid,
        idToken: idToken,
      }),
    });
    let r2 = await r.json();
    return ({data: r2, msg:"SUCCESS"})
  } catch (err) {
    return ({error: err.toString(), msg:"ERROR"})
  }
};
